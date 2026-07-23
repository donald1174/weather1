// scripts/screenshot.js
// 배포된 날씨 대시보드 페이지를 헤드리스 브라우저로 열어 스크린샷을 찍습니다.

const { chromium } = require('playwright');

// ⚠️ 본인의 GitHub Pages 주소로 되어 있는지 확인하세요.
const TARGET_URL = 'https://donald1174.github.io/weather1/';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1000, height: 1200 },
    deviceScaleFactor: 2, // 선명하게
  });

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });

  // 날씨/대기질 API 호출이 완료될 시간을 조금 더 줍니다.
  await page.waitForTimeout(6000);

  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
  console.log('스크린샷 저장 완료: screenshot.png');
})().catch((err) => {
  console.error('스크린샷 촬영 실패:', err);
  process.exit(1);
});
