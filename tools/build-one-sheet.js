// Builds downloads/sam-osborne-one-sheet.pdf from tools/one-sheet.html
// Run from the repo root: node tools/build-one-sheet.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, 'one-sheet.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.resolve(__dirname, '../downloads/sam-osborne-one-sheet.pdf'), format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await browser.close();
})();
