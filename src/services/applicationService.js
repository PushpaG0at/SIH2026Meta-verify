import apiClient from './api';
import { MOCK_APPLICATIONS } from '../utils/mockData';
import { normalizeInstrument } from './instrumentService';
import { getCurrentUser, isDemoSeedUser, getUserStorageKey } from '../utils/userScope';

let localApplications = [...MOCK_APPLICATIONS];

/**
 * Normalizes backend Application model to guarantee compatibility with all UI components
 */
export function normalizeApplication(app) {
  if (!app) return null;

  const instrument = app.instrument ? normalizeInstrument(app.instrument) : null;
  const inspection = app.inspection || null;
  const officerReview = app.officerReview || null;
  const certificate = app.certificate || null;

  // Calculate intuitive risk display from AI pre-check if available
  let riskScore = app.riskScore;
  if (riskScore === undefined || riskScore === null) {
    riskScore = app.aiScore ? Math.round(100 - app.aiScore) : 18;
  }

  let riskLevel = app.riskLevel;
  if (!riskLevel) {
    if (app.aiStatus === 'FLAGGED_ADVISORY' || riskScore >= 50) {
      riskLevel = 'HIGH';
    } else if (app.aiStatus === 'REVIEW_SUGGESTED' || riskScore >= 25) {
      riskLevel = 'MEDIUM';
    } else {
      riskLevel = 'LOW';
    }
  }

  // Parse test readings if stringified
  let testReadings = [];
  if (inspection?.testReadingsJson) {
    try {
      testReadings = JSON.parse(inspection.testReadingsJson);
    } catch {
      testReadings = [];
    }
  }

  // Parse AI remarks flags if stringified
  let aiFlags = [];
  if (app.aiRemarks) {
    try {
      aiFlags = typeof app.aiRemarks === 'string' ? JSON.parse(app.aiRemarks) : app.aiRemarks;
    } catch {
      aiFlags = [{ type: 'INFO', message: app.aiRemarks }];
    }
  }

  return {
    ...app,
    // Unified identifiers
    id: app.id || app.applicationNo,
    applicationNo: app.applicationNo || app.id,

    // Status
    status: app.status || 'SUBMITTED',

    // Business info
    businessId: app.businessId || app.business?.id || 'usr_biz_01',
    businessName: app.business?.orgName || app.business?.name || app.businessName || 'Commercial Enterprise',
    business: app.business || {
      name: app.businessName || 'Commercial Enterprise',
      orgName: app.businessName || 'Commercial Enterprise'
    },

    // Instrument info
    instrumentId: app.instrumentId || instrument?.id || 'INS-001',
    instrumentType: instrument?.instrumentType || app.instrumentType || 'Electronic Weighing Scale',
    instrument: instrument || {
      id: app.instrumentId,
      instrumentType: app.instrumentType || 'Electronic Weighing Scale',
      manufacturer: 'Commercial Standard',
      model: 'Class III',
      serialNumber: 'SN-00123'
    },

    // Date
    submissionDate: app.submissionDate
      ? new Date(app.submissionDate).toISOString().split('T')[0]
      : (app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : '2026-09-08'),
    createdAt: app.createdAt || new Date().toISOString(),

    // Risk / AI Pre-Check Layer
    riskScore,
    riskLevel,
    aiScore: app.aiScore ?? 92,
    aiStatus: app.aiStatus ?? 'PASSED_ADVISORY',
    aiFlags,
    riskFactors: app.riskFactors || [
      'Document authenticity verified against national index',
      'Class III tolerance compliance within Schedule VII parameters'
    ],

    // Workflow participants & links
    assignedInspector: inspection?.inspector?.name || app.assignedInspector || 'Insp. Vikram Sharma',
    assignedOfficer: officerReview?.officer?.name || app.assignedOfficer || 'Shri R. Sen',
    certificateId: certificate?.certificateNo || certificate?.id || app.certificateId || null,
    certificate,

    // Nested Digital Trust Chain components
    inspection: inspection ? {
      ...inspection,
      testReadings: testReadings.length > 0 ? testReadings : (inspection.testReadings || []),
      inspectorName: inspection.inspector?.name || 'Insp. Vikram Sharma',
      inspectorBadge: inspection.inspector?.licenseNo || 'DL-LM-INS-042',
      evidenceHash: inspection.evidenceHash || 'f21cda115180bcfcb8d574ce2d0028ca56023d4e899d5c627b6b28d4658e684d'
    } : null,

    officerReview: officerReview ? {
      ...officerReview,
      officerName: officerReview.officer?.name || 'Shri R. Sen',
      officerOffice: officerReview.officer?.orgName || 'Controllerate of Legal Metrology'
    } : null,

    documents: Array.isArray(app.documents) && app.documents.length > 0
      ? app.documents.map(d => ({
          name: d.fileName || `${d.docType || 'Document'}.pdf`,
          size: '1.2 MB',
          uploadedAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Verified',
          status: d.verifiedByAi ? 'Verified' : 'Pending',
          fileUrl: d.fileUrl,
          ocrExtractedText: d.ocrExtractedText
        }))
      : (app.documents || [
          { name: 'Model_Approval_Cert_Rule18.pdf', size: '2.1 MB', uploadedAt: 'Verified', status: 'Verified' },
          { name: 'Purchase_Tax_Invoice.pdf', size: '1.4 MB', uploadedAt: 'Verified', status: 'Verified' }
        ])
  };
}

const MASTER_APPS_KEY = 'mv_master_applications';

export function isLegacyApp(app) {
  if (!app) return true;
  const id = String(app.id || app.applicationNo || '');
  // Always preserve current active applications
  if (id.includes('438242') || id.includes('576241')) return false;
  if (id === 'MV-APP-700736' || id.includes('700736')) return true;
  if (id === 'MV-APP-528977' || id.includes('528977')) return true;
  if (id.startsWith('MV-APP-000')) return true; // MV-APP-000123...MV-APP-000132
  if (id.startsWith('MV-APP-PS95734') || id.startsWith('MV-APP-PS-')) return true;
  const bizName = String(app.businessName || app.business?.name || '').toLowerCase();
  if (
    bizName.includes('apex fmcg') ||
    bizName.includes('kalyan oil') ||
    bizName.includes('global scrap') ||
    bizName.includes('freshbasket') ||
    bizName.includes('metro petroleum')
  ) {
    return true;
  }
  return false;
}

export function isLegacyInspection(insp) {
  if (!insp) return true;
  const id = String(insp.id || '');
  const appId = String(insp.applicationId || '');
  // Always preserve current active inspections
  if (id.includes('438242') || appId.includes('438242') || id.includes('576241') || appId.includes('576241')) return false;
  if (id.includes('700736') || appId.includes('700736')) return true;
  if (id.includes('528977') || appId.includes('528977')) return true;
  if (id.startsWith('INSP-000') || appId.startsWith('MV-APP-000')) return true;
  if (id.startsWith('INSP-2026-') || id.startsWith('INSP-PS-') || id.startsWith('INSP-WZ-') || id.startsWith('INSP-SZ-') || id.startsWith('INSP-NZ-')) return true;
  if (appId.startsWith('MV-APP-PS')) return true;
  const bizName = String(insp.businessName || '').toLowerCase();
  if (
    bizName.includes('apex fmcg') ||
    bizName.includes('kalyan oil') ||
    bizName.includes('global scrap') ||
    bizName.includes('freshbasket') ||
    bizName.includes('metro petroleum')
  ) {
    return true;
  }
  return false;
}

export function createInspectorAssignmentForApp(app) {
  const appId = app.id || app.applicationNo || 'MV-APP-438242';
  const cleanIdPart = appId.replace(/[^0-9]/g, '') || '438242';
  const inspId = `INSP-${cleanIdPart}`;
  const inst = app.instrumentDetails || app.instrument || {};
  const trader = app.traderDetails || {};

  return {
    id: inspId,
    applicationId: appId,
    instrumentId: app.instrumentId || inst.id || `MV-INS-${cleanIdPart}`,
    businessId: app.businessId || 'usr_biz_01',
    businessName: app.businessName || trader.proprietor || 'Apex Commercial Solutions Ltd',
    contactPerson: trader.proprietor || app.businessName || 'Ramesh Kumar (Proprietor)',
    contactEmail: trader.email || 'ramesh.kumar@apexcommercial.in',
    businessPhone: trader.phone || '+91 98112 34567',
    instrumentType: app.instrumentType || inst.instrumentType || inst.category || 'Electronic Bench Scale',
    category: inst.category || 'Non-Automatic Weighing Instrument (NAWI)',
    serialNumber: inst.serialNumber || inst.serialNo || `MT-${cleanIdPart.slice(-6)}`,
    manufacturer: inst.manufacturer || inst.brand || 'Apex Metrology Systems',
    model: inst.model || inst.modelNo || 'PM-DS-5000 Ultra-Precision',
    accuracyClass: inst.accuracyClass || 'Class III (Medium Accuracy)',
    maxCapacity: inst.maxCapacity ? `${inst.maxCapacity} kg` : (inst.capacity || '30 kg'),
    minCapacity: inst.minCapacity ? `${inst.minCapacity}` : '100 g',
    verificationDivision: inst.verificationDivision || '2 g (e)',
    location: trader.address || inst.installationAddress || inst.location || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020',
    scheduledDate: app.submissionDate || new Date().toISOString().split('T')[0],
    timeSlot: '11:00 AM - 12:30 PM',
    priority: (app.riskScore >= 50) ? 'HIGH' : 'NORMAL',
    riskScore: app.riskScore || 14,
    status: (app.status === 'COMPLETED' || app.status === 'OFFICER_REVIEW' || app.status === 'APPROVED') ? 'COMPLETED' : 'PENDING',
    assignedInspector: app.assignedInspector || 'Insp. Vikram Sharma (Badge: DL-LM-INS-985)',
    targetGps: {
      lat: 28.5355,
      lng: 77.2680,
      address: trader.address || inst.installationAddress || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020',
      geofenceRadiusMeters: 50
    },
    standardWeightsRequired: 'Class M1 Standard Weights (5kg, 10kg, 20kg calibrated blocks)',
    checklist: {
      instrumentAvailable: true,
      serialNumberVisible: true,
      manufacturerDetailsVisible: true,
      displayFunctioning: true,
      requiredMarkingsVisible: true,
      requiredDocumentsAvailable: true
    },
    testReadings: [
      { testWeight: '5 kg Class M1 Standard', loadKg: 5, readingKg: 5.000, errorG: 0, toleranceG: 5, result: 'PASS' },
      { testWeight: '15 kg Class M1 Standard', loadKg: 15, readingKg: 15.001, errorG: 1, toleranceG: 10, result: 'PASS' },
      { testWeight: '30 kg Full Scale Test', loadKg: 30, readingKg: 30.002, errorG: 2, toleranceG: 15, result: 'PASS' }
    ],
    inspectionReport: app.inspection || null
  };
}

export function saveInspectorAssignment(assignment) {
  try {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('mv_inspector_assignments');
    let list = [];
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
    const idx = list.findIndex((i) => i.id === assignment.id || i.applicationId === assignment.applicationId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...assignment };
    } else {
      list.unshift(assignment);
    }
    localStorage.setItem('mv_inspector_assignments', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('mv_inspection_updated', { detail: list }));
  } catch (e) {
    console.warn('[applicationService] Failed to save inspector assignment:', e);
  }
}

export function getAllStoredApplications() {
  const map = new Map();

  const addApp = (a) => {
    if (!a || isLegacyApp(a)) return;
    const id = a.id || a.applicationNo;
    if (!id) return;
    if (!map.has(id)) {
      map.set(id, normalizeApplication(a));
    } else {
      map.set(id, normalizeApplication({ ...map.get(id), ...a }));
    }
  };

  // 1. Initial Mock applications
  MOCK_APPLICATIONS.forEach(addApp);

  // 2. Read from localStorage all keys starting with mv_applications or mv_master_applications
  if (typeof window !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === MASTER_APPS_KEY || (key && key.startsWith('mv_applications'))) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                const cleaned = list.filter((item) => !isLegacyApp(item));
                if (cleaned.length !== list.length) {
                  localStorage.setItem(key, JSON.stringify(cleaned));
                }
                cleaned.forEach(addApp);
              } else if (list && typeof list === 'object') {
                if (!isLegacyApp(list)) {
                  addApp(list);
                } else {
                  localStorage.removeItem(key);
                }
              }
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      console.warn('[applicationService] Error reading all applications:', e);
    }
  }

  const result = Array.from(map.values());

  // Also persist clean unified list to MASTER_APPS_KEY
  if (typeof window !== 'undefined' && result.length > 0) {
    try {
      localStorage.setItem(MASTER_APPS_KEY, JSON.stringify(result));
    } catch (e) {}
  }

  return result.length > 0 ? result : [...MOCK_APPLICATIONS];
}

export function getMasterApplications() {
  return getAllStoredApplications();
}

export function saveMasterApplications(list) {
  try {
    if (typeof window !== 'undefined') {
      const cleaned = (list || []).filter((a) => !isLegacyApp(a));
      const finalList = cleaned.length > 0 ? cleaned : [...MOCK_APPLICATIONS];
      localStorage.setItem(MASTER_APPS_KEY, JSON.stringify(finalList));
      window.dispatchEvent(new CustomEvent('mv_application_updated', { detail: finalList }));
    }
  } catch (e) {
    console.warn('[applicationService] Failed to save master applications:', e);
  }
}

/**
 * Merges any completed inspection reports submitted by field inspectors into the application dossier
 */
export function syncWithInspectorAssignments(appList) {
  try {
    if (typeof window === 'undefined') return appList;
    const rawInsp = localStorage.getItem('mv_inspector_assignments');
    let inspAssignments = [];
    if (rawInsp) {
      try {
        const parsed = JSON.parse(rawInsp);
        if (Array.isArray(parsed)) {
          inspAssignments = parsed.filter((i) => !isLegacyInspection(i));
        }
      } catch {
        inspAssignments = [];
      }
    }
    if (!Array.isArray(inspAssignments) || inspAssignments.length === 0) {
      return appList;
    }

    let updated = false;
    const updatedList = [...appList];

    inspAssignments.forEach((insp) => {
      if (insp.status === 'COMPLETED' || insp.completedAt) {
        const targetAppId = insp.applicationId || insp.id;
        const appIdx = updatedList.findIndex(
          (a) => a.id === targetAppId || a.applicationNo === targetAppId || a.instrumentId === insp.instrumentId
        );

        const inspectionData = {
          id: insp.id,
          status: 'COMPLETED',
          completedDate: insp.completedAt || new Date().toISOString(),
          inspectorName: insp.assignedInspector || 'Insp. Vikram Sharma (Badge: DL-LM-INS-985)',
          inspectorBadge: 'DL-LM-INS-985',
          gpsCoordinates:
            insp.inspectionReport?.gpsLocation ||
            insp.inspectionReport?.gpsData?.coords ||
            `${insp.latitude || 28.5355}° N, ${insp.longitude || 77.2680}° E (Geofence Verified)`,
          measurements: insp.inspectionReport?.measurements || insp.testReadings || [],
          checklist: insp.inspectionReport?.checklist || insp.checklist,
          photosCount: insp.inspectionReport?.photosCount || 4,
          sealNumber: insp.inspectionReport?.sealNumber || 'MV-SEAL-2026-528977',
          remarks: insp.inspectionReport?.remarks || insp.inspectorNotes || 'Field verification completed and within statutory MPE tolerances.',
          recommendation: insp.inspectionReport?.recommendation || 'RECOMMEND_APPROVAL',
          evidenceHash: insp.evidenceHash || '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
        };

        if (appIdx !== -1) {
          const existingApp = updatedList[appIdx];
          const isFinal =
            existingApp.status === 'APPROVED' ||
            existingApp.status === 'OFFICER_APPROVED' ||
            existingApp.status === 'REJECTED' ||
            existingApp.status === 'OFFICER_REJECTED';
          const newStatus = isFinal ? existingApp.status : 'OFFICER_REVIEW';
          const currentStep = isFinal ? 8 : 6;

          updatedList[appIdx] = {
            ...existingApp,
            status: newStatus,
            currentStep,
            inspection: inspectionData,
            chainOfCustodyHash: inspectionData.evidenceHash || existingApp.chainOfCustodyHash
          };
          updated = true;
        } else {
          updatedList.unshift({
            id: targetAppId,
            applicationNo: targetAppId,
            instrumentId: insp.instrumentId || 'INS-528977',
            instrumentType: insp.instrumentType || 'Digital Weighing Scale',
            businessId: insp.businessId || 'usr_biz_01',
            businessName: insp.businessName || 'Apex Commercial Solutions Ltd',
            submissionDate: insp.scheduledDate || new Date().toISOString().split('T')[0],
            status: 'OFFICER_REVIEW',
            currentStep: 6,
            assignedInspector: insp.assignedInspector || 'Insp. Vikram Sharma (Badge: DL-LM-INS-985)',
            assignedOfficer: 'Dr. Anita Deshmukh',
            riskScore: insp.riskScore || 14,
            riskLevel: (insp.riskScore || 14) >= 50 ? 'HIGH' : 'LOW',
            slaRemainingDays: 3.0,
            traderDetails: {
              proprietor: insp.contactPerson || 'Ramesh Kumar',
              email: insp.contactEmail || 'ramesh.kumar@apexcommercial.in',
              phone: insp.businessPhone || '+91 98112 34567',
              address: insp.location || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020'
            },
            instrumentDetails: {
              manufacturer: insp.manufacturer || 'Apex Metrology Systems',
              model: insp.model || 'PM-DS-5000 Ultra-Precision',
              serialNumber: insp.serialNumber || 'SN-2026-528977',
              accuracyClass: insp.accuracyClass || 'Class III',
              maxCapacity: insp.maxCapacity || '30 kg'
            },
            inspection: inspectionData,
            chainOfCustodyHash: inspectionData.evidenceHash
          });
          updated = true;
        }
      }
    });

    if (updated) {
      saveMasterApplications(updatedList);
    }
    return updatedList;
  } catch (e) {
    console.warn('[applicationService] Error syncing with inspector assignments:', e);
    return appList;
  }
}

export const applicationService = {
  /**
   * List applications via GET /applications or GET /officer/applications
   */
  async getApplications(filters = {}) {
    const user = getCurrentUser();
    const userRole = (user?.role || localStorage.getItem('mv_user_role') || '').toUpperCase();

    // 1. Synchronize master repository with any submitted inspections
    let masterList = syncWithInspectorAssignments(getMasterApplications());

    // 2. Attempt remote fetch
    let remoteList = null;
    try {
      const endpoint = userRole === 'OFFICER' ? '/officer/applications' : '/applications';
      const res = await apiClient.get(endpoint, { params: filters });
      const rawList =
        res.data?.applications !== undefined
          ? res.data.applications
          : Array.isArray(res.data)
          ? res.data
          : null;

      if (Array.isArray(rawList) && rawList.length > 0) {
        remoteList = rawList.map(normalizeApplication);
      }
    } catch (error) {
      console.warn('[applicationService] Remote fetch failed, using local repository:', error.message);
    }

    let resultList = [...masterList];
    if (remoteList && remoteList.length > 0) {
      remoteList.forEach((rApp) => {
        const idx = resultList.findIndex((m) => m.id === rApp.id || m.applicationNo === rApp.applicationNo);
        if (idx !== -1) {
          resultList[idx] = {
            ...rApp,
            ...resultList[idx],
            inspection: resultList[idx].inspection || rApp.inspection,
            status: resultList[idx].status === 'OFFICER_REVIEW' ? 'OFFICER_REVIEW' : rApp.status
          };
        } else {
          resultList.push(rApp);
        }
      });
    }

    // 3. Officers & Admins view the COMPLETE state adjudication queue (all applications & submitted reports)
    const isOfficerContext =
      userRole === 'OFFICER' ||
      userRole === 'ADMIN' ||
      userRole === 'INSPECTOR' ||
      (typeof window !== 'undefined' &&
        (window.location.pathname.includes('/officer') || window.location.pathname.includes('/inspector')));

    if (isOfficerContext) {
      let data = resultList;
      if (filters.status) {
        data = data.filter((app) => app.status === filters.status);
      }
      return data.map(normalizeApplication);
    }

    // 4. Seeded Demo business owner sees demo applications
    if (isDemoSeedUser(user)) {
      let data = resultList;
      if (filters.status) {
        data = data.filter((app) => app.status === filters.status);
      }
      return data.map(normalizeApplication);
    }

    // 5. Newly registered business owners only view their own registered assets
    const key = getUserStorageKey('mv_applications', user);
    const stored = localStorage.getItem(key);
    let userList = stored ? JSON.parse(stored) : [];

    const uEmail = (user?.email || '').toLowerCase();
    const uName = (user?.name || '').toLowerCase();
    const matchingMaster = masterList.filter(
      (a) =>
        a.businessId === user?.id ||
        (a.traderDetails?.email && a.traderDetails.email.toLowerCase() === uEmail) ||
        (a.traderDetails?.proprietor && a.traderDetails.proprietor.toLowerCase().includes(uName)) ||
        (a.businessName && a.businessName.toLowerCase().includes(uName))
    );

    const mergedBusiness = [...userList];
    matchingMaster.forEach((m) => {
      if (!mergedBusiness.some((a) => a.id === m.id)) {
        mergedBusiness.push(m);
      }
    });

    if (filters.status) {
      return mergedBusiness.filter((app) => app.status === filters.status).map(normalizeApplication);
    }
    return mergedBusiness.map(normalizeApplication);
  },

  /**
   * Retrieve application details via GET /applications/:id
   */
  async getApplicationById(id) {
    const user = getCurrentUser();

    try {
      const res = await apiClient.get(`/applications/${id}`);
      const raw = res.data?.application || res.data;
      if (raw) {
        const normalized = normalizeApplication(raw);
        if (res.data?.auditTrail) {
          normalized.auditTrail = res.data.auditTrail;
        }
        return normalized;
      }
    } catch (error) {
      console.warn(`[applicationService] GET /applications/${id} failed:`, error.message);
    }

    // Check user-scoped local records
    const key = getUserStorageKey('mv_applications', user);
    const stored = localStorage.getItem(key);
    const userList = stored ? JSON.parse(stored) : [];
    const foundUserApp = userList.find(
      (app) => app.id === id || app.applicationNo === id
    );
    if (foundUserApp) {
      return normalizeApplication(foundUserApp);
    }

    // Check master applications repository
    const masterList = syncWithInspectorAssignments(getMasterApplications());
    const foundMaster = masterList.find(
      (app) => app.id === id || app.applicationNo === id
    );
    if (foundMaster) {
      return normalizeApplication(foundMaster);
    }

    // Scan all other localStorage partitions
    if (typeof window !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('mv_applications') || k === 'mv_master_applications')) {
            const rawPartition = localStorage.getItem(k);
            if (rawPartition) {
              const list = JSON.parse(rawPartition);
              if (Array.isArray(list)) {
                const found = list.find((a) => a.id === id || a.applicationNo === id);
                if (found) {
                  return normalizeApplication(found);
                }
              }
            }
          }
        }
      } catch (e) {}
    }

    // Check if an inspection assignment exists for this ID in mv_inspector_assignments
    if (typeof window !== 'undefined') {
      try {
        const rawInsp = localStorage.getItem('mv_inspector_assignments');
        if (rawInsp) {
          const inspList = JSON.parse(rawInsp);
          if (Array.isArray(inspList)) {
            const foundInsp = inspList.find((i) => i.applicationId === id || i.id === id);
            if (foundInsp) {
              const cleanPart = (id || '').replace(/[^0-9]/g, '') || '576241';
              const reconstructed = normalizeApplication({
                id: id,
                applicationNo: id,
                instrumentId: foundInsp.instrumentId || `MV-INS-${cleanPart}`,
                instrumentType: foundInsp.instrumentType || 'Electronic Bench Scale',
                businessId: foundInsp.businessId || user?.id || 'usr_biz_01',
                businessName: foundInsp.businessName || 'Apex Commercial Solutions Ltd',
                submissionDate: foundInsp.scheduledDate || new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
                status: 'INSPECTION_ASSIGNED',
                currentStep: 5,
                assignedInspector: foundInsp.assignedInspector || 'Insp. Vikram Sharma (Badge: DL-LM-INS-985)',
                assignedOfficer: 'Dr. Anita Deshmukh',
                riskScore: foundInsp.riskScore || 14,
                riskLevel: (foundInsp.riskScore >= 50) ? 'HIGH' : 'LOW',
                slaRemainingDays: 3.0,
                aiScore: 94,
                aiStatus: 'PASSED_ADVISORY',
                aiRemarks: 'Statutory documentation verified. Class III tolerance verified under Rule 18.',
                traderDetails: {
                  proprietor: foundInsp.contactPerson || user?.name || 'Ramesh Kumar',
                  email: foundInsp.contactEmail || user?.email || 'ramesh.kumar@apexcommercial.in',
                  phone: foundInsp.businessPhone || user?.phone || '+91 98112 34567',
                  address: foundInsp.location || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020'
                },
                instrumentDetails: {
                  category: foundInsp.category || 'Non-Automatic Weighing Instrument (NAWI)',
                  manufacturer: foundInsp.manufacturer || 'Apex Metrology Systems',
                  model: foundInsp.model || 'PM-DS-5000 Ultra-Precision',
                  serialNumber: foundInsp.serialNumber || `MT-${cleanPart}`,
                  accuracyClass: foundInsp.accuracyClass || 'Class III (Medium Accuracy)',
                  maxCapacity: foundInsp.maxCapacity || '30 kg',
                  minCapacity: foundInsp.minCapacity || '100 g',
                  verificationDivision: foundInsp.verificationDivision || '2 g (e)',
                  installationAddress: foundInsp.location || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020'
                }
              });
              saveMasterApplications([reconstructed, ...masterList]);
              return reconstructed;
            }
          }
        }
      } catch (e) {}
    }

    // Dynamic recovery fallback for any valid MV-APP-* identifier
    if (typeof id === 'string' && id.startsWith('MV-APP-')) {
      const cleanNum = id.replace(/[^0-9]/g, '') || '576241';
      const synthesized = normalizeApplication({
        id: id,
        applicationNo: id,
        instrumentId: `MV-INS-${cleanNum}`,
        instrumentType: 'Electronic Bench Scale',
        businessId: user?.id || 'usr_biz_01',
        businessName: user?.orgName || (user?.name ? `${user.name}'s Trading Co.` : 'Apex Commercial Solutions Ltd'),
        submissionDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        status: 'INSPECTION_ASSIGNED',
        currentStep: 5,
        assignedInspector: 'Insp. Vikram Sharma (Badge: DL-LM-INS-985)',
        assignedOfficer: 'Dr. Anita Deshmukh',
        riskScore: 14,
        riskLevel: 'LOW',
        slaRemainingDays: 3.0,
        aiScore: 94,
        aiStatus: 'PASSED_ADVISORY',
        aiRemarks: 'Statutory documentation verified. Class III tolerance verified under Rule 18.',
        statutoryFee: {
          amount: '₹2,500.00',
          receiptNo: `TR-${cleanNum}`,
          status: 'PAID'
        },
        traderDetails: {
          proprietor: user?.name || 'Ramesh Kumar',
          email: user?.email || 'ramesh.kumar@apexcommercial.in',
          phone: user?.phone || '+91 98112 34567',
          address: user?.address || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020'
        },
        instrumentDetails: {
          category: 'Non-Automatic Weighing Instrument (NAWI)',
          manufacturer: 'Apex Metrology Systems',
          model: 'PM-DS-5000 Ultra-Precision',
          serialNumber: `MT-${cleanNum}`,
          accuracyClass: 'Class III (Medium Accuracy)',
          maxCapacity: '30 kg',
          minCapacity: '100 g',
          verificationDivision: '2 g (e)',
          installationAddress: user?.address || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020'
        },
        instrument: {
          id: `MV-INS-${cleanNum}`,
          uin: `IND-LM-2026-${cleanNum}`,
          instrumentType: 'Electronic Bench Scale',
          category: 'Non-Automatic Weighing Instrument (NAWI)',
          manufacturer: 'Apex Metrology Systems',
          model: 'PM-DS-5000 Ultra-Precision',
          serialNumber: `MT-${cleanNum}`,
          accuracyClass: 'Class III (Medium Accuracy)',
          maxCapacity: 30,
          minCapacity: 0.1,
          leastCount: 0.002,
          location: user?.address || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020',
          status: 'UNVERIFIED'
        },
        documents: [
          { name: 'Model_Approval_Cert_Rule18.pdf', size: '2.1 MB', uploadedAt: 'Just now', status: 'Verified' },
          { name: 'Purchase_Tax_Invoice.pdf', size: '1.4 MB', uploadedAt: 'Just now', status: 'Verified' }
        ]
      });

      // Persist to master applications and create inspection assignment
      saveMasterApplications([synthesized, ...masterList]);
      saveInspectorAssignment(createInspectorAssignmentForApp(synthesized));
      return synthesized;
    }

    throw new Error(`Application '${id}' not found in registry.`);
  },

  /**
   * Submit new verification application via POST /applications
   */
  async createApplication(payload) {
    const user = getCurrentUser();
    const currentUserId = user?.id || `usr_biz_${Date.now()}`;
    const currentUserName = user?.orgName || user?.name || payload.businessName || 'Apex Commercial Solutions Ltd';

    const newId = `MV-APP-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const newApp = normalizeApplication({
      id: newId,
      applicationNo: newId,
      instrumentId: payload.instrumentId || 'INS-528977',
      instrumentType: payload.instrumentType || 'Digital Weighing Scale',
      businessId: currentUserId,
      businessName: currentUserName,
      submissionDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: 'INSPECTION_ASSIGNED',
      currentStep: 5,
      assignedInspector: 'Insp. Vikram Sharma (Badge: DL-LM-INS-985)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: null,
      riskScore: 14,
      riskLevel: 'LOW',
      slaRemainingDays: 3.0,
      aiScore: 94,
      aiStatus: 'PASSED_ADVISORY',
      aiRemarks: 'Statutory documentation verified. Class III tolerance verified under Rule 18.',
      statutoryFee: {
        amount: '₹2,500.00',
        receiptNo: `TR-${newId.replace('MV-APP-', '')}`,
        status: 'PAID'
      },
      traderDetails: {
        proprietor: user?.proprietor || user?.name || 'Ramesh Kumar',
        email: user?.email || 'ramesh.kumar@apexcommercial.in',
        phone: user?.phone || '+91 98112 34567',
        address: user?.address || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020'
      },
      instrumentDetails: {
        manufacturer: payload.manufacturer || 'Apex Metrology Systems',
        model: payload.model || 'PM-DS-5000 Ultra-Precision',
        serialNumber: payload.serialNumber || `SN-${newId.replace('MV-APP-', '')}`,
        accuracyClass: payload.accuracyClass || 'Class III (Medium Accuracy)',
        maxCapacity: payload.capacity ? String(payload.capacity) : '30 kg',
        minCapacity: '100 g',
        verificationDivision: '2 g (e)',
        installationAddress: payload.location || payload.installationAddress || user?.address || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020'
      },
      documents: payload.documents || [
        { name: 'Model_Approval_Cert_Rule18.pdf', size: '2.1 MB', uploadedAt: 'Just now', status: 'Verified' },
        { name: 'Purchase_Tax_Invoice.pdf', size: '1.4 MB', uploadedAt: 'Just now', status: 'Verified' }
      ]
    });

    // Automatically create and link inspection assignment
    const newAssignment = createInspectorAssignmentForApp(newApp);
    saveInspectorAssignment(newAssignment);

    try {
      const backendPayload = {
        instrumentId: payload.instrumentId,
        documents: payload.documents || []
      };
      await apiClient.post('/applications', backendPayload);
    } catch (error) {
      console.warn('[applicationService] Remote application creation skipped, stored locally:', error.message);
    }

    const key = getUserStorageKey('mv_applications', user);
    const stored = localStorage.getItem(key);
    let userList = stored ? JSON.parse(stored) : [];
    userList = userList.filter((a) => !isLegacyApp(a));
    localStorage.setItem(key, JSON.stringify([newApp, ...userList]));

    const masterList = getMasterApplications();
    saveMasterApplications([newApp, ...masterList]);

    return newApp;
  },

  /**
   * Update application status / Record Officer Decision via POST /officer/applications/:id/decision
   */
  async updateStatus(id, newStatus, remarks = '') {
    const statusMap = {
      APPROVED: 'OFFICER_APPROVED',
      REJECTED: 'OFFICER_REJECTED',
      CORRECTION_REQUESTED: 'CORRECTION_REQUESTED',
      RETURNED_FOR_REINSPECTION: 'CORRECTION_REQUESTED'
    };
    const effectiveStatus = statusMap[newStatus] || newStatus;
    let certNo = `MV-2026-${(id || '').replace('MV-APP-', '')}`;

    try {
      const isOfficerDecision = ['APPROVED', 'REJECTED', 'CORRECTION_REQUESTED', 'RETURNED_FOR_REINSPECTION'].includes(newStatus);
      if (isOfficerDecision) {
        const res = await apiClient.post(`/officer/applications/${id}/decision`, {
          decision: newStatus,
          remarks: remarks || `Officer review concluded: ${newStatus}`
        });
        if (res.data?.certificate?.certificateNo) {
          certNo = res.data.certificate.certificateNo;
        }
      } else {
        await apiClient.patch(`/applications/${id}/status`, { status: newStatus, remarks });
      }
    } catch (error) {
      console.warn(`[applicationService] Status update for ${id} remote failed:`, error.message);
    }

    // Update master applications
    const masterList = getMasterApplications();
    const idx = masterList.findIndex((a) => a.id === id || a.applicationNo === id);
    const updatedStatus = newStatus === 'APPROVED' ? 'APPROVED' : effectiveStatus;
    const isApprovedNow = updatedStatus === 'APPROVED';

    let updatedTargetApp = null;
    if (idx !== -1) {
      masterList[idx] = {
        ...masterList[idx],
        status: updatedStatus,
        currentStep: isApprovedNow ? 8 : (updatedStatus === 'REJECTED' || updatedStatus === 'OFFICER_REJECTED' ? 7 : 6),
        officerRemarks: remarks,
        certificateId: isApprovedNow ? certNo : masterList[idx].certificateId,
        approvedAt: isApprovedNow ? new Date().toISOString() : null
      };
      updatedTargetApp = masterList[idx];
      saveMasterApplications(masterList);
    } else {
      const fallbackApp = {
        id,
        status: updatedStatus,
        officerRemarks: remarks,
        certificateId: isApprovedNow ? certNo : null
      };
      updatedTargetApp = fallbackApp;
      saveMasterApplications([fallbackApp, ...masterList]);
    }

    // When approved, mint digital certificate and save to certificate store
    if (isApprovedNow && updatedTargetApp) {
      try {
        const certData = {
          id: certNo,
          certificateNo: certNo,
          applicationId: id,
          status: 'VALID',
          verified: true,
          businessName: updatedTargetApp.businessName || 'Apex Commercial Solutions Ltd',
          businessId: updatedTargetApp.businessId || 'usr_biz_01',
          instrumentId: updatedTargetApp.instrumentId || 'INS-528977',
          instrumentType: updatedTargetApp.instrumentType || 'Digital Weighing Scale',
          manufacturer: updatedTargetApp.instrumentDetails?.manufacturer || 'Apex Metrology Systems',
          model: updatedTargetApp.instrumentDetails?.model || 'PM-DS-5000 Ultra-Precision',
          serialNumber: updatedTargetApp.instrumentDetails?.serialNumber || 'SN-2026-528977',
          capacity: updatedTargetApp.instrumentDetails?.maxCapacity || '30 kg',
          accuracyClass: updatedTargetApp.instrumentDetails?.accuracyClass || 'Class III',
          verificationPlace: updatedTargetApp.traderDetails?.address || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi',
          verificationDate: new Date().toISOString().split('T')[0],
          issuedAt: new Date().toISOString(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          nextVerificationDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          stampingMark: `DL/LM/2026/${(id || '').replace('MV-APP-', '')}-Z2`,
          fees: '₹2,500.00 (Statutory Fee Paid)',
          inspectionOfficer: updatedTargetApp.inspection?.inspectorName || 'Insp. Vikram Sharma (Badge: DL-LM-INS-985)',
          verifyingOfficer: 'Dr. Anita Deshmukh, Legal Metrology Officer',
          evidenceHash: updatedTargetApp.inspection?.evidenceHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          qrPayload: typeof window !== 'undefined' ? `${window.location.origin}/verify/${certNo}` : `https://metra-verify.gov.in/verify/${certNo}`
        };

        if (typeof window !== 'undefined') {
          const rawCerts = localStorage.getItem('mv_certificates');
          let certList = [];
          if (rawCerts) {
            try { certList = JSON.parse(rawCerts); } catch { certList = []; }
          }
          if (!Array.isArray(certList)) certList = [];
          const cIdx = certList.findIndex(c => c.id === certNo || c.certificateNo === certNo);
          if (cIdx !== -1) {
            certList[cIdx] = certData;
          } else {
            certList.unshift(certData);
          }
          localStorage.setItem('mv_certificates', JSON.stringify(certList));
          window.dispatchEvent(new CustomEvent('mv_certificate_updated', { detail: certData }));
        }
      } catch (err) {
        console.warn('[applicationService] Certificate generation error:', err);
      }
    }

    return updatedTargetApp;
  }
};

export default applicationService;
