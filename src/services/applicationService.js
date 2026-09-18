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

export function getMasterApplications() {
  let list = [...MOCK_APPLICATIONS];
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(MASTER_APPS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    }
  } catch (e) {
    console.warn('[applicationService] Failed to read master applications:', e);
  }
  return list;
}

export function saveMasterApplications(list) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTER_APPS_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('mv_application_updated', { detail: list }));
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
        inspAssignments = JSON.parse(rawInsp);
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
          inspectorName: insp.assignedInspector || 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
          inspectorBadge: 'INSP-NZ-4082',
          gpsCoordinates:
            insp.inspectionReport?.gpsLocation ||
            insp.inspectionReport?.gpsData?.coords ||
            `${insp.latitude || 28.6139}° N, ${insp.longitude || 77.2090}° E (Geofence Verified)`,
          measurements: insp.inspectionReport?.measurements || insp.testReadings || [],
          checklist: insp.inspectionReport?.checklist || insp.checklist,
          photosCount: insp.inspectionReport?.photosCount || 4,
          sealNumber: insp.inspectionReport?.sealNumber || 'MV-SEAL-2026-PS95734',
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
            instrumentId: insp.instrumentId || 'MV-INS-001',
            instrumentType: insp.instrumentType || 'Electronic Weighing Scale',
            businessId: insp.businessId || 'usr_biz_01',
            businessName: insp.businessName || 'Singh Legal Metrology & Enterprise Tech',
            submissionDate: insp.scheduledDate || new Date().toISOString().split('T')[0],
            status: 'OFFICER_REVIEW',
            currentStep: 6,
            assignedInspector: insp.assignedInspector || 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
            assignedOfficer: 'Shri R. Sen',
            riskScore: insp.riskScore || 18,
            riskLevel: (insp.riskScore || 18) >= 50 ? 'HIGH' : 'LOW',
            slaRemainingDays: 2.0,
            traderDetails: {
              proprietor: insp.contactPerson || 'Pushpendra Singh',
              email: insp.contactEmail || 'trader@metra-verify.in',
              phone: insp.businessPhone || '+91 95734 00000',
              address: insp.location || 'Plot 24, Cyber Park & Logistics Complex, Sector 18, New Delhi'
            },
            instrumentDetails: {
              manufacturer: insp.manufacturer || 'Pushpa Metrology Tech',
              model: insp.model || 'PM-DS-95734 Ultra-Precision',
              serialNumber: insp.serialNumber || 'PS-SN-9573401',
              accuracyClass: insp.accuracyClass || 'Class III',
              maxCapacity: insp.maxCapacity || '60 kg'
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

    throw new Error(`Application '${id}' not found in registry.`);
  },

  /**
   * Submit new verification application via POST /applications
   */
  async createApplication(payload) {
    const user = getCurrentUser();
    const currentUserId = user?.id || `usr_biz_${Date.now()}`;
    const currentUserName = user?.orgName || user?.name || 'Singh Legal Metrology & Enterprise Tech';

    const newId = `MV-APP-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const newApp = normalizeApplication({
      id: newId,
      applicationNo: newId,
      instrumentId: payload.instrumentId,
      instrumentType: payload.instrumentType || 'Digital Weighing Scale',
      businessId: currentUserId,
      businessName: currentUserName,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
      currentStep: 4,
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      assignedOfficer: 'Shri R. Sen',
      certificateId: null,
      riskScore: 18,
      riskLevel: 'LOW',
      riskFactors: ['Standard NAWI documentation provided', 'Pre-check automated OCR validated'],
      documents: payload.documents || [
        { name: 'Model_Approval_Certificate.pdf', size: '1.8 MB', uploadedAt: 'Just now', status: 'Verified' },
        { name: 'Instrument_Purchase_Invoice.pdf', size: '1.2 MB', uploadedAt: 'Just now', status: 'Verified' }
      ]
    });

    try {
      const backendPayload = {
        instrumentId: payload.instrumentId,
        documents: payload.documents || []
      };

      const res = await apiClient.post('/applications', backendPayload);
      const created = res.data?.application || res.data;
      if (created) {
        const normalized = normalizeApplication(created);
        const key = getUserStorageKey('mv_applications', user);
        const stored = localStorage.getItem(key);
        const userList = stored ? JSON.parse(stored) : [];
        localStorage.setItem(key, JSON.stringify([normalized, ...userList]));

        const masterList = getMasterApplications();
        saveMasterApplications([normalized, ...masterList]);

        return normalized;
      }
    } catch (error) {
      console.warn('[applicationService] Remote application creation failed, saving to local repository:', error.message);
    }

    const key = getUserStorageKey('mv_applications', user);
    const stored = localStorage.getItem(key);
    const userList = stored ? JSON.parse(stored) : [];
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

    if (idx !== -1) {
      masterList[idx] = {
        ...masterList[idx],
        status: updatedStatus,
        currentStep: updatedStatus === 'APPROVED' ? 8 : (updatedStatus === 'REJECTED' || updatedStatus === 'OFFICER_REJECTED' ? 7 : 6),
        officerRemarks: remarks,
        certificateId: updatedStatus === 'APPROVED' ? certNo : masterList[idx].certificateId,
        approvedAt: updatedStatus === 'APPROVED' ? new Date().toISOString() : null
      };
      saveMasterApplications(masterList);
      return masterList[idx];
    }

    const fallbackApp = {
      id,
      status: updatedStatus,
      officerRemarks: remarks,
      certificateId: updatedStatus === 'APPROVED' ? certNo : null
    };
    saveMasterApplications([fallbackApp, ...masterList]);
    return fallbackApp;
  }
};

export default applicationService;
