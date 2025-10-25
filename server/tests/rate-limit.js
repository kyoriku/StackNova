const BASE_URL = 'http://localhost:3001';

console.log('Rate Limiter Test Suite');
console.log('Using header: x-bypass-localhost-whitelist: true\n');

async function testLoginLimiter() {
  console.log('Testing Login Limiter (max 15 per 15min)...\n');
  
  for (let i = 1; i <= 17; i++) {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-bypass-localhost-whitelist': 'true'
      },
      body: JSON.stringify({ email: 'test@test.com', password: 'wrong' })
    });
    
    const data = await res.json();
    
    if (res.status === 429) {
      console.log(`  Request ${i}: RATE LIMITED!`);
      return true;
    } else {
      console.log(`  Request ${i}: ${res.status}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('  Should have been rate limited by now!\n');
  return false;
}

async function testApiLimiter() {
  console.log('Testing API Limiter (max 1000 per 15min)...');
  console.log('  (Just checking it exists, not hitting limit)\n');
  
  const res = await fetch(`${BASE_URL}/api/users/session`, {
    headers: {
      'x-bypass-localhost-whitelist': 'true'
    }
  });
  const remaining = res.headers.get('ratelimit-remaining');
  const limit = res.headers.get('ratelimit-limit');
  
  if (remaining && limit) {
    console.log(`  API limiter active: ${remaining}/${limit} remaining\n`);
    return true;
  } else {
    console.log('  No rate limit headers found\n');
    return false;
  }
}

async function testReadLimiter() {
  console.log('Testing Read Limiter (max 100 GET per minute)...\n');
  
  for (let i = 1; i <= 105; i++) {
    const res = await fetch(`${BASE_URL}/api/users/session`, {
      headers: {
        'x-bypass-localhost-whitelist': 'true'
      }
    });
    
    if (res.status === 429) {
      console.log(`  Request ${i}: RATE LIMITED!`);
      const data = await res.json();
      console.log(`  Response:`, data);
      return true;
    } else if (i % 20 === 0) {
      console.log(`  Request ${i}: ${res.status}`);
    }
  }
  
  console.log('  Should have been rate limited by now!\n');
  return false;
}

async function checkRedisConnection() {
  console.log('Checking Redis connection...\n');
  
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    
    if (data.redis === 'Connected') {
      console.log('  Redis is connected\n');
      return true;
    } else {
      console.log('  Redis status:', data.redis, '\n');
      return false;
    }
  } catch (err) {
    console.log('  Cannot check Redis status\n');
    return false;
  }
}

async function runAllTests() {
  console.log('='.repeat(50));
  console.log('Rate Limiter Test Suite');
  console.log('='.repeat(50));
  console.log();
  
  const results = {
    redis: await checkRedisConnection(),
    api: await testApiLimiter(),
    login: await testLoginLimiter(),
    read: await testReadLimiter()
  };
  
  console.log('='.repeat(50));
  console.log('Test Results:');
  console.log('='.repeat(50));
  console.log(`Redis Connected: ${results.redis ? 'PASS' : 'FAIL'}`);
  console.log(`API Limiter:     ${results.api ? 'PASS' : 'FAIL'}`);
  console.log(`Login Limiter:   ${results.login ? 'PASS' : 'FAIL'}`);
  console.log(`Read Limiter:    ${results.read ? 'PASS' : 'FAIL'}`);
  console.log('='.repeat(50));
  
  const allPassed = Object.values(results).every(r => r);
  console.log(allPassed ? '\nAll tests passed!' : '\nSome tests failed');
}

// Run all tests
runAllTests().catch(console.error);