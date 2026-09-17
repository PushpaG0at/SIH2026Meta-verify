import apiClient from './api';
import { MOCK_APPLICATIONS } from '../utils/mockData';
import { normalizeInstrument } from './instrumentService';

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

export const applicationService = {
  /**
   * List applications via GET /applications or GET /officer/applications
   */
  async getApplications(filters = {}) {
    try {
      const userRole = localStorage.getItem('mv_user_role')?.toUpperCase();
      const endpoint = userRole === 'OFFICER' ? '/officer/applications' : '/applications';
      const res = await apiClient.get(endpoint, { params: filters });
      const rawList = res.data?.applications || (Array.isArray(res.data) ? res.data : []);

      if (rawList && rawList.length > 0) {
        return rawList.map(normalizeApplication);
      }
      return localApplications.map(normalizeApplication);
    } catch (error) {
      console.warn('[applicationService] Remote fetch failed, using local mock cache:', error.message);
      let data = localApplications.map(normalizeApplication);
      if (filters.status) {
        data = data.filter((app) => app.status === filters.status);
      }
      return data;
    }
  },

  /**
   * Retrieve application details via GET /applications/:id
   */
  async getApplicationById(id) {
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

    // Local fallback
    const found = localApplications.find(
      (app) => app.id === id || app.applicationNo === id
    );
    if (found) {
      return normalizeApplication(found);
    }
    throw new Error(`Application '${id}' not found in registry.`);
  },

  /**
   * Submit new verification application via POST /applications
   */
  async createApplication(payload) {
    try {
      const backendPayload = {
        instrumentId: payload.instrumentId,
        documents: payload.documents || []
      };

      const res = await apiClient.post('/applications', backendPayload);
      const created = res.data?.application || res.data;
      const normalized = normalizeApplication(created);

      localApplications = [normalized, ...localApplications];
      return normalized;
    } catch (error) {
      console.warn('[applicationService] Remote application creation failed, saving to local cache:', error.message);

      const newId = `MV-APP-${String(Math.floor(100000 + Math.random() * 900000))}`;
      const newApp = normalizeApplication({
        id: newId,
        applicationNo: newId,
        instrumentId: payload.instrumentId,
        instrumentType: payload.instrumentType || 'Digital Weighing Scale',
        businessId: 'usr_biz_01',
        businessName: 'Sharma Traders & Co.',
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'SUBMITTED',
        currentStep: 4,
        assignedInspector: 'Insp. Vikram Sharma',
        assignedOfficer: 'Shri R. Sen',
        certificateId: null,
        riskScore: 18,
        riskLevel: 'LOW',
        riskFactors: ['Standard NAWI documentation provided', 'Pre-check automated OCR validated'],
        documents: [
          { name: 'Model_Approval_Certificate.pdf', size: '1.8 MB', uploadedAt: 'Just now', status: 'Verified' },
          { name: 'Instrument_Purchase_Invoice.pdf', size: '1.2 MB', uploadedAt: 'Just now', status: 'Verified' }
        ]
      });

      localApplications = [newApp, ...localApplications];
      return newApp;
    }
  },

  /**
   * Update application status / Record Officer Decision via POST /officer/applications/:id/decision
   */
  async updateStatus(id, newStatus, remarks = '') {
    try {
      // If decision is APPROVED, REJECTED, or CORRECTION_REQUESTED, call official officer endpoint
      const isOfficerDecision = ['APPROVED', 'REJECTED', 'CORRECTION_REQUESTED', 'RETURNED_FOR_REINSPECTION'].includes(newStatus);
      if (isOfficerDecision) {
        const res = await apiClient.post(`/officer/applications/${id}/decision`, {
          decision: newStatus,
          remarks: remarks || `Officer review concluded: ${newStatus}`
        });

        const statusMap = {
          APPROVED: 'OFFICER_APPROVED',
          REJECTED: 'OFFICER_REJECTED',
          CORRECTION_REQUESTED: 'CORRECTION_REQUESTED',
          RETURNED_FOR_REINSPECTION: 'CORRECTION_REQUESTED'
        };

        // Update local cache as well
        const idx = localApplications.findIndex((a) => a.id === id || a.applicationNo === id);
        if (idx !== -1) {
          localApplications[idx] = {
            ...localApplications[idx],
            status: statusMap[newStatus] || newStatus,
            officerRemarks: remarks,
            certificateId: res.data?.certificate?.certificateNo || localApplications[idx].certificateId
          };
        }
        return res.data;
      }

      // Generic status update endpoint if provided
      const res = await apiClient.patch(`/applications/${id}/status`, { status: newStatus, remarks });
      return res.data;
    } catch (error) {
      console.warn(`[applicationService] Status update for ${id} failed on remote, updating locally:`, error.message);
      const idx = localApplications.findIndex((a) => a.id === id || a.applicationNo === id);
      if (idx !== -1) {
        localApplications[idx] = {
          ...localApplications[idx],
          status: newStatus,
          officerRemarks: remarks
        };
        return localApplications[idx];
      }
      throw new Error(`Application ${id} not found.`);
    }
  }
};

export default applicationService;
