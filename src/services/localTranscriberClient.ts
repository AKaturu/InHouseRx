export interface LocalTranscriberCapabilities {
  supportedExtensions: string[]
  maxFileMb: number
  ocrReady: boolean
  speechReady: boolean
  detail: string
}

export interface LocalTranscriberResult {
  filename: string
  mediaType: string
  text: string
  warnings: string[]
}

interface ClientOptions {
  baseUrl?: string
  timeoutMs?: number
}

const DEFAULT_BASE_URL = import.meta.env.VITE_LOCAL_TRANSCRIBER_URL || 'http://127.0.0.1:8766'
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]'])

export const normalizeLoopbackUrl = (value: string) => {
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new Error('The Local Content Transcriber URL is invalid.')
  }

  if (parsed.protocol !== 'http:' || !LOOPBACK_HOSTS.has(parsed.hostname) || parsed.username || parsed.password) {
    throw new Error('Local Content Transcriber must use an HTTP loopback address on this device.')
  }
  return parsed.origin
}

const fetchWithTimeout = async (url: string, init: RequestInit = {}, timeoutMs = 2_000) => {
  const controller = new AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    globalThis.clearTimeout(timeout)
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

export const getLocalTranscriberCapabilities = async (options: ClientOptions = {}): Promise<LocalTranscriberCapabilities> => {
  const baseUrl = normalizeLoopbackUrl(options.baseUrl ?? DEFAULT_BASE_URL)
  const response = await fetchWithTimeout(`${baseUrl}/api/capabilities`, {}, options.timeoutMs)
  if (!response.ok) throw new Error('Local Content Transcriber is not ready.')

  const payload: unknown = await response.json()
  if (!isRecord(payload) || !Array.isArray(payload.supported_extensions)) {
    throw new Error('Local Content Transcriber returned an invalid capability response.')
  }

  const ocr = isRecord(payload.ocr) ? payload.ocr : {}
  const speech = isRecord(payload.speech) ? payload.speech : {}
  return {
    supportedExtensions: payload.supported_extensions.filter((value): value is string => typeof value === 'string'),
    maxFileMb: typeof payload.max_file_mb === 'number' ? payload.max_file_mb : 20,
    ocrReady: ocr.ready === true,
    speechReady: speech.ready === true,
    detail: typeof payload.privacy === 'string' ? payload.privacy : 'Files are processed on this device.',
  }
}

export const transcribeWithLocalCompanion = async (file: File, options: ClientOptions = {}): Promise<LocalTranscriberResult> => {
  const baseUrl = normalizeLoopbackUrl(options.baseUrl ?? DEFAULT_BASE_URL)
  const form = new FormData()
  form.append('file', file)
  form.append('ocr_engine', 'auto')

  let response: Response
  try {
    response = await fetchWithTimeout(
      `${baseUrl}/api/transcriptions`,
      { method: 'POST', body: form },
      options.timeoutMs ?? 120_000,
    )
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Local transcription timed out while reading ${file.name}.`, { cause: error })
    }
    throw new Error('Start the InHouseRx local companion to analyze scans, images, audio, or video.', { cause: error })
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const error = isRecord(payload) && isRecord(payload.error) ? payload.error : null
    const message = error && typeof error.message === 'string' ? error.message : `Local transcription failed for ${file.name}.`
    throw new Error(message)
  }

  if (!isRecord(payload) || typeof payload.text !== 'string' || !payload.text.trim()) {
    throw new Error(`Local Content Transcriber found no readable content in ${file.name}.`)
  }

  return {
    filename: typeof payload.filename === 'string' ? payload.filename : file.name,
    mediaType: typeof payload.media_type === 'string' ? payload.media_type : file.type,
    text: payload.text,
    warnings: Array.isArray(payload.warnings)
      ? payload.warnings.filter((warning): warning is string => typeof warning === 'string')
      : [],
  }
}
