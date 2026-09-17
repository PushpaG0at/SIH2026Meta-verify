import apiClient from './api';
import { MOCK_INSTRUMENTS } from '../utils/mockData';

let localInstruments = [...MOCK_INSTRUMENTS];

/**
 * Normalizes backend Instrument model to guarantee compatibility with all UI components
 */
export function normalizeInstrument(inst) {
  if (!inst) return null;

  const activeCert = inst.certificates && inst.certificates[0];
  const activeApp = inst.applications && inst.applications[0];

  return {
    ...inst,
    // Unified identifiers
    id: inst.id || inst.uin,
    uin: inst.uin || inst.id,
    serialNumber: inst.serialNo || inst.serialNumber || 'N/A',
    serialNo: inst.serialNo || inst.serialNumber || 'N/A',

    // Category / Model / Brand mapping
    instrumentType: inst.category || inst.instrumentType || 'Electronic Weighing Scale',
    category: inst.category || inst.instrumentType || 'ELECTRONIC_WEIGHING_SCALE',
    manufacturer: inst.brand || inst.manufacturer || 'Standard Metrology',
    brand: inst.brand || inst.manufacturer || 'Standard Metrology',
    model: inst.modelNo || inst.model || 'Standard',
    modelNo: inst.modelNo || inst.model || 'Standard',

    // Capacity & Location
    capacity: inst.maxCapacity ? `${inst.maxCapacity} kg` : (inst.capacity || '30 kg'),
    maxCapacity: inst.maxCapacity || 30,
    minCapacity: inst.minCapacity || 0.1,
    leastCount: inst.leastCount || 0.005,
    location: inst.installationAddress || inst.location || 'Commercial Premises',
    installationAddress: inst.installationAddress || inst.location || 'Commercial Premises',

    // Status
    status: inst.currentStatus || inst.status || 'UNVERIFIED',
    currentStatus: inst.currentStatus || inst.status || 'UNVERIFIED',

    // Related entities
    businessName: inst.business?.orgName || inst.business?.name || inst.businessName || 'Commercial Enterprise',
    activeCertificateId: activeCert?.certificateNo || activeCert?.id || inst.activeCertificateId || null,
    certificate: activeCert || null,
    latestApplication: activeApp || null,
    applicationsCount: inst.applications?.length || inst.applicationsCount || 0
  };
}

export const instrumentService = {
  /**
   * Fetch all registered instruments via GET /instruments
   */
  async getInstruments() {
    try {
      const res = await apiClient.get('/instruments');
      const rawList = res.data?.instruments || (Array.isArray(res.data) ? res.data : []);
      if (rawList && rawList.length > 0) {
        return rawList.map(normalizeInstrument);
      }
      return localInstruments.map(normalizeInstrument);
    } catch (error) {
      console.warn('[instrumentService] Real API fetch failed, using local registry fallback:', error.message);
      return localInstruments.map(normalizeInstrument);
    }
  },

  /**
   * Fetch single instrument by ID or UIN via GET /instruments/:id
   */
  async getInstrumentById(id) {
    try {
      const res = await apiClient.get(`/instruments/${id}`);
      const raw = res.data?.instrument || res.data;
      if (raw) {
        return normalizeInstrument(raw);
      }
    } catch (error) {
      console.warn(`[instrumentService] GET /instruments/${id} failed:`, error.message);
    }

    // Local fallback
    const found = localInstruments.find(
      (item) => item.id === id || item.uin === id || item.serialNumber === id || item.serialNo === id
    );
    if (found) {
      return normalizeInstrument(found);
    }
    throw new Error(`Instrument '${id}' not found in registry.`);
  },

  /**
   * Register new instrument via POST /instruments
   */
  async createInstrument(payload) {
    try {
      // Map UI form fields to backend schema
      const backendPayload = {
        category: payload.category || payload.instrumentType || 'ELECTRONIC_WEIGHING_SCALE',
        brand: payload.brand || payload.manufacturer || 'General Metrology',
        modelNo: payload.modelNo || payload.model || 'Standard 2026',
        serialNo: payload.serialNo || payload.serialNumber || `SN-${Date.now().toString().slice(-6)}`,
        maxCapacity: parseFloat(payload.maxCapacity || payload.capacity || 30),
        minCapacity: parseFloat(payload.minCapacity || 0.1),
        leastCount: parseFloat(payload.leastCount || 0.005),
        installationAddress: payload.installationAddress || payload.location || 'Commercial Trade Premises',
        latitude: payload.latitude ? parseFloat(payload.latitude) : 28.6139,
        longitude: payload.longitude ? parseFloat(payload.longitude) : 77.2090
      };

      const res = await apiClient.post('/instruments', backendPayload);
      const created = res.data?.instrument || res.data;
      const normalized = normalizeInstrument(created);

      // Prepend to local cache as well
      localInstruments = [normalized, ...localInstruments];
      return normalized;
    } catch (error) {
      console.warn('[instrumentService] Backend registration failed, preserving local record:', error.message);

      const newId = `MV-INS-${String(Math.floor(100000 + Math.random() * 900000))}`;
      const newInstrument = normalizeInstrument({
        id: newId,
        uin: `IND-LM-2026-${newId.replace('MV-INS-', 'W')}`,
        businessId: 'usr_biz_01',
        businessName: payload.ownerName || 'Sharma Traders & Co.',
        category: payload.category || payload.instrumentType || 'ELECTRONIC_WEIGHING_SCALE',
        brand: payload.manufacturer || payload.brand || 'Digital Scales Inc.',
        modelNo: payload.model || payload.modelNo || 'DS-500',
        serialNo: payload.serialNumber || payload.serialNo || `SN-${Date.now().toString().slice(-6)}`,
        maxCapacity: parseFloat(payload.capacity || 30),
        leastCount: 0.005,
        installationAddress: payload.location || payload.installationAddress || 'Industrial Area, Delhi',
        currentStatus: 'UNVERIFIED',
        applicationsCount: 0
      });

      localInstruments = [newInstrument, ...localInstruments];
      return newInstrument;
    }
  }
};

export default instrumentService;
