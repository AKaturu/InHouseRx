import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { DocumentRole, SourceDocument } from '../domain/types'

export const MAX_FILE_SIZE = 20 * 1024 * 1024
export const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'pptx', 'txt', 'md'] as const

const getExtension = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

export const validateFile = (file: File): string | null => {
  const extension = getExtension(file.name)
  if (!SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number])) {
    return `${file.name} is not supported. Use PDF, DOCX, PPTX, TXT, or MD.`
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
  let text: string

  try {
    if (extension === 'pdf') text = await extractPdf(file)
    else if (extension === 'docx') text = await extractDocx(file)
    else if (extension === 'pptx') text = await extractPptx(file)
    else text = await file.text()
  } catch {
    throw new Error(`We couldn't read ${file.name}. It may be encrypted, damaged, or use an unsupported format.`)
  }

  if (text.trim().length < 20) {
    throw new Error(`${file.name} has too little selectable text. Scanned documents need OCR, which is not in this MVP yet.`)
  }

  return {
    id: `${role}-${file.name}-${file.lastModified}`,
    name: file.name,
    role,
    text,
    size: file.size,
  }
}
