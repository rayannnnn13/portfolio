// data/cv.json reste la source : la copie HTML permet l’ouverture sans serveur.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/cv.json'), 'utf8'));
const json = JSON.stringify(data).replace(/</g, '\\u003c');
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const block = `<script id="cv-data" type="application/json">${json}</script>`;
const pattern = /<script id="cv-data" type="application\/json">[\s\S]*?<\/script>/;
const updated = pattern.test(html) ? html.replace(pattern, () => block) : html.replace('</head>', `${block}\n</head>`);
if (updated !== html) fs.writeFileSync(file, updated);
