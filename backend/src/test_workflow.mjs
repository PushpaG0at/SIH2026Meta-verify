const BASE_URL = 'http://localhost:5000/api/v1';

async function api(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !options.allowError) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { status: res.status, data };
}

async function runEndToEndVerification() {
  console.log('====================================================');
  console.log('🧪 METRA-VERIFY COMPLETE AUTOMATED WORKFLOW TEST');
  console.log('====================================================\n');

  let testsPassed = 0;
  let testsTotal = 0;

  function assert(condition, message) {
    testsTotal++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  try {
    // 1. Health Check
    console.log('[1/7] Testing API Health & Engine Status...');
    const healthRes = await api('http://localhost:5000/api/health');
    assert(healthRes.data.status === 'HEALTHY', 'Engine returns HEALTHY');
    assert(healthRes.data.trustChain === 'ACTIVE', 'Digital Trust Chain is ACTIVE');

    // 2. Authentication Test
    console.log('\n[2/7] Testing Multi-Role Authentication...');
    const bizLogin = await api('/auth/login', {
      method: 'POST',
      body: {
        email: 'ramesh@kirana.in',
        password: 'password123'
      }
    });
    assert(bizLogin.data.token && bizLogin.data.user.role === 'BUSINESS', 'Business user logged in successfully');
    const bizToken = bizLogin.data.token;

    const inspLogin = await api('/auth/login', {
      method: 'POST',
      body: {
        email: 'inspector.sharma@delhi.gov.in',
        password: 'password123'
      }
    });
    assert(inspLogin.data.token && inspLogin.data.user.role === 'INSPECTOR', 'Inspector logged in successfully');
    const inspToken = inspLogin.data.token;

    const offLogin = await api('/auth/login', {
      method: 'POST',
      body: {
        email: 'officer.sen@legalmetrology.gov.in',
        password: 'password123'
      }
    });
    assert(offLogin.data.token && offLogin.data.user.role === 'OFFICER', 'Officer logged in successfully');
    const offToken = offLogin.data.token;

    // 3. Business: Register Instrument
    console.log('\n[3/7] Business Flow: Registering Weighing Instrument...');
    const testSerial = `VERIFY-${Date.now().toString().slice(-6)}`;
    const instRes = await api('/instruments', {
      method: 'POST',
      body: {
        category: 'ELECTRONIC_WEIGHING_SCALE',
        brand: 'Mettler Toledo Metrology',
        modelNo: 'ICS-429 Commercial Grade',
        serialNo: testSerial,
        maxCapacity: 60.0,
        minCapacity: 0.2,
        leastCount: 0.01,
        installationAddress: 'Shop 102, Okhla Industrial Area Phase II, New Delhi',
        latitude: 28.5355,
        longitude: 77.2730
      },
      headers: { Authorization: `Bearer ${bizToken}` }
    });
    const instrument = instRes.data.instrument;
    assert(instrument && instrument.uin.startsWith('IND-LM-2026-EWS'), `Unique UIN issued: ${instrument?.uin}`);

    // 4. Business: Submit Application with AI Pre-Check
    console.log('\n[4/7] Business Flow: Submitting Verification Application & AI Pre-check...');
    const appRes = await api('/applications', {
      method: 'POST',
      body: {
        instrumentId: instrument.id,
        documents: [
          {
            docType: 'MODEL_APPROVAL',
            fileName: 'Statutory_Model_Approval_Cert.pdf',
            fileUrl: '/uploads/model_approval_sample.pdf',
            ocrExtractedText: `Model Approval IND/09/2021/104 Mettler Toledo ICS-429 Max 60kg e=10g`
          },
          {
            docType: 'INVOICE',
            fileName: 'Purchase_Tax_Invoice.pdf',
            fileUrl: '/uploads/invoice_sample.pdf',
            ocrExtractedText: `Tax Invoice 9841. Item: Mettler Toledo Scale ${testSerial}`
          }
        ]
      },
      headers: { Authorization: `Bearer ${bizToken}` }
    });
    const application = appRes.data.application;
    const aiPreCheck = appRes.data.aiPreCheck;
    assert(application && application.applicationNo.startsWith('APP-2026-'), `Application created: ${application?.applicationNo}`);
    assert(aiPreCheck && typeof aiPreCheck.score === 'number', `AI Pre-Check executed with score: ${aiPreCheck?.score}/100`);
    assert(aiPreCheck.status === 'PASSED_ADVISORY' || aiPreCheck.status === 'REVIEW_SUGGESTED', `AI status evaluated: ${aiPreCheck?.status}`);

    // 5. Inspector: Receive Assignment & Submit Calibration Readings
    console.log('\n[5/7] Inspector Flow: Field Inspection & Tolerance Engine Verification...');
    const assignRes = await api('/inspections/assigned', {
      headers: { Authorization: `Bearer ${inspToken}` }
    });
    const foundAssignment = assignRes.data.inspections?.find(i => i.applicationId === application.id);
    assert(foundAssignment !== undefined, `Inspector retrieved assigned inspection for application ${application.applicationNo}`);

    const inspId = foundAssignment ? foundAssignment.id : application.id;
    const inspSubmitRes = await api(`/inspections/${inspId}/submit-evidence`, {
      method: 'POST',
      body: {
        visualInspection: true,
        sealingIntact: true,
        zeroErrorCheck: true,
        repeatabilityPass: true,
        measurements: [
          { loadKg: 6.0, readingKg: 6.000 },
          { loadKg: 30.0, readingKg: 30.005 },
          { loadKg: 60.0, readingKg: 60.008 }
        ],
        photoUrl: '/uploads/sample-doc.pdf',
        latitude: 28.5355,
        longitude: 77.2730,
        inspectorNotes: 'Class III verification completed with standard reference weights. Zero drift observed.'
      },
      headers: { Authorization: `Bearer ${inspToken}` }
    });
    assert(inspSubmitRes.data.inspection?.resultStatus === 'PASSED', `Calibration evaluation PASSED: ${inspSubmitRes.data.calibrationEvaluation?.summary}`);
    assert(Boolean(inspSubmitRes.data.evidenceHash), `Cryptographic SHA-256 evidence hash generated: ${inspSubmitRes.data.evidenceHash?.slice(0, 16)}...`);

    // 6. Officer: Review Dossier & Grant Approval
    console.log('\n[6/7] Officer Flow: Adjudication & Cryptographic Certificate Issuance...');
    const offAppsRes = await api('/officer/applications', {
      headers: { Authorization: `Bearer ${offToken}` }
    });
    const pendingApp = offAppsRes.data.applications?.find(a => a.id === application.id || a.applicationNo === application.applicationNo);
    assert(pendingApp && pendingApp.status === 'INSPECTION_COMPLETED', `Officer located application in INSPECTION_COMPLETED status`);

    const decisionRes = await api(`/officer/applications/${application.id}/decision`, {
      method: 'POST',
      body: {
        decision: 'APPROVED',
        remarks: 'Statutory verification granted in accordance with Legal Metrology (General) Rules, Schedule VII.',
        stampingCode: 'IND/DL/LM/2026/088'
      },
      headers: { Authorization: `Bearer ${offToken}` }
    });
    const cert = decisionRes.data.certificate;
    assert(cert && cert.certificateNo.startsWith('METRA-CERT-2026-'), `Tamper-evident Certificate issued: ${cert?.certificateNo}`);
    assert(cert.qrCodeDataUrl && cert.qrCodeDataUrl.startsWith('data:image/png;base64,'), 'High-resolution QR code data URL generated');

    // 7. Public Verification & QR Lookup
    console.log('\n[7/7] Public Verification: QR Code & Registry Verification...');
    const verifyRes = await api(`/public/verify/${cert.certificateNo}`);
    assert(verifyRes.data.verified === true, `Public lookup: Certificate ${cert.certificateNo} is VERIFIED`);
    assert(verifyRes.data.status === 'VALID', `Status is VALID (Expires: ${verifyRes.data.certificate?.validUntil?.split('T')[0]})`);
    assert(verifyRes.data.trustChain?.trustChainVerified === true, 'Digital Trust Chain & SHA-256 tamper seal confirmed');

    // Test Seed Certificate
    const seedVerifyRes = await api('/public/verify/METRA-CERT-2026-104928');
    assert(seedVerifyRes.data.verified === true, 'Seed certificate METRA-CERT-2026-104928 is VALID in public registry');

    // Test Not Found
    const notFoundRes = await api('/public/verify/INVALID-NONEXISTENT-999', { allowError: true });
    assert(notFoundRes.status === 404, 'Unknown certificate returns 404 NOT_FOUND');

    console.log('\n====================================================');
    console.log(`🏁 TEST RESULTS: ${testsPassed} / ${testsTotal} PASSED (${Math.round((testsPassed / testsTotal) * 100)}%)`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal test error:', err.data || err.message);
    process.exit(1);
  }
}

runEndToEndVerification();
