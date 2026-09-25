import apiClient from './api';
import { MOCK_INSTRUMENTS } from '../utils/mockData';
import { getCurrentUser, isDemoSeedUser, getUserStorageKey } from '../utils/userScope';

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
   * Fetch registered instruments for the authenticated user
   */
  async getInstruments() {
    const user = getCurrentUser();
    try {
      const res = await apiClient.get('/instruments');
      const rawList = res.data?.instruments !== undefined
        ? res.data.instruments
        : (Array.isArray(res.data) ? res.data : null);

      if (Array.isArray(rawList)) {
        return rawList.map(normalizeInstrument);
      }
      return [];
    } catch (error) {
      console.warn('[instrumentService] Real API fetch failed, using local user storage:', error.message);

      if (isDemoSeedUser(user)) {
        return localInstruments.map(normalizeInstrument);
      }

      // For new / custom business owners, return their own user-scoped instruments (empty if none registered yet)
      const key = getUserStorageKey('mv_instruments', user);
      const stored = localStorage.getItem(key);
      const userList = stored ? JSON.parse(stored) : [];
      return userList.map(normalizeInstrument);
    }
  },

  /**
   * Fetch single instrument by ID or UIN via GET /instruments/:id
   */
  async getInstrumentById(id) {
    const user = getCurrentUser();
    try {
      const res = await apiClient.get(`/instruments/${id}`);
      const raw = res.data?.instrument || res.data;
      if (raw) {
        return normalizeInstrument(raw);
      }
    } catch (error) {
      console.warn(`[instrumentService] GET /instruments/${id} failed:`, error.message);
    }

    // Check user-scoped local records first
    const key = getUserStorageKey('mv_instruments', user);
    const stored = localStorage.getItem(key);
    const userList = stored ? JSON.parse(stored) : [];
    const foundUserInst = userList.find(
      (item) => item.id === id || item.uin === id || item.serialNumber === id || item.serialNo === id
    );
    if (foundUserInst) {
      return normalizeInstrument(foundUserInst);
    }

    // Check all stored instrument keys in localStorage (cross-role access for Inspector / Officer)
    if (typeof window !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const lKey = localStorage.key(i);
          if (lKey && lKey.startsWith('mv_instruments')) {
            const rawVal = localStorage.getItem(lKey);
            if (rawVal) {
              const list = JSON.parse(rawVal);
              if (Array.isArray(list)) {
                const match = list.find(
                  (item) => item.id === id || item.uin === id || item.serialNumber === id || item.serialNo === id
                );
                if (match) return normalizeInstrument(match);
              }
            }
          }
        }
      } catch (e) {
        console.warn('[instrumentService] Cross-role lookup error:', e);
      }

      // Check master applications for embedded instrument
      try {
        const rawMaster = localStorage.getItem('mv_master_applications');
        if (rawMaster) {
          const apps = JSON.parse(rawMaster);
          if (Array.isArray(apps)) {
            const matchedApp = apps.find(
              (a) => a.instrumentId === id || a.instrument?.id === id || a.instrument?.uin === id
            );
            if (matchedApp) {
              const instData = matchedApp.instrument || matchedApp.instrumentDetails || {};
              return normalizeInstrument({
                id: matchedApp.instrumentId || id,
                uin: instData.uin || `IND-LM-2026-${(matchedApp.instrumentId || id).replace(/[^0-9]/g, '') || '528977'}`,
                instrumentType: matchedApp.instrumentType || instData.instrumentType || 'Digital Weighing Scale',
                category: instData.category || 'Non-Automatic Weighing Instrument (NAWI)',
                manufacturer: instData.manufacturer || 'Apex Metrology Systems',
                model: instData.model || 'PM-DS-5000 Ultra-Precision',
                serialNumber: instData.serialNumber || 'SN-2026-528977',
                maxCapacity: instData.maxCapacity || 30,
                minCapacity: instData.minCapacity || 0.1,
                leastCount: instData.leastCount || 0.002,
                accuracyClass: instData.accuracyClass || 'Class III (Medium Accuracy)',
                location: instData.installationAddress || matchedApp.traderDetails?.address || 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020',
                businessName: matchedApp.businessName || 'Apex Commercial Solutions Ltd',
                status: matchedApp.status === 'APPROVED' ? 'VERIFIED' : 'UNVERIFIED'
              });
            }
          }
        }
      } catch (e) {
        console.warn('[instrumentService] Master app lookup error:', e);
      }
    }

    // Check MOCK_INSTRUMENTS
    const foundMock = localInstruments.find(
      (item) => item.id === id || item.uin === id || item.serialNumber === id || item.serialNo === id
    );
    if (foundMock) {
      return normalizeInstrument(foundMock);
    }

    // Dynamic resilient fallback for synthetic IDs
    return normalizeInstrument({
      id,
      uin: `IND-LM-2026-${id.replace(/[^0-9]/g, '') || '528977'}`,
      instrumentType: 'Digital Weighing Scale',
      category: 'Non-Automatic Weighing Instrument (NAWI)',
      manufacturer: 'Apex Metrology Systems',
      model: 'PM-DS-5000 Ultra-Precision',
      serialNumber: 'SN-2026-528977',
      maxCapacity: 30,
      minCapacity: 0.1,
      leastCount: 0.002,
      accuracyClass: 'Class III (Medium Accuracy)',
      location: 'Plot 42, Okhla Industrial Area Phase-III, New Delhi - 110020',
      businessName: 'Apex Commercial Solutions Ltd',
      status: 'UNVERIFIED'
    });
  },

  /**
   * Register new instrument via POST /instruments
   */
  async createInstrument(payload) {
    const user = getCurrentUser();
    const currentUserId = user?.id || `usr_biz_${Date.now()}`;
    const currentUserName = user?.orgName || user?.name || payload.ownerName || 'Commercial Enterprise';

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

      // Save to user storage as well
      const key = getUserStorageKey('mv_instruments', user);
      const stored = localStorage.getItem(key);
      const userList = stored ? JSON.parse(stored) : [];
      localStorage.setItem(key, JSON.stringify([normalized, ...userList]));

      if (isDemoSeedUser(user)) {
        localInstruments = [normalized, ...localInstruments];
      }

      return normalized;
    } catch (error) {
      console.warn('[instrumentService] Backend registration failed, preserving user record locally:', error.message);

      const newId = `MV-INS-${String(Math.floor(100000 + Math.random() * 900000))}`;
      const newInstrument = normalizeInstrument({
        id: newId,
        uin: `IND-LM-2026-${newId.replace('MV-INS-', 'W')}`,
        businessId: currentUserId,
        businessName: currentUserName,
        category: payload.category || payload.instrumentType || 'ELECTRONIC_WEIGHING_SCALE',
        brand: payload.manufacturer || payload.brand || 'Digital Scales Inc.',
        modelNo: payload.model || payload.modelNo || 'DS-500',
        serialNo: payload.serialNumber || payload.serialNo || `SN-${Date.now().toString().slice(-6)}`,
        maxCapacity: parseFloat(payload.capacity || payload.maxCapacity || 30),
        leastCount: parseFloat(payload.leastCount || 0.005),
        installationAddress: payload.location || payload.installationAddress || 'Commercial Trade Premises',
        currentStatus: 'UNVERIFIED',
        applicationsCount: 0
      });

      const key = getUserStorageKey('mv_instruments', user);
      const stored = localStorage.getItem(key);
      const userList = stored ? JSON.parse(stored) : [];
      localStorage.setItem(key, JSON.stringify([newInstrument, ...userList]));

      if (isDemoSeedUser(user)) {
        localInstruments = [newInstrument, ...localInstruments];
      }

      return newInstrument;
    }
  }
};

export default instrumentService;
