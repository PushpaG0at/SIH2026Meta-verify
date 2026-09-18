/**
 * METRA-VERIFY Synthetic Mock Data Layer
 * 
 * DISCLAIMER:
 * All records in this file are synthetic demonstrations for SIH 2026 evaluation.
 * They do not represent real government or legal records.
 * AI analysis output is advisory decision-support only; final verification is performed by authorized personnel.
 */

export const MOCK_USERS = {
  pushpendra: {
    id: 'usr_pushpa_01',
    name: 'Pushpendra Singh',
    email: 'PuhspaGOat-singhpushpendra95734@gmail.com',
    username: 'singhpushpendra95734_db_user',
    role: 'business',
    organization: 'Singh Legal Metrology & Enterprise Tech',
    phone: '+91 95734 00000',
    address: 'Plot 24, Cyber Park & Logistics Complex, Sector 18, New Delhi - 110001',
    registrationNumber: 'GSTIN07AAAPS95734Z1',
    licenseNo: '07AAAPS95734Z1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  business: {
    id: 'usr_biz_01',
    name: 'Rajesh Sharma',
    email: 'rajesh@sharmatraders.com',
    role: 'business',
    organization: 'Sharma Traders & Co.',
    phone: '+91 98765 43210',
    address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi',
    registrationNumber: 'GSTIN07AAACS1429B1Z8',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  inspector: {
    id: 'usr_insp_02',
    name: 'Vikram Singh',
    email: 'vikram.singh@metraverify.internal',
    role: 'inspector',
    badgeNumber: 'INSP-NZ-4082',
    jurisdiction: 'Zone 4 - North Delhi Metro & Industrial Cluster',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  officer: {
    id: 'usr_off_03',
    name: 'Dr. Anita Deshmukh',
    email: 'anita.deshmukh@metraverify.internal',
    role: 'officer',
    designation: 'Authorized Legal Metrology Verification Officer',
    office: 'Directorate of Legal Metrology, State HQ',
    phone: '+91 99200 88776',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
};

export const MOCK_INSTRUMENTS = [
  {
    id: 'MV-INS-PS-001',
    uin: 'IND-LM-2026-PS01-95734',
    businessId: 'usr_pushpa_01',
    businessName: 'Singh Legal Metrology & Enterprise Tech',
    ownerName: 'Pushpendra Singh',
    ownerEmail: 'PuhspaGOat-singhpushpendra95734@gmail.com',
    instrumentType: 'Digital Weighing Scale',
    category: 'Non-Automatic Weighing Instrument (NAWI)',
    manufacturer: 'Pushpa Metrology Tech',
    brand: 'Pushpa Metrology Tech',
    model: 'PM-DS-95734 Ultra-Precision',
    modelNo: 'PM-DS-95734 Ultra-Precision',
    serialNumber: 'PS-SN-9573401',
    serialNo: 'PS-SN-9573401',
    capacity: '60 kg',
    maxCapacity: 60,
    minCapacity: 0.1,
    leastCount: 0.002,
    accuracyClass: 'Class III (Medium Accuracy)',
    verificationDivision: 'e = 2 g, d = 0.5 g',
    purchaseDate: '2025-05-10',
    location: 'Main Logistics & Distribution Bay A, Cyber Park, Sector 18, New Delhi',
    installationAddress: 'Main Logistics & Distribution Bay A, Cyber Park, Sector 18, New Delhi',
    lastVerifiedDate: '2026-09-05',
    nextDueCheck: '2027-09-05',
    status: 'VERIFIED',
    activeCertificateId: 'MV-CERT-PS95734-01',
    applicationsCount: 2
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
    manufacturer: 'Pushpa-Apex Metrology Systems',
    brand: 'Pushpa-Apex Metrology Systems',
    model: 'PM-PL-3000 Heavy Master',
    modelNo: 'PM-PL-3000 Heavy Master',
    serialNumber: 'PS-SN-9573402',
    serialNo: 'PS-SN-9573402',
    capacity: '3000 kg',
    maxCapacity: 3000,
    minCapacity: 5,
    leastCount: 0.05,
    accuracyClass: 'Class III (Industrial)',
    verificationDivision: 'e = 50 g, d = 20 g',
    purchaseDate: '2025-08-20',
    location: 'Heavy Freight Terminal & Loading Bay 4, Sector 18, New Delhi',
    installationAddress: 'Heavy Freight Terminal & Loading Bay 4, Sector 18, New Delhi',
    lastVerifiedDate: '2025-09-20',
    nextDueCheck: '2026-09-20',
    status: 'INSPECTION_SCHEDULED',
    activeCertificateId: null,
    applicationsCount: 1
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
    manufacturer: 'Pushpa-Sartorius Ultra-Lab',
    brand: 'Pushpa-Sartorius Ultra-Lab',
    model: 'SRT-PREC-95734 Precision Pro',
    modelNo: 'SRT-PREC-95734 Precision Pro',
    serialNumber: 'PS-SN-9573403',
    serialNo: 'PS-SN-9573403',
    capacity: '500 g',
    maxCapacity: 0.5,
    minCapacity: 0.000001,
    leastCount: 0.0000001,
    accuracyClass: 'Class I (Special High Precision)',
    verificationDivision: 'e = 1 mg, d = 0.1 mg',
    purchaseDate: '2026-01-15',
    location: 'Advanced Calibration & Metrology Cleanroom Lab, New Delhi',
    installationAddress: 'Advanced Calibration & Metrology Cleanroom Lab, New Delhi',
    lastVerifiedDate: null,
    nextDueCheck: '2026-09-25',
    status: 'PENDING_REVIEW',
    activeCertificateId: null,
    applicationsCount: 1
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
    manufacturer: 'Pushpa-Ishida Dynamic Systems',
    brand: 'Pushpa-Ishida Dynamic Systems',
    model: 'PM-CKW-95734 Dynamic',
    modelNo: 'PM-CKW-95734 Dynamic',
    serialNumber: 'PS-SN-9573404',
    serialNo: 'PS-SN-9573404',
    capacity: '25 kg',
    maxCapacity: 25,
    minCapacity: 0.02,
    leastCount: 0.001,
    accuracyClass: 'Class XIII(1) Automatic',
    verificationDivision: 'e = 1 g, d = 0.2 g',
    purchaseDate: '2025-11-10',
    location: 'Automated High-Speed Packaging Conveyor Line 2, New Delhi',
    installationAddress: 'Automated High-Speed Packaging Conveyor Line 2, New Delhi',
    lastVerifiedDate: '2026-08-15',
    nextDueCheck: '2027-08-15',
    status: 'VERIFIED',
    activeCertificateId: 'MV-CERT-PS95734-04',
    applicationsCount: 1
  },
  {
    id: 'MV-INS-000123',
    businessId: 'usr_biz_01',
    businessName: 'Sharma Traders & Co.',
    ownerName: 'Rajesh Sharma',
    instrumentType: 'Digital Weighing Scale',
    category: 'Non-Automatic Weighing Instrument (NAWI)',
    manufacturer: 'ABC Instruments Ltd.',
    model: 'WS-500 Industrial Precision',
    serialNumber: 'WS123456',
    capacity: '50 kg',
    accuracyClass: 'Class III (Medium Accuracy)',
    verificationDivision: 'e = 5 g, d = 1 g',
    purchaseDate: '2025-04-12',
    location: 'Main Retail Billing Counter - Bay 1, New Delhi',
    lastVerifiedDate: '2025-09-08',
    nextDueCheck: '2027-09-08',
    status: 'VERIFIED',
    activeCertificateId: 'MV-2026-000123',
    applicationsCount: 2
  },
  {
    id: 'MV-INS-000124',
    businessId: 'usr_biz_01',
    businessName: 'Sharma Traders & Co.',
    ownerName: 'Rajesh Sharma',
    instrumentType: 'Heavy Duty Platform Scale',
    category: 'Industrial Platform Scale',
    manufacturer: 'Apex Metrology Systems',
    model: 'APX-PL-1500',
    serialNumber: 'APX992811',
    capacity: '1500 kg',
    accuracyClass: 'Class III (Industrial)',
    verificationDivision: 'e = 200 g',
    purchaseDate: '2024-11-20',
    location: 'Goods Inward Warehouse & Loading Dock B, New Delhi',
    lastVerifiedDate: '2025-08-14',
    nextDueCheck: '2026-08-14',
    status: 'INSPECTION_SCHEDULED',
    activeCertificateId: null,
    applicationsCount: 1
  },
  {
    id: 'MV-INS-000125',
    businessId: 'usr_biz_01',
    businessName: 'Sharma Traders & Co.',
    ownerName: 'Rajesh Sharma',
    instrumentType: 'Precision Laboratory Micro-Balance',
    category: 'Fine Chemical Analytical Balance',
    manufacturer: 'Sartor Instruments',
    model: 'SI-PRECISION-220',
    serialNumber: 'SRT-44021',
    capacity: '220 g',
    accuracyClass: 'Class I (Special High Precision)',
    verificationDivision: 'e = 1 mg, d = 0.1 mg',
    purchaseDate: '2026-01-10',
    location: 'Quality Assurance Testing Chamber, New Delhi',
    lastVerifiedDate: null,
    nextDueCheck: '2026-09-20',
    status: 'PENDING_REVIEW',
    activeCertificateId: null,
    applicationsCount: 1
  }
];

export const MOCK_APPLICATIONS = [
  {
    id: 'MV-APP-PS95734-01',
    applicationNo: 'MV-APP-PS95734-01',
    instrumentId: 'MV-INS-PS-001',
    instrumentType: 'Digital Weighing Scale',
    businessId: 'usr_pushpa_01',
    businessName: 'Singh Legal Metrology & Enterprise Tech',
    submissionDate: '2026-09-01',
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
    inspection: {
      id: 'INSP-2026-PS-001',
      inspectorName: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      scheduledDate: '2026-09-05',
      completedDate: '2026-09-05 11:30 IST',
      gpsCoordinates: '28.6139° N, 77.2090° E (Geofence verified within 3.4m)',
      checklist: [
        { item: 'Instrument available at registered site', passed: true },
        { item: 'Serial number and model plate clearly visible & unaltered', passed: true },
        { item: 'Manufacturer details and statutory markings visible', passed: true },
        { item: 'Digital LED display functioning with zero-tracking integrity', passed: true },
        { item: 'Required regulatory seals / tamper tags intact', passed: true },
        { item: 'Standard test weight eccentric load check verified within MPE', passed: true }
      ],
      measurements: [
        { testWeight: '10 kg Class M1 Standard', readingKg: 10.000, errorG: 0, toleranceG: 5, result: 'PASS' },
        { testWeight: '30 kg Class M1 Standard', readingKg: 30.001, errorG: 1, toleranceG: 10, result: 'PASS' },
        { testWeight: '60 kg Full Scale Test', readingKg: 60.002, errorG: 2, toleranceG: 15, result: 'PASS' }
      ],
      photosCount: 5,
      sealNumber: 'MV-SEAL-2026-PS95734',
      remarks: 'Device verified in pristine condition. Zero drift observed. Tamper seal wirelock attached.',
      status: 'RECOMMENDED_FOR_APPROVAL'
    }
  },
  {
    id: 'MV-APP-PS95734-02',
    applicationNo: 'MV-APP-PS95734-02',
    instrumentId: 'MV-INS-PS-002',
    instrumentType: 'Heavy Duty Platform Scale',
    businessId: 'usr_pushpa_01',
    businessName: 'Singh Legal Metrology & Enterprise Tech',
    submissionDate: '2026-09-04',
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
    inspection: {
      id: 'INSP-2026-PS-002',
      inspectorName: 'Insp. Vikram Singh (Badge: INSP-NZ-4082)',
      scheduledDate: '2026-09-20',
      completedDate: null,
      gpsCoordinates: 'Pending Field Visit',
      status: 'ASSIGNED'
    }
  },
  {
    id: 'MV-APP-PS95734-03',
    applicationNo: 'MV-APP-PS95734-03',
    instrumentId: 'MV-INS-PS-003',
    instrumentType: 'Precision Laboratory Micro-Balance',
    businessId: 'usr_pushpa_01',
    businessName: 'Singh Legal Metrology & Enterprise Tech',
    submissionDate: '2026-09-07',
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
    inspection: {
      id: 'INSP-2026-PS-003',
      inspectorName: 'Insp. Kavita Iyer (Badge: INSP-SZ-2011)',
      scheduledDate: '2026-09-08',
      completedDate: '2026-09-08 14:45 IST',
      gpsCoordinates: '28.6210° N, 77.2140° E',
      checklist: [
        { item: 'Instrument available at registered site', passed: true },
        { item: 'Serial number visible', passed: true },
        { item: 'Draft shield and zero functional', passed: true }
      ],
      measurements: [
        { testWeight: '100 g E2 Standard', readingKg: 0.1000001, errorG: 0.0001, toleranceG: 0.0002, result: 'PASS' },
        { testWeight: '500 g E2 Standard', readingKg: 0.4999998, errorG: -0.0002, toleranceG: 0.0005, result: 'PASS' }
      ],
      photosCount: 4,
      sealNumber: 'MV-SEAL-2026-PS95736',
      remarks: 'Cleanroom balance verified with zero thermal drift. Class I performance validated.',
      status: 'RECOMMENDED_FOR_APPROVAL'
    }
  },
  {
    id: 'MV-APP-PS95734-04',
    applicationNo: 'MV-APP-PS95734-04',
    instrumentId: 'MV-INS-PS-004',
    instrumentType: 'Automatic Checkweigher Belt',
    businessId: 'usr_pushpa_01',
    businessName: 'Singh Legal Metrology & Enterprise Tech',
    submissionDate: '2026-08-15',
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
    ]
  },
  {
    id: 'MV-APP-000123',
    instrumentId: 'MV-INS-000123',
    instrumentType: 'Digital Weighing Scale',
    businessId: 'usr_biz_01',
    businessName: 'Sharma Traders & Co.',
    submissionDate: '2026-09-01',
    status: 'OFFICER_REVIEW', // 'DRAFT' | 'DOCUMENTS' | 'AI_PRECHECK' | 'SUBMITTED' | 'INSPECTION' | 'OFFICER_REVIEW' | 'APPROVED' | 'REJECTED'
    currentStep: 6, // ready for officer decision step 7
    assignedInspector: 'Vikram Singh (INSP-NZ-4082)',
    assignedOfficer: 'Dr. Anita Deshmukh',
    certificateId: null,
    riskScore: 25,
    riskLevel: 'LOW',
    slaRemainingDays: 1.5,
    statutoryFee: {
      amount: '₹1,250.00',
      receiptNo: 'MTR-FEE-2026-8819',
      paidAt: '01/09/2026 10:14 IST',
      paymentMode: 'Bharat BillPay Gateway'
    },
    traderDetails: {
      proprietor: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      gstin: '07AAACS1429B1Z8',
      address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi - 110001'
    },
    instrumentDetails: {
      category: 'Non-Automatic Weighing Instrument (NAWI)',
      manufacturer: 'ABC Instruments Ltd.',
      model: 'WS-500 Industrial Precision',
      serialNumber: 'WS123456',
      accuracyClass: 'Class III (Medium Accuracy)',
      maxCapacity: '50 kg',
      minCapacity: '100 g',
      verificationDivision: '5 g (e)',
      scaleInterval: '1 g (d)',
      modelApprovalNumber: 'IND-DLM-2024-AP-0912'
    },
    chainOfCustodyHash: '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a',
    riskFactors: [
      'Document OCR match verified at 100% confidence',
      'No past tamper or recalibration violations in repository',
      'Class III compliance matches retail category'
    ],
    ocrComparison: [
      { field: 'Serial Number', dbValue: 'WS123456', docValue: 'WS123456', status: 'MATCH' },
      { field: 'Manufacturer', dbValue: 'ABC Instruments Ltd.', docValue: 'ABC Instruments Ltd.', status: 'MATCH' },
      { field: 'Model', dbValue: 'WS-500 Industrial Precision', docValue: 'WS-500 Industrial Precision', status: 'MATCH' },
      { field: 'Instrument Type', dbValue: 'Digital Weighing Scale', docValue: 'Digital Weighing Scale', status: 'MATCH' },
      { field: 'Max Capacity', dbValue: '50 kg', docValue: '50 kg', status: 'MATCH' }
    ],
    documents: [
      { name: 'Purchase_Invoice_WS123456.pdf', size: '1.8 MB', uploadedAt: '2026-09-01 10:15', status: 'Verified' },
      { name: 'Manufacturer_Model_Approval_Certificate.pdf', size: '2.4 MB', uploadedAt: '2026-09-01 10:17', status: 'Verified' },
      { name: 'Calibration_Report_Baseline.pdf', size: '1.2 MB', uploadedAt: '2026-09-01 10:20', status: 'Verified' },
      { name: 'Statutory_Fee_Challan.pdf', size: '0.8 MB', uploadedAt: '2026-09-01 10:22', status: 'Verified' }
    ],
    inspection: {
      id: 'INSP-2026-00098',
      inspectorName: 'Vikram Singh (Badge: INSP-NZ-4082)',
      scheduledDate: '2026-09-05',
      completedDate: '2026-09-05 14:45 IST',
      gpsCoordinates: '28.6139° N, 77.2090° E (Geofence verified within 8.2m)',
      checklist: [
        { item: 'Instrument available at registered site', passed: true },
        { item: 'Serial number and model plate clearly visible & unaltered', passed: true },
        { item: 'Manufacturer details and statutory markings visible', passed: true },
        { item: 'Digital LED display functioning with zero-tracking integrity', passed: true },
        { item: 'Required regulatory seals / tamper tags intact', passed: true },
        { item: 'Standard test weight eccentric load check verified within MPE', passed: true }
      ],
      measurements: [
        { testWeight: '10 kg Class M1 Standard', readingKg: 10.000, errorG: 0, toleranceG: 10, result: 'PASS' },
        { testWeight: '25 kg Class M1 Standard', readingKg: 25.002, errorG: 2, toleranceG: 10, result: 'PASS' },
        { testWeight: '50 kg Full Scale Test', readingKg: 50.001, errorG: 1, toleranceG: 15, result: 'PASS' }
      ],
      photosCount: 4,
      sealNumber: 'MV-SEAL-2026-09412',
      remarks: 'Device verified in pristine condition. Zero drift observed. Tamper seal wirelock #MV-SEAL-2026-09412 attached.',
      status: 'RECOMMENDED_FOR_APPROVAL'
    }
  },
  {
    id: 'MV-APP-000126',
    instrumentId: 'MV-INS-000999',
    instrumentType: 'Weighbridge Truck Scale (60T)',
    businessId: 'usr_biz_04',
    businessName: 'Global Scrap Metals Depot',
    submissionDate: '2026-09-06',
    status: 'OFFICER_REVIEW',
    currentStep: 6,
    assignedInspector: 'S. K. Verma (INSP-WZ-1092)',
    assignedOfficer: 'Dr. Anita Deshmukh',
    certificateId: null,
    riskScore: 78,
    riskLevel: 'HIGH',
    slaRemainingDays: 0.8,
    statutoryFee: {
      amount: '₹5,000.00',
      receiptNo: 'MTR-FEE-2026-9921',
      paidAt: '06/09/2026 11:30 IST',
      paymentMode: 'NEFT Transfer'
    },
    traderDetails: {
      proprietor: 'Harish Mehta',
      phone: '+91 98222 33445',
      gstin: '07AAAFG8812K1Z4',
      address: 'Plot 19, Ring Road Bypass, Industrial Area, New Delhi - 110033'
    },
    instrumentDetails: {
      category: 'Heavy Vehicular Weighbridge',
      manufacturer: 'Avery Weigh-Tronix',
      model: 'BridgeMaster Pro-60',
      serialNumber: 'AV-BM-60T-99',
      accuracyClass: 'Class IV (Heavy Industrial)',
      maxCapacity: '60,000 kg',
      minCapacity: '400 kg',
      verificationDivision: '20 kg (e)',
      scaleInterval: '10 kg (d)',
      modelApprovalNumber: 'IND-DLM-2022-WB-0419'
    },
    chainOfCustodyHash: 'de0192837465fecdba9876543210fedcba9876543210fedcba9876543210fedc',
    riskFactors: [
      'Document OCR serial number mismatch: Invoice shows AV-BM-60T-88 vs Stamped AV-BM-60T-99',
      'Load cell junction box shows unapproved electronic bypass wiring during visual audit',
      'High capacity vehicle platform requires special 20-tonne mobile testing crane unit'
    ],
    ocrComparison: [
      { field: 'Serial Number', dbValue: 'AV-BM-60T-99', docValue: 'AV-BM-60T-88', status: 'MISMATCH' },
      { field: 'Manufacturer', dbValue: 'Avery Weigh-Tronix', docValue: 'Avery Weigh-Tronix', status: 'MATCH' },
      { field: 'Model', dbValue: 'BridgeMaster Pro-60', docValue: 'BridgeMaster Pro-50', status: 'MISMATCH' },
      { field: 'Max Capacity', dbValue: '60,000 kg', docValue: '60,000 kg', status: 'MATCH' }
    ],
    documents: [
      { name: 'Weighbridge_Invoice_2026.pdf', size: '3.1 MB', uploadedAt: '2026-09-06 09:15', status: 'Flagged' },
      { name: 'Civil_Foundation_Blueprint.pdf', size: '4.8 MB', uploadedAt: '2026-09-06 09:18', status: 'Verified' }
    ],
    inspection: {
      id: 'INSP-2026-00122',
      inspectorName: 'S. K. Verma (Badge: INSP-WZ-1092)',
      scheduledDate: '2026-09-07',
      completedDate: '2026-09-07 16:20 IST',
      gpsCoordinates: '28.7112° N, 77.1550° E (Geofence verified within 12m)',
      checklist: [
        { item: 'Instrument available at registered site', passed: true },
        { item: 'Serial number and model plate clearly visible & unaltered', passed: false },
        { item: 'Manufacturer details and statutory markings visible', passed: true },
        { item: 'Digital LED display functioning with zero-tracking integrity', passed: false },
        { item: 'Required regulatory seals / tamper tags intact', passed: false },
        { item: 'Standard test weight eccentric load check verified within MPE', passed: false }
      ],
      measurements: [
        { testWeight: '10,000 kg Test Block', readingKg: 10065, errorG: 65000, toleranceG: 20000, result: 'FAIL' },
        { testWeight: '30,000 kg Test Train', readingKg: 30140, errorG: 140000, toleranceG: 40000, result: 'FAIL' }
      ],
      photosCount: 3,
      sealNumber: 'REJECTED - UNSEALED',
      remarks: 'CRITICAL: Error exceeds MPE tolerance by +65kg at 10T. Tampering suspected at terminal digitizer.',
      status: 'REJECT_NONCOMPLIANT'
    }
  },
  {
    id: 'MV-APP-000124',
    instrumentId: 'MV-INS-000124',
    instrumentType: 'Heavy Duty Platform Scale',
    businessId: 'usr_biz_01',
    businessName: 'Sharma Traders & Co.',
    submissionDate: '2026-09-04',
    status: 'INSPECTION',
    currentStep: 4,
    assignedInspector: 'Vikram Singh (INSP-NZ-4082)',
    assignedOfficer: 'Dr. Anita Deshmukh',
    certificateId: null,
    riskScore: 54,
    riskLevel: 'MEDIUM',
    slaRemainingDays: 2.1,
    statutoryFee: {
      amount: '₹2,000.00',
      receiptNo: 'MTR-FEE-2026-8942',
      paidAt: '04/09/2026 11:25 IST',
      paymentMode: 'UPI AutoPay'
    },
    traderDetails: {
      proprietor: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      gstin: '07AAACS1429B1Z8',
      address: 'Goods Inward Warehouse & Loading Dock B, Central Mandi Market, New Delhi'
    },
    instrumentDetails: {
      category: 'Industrial Platform Scale',
      manufacturer: 'Apex Metrology Systems',
      model: 'APX-PL-1500',
      serialNumber: 'APX992811',
      accuracyClass: 'Class III (Industrial)',
      maxCapacity: '1500 kg',
      minCapacity: '2 kg',
      verificationDivision: '10 g (e)',
      scaleInterval: '5 g (d)',
      modelApprovalNumber: 'IND-DLM-2023-PL-0518'
    },
    chainOfCustodyHash: '3f4b5c6d7e8f901234567890abcdef1234567890abcdef1234567890abcdef12',
    riskFactors: [
      'High capacity industrial scale (1500 kg) requires heavy crane calibration weights',
      'Invoice timestamp is over 18 months old; physical wear inspection required'
    ],
    ocrComparison: [
      { field: 'Serial Number', dbValue: 'APX992811', docValue: 'APX992811', status: 'MATCH' },
      { field: 'Manufacturer', dbValue: 'Apex Metrology Systems', docValue: 'Apex Metrology Systems', status: 'MATCH' },
      { field: 'Model', dbValue: 'APX-PL-1500', docValue: 'APX-PL-1500', status: 'MATCH' },
      { field: 'Capacity', dbValue: '1500 kg', docValue: '1500 kg', status: 'MATCH' }
    ],
    documents: [
      { name: 'Invoice_Apex_APX992811.pdf', size: '2.1 MB', uploadedAt: '2026-09-04 11:30', status: 'Verified' }
    ],
    inspection: {
      id: 'INSP-2026-00104',
      inspectorName: 'Vikram Singh (Badge: INSP-NZ-4082)',
      scheduledDate: '2026-09-10',
      completedDate: null,
      gpsCoordinates: 'Pending Field Visit',
      status: 'ASSIGNED'
    }
  },
  {
    id: 'MV-APP-000125',
    instrumentId: 'MV-INS-000125',
    instrumentType: 'Precision Laboratory Micro-Balance',
    businessId: 'usr_biz_01',
    businessName: 'Sharma Traders & Co.',
    submissionDate: '2026-09-07',
    status: 'OFFICER_REVIEW',
    currentStep: 6,
    assignedInspector: 'Kavita Iyer (INSP-SZ-2011)',
    assignedOfficer: 'Dr. Anita Deshmukh',
    certificateId: null,
    riskScore: 32,
    riskLevel: 'LOW',
    slaRemainingDays: 2.8,
    statutoryFee: {
      amount: '₹3,500.00',
      receiptNo: 'MTR-FEE-2026-9041',
      paidAt: '07/09/2026 09:10 IST',
      paymentMode: 'Net Banking'
    },
    traderDetails: {
      proprietor: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      gstin: '07AAACS1429B1Z8',
      address: 'Quality Assurance Testing Chamber, Central Mandi, New Delhi'
    },
    instrumentDetails: {
      category: 'Fine Chemical Analytical Balance',
      manufacturer: 'Sartor Instruments',
      model: 'SI-PRECISION-220',
      serialNumber: 'SRT-44021',
      accuracyClass: 'Class I (Special High Precision)',
      maxCapacity: '220 g',
      minCapacity: '1 mg',
      verificationDivision: '1 mg (e)',
      scaleInterval: '0.1 mg (d)',
      modelApprovalNumber: 'IND-DLM-2025-PR-0112'
    },
    chainOfCustodyHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    riskFactors: [
      'Class I precision balance verified with E2 standard reference weights'
    ],
    ocrComparison: [
      { field: 'Serial Number', dbValue: 'SRT-44021', docValue: 'SRT-44021', status: 'MATCH' },
      { field: 'Manufacturer', dbValue: 'Sartor Instruments', docValue: 'Sartor Instruments', status: 'MATCH' },
      { field: 'Model', dbValue: 'SI-PRECISION-220', docValue: 'SI-PRECISION-220', status: 'MATCH' }
    ],
    documents: [
      { name: 'Precision_Certificate_E2.pdf', size: '3.0 MB', uploadedAt: '2026-09-07 09:12', status: 'Verified' }
    ],
    inspection: {
      id: 'INSP-2026-00118',
      inspectorName: 'Kavita Iyer (Badge: INSP-SZ-2011)',
      scheduledDate: '2026-09-08',
      completedDate: '2026-09-08 11:30 IST',
      gpsCoordinates: '28.6210° N, 77.2140° E',
      checklist: [
        { item: 'Instrument available at registered site', passed: true },
        { item: 'Serial number visible', passed: true },
        { item: 'Zero balance & draft shield functional', passed: true },
        { item: 'Required statutory markings present', passed: true }
      ],
      measurements: [
        { testWeight: '100 g E2 Standard', readingKg: 0.1000001, errorG: 0.0001, toleranceG: 0.0002, result: 'PASS' },
        { testWeight: '200 g E2 Standard', readingKg: 0.1999998, errorG: -0.0002, toleranceG: 0.0004, result: 'PASS' }
      ],
      photosCount: 3,
      sealNumber: 'MV-SEAL-2026-09881',
      remarks: 'Field tests passed. Temperature & humidity chamber controls satisfactory.',
      status: 'RECOMMENDED_FOR_APPROVAL'
    }
  },
  {
    id: 'MV-APP-000130',
    instrumentId: 'MV-INS-000142',
    instrumentType: 'Fuel Dispenser Flow Meter',
    businessId: 'usr_biz_05',
    businessName: 'Kalyan Oil Depot & Fuel',
    submissionDate: '2026-09-08',
    status: 'OFFICER_REVIEW',
    currentStep: 6,
    assignedInspector: 'Vikram Singh (INSP-NZ-4082)',
    assignedOfficer: 'Dr. Anita Deshmukh',
    certificateId: null,
    riskScore: 28,
    riskLevel: 'LOW',
    slaRemainingDays: 1.2,
    statutoryFee: {
      amount: '₹2,500.00',
      receiptNo: 'MTR-FEE-2026-9411',
      paidAt: '08/09/2026 08:45 IST',
      paymentMode: 'Net Banking'
    },
    traderDetails: {
      proprietor: 'Sunil Kalyan',
      phone: '+91 98111 22334',
      gstin: '07AABCK1092M1Z3',
      address: 'Plot 12, Industrial Area Phase 1, Gurugram - 122016'
    },
    instrumentDetails: {
      category: 'Continuous Measuring System for Liquids',
      manufacturer: 'Tokheim Metrology Global',
      model: 'TK-QUANTUM-4',
      serialNumber: 'TK-88391-B',
      accuracyClass: 'Class 0.5 (Liquid Fuel Standard)',
      maxCapacity: '70 L/min',
      minCapacity: '5 L/min',
      verificationDivision: '0.01 L (e)',
      scaleInterval: '0.005 L (d)',
      modelApprovalNumber: 'IND-DLM-2024-FM-0822'
    },
    chainOfCustodyHash: 'c1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80',
    riskFactors: [
      'Flow nozzle anti-backflow non-return valve verified',
      'Electronic totalizer tamper seal registered without breaks'
    ],
    ocrComparison: [
      { field: 'Serial Number', dbValue: 'TK-88391-B', docValue: 'TK-88391-B', status: 'MATCH' },
      { field: 'Manufacturer', dbValue: 'Tokheim Metrology Global', docValue: 'Tokheim Metrology Global', status: 'MATCH' },
      { field: 'Flow Rate', dbValue: '70 L/min', docValue: '70 L/min', status: 'MATCH' }
    ],
    documents: [
      { name: 'PESO_Explosive_Clearance_2026.pdf', size: '2.9 MB', uploadedAt: '2026-09-08 08:50', status: 'Verified' },
      { name: 'Prover_Tank_Calibration_Report.pdf', size: '1.7 MB', uploadedAt: '2026-09-08 08:55', status: 'Verified' }
    ],
    inspection: {
      id: 'INSP-2026-00128',
      inspectorName: 'Vikram Singh (Badge: INSP-NZ-4082)',
      scheduledDate: '2026-09-08',
      completedDate: '2026-09-08 17:10 IST',
      gpsCoordinates: '28.4595° N, 77.0266° E (Geofence verified within 6.1m)',
      checklist: [
        { item: 'Dispenser nozzle interlock functional', passed: true },
        { item: 'Totalizer seal wire and plastic lock intact', passed: true },
        { item: 'Zero delivery cut-off verified within 1 second', passed: true },
        { item: 'Volumetric test prover delivered within ±0.1% MPE', passed: true }
      ],
      measurements: [
        { testWeight: '5 Litre Standard Conical Prover', readingKg: 5.002, errorG: 2, toleranceG: 5, result: 'PASS' },
        { testWeight: '20 Litre Standard Test Measure', readingKg: 20.005, errorG: 5, toleranceG: 15, result: 'PASS' }
      ],
      photosCount: 4,
      sealNumber: 'MV-SEAL-2026-10022',
      remarks: 'Dispenser calibrated with 20L NABL prover. Delivery within statutory limits of Class 0.5. Certificate recommended.',
      status: 'RECOMMENDED_FOR_APPROVAL'
    }
  },
  {
    id: 'MV-APP-000132',
    instrumentId: 'MV-INS-000155',
    instrumentType: 'Automatic Checkweigher Belt',
    businessId: 'usr_biz_06',
    businessName: 'Apex FMCG Bottling Ltd.',
    submissionDate: '2026-09-07',
    status: 'OFFICER_REVIEW',
    currentStep: 6,
    assignedInspector: 'S. K. Verma (INSP-WZ-1092)',
    assignedOfficer: 'Dr. Anita Deshmukh',
    certificateId: null,
    riskScore: 65,
    riskLevel: 'HIGH',
    slaRemainingDays: 0.3,
    statutoryFee: {
      amount: '₹4,000.00',
      receiptNo: 'MTR-FEE-2026-9502',
      paidAt: '07/09/2026 14:20 IST',
      paymentMode: 'Corporate Card'
    },
    traderDetails: {
      proprietor: 'Nitin Singhal',
      phone: '+91 99333 44556',
      gstin: '07AABCA7721P1Z9',
      address: 'Industrial Plot 44, Okhla Phase III, New Delhi - 110020'
    },
    instrumentDetails: {
      category: 'Automatic Gravimetric Filling & Checkweighing',
      manufacturer: 'Ishida Metrology Systems',
      model: 'DACS-G-015',
      serialNumber: 'ISH-CKW-901',
      accuracyClass: 'Class XIII(1) Automatic',
      maxCapacity: '15 kg',
      minCapacity: '50 g',
      verificationDivision: '1 g (e)',
      scaleInterval: '0.2 g (d)',
      modelApprovalNumber: 'IND-DLM-2023-AC-0391'
    },
    chainOfCustodyHash: 'fa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b',
    riskFactors: [
      'High-speed belt rejection mechanism recorded 3 uncalibrated drops during live load simulation',
      'Statutory SLA deadline expires in under 8 hours'
    ],
    ocrComparison: [
      { field: 'Serial Number', dbValue: 'ISH-CKW-901', docValue: 'ISH-CKW-901', status: 'MATCH' },
      { field: 'Manufacturer', dbValue: 'Ishida Metrology Systems', docValue: 'Ishida Metrology Corp', status: 'MATCH' },
      { field: 'Speed Rating', dbValue: '120 packs/min', docValue: '90 packs/min', status: 'MISMATCH' }
    ],
    documents: [
      { name: 'Factory_Acceptance_Test_FAT.pdf', size: '4.2 MB', uploadedAt: '2026-09-07 14:25', status: 'Verified' }
    ],
    inspection: {
      id: 'INSP-2026-00135',
      inspectorName: 'S. K. Verma (Badge: INSP-WZ-1092)',
      scheduledDate: '2026-09-08',
      completedDate: '2026-09-08 15:40 IST',
      gpsCoordinates: '28.5355° N, 77.2730° E (Geofence verified within 9.4m)',
      checklist: [
        { item: 'Dynamic belt load cell stability check', passed: true },
        { item: 'Tare deduction repeatable under continuous throughput', passed: false },
        { item: 'Display zero drift within permissible dynamic envelope', passed: true },
        { item: 'Statutory physical nameplate unaltered', passed: true }
      ],
      measurements: [
        { testWeight: '500 g Standard Test Pack', readingKg: 0.504, errorG: 4, toleranceG: 2, result: 'FAIL' },
        { testWeight: '2000 g Standard Test Pack', readingKg: 2.003, errorG: 3, toleranceG: 4, result: 'PASS' }
      ],
      photosCount: 3,
      sealNumber: 'MV-SEAL-PENDING-CORRECTION',
      remarks: 'High-speed weighing error detected on 500g line (+4g vs ±2g MPE). Recalibration or correction notice suggested.',
      status: 'NEEDS_CORRECTION'
    }
  }
];

export const MOCK_CERTIFICATES = [
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
    status: 'VALID',
    verificationCount: 58
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
    status: 'VALID',
    verificationCount: 114
  },
  {
    id: 'MV-CERT-000123',
    applicationId: 'MV-APP-000123',
    instrumentId: 'MV-INS-000123',
    businessName: 'Sharma Traders & Co.',
    ownerName: 'Rajesh Sharma',
    businessAddress: 'Shop 42, Central Mandi Market, Sector 18, New Delhi - 110001',
    gstin: '07AAACS1429B1Z8',
    instrumentType: 'Digital Weighing Scale',
    category: 'Non-Automatic Weighing Instrument (NAWI)',
    manufacturer: 'ABC Instruments Ltd.',
    model: 'WS-500 Industrial Precision',
    serialNumber: 'WS123456',
    capacity: '50 kg',
    minCapacity: '100 g',
    accuracyClass: 'Class III (Medium Accuracy)',
    verificationDivision: 'e = 5 g, d = 1 g',
    sealNumber: 'MV-SEAL-2026-09412',
    modelApprovalNumber: 'IND-DLM-2024-AP-0912',
    issueDate: '08 September 2026',
    validUntil: '08 September 2027',
    issuingOfficer: 'Dr. Anita Deshmukh',
    issuingAuthority: 'State Legal Metrology Verification Directorate (Simulation)',
    securityHash: '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a',
    status: 'VALID', // 'VALID' | 'EXPIRED' | 'REVOKED'
    verificationCount: 42
  },
  {
    id: 'MV-2026-000123',
    applicationId: 'MV-APP-000123',
    instrumentId: 'MV-INS-000123',
    businessName: 'Sharma Traders & Co.',
    ownerName: 'Rajesh Sharma',
    businessAddress: 'Shop 42, Central Mandi Market, Sector 18, New Delhi',
    gstin: '07AAACS1429B1Z8',
    instrumentType: 'Digital Weighing Scale',
    category: 'Non-Automatic Weighing Instrument (NAWI)',
    manufacturer: 'ABC Instruments Ltd.',
    model: 'WS-500 Industrial Precision',
    serialNumber: 'WS123456',
    capacity: '50 kg',
    minCapacity: '100 g',
    accuracyClass: 'Class III (Medium Accuracy)',
    verificationDivision: 'e = 5 g, d = 1 g',
    sealNumber: 'MV-SEAL-2026-09412',
    modelApprovalNumber: 'IND-DLM-2024-AP-0912',
    issueDate: '08 September 2026',
    validUntil: '08 September 2027',
    issuingOfficer: 'Dr. Anita Deshmukh',
    issuingAuthority: 'State Legal Metrology Verification Directorate',
    securityHash: '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a',
    status: 'VALID', // 'VALID' | 'EXPIRED' | 'REVOKED'
    verificationCount: 42
  },
  {
    id: 'MV-2025-000089',
    applicationId: 'MV-APP-000072',
    instrumentId: 'MV-INS-000089',
    businessName: 'Kalyan Oil Depot & Fuel',
    ownerName: 'Sunil Kalyan',
    businessAddress: 'Plot 12, Industrial Area Phase 1, Gurugram',
    instrumentType: 'Fuel Dispenser Flow Meter',
    category: 'Liquid Fuel Flow Meter (LPG/Petrol)',
    manufacturer: 'Tokheim Metrology Global',
    model: 'TK-QUANTUM-4',
    serialNumber: 'TK-88391-B',
    capacity: '70 L/min',
    accuracyClass: 'Class 0.5',
    issueDate: '15 August 2024',
    validUntil: '15 August 2025',
    issuingOfficer: 'S. K. Verma',
    issuingAuthority: 'State Legal Metrology Verification Directorate',
    securityHash: '3a4b5c6d7e8f901234567890abcdef1234567890abcdef1234567890abcdef12',
    status: 'EXPIRED',
    verificationCount: 189
  },
  {
    id: 'MV-2026-000999',
    applicationId: 'MV-APP-000810',
    instrumentId: 'MV-INS-000999',
    businessName: 'Global Scrap Metals Depot',
    ownerName: 'Harish Mehta',
    businessAddress: 'Warehouse 9, Ring Road Bypass, Ghaziabad',
    instrumentType: 'Weighbridge Truck Scale (60T)',
    category: 'Heavy Vehicular Weighbridge',
    manufacturer: 'Avery Weigh-Tronix',
    model: 'BridgeMaster Pro-60',
    serialNumber: 'AV-BM-60T-99',
    capacity: '60,000 kg',
    accuracyClass: 'Class IV',
    issueDate: '10 January 2026',
    validUntil: 'Revoked on 24 June 2026 due to load-cell tampering notice',
    issuingOfficer: 'Dr. Anita Deshmukh',
    issuingAuthority: 'State Legal Metrology Verification Directorate',
    securityHash: 'de0192837465fecdba9876543210fedcba9876543210fedcba9876543210fedc',
    status: 'REVOKED',
    revocationReason: 'Unapproved electronic bypass circuit detected during surprise audit.',
    verificationCount: 312
  }
];

export const MOCK_INSPECTION_ASSIGNMENTS = [
  {
    id: 'INSP-2026-PS-001',
    applicationId: 'MV-APP-PS95734-01',
    instrumentId: 'MV-INS-PS-001',
    businessId: 'usr_pushpa_01',
    businessName: 'Singh Legal Metrology & Enterprise Tech',
    contactPerson: 'Pushpendra Singh (Proprietor)',
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
    }
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
    standardWeightsRequired: 'Class M1 500kg & 1000kg test block crane slabs'
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
        { testWeight: '500 g E2 Standard', readingKg: 0.4999998, errorG: -0.0002, toleranceG: 0.0005, result: 'PASS' }
      ],
      photoCount: 4,
      recommendation: 'RECOMMEND_APPROVAL',
      remarks: 'Cleanroom balance verified with zero thermal drift. Class I performance validated.'
    }
  },
  {
    id: 'INSP-2026-00104',
    applicationId: 'MV-APP-000124',
    instrumentId: 'MV-INS-000124',
    businessName: 'Sharma Traders & Co.',
    contactPerson: 'Rajesh Sharma (Proprietor)',
    businessPhone: '+91 98765 43210',
    instrumentType: 'Heavy Duty Platform Scale',
    category: 'Non-Automatic Weighing Instrument (NAWI)',
    serialNumber: 'APX992811',
    manufacturer: 'Apex Metrology Systems',
    model: 'APX-PL-1500',
    accuracyClass: 'Class III',
    maxCapacity: '1500 kg',
    minCapacity: '2 kg',
    verificationDivision: '10 g (e)',
    location: 'Goods Inward Warehouse & Loading Dock B, Central Mandi Market, New Delhi',
    scheduledDate: '2026-09-10',
    timeSlot: '10:30 AM - 11:45 AM',
    priority: 'HIGH',
    riskScore: 54,
    status: 'PENDING',
    targetGps: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi',
      geofenceRadiusMeters: 50
    },
    standardWeightsRequired: 'Class M1 Standard Weights (10kg, 20kg, 50kg calibrated slabs)',
    initialChecklist: {
      instrumentAvailable: true,
      serialNumberVisible: true,
      manufacturerDetailsVisible: true,
      displayFunctioning: true,
      requiredMarkingsVisible: true,
      requiredDocumentsAvailable: true
    },
    initialMeasurements: [
      { testWeight: '10 kg (Minimum Load Test)', loadKg: 10, readingKg: 10.000, errorG: 0, toleranceG: 10, result: 'PASS' },
      { testWeight: '250 kg (Quarter Load Test)', loadKg: 250, readingKg: 250.010, errorG: 10, toleranceG: 20, result: 'PASS' },
      { testWeight: '750 kg (Half Capacity MPE Check)', loadKg: 750, readingKg: 750.015, errorG: 15, toleranceG: 20, result: 'PASS' },
      { testWeight: '1500 kg (Full Scale Maximum Test)', loadKg: 1500, readingKg: 1500.020, errorG: 20, toleranceG: 30, result: 'PASS' }
    ]
  },
  {
    id: 'INSP-2026-00105',
    applicationId: 'MV-APP-000129',
    instrumentId: 'MV-INS-000138',
    businessName: 'Rajdhani Dairy Federation',
    contactPerson: 'Suresh Yadav (Plant In-charge)',
    businessPhone: '+91 98999 11223',
    instrumentType: 'Milk Chilling Vat Volume Gauge',
    category: 'Liquid Capacity Measure & Dipstick System',
    serialNumber: 'RD-VAT-204',
    manufacturer: 'DeLaval Metrology',
    model: 'DL-CHILL-5000',
    accuracyClass: 'Class 0.5',
    maxCapacity: '5000 Litres',
    minCapacity: '200 Litres',
    verificationDivision: '5 Litres',
    location: 'Chilling Plant 3, Outer Ring Road, Bawana Industrial Area, Delhi',
    scheduledDate: '2026-09-11',
    timeSlot: '02:00 PM - 03:30 PM',
    priority: 'MEDIUM',
    riskScore: 38,
    status: 'PENDING',
    targetGps: {
      lat: 28.7981,
      lng: 77.0422,
      address: 'Plot 18, Sector 4, Bawana Industrial Area, Delhi',
      geofenceRadiusMeters: 75
    },
    standardWeightsRequired: 'Calibrated 200L Proving Tank & Class F Standards'
  },
  {
    id: 'INSP-2026-00109',
    applicationId: 'MV-APP-000133',
    instrumentId: 'MV-INS-000142',
    businessName: 'Kalyan Oil Depot & Fuel',
    contactPerson: 'Sunil Kalyan (Managing Partner)',
    businessPhone: '+91 98111 22334',
    instrumentType: 'Fuel Dispenser Flow Meter',
    category: 'Continuous Measuring System for Liquids',
    serialNumber: 'TK-88391-B',
    manufacturer: 'Tokheim Metrology Global',
    model: 'TK-QUANTUM-4',
    accuracyClass: 'Class 0.5',
    maxCapacity: '70 L/min',
    minCapacity: '5 L/min',
    verificationDivision: '0.01 L',
    location: 'Plot 12, Industrial Area Phase 1, Gurugram',
    scheduledDate: '2026-09-12',
    timeSlot: '11:00 AM - 12:30 PM',
    priority: 'NORMAL',
    riskScore: 22,
    status: 'PENDING',
    targetGps: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Plot 12, Phase 1, Udyog Vihar, Gurugram',
      geofenceRadiusMeters: 50
    },
    standardWeightsRequired: '5L & 20L Metallic Test Measures (Conical Provers)'
  },
  {
    id: 'INSP-2026-00098',
    applicationId: 'MV-APP-000123',
    instrumentId: 'MV-INS-000123',
    businessName: 'Sharma Traders & Co.',
    contactPerson: 'Rajesh Sharma (Proprietor)',
    businessPhone: '+91 98765 43210',
    instrumentType: 'Digital Weighing Scale',
    category: 'Non-Automatic Weighing Instrument (NAWI)',
    serialNumber: 'WS123456',
    manufacturer: 'ABC Instruments Ltd.',
    model: 'WS-500 Industrial Precision',
    accuracyClass: 'Class III',
    maxCapacity: '50 kg',
    minCapacity: '100 g',
    verificationDivision: '5 g (e)',
    location: 'Main Retail Billing Counter - Bay 1, Central Mandi, New Delhi',
    scheduledDate: '2026-09-05',
    timeSlot: '09:30 AM - 10:45 AM',
    priority: 'NORMAL',
    riskScore: 25,
    status: 'COMPLETED',
    targetGps: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Shop 42, Central Mandi Market, Sector 18, New Delhi',
      geofenceRadiusMeters: 50
    },
    standardWeightsRequired: 'Class M1 5kg, 10kg, 20kg Standard Weights',
    completedAt: '2026-09-05 10:42 AM IST',
    inspectionReport: {
      checklist: {
        instrumentAvailable: true,
        serialNumberVisible: true,
        manufacturerDetailsVisible: true,
        displayFunctioning: true,
        requiredMarkingsVisible: true,
        requiredDocumentsAvailable: true
      },
      gpsLocation: '28.6141° N, 77.2092° E (Geofence Verified • 4.2m precision)',
      timestamp: '05/09/2026, 10:35:12 AM IST',
      measurements: [
        { testWeight: '5 kg Class M1 Standard', readingKg: 5.000, errorG: 0, toleranceG: 5, result: 'PASS' },
        { testWeight: '25 kg Class M1 Standard', readingKg: 25.002, errorG: 2, toleranceG: 10, result: 'PASS' },
        { testWeight: '50 kg Full Scale Test', readingKg: 50.003, errorG: 3, toleranceG: 15, result: 'PASS' }
      ],
      photoCount: 4,
      sealNumber: 'MV-SEAL-2026-09412',
      recommendation: 'RECOMMEND_APPROVAL',
      remarks: 'All verification divisions within permissible error limits. Lead seal attached to rear housing.'
    }
  }
];

export const MOCK_STATS = {
  business: {
    totalInstruments: 4,
    pendingApplications: 2,
    underInspection: 1,
    approved: 2,
    activeCertificates: 2
  },
  inspector: {
    assignedInspections: 8,
    pendingInspections: 2,
    completedInspections: 6,
    highRiskCases: 1
  },
  officer: {
    pendingApplications: 4,
    highRiskCases: 2,
    underInspection: 5,
    approvedTotal: 142,
    rejectedTotal: 7
  }
};

export const MOCK_REPORTS = [
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
    generatedAt: '2026-09-08',
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
    generatedAt: '2026-09-05',
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
    generatedAt: '2026-09-05'
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
    generatedAt: '2026-09-08'
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
    generatedAt: '2026-09-08'
  }
];

