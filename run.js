// Runs the Postman collection with Newman and writes an HTML report to ./Reports.
// Optional overrides are read from a local .env file (see .env.example).
const fs = require('fs');
const { spawnSync } = require('child_process');

if (fs.existsSync('.env') && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile('.env'); // Node >= 20.12
}

// .env key -> Postman environment variable
const overrides = {
  BASE_URL: 'baseUrl',
  PARTNER_KEY: 'partnerKey',
  ADMIN_EMAIL: 'adminEmail',
  ADMIN_PASSWORD: 'adminPassword',
  SYSTEM_EMAIL: 'systemEmail',
  SYSTEM_PASSWORD: 'systemPassword',
  USER_PASSWORD: 'userPassword',
};

fs.mkdirSync('Reports', { recursive: true });

const args = [
  'newman', 'run', 'Collection/DMoney_API_Collection.postman_collection.json',
  '-e', 'Collection/DMoney_Local.postman_environment.json',
  '-r', 'cli,htmlextra',
  '--reporter-htmlextra-export', 'Reports/newman-report.html',
  '--reporter-htmlextra-title', 'DMoney API Test Report',
];
for (const [envKey, postmanKey] of Object.entries(overrides)) {
  if (process.env[envKey]) args.push('--env-var', `${postmanKey}=${process.env[envKey]}`);
}

const result = spawnSync('npx', args, { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(result.status === null ? 1 : result.status);
