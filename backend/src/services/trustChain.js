import crypto from 'crypto';
import QRCode from 'qrcode';

/**
 * Generate a unique Digital Instrument Identification (UIN)
 * e.g., IND-LM-2026-W1048
 */
export function generateDigitalInstrumentId(category = 'GEN') {
  const prefixMap = {
    ELECTRONIC_WEIGHING_SCALE: 'EWS',
    WEIGHBRIDGE: 'WBR',
    FUEL_DISPENSER: 'FUD',
    PRECISION_BALANCE: 'PRB',
    FLOW_METER: 'FLM'
  };
  const code = prefixMap[category] || 'INS';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `IND-LM-2026-${code}${randomSuffix}`;
}

/**
 * Generate unique Application Number
 */
export function generateApplicationNo() {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `APP-2026-${rand}`;
}

/**
 * Generate Official Certificate Number
 */
export function generateCertificateNo() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `METRA-CERT-2026-${rand}`;
}

/**
 * Cryptographic Evidence Hash Calculation
 * Tamper-evident Digital Trust Chain proof generated on field inspector submission
 * SHA-256(photoUrl + lat + lng + timestamp + inspectorId + readings + checklist)
 */
export function computeEvidenceHash({
  photoUrl,
  latitude,
  longitude,
  networkTimestamp,
  inspectorId,
  testReadings,
  checklist
}) {
  const payload = JSON.stringify({
    photoUrl: photoUrl || '',
    latitude: latitude ? Number(latitude).toFixed(6) : '0.000000',
    longitude: longitude ? Number(longitude).toFixed(6) : '0.000000',
    networkTimestamp: new Date(networkTimestamp || Date.now()).toISOString(),
    inspectorId: String(inspectorId || ''),
    testReadings: testReadings || [],
    checklist: checklist || {}
  });

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Calculate Blockchain-style block hash for AuditLog
 */
export function computeAuditBlockHash({
  previousHash = '0000000000000000000000000000000000000000000000000000000000000000',
  action,
  entityId,
  actorId,
  details,
  timestamp
}) {
  const blockData = `${previousHash}|${action}|${entityId}|${actorId}|${JSON.stringify(details || {})}|${new Date(timestamp).toISOString()}`;
  return crypto.createHash('sha256').update(blockData).digest('hex');
}

/**
 * Generate QR code data URL containing the signed verification URL
 */
export async function generateTamperProofQRCode(certificateNo, verificationHash, baseUrl = 'http://localhost:5173') {
  const verificationUrl = `${baseUrl}/verify?cert=${encodeURIComponent(certificateNo)}&hash=${encodeURIComponent(verificationHash.substring(0, 16))}`;
  
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    width: 320
  });

  return {
    verificationUrl,
    qrDataUrl
  };
}
