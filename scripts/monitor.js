/**
 * Monitoring script to check for potential issues in the application
 */
const os = require('os');
const fs = require('fs');
const path = require('path');

// Log file path
const logFilePath = path.join(__dirname, '..', 'logs', 'monitor.log');

// Function to write to log file
function writeToLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // Also log to console
  console.log(logMessage.trim());
  
  // Write to file
  fs.appendFileSync(logFilePath, logMessage);
}

// Function to get memory usage
function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100, // MB
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100, // MB
    external: Math.round(usage.external / 1024 / 1024 * 100) / 100 // MB
  };
}

// Function to get CPU usage
function getCpuUsage() {
  const cpus = os.cpus();
  let totalIdle = 0, totalTick = 0;
  
  for (let i = 0, len = cpus.length; i < len; i++) {
    const cpu = cpus[i];
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  }
  
  return {
    idle: totalIdle / cpus.length,
    total: totalTick / cpus.length
  };
}

// Function to get system info
function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100, // GB
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024 * 100) / 100, // GB
    cpuCount: os.cpus().length,
    uptime: os.uptime()
  };
}

// Main monitoring function
function monitor() {
  const memory = getMemoryUsage();
  const system = getSystemInfo();
  
  writeToLog('=== APPLICATION MONITORING REPORT ===');
  writeToLog(`Memory Usage:`);
  writeToLog(`  RSS: ${memory.rss} MB`);
  writeToLog(`  Heap Total: ${memory.heapTotal} MB`);
  writeToLog(`  Heap Used: ${memory.heapUsed} MB`);
  writeToLog(`  External: ${memory.external} MB`);
  
  writeToLog(`System Info:`);
  writeToLog(`  Platform: ${system.platform}`);
  writeToLog(`  Architecture: ${system.arch}`);
  writeToLog(`  Total Memory: ${system.totalMemory} GB`);
  writeToLog(`  Free Memory: ${system.freeMemory} GB`);
  writeToLog(`  CPU Count: ${system.cpuCount}`);
  writeToLog(`  System Uptime: ${Math.round(system.uptime / 3600 * 100) / 100} hours`);
  
  // Check for potential memory issues
  if (memory.heapUsed > 300) { // Alert if heap used > 300MB
    writeToLog('⚠️  WARNING: High memory usage detected!');
  }
  
  writeToLog('====================================\n');
}

// Run monitoring every 30 seconds
setInterval(monitor, 30000);

// Run initial monitoring
monitor();

console.log('Monitoring started. Logs will be written to:', logFilePath);
console.log('Press Ctrl+C to stop monitoring.');