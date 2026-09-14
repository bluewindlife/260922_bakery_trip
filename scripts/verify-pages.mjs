import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pageBase = process.env.PAGE_URL || 'https://bluewindlife.github.io/260922_bakery_trip/';
const expectedVersion = process.env.EXPECTED_VERSION || 'v0.5.0';
const build = process.env.GITHUB_SHA || Date.now().toString();
const pageUrl = pageBase.replace(/\/?$/, '/') + '?build=' + encodeURIComponent(build);
const outputDir = 'verify-output';
mkdirSync(outputDir, { recursive: true });

const chromePath = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].find((path) => path && existsSync(path));

if (!chromePath) {
  throw new Error('Chrome executable was not found on the GitHub runner');
}

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

const page = await browser.newPage();
const failedRequests = [];
page.on('requestfailed', (request) => {
  failedRequests.push({
    url: request.url(),
    reason: request.failure()?.errorText || 'unknown'
  });
});

let metrics;

try {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setCacheEnabled(false);

  let deployed = false;
  for (let attempt = 1; attempt <= 18; attempt += 1) {
    const response = await page.goto(pageUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 45000
    });
    const version = await page.evaluate(() => document.body?.dataset.version || '');
    console.log('deploy check ' + attempt + ': HTTP ' + (response?.status() || 'n/a') + ', version ' + version);
    if (response?.ok() && version === expectedVersion) {
      deployed = true;
      break;
    }
    await delay(5000);
  }

  if (!deployed) {
    throw new Error('Published Pages did not reach ' + expectedVersion);
  }

  await page.waitForFunction(
    (version) => document.body?.dataset.ready === 'true' && document.body?.dataset.version === version,
    { timeout: 15000 },
    expectedVersion
  );

  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(420, Math.floor(window.innerHeight * 0.7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await wait(120);
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await delay(3000);

  metrics = await page.evaluate(() => {
    const imageSources = [...document.querySelectorAll('img')].map((img) => img.currentSrc || img.src);
    const mainCards = [...document.querySelectorAll('[data-shop]')];
    const candidateCards = [...document.querySelectorAll('[data-candidate]')];
    const bodyText = document.body.innerText;
    const px = (selector) => {
      const element = document.querySelector(selector);
      return element ? Number.parseFloat(getComputedStyle(element).fontSize) : 0;
    };
    const invalidLinks = [...document.querySelectorAll('a')].filter((link) => {
      const href = link.getAttribute('href');
      if (!href) return true;
      try {
        new URL(href, location.href);
        return false;
      } catch {
        return true;
      }
    }).map((link) => link.textContent.trim());

    const figureText = [...document.querySelectorAll('figure')].map((figure) => figure.innerText);
    const buyListText = [...document.querySelectorAll('.buy-list')].map((list) => list.innerText);

    return {
      title: document.title,
      version: document.body.dataset.version,
      ready: document.body.dataset.ready,
      imageFailuresRemoved: Number(document.body.dataset.imageFailures || 0),
      remainingImages: imageSources.length,
      duplicateImageSources: imageSources.filter((src, index) => imageSources.indexOf(src) !== index),
      brokenImages: [...document.querySelectorAll('img')].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.alt),
      mainShopCount: mainCards.length,
      mainShopPhotoCounts: mainCards.map((card) => card.querySelectorAll('.gallery figure').length),
      candidateCount: candidateCards.length,
      candidatePhotoCounts: candidateCards.map((card) => card.querySelectorAll('.candidate-gallery figure').length),
      removedPreviewPresent: bodyText.includes('4店を写真で見る'),
      wifeLabelPresent: /妻指名店|妻希望店/.test(bodyText),
      misleadingPumpkinPlacement: figureText.concat(buyListText).some((text) => text.includes('かぼちゃマスカルポーネ')),
      wakanPhotoMatches: [...document.querySelectorAll('[data-shop="wakan"] figure')].some((figure) => figure.querySelector('img')?.alt.includes('アールグレイロイヤルミルクティー') && figure.innerText.includes('アールグレイロイヤルミルクティー')),
      commenPhotoMatches: [...document.querySelectorAll('[data-shop="commen"] figure')].some((figure) => figure.querySelector('img')?.alt.includes('たまご明太サンド') && figure.innerText.includes('たまご明太サンド')),
      maruPhotoMatches: [...document.querySelectorAll('[data-shop="maru"] figure')].some((figure) => figure.querySelector('img')?.alt.includes('プレーン') && figure.innerText.includes('プレーン')),
      homeReturnPresent: bodyText.includes('自宅へ') && bodyText.includes('17:30–19:30'),
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      invalidLinks,
      fontSizes: {
        body: px('body'),
        shopReason: px('.shop-reason'),
        candidateCopy: px('.candidate-card p'),
        action: px('.action')
      },
      assets: performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => /style\.css|script\.js/.test(name))
    };
  });

  await page.evaluate(() => document.querySelector('#shops')?.scrollIntoView());
  await delay(250);
  metrics.sticky = await page.evaluate(() => {
    const sticky = document.querySelector('.sticky-status')?.getBoundingClientRect();
    const section = document.querySelector('#shops')?.getBoundingClientRect();
    return {
      height: sticky?.height || 0,
      bottom: sticky?.bottom || 0,
      sectionTop: section?.top || 0,
      coversAnchor: Boolean(sticky && section && sticky.bottom > section.top + 2)
    };
  });

  await page.screenshot({
    path: outputDir + '/mobile-390x844.jpg',
    type: 'jpeg',
    quality: 82,
    fullPage: true
  });

  await page.setViewport({ width: 1024, height: 900, deviceScaleFactor: 1 });
  await delay(300);
  metrics.desktopHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  await page.screenshot({
    path: outputDir + '/desktop-1024x900.jpg',
    type: 'jpeg',
    quality: 80,
    fullPage: true
  });

  await page.setCacheEnabled(true);
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(
    (version) => document.body?.dataset.ready === 'true' && document.body?.dataset.version === version,
    { timeout: 15000 },
    expectedVersion
  );
  metrics.versionAfterCachedReload = await page.evaluate(() => document.body.dataset.version);

  const problems = [];
  if (metrics.version !== expectedVersion) problems.push('wrong deployed version');
  if (metrics.versionAfterCachedReload !== expectedVersion) problems.push('cached reload returned an old version');
  if (!metrics.ready) problems.push('JavaScript did not initialize');
  if (metrics.removedPreviewPresent) problems.push('removed photo preview returned');
  if (metrics.wifeLabelPresent) problems.push('unwanted wife label is visible');
  if (metrics.mainShopCount !== 4) problems.push('main shop count is not 4');
  if (!metrics.mainShopPhotoCounts.every((value) => value >= 2)) problems.push('a main shop has fewer than two loaded photos');
  if (metrics.candidateCount !== 5) problems.push('comparison candidate count is not 5');
  if (!metrics.candidatePhotoCounts.every((value) => value === 1)) problems.push('a comparison candidate does not have exactly one loaded photo');
  if (metrics.imageFailuresRemoved !== 0) problems.push('one or more external images failed and were removed');
  if (metrics.brokenImages.length) problems.push('a broken image remains visible');
  if (metrics.duplicateImageSources.length) problems.push('duplicate image sources are visible');
  if (metrics.misleadingPumpkinPlacement) problems.push('out-of-season pumpkin item appears as photo or recommendation');
  if (!metrics.wakanPhotoMatches || !metrics.commenPhotoMatches || !metrics.maruPhotoMatches) problems.push('a product name and photo caption do not match');
  if (!metrics.homeReturnPresent) problems.push('home-return schedule is missing');
  if (metrics.horizontalOverflow > 1 || metrics.desktopHorizontalOverflow > 1) problems.push('horizontal page overflow detected');
  if (metrics.invalidLinks.length) problems.push('empty or invalid links are present');
  if (metrics.fontSizes.body < 16 || metrics.fontSizes.shopReason < 13 || metrics.fontSizes.candidateCopy < 13 || metrics.fontSizes.action < 12) problems.push('mobile text is too small');
  if (metrics.sticky.height > 76 || metrics.sticky.coversAnchor) problems.push('sticky status obscures anchored content');
  if (!metrics.assets.some((url) => url.includes('style.css?v=0.5.0')) || !metrics.assets.some((url) => url.includes('script.js?v=0.5.0'))) problems.push('versioned CSS/JS assets were not loaded');

  metrics.failedRequests = failedRequests;
  metrics.problems = problems;
  writeFileSync(outputDir + '/metrics.json', JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify(metrics, null, 2));

  if (problems.length) {
    throw new Error('Browser verification failed: ' + problems.join('; '));
  }

  console.log('ALL LIVE PAGE CHECKS PASSED');
} finally {
  if (metrics && !existsSync(outputDir + '/metrics.json')) {
    writeFileSync(outputDir + '/metrics.json', JSON.stringify(metrics, null, 2));
  }
  await browser.close();
}
