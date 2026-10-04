module.exports = {
  apps: [
    {
      name: 'aibotcall-backend',
      cwd: './backend',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        HOST: '0.0.0.0',
      },
    },
    {
      name: 'aibotcall-call-worker',
      cwd: './backend',
      script: 'dist/workers/call-worker.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
