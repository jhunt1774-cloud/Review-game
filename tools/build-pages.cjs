// Package the existing static game; never publish test profiles or source downloads.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), output = path.join(root, 'work', 'site');
assert.equal(path.relative(root, output), path.join('work', 'site'));
fs.rmSync(output, {recursive:true, force:true});
fs.mkdirSync(output, {recursive:true});
for (const entry of fs.readdirSync(root, {withFileTypes:true})) {
 const include = entry.isFile() && /\.(html|js|css|json|csv|md|txt)$/i.test(entry.name) ||
  entry.isDirectory() && ['assets','document-libs','question-sets','forest-path'].includes(entry.name);
 if (include) fs.cpSync(path.join(root, entry.name), path.join(output, entry.name), {recursive:true});
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
 const file = match[1];
 if (/^(?:https?:|data:)/.test(file)) continue;
 assert.ok(!file.startsWith('/'), 'Pages project paths must be relative: '+file);
 assert.ok(fs.existsSync(path.join(output, file)), 'Missing published file: '+file);
}
assert.ok(!html.includes('cloud-saves.js'), 'Account saves must not load in the classroom game');
for (const file of ['pdf.mjs','pdf.worker.mjs','mammoth.browser.js']) assert.ok(fs.existsSync(path.join(output,'document-libs',file)));
console.log('PASS static Pages package, relative entry paths and local document readers: '+output);
