/**
 * METRA-VERIFY Automated Security & Role-Isolation Test Suite
 * Smart India Hackathon 2026
 */

const API_BASE = 'http://localhost:5000/api/v1';

async function testSecuritySuite() {
  console.log('====================================================');
  console.log('🔒 METRA-VERIFY RBAC & ROLE-ISOLATION SECURITY SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // TEST 1: Business authentication
  console.log('[TEST 1 & 16] Business Login & Role Verification...');
  const bizRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'business@metra-demo.in', password: 'password123' })
  });
  const bizData = await bizRes.json();
  assert(bizRes.status === 200, 'Business user authenticates successfully');
  assert(bizData.user?.role === 'BUSINESS', 'Business user object role is permanently BUSINESS');
  const bizToken = bizData.token;

  // TEST 4 & 16: Inspector authentication
  console.log('\n[TEST 4 & 16] Inspector Login & Role Verification...');
  const inspRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'inspector@metra-demo.in', password: 'password123' })
  });
  const inspData = await inspRes.json();
  assert(inspRes.status === 200, 'Inspector user authenticates successfully');
  assert(inspData.user?.role === 'INSPECTOR', 'Inspector user object role is permanently INSPECTOR');
  const inspToken = inspData.token;

  // TEST 7 & 16: Officer authentication
  console.log('\n[TEST 7 & 16] Officer Login & Role Verification...');
  const offRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'officer@metra-demo.in', password: 'password123' })
  });
  const offData = await offRes.json();
  assert(offRes.status === 200, 'Officer user authenticates successfully');
  assert(offData.user?.role === 'OFFICER', 'Officer user object role is permanently OFFICER');
  const offToken = offData.token;

  // TEST 2 & 3: Business user accessing Inspector or Officer endpoints
  console.log('\n[TEST 2 & 3] Business Account Attempting Restricted Inspector & Officer Endpoints...');
  const bizTryInsp = await fetch(`${API_BASE}/inspections/assigned`, {
    headers: { Authorization: `Bearer ${bizToken}` }
  });
  assert(bizTryInsp.status === 403, `Business token calling Inspector endpoint is rejected with 403 Forbidden (got ${bizTryInsp.status})`);

  const bizTryOff = await fetch(`${API_BASE}/officer/applications`, {
    headers: { Authorization: `Bearer ${bizToken}` }
  });
  assert(bizTryOff.status === 403, `Business token calling Officer endpoint is rejected with 403 Forbidden (got ${bizTryOff.status})`);

  // TEST 5 & 6: Inspector user accessing Officer endpoints
  console.log('\n[TEST 5 & 6] Inspector Account Attempting Restricted Officer & Business Operations...');
  const inspTryOff = await fetch(`${API_BASE}/officer/applications`, {
    headers: { Authorization: `Bearer ${inspToken}` }
  });
  assert(inspTryOff.status === 403, `Inspector token calling Officer endpoint is rejected with 403 Forbidden (got ${inspTryOff.status})`);

  // TEST 8 & 9: Officer user accessing Inspector endpoints
  console.log('\n[TEST 8 & 9] Officer Account Attempting Restricted Inspector Field Inspections...');
  const offTryInsp = await fetch(`${API_BASE}/inspections/assigned`, {
    headers: { Authorization: `Bearer ${offToken}` }
  });
  assert(offTryInsp.status === 403, `Officer token calling Inspector endpoint is rejected with 403 Forbidden (got ${offTryInsp.status})`);

  // TEST 10: Unauthenticated access to protected endpoints
  console.log('\n[TEST 10] Unauthenticated / Logged-Out Access...');
  const unauthInsp = await fetch(`${API_BASE}/inspections/assigned`);
  assert(unauthInsp.status === 401, `Unauthenticated request is rejected with 401 Unauthorized (got ${unauthInsp.status})`);

  const unauthOff = await fetch(`${API_BASE}/officer/applications`);
  assert(unauthOff.status === 401, `Unauthenticated request is rejected with 401 Unauthorized (got ${unauthOff.status})`);

  // TEST 14: Tampered Token / Invalid Role Signature
  console.log('\n[TEST 14] Tampered Token / Role Spoofing Prevention...');
  const spoofedToken = bizToken.slice(0, -5) + 'xxxxx';
  const spoofedRes = await fetch(`${API_BASE}/inspections/assigned`, {
    headers: { Authorization: `Bearer ${spoofedToken}` }
  });
  assert(spoofedRes.status === 401 || spoofedRes.status === 403, `Tampered token fails with 401/403 (got ${spoofedRes.status})`);

  console.log('\n====================================================');
  console.log(`🏁 SECURITY SUITE RESULTS: ${passed} / ${total} PASSED (${Math.round(passed / total * 100)}%)`);
  console.log('====================================================');
}

testSecuritySuite().catch(console.error);
