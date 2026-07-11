const fs = require('fs');
const path = require('path');

// Adjust the path to where your app builds its index.html
// Note: for @angular/build:application, the output is usually inside a 'browser' folder
const browserPath = path.join(__dirname, '../../dist/apps/eco-store/browser');
const filesToProcess = ['index.html', 'index.csr.html'];

filesToProcess.forEach(fileName => {
  const filePath = path.join(browserPath, fileName);
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace(/<script /g, '<script data-cfasync="false" ');
    fs.writeFileSync(filePath, html);
    console.log(`✅ Added data-cfasync="false" to ${fileName}`);
  } else {
    console.log(`ℹ️ ${fileName} not found at ${filePath}, skipping.`);
  }
});
