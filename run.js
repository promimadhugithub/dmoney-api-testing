// Runs the Postman collection with Newman and writes an HTML report to Reports/report.html.
// Secrets (secretKey, admin credentials) are read from the git-ignored .env file and
// override the placeholder values in the environment JSON.
const fs = require('fs');
const path = require('path');
const newman = require('newman');

function loadDotEnv() {
  const file = path.join(__dirname, '.env');
  const vars = [];
  if (!fs.existsSync(file)) return vars;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 1) continue;
    const key = t.slice(0, i).trim();
    const value = t.slice(i + 1).trim();
    if (value) vars.push({ key, value });
  }
  return vars;
}

newman.run(
  {
    collection: path.join(__dirname, 'DMoney_API_Testing.postman_collection.json'),
    environment: path.join(__dirname, 'DMoney.postman_environment.json'),
    envVar: loadDotEnv(),
    reporters: ['cli', 'htmlextra'],
    reporter: {
      htmlextra: {
        export: path.join(__dirname, 'Reports', 'report.html'),
        title: 'DMoney API Test Report',
        browserTitle: 'DMoney API Test Report',
      },
    },
    delayRequest: 200,
  },
  (err, summary) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(summary.run.failures.length ? 1 : 0);
  }
);
