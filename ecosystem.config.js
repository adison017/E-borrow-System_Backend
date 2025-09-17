module.exports = {
  apps: [
    {
      name: 'e-borrow-backend',
      script: './index.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      // Restart app if it uses more than 512MB of memory
      max_memory_restart: '512M',
      // Watch and restart if files change
      watch: false, // Set to true in development
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Restart app if it crashes
      restart_delay: 1000,
      // Kill app if not responsive within 5 seconds
      kill_timeout: 5000,
      // Combine logs from different instances
      combine_logs: true,
      // Auto restart if app is down
      autorestart: true
    }
  ]
};