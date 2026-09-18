import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env directly
let rawUri = '';
for (const envPath of [path.join(__dirname, '../.env'), path.join(__dirname, '../../.env')]) {
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const l of lines) {
      if (l.includes('atlas_URL') || l.includes('MONGODB_URI')) {
        const val = l.substring(l.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
        if (val) rawUri = val;
      }
    }
  }
}
if (!rawUri) {
  rawUri = 'mongodb+srv://singhpushpendra95734_db_user:47zE6uF7MkA4K7WH@metraaveri.kixllni.mongodb.net/metra_verify?appName=MetraaVeri';
}

let uri = rawUri.trim().replace(/^['"]|['"]$/g, '');
if (!uri.includes('.mongodb.net/metra_verify') && uri.includes('.mongodb.net')) {
  uri = uri.replace('.mongodb.net/?', '.mongodb.net/metra_verify?');
  if (!uri.includes('/metra_verify')) {
    uri = uri.replace('.mongodb.net', '.mongodb.net/metra_verify');
  }
}

async function seedMongo() {
  console.log('🌿 Connecting to MongoDB Atlas cluster...');
  console.log(`📡 Target Database: metra_verify`);

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  const db = client.db('metra_verify');

  console.log('⚡ Connected! Preparing collections...');

  const defaultPasswordHash = crypto.createHash('sha256').update('password123').digest('hex');

  // ----------------------------------------------------
  // 1. USERS COLLECTION
  // ----------------------------------------------------
  const usersCol = db.collection('users');
  await usersCol.deleteMany({});
  await usersCol.createIndex({ email: 1 }, { unique: true });

  const usersData = [
    {
      id: 'usr_pushpa_01',
      name: 'Pushpendra Singh',
      email: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      username: 'singhpushpendra95734_db_user',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 95734 00000',
      orgName: 'Singh Legal Metrology & Enterprise Tech',
      licenseNo: '07AAAPS95734Z1',
      address: 'Central Tech Complex, Sector 18, New Delhi',
      permissions: ['ALL_PORTALS', 'BUSINESS_ADMIN', 'INSPECTOR_DESK', 'OFFICER_DESK'],
      isPrimaryAccount: true,
      createdAt: new Date('2026-01-01')
    },
    {
      id: 'usr_biz_01',
      name: 'Ramesh Kumar',
      email: 'ramesh@kirana.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98112 34567',
      orgName: 'Ramesh Kirana & General Stores',
      licenseNo: '07AAAAA0000A1Z5',
      address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi',
      createdAt: new Date('2026-02-01')
    },
    {
      id: 'usr_biz_02',
      name: 'Rajesh Sharma',
      email: 'rajesh@sharmatraders.com',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98765 43210',
      orgName: 'Sharma Traders & Co.',
      licenseNo: 'GSTIN07AAACS1429B1Z8',
      address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi - 110001',
      createdAt: new Date('2026-02-05')
    },
    {
      id: 'usr_biz_03',
      name: 'Sunil Verma',
      email: 'logistics@shreeexpress.com',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98220 99887',
      orgName: 'Shree Highway Weighbridge & Freight Terminal',
      licenseNo: '07BBBBB1111B1Z2',
      address: 'Highway Mile 44, GT Karnal Road, Delhi',
      createdAt: new Date('2026-02-10')
    },
    {
      id: 'usr_biz_04',
      name: 'Harish Mehta',
      email: 'harish@globalmetals.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98222 33445',
      orgName: 'Global Scrap Metals Depot',
      licenseNo: '07AAAFG8812K1Z4',
      address: 'Plot 19, Ring Road Bypass, Industrial Area, New Delhi - 110033',
      createdAt: new Date('2026-02-15')
    },
    {
      id: 'usr_biz_05',
      name: 'Sunil Kalyan',
      email: 'sunil@kalyanoil.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98111 22334',
      orgName: 'Kalyan Oil Depot & Fuel',
      licenseNo: '07AABCK1092M1Z3',
      address: 'Plot 12, Industrial Area Phase 1, Gurugram - 122016',
      createdAt: new Date('2026-02-20')
    },
    {
      id: 'usr_biz_06',
      name: 'Nitin Singhal',
      email: 'nitin@apexfmcg.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 99333 44556',
      orgName: 'Apex FMCG Bottling Ltd.',
      licenseNo: '07AABCA7721P1Z9',
      address: 'Industrial Plot 44, Okhla Phase III, New Delhi - 110020',
      createdAt: new Date('2026-02-25')
    },
    {
      id: 'usr_insp_01',
      name: 'Insp. Vikram Sharma',
      email: 'inspector.sharma@delhi.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'INSPECTOR',
      phone: '+91 94120 12345',
      orgName: 'Legal Metrology Division (Zone 2, Central Delhi)',
      badgeNumber: 'DL-LM-INS-042',
      jurisdiction: 'Zone 2 - Central Delhi District',
      createdAt: new Date('2026-01-15')
    },
    {
      id: 'usr_insp_02',
      name: 'Insp. Vikram Singh',
      email: 'vikram.singh@metraverify.internal',
      passwordHash: defaultPasswordHash,
      role: 'INSPECTOR',
      phone: '+91 98111 22334',
      orgName: 'Legal Metrology Field Calibration Unit',
      badgeNumber: 'INSP-NZ-4082',
      jurisdiction: 'Zone 4 - North Delhi Metro & Industrial Cluster',
      createdAt: new Date('2026-01-20')
    },
    {
      id: 'usr_insp_03',
      name: 'Insp. S. K. Verma',
      email: 'sk.verma@delhi.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'INSPECTOR',
      phone: '+91 98109 87654',
      orgName: 'Legal Metrology West Zone Enforcement',
      badgeNumber: 'INSP-WZ-1092',
      jurisdiction: 'West Zone Heavy Industrial Enclave',
      createdAt: new Date('2026-01-22')
    },
    {
      id: 'usr_insp_04',
      name: 'Insp. Kavita Iyer',
      email: 'kavita.iyer@legalmetrology.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'INSPECTOR',
      phone: '+91 98450 11223',
      orgName: 'Precision Laboratories Testing Wing',
      badgeNumber: 'INSP-SZ-2011',
      jurisdiction: 'South Zone Precision & Pharmaceutical Cluster',
      createdAt: new Date('2026-01-25')
    },
    {
      id: 'usr_off_01',
      name: 'Shri R. Sen',
      email: 'officer.sen@legalmetrology.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'OFFICER',
      phone: '+91 98100 54321',
      designation: 'Authorized Legal Metrology Verification Officer',
      orgName: 'Controllerate of Legal Metrology, Delhi State',
      licenseNo: 'LMO-DL-CONT-01',
      createdAt: new Date('2026-01-10')
    },
    {
      id: 'usr_off_02',
      name: 'Dr. Anita Deshmukh',
      email: 'anita.deshmukh@metraverify.internal',
      passwordHash: defaultPasswordHash,
      role: 'OFFICER',
      phone: '+91 99200 88776',
      designation: 'Statutory Verification Officer (Class I-IV)',
      orgName: 'Directorate of Legal Metrology, State HQ',
      licenseNo: 'OFF-HQ-ANITA-D',
      createdAt: new Date('2026-01-12')
    },
    {
      id: 'usr_admin_01',
      name: 'System Administrator',
      email: 'admin@metraverify.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      phone: '+91 99999 00000',
      orgName: 'Ministry of Consumer Affairs & Legal Metrology',
      licenseNo: 'GOI-SYS-ADMIN',
      createdAt: new Date('2026-01-01')
    },
    {
      id: 'usr_demo_biz',
      name: 'Ramesh Kumar (Trader)',
      email: 'business@metra-demo.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98112 34567',
      orgName: 'Ramesh Kirana & General Stores',
      licenseNo: '07AAAAA0000A1Z5',
      createdAt: new Date('2026-01-01')
    },
    {
      id: 'usr_demo_insp',
      name: 'Insp. Vikram Sharma (Field Inspector)',
      email: 'inspector@metra-demo.in',
      passwordHash: defaultPasswordHash,
      role: 'INSPECTOR',
      phone: '+91 94120 12345',
      orgName: 'Legal Metrology Division (Zone 2, Central Delhi)',
      badgeNumber: 'DL-LM-INS-042',
      createdAt: new Date('2026-01-01')
    },
    {
      id: 'usr_demo_off',
      name: 'Shri R. Sen (Verification Officer)',
      email: 'officer@metra-demo.in',
      passwordHash: defaultPasswordHash,
      role: 'OFFICER',
      phone: '+91 98100 54321',
      designation: 'Authorized Legal Metrology Verification Officer',
      orgName: 'Controllerate of Legal Metrology, Delhi State',
      licenseNo: 'LMO-DL-CONT-01',
      createdAt: new Date('2026-01-01')
    }
  ];

  await usersCol.insertMany(usersData);
  console.log(`✅ Stored ${usersData.length} users in 'users' collection.`);

  // ----------------------------------------------------
  // 2. INSTRUMENTS COLLECTION
  // ----------------------------------------------------
  const instrumentsCol = db.collection('instruments');
  await instrumentsCol.deleteMany({});
  await instrumentsCol.createIndex({ serialNumber: 1 });
  await instrumentsCol.createIndex({ uin: 1 });

  const instrumentsData = [
    {
      uin: 'METRA-2026-EWS-00123',
      businessId: 'usr_biz_02',
      businessName: 'Sharma Traders & Co.',
      ownerName: 'Rajesh Sharma',
      ownerEmail: 'rajesh@sharmatraders.com',
      instrumentType: 'Digital Weighing Scale',
      category: 'Non-Automatic Weighing Instrument (NAWI)',
      brand: 'ABC Instruments Ltd.',
      modelNo: 'WS-500 Industrial Precision',
      serialNumber: 'WS123456',
      maxCapacity: 50.0,
      minCapacity: 0.1,
      leastCount: 0.005,
      verificationDivision: 'e = 5 g, d = 1 g',
      accuracyClass: 'Class III (Medium Accuracy)',
      modelApprovalNumber: 'IND-DLM-2024-AP-0912',
      purchaseDate: new Date('2025-04-12'),
      location: 'Main Retail Billing Counter - Bay 1, Central Mandi, New Delhi',
      latitude: 28.6141,
      longitude: 77.2092,
      lastVerifiedDate: new Date('2025-09-08'),
      nextDueCheck: new Date('2027-09-08'),
      status: 'VERIFIED',
      activeCertificateId: 'MV-CERT-000123',
      sealNumber: 'MV-SEAL-2026-09412',
      telematicsStatus: 'ACTIVE',
      createdAt: new Date('2025-04-15')
    },
    {
      uin: 'METRA-2026-HPS-00124',
      businessId: 'usr_biz_02',
      businessName: 'Sharma Traders & Co.',
      ownerName: 'Rajesh Sharma',
      ownerEmail: 'rajesh@sharmatraders.com',
      instrumentType: 'Heavy Duty Platform Scale',
      category: 'Industrial Platform Scale',
      brand: 'Apex Metrology Systems',
      modelNo: 'APX-PL-1500',
      serialNumber: 'APX992811',
      maxCapacity: 1500.0,
      minCapacity: 2.0,
      leastCount: 0.01,
      verificationDivision: 'e = 10 g, d = 5 g',
      accuracyClass: 'Class III (Industrial)',
      modelApprovalNumber: 'IND-DLM-2023-PL-0518',
      purchaseDate: new Date('2024-11-20'),
      location: 'Goods Inward Warehouse & Loading Dock B, Central Mandi Market, New Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      lastVerifiedDate: new Date('2025-08-14'),
      nextDueCheck: new Date('2026-08-14'),
      status: 'INSPECTION_SCHEDULED',
      activeCertificateId: null,
      telematicsStatus: 'PENDING_VISIT',
      createdAt: new Date('2024-11-25')
    },
    {
      uin: 'METRA-2026-PRB-00125',
      businessId: 'usr_biz_02',
      businessName: 'Sharma Traders & Co.',
      ownerName: 'Rajesh Sharma',
      ownerEmail: 'rajesh@sharmatraders.com',
      instrumentType: 'Precision Laboratory Micro-Balance',
      category: 'Fine Chemical Analytical Balance',
      brand: 'Sartor Instruments',
      modelNo: 'SI-PRECISION-220',
      serialNumber: 'SRT-44021',
      maxCapacity: 0.22,
      minCapacity: 0.000001,
      leastCount: 0.0000001,
      verificationDivision: 'e = 1 mg, d = 0.1 mg',
      accuracyClass: 'Class I (Special High Precision)',
      modelApprovalNumber: 'IND-DLM-2025-PR-0112',
      purchaseDate: new Date('2026-01-10'),
      location: 'Quality Assurance Testing Chamber, Central Mandi, New Delhi',
      latitude: 28.6210,
      longitude: 77.2140,
      lastVerifiedDate: null,
      nextDueCheck: new Date('2026-09-20'),
      status: 'PENDING_REVIEW',
      activeCertificateId: null,
      telematicsStatus: 'AUDITED',
      createdAt: new Date('2026-01-15')
    },
    {
      uin: 'METRA-2026-FLM-00142',
      businessId: 'usr_biz_05',
      businessName: 'Kalyan Oil Depot & Fuel',
      ownerName: 'Sunil Kalyan',
      ownerEmail: 'sunil@kalyanoil.in',
      instrumentType: 'Fuel Dispenser Flow Meter',
      category: 'Continuous Measuring System for Liquids',
      brand: 'Tokheim Metrology Global',
      modelNo: 'TK-QUANTUM-4',
      serialNumber: 'TK-88391-B',
      maxCapacity: 70.0,
      minCapacity: 5.0,
      leastCount: 0.01,
      verificationDivision: '0.01 L (e), 0.005 L (d)',
      accuracyClass: 'Class 0.5 (Liquid Fuel Standard)',
      modelApprovalNumber: 'IND-DLM-2024-FM-0822',
      purchaseDate: new Date('2024-08-10'),
      location: 'Plot 12, Industrial Area Phase 1, Gurugram - 122016',
      latitude: 28.4595,
      longitude: 77.0266,
      lastVerifiedDate: new Date('2024-08-15'),
      nextDueCheck: new Date('2026-09-15'),
      status: 'VERIFICATION_IN_PROGRESS',
      activeCertificateId: 'MV-2025-000089',
      telematicsStatus: 'ACTIVE',
      createdAt: new Date('2024-08-12')
    },
    {
      uin: 'METRA-2026-WB-000999',
      businessId: 'usr_biz_04',
      businessName: 'Global Scrap Metals Depot',
      ownerName: 'Harish Mehta',
      ownerEmail: 'harish@globalmetals.in',
      instrumentType: 'Weighbridge Truck Scale (60T)',
      category: 'Heavy Vehicular Weighbridge',
      brand: 'Avery Weigh-Tronix',
      modelNo: 'BridgeMaster Pro-60',
      serialNumber: 'AV-BM-60T-99',
      maxCapacity: 60000.0,
      minCapacity: 400.0,
      leastCount: 20.0,
      verificationDivision: '20 kg (e), 10 kg (d)',
      accuracyClass: 'Class IV (Heavy Industrial)',
      modelApprovalNumber: 'IND-DLM-2022-WB-0419',
      purchaseDate: new Date('2022-06-15'),
      location: 'Plot 19, Ring Road Bypass, Industrial Area, New Delhi - 110033',
      latitude: 28.7112,
      longitude: 77.1550,
      lastVerifiedDate: new Date('2026-01-10'),
      nextDueCheck: new Date('2026-06-24'),
      status: 'REVOKED_TAMPERED',
      activeCertificateId: 'MV-2026-000999',
      telematicsStatus: 'FLAGGED_ANOMALY',
      createdAt: new Date('2022-06-20')
    },
    {
      uin: 'METRA-2026-CKW-000155',
      businessId: 'usr_biz_06',
      businessName: 'Apex FMCG Bottling Ltd.',
      ownerName: 'Nitin Singhal',
      ownerEmail: 'nitin@apexfmcg.in',
      instrumentType: 'Automatic Checkweigher Belt',
      category: 'Automatic Gravimetric Filling & Checkweighing',
      brand: 'Ishida Metrology Systems',
      modelNo: 'DACS-G-015',
      serialNumber: 'ISH-CKW-901',
      maxCapacity: 15.0,
      minCapacity: 0.05,
      leastCount: 0.001,
      verificationDivision: '1 g (e), 0.2 g (d)',
      accuracyClass: 'Class XIII(1) Automatic',
      modelApprovalNumber: 'IND-DLM-2023-AC-0391',
      purchaseDate: new Date('2025-05-18'),
      location: 'Industrial Plot 44, Okhla Phase III, New Delhi - 110020',
      latitude: 28.5355,
      longitude: 77.2730,
      lastVerifiedDate: null,
      nextDueCheck: new Date('2026-09-15'),
      status: 'NEEDS_RECALIBRATION',
      activeCertificateId: null,
      telematicsStatus: 'WARNING_MPE',
      createdAt: new Date('2025-05-20')
    },
    {
      uin: 'METRA-2026-VAT-000138',
      businessId: 'usr_biz_03',
      businessName: 'Rajdhani Dairy Federation',
      ownerName: 'Suresh Yadav',
      ownerEmail: 'suresh@rajdhanidairy.in',
      instrumentType: 'Milk Chilling Vat Volume Gauge',
      category: 'Liquid Capacity Measure & Dipstick System',
      brand: 'DeLaval Metrology',
      modelNo: 'DL-CHILL-5000',
      serialNumber: 'RD-VAT-204',
      maxCapacity: 5000.0,
      minCapacity: 200.0,
      leastCount: 5.0,
      verificationDivision: '5 Litres (e)',
      accuracyClass: 'Class 0.5',
      purchaseDate: new Date('2024-03-12'),
      location: 'Chilling Plant 3, Outer Ring Road, Bawana Industrial Area, Delhi',
      latitude: 28.7981,
      longitude: 77.0422,
      lastVerifiedDate: new Date('2025-09-11'),
      nextDueCheck: new Date('2026-09-11'),
      status: 'SCHEDULED_FOR_INSPECTION',
      activeCertificateId: null,
      createdAt: new Date('2024-03-15')
    }
  ];

  await instrumentsCol.insertMany(instrumentsData);
  console.log(`✅ Stored ${instrumentsData.length} instruments in 'instruments' collection.`);

  // ----------------------------------------------------
  // 3. APPLICATIONS COLLECTION
  // ----------------------------------------------------
  const applicationsCol = db.collection('applications');
  await applicationsCol.deleteMany({});
  await applicationsCol.createIndex({ applicationId: 1 }, { unique: true });

  const applicationsData = [
    {
      applicationId: 'MV-APP-000123',
      instrumentUin: 'METRA-2026-EWS-00123',
      instrumentType: 'Digital Weighing Scale',
      businessId: 'usr_biz_02',
      businessName: 'Sharma Traders & Co.',
      ownerEmail: 'rajesh@sharmatraders.com',
      submissionDate: new Date('2026-09-01'),
      status: 'OFFICER_REVIEW',
      currentStep: 6,
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: 'MV-CERT-000123',
      riskScore: 25,
      riskLevel: 'LOW',
      slaRemainingDays: 1.5,
      statutoryFee: {
        amount: 1250.0,
        currency: 'INR',
        receiptNo: 'MTR-FEE-2026-8819',
        paidAt: new Date('2026-09-01T10:14:00Z'),
        paymentMode: 'Bharat BillPay Gateway',
        status: 'PAID'
      },
      traderDetails: {
        proprietor: 'Rajesh Sharma',
        phone: '+91 98765 43210',
        email: 'rajesh@sharmatraders.com',
        gstin: '07AAACS1429B1Z8',
        address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi - 110001'
      },
      aiRiskAnalysis: {
        confidenceScore: 96.5,
        status: 'PASSED_ADVISORY',
        factors: [
          'Document OCR match verified at 100% confidence',
          'No past tamper or recalibration violations in repository',
          'Class III compliance matches retail category'
        ]
      },
      chainOfCustodyHash: '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a',
      createdAt: new Date('2026-09-01')
    },
    {
      applicationId: 'MV-APP-000124',
      instrumentUin: 'METRA-2026-HPS-00124',
      instrumentType: 'Heavy Duty Platform Scale',
      businessId: 'usr_biz_02',
      businessName: 'Sharma Traders & Co.',
      ownerEmail: 'rajesh@sharmatraders.com',
      submissionDate: new Date('2026-09-04'),
      status: 'INSPECTION',
      currentStep: 4,
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: null,
      riskScore: 54,
      riskLevel: 'MEDIUM',
      slaRemainingDays: 2.1,
      statutoryFee: {
        amount: 2000.0,
        currency: 'INR',
        receiptNo: 'MTR-FEE-2026-8942',
        paidAt: new Date('2026-09-04T11:25:00Z'),
        paymentMode: 'UPI AutoPay',
        status: 'PAID'
      },
      aiRiskAnalysis: {
        confidenceScore: 82.0,
        status: 'MANUAL_REVIEW_ADVISED',
        factors: [
          'High capacity scale (1500 kg) requires heavy crane calibration weights',
          'Invoice timestamp over 18 months old; physical verification scheduled'
        ]
      },
      chainOfCustodyHash: '3f4b5c6d7e8f901234567890abcdef1234567890abcdef1234567890abcdef12',
      createdAt: new Date('2026-09-04')
    },
    {
      applicationId: 'MV-APP-000126',
      instrumentUin: 'METRA-2026-WB-000999',
      instrumentType: 'Weighbridge Truck Scale (60T)',
      businessId: 'usr_biz_04',
      businessName: 'Global Scrap Metals Depot',
      ownerEmail: 'harish@globalmetals.in',
      submissionDate: new Date('2026-09-06'),
      status: 'OFFICER_REVIEW',
      currentStep: 6,
      assignedInspector: 'Insp. S. K. Verma (Badge: INSP-WZ-1092)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: null,
      riskScore: 78,
      riskLevel: 'CRITICAL_HIGH',
      slaRemainingDays: 0.8,
      statutoryFee: {
        amount: 5000.0,
        currency: 'INR',
        receiptNo: 'MTR-FEE-2026-9921',
        paidAt: new Date('2026-09-06T11:30:00Z'),
        paymentMode: 'NEFT Transfer',
        status: 'PAID'
      },
      aiRiskAnalysis: {
        confidenceScore: 41.5,
        status: 'FLAGGED_ANOMALY',
        factors: [
          'Document OCR mismatch: Invoice shows AV-BM-60T-88 vs Stamped AV-BM-60T-99',
          'Load cell junction box shows unapproved electronic bypass wiring',
          'CRITICAL MPE ERROR: Exceeds tolerance by +65kg at 10 Ton test'
        ]
      },
      chainOfCustodyHash: 'de0192837465fecdba9876543210fedcba9876543210fedcba9876543210fedc',
      createdAt: new Date('2026-09-06')
    },
    {
      applicationId: 'MV-APP-000125',
      instrumentUin: 'METRA-2026-PRB-00125',
      instrumentType: 'Precision Laboratory Micro-Balance',
      businessId: 'usr_biz_02',
      businessName: 'Sharma Traders & Co.',
      ownerEmail: 'rajesh@sharmatraders.com',
      submissionDate: new Date('2026-09-07'),
      status: 'OFFICER_REVIEW',
      currentStep: 6,
      assignedInspector: 'Insp. Kavita Iyer (Badge: INSP-SZ-2011)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: null,
      riskScore: 32,
      riskLevel: 'LOW',
      slaRemainingDays: 2.8,
      statutoryFee: {
        amount: 3500.0,
        currency: 'INR',
        receiptNo: 'MTR-FEE-2026-9041',
        paidAt: new Date('2026-09-07T09:10:00Z'),
        paymentMode: 'Net Banking',
        status: 'PAID'
      },
      chainOfCustodyHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      createdAt: new Date('2026-09-07')
    },
    {
      applicationId: 'MV-APP-000130',
      instrumentUin: 'METRA-2026-FLM-00142',
      instrumentType: 'Fuel Dispenser Flow Meter',
      businessId: 'usr_biz_05',
      businessName: 'Kalyan Oil Depot & Fuel',
      ownerEmail: 'sunil@kalyanoil.in',
      submissionDate: new Date('2026-09-08'),
      status: 'OFFICER_REVIEW',
      currentStep: 6,
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: null,
      riskScore: 28,
      riskLevel: 'LOW',
      slaRemainingDays: 1.2,
      statutoryFee: {
        amount: 2500.0,
        currency: 'INR',
        receiptNo: 'MTR-FEE-2026-9411',
        paidAt: new Date('2026-09-08T08:45:00Z'),
        paymentMode: 'Net Banking',
        status: 'PAID'
      },
      chainOfCustodyHash: 'c1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80',
      createdAt: new Date('2026-09-08')
    },
    {
      applicationId: 'MV-APP-000132',
      instrumentUin: 'METRA-2026-CKW-000155',
      instrumentType: 'Automatic Checkweigher Belt',
      businessId: 'usr_biz_06',
      businessName: 'Apex FMCG Bottling Ltd.',
      ownerEmail: 'nitin@apexfmcg.in',
      submissionDate: new Date('2026-09-07'),
      status: 'NEEDS_CORRECTION',
      currentStep: 5,
      assignedInspector: 'Insp. S. K. Verma (Badge: INSP-WZ-1092)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: null,
      riskScore: 65,
      riskLevel: 'HIGH',
      slaRemainingDays: 0.3,
      statutoryFee: {
        amount: 4000.0,
        currency: 'INR',
        receiptNo: 'MTR-FEE-2026-9502',
        paidAt: new Date('2026-09-07T14:20:00Z'),
        paymentMode: 'Corporate Card',
        status: 'PAID'
      },
      chainOfCustodyHash: 'fa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b',
      createdAt: new Date('2026-09-07')
    }
  ];

  await applicationsCol.insertMany(applicationsData);
  console.log(`✅ Stored ${applicationsData.length} applications in 'applications' collection.`);

  // ----------------------------------------------------
  // 4. ASSIGNMENTS & INSPECTIONS COLLECTION
  // ----------------------------------------------------
  const assignmentsCol = db.collection('assignments');
  await assignmentsCol.deleteMany({});
  await assignmentsCol.createIndex({ assignmentId: 1 }, { unique: true });

  const assignmentsData = [
    {
      assignmentId: 'INSP-2026-00098',
      applicationId: 'MV-APP-000123',
      instrumentUin: 'METRA-2026-EWS-00123',
      instrumentType: 'Digital Weighing Scale',
      businessName: 'Sharma Traders & Co.',
      inspectorName: 'Insp. Vikram Singh',
      inspectorBadge: 'INSP-NZ-4082',
      scheduledDate: new Date('2026-09-05'),
      completedAt: new Date('2026-09-05T14:45:00Z'),
      status: 'COMPLETED',
      gpsTelematics: {
        verifiedLatitude: 28.6141,
        verifiedLongitude: 77.2092,
        geofenceOffsetMeters: 4.2,
        locationStatus: 'PASS_IN_GEOFENCE'
      },
      measurements: [
        { testWeight: '5 kg Class M1 Standard', readingKg: 5.0, errorG: 0, toleranceG: 5, result: 'PASS' },
        { testWeight: '25 kg Class M1 Standard', readingKg: 25.002, errorG: 2, toleranceG: 10, result: 'PASS' },
        { testWeight: '50 kg Full Scale Test', readingKg: 50.003, errorG: 3, toleranceG: 15, result: 'PASS' }
      ],
      checklist: {
        instrumentAvailable: true,
        serialNumberVisible: true,
        manufacturerDetailsVisible: true,
        displayFunctioning: true,
        requiredMarkingsVisible: true,
        eccentricLoadingValid: true
      },
      sealNumber: 'MV-SEAL-2026-09412',
      recommendation: 'RECOMMEND_FOR_APPROVAL',
      findings: 'All verification divisions within permissible error limits. Lead wirelock seal attached.',
      createdAt: new Date('2026-09-01')
    },
    {
      assignmentId: 'INSP-2026-00104',
      applicationId: 'MV-APP-000124',
      instrumentUin: 'METRA-2026-HPS-00124',
      instrumentType: 'Heavy Duty Platform Scale',
      businessName: 'Sharma Traders & Co.',
      inspectorName: 'Insp. Vikram Singh',
      inspectorBadge: 'INSP-NZ-4082',
      scheduledDate: new Date('2026-09-10'),
      status: 'PENDING_FIELD_VISIT',
      timeSlot: '10:30 AM - 11:45 AM',
      priority: 'HIGH',
      location: 'Goods Inward Warehouse & Loading Dock B, Central Mandi Market, New Delhi',
      targetGps: { lat: 28.6139, lng: 77.209, geofenceRadiusMeters: 50 },
      standardWeightsRequired: 'Class M1 Standard Weights (10kg, 20kg, 50kg calibrated slabs)',
      createdAt: new Date('2026-09-04')
    },
    {
      assignmentId: 'INSP-2026-00105',
      applicationId: 'MV-APP-000129',
      instrumentUin: 'METRA-2026-VAT-000138',
      instrumentType: 'Milk Chilling Vat Volume Gauge',
      businessName: 'Rajdhani Dairy Federation',
      inspectorName: 'Insp. Vikram Sharma',
      inspectorBadge: 'DL-LM-INS-042',
      scheduledDate: new Date('2026-09-11'),
      status: 'SCHEDULED',
      timeSlot: '02:00 PM - 03:30 PM',
      priority: 'MEDIUM',
      location: 'Chilling Plant 3, Bawana Industrial Area, Delhi',
      standardWeightsRequired: 'Calibrated 200L Proving Tank & Class F Standards',
      createdAt: new Date('2026-09-05')
    },
    {
      assignmentId: 'INSP-2026-00109',
      applicationId: 'MV-APP-000133',
      instrumentUin: 'METRA-2026-FLM-00142',
      instrumentType: 'Fuel Dispenser Flow Meter',
      businessName: 'Kalyan Oil Depot & Fuel',
      inspectorName: 'Insp. Vikram Singh',
      inspectorBadge: 'INSP-NZ-4082',
      scheduledDate: new Date('2026-09-12'),
      status: 'SCHEDULED',
      timeSlot: '11:00 AM - 12:30 PM',
      priority: 'NORMAL',
      location: 'Plot 12, Phase 1, Udyog Vihar, Gurugram',
      standardWeightsRequired: '5L & 20L Metallic Test Measures (Conical Provers)',
      createdAt: new Date('2026-09-08')
    },
    {
      assignmentId: 'INSP-2026-00118',
      applicationId: 'MV-APP-000125',
      instrumentUin: 'METRA-2026-PRB-00125',
      instrumentType: 'Precision Laboratory Micro-Balance',
      businessName: 'Sharma Traders & Co.',
      inspectorName: 'Insp. Kavita Iyer',
      inspectorBadge: 'INSP-SZ-2011',
      scheduledDate: new Date('2026-09-08'),
      completedAt: new Date('2026-09-08T11:30:00Z'),
      status: 'COMPLETED',
      measurements: [
        { testWeight: '100 g E2 Standard', readingKg: 0.1000001, errorG: 0.0001, toleranceG: 0.0002, result: 'PASS' },
        { testWeight: '200 g E2 Standard', readingKg: 0.1999998, errorG: -0.0002, toleranceG: 0.0004, result: 'PASS' }
      ],
      sealNumber: 'MV-SEAL-2026-09881',
      recommendation: 'RECOMMEND_FOR_APPROVAL',
      findings: 'Precision tests passed within E2 tolerances. Thermal chamber controls functional.',
      createdAt: new Date('2026-09-07')
    },
    {
      assignmentId: 'INSP-2026-00122',
      applicationId: 'MV-APP-000126',
      instrumentUin: 'METRA-2026-WB-000999',
      instrumentType: 'Weighbridge Truck Scale (60T)',
      businessName: 'Global Scrap Metals Depot',
      inspectorName: 'Insp. S. K. Verma',
      inspectorBadge: 'INSP-WZ-1092',
      scheduledDate: new Date('2026-09-07'),
      completedAt: new Date('2026-09-07T16:20:00Z'),
      status: 'REJECTED_NONCOMPLIANT',
      measurements: [
        { testWeight: '10,000 kg Test Block', readingKg: 10065, errorG: 65000, toleranceG: 20000, result: 'FAIL' },
        { testWeight: '30,000 kg Test Train', readingKg: 30140, errorG: 140000, toleranceG: 40000, result: 'FAIL' }
      ],
      sealNumber: 'REJECTED_UNSEALED',
      recommendation: 'REJECT_AND_ISSUE_LEGAL_NOTICE',
      findings: 'CRITICAL: Error exceeds MPE tolerance by +65kg at 10T. Tampering suspected at terminal digitizer.',
      createdAt: new Date('2026-09-06')
    }
  ];

  await assignmentsCol.insertMany(assignmentsData);
  console.log(`✅ Stored ${assignmentsData.length} assignments & inspections in 'assignments' collection.`);

  // ----------------------------------------------------
  // 5. CERTIFICATES COLLECTION
  // ----------------------------------------------------
  const certificatesCol = db.collection('certificates');
  await certificatesCol.deleteMany({});
  await certificatesCol.createIndex({ certificateId: 1 }, { unique: true });

  const certificatesData = [
    {
      certificateId: 'MV-CERT-000123',
      applicationId: 'MV-APP-000123',
      instrumentUin: 'METRA-2026-EWS-00123',
      businessName: 'Sharma Traders & Co.',
      ownerName: 'Rajesh Sharma',
      businessAddress: 'Shop 42, Central Mandi Market, Sector 18, New Delhi - 110001',
      gstin: '07AAACS1429B1Z8',
      instrumentType: 'Digital Weighing Scale',
      category: 'Non-Automatic Weighing Instrument (NAWI)',
      brand: 'ABC Instruments Ltd.',
      modelNo: 'WS-500 Industrial Precision',
      serialNumber: 'WS123456',
      maxCapacity: '50 kg',
      minCapacity: '100 g',
      verificationDivision: 'e = 5 g, d = 1 g',
      accuracyClass: 'Class III (Medium Accuracy)',
      sealNumber: 'MV-SEAL-2026-09412',
      issueDate: new Date('2026-09-08'),
      validUntil: new Date('2027-09-08'),
      issuingOfficer: 'Dr. Anita Deshmukh',
      issuingAuthority: 'State Legal Metrology Verification Directorate',
      qrCodePayload: 'https://metra-verify.gov.in/verify/MV-CERT-000123',
      securityHash: '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a',
      status: 'VALID',
      verificationCount: 42,
      createdAt: new Date('2026-09-08')
    },
    {
      certificateId: 'MV-2025-000089',
      applicationId: 'MV-APP-000072',
      instrumentUin: 'METRA-2026-FLM-00142',
      businessName: 'Kalyan Oil Depot & Fuel',
      ownerName: 'Sunil Kalyan',
      businessAddress: 'Plot 12, Industrial Area Phase 1, Gurugram',
      instrumentType: 'Fuel Dispenser Flow Meter',
      category: 'Liquid Fuel Flow Meter (LPG/Petrol)',
      brand: 'Tokheim Metrology Global',
      modelNo: 'TK-QUANTUM-4',
      serialNumber: 'TK-88391-B',
      maxCapacity: '70 L/min',
      accuracyClass: 'Class 0.5',
      issueDate: new Date('2024-08-15'),
      validUntil: new Date('2025-08-15'),
      issuingOfficer: 'Insp. S. K. Verma',
      issuingAuthority: 'State Legal Metrology Verification Directorate',
      securityHash: '3a4b5c6d7e8f901234567890abcdef1234567890abcdef1234567890abcdef12',
      status: 'EXPIRED',
      verificationCount: 189,
      createdAt: new Date('2024-08-15')
    },
    {
      certificateId: 'MV-2026-000999',
      applicationId: 'MV-APP-000810',
      instrumentUin: 'METRA-2026-WB-000999',
      businessName: 'Global Scrap Metals Depot',
      ownerName: 'Harish Mehta',
      businessAddress: 'Warehouse 9, Ring Road Bypass, Ghaziabad',
      instrumentType: 'Weighbridge Truck Scale (60T)',
      category: 'Heavy Vehicular Weighbridge',
      brand: 'Avery Weigh-Tronix',
      modelNo: 'BridgeMaster Pro-60',
      serialNumber: 'AV-BM-60T-99',
      maxCapacity: '60,000 kg',
      accuracyClass: 'Class IV',
      issueDate: new Date('2026-01-10'),
      validUntil: new Date('2026-06-24'),
      issuingOfficer: 'Dr. Anita Deshmukh',
      issuingAuthority: 'State Legal Metrology Verification Directorate',
      securityHash: 'de0192837465fecdba9876543210fedcba9876543210fedcba9876543210fedc',
      status: 'REVOKED',
      revocationReason: 'Unapproved electronic bypass circuit detected during surprise audit.',
      verificationCount: 312,
      createdAt: new Date('2026-01-10')
    }
  ];

  await certificatesCol.insertMany(certificatesData);
  console.log(`✅ Stored ${certificatesData.length} certificates in 'certificates' collection.`);

  // ----------------------------------------------------
  // 6. REPORTS & AUDIT LOGS COLLECTION
  // ----------------------------------------------------
  const reportsCol = db.collection('reports');
  await reportsCol.deleteMany({});
  await reportsCol.createIndex({ logId: 1 });

  const reportsData = [
    {
      logId: 'AUDIT-LOG-2026-001',
      eventType: 'CERTIFICATE_GENERATED',
      instrumentUin: 'METRA-2026-EWS-00123',
      applicationId: 'MV-APP-000123',
      actor: 'Dr. Anita Deshmukh (Verification Officer)',
      actorRole: 'OFFICER',
      details: 'Statutory Verification Certificate #MV-CERT-000123 sealed with SHA-256 cryptographic signature.',
      securityHash: '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a',
      telematicsCoordinates: '28.6141° N, 77.2092° E',
      timestamp: new Date('2026-09-08T10:24:00Z')
    },
    {
      logId: 'AUDIT-LOG-2026-002',
      eventType: 'FIELD_INSPECTION_COMPLETED',
      instrumentUin: 'METRA-2026-EWS-00123',
      applicationId: 'MV-APP-000123',
      actor: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      actorRole: 'INSPECTOR',
      details: 'Field physical verification completed with 3-step MPE error tests. Geofence radius verified at 4.2m.',
      securityHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90',
      telematicsCoordinates: '28.6141° N, 77.2092° E',
      timestamp: new Date('2026-09-05T14:45:00Z')
    },
    {
      logId: 'AUDIT-LOG-2026-003',
      eventType: 'AI_ANOMALY_FLAGGED',
      instrumentUin: 'METRA-2026-WB-000999',
      applicationId: 'MV-APP-000126',
      actor: 'AI Vision & Telematics Advisory Engine',
      actorRole: 'SYSTEM_AI',
      details: 'CRITICAL ANOMALY: Load cell bypass tampering detected (+65kg error at 10T). Certificate revoked.',
      securityHash: 'de0192837465fecdba9876543210fedcba9876543210fedcba9876543210fedc',
      telematicsCoordinates: '28.7112° N, 77.1550° E',
      timestamp: new Date('2026-09-07T16:20:00Z')
    },
    {
      logId: 'AUDIT-LOG-2026-004',
      eventType: 'STATUTORY_FEE_CONFIRMED',
      instrumentUin: 'METRA-2026-EWS-00123',
      applicationId: 'MV-APP-000123',
      actor: 'Bharat BillPay Gateway',
      actorRole: 'FINANCIAL_GATEWAY',
      details: 'Challan #MTR-FEE-2026-8819 for ₹1,250.00 confirmed and escrowed in State Metrology Treasury.',
      securityHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      timestamp: new Date('2026-09-01T10:14:00Z')
    },
    {
      logId: 'AUDIT-LOG-2026-005',
      eventType: 'USER_REGISTERED_PRIMARY',
      instrumentUin: null,
      applicationId: null,
      actor: 'Pushpendra Singh',
      actorRole: 'BUSINESS',
      details: 'Primary administrator & developer profile active with full stakeholder credentials.',
      securityHash: '7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
      timestamp: new Date('2026-01-01T00:00:00Z')
    }
  ];

  await reportsCol.insertMany(reportsData);
  console.log(`✅ Stored ${reportsData.length} reports & audit logs in 'reports' collection.`);

  // ----------------------------------------------------
  // VERIFY TOTALS ACROSS CLUSTER
  // ----------------------------------------------------
  const collections = await db.listCollections().toArray();
  console.log('\n====================================================');
  console.log('🎉 METRA-VERIFY DATABASE SEEDED ON MONGODB ATLAS!');
  console.log('====================================================');
  console.log(`📂 Database: ${db.databaseName}`);
  console.log(`📊 Total Collections: ${collections.length}`);

  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`   📁 ${col.name.padEnd(16)} : ${count} documents`);
  }
  console.log('====================================================\n');

  await client.close();
}

seedMongo().catch((err) => {
  console.error('Fatal Seeder Error:', err);
  process.exit(1);
});
