import apiClient from './api';
import { MOCK_CERTIFICATES } from '../utils/mockData';

let localCertificates = [...MOCK_CERTIFICATES];

/**
 * Normalizes backend Certificate model and /public/verify responses
 */
export function normalizeCertificate(raw) {
  if (!raw) return null;

  // Handle both flat certificate object and nested /public/verify response
  const certObj = raw.certificate || raw;
  const instObj = raw.instrument || raw.application?.instrument || {};
  const bizObj = raw.business || instObj.business || {};
  const inspObj = raw.inspectionEvidence || raw.application?.inspection || {};
  const officerObj = raw.officerSignOff || raw.application?.officerReview || {};
  const trustChainObj = raw.trustChain || {};

  const certId = certObj.certificateNo || certObj.id || raw.id || 'METRA-CERT-2026-104928';
  const issueDate = certObj.issuedAt || certObj.verificationDate || raw.verificationDate || '2026-08-26';
  const validUntil = certObj.validUntil || certObj.nextVerificationDue || raw.nextVerificationDue || '2027-08-26';
  const evidenceHash = certObj.evidenceHash || raw.securityHash || 'f21cda115180bcfcb8d574ce2d0028ca56023d4e899d5c627b6b28d4658e684d';

  return {
    ...raw,
    // Unified identifiers
    id: certId,
    certificateNo: certId,

    // Status
    status: raw.status || certObj.status || 'VALID',
    verified: raw.verified !== undefined ? raw.verified : true,

    // Business details
    businessName: bizObj.orgName || bizObj.name || raw.businessName || 'Commercial Enterprise',
    business: {
      name: bizObj.name || bizObj.orgName || 'Commercial Enterprise',
      orgName: bizObj.orgName || bizObj.name || 'Commercial Enterprise'
    },

    // Instrument details
    instrumentId: instObj.uin || instObj.id || raw.instrumentId || 'INS-001',
    instrumentType: instObj.category || instObj.instrumentType || raw.instrumentType || 'Electronic Weighing Scale',
    manufacturer: instObj.brand || instObj.manufacturer || raw.manufacturer || 'Commercial Metrology',
    brand: instObj.brand || instObj.manufacturer || raw.manufacturer || 'Commercial Metrology',
    model: instObj.modelNo || instObj.model || raw.model || 'Commercial Class III',
    modelNo: instObj.modelNo || instObj.model || raw.model || 'Commercial Class III',
    serialNumber: instObj.serialNo || instObj.serialNumber || raw.serialNumber || 'SN-00123',
    serialNo: instObj.serialNo || instObj.serialNumber || raw.serialNumber || 'SN-00123',
    capacity: instObj.maxCapacity ? `${instObj.maxCapacity} kg` : (raw.capacity || '30 kg'),
    accuracyClass: instObj.leastCount ? `Class III (e = ${instObj.leastCount} kg)` : (raw.accuracyClass || 'Class III (e = 5 g)'),
    verificationPlace: instObj.installationAddress || raw.verificationPlace || 'Delhi Trade Jurisdiction',

    // Dates
    verificationDate: typeof issueDate === 'string' ? issueDate.split('T')[0] : '2026-08-26',
    issuedAt: issueDate,
    nextVerificationDue: typeof validUntil === 'string' ? validUntil.split('T')[0] : '2027-08-26',
    validUntil: validUntil,

    // Official markings & officers
    stampingMark: certObj.stampingCode || raw.stampingMark || 'DL/LM/2026/042-Z2',
    fees: raw.fees || 'Rs. 500.00 (Standard Verification Fee under Rule 14)',
    inspectionOfficer: inspObj.inspectorName || inspObj.inspector?.name || raw.inspectionOfficer || 'Insp. Vikram Sharma (Badge #DL-LM-INS-042)',
    verifyingOfficer: officerObj.officerName || officerObj.officer?.name || raw.verifyingOfficer || 'Shri R. Sen, Legal Metrology Officer',
    securityHash: evidenceHash,
    evidenceHash: evidenceHash,
    qrPayload: certObj.qrPayload || (typeof window !== 'undefined' ? `${window.location.origin}/verify/${certId}` : `https://metra-verify.gov.in/verify/${certId}`),

    // Nested Digital Trust Chain components
    certificate: certObj,
    instrument: instObj,
    inspectionEvidence: inspObj,
    officerSignOff: officerObj,
    trustChain: trustChainObj
  };
}

export const certificateService = {
  /**
   * List certificates via GET /certificates
   */
  async getCertificates() {
    try {
      const res = await apiClient.get('/certificates');
      const list = res.data?.certificates || (Array.isArray(res.data) ? res.data : []);
      if (list && list.length > 0) {
        return list.map(normalizeCertificate);
      }
      return localCertificates.map(normalizeCertificate);
    } catch (error) {
      console.warn('[certificateService] Remote certificates fetch failed, using local cache:', error.message);
      return localCertificates.map(normalizeCertificate);
    }
  },

  /**
   * Retrieve single certificate details via GET /certificates/:id
   */
  async getCertificateById(id) {
    if (!id) return null;
    const cleanId = id.trim();

    try {
      const res = await apiClient.get(`/certificates/${encodeURIComponent(cleanId)}`);
      const cert = res.data?.certificate || res.data;
      if (cert) {
        return normalizeCertificate(cert);
      }
    } catch (error) {
      console.warn(`[certificateService] GET /certificates/${cleanId} failed:`, error.message);
    }

    // Try public verify endpoint
    try {
      const pubRes = await apiClient.get(`/public/verify/${encodeURIComponent(cleanId)}`);
      if (pubRes.data) {
        return normalizeCertificate(pubRes.data);
      }
    } catch {
      // ignore
    }

    // Local fallback
    const found = localCertificates.find(
      (c) => c.id.toUpperCase() === cleanId.toUpperCase() || c.certificateNo?.toUpperCase() === cleanId.toUpperCase()
    );
    return found ? normalizeCertificate(found) : null;
  },

  /**
   * Public certificate verification endpoint via GET /public/verify/:query
   */
  async verifyPublicCertificate(query) {
    if (!query) return null;
    const cleanQuery = query.trim();

    try {
      const res = await apiClient.get(`/public/verify/${encodeURIComponent(cleanQuery)}`);
      if (res.data) {
        return normalizeCertificate(res.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Explicit not found from backend registry
        return null;
      }
      console.warn(`[certificateService] Public verify remote call error:`, error.message);
    }

    // Local fallback
    const found = localCertificates.find(
      (c) =>
        c.id.toUpperCase() === cleanQuery.toUpperCase() ||
        c.certificateNo?.toUpperCase() === cleanQuery.toUpperCase() ||
        c.serialNumber?.toUpperCase() === cleanQuery.toUpperCase()
    );
    return found ? normalizeCertificate(found) : null;
  }
};

export default certificateService;
