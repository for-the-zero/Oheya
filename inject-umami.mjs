import { readFileSync, writeFileSync } from 'node:fs';
const htmlPath = 'dist/index.html';
let html = readFileSync(htmlPath, 'utf-8');
if (!html.includes('cloud.umami.is')) {
    html = html.replace('</head>', '  <script defer src="https://cloud.umami.is/script.js" data-website-id="8a96c320-b541-482f-acd4-6fc1b3ec22dc"></script>\n</head>');
    writeFileSync(htmlPath, html);
};