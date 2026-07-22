import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { app, BrowserWindow, ipcMain, net, protocol, session, shell } from 'electron'
import {
  isAllowedExternalUrl,
  isTrustedRendererUrl,
  normalizeCompanionFile,
  resolveAppAsset,
} from './security.mjs'

const APP_ORIGIN = 'inhouserx://app'
const COMPANION_ORIGIN = 'http://127.0.0.1:8766'
const developmentOrigin = app.isPackaged ? undefined : process.env.VITE_DEV_SERVER_URL
const smokeTest = process.argv.includes('--smoke-test')

protocol.registerSchemesAsPrivileged([{
  scheme: 'inhouserx',
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: false },
}])

function assertTrustedSender(event) {
  if (!isTrustedRendererUrl(event.senderFrame?.url ?? '', developmentOrigin)) {
    throw new Error('Untrusted desktop request.')
  }
}

async function fetchJson(pathname, init = {}, timeoutMs = 2_000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${COMPANION_ORIGIN}${pathname}`, { ...init, signal: controller.signal })
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      const message = payload?.error?.message
      throw new Error(typeof message === 'string' ? message : 'Local Content Transcriber is not ready.')
    }
    return payload
  } finally {
    clearTimeout(timeout)
  }
}

function registerCompanionHandlers() {
  ipcMain.handle('companion:get-capabilities', async (event) => {
    assertTrustedSender(event)
    return fetchJson('/api/capabilities')
  })
  ipcMain.handle('companion:transcribe', async (event, input) => {
    assertTrustedSender(event)
    const file = normalizeCompanionFile(input)
    const form = new FormData()
    form.append('file', new Blob([file.content], { type: file.type }), file.name)
    form.append('ocr_engine', 'auto')
    return fetchJson('/api/transcriptions', { method: 'POST', body: form }, 120_000)
  })
}

function registerApplicationProtocol() {
  const rendererRoot = path.join(app.getAppPath(), 'dist')
  protocol.handle('inhouserx', (request) => {
    try {
      const asset = resolveAppAsset(rendererRoot, request.url, existsSync)
      return net.fetch(pathToFileURL(asset).toString())
    } catch {
      return new Response('Not found', { status: 404 })
    }
  })
}

function secureSession() {
  session.defaultSession.setPermissionCheckHandler(() => false)
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false))
}

async function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 820,
    minHeight: 620,
    show: false,
    backgroundColor: '#337ab7',
    icon: path.join(app.getAppPath(), 'build', 'icon.png'),
    title: 'InHouseRx',
    webPreferences: {
      preload: path.join(app.getAppPath(), 'electron', 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  })

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedExternalUrl(url)) void shell.openExternal(url)
    return { action: 'deny' }
  })
  window.webContents.on('will-navigate', (event, url) => {
    if (isTrustedRendererUrl(url, developmentOrigin)) return
    event.preventDefault()
    if (isAllowedExternalUrl(url)) void shell.openExternal(url)
  })

  if (smokeTest) {
    const timeout = setTimeout(() => app.exit(1), 20_000)
    window.webContents.once('did-finish-load', async () => {
      try {
        const loadedSecurely = await window.webContents.executeJavaScript(
          "Boolean(window.inHouseRxDesktop) && document.title.startsWith('InHouseRx') && Boolean(document.querySelector('#root'))",
        )
        clearTimeout(timeout)
        app.exit(loadedSecurely ? 0 : 1)
      } catch {
        clearTimeout(timeout)
        app.exit(1)
      }
    })
    window.webContents.once('did-fail-load', () => {
      clearTimeout(timeout)
      app.exit(1)
    })
  } else {
    window.once('ready-to-show', () => window.show())
  }

  if (developmentOrigin) {
    const url = new URL(developmentOrigin)
    if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
      throw new Error('The desktop development server must use a loopback HTTP origin.')
    }
    await window.loadURL(url.origin)
  } else {
    await window.loadURL(`${APP_ORIGIN}/index.html`)
  }
}

const hasSingleInstanceLock = app.requestSingleInstanceLock()
if (!hasSingleInstanceLock) app.quit()

app.on('second-instance', () => {
  const window = BrowserWindow.getAllWindows()[0]
  if (!window) return
  if (window.isMinimized()) window.restore()
  window.focus()
})

app.whenReady().then(async () => {
  registerApplicationProtocol()
  secureSession()
  registerCompanionHandlers()
  await createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) void createWindow()
  })
}).catch((error) => {
  console.error(error)
  app.exit(1)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
