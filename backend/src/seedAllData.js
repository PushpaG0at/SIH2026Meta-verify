import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve MongoDB URI from .env
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

async function seedDatabase() {
  console.log('🌿 Connecting to MongoDB Atlas cluster at: metraaveri.kixllni.mongodb.net...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const db = client.db('metra_verify');
  console.log('⚡ Connected to database: [metra_verify]');

  const defaultPasswordHash = crypto.createHash('sha256').update('password123').digest('hex');

  // =========================================================================  // Drop existing indexes on all collections to prevent legacy index collision
  for (const cName of ['users', 'instruments', 'applications', 'assignments', 'certificates', 'reports', 'system_metadata']) {
    try {
      await db.collection(cName).dropIndexes();
    } catch {
      // ignore
    }
  }
  const usersCol = db.collection('users');
  await usersCol.deleteMany({});

  const usersData = [
    // Primary User: Pushpendra Singh
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
      gstin: '07AAAPS95734Z1',
      address: 'Plot 24, Cyber Park & Logistics Complex, Sector 18, New Delhi - 110001',
      permissions: ['ALL_PORTALS', 'BUSINESS_ADMIN', 'INSPECTOR_DESK', 'OFFICER_DESK', 'SUPER_ADMIN'],
      isPrimaryAccount: true,
      verifiedKYC: true,
      totalInstrumentsCount: 4,
      activeCertificatesCount: 2,
      createdAt: new Date('2026-01-01')
    },
    // Business Owners
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
      orgName: 'Shree Express Freight Logistics',
      licenseNo: '07BBBCC1122D1Z9',
      address: 'Plot 88, Transport Nagar, GT Karnal Road, Delhi',
      createdAt: new Date('2026-02-10')
    },
    {
      id: 'usr_biz_04',
      name: 'Harish Mehta',
      email: 'harish@scrapex.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98222 33445',
      orgName: 'Global Scrap Metals Depot',
      licenseNo: '07AAAFG8812K1Z4',
      address: 'Warehouse 9, Ring Road Bypass, Ghaziabad - 201001',
      createdAt: new Date('2026-02-15')
    },
    {
      id: 'usr_biz_05',
      name: 'Sunil Kalyan',
      email: 'sunil@kalyanoil.com',
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
      id: 'usr_biz_07',
      name: 'Suresh Yadav',
      email: 'suresh@rajdhanidairy.org',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98999 11223',
      orgName: 'Rajdhani Dairy Federation',
      licenseNo: '07AAARD5541L1Z2',
      address: 'Chilling Plant 3, Outer Ring Road, Bawana Industrial Area, Delhi',
      createdAt: new Date('2026-02-28')
    },
    {
      id: 'usr_biz_08',
      name: 'Priya Patel',
      email: 'priya@gujaratsteel.co.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98790 12345',
      orgName: 'Gujarat Steel & Alloys Ltd.',
      licenseNo: '24AAACG9912F1ZX',
      address: 'Plot 101, GIDC Industrial Estate, Ahmedabad - 382445',
      createdAt: new Date('2026-03-01')
    },
    // Inspectors
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
    // Verification Officers
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
      id: 'usr_off_03',
      name: 'Deepa Nair',
      email: 'deepa.nair@metraverify.internal',
      passwordHash: defaultPasswordHash,
      role: 'OFFICER',
      phone: '+91 98470 33221',
      designation: 'Senior Legal Metrology Officer (Adjudications)',
      orgName: 'Legal Metrology Appellate Directorate',
      licenseNo: 'OFF-SR-DEEPA-N',
      createdAt: new Date('2026-01-14')
    },
    // System Admin & Preset Demos
    {
      id: 'usr_admin_01',
      name: 'System Administrator',
      email: 'admin@metraverify.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      phone: '+91 99999 00000',
      orgName: 'Ministry of Consumer Affairs, Food & Public Distribution',
      createdAt: new Date('2026-01-01')
    },
    {
      id: 'usr_demo_biz',
      name: 'Commercial Enterprise Trader',
      email: 'business@metra-demo.in',
      passwordHash: defaultPasswordHash,
      role: 'BUSINESS',
      phone: '+91 98112 34567',
      orgName: 'Standard Demo Commercial Traders',
      createdAt: new Date('2026-01-01')
    },
    {
      id: 'usr_demo_insp',
      name: 'Field Verification Inspector',
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

  // =========================================================================
  // 2. INSTRUMENTS COLLECTION (Pushpendra Singh + All Network Instruments)
  // =========================================================================
  const instrumentsCol = db.collection('instruments');
  await instrumentsCol.deleteMany({});
  await instrumentsCol.createIndex({ serialNumber: 1 });
  await instrumentsCol.createIndex({ uin: 1 });
  await instrumentsCol.createIndex({ businessId: 1 });
  await instrumentsCol.createIndex({ ownerEmail: 1 });

  const instrumentsData = [
    // --- Pushpendra Singh's Instruments ---
    {
      id: 'MV-INS-PS-001',
      uin: 'IND-LM-2026-PS01-95734',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      ownerName: 'Pushpendra Singh',
      ownerEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      instrumentType: 'Digital Weighing Scale',
      category: 'Non-Automatic Weighing Instrument (NAWI)',
      brand: 'Pushpa Metrology Tech',
      modelNo: 'PM-DS-95734 Ultra-Precision',
      serialNumber: 'PS-SN-9573401',
      maxCapacity: 60.0,
      minCapacity: 0.1,
      leastCount: 0.002,
      verificationDivision: 'e = 2 g, d = 0.5 g',
      accuracyClass: 'Class III (Medium Accuracy)',
      modelApprovalNumber: 'IND-DLM-2026-PS-0957',
      purchaseDate: new Date('2025-05-10'),
      location: 'Main Logistics & Distribution Bay A, Cyber Park, Sector 18, New Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      lastVerifiedDate: new Date('2026-09-05'),
      nextDueCheck: new Date('2027-09-05'),
      status: 'VERIFIED',
      activeCertificateId: 'MV-CERT-PS95734-01',
      sealNumber: 'MV-SEAL-2026-PS95734',
      telematicsStatus: 'ACTIVE',
      tamperState: 'SECURED_INTACT',
      applicationsCount: 2,
      createdAt: new Date('2025-05-12')
    },
    {
      id: 'MV-INS-PS-002',
      uin: 'IND-LM-2026-PS02-95734',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      ownerName: 'Pushpendra Singh',
      ownerEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      instrumentType: 'Heavy Duty Platform Scale',
      category: 'Industrial Platform Scale',
      brand: 'Pushpa-Apex Metrology Systems',
      modelNo: 'PM-PL-3000 Heavy Master',
      serialNumber: 'PS-SN-9573402',
      maxCapacity: 3000.0,
      minCapacity: 5.0,
      leastCount: 0.05,
      verificationDivision: 'e = 50 g, d = 20 g',
      accuracyClass: 'Class III (Industrial)',
      modelApprovalNumber: 'IND-DLM-2026-PL-0958',
      purchaseDate: new Date('2025-08-20'),
      location: 'Heavy Freight Terminal & Loading Bay 4, Sector 18, New Delhi',
      latitude: 28.6145,
      longitude: 77.2085,
      lastVerifiedDate: new Date('2025-09-20'),
      nextDueCheck: new Date('2026-09-20'),
      status: 'INSPECTION_SCHEDULED',
      activeCertificateId: null,
      telematicsStatus: 'PENDING_VISIT',
      tamperState: 'SECURED_INTACT',
      applicationsCount: 1,
      createdAt: new Date('2025-08-25')
    },
    {
      id: 'MV-INS-PS-003',
      uin: 'IND-LM-2026-PS03-95734',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      ownerName: 'Pushpendra Singh',
      ownerEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      instrumentType: 'Precision Laboratory Micro-Balance',
      category: 'Fine Chemical Analytical Balance',
      brand: 'Pushpa-Sartorius Ultra-Lab',
      modelNo: 'SRT-PREC-95734 Precision Pro',
      serialNumber: 'PS-SN-9573403',
      maxCapacity: 0.500,
      minCapacity: 0.000001,
      leastCount: 0.0000001,
      verificationDivision: 'e = 1 mg, d = 0.1 mg',
      accuracyClass: 'Class I (Special High Precision)',
      modelApprovalNumber: 'IND-DLM-2026-PR-0959',
      purchaseDate: new Date('2026-01-15'),
      location: 'Advanced Calibration & Metrology Cleanroom Lab, New Delhi',
      latitude: 28.6210,
      longitude: 77.2140,
      lastVerifiedDate: null,
      nextDueCheck: new Date('2026-09-25'),
      status: 'OFFICER_REVIEW',
      activeCertificateId: null,
      telematicsStatus: 'CALIBRATED',
      tamperState: 'SECURED_INTACT',
      applicationsCount: 1,
      createdAt: new Date('2026-01-20')
    },
    {
      id: 'MV-INS-PS-004',
      uin: 'IND-LM-2026-PS04-95734',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      ownerName: 'Pushpendra Singh',
      ownerEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      instrumentType: 'Automatic Checkweigher Belt',
      category: 'Automatic Gravimetric Filling & Checkweighing',
      brand: 'Pushpa-Ishida Dynamic Systems',
      modelNo: 'PM-CKW-95734 Dynamic',
      serialNumber: 'PS-SN-9573404',
      maxCapacity: 25.0,
      minCapacity: 0.02,
      leastCount: 0.001,
      verificationDivision: 'e = 1 g, d = 0.2 g',
      accuracyClass: 'Class XIII(1) Automatic',
      modelApprovalNumber: 'IND-DLM-2026-AC-0960',
      purchaseDate: new Date('2025-11-10'),
      location: 'Automated High-Speed Packaging Conveyor Line 2, New Delhi',
      latitude: 28.6150,
      longitude: 77.2095,
      lastVerifiedDate: new Date('2026-08-15'),
      nextDueCheck: new Date('2027-08-15'),
      status: 'VERIFIED',
      activeCertificateId: 'MV-CERT-PS95734-04',
      sealNumber: 'MV-SEAL-2026-PS95735',
      telematicsStatus: 'ACTIVE',
      tamperState: 'SECURED_INTACT',
      applicationsCount: 1,
      createdAt: new Date('2025-11-15')
    },
    // --- Other Network Instruments ---
    {
      id: 'MV-INS-000123',
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
      id: 'MV-INS-000124',
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
      id: 'MV-INS-000125',
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
      telematicsStatus: 'UNSEALED',
      createdAt: new Date('2026-01-15')
    },
    {
      id: 'MV-INS-000999',
      uin: 'METRA-2026-WB-000999',
      businessId: 'usr_biz_04',
      businessName: 'Global Scrap Metals Depot',
      ownerName: 'Harish Mehta',
      ownerEmail: 'harish@scrapex.in',
      instrumentType: 'Weighbridge Truck Scale (60T)',
      category: 'Heavy Vehicular Weighbridge',
      brand: 'Avery Weigh-Tronix',
      modelNo: 'BridgeMaster Pro-60',
      serialNumber: 'AV-BM-60T-99',
      maxCapacity: 60000.0,
      minCapacity: 400.0,
      leastCount: 5.0,
      verificationDivision: 'e = 20 kg, d = 10 kg',
      accuracyClass: 'Class IV (Heavy Industrial)',
      modelApprovalNumber: 'IND-DLM-2022-WB-0419',
      purchaseDate: new Date('2023-06-15'),
      location: 'Warehouse 9, Ring Road Bypass, Ghaziabad',
      latitude: 28.7112,
      longitude: 77.1550,
      lastVerifiedDate: new Date('2026-01-10'),
      nextDueCheck: new Date('2026-06-24'),
      status: 'TAMPER_ALERT',
      activeCertificateId: null,
      telematicsStatus: 'BYPASS_DETECTED',
      createdAt: new Date('2023-06-20')
    },
    {
      id: 'MV-INS-000142',
      uin: 'METRA-2026-FDM-000142',
      businessId: 'usr_biz_05',
      businessName: 'Kalyan Oil Depot & Fuel',
      ownerName: 'Sunil Kalyan',
      ownerEmail: 'sunil@kalyanoil.com',
      instrumentType: 'Fuel Dispenser Flow Meter',
      category: 'Continuous Measuring System for Liquids',
      brand: 'Tokheim Metrology Global',
      modelNo: 'TK-QUANTUM-4',
      serialNumber: 'TK-88391-B',
      maxCapacity: 70.0,
      minCapacity: 5.0,
      leastCount: 0.005,
      verificationDivision: 'e = 0.01 L, d = 0.005 L',
      accuracyClass: 'Class 0.5 (Liquid Fuel Standard)',
      modelApprovalNumber: 'IND-DLM-2024-FM-0822',
      purchaseDate: new Date('2024-03-01'),
      location: 'Plot 12, Industrial Area Phase 1, Gurugram',
      latitude: 28.4595,
      longitude: 77.0266,
      lastVerifiedDate: new Date('2025-08-15'),
      nextDueCheck: new Date('2026-08-15'),
      status: 'VERIFIED',
      activeCertificateId: 'MV-2025-000089',
      sealNumber: 'MV-SEAL-2026-10022',
      telematicsStatus: 'ACTIVE',
      createdAt: new Date('2024-03-10')
    }
  ];

  await instrumentsCol.insertMany(instrumentsData);
  console.log(`✅ Stored ${instrumentsData.length} instruments in 'instruments' collection.`);

  // =========================================================================
  // 3. APPLICATIONS COLLECTION (Pushpendra Singh + All Network Applications)
  // =========================================================================
  const applicationsCol = db.collection('applications');
  await applicationsCol.deleteMany({});
  await applicationsCol.createIndex({ id: 1 });
  await applicationsCol.createIndex({ businessId: 1 });
  await applicationsCol.createIndex({ instrumentId: 1 });

  const applicationsData = [
    // Pushpendra Singh's Applications
    {
      id: 'MV-APP-PS95734-01',
      instrumentId: 'MV-INS-PS-001',
      instrumentType: 'Digital Weighing Scale',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      submissionDate: new Date('2026-09-01'),
      status: 'APPROVED',
      currentStep: 8,
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: 'MV-CERT-PS95734-01',
      riskScore: 12,
      riskLevel: 'LOW',
      slaRemainingDays: 0,
      statutoryFee: {
        amount: '₹2,500.00',
        receiptNo: 'MTR-FEE-PS-001',
        paidAt: '01/09/2026 10:14 IST',
        paymentMode: 'Bharat BillPay Gateway'
      },
      traderDetails: {
        proprietor: 'Pushpendra Singh',
        email: 'PuhspaGOat-singhpushpendra95734@gmail.com',
        phone: '+91 95734 00000',
        gstin: '07AAAPS95734Z1',
        address: 'Plot 24, Cyber Park & Logistics Complex, Sector 18, New Delhi - 110001'
      },
      instrumentDetails: {
        category: 'Non-Automatic Weighing Instrument (NAWI)',
        manufacturer: 'Pushpa Metrology Tech',
        model: 'PM-DS-95734 Ultra-Precision',
        serialNumber: 'PS-SN-9573401',
        accuracyClass: 'Class III (Medium Accuracy)',
        maxCapacity: '60 kg',
        minCapacity: '100 g',
        verificationDivision: '2 g (e)',
        scaleInterval: '0.5 g (d)',
        modelApprovalNumber: 'IND-DLM-2026-PS-0957'
      },
      chainOfCustodyHash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
      riskFactors: [
        'Document OCR match verified at 100% confidence',
        'Valid manufacturer type approval registration on file',
        'Class III tolerance compliance within Schedule VII parameters'
      ],
      ocrComparison: [
        { field: 'Serial Number', dbValue: 'PS-SN-9573401', docValue: 'PS-SN-9573401', status: 'MATCH' },
        { field: 'Manufacturer', dbValue: 'Pushpa Metrology Tech', docValue: 'Pushpa Metrology Tech', status: 'MATCH' },
        { field: 'Model', dbValue: 'PM-DS-95734 Ultra-Precision', docValue: 'PM-DS-95734 Ultra-Precision', status: 'MATCH' },
        { field: 'Max Capacity', dbValue: '60 kg', docValue: '60 kg', status: 'MATCH' }
      ],
      documents: [
        { name: 'Purchase_Invoice_PSSN9573401.pdf', size: '2.1 MB', uploadedAt: '2026-09-01 10:15', status: 'Verified' },
        { name: 'Pushpa_Model_Approval_Certificate.pdf', size: '2.8 MB', uploadedAt: '2026-09-01 10:17', status: 'Verified' },
        { name: 'Baseline_Calibration_Chart.pdf', size: '1.4 MB', uploadedAt: '2026-09-01 10:20', status: 'Verified' },
        { name: 'Statutory_Fee_Challan.pdf', size: '0.9 MB', uploadedAt: '2026-09-01 10:22', status: 'Verified' }
      ],
      createdAt: new Date('2026-09-01')
    },
    {
      id: 'MV-APP-PS95734-02',
      instrumentId: 'MV-INS-PS-002',
      instrumentType: 'Heavy Duty Platform Scale',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      submissionDate: new Date('2026-09-04'),
      status: 'INSPECTION',
      currentStep: 4,
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: null,
      riskScore: 24,
      riskLevel: 'LOW',
      slaRemainingDays: 2.1,
      statutoryFee: {
        amount: '₹5,000.00',
        receiptNo: 'MTR-FEE-PS-002',
        paidAt: '04/09/2026 11:25 IST',
        paymentMode: 'Net Banking'
      },
      traderDetails: {
        proprietor: 'Pushpendra Singh',
        email: 'PuhspaGOat-singhpushpendra95734@gmail.com',
        phone: '+91 95734 00000',
        gstin: '07AAAPS95734Z1',
        address: 'Heavy Freight Terminal & Loading Bay 4, Sector 18, New Delhi'
      },
      instrumentDetails: {
        category: 'Industrial Platform Scale',
        manufacturer: 'Pushpa-Apex Metrology Systems',
        model: 'PM-PL-3000 Heavy Master',
        serialNumber: 'PS-SN-9573402',
        accuracyClass: 'Class III (Industrial)',
        maxCapacity: '3000 kg',
        minCapacity: '5 kg',
        verificationDivision: '50 g (e)',
        scaleInterval: '20 g (d)',
        modelApprovalNumber: 'IND-DLM-2026-PL-0958'
      },
      chainOfCustodyHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      riskFactors: ['High capacity industrial platform scale (3000 kg) requires heavy crane calibration test slabs'],
      ocrComparison: [
        { field: 'Serial Number', dbValue: 'PS-SN-9573402', docValue: 'PS-SN-9573402', status: 'MATCH' },
        { field: 'Manufacturer', dbValue: 'Pushpa-Apex Metrology Systems', docValue: 'Pushpa-Apex Metrology Systems', status: 'MATCH' },
        { field: 'Max Capacity', dbValue: '3000 kg', docValue: '3000 kg', status: 'MATCH' }
      ],
      documents: [
        { name: 'Apex_Invoice_PS9573402.pdf', size: '2.3 MB', uploadedAt: '2026-09-04 11:30', status: 'Verified' }
      ],
      createdAt: new Date('2026-09-04')
    },
    {
      id: 'MV-APP-PS95734-03',
      instrumentId: 'MV-INS-PS-003',
      instrumentType: 'Precision Laboratory Micro-Balance',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      submissionDate: new Date('2026-09-07'),
      status: 'OFFICER_REVIEW',
      currentStep: 6,
      assignedInspector: 'Insp. Kavita Iyer (Badge: INSP-SZ-2011)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      certificateId: null,
      riskScore: 18,
      riskLevel: 'LOW',
      slaRemainingDays: 2.8,
      statutoryFee: {
        amount: '₹3,500.00',
        receiptNo: 'MTR-FEE-PS-003',
        paidAt: '07/09/2026 09:10 IST',
        paymentMode: 'Corporate Card'
      },
      traderDetails: {
        proprietor: 'Pushpendra Singh',
        email: 'PuhspaGOat-singhpushpendra95734@gmail.com',
        phone: '+91 95734 00000',
        gstin: '07AAAPS95734Z1',
        address: 'Advanced Calibration & Metrology Cleanroom Lab, New Delhi'
      },
      instrumentDetails: {
        category: 'Fine Chemical Analytical Balance',
        manufacturer: 'Pushpa-Sartorius Ultra-Lab',
        model: 'SRT-PREC-95734 Precision Pro',
        serialNumber: 'PS-SN-9573403',
        accuracyClass: 'Class I (Special High Precision)',
        maxCapacity: '500 g',
        minCapacity: '1 mg',
        verificationDivision: '1 mg (e)',
        scaleInterval: '0.1 mg (d)',
        modelApprovalNumber: 'IND-DLM-2026-PR-0959'
      },
      chainOfCustodyHash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      riskFactors: ['Class I precision balance verified with E2 standard reference weights in temperature-controlled room'],
      ocrComparison: [
        { field: 'Serial Number', dbValue: 'PS-SN-9573403', docValue: 'PS-SN-9573403', status: 'MATCH' },
        { field: 'Manufacturer', dbValue: 'Pushpa-Sartorius Ultra-Lab', docValue: 'Pushpa-Sartorius Ultra-Lab', status: 'MATCH' }
      ],
      documents: [
        { name: 'Precision_E2_Certificate.pdf', size: '3.1 MB', uploadedAt: '2026-09-07 09:12', status: 'Verified' }
      ],
      createdAt: new Date('2026-09-07')
    },
    {
      id: 'MV-APP-PS95734-04',
      instrumentId: 'MV-INS-PS-004',
      instrumentType: 'Automatic Checkweigher Belt',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      submissionDate: new Date('2026-08-15'),
      status: 'APPROVED',
      currentStep: 8,
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      assignedOfficer: 'Shri R. Sen',
      certificateId: 'MV-CERT-PS95734-04',
      riskScore: 20,
      riskLevel: 'LOW',
      slaRemainingDays: 0,
      statutoryFee: {
        amount: '₹4,000.00',
        receiptNo: 'MTR-FEE-PS-004',
        paidAt: '15/08/2026 14:20 IST',
        paymentMode: 'Net Banking'
      },
      traderDetails: {
        proprietor: 'Pushpendra Singh',
        email: 'PuhspaGOat-singhpushpendra95734@gmail.com',
        phone: '+91 95734 00000',
        gstin: '07AAAPS95734Z1',
        address: 'Conveyor Line 2, Industrial Complex, New Delhi'
      },
      instrumentDetails: {
        category: 'Automatic Gravimetric Filling & Checkweighing',
        manufacturer: 'Pushpa-Ishida Dynamic Systems',
        model: 'PM-CKW-95734 Dynamic',
        serialNumber: 'PS-SN-9573404',
        accuracyClass: 'Class XIII(1) Automatic',
        maxCapacity: '25 kg',
        minCapacity: '20 g',
        verificationDivision: '1 g (e)',
        scaleInterval: '0.2 g (d)',
        modelApprovalNumber: 'IND-DLM-2026-AC-0960'
      },
      chainOfCustodyHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      documents: [
        { name: 'Factory_Calibration_Report.pdf', size: '2.7 MB', uploadedAt: '2026-08-15 14:25', status: 'Verified' }
      ],
      createdAt: new Date('2026-08-15')
    },
    // Other Network Applications
    {
      id: 'MV-APP-000123',
      instrumentId: 'MV-INS-000123',
      instrumentType: 'Digital Weighing Scale',
      businessId: 'usr_biz_02',
      businessName: 'Sharma Traders & Co.',
      submissionDate: new Date('2026-09-01'),
      status: 'OFFICER_REVIEW',
      currentStep: 6,
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      riskScore: 25,
      riskLevel: 'LOW',
      slaRemainingDays: 1.5,
      statutoryFee: {
        amount: '₹1,250.00',
        receiptNo: 'MTR-FEE-2026-8819',
        paidAt: '01/09/2026 10:14 IST',
        paymentMode: 'Bharat BillPay Gateway'
      },
      createdAt: new Date('2026-09-01')
    },
    {
      id: 'MV-APP-000126',
      instrumentId: 'MV-INS-000999',
      instrumentType: 'Weighbridge Truck Scale (60T)',
      businessId: 'usr_biz_04',
      businessName: 'Global Scrap Metals Depot',
      submissionDate: new Date('2026-09-06'),
      status: 'OFFICER_REVIEW',
      currentStep: 6,
      assignedInspector: 'Insp. S. K. Verma (INSP-WZ-1092)',
      assignedOfficer: 'Dr. Anita Deshmukh',
      riskScore: 78,
      riskLevel: 'HIGH',
      slaRemainingDays: 0.8,
      statutoryFee: {
        amount: '₹5,000.00',
        receiptNo: 'MTR-FEE-2026-9921',
        paidAt: '06/09/2026 11:30 IST',
        paymentMode: 'NEFT Transfer'
      },
      createdAt: new Date('2026-09-06')
    }
  ];

  await applicationsCol.insertMany(applicationsData);
  console.log(`✅ Stored ${applicationsData.length} applications in 'applications' collection.`);

  // =========================================================================
  // 4. ASSIGNMENTS COLLECTION (Pushpendra Singh + All Network Field Inspections)
  // =========================================================================
  const assignmentsCol = db.collection('assignments');
  await assignmentsCol.deleteMany({});
  await assignmentsCol.createIndex({ id: 1 });
  await assignmentsCol.createIndex({ businessId: 1 });
  await assignmentsCol.createIndex({ instrumentId: 1 });
  await assignmentsCol.createIndex({ contactEmail: 1 });

  const assignmentsData = [
    // Pushpendra Singh's Assignments
    {
      id: 'INSP-2026-PS-001',
      applicationId: 'MV-APP-PS95734-01',
      instrumentId: 'MV-INS-PS-001',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      contactPerson: 'Pushpendra Singh',
      contactEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      businessPhone: '+91 95734 00000',
      instrumentType: 'Digital Weighing Scale',
      category: 'Non-Automatic Weighing Instrument (NAWI)',
      serialNumber: 'PS-SN-9573401',
      manufacturer: 'Pushpa Metrology Tech',
      model: 'PM-DS-95734 Ultra-Precision',
      accuracyClass: 'Class III',
      maxCapacity: '60 kg',
      minCapacity: '100 g',
      verificationDivision: '2 g (e)',
      location: 'Main Logistics & Distribution Bay A, Cyber Park, Sector 18, New Delhi',
      scheduledDate: '2026-09-05',
      timeSlot: '11:00 AM - 12:15 PM',
      priority: 'NORMAL',
      riskScore: 12,
      status: 'COMPLETED',
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      targetGps: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'Plot 24, Cyber Park & Logistics Complex, Sector 18, New Delhi',
        geofenceRadiusMeters: 50
      },
      standardWeightsRequired: 'Class M1 Standard Weights (5kg, 10kg, 20kg calibrated blocks)',
      completedAt: '2026-09-05 11:30 AM IST',
      inspectionReport: {
        checklist: {
          instrumentAvailable: true,
          serialNumberVisible: true,
          manufacturerDetailsVisible: true,
          displayFunctioning: true,
          requiredMarkingsVisible: true,
          requiredDocumentsAvailable: true
        },
        gpsLocation: '28.6139° N, 77.2090° E (Geofence Verified • 3.4m precision)',
        timestamp: '05/09/2026, 11:28:10 AM IST',
        measurements: [
          { testWeight: '10 kg Class M1 Standard', readingKg: 10.000, errorG: 0, toleranceG: 5, result: 'PASS' },
          { testWeight: '30 kg Class M1 Standard', readingKg: 30.001, errorG: 1, toleranceG: 10, result: 'PASS' },
          { testWeight: '60 kg Full Scale Test', readingKg: 60.002, errorG: 2, toleranceG: 15, result: 'PASS' }
        ],
        photoCount: 5,
        sealNumber: 'MV-SEAL-2026-PS95734',
        recommendation: 'RECOMMEND_APPROVAL',
        remarks: 'Device verified in pristine condition. Zero drift observed. Complies with Legal Metrology Rules 2011.'
      },
      createdAt: new Date('2026-09-02')
    },
    {
      id: 'INSP-2026-PS-002',
      applicationId: 'MV-APP-PS95734-02',
      instrumentId: 'MV-INS-PS-002',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      contactPerson: 'Pushpendra Singh',
      contactEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      businessPhone: '+91 95734 00000',
      instrumentType: 'Heavy Duty Platform Scale',
      category: 'Industrial Platform Scale',
      serialNumber: 'PS-SN-9573402',
      manufacturer: 'Pushpa-Apex Metrology Systems',
      model: 'PM-PL-3000 Heavy Master',
      accuracyClass: 'Class III',
      maxCapacity: '3000 kg',
      minCapacity: '5 kg',
      verificationDivision: '50 g (e)',
      location: 'Heavy Freight Terminal & Loading Bay 4, Sector 18, New Delhi',
      scheduledDate: '2026-09-20',
      timeSlot: '10:00 AM - 11:30 AM',
      priority: 'HIGH',
      riskScore: 24,
      status: 'PENDING',
      assignedInspector: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      targetGps: {
        lat: 28.6145,
        lng: 77.2085,
        address: 'Sector 18 Freight Terminal, New Delhi',
        geofenceRadiusMeters: 50
      },
      standardWeightsRequired: 'Class M1 500kg & 1000kg test block crane slabs',
      createdAt: new Date('2026-09-04')
    },
    {
      id: 'INSP-2026-PS-003',
      applicationId: 'MV-APP-PS95734-03',
      instrumentId: 'MV-INS-PS-003',
      businessId: 'usr_pushpa_01',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      contactPerson: 'Pushpendra Singh',
      contactEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      businessPhone: '+91 95734 00000',
      instrumentType: 'Precision Laboratory Micro-Balance',
      category: 'Fine Chemical Analytical Balance',
      serialNumber: 'PS-SN-9573403',
      manufacturer: 'Pushpa-Sartorius Ultra-Lab',
      model: 'SRT-PREC-95734 Precision Pro',
      accuracyClass: 'Class I',
      maxCapacity: '500 g',
      minCapacity: '1 mg',
      verificationDivision: '1 mg (e)',
      location: 'Advanced Calibration & Metrology Cleanroom Lab, New Delhi',
      scheduledDate: '2026-09-08',
      timeSlot: '02:00 PM - 03:15 PM',
      priority: 'MEDIUM',
      riskScore: 18,
      status: 'COMPLETED',
      assignedInspector: 'Insp. Kavita Iyer (Badge: INSP-SZ-2011)',
      targetGps: {
        lat: 28.6210,
        lng: 77.2140,
        address: 'Metrology Cleanroom Lab, New Delhi',
        geofenceRadiusMeters: 30
      },
      standardWeightsRequired: 'Class E2 High-Precision Metric Analytical Weights',
      completedAt: '2026-09-08 02:45 PM IST',
      inspectionReport: {
        checklist: {
          instrumentAvailable: true,
          serialNumberVisible: true,
          draftShieldFunctional: true,
          zeroBalanceFunctional: true,
          requiredMarkingsVisible: true
        },
        measurements: [
          { testWeight: '100 g E2 Standard', readingKg: 0.1000001, errorG: 0.0001, toleranceG: 0.0002, result: 'PASS' },
          { testWeight: '250 g E2 Standard', readingKg: 0.2500000, errorG: 0.0000, toleranceG: 0.0003, result: 'PASS' },
          { testWeight: '500 g E2 Standard', readingKg: 0.4999998, errorG: -0.0002, toleranceG: 0.0005, result: 'PASS' }
        ],
        photoCount: 4,
        recommendation: 'RECOMMEND_APPROVAL',
        remarks: 'Cleanroom balance verified with zero thermal drift. Class I performance validated.'
      },
      createdAt: new Date('2026-09-07')
    },
    // Other Network Field Inspections
    {
      id: 'INSP-2026-00104',
      applicationId: 'MV-APP-000124',
      instrumentId: 'MV-INS-000124',
      businessName: 'Sharma Traders & Co.',
      contactPerson: 'Rajesh Sharma',
      businessPhone: '+91 98765 43210',
      instrumentType: 'Heavy Duty Platform Scale',
      category: 'Non-Automatic Weighing Instrument (NAWI)',
      serialNumber: 'APX992811',
      scheduledDate: '2026-09-10',
      status: 'PENDING',
      createdAt: new Date('2026-09-04')
    },
    {
      id: 'INSP-2026-00098',
      applicationId: 'MV-APP-000123',
      instrumentId: 'MV-INS-000123',
      businessName: 'Sharma Traders & Co.',
      contactPerson: 'Rajesh Sharma',
      instrumentType: 'Digital Weighing Scale',
      serialNumber: 'WS123456',
      scheduledDate: '2026-09-05',
      status: 'COMPLETED',
      createdAt: new Date('2026-09-01')
    }
  ];

  await assignmentsCol.insertMany(assignmentsData);
  console.log(`✅ Stored ${assignmentsData.length} assignments in 'assignments' collection.`);

  // =========================================================================
  // 5. CERTIFICATES COLLECTION (Pushpendra Singh + All Network Certificates)
  // =========================================================================
  const certsCol = db.collection('certificates');
  await certsCol.deleteMany({});
  await certsCol.createIndex({ id: 1 });
  await certsCol.createIndex({ certificateNo: 1 });
  await certsCol.createIndex({ ownerEmail: 1 });
  await certsCol.createIndex({ instrumentId: 1 });

  const certsData = [
    // Pushpendra Singh's Certificates
    {
      id: 'MV-CERT-PS95734-01',
      certificateNo: 'MV-CERT-PS95734-01',
      applicationId: 'MV-APP-PS95734-01',
      instrumentId: 'MV-INS-PS-001',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      ownerName: 'Pushpendra Singh',
      ownerEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      businessAddress: 'Plot 24, Cyber Park & Logistics Complex, Sector 18, New Delhi - 110001',
      gstin: '07AAAPS95734Z1',
      instrumentType: 'Digital Weighing Scale',
      category: 'Non-Automatic Weighing Instrument (NAWI)',
      manufacturer: 'Pushpa Metrology Tech',
      model: 'PM-DS-95734 Ultra-Precision',
      serialNumber: 'PS-SN-9573401',
      capacity: '60 kg',
      minCapacity: '100 g',
      accuracyClass: 'Class III (Medium Accuracy)',
      verificationDivision: 'e = 2 g, d = 0.5 g',
      sealNumber: 'MV-SEAL-2026-PS95734',
      modelApprovalNumber: 'IND-DLM-2026-PS-0957',
      issueDate: '05 September 2026',
      validUntil: '05 September 2027',
      issuingOfficer: 'Dr. Anita Deshmukh',
      issuingAuthority: 'State Legal Metrology Verification Directorate, Delhi HQ',
      securityHash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
      qrPayload: 'https://metraverify.delhi.gov.in/verify?cert=MV-CERT-PS95734-01&uin=IND-LM-2026-PS01-95734&hash=9f8e7d6c',
      status: 'VALID',
      verificationCount: 58,
      createdAt: new Date('2026-09-05')
    },
    {
      id: 'MV-CERT-PS95734-04',
      certificateNo: 'MV-CERT-PS95734-04',
      applicationId: 'MV-APP-PS95734-04',
      instrumentId: 'MV-INS-PS-004',
      businessName: 'Singh Legal Metrology & Enterprise Tech',
      ownerName: 'Pushpendra Singh',
      ownerEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      businessAddress: 'Plot 24, Cyber Park & Logistics Complex, Sector 18, New Delhi - 110001',
      gstin: '07AAAPS95734Z1',
      instrumentType: 'Automatic Checkweigher Belt',
      category: 'Automatic Gravimetric Filling & Checkweighing',
      manufacturer: 'Pushpa-Ishida Dynamic Systems',
      model: 'PM-CKW-95734 Dynamic',
      serialNumber: 'PS-SN-9573404',
      capacity: '25 kg',
      minCapacity: '20 g',
      accuracyClass: 'Class XIII(1) Automatic',
      verificationDivision: 'e = 1 g, d = 0.2 g',
      sealNumber: 'MV-SEAL-2026-PS95735',
      modelApprovalNumber: 'IND-DLM-2026-AC-0960',
      issueDate: '15 August 2026',
      validUntil: '15 August 2027',
      issuingOfficer: 'Shri R. Sen',
      issuingAuthority: 'State Legal Metrology Verification Directorate',
      securityHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      qrPayload: 'https://metraverify.delhi.gov.in/verify?cert=MV-CERT-PS95734-04&uin=IND-LM-2026-PS04-95734&hash=5e6f7a8b',
      status: 'VALID',
      verificationCount: 114,
      createdAt: new Date('2026-08-15')
    },
    // Other Network Certificates
    {
      id: 'MV-CERT-000123',
      certificateNo: 'MV-CERT-000123',
      applicationId: 'MV-APP-000123',
      instrumentId: 'MV-INS-000123',
      businessName: 'Sharma Traders & Co.',
      ownerName: 'Rajesh Sharma',
      instrumentType: 'Digital Weighing Scale',
      serialNumber: 'WS123456',
      capacity: '50 kg',
      sealNumber: 'MV-SEAL-2026-09412',
      issueDate: '08 September 2026',
      validUntil: '08 September 2027',
      issuingOfficer: 'Dr. Anita Deshmukh',
      issuingAuthority: 'State Legal Metrology Verification Directorate',
      securityHash: '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a',
      status: 'VALID',
      verificationCount: 42,
      createdAt: new Date('2026-09-08')
    },
    {
      id: 'MV-2025-000089',
      certificateNo: 'MV-2025-000089',
      applicationId: 'MV-APP-000072',
      instrumentId: 'MV-INS-000142',
      businessName: 'Kalyan Oil Depot & Fuel',
      ownerName: 'Sunil Kalyan',
      instrumentType: 'Fuel Dispenser Flow Meter',
      serialNumber: 'TK-88391-B',
      capacity: '70 L/min',
      issueDate: '15 August 2024',
      validUntil: '15 August 2025',
      issuingOfficer: 'Insp. S. K. Verma',
      issuingAuthority: 'State Legal Metrology Verification Directorate',
      securityHash: '3a4b5c6d7e8f901234567890abcdef1234567890abcdef1234567890abcdef12',
      status: 'EXPIRED',
      verificationCount: 189,
      createdAt: new Date('2024-08-15')
    },
    {
      id: 'MV-2026-000999',
      certificateNo: 'MV-2026-000999',
      applicationId: 'MV-APP-000810',
      instrumentId: 'MV-INS-000999',
      businessName: 'Global Scrap Metals Depot',
      ownerName: 'Harish Mehta',
      instrumentType: 'Weighbridge Truck Scale (60T)',
      serialNumber: 'AV-BM-60T-99',
      capacity: '60,000 kg',
      issueDate: '10 January 2026',
      validUntil: 'Revoked on 24 June 2026 due to load-cell tampering notice',
      issuingOfficer: 'Dr. Anita Deshmukh',
      issuingAuthority: 'State Legal Metrology Verification Directorate',
      securityHash: 'de0192837465fecdba9876543210fedcba9876543210fedcba9876543210fedc',
      status: 'REVOKED',
      revocationReason: 'Unapproved electronic bypass circuit detected during surprise audit.',
      verificationCount: 312,
      createdAt: new Date('2026-01-10')
    }
  ];

  await certsCol.insertMany(certsData);
  console.log(`✅ Stored ${certsData.length} certificates in 'certificates' collection.`);

  // =========================================================================
  // 6. REPORTS COLLECTION (Pushpendra Singh + All Network Audit & Telematics)
  // =========================================================================
  const reportsCol = db.collection('reports');
  await reportsCol.deleteMany({});
  await reportsCol.createIndex({ id: 1 });
  await reportsCol.createIndex({ userId: 1 });
  await reportsCol.createIndex({ userEmail: 1 });

  const reportsData = [
    // Pushpendra Singh's Reports
    {
      id: 'REP-PS-2026-001',
      reportNo: 'METRA-REP-PS-001',
      title: 'Legal Metrology Compliance & Calibration Audit Report',
      userId: 'usr_pushpa_01',
      userEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      userName: 'Pushpendra Singh',
      organization: 'Singh Legal Metrology & Enterprise Tech',
      reportType: 'CALIBRATION_AUDIT',
      overallStatus: 'FULLY_COMPLIANT',
      complianceIndex: '99.4%',
      verifiedInstrumentsCount: 4,
      zeroFaultsDetected: true,
      trustChainBlockHash: '3a8f9c2d1e4b506789abcdef0123456789abcdef0123456789abcdef01234567',
      blockIndex: 8914,
      generatedAt: new Date('2026-09-08'),
      summary: 'All 4 operational instruments validated in full accordance with Legal Metrology (General) Rules 2011.'
    },
    {
      id: 'REP-PS-2026-002',
      reportNo: 'METRA-REP-PS-002',
      title: 'Real-time Field Telematics & Geofence Verification Report',
      userId: 'usr_pushpa_01',
      userEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      userName: 'Pushpendra Singh',
      organization: 'Singh Legal Metrology & Enterprise Tech',
      reportType: 'TELEMATICS_INSPECTION',
      inspector: 'Insp. Vikram Singh (INSP-NZ-4082)',
      gpsLock: '28.6139° N, 77.2090° E',
      geofenceDeviationMeters: 3.4,
      antiSpoofingStatus: 'VERIFIED_GENUINE_HARDWARE',
      signalIntegrity: '100%',
      generatedAt: new Date('2026-09-05'),
      summary: 'On-site presence confirmed within 3.4m of registered enterprise site in Sector 18, New Delhi.'
    },
    {
      id: 'REP-PS-2026-003',
      reportNo: 'METRA-REP-PS-003',
      title: 'Maximum Permissible Error (MPE) Multi-Point Accuracy Analysis',
      userId: 'usr_pushpa_01',
      userEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      userName: 'Pushpendra Singh',
      organization: 'Singh Legal Metrology & Enterprise Tech',
      reportType: 'MPE_ACCURACY_ANALYSIS',
      targetInstrument: 'PS-SN-9573401 (PM-DS-95734)',
      testStages: [
        { load: '10 kg', mpeTolerance: '±5 g', observedError: '0 g', status: 'PASS' },
        { load: '30 kg', mpeTolerance: '±10 g', observedError: '+1 g', status: 'PASS' },
        { load: '60 kg', mpeTolerance: '±15 g', observedError: '+2 g', status: 'PASS' }
      ],
      meanRelativeError: '+0.0018%',
      eccentricityCheck: 'PASSED (0.2g max variation)',
      repeatabilitySpread: '0.1g spread across 10 trials',
      generatedAt: new Date('2026-09-05')
    },
    {
      id: 'REP-PS-2026-004',
      reportNo: 'METRA-REP-PS-004',
      title: 'Blockchain Ledger Immutability & Custody Audit Trail',
      userId: 'usr_pushpa_01',
      userEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      userName: 'Pushpendra Singh',
      organization: 'Singh Legal Metrology & Enterprise Tech',
      reportType: 'BLOCKCHAIN_AUDIT_TRAIL',
      merkleRoot: '99f8d1c7e6b5a43210fedcba9876543210fedcba9876543210fedcba98765432',
      totalBlocksInEpoch: 1042,
      publicVerificationHits: 158,
      tamperAttemptsPrevented: 0,
      cryptographicSignature: 'ECDSA_SECP256K1_VERIFIED',
      generatedAt: new Date('2026-09-08')
    },
    {
      id: 'REP-PS-2026-005',
      reportNo: 'METRA-REP-PS-005',
      title: 'Annual Statutory Metrology Portfolio & Renewal Schedule',
      userId: 'usr_pushpa_01',
      userEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
      userName: 'Pushpendra Singh',
      organization: 'Singh Legal Metrology & Enterprise Tech',
      reportType: 'STATUTORY_PORTFOLIO',
      activeLicenses: ['07AAAPS95734Z1'],
      totalPaidFees: '₹15,000.00',
      nextScheduledRenewal: '05 September 2027',
      riskRating: 'TIER_1_EXEMPLARY',
      generatedAt: new Date('2026-09-08')
    },
    // Other Network System Reports
    {
      id: 'REP-SYS-001',
      reportNo: 'METRA-SYS-001',
      title: 'Zone 4 Regional Metrology Inspection Summary',
      reportType: 'SYSTEM_AUDIT',
      jurisdiction: 'Zone 4 - North Delhi Metro',
      inspectionsConducted: 142,
      complianceRate: '96.2%',
      generatedAt: new Date('2026-09-01')
    },
    {
      id: 'REP-SYS-002',
      reportNo: 'METRA-SYS-002',
      title: 'Heavy Weighbridge Anti-Tamper Telematics Sweep',
      reportType: 'TAMPER_SURVEILLANCE',
      devicesAudited: 48,
      anomaliesDetected: 1,
      targetDevice: 'AV-BM-60T-99 (Global Scrap Metals)',
      actionTaken: 'CERTIFICATE_REVOKED_NOTICE_ISSUED',
      generatedAt: new Date('2026-09-07')
    }
  ];

  await reportsCol.insertMany(reportsData);
  console.log(`✅ Stored ${reportsData.length} reports in 'reports' collection.`);

  // =========================================================================
  // 7. SYSTEM CONFIG & METADATA COLLECTION (Statutory Rules, Fees, Standards)
  // =========================================================================
  const systemCol = db.collection('system_metadata');
  await systemCol.deleteMany({});

  const systemConfigData = [
    {
      configKey: 'METRA_STATUTORY_RULES',
      title: 'Legal Metrology Act 2009 & General Rules 2011 Configuration',
      enforcementAuthority: 'Ministry of Consumer Affairs, Food and Public Distribution',
      actReference: 'Act No. 1 of 2010',
      activeSlaDays: 14,
      urgentSlaDays: 3,
      geofenceThresholdMeters: 50,
      tamperThresholdMpeMultiplier: 2.0,
      blockchainTrustChainActive: true,
      lastUpdated: new Date('2026-01-01')
    },
    {
      configKey: 'STATUTORY_FEE_SCHEDULE',
      title: 'Schedule VII Statutory Verification Fee Matrix',
      fees: [
        { category: 'Class I (High Precision Analytical Micro-Balance)', feeInr: 3500 },
        { category: 'Class II (High Accuracy Pharmaceutical Balances)', feeInr: 2500 },
        { category: 'Class III (Medium Accuracy NAWI up to 50kg)', feeInr: 1250 },
        { category: 'Class III (Industrial Platform Scales up to 3000kg)', feeInr: 5000 },
        { category: 'Class IV (Heavy Vehicular Weighbridges 50T-100T)', feeInr: 10000 },
        { category: 'Liquid Fuel Flow Dispensers (Per Nozzle)', feeInr: 2500 },
        { category: 'Automatic Checkweighers (High-Speed Conveyors)', feeInr: 4000 }
      ],
      lastUpdated: new Date('2026-01-01')
    },
    {
      configKey: 'MPE_ACCURACY_CLASSES',
      title: 'OIML R 76-1 / Schedule VII Maximum Permissible Error Limits',
      standards: [
        { class: 'Class I', verificationDivisions: '50000 <= n', mpeLow: '±0.5 e', mpeMid: '±1.0 e', mpeHigh: '±1.5 e' },
        { class: 'Class II', verificationDivisions: '100 <= n <= 100000', mpeLow: '±0.5 e', mpeMid: '±1.0 e', mpeHigh: '±1.5 e' },
        { class: 'Class III', verificationDivisions: '100 <= n <= 10000', mpeLow: '±0.5 e', mpeMid: '±1.0 e', mpeHigh: '±1.5 e' },
        { class: 'Class IIII', verificationDivisions: '100 <= n <= 1000', mpeLow: '±0.5 e', mpeMid: '±1.0 e', mpeHigh: '±1.5 e' }
      ],
      lastUpdated: new Date('2026-01-01')
    }
  ];

  await systemCol.insertMany(systemConfigData);
  console.log(`✅ Stored ${systemConfigData.length} system configuration documents in 'system_metadata' collection.`);

  // Verification Summary
  console.log('\n======================================================');
  console.log('🎉 METRA-VERIFY MONGODB ATLAS SEEDING COMPLETE');
  console.log('======================================================');
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(` 📦 Collection [${col.name}]: ${count} documents`);
  }
  console.log('======================================================\n');

  await client.close();
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
