#!/usr/bin/env node

// Phase 2 Testing Script for Pokemon Alert Bot
// Run with: node test-phase2.js

const baseUrl = 'http://localhost:3000';

async function testPhase2() {
  console.log('🎯 Pokemon Alert Bot - Phase 2 Testing\n');

  // Get admin secret from user
  const adminSecret = process.env.ADMIN_SECRET || 'test-secret-123';
  
  const tests = [
    {
      name: '1. Database Connection Test',
      url: `${baseUrl}/api/test`,
      method: 'GET',
      description: 'Testing database connectivity and basic API'
    },
    {
      name: '2. System Status Check',
      url: `${baseUrl}/api/admin/seed`,
      method: 'GET',
      description: 'Checking current system statistics'
    },
    {
      name: '3. Seed Store Data',
      url: `${baseUrl}/api/admin/seed`,
      method: 'POST',
      body: { action: 'seed-stores', secret: adminSecret },
      description: 'Initializing stores and sample products'
    },
    {
      name: '4. Test Scraper Functionality',
      url: `${baseUrl}/api/admin/test-monitor`,
      method: 'POST',
      body: { action: 'test-scraper', secret: adminSecret },
      description: 'Testing Puppeteer and Pokemon Center access'
    },
    {
      name: '5. Test Full Monitoring System',
      url: `${baseUrl}/api/admin/test-monitor`,
      method: 'POST',
      body: { action: 'test-monitoring', secret: adminSecret },
      description: 'Running complete monitoring cycle'
    },
    {
      name: '6. Final System Status',
      url: `${baseUrl}/api/admin/seed`,
      method: 'GET',
      description: 'Checking final system statistics'
    }
  ];

  const results = [];

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n${test.name}`);
    console.log(`📝 ${test.description}`);
    console.log(`🌐 ${test.method} ${test.url}`);

    try {
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const startTime = Date.now();
      const response = await fetch(test.url, options);
      const duration = Date.now() - startTime;
      const data = await response.json();

      if (response.ok) {
        console.log(`✅ SUCCESS (${duration}ms)`);
        
        // Show relevant data based on test type
        if (test.name.includes('Database')) {
          console.log(`   📊 User Count: ${data.userCount}`);
        } else if (test.name.includes('Status') || test.name.includes('Final')) {
          console.log(`   📊 Stores: ${data.data.stores}, Products: ${data.data.products}, Alerts: ${data.data.alerts}, Users: ${data.data.users}`);
        } else if (test.name.includes('Seed')) {
          console.log(`   🏪 Created ${data.data?.productCount || 0} products across 4 stores`);
        } else if (test.name.includes('Scraper')) {
          console.log(`   🤖 Puppeteer: ${data.data?.puppeteerWorking ? '✅' : '❌'}`);
          console.log(`   🌐 Site Access: ${data.data?.siteAccessible ? '✅' : '❌'}`);
          if (data.data?.loadTime) console.log(`   ⏱️  Load Time: ${data.data.loadTime}`);
        } else if (test.name.includes('Monitoring')) {
          console.log(`   ⏱️  Duration: ${data.data?.duration || 'unknown'}`);
          console.log(`   📈 Stock Checks: ${data.data?.latestStockChecks?.length || 0}`);
        }

        results.push({ test: test.name, status: 'PASSED', duration });
      } else {
        console.log(`❌ FAILED (${duration}ms)`);
        console.log(`   Error: ${data.error || 'Unknown error'}`);
        results.push({ test: test.name, status: 'FAILED', duration, error: data.error });
      }

    } catch (error) {
      console.log(`❌ FAILED - Network Error`);
      console.log(`   Error: ${error.message}`);
      results.push({ test: test.name, status: 'ERROR', error: error.message });
    }

    // Small delay between tests
    if (i < tests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎯 PHASE 2 TESTING SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const errors = results.filter(r => r.status === 'ERROR').length;

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${errors} errors\n`);

  results.forEach(result => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    const duration = result.duration ? `(${result.duration}ms)` : '';
    console.log(`${status} ${result.test} ${duration}`);
    if (result.error) {
      console.log(`    Error: ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  
  if (passed === tests.length) {
    console.log('🎉 ALL TESTS PASSED! Phase 2 is working correctly.');
    console.log('\n🚀 Ready for Phase 3: Alert Management UI');
  } else if (passed >= 4) {
    console.log('⚠️  MOSTLY WORKING: Core functionality is operational.');
    console.log('   Some optional features may need configuration.');
  } else {
    console.log('🚨 ISSUES DETECTED: Please check the failed tests above.');
    console.log('   Review TESTING.md for troubleshooting guidance.');
  }

  console.log('\n📖 For detailed testing instructions, see TESTING.md');
  console.log('🌐 Visit http://localhost:3000 to test the UI');
}

// Run the tests
if (require.main === module) {
  testPhase2().catch(error => {
    console.error('\n❌ Testing script failed:', error.message);
    process.exit(1);
  });
}

module.exports = { testPhase2 };