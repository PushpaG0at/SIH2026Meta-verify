import apiClient from './api';
import { MOCK_INSPECTION_ASSIGNMENTS } from '../utils/mockData';
import {
  normalizeApplication,
  getMasterApplications,
  saveMasterApplications,
  syncWithInspectorAssignments,
  isLegacyApp,
  isLegacyInspection,
  createInspectorAssignmentForApp
} from './applicationService';

const INSPECTOR_STORAGE_KEY = 'mv_inspector_assignments';

function getStoredAssignments() {
  let list = [];
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(INSPECTOR_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            list = parsed.filter((i) => !isLegacyInspection(i));
          }
        } catch {
          list = [];
        }
      }

      // Always ensure mock inspection assignments are in the list if not already present
      MOCK_INSPECTION_ASSIGNMENTS.forEach((mockInsp) => {
        if (!isLegacyInspection(mockInsp)) {
          const cleanNum = String(mockInsp.id || mockInsp.applicationId || '').replace(/[^0-9]/g, '');
          const exists = list.some((i) =>
            i.id === mockInsp.id ||
            i.applicationId === mockInsp.applicationId ||
            (cleanNum && cleanNum.length >= 4 && i.id && i.id.includes(cleanNum))
          );
          if (!exists) {
            list.push(mockInsp);
          }
        }
      });

      // Auto-sync with master applications: ensure any active application has an inspection assignment
      try {
        const masterApps = getMasterApplications();
        masterApps.forEach((app) => {
          if (!app || isLegacyApp(app)) return;
          const isFinished = app.status === 'APPROVED' || app.status === 'REJECTED' || app.status === 'OFFICER_REJECTED';
          const appId = app.id || app.applicationNo;
          const cleanNum = String(appId).replace(/[^0-9]/g, '');
          const exists = list.some((i) =>
            i.applicationId === appId ||
            i.id === appId ||
            (cleanNum && cleanNum.length >= 4 && i.id && i.id.includes(cleanNum))
          );
          if (!exists && !isFinished) {
            const newAssignment = createInspectorAssignmentForApp(app);
            list.unshift(newAssignment);
          }
        });
      } catch (e) {
        console.warn('[inspectionService] Auto-sync with master apps failed:', e);
      }

      // Final strict filter: ensure no legacy items ever survive
      list = list.filter((i) => !isLegacyInspection(i));

      // If empty, fall back to non-legacy mock assignments
      if (list.length === 0) {
        list = MOCK_INSPECTION_ASSIGNMENTS.filter((i) => !isLegacyInspection(i));
      }

      localStorage.setItem(INSPECTOR_STORAGE_KEY, JSON.stringify(list));
    } else {
      list = MOCK_INSPECTION_ASSIGNMENTS.filter((i) => !isLegacyInspection(i));
    }
  } catch (e) {
    console.warn('[inspectionService] Failed to read localStorage assignments:', e);
    list = MOCK_INSPECTION_ASSIGNMENTS.filter((i) => !isLegacyInspection(i));
  }
  return list;
}

function saveStoredAssignments(list) {
  try {
    if (typeof window !== 'undefined') {
      const cleaned = (list || []).filter((i) => !isLegacyInspection(i));
      const finalList = cleaned.length > 0 ? cleaned : MOCK_INSPECTION_ASSIGNMENTS.filter((i) => !isLegacyInspection(i));
      localStorage.setItem(INSPECTOR_STORAGE_KEY, JSON.stringify(finalList));
      window.dispatchEvent(new CustomEvent('mv_inspection_updated', { detail: finalList }));
      try {
        const syncedApps = syncWithInspectorAssignments(getMasterApplications());
        saveMasterApplications(syncedApps);
      } catch (err) {
        console.warn('[inspectionService] Auto-sync with master applications error:', err);
      }
    }
  } catch (e) {
    console.warn('[inspectionService] Failed to save localStorage assignments:', e);
  }
}

/**
 * Normalizes backend Inspection model to match inspector portal components
 */
export function normalizeInspection(insp) {
  if (!insp) return null;

  const app = insp.application ? normalizeApplication(insp.application) : null;
  const inst = app?.instrument || insp.instrument || null;
  const biz = app?.business || null;

  let testReadings = [];
  if (insp.testReadingsJson) {
    try {
      testReadings = JSON.parse(insp.testReadingsJson);
    } catch {
      testReadings = [];
    }
  }

  const isCompleted = Boolean(
    insp.completedAt ||
    insp.status === 'COMPLETED' ||
    insp.status === 'INSPECTION_COMPLETED' ||
    insp.resultStatus === 'PASSED'
  );

  return {
    ...insp,
    id: insp.id,
    inspectionId: insp.id,
    applicationId: insp.applicationId || app?.id,

    // Status: Preserve PENDING for uncompleted inspections
    status: isCompleted ? 'COMPLETED' : 'PENDING',

    // Business & Location: Prioritize insp.businessName
    businessName:
      insp.businessName ||
      biz?.orgName ||
      biz?.name ||
      app?.businessName ||
      'Apex Commercial Solutions Ltd',
    business: biz,
    location: inst?.location || inst?.installationAddress || insp.location || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020',

    // Instrument
    instrumentType: inst?.instrumentType || insp.instrumentType || 'Electronic Bench Scale',
    instrument: inst,
    application: app,

    // Checklist & Readings
    checklist: insp.checklist || {
      visualInspection: Boolean(insp.visualInspection),
      sealingIntact: Boolean(insp.sealingIntact),
      zeroErrorCheck: Boolean(insp.zeroErrorCheck),
      repeatabilityPass: Boolean(insp.repeatabilityPass)
    },
    testReadings: testReadings.length > 0 ? testReadings : (insp.testReadings || []),
    inspectionReport: insp.inspectionReport || null,
    evidenceHash: insp.evidenceHash || null,
    photoUrl: insp.photoUrl || null,
    latitude: insp.latitude || insp.targetGps?.lat || 28.5355,
    longitude: insp.longitude || insp.targetGps?.lng || 77.2680,
    inspectorNotes: insp.inspectorNotes || insp.remarks || '',
    assignedAt: insp.assignedAt || new Date().toISOString(),
    completedAt: insp.completedAt || (isCompleted ? new Date().toISOString() : null)
  };
}

export const inspectionService = {
  /**
   * Fetch all assigned inspections via GET /inspections/assigned
   */
  async getAssignments() {
    const localList = getStoredAssignments();
    try {
      const res = await apiClient.get('/inspections/assigned');
      const rawList = res.data?.inspections || (Array.isArray(res.data) ? res.data : []);
      if (rawList && rawList.length > 0) {
        // Overlay any locally completed inspection records
        const merged = rawList.map((item) => {
          const localMatch = localList.find((l) => l.id === item.id || l.applicationId === item.applicationId);
          if (localMatch && (localMatch.status === 'COMPLETED' || localMatch.completedAt)) {
            return { ...item, ...localMatch };
          }
          return item;
        });
        return merged.map(normalizeInspection);
      }
      return localList.map(normalizeInspection);
    } catch (error) {
      console.warn('[inspectionService] Remote assigned inspections fetch failed, using local cache:', error.message);
      return localList.map(normalizeInspection);
    }
  },

  /**
   * Fetch single inspection assignment by ID
   */
  async getAssignmentById(id) {
    const localList = getStoredAssignments();
    try {
      const res = await apiClient.get(`/inspections/assigned`);
      const rawList = res.data?.inspections || [];
      const found = rawList.find(
        (i) => i.id === id || i.applicationId === id || i.application?.applicationNo === id
      );
      if (found) {
        const localMatch = localList.find((l) => l.id === id || l.applicationId === id);
        return normalizeInspection({ ...found, ...(localMatch || {}) });
      }
    } catch (error) {
      console.warn(`[inspectionService] GET /inspections/${id} failed:`, error.message);
    }

    const cleanNum = (id || '').replace(/[^0-9]/g, '');
    const localFound = localList.find(
      (a) => a.id === id || a.applicationId === id || (cleanNum && a.id?.includes(cleanNum))
    );
    if (localFound) {
      return normalizeInspection(localFound);
    }

    // Dynamic lookup in master applications
    try {
      const masterApps = getMasterApplications();
      const matchedApp = masterApps.find(
        (a) => a.id === id || a.applicationNo === id || (cleanNum && (a.id?.includes(cleanNum) || a.applicationNo?.includes(cleanNum)))
      );
      if (matchedApp) {
        const newAssignment = createInspectorAssignmentForApp(matchedApp);
        saveStoredAssignments([newAssignment, ...localList]);
        return normalizeInspection(newAssignment);
      }
    } catch (e) {}

    if (localList.length > 0) {
      return normalizeInspection(localList[0]);
    }

    return normalizeInspection(MOCK_INSPECTION_ASSIGNMENTS[0]);
  },

  /**
   * Submit inspection calibration and cryptographic evidence via POST /inspections/:id/submit-evidence
   */
  async submitInspection(assignmentId, inspectionReport) {
    const currentList = [...getStoredAssignments()];
    const idx = currentList.findIndex((a) => a.id === assignmentId || a.applicationId === assignmentId);

    try {
      // Map measurements array to backend testReadings format
      const rawList = inspectionReport.measurements || inspectionReport.readings || inspectionReport.testReadings || [];
      const mappedReadings = rawList.map((m) => ({
        testWeightKg: Number(m.loadKg !== undefined ? m.loadKg : (m.testWeightKg || 0)),
        indicatedWeightKg: Number(m.readingKg !== undefined ? m.readingKg : (m.indicatedWeightKg || 0))
      }));

      let lat = inspectionReport.latitude;
      let lng = inspectionReport.longitude;
      if (!lat && inspectionReport.gpsData?.coords) {
        const parts = inspectionReport.gpsData.coords.replace(/[^0-9.,-]/g, '').split(',');
        if (parts.length >= 2) {
          lat = parseFloat(parts[0]);
          lng = parseFloat(parts[1]);
        }
      }

      const backendPayload = {
        visualInspection: inspectionReport.checklist?.visualInspection ?? true,
        sealingIntact: inspectionReport.checklist?.sealingIntact ?? true,
        zeroErrorCheck: inspectionReport.checklist?.zeroErrorCheck ?? true,
        repeatabilityPass: inspectionReport.checklist?.repeatabilityPass ?? true,
        testReadings: mappedReadings,
        photoUrl: inspectionReport.photoUrl || '/uploads/sample_inspection_scale.jpg',
        latitude: lat || 28.6139,
        longitude: lng || 77.2090,
        inspectorNotes: inspectionReport.notes || inspectionReport.inspectorNotes || inspectionReport.remarks || 'Field verification completed.'
      };

      const res = await apiClient.post(`/inspections/${assignmentId}/submit-evidence`, backendPayload);

      // Persist to local storage
      const updatedItem = {
        ...(idx !== -1 ? currentList[idx] : {}),
        id: assignmentId,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        evidenceHash: res.data?.evidenceHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        inspectionReport: {
          ...inspectionReport,
          measurements: rawList,
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        }
      };

      if (idx !== -1) {
        currentList[idx] = updatedItem;
      } else {
        currentList.push(updatedItem);
      }
      saveStoredAssignments(currentList);

      return res.data;
    } catch (error) {
      console.warn('[inspectionService] Remote submit-evidence failed, updating local state:', error.message);
      const updatedItem = {
        ...(idx !== -1 ? currentList[idx] : {}),
        id: assignmentId,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        evidenceHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        inspectionReport: {
          ...inspectionReport,
          measurements: inspectionReport.measurements || inspectionReport.readings || [],
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        }
      };

      if (idx !== -1) {
        currentList[idx] = updatedItem;
      } else {
        currentList.push(updatedItem);
      }
      saveStoredAssignments(currentList);

      return updatedItem;
    }
  }
};

export default inspectionService;
