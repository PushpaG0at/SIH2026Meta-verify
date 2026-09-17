import apiClient from './api';
import { MOCK_INSPECTION_ASSIGNMENTS } from '../utils/mockData';
import { normalizeApplication } from './applicationService';

let localAssignments = [...MOCK_INSPECTION_ASSIGNMENTS];

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

  return {
    ...insp,
    id: insp.id,
    inspectionId: insp.id,
    applicationId: insp.applicationId || app?.id,

    // Status
    status: insp.completedAt ? 'COMPLETED' : (insp.resultStatus || 'ASSIGNED'),

    // Business & Location
    businessName: biz?.orgName || biz?.name || app?.businessName || 'Sharma Enterprises',
    business: biz,
    location: inst?.location || inst?.installationAddress || 'Delhi Trade Jurisdiction',

    // Instrument
    instrumentType: inst?.instrumentType || 'Electronic Weighing Scale',
    instrument: inst,
    application: app,

    // Checklist & Readings
    checklist: {
      visualInspection: Boolean(insp.visualInspection),
      sealingIntact: Boolean(insp.sealingIntact),
      zeroErrorCheck: Boolean(insp.zeroErrorCheck),
      repeatabilityPass: Boolean(insp.repeatabilityPass)
    },
    testReadings: testReadings.length > 0 ? testReadings : (insp.testReadings || []),
    evidenceHash: insp.evidenceHash || null,
    photoUrl: insp.photoUrl || null,
    latitude: insp.latitude || 28.6139,
    longitude: insp.longitude || 77.2090,
    inspectorNotes: insp.inspectorNotes || '',
    assignedAt: insp.assignedAt || new Date().toISOString(),
    completedAt: insp.completedAt || null
  };
}

export const inspectionService = {
  /**
   * Fetch all assigned inspections via GET /inspections/assigned
   */
  async getAssignments() {
    try {
      const res = await apiClient.get('/inspections/assigned');
      const rawList = res.data?.inspections || (Array.isArray(res.data) ? res.data : []);
      if (rawList && rawList.length > 0) {
        return rawList.map(normalizeInspection);
      }
      return localAssignments.map(normalizeInspection);
    } catch (error) {
      console.warn('[inspectionService] Remote assigned inspections fetch failed, using local cache:', error.message);
      return localAssignments.map(normalizeInspection);
    }
  },

  /**
   * Fetch single inspection assignment by ID
   */
  async getAssignmentById(id) {
    try {
      const res = await apiClient.get(`/inspections/assigned`);
      const rawList = res.data?.inspections || [];
      const found = rawList.find(
        (i) => i.id === id || i.applicationId === id || i.application?.applicationNo === id
      );
      if (found) {
        return normalizeInspection(found);
      }
    } catch (error) {
      console.warn(`[inspectionService] GET /inspections/${id} failed:`, error.message);
    }

    const localFound = localAssignments.find((a) => a.id === id || a.applicationId === id);
    if (localFound) {
      return normalizeInspection(localFound);
    }
    throw new Error(`Inspection assignment '${id}' not found.`);
  },

  /**
   * Submit inspection calibration and cryptographic evidence via POST /inspections/:id/submit-evidence
   */
  async submitInspection(assignmentId, inspectionReport) {
    try {
      const backendPayload = {
        visualInspection: inspectionReport.checklist?.visualInspection ?? true,
        sealingIntact: inspectionReport.checklist?.sealingIntact ?? true,
        zeroErrorCheck: inspectionReport.checklist?.zeroErrorCheck ?? true,
        repeatabilityPass: inspectionReport.checklist?.repeatabilityPass ?? true,
        testReadings: inspectionReport.readings || inspectionReport.testReadings || [],
        photoUrl: inspectionReport.photoUrl || '/uploads/inspection_scale.jpg',
        latitude: inspectionReport.latitude || 28.6139,
        longitude: inspectionReport.longitude || 77.2090,
        inspectorNotes: inspectionReport.notes || inspectionReport.inspectorNotes || 'Field verification completed.'
      };

      const res = await apiClient.post(`/inspections/${assignmentId}/submit-evidence`, backendPayload);

      // Update local cache
      const idx = localAssignments.findIndex((a) => a.id === assignmentId);
      if (idx !== -1) {
        localAssignments[idx] = {
          ...localAssignments[idx],
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          evidenceHash: res.data?.evidenceHash,
          inspectionReport
        };
      }

      return res.data;
    } catch (error) {
      console.warn('[inspectionService] Remote submit-evidence failed, updating local state:', error.message);
      const idx = localAssignments.findIndex((a) => a.id === assignmentId);
      if (idx !== -1) {
        localAssignments[idx] = {
          ...localAssignments[idx],
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          inspectionReport
        };
        return localAssignments[idx];
      }
      return inspectionReport;
    }
  }
};

export default inspectionService;
