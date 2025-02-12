const fs = require('fs');
const path = require('path');

// Safety checks before migration
if (!fs.existsSync(path.join(__dirname, '../src'))) {
  console.error('Aborting: src directory not found');
  process.exit(1);
}

console.log('Migration environment verified');
