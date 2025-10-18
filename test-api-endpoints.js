// Quick API endpoint test script
// Run with: node test-api-endpoints.js

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const status = response.status;
    
    console.log(`${method} ${endpoint}: ${status} ${response.statusText}`);
    
    if (status === 200 || status === 201) {
      console.log('✅ Success');
    } else if (status === 401 || status === 403) {
      console.log('🔒 Authentication required (expected for protected routes)');
    } else {
      console.log('❌ Error');
    }
    
    return { status, ok: response.ok };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: Network Error - ${error.message}`);
    return { status: 0, ok: false };
  }
}

async function runTests() {
  console.log('🧪 Testing API Endpoints\n');
  
  // Test public endpoints
  console.log('📍 Public Endpoints:');
  await testEndpoint('/api/auth/session');
  await testEndpoint('/login');
  
  console.log('\n📍 Protected Endpoints (should require auth):');
  await testEndpoint('/api/categories');
  await testEndpoint('/api/suppliers');
  await testEndpoint('/api/pending-products');
  await testEndpoint('/api/pending-categories');
  
  console.log('\n📍 Admin-only Endpoints (should require admin auth):');
  await testEndpoint('/api/pending-products', 'GET');
  await testEndpoint('/api/pending-categories', 'GET');
  
  console.log('\n✅ API endpoint test completed!');
  console.log('Note: 401/403 errors are expected for protected routes without authentication');
}

runTests();
