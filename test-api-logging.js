// Test script to verify API logging functionality
import fetch from 'node-fetch';

const testApiHost = async (baseUrl) => {
  try {
    console.log(`\n🧪 Testing API host: ${baseUrl}`);

    // Test root endpoint
    const rootResponse = await fetch(`${baseUrl}/`);
    const rootData = await rootResponse.json();
    console.log('✅ Root endpoint response:', JSON.stringify(rootData, null, 2));

    // Test host-info endpoint
    const hostInfoResponse = await fetch(`${baseUrl}/api/host-info`);
    const hostInfoData = await hostInfoResponse.json();
    console.log('✅ Host info endpoint response:', JSON.stringify(hostInfoData, null, 2));

  } catch (error) {
    console.error(`❌ Error testing ${baseUrl}:`, error.message);
  }
};

// Test both localhost and render.com
const testHosts = [
  'http://localhost:5000',
  'https://e-borrow-system-backend.onrender.com'
];

console.log('🚀 Testing API Host Logging...\n');

for (const host of testHosts) {
  await testApiHost(host);
}

console.log('\n✅ API Host Logging Test Complete!');
console.log('📝 Check the backend console logs to see the request logging in action.');
