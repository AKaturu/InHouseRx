import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { DocumentRole, SourceDocument } from '../domain/types'
import { transcribeWithLocalCompanion } from './localTranscriberClient'

export const MAX_FILE_SIZE = 20 * 1024 * 1024
export const BROWSER_EXTENSIONS = ['pdf', 'docx', 'pptx', 'txt', 'md'] as const
export const COMPANION_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'tif', 'tiff', 'bmp', 'webp',
  'wav', 'mp3', 'm4a', 'flac', 'ogg',
  'mp4', 'mov', 'mkv', 'webm',
] as const
export const SUPPORTED_EXTENSIONS = [...BROWSER_EXTENSIONS, ...COMPANION_EXTENSIONS] as const

const getExtension = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

export const validateFile = (file: File): string | null => {
  const extension = getExtension(file.name)
  if (!SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number])) {
    return `${file.name} is not supported. Use a document, image, audio, or video format listed in the upload panel.`
  }
  if (file.size > MAX_FILE_SIZE) return `${file.name} is larger than the 20 MB limit.`
  if (file.size === 0) return `${file.name} is empty.`
  return null
}

const extractPdf = async (file: File) => {
  const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc = pdfWorker
  const pdf = await getDocument({ data: await file.arrayBuffer() }).promise
  const pages: string[] = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '))
  }
  return pages.join('\n\n')
}

const extractDocx = async (file: File) => {
  const { default: mammoth } = await import('mammoth')
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return result.value
}

const extractPptx = async (file: File) => {
  const { default: JSZip } = await import('jszip')
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const slides = Object.values(zip.files)
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.name))
    .sort((a, b) => {
      const aNumber = Number(a.name.match(/slide(\d+)/)?.[1] ?? 0)
      const bNumber = Number(b.name.match(/slide(\d+)/)?.[1] ?? 0)
      return aNumber - bNumber
    })

  const slideText = await Promise.all(
    slides.map(async (slide) => {
      const xml = await slide.async('string')
      const document = new DOMParser().parseFromString(xml, 'application/xml')
      return [...document.getElementsByTagNameNS('*', 't')].map((node) => node.textContent ?? '').join(' ')
    }),
  )
  return slideText.join('\n\n')
}

export const extractDocument = async (file: File, role: DocumentRole): Promise<SourceDocument> => {
  const validationError = validateFile(file)
  if (validationError) throw new Error(validationError)

  const extension = getExtension(file.name)
  const isCompanionOnly = COMPANION_EXTENSIONS.includes(extension as (typeof COMPANION_EXTENSIONS)[number])

  if (isCompanionOnly) {
    const result = await transcribeWithLocalCompanion(file)
    return {
      id: `${role}-${file.name}-${file.lastModified}`,
      name: file.name,
      role,
      text: result.text,
      size: file.size,
      extractionMethod: 'local-transcriber',
      warnings: result.warnings,
    }
  }

  let text: string

  try {
    if (extension === 'pdf') text = await extractPdf(file)
    else if (extension === 'docx') text = await extractDocx(file)
    else if (extension === 'pptx') text = await extractPptx(file)
    else text = await file.text()
  } catch {
    if (extension === 'pdf' || extension === 'docx' || extension === 'pptx') {
      try {
        const result = await transcribeWithLocalCompanion(file)
        return {
          id: `${role}-${file.name}-${file.lastModified}`,
          name: file.name,
          role,
          text: result.text,
          size: file.size,
          extractionMethod: 'local-transcriber',
          warnings: result.warnings,
        }
      } catch {
        // Preserve the browser extractor's more relevant corrupt/encrypted guidance.
      }
    }
    throw new Error(`We couldn't read ${file.name}. It may be encrypted, damaged, or use an unsupported format.`)
  }

  if (text.trim().length < 20) {
    if (extension === 'pdf' || extension === 'docx' || extension === 'pptx') {
      try {
        const result = await transcribeWithLocalCompanion(file)
        return {
          id: `${role}-${file.name}-${file.lastModified}`,
          name: file.name,
          role,
          text: result.text,
          size: file.size,
          extractionMethod: 'local-transcriber',
          warnings: result.warnings,
        }
      } catch {
        // The companion is optional; retain actionable OCR guidance below.
      }
    }
    throw new Error(`${file.name} has too little selectable text. Start the optional local companion to add OCR.`)
  }

  return {
    id: `${role}-${file.name}-${file.lastModified}`,
    name: file.name,
    role,
    text,
    size: file.size,
    extractionMethod: 'browser',
    warnings: [],
  }
}
