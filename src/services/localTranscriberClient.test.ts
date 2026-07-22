import { afterEach, describe, expect, it, vi } from 'vitest'
import { getLocalTranscriberCapabilities, normalizeLoopbackUrl, transcribeWithLocalCompanion } from './localTranscriberClient'

const response = (payload: unknown, ok = true) => ({
  ok,
  json: vi.fn().mockResolvedValue(payload),
}) as unknown as Response

afterEach(() => {
  Reflect.deleteProperty(window, 'inHouseRxDesktop')
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('normalizeLoopbackUrl', () => {
  it('accepts loopback URLs and removes paths', () => {
    expect(normalizeLoopbackUrl('http://127.0.0.1:8766/api')).toBe('http://127.0.0.1:8766')
    expect(normalizeLoopbackUrl('http://localhost:8766')).toBe('http://localhost:8766')
  })

  it('rejects remote, secure, credentialed, and malformed endpoints', () => {
    expect(() => normalizeLoopbackUrl('https://127.0.0.1:8766')).toThrow('HTTP loopback')
    expect(() => normalizeLoopbackUrl('http://example.com:8766')).toThrow('HTTP loopback')
    expect(() => normalizeLoopbackUrl('http://user:pass@localhost:8766')).toThrow('HTTP loopback')
    expect(() => normalizeLoopbackUrl('not a url')).toThrow('invalid')
  })
})

describe('getLocalTranscriberCapabilities', () => {
  it('uses the constrained desktop bridge when available', async () => {
    const getCompanionCapabilities = vi.fn().mockResolvedValue({
      supported_extensions: ['.png'],
      max_file_mb: 20,
      ocr: { ready: true },
      speech: { ready: false },
      privacy: 'Desktop loopback only.',
    })
    Object.defineProperty(window, 'inHouseRxDesktop', {
      configurable: true,
      value: { platform: 'win32', getCompanionCapabilities, transcribeWithCompanion: vi.fn() },
    })
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(getLocalTranscriberCapabilities()).resolves.toMatchObject({
      supportedExtensions: ['.png'],
      ocrReady: true,
      detail: 'Desktop loopback only.',
    })
    expect(getCompanionCapabilities).toHaveBeenCalledOnce()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('maps the upstream capability contract', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({
      supported_extensions: ['.pdf', '.png', '.mp3'],
      max_file_mb: 250,
      ocr: { ready: true },
      speech: { ready: false },
      privacy: 'Processed locally.',
    }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getLocalTranscriberCapabilities({ timeoutMs: 100 })).resolves.toEqual({
      supportedExtensions: ['.pdf', '.png', '.mp3'],
      maxFileMb: 250,
      ocrReady: true,
      speechReady: false,
      detail: 'Processed locally.',
    })
    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8766/api/capabilities', expect.any(Object))
  })

  it('rejects a malformed capability response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ status: 'ok' })))
    await expect(getLocalTranscriberCapabilities()).rejects.toThrow('invalid capability response')
  })
})

describe('transcribeWithLocalCompanion', () => {
  it('sends file bytes through the desktop bridge without using renderer fetch', async () => {
    const transcribeWithCompanion = vi.fn().mockResolvedValue({
      filename: 'scan.png',
      media_type: 'image/png',
      text: 'Readable OCR content',
      warnings: [],
    })
    Object.defineProperty(window, 'inHouseRxDesktop', {
      configurable: true,
      value: { platform: 'linux', getCompanionCapabilities: vi.fn(), transcribeWithCompanion },
    })
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const file = new File(['image bytes'], 'scan.png', { type: 'image/png' })
    Object.defineProperty(file, 'arrayBuffer', {
      value: vi.fn().mockResolvedValue(new TextEncoder().encode('image bytes').buffer),
    })

    await expect(transcribeWithLocalCompanion(file)).resolves.toMatchObject({ text: 'Readable OCR content' })
    expect(transcribeWithCompanion).toHaveBeenCalledWith(expect.objectContaining({
      name: 'scan.png',
      type: 'image/png',
    }))
    expect(transcribeWithCompanion.mock.calls[0][0].bytes.byteLength).toBe(11)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts one file and returns normalized text with warnings', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({
      filename: 'scan.png',
      media_type: 'image/png',
      text: '## Image\n\nMyocardial infarction and troponin.',
      warnings: ['OCR confidence was moderate.'],
    }))
    vi.stubGlobal('fetch', fetchMock)
    const file = new File(['image bytes'], 'scan.png', { type: 'image/png' })

    const result = await transcribeWithLocalCompanion(file, { timeoutMs: 100 })

    expect(result.text).toContain('troponin')
    expect(result.warnings).toEqual(['OCR confidence was moderate.'])
    const [, request] = fetchMock.mock.calls[0]
    expect(request.method).toBe('POST')
    expect(request.body).toBeInstanceOf(FormData)
  })

  it('preserves structured upstream errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      error: { code: 'model_unavailable', message: 'Install the configured speech model.', recoverable: true },
    }, false)))

    await expect(transcribeWithLocalCompanion(new File(['audio'], 'lecture.mp3'))).rejects.toThrow('Install the configured speech model.')
  })

  it('turns connection failures into setup guidance', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('connection refused')))

    await expect(transcribeWithLocalCompanion(new File(['image'], 'scan.png'))).rejects.toThrow('Start the InHouseRx local companion')
  })
})
