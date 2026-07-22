import path from 'node:path'

export const MAX_COMPANION_FILE_BYTES = 20 * 1024 * 1024

const ALLOWED_GITHUB_REPOSITORIES = new Set([
  '/AKaturu/InHouseRx',
  '/AKaturu/local-content-transcriber',
])

export function isAllowedExternalUrl(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password) return false
    return [...ALLOWED_GITHUB_REPOSITORIES].some(
      (repository) => url.pathname === repository || url.pathname.startsWith(`${repository}/`),
    )
  } catch {
    return false
  }
}

export function isTrustedRendererUrl(value, developmentOrigin) {
  try {
    const url = new URL(value)
    if (url.protocol === 'inhouserx:' && url.hostname === 'app') return true
    if (!developmentOrigin) return false
    const expected = new URL(developmentOrigin)
    return url.origin === expected.origin && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
  } catch {
    return false
  }
}

export function resolveAppAsset(rendererRoot, requestUrl, exists) {
  const root = path.resolve(rendererRoot)
  const url = new URL(requestUrl)
  if (url.protocol !== 'inhouserx:' || url.hostname !== 'app') throw new Error('Invalid application URL.')

  let requestedPath
  try {
    requestedPath = decodeURIComponent(url.pathname).replace(/^[/\\]+/, '') || 'index.html'
  } catch {
    throw new Error('Invalid application path encoding.')
  }

  const candidate = path.resolve(root, requestedPath)
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error('Application path traversal is not allowed.')
  }

  return exists(candidate) ? candidate : path.join(root, 'index.html')
}

export function normalizeCompanionFile(value) {
  if (!value || typeof value !== 'object') throw new Error('A file is required.')
  const name = typeof value.name === 'string' ? value.name.trim() : ''
  const type = typeof value.type === 'string' ? value.type.trim() : ''
  const bytes = value.bytes

  if (!name || name.length > 255 || /[/\\\0]/.test(name)) throw new Error('The filename is invalid.')
  if (type.length > 255 || /[\r\n]/.test(type)) throw new Error('The media type is invalid.')
  if (!(bytes instanceof ArrayBuffer) && !ArrayBuffer.isView(bytes)) throw new Error('The file content is invalid.')

  const content = bytes instanceof ArrayBuffer
    ? new Uint8Array(bytes)
    : new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (content.byteLength === 0) throw new Error('The file is empty.')
  if (content.byteLength > MAX_COMPANION_FILE_BYTES) throw new Error('Files must be 20 MB or smaller.')

  return { name, type: type || 'application/octet-stream', content }
}

