const fs = require('node:fs');
const path = require('node:path');
const project = path.resolve(__dirname, '..');
const output = path.resolve(project, '../docs');
fs.mkdirSync(output, { recursive: true });
const files = ['index.html', 'style.css', 'portrait.jpg', 'hero-video.mp4', 'hero-video-poster.jpg', ...fs.readdirSync(project).filter(name => /^images.*\.jpeg$/.test(name))];
for (const name of [...files, 'dist', 'data', 'assets']) {
    fs.cpSync(path.join(project, name), path.join(output, name), { recursive: true });
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log('Site prêt dans docs/.');
