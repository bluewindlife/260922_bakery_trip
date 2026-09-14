import { readFileSync } from 'node:fs';

const required = [
  'index.html',
  'style.css',
  'script.js',
  'README.md',
  '.github/workflows/pages.yml'
];

const files = Object.fromEntries(
  required.map((path) => [path, readFileSync(path, 'utf8')])
);

const fail = (message) => {
  throw new Error(message);
};

const expect = (condition, message) => {
  if (!condition) fail(message);
};

const count = (text, pattern) => (text.match(pattern) || []).length;
const html = files['index.html'];
const css = files['style.css'];
const script = files['script.js'];
const readme = files['README.md'];
const workflow = files['.github/workflows/pages.yml'];

required.forEach((path) => expect(files[path].trim().length > 0, path + ' is empty'));
expect(html.includes('data-version="v0.5.0"'), 'HTML version is not v0.5.0');
expect(html.includes('style.css?v=0.5.0'), 'CSS cache buster is stale');
expect(html.includes('script.js?v=0.5.0'), 'JS cache buster is stale');
expect(readme.includes('## v0.5.0'), 'README version is stale');
expect(!html.includes('4店を写真で見る'), 'Removed four-shop photo preview returned');
expect(!/(妻指名店|妻希望店)/.test(html), 'Unnatural wife label is present');
expect(count(html, /data-shop="/g) === 4, 'Main shop count must be 4');
expect(count(html, /data-candidate="/g) === 5, 'Photo comparison candidate count must be 5');

const shopSegments = html.split(/<article class="shop-card[^>]*data-shop="[^"]+">/).slice(1);
const shopPhotoCounts = shopSegments.map((segment) => count(segment.split('</article>')[0], /<figure>/g));
expect(shopPhotoCounts.length === 4, 'Could not inspect all main shop cards');
expect(shopPhotoCounts.every((value) => value >= 2), 'Every main shop needs multiple photos');

const candidateSegments = html.split(/<article class="candidate-card[^>]*data-candidate="[^"]+">/).slice(1);
const candidatePhotoCounts = candidateSegments.map((segment) => count(segment.split('</article>')[0], /<figure>/g));
expect(candidatePhotoCounts.length === 5, 'Could not inspect all comparison cards');
expect(candidatePhotoCounts.every((value) => value === 1), 'Every comparison card must have exactly one photo');

const imageUrls = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
expect(imageUrls.length >= 16, 'Catalog does not contain enough photos');
expect(new Set(imageUrls).size === imageUrls.length, 'Duplicate image URL found in HTML');

const figures = [...html.matchAll(/<figure>[\s\S]*?<\/figure>/g)].map((match) => match[0]);
expect(figures.every((figure) => !figure.includes('かぼちゃマスカルポーネ')), 'Out-of-season pumpkin item appears in a photo');
const buyLists = [...html.matchAll(/<ul class="buy-list">[\s\S]*?<\/ul>/g)].map((match) => match[0]);
expect(buyLists.every((list) => !list.includes('かぼちゃマスカルポーネ')), 'Out-of-season pumpkin item appears as a recommendation');

expect(!/candidateVisuals|visualData|createElement\s*\(|innerHTML\s*=/.test(script), 'JavaScript still creates HTML/image elements');
expect(!/https?:\/\/.*\.(jpg|jpeg|png|webp)/i.test(script), 'Image URL found in JavaScript');
expect(script.includes("closest('.gallery, .candidate-gallery')"), 'Broken-image gallery cleanup is missing');
expect(css.includes('.candidate-gallery'), 'Candidate photo CSS is missing');
expect(css.includes('.evidence-key'), 'Evidence labels CSS is missing');

[
  'actions/checkout@v4',
  'actions/configure-pages@v5',
  'actions/upload-pages-artifact@v3',
  'actions/deploy-pages@v4'
].forEach((action) => expect(workflow.includes(action), 'Pages workflow lost ' + action));

console.log(JSON.stringify({
  version: 'v0.5.0',
  requiredFiles: required,
  mainShopPhotoCounts: shopPhotoCounts,
  candidatePhotoCounts,
  uniqueImages: imageUrls.length,
  duplicateImages: 0,
  javascriptImageGeneration: false
}, null, 2));
