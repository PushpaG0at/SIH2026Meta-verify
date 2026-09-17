import bcrypt from 'bcryptjs';
import prisma from './prisma.js';
import {
  generateDigitalInstrumentId,
  generateApplicationNo,
  generateCertificateNo,
  generateTamperProofQRCode,
  computeEvidenceHash,
  computeAuditBlockHash
} from './services/trustChain.js';

async function main() {
  console.log('🌱 Seeding METRA-VERIFY Legal Metrology database...');

  // Clear existing records
  await prisma.auditLog.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.officerReview.deleteMany({});
  await prisma.inspection.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.instrument.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Users
  const business1 = await prisma.user.create({
    data: {
      email: 'ramesh@kirana.in',
      passwordHash: defaultPasswordHash,
      name: 'Ramesh Kumar',
      role: 'BUSINESS',
      phone: '+91 98112 34567',
      orgName: 'Ramesh Kirana & General Stores',
      licenseNo: '07AAAAA0000A1Z5'
    }
  });

  const business2 = await prisma.user.create({
    data: {
      email: 'logistics@shreeexpress.com',
      passwordHash: defaultPasswordHash,
      name: 'Sunil Verma',
      role: 'BUSINESS',
      phone: '+91 98220 99887',
      orgName: 'Shree Highway Weighbridge & Freight Terminal',
      licenseNo: '07BBBBB1111B1Z2'
    }
  });

  const inspector = await prisma.user.create({
    data: {
      email: 'inspector.sharma@delhi.gov.in',
      passwordHash: defaultPasswordHash,
      name: 'Insp. Vikram Sharma',
      role: 'INSPECTOR',
      phone: '+91 94120 12345',
      orgName: 'Legal Metrology Division (Zone 2, Central Delhi)',
      licenseNo: 'DL-LM-INS-042'
    }
  });

  const officer = await prisma.user.create({
    data: {
      email: 'officer.sen@legalmetrology.gov.in',
      passwordHash: defaultPasswordHash,
      name: 'Shri R. Sen',
      role: 'OFFICER',
      phone: '+91 98100 54321',
      orgName: 'Controllerate of Legal Metrology, Delhi State',
      licenseNo: 'LMO-DL-CONT-01'
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@metraverify.gov.in',
      passwordHash: await bcrypt.hash('adminpassword', 10),
      name: 'System Administrator',
      role: 'ADMIN',
      phone: '+91 99999 00000',
      orgName: 'Dept. of Consumer Affairs & Legal Metrology',
      licenseNo: 'GOI-SYS-ADMIN'
    }
  });

  // Dedicated Demo Users
  await prisma.user.create({
    data: {
      email: 'business@metra-demo.in',
      passwordHash: defaultPasswordHash,
      name: 'Ramesh Kumar (Trader)',
      role: 'BUSINESS',
      phone: '+91 98112 34567',
      orgName: 'Ramesh Kirana & General Stores',
      licenseNo: '07AAAAA0000A1Z5'
    }
  });

  await prisma.user.create({
    data: {
      email: 'inspector@metra-demo.in',
      passwordHash: defaultPasswordHash,
      name: 'Insp. Vikram Sharma (Field Inspector)',
      role: 'INSPECTOR',
      phone: '+91 94120 12345',
      orgName: 'Legal Metrology Division (Zone 2, Central Delhi)',
      licenseNo: 'DL-LM-INS-042'
    }
  });

  await prisma.user.create({
    data: {
      email: 'officer@metra-demo.in',
      passwordHash: defaultPasswordHash,
      name: 'Shri R. Sen (Verification Officer)',
      role: 'OFFICER',
      phone: '+91 98100 54321',
      orgName: 'Controllerate of Legal Metrology, Delhi State',
      licenseNo: 'LMO-DL-CONT-01'
    }
  });

  console.log('✅ Users created: Business, Inspector, Officer, Admin & Demo accounts');

  // 2. Instrument 1: Fully Verified Electronic Scale with Active Certificate & QR
  const inst1Uin = generateDigitalInstrumentId('ELECTRONIC_WEIGHING_SCALE');
  const inst1 = await prisma.instrument.create({
    data: {
      uin: inst1Uin,
      businessId: business1.id,
      category: 'ELECTRONIC_WEIGHING_SCALE',
      brand: 'Essae-Teraoka',
      modelNo: 'DS-215 Commercial Class III',
      serialNo: 'ES-2024-98412',
      maxCapacity: 30.0,
      minCapacity: 0.1,
      leastCount: 0.005, // 5 grams verification interval
      installationAddress: 'Shop 14, Main Bazaar, Chandni Chowk, Old Delhi 110006',
      latitude: 28.6506,
      longitude: 77.2303,
      currentStatus: 'VERIFIED'
    }
  });

  const app1No = generateApplicationNo();
  const app1 = await prisma.application.create({
    data: {
      applicationNo: app1No,
      businessId: business1.id,
      instrumentId: inst1.id,
      status: 'OFFICER_APPROVED',
      feeAmount: 500.0,
      feeStatus: 'PAID',
      aiScore: 96.5,
      aiStatus: 'PASSED_ADVISORY',
      aiRemarks: JSON.stringify([
        { type: 'SUCCESS', field: 'MODEL_APPROVAL', message: 'Govt. Model Approval verified (IND/09/2021/104).' },
        { type: 'SUCCESS', field: 'INVOICE', message: 'Serial number ES-2024-98412 matches purchase invoice.' },
        { type: 'SUCCESS', field: 'TOLERANCE_TEST', message: 'Calculated MPE compliant with Class III schedule.' }
      ])
    }
  });

  await prisma.document.createMany({
    data: [
      {
        applicationId: app1.id,
        docType: 'MODEL_APPROVAL',
        fileName: 'Model_Approval_IND_09_2021.pdf',
        fileUrl: '/uploads/sample_model_approval.pdf',
        ocrExtractedText: 'Govt of India Model Approval Certificate No IND/09/2021/104. Essae DS-215 30kg e=5g',
        verifiedByAi: true
      },
      {
        applicationId: app1.id,
        docType: 'INVOICE',
        fileName: 'Purchase_Tax_Invoice_9841.pdf',
        fileUrl: '/uploads/sample_invoice.pdf',
        ocrExtractedText: 'Invoice #9841. Sold to Ramesh Kumar. Essae DS-215, Serial ES-2024-98412',
        verifiedByAi: true
      }
    ]
  });

  const testReadingsInst1 = [
    { testWeightKg: 5.0, indicatedWeightKg: 5.000, errorKg: 0.000, mpeKg: 0.005, pass: true },
    { testWeightKg: 10.0, indicatedWeightKg: 10.002, errorKg: 0.002, mpeKg: 0.010, pass: true },
    { testWeightKg: 20.0, indicatedWeightKg: 20.001, errorKg: 0.001, mpeKg: 0.015, pass: true },
    { testWeightKg: 30.0, indicatedWeightKg: 30.003, errorKg: 0.003, mpeKg: 0.015, pass: true }
  ];

  const insp1Timestamp = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // 14 days ago
  const insp1EvidenceHash = computeEvidenceHash({
    photoUrl: '/uploads/scale_inspection_proof.jpg',
    latitude: 28.6506,
    longitude: 77.2303,
    networkTimestamp: insp1Timestamp,
    inspectorId: inspector.id,
    testReadings: testReadingsInst1,
    checklist: { visualInspection: true, sealingIntact: true, zeroErrorCheck: true, repeatabilityPass: true }
  });

  await prisma.inspection.create({
    data: {
      applicationId: app1.id,
      inspectorId: inspector.id,
      assignedAt: new Date(insp1Timestamp.getTime() - 2 * 24 * 60 * 60 * 1000),
      completedAt: insp1Timestamp,
      visualInspection: true,
      sealingIntact: true,
      zeroErrorCheck: true,
      repeatabilityPass: true,
      testReadingsJson: JSON.stringify(testReadingsInst1),
      photoUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80',
      latitude: 28.6506,
      longitude: 77.2303,
      networkTimestamp: insp1Timestamp,
      evidenceHash: insp1EvidenceHash,
      inspectorNotes: 'Standard calibrated test weights applied. Physical lead-wire seal stamped with inspector die.',
      resultStatus: 'PASSED'
    }
  });

  const reviewDate1 = new Date(insp1Timestamp.getTime() + 24 * 60 * 60 * 1000);
  await prisma.officerReview.create({
    data: {
      applicationId: app1.id,
      officerId: officer.id,
      decision: 'APPROVED',
      remarks: 'All documents, AI pre-check flags, and inspector calibration readings verified compliant with Schedule VII.',
      stampingCode: 'DL/LM/2026/042-Z2',
      validUntil: new Date(reviewDate1.getTime() + 365 * 24 * 60 * 60 * 1000),
      reviewedAt: reviewDate1
    }
  });

  const cert1No = 'METRA-CERT-2026-104928';
  const { qrDataUrl, verificationUrl } = await generateTamperProofQRCode(
    cert1No,
    insp1EvidenceHash,
    'http://localhost:5173'
  );

  await prisma.certificate.create({
    data: {
      certificateNo: cert1No,
      applicationId: app1.id,
      instrumentId: inst1.id,
      issuedAt: reviewDate1,
      validUntil: new Date(reviewDate1.getTime() + 365 * 24 * 60 * 60 * 1000),
      qrPayload: verificationUrl,
      qrCodeDataUrl: qrDataUrl,
      evidenceHash: insp1EvidenceHash,
      status: 'VALID'
    }
  });

  // 3. Instrument 2: Weighbridge with Inspection Completed (Ready for Officer Review demo)
  const inst2Uin = generateDigitalInstrumentId('WEIGHBRIDGE');
  const inst2 = await prisma.instrument.create({
    data: {
      uin: inst2Uin,
      businessId: business2.id,
      category: 'WEIGHBRIDGE',
      brand: 'Avery Weigh-Tronix',
      modelNo: 'BridgeMaster E1200 50T',
      serialNo: 'AWT-50T-88192',
      maxCapacity: 50000.0, // 50 Tonnes
      minCapacity: 200.0,
      leastCount: 5.0, // 5kg interval
      installationAddress: 'Plot 88, GT Karnal Road Industrial Area, Delhi 110033',
      latitude: 28.7299,
      longitude: 77.1425,
      currentStatus: 'UNVERIFIED'
    }
  });

  const app2No = generateApplicationNo();
  const app2 = await prisma.application.create({
    data: {
      applicationNo: app2No,
      businessId: business2.id,
      instrumentId: inst2.id,
      status: 'INSPECTION_COMPLETED',
      feeAmount: 5000.0,
      feeStatus: 'PAID',
      aiScore: 92.0,
      aiStatus: 'PASSED_ADVISORY',
      aiRemarks: JSON.stringify([
        { type: 'SUCCESS', field: 'MODEL_APPROVAL', message: 'Model approval valid for Heavy Duty Weighbridge.' },
        { type: 'SUCCESS', field: 'CALIBRATION', message: 'Mobile calibration truck test load records submitted.' }
      ])
    }
  });

  const testReadingsInst2 = [
    { testWeightKg: 10000, indicatedWeightKg: 10002, errorKg: 2.0, mpeKg: 10.0, pass: true },
    { testWeightKg: 20000, indicatedWeightKg: 19996, errorKg: -4.0, mpeKg: 15.0, pass: true },
    { testWeightKg: 40000, indicatedWeightKg: 40005, errorKg: 5.0, mpeKg: 15.0, pass: true }
  ];

  const insp2Timestamp = new Date();
  const insp2EvidenceHash = computeEvidenceHash({
    photoUrl: '/uploads/weighbridge_inspection.jpg',
    latitude: 28.7299,
    longitude: 77.1425,
    networkTimestamp: insp2Timestamp,
    inspectorId: inspector.id,
    testReadings: testReadingsInst2,
    checklist: { visualInspection: true, sealingIntact: true, zeroErrorCheck: true, repeatabilityPass: true }
  });

  await prisma.inspection.create({
    data: {
      applicationId: app2.id,
      inspectorId: inspector.id,
      assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      completedAt: insp2Timestamp,
      visualInspection: true,
      sealingIntact: true,
      zeroErrorCheck: true,
      repeatabilityPass: true,
      testReadingsJson: JSON.stringify(testReadingsInst2),
      photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      latitude: 28.7299,
      longitude: 77.1425,
      networkTimestamp: insp2Timestamp,
      evidenceHash: insp2EvidenceHash,
      inspectorNotes: 'Eccentric load test and repeatability test conducted using mobile test truck. Load cell zero shift normal.',
      resultStatus: 'PASSED'
    }
  });

  // 4. Instrument 3: Fuel Dispenser (Assigned to Inspector for field testing demo)
  const inst3Uin = generateDigitalInstrumentId('FUEL_DISPENSER');
  const inst3 = await prisma.instrument.create({
    data: {
      uin: inst3Uin,
      businessId: business1.id,
      category: 'FUEL_DISPENSER',
      brand: 'Gilbarco Veeder-Root',
      modelNo: 'Horizon 2-Nozzle MS/HSD',
      serialNo: 'GVR-2025-00441',
      maxCapacity: 60.0, // Litres/min
      minCapacity: 5.0,
      leastCount: 0.02, // 20 ml
      installationAddress: 'IOCL Retail Outlet, Outer Ring Road, Pitampura, Delhi 110034',
      latitude: 28.6989,
      longitude: 77.1350,
      currentStatus: 'UNVERIFIED'
    }
  });

  const app3No = generateApplicationNo();
  const app3 = await prisma.application.create({
    data: {
      applicationNo: app3No,
      businessId: business1.id,
      instrumentId: inst3.id,
      status: 'INSPECTION_ASSIGNED',
      feeAmount: 2000.0,
      feeStatus: 'PAID',
      aiScore: 88.0,
      aiStatus: 'PASSED_ADVISORY',
      aiRemarks: JSON.stringify([
        { type: 'SUCCESS', field: 'MODEL_APPROVAL', message: 'PESO & Legal Metrology approvals attached.' },
        { type: 'INFO', field: 'EXPIRY', message: 'Annual re-stamping due as per Legal Metrology rules.' }
      ])
    }
  });

  await prisma.inspection.create({
    data: {
      applicationId: app3.id,
      inspectorId: inspector.id,
      assignedAt: new Date()
    }
  });

  // 5. Instrument 4: Precision Jewellery Scale (Brand new in Business registry, ready to apply)
  const inst4Uin = generateDigitalInstrumentId('PRECISION_BALANCE');
  await prisma.instrument.create({
    data: {
      uin: inst4Uin,
      businessId: business1.id,
      category: 'PRECISION_BALANCE',
      brand: 'Sartorius',
      modelNo: 'Entris II High-Precision Gold Scale',
      serialNo: 'SAR-2026-GOLD-019',
      maxCapacity: 1.0, // 1 kg / 1000g
      minCapacity: 0.01,
      leastCount: 0.001, // 1 milligram
      installationAddress: 'Dariba Kalan Jewellery Market, Chandni Chowk, Delhi 110006',
      latitude: 28.6548,
      longitude: 77.2341,
      currentStatus: 'UNVERIFIED'
    }
  });

  // Add initial Audit Logs
  const block1 = computeAuditBlockHash({
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    action: 'SYSTEM_INITIALIZED',
    entityId: 'SYSTEM',
    actorId: admin.id,
    details: { version: '1.0.0-SIH2026', jurisdiction: 'Delhi State Legal Metrology' },
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  });

  await prisma.auditLog.create({
    data: {
      entityType: 'APPLICATION',
      entityId: app1.id,
      action: 'CERTIFICATE_ISSUED',
      actorId: officer.id,
      actorRole: 'OFFICER',
      details: JSON.stringify({ certificateNo: cert1No, instrumentUin: inst1Uin }),
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      blockHash: block1
    }
  });

  console.log('🎉 METRA-VERIFY Seed completed successfully!');
  console.log(`📌 Demo Certificate for Instant QR Verification: ${cert1No}`);
  console.log(`📌 Demo Instrument UIN: ${inst1Uin}`);
  console.log('📌 Logins:');
  console.log('   - Business:  ramesh@kirana.in / password123');
  console.log('   - Inspector: inspector.sharma@delhi.gov.in / password123');
  console.log('   - Officer:   officer.sen@legalmetrology.gov.in / password123');
  console.log('   - Admin:     admin@metraverify.gov.in / adminpassword');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
