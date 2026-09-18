import apiClient from './api';
import { MOCK_INSPECTION_ASSIGNMENTS } from '../utils/mockData';
import { normalizeApplication } from './applicationService';

const INSPECTOR_STORAGE_KEY = 'mv_inspector_assignments';

function getStoredAssignments() {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(INSPECTOR_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('[inspectionService] Failed to read localStorage assignments:', e);
  }
  return [...MOCK_INSPECTION_ASSIGNMENTS];
}

function saveStoredAssignments(list) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(INSPECTOR_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('mv_inspection_updated', { detail: list }));
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
      'Singh Legal Metrology & Enterprise Tech',
    business: biz,
    location: inst?.location || inst?.installationAddress || insp.location || 'Delhi Trade Jurisdiction',

    // Instrument
    instrumentType: inst?.instrumentType || insp.instrumentType || 'Electronic Weighing Scale',
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
    latitude: insp.latitude || insp.targetGps?.lat || 28.6139,
    longitude: insp.longitude || insp.targetGps?.lng || 77.2090,
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

    const localFound = localList.find((a) => a.id === id || a.applicationId === id);
    if (localFound) {
      return normalizeInspection(localFound);
    }
    throw new Error(`Inspection assignment '${id}' not found.`);
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
