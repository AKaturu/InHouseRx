import { access, copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mediaDirectory = path.join(root, 'docs', 'media')
const recordingDirectory = await mkdtemp(path.join(os.tmpdir(), 'inhouserx-media-'))
const baseUrl = process.env.INHOUSERX_MEDIA_URL ?? 'http://127.0.0.1:4173'

const browserCandidates = [
  process.env.PLAYWRIGHT_BROWSER_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/microsoft-edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

async function firstAccessible(paths) {
  for (const candidate of paths) {
    try {
      await access(candidate)
      return candidate
    } catch {
      // Keep searching known browser locations.
    }
  }
  throw new Error('No Chromium-family browser found. Set PLAYWRIGHT_BROWSER_PATH and try again.')
}

async function preparePage(page) {
  await page.route('http://127.0.0.1:8766/**', (route) => route.fulfill({
    status: 503,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': baseUrl },
    body: JSON.stringify({ error: { message: 'Companion intentionally disabled for media capture.' } }),
  }))
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /Find what your study resources/i }).waitFor()
}

async function addCaptionSystem(page) {
  await page.addStyleTag({ content: `
    #inhouserx-demo-caption {
      position: fixed;
      z-index: 2147483647;
      left: 50%;
      bottom: 28px;
      max-width: min(820px, calc(100vw - 56px));
      padding: 13px 20px;
      color: #fff;
      background: rgba(20, 64, 101, .94);
      border: 1px solid rgba(255, 255, 255, .28);
      border-radius: 999px;
      box-shadow: 0 14px 38px rgba(14, 42, 65, .28);
      font: 700 17px/1.35 Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: -.01em;
      text-align: center;
      transform: translate(-50%, 18px);
      opacity: 0;
      transition: opacity .28s ease, transform .28s ease;
      pointer-events: none;
    }
    #inhouserx-demo-caption.visible { opacity: 1; transform: translate(-50%, 0); }
  ` })
}

async function caption(page, text, duration) {
  await page.evaluate((value) => {
    let element = document.querySelector('#inhouserx-demo-caption')
    if (!element) {
      element = document.createElement('div')
      element.id = 'inhouserx-demo-caption'
      document.body.append(element)
    }
    element.textContent = value
    requestAnimationFrame(() => element.classList.add('visible'))
  }, text)
  await page.waitForTimeout(duration)
  await page.evaluate(() => document.querySelector('#inhouserx-demo-caption')?.classList.remove('visible'))
  await page.waitForTimeout(350)
}

async function smoothScrollTo(page, selector, block = 'start') {
  await page.locator(selector).first().evaluate((element, position) => {
    element.scrollIntoView({ behavior: 'smooth', block: position })
  }, block)
  await page.waitForTimeout(1_200)
}

async function recordDemo(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    screen: { width: 1280, height: 720 },
    colorScheme: 'light',
    deviceScaleFactor: 1,
    recordVideo: {
      dir: recordingDirectory,
      size: { width: 1280, height: 720 },
      showActions: { duration: 700, position: 'top-right', fontSize: 16 },
    },
  })
  const page = await context.newPage()
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error))
  await preparePage(page)
  await addCaptionSystem(page)

  await caption(page, 'Find what your study resources missed.', 2_400)
  await page.getByRole('button', { name: /Start a private analysis/i }).click()
  await page.waitForTimeout(1_000)
  await caption(page, 'Compare an in-house exam with the resources you trust.', 2_500)
  await page.getByRole('button', { name: /View sample report/i }).click()
  await page.getByRole('heading', { name: /Your highest-yield gaps/i }).waitFor()
  await caption(page, 'Map tested topics and resource alignment locally.', 2_500)
  await caption(page, 'See critical gaps, readiness, and mapped topics at a glance.', 2_700)
  await smoothScrollTo(page, '.priority-section')
  await caption(page, 'Prioritize the highest-yield gaps first.', 2_700)
  await smoothScrollTo(page, '.gap-card:nth-of-type(2)', 'center')
  await caption(page, 'Every gap includes evidence and a concrete next step.', 3_000)
  await page.getByRole('button', { name: /New analysis/i }).click()
  await page.waitForTimeout(1_100)
  await caption(page, 'InHouseRx · Know what’s missing. Study what matters.', 2_800)

  const video = page.video()
  await context.close()
  if (!video) throw new Error('Playwright did not create a video recording.')
  await copyFile(await video.path(), path.join(mediaDirectory, 'inhouserx-demo.webm'))
  if (pageErrors.length) throw new AggregateError(pageErrors, 'The demo page reported runtime errors.')
}

async function captureScreenshots(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    screen: { width: 1440, height: 960 },
    colorScheme: 'light',
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await preparePage(page)

  await page.screenshot({ path: path.join(mediaDirectory, 'inhouserx-landing.png') })
  await smoothScrollTo(page, '#upload-workspace')
  await page.locator('.workspace-card').screenshot({ path: path.join(mediaDirectory, 'inhouserx-upload-workspace.png') })

  await page.getByRole('button', { name: /View sample report/i }).click()
  await page.getByRole('heading', { name: /Your highest-yield gaps/i }).waitFor()
  await page.screenshot({ path: path.join(mediaDirectory, 'inhouserx-report-overview.png') })
  await smoothScrollTo(page, '.priority-section')
  await page.screenshot({ path: path.join(mediaDirectory, 'inhouserx-priority-gaps.png') })

  await context.close()
}

await mkdir(mediaDirectory, { recursive: true })
const executablePath = await firstAccessible(browserCandidates)
const browser = await chromium.launch({ executablePath, headless: true })

try {
  await recordDemo(browser)
  await captureScreenshots(browser)
  console.log(`Captured InHouseRx project media in ${mediaDirectory}`)
} finally {
  await browser.close()
  await rm(recordingDirectory, { recursive: true, force: true })
}
