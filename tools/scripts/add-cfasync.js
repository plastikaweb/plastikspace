const fs = require('fs');
const path = require('path');

// Adjust the path to where your app builds its index.html
// Note: for @angular/build:application, the output is usually inside a 'browser' folder
const indexPath = path.join(__dirname, '../../dist/apps/eco-store/browser/index.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(/<script /g, '<script data-cfasync="false" ');
  fs.writeFileSync(indexPath, html);
  console.log('✅ Added data-cfasync="false" to index.html');
} else {
  console.error('❌ index.html not found at', indexPath);
}
