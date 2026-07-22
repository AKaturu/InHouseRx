import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { extractDocument, MAX_FILE_SIZE, validateFile } from './documentExtractor'

const makeFile = (content: string, name: string) => {
  const file = new File([content], name, { type: 'text/plain', lastModified: 123 })
  if (!file.text) Object.defineProperty(file, 'text', { value: async () => content })
  return file
}

describe('validateFile', () => {
  it('accepts supported document extensions', () => {
    expect(validateFile(makeFile('medical content', 'exam.pdf'))).toBeNull()
    expect(validateFile(makeFile('medical content', 'notes.docx'))).toBeNull()
    expect(validateFile(makeFile('medical content', 'slides.pptx'))).toBeNull()
    expect(validateFile(makeFile('medical content', 'outline.TXT'))).toBeNull()
  })

  it('rejects unsupported, empty, and oversized files with specific messages', () => {
    expect(validateFile(makeFile('content', 'archive.zip'))).toContain('not supported')
    expect(validateFile(makeFile('', 'empty.txt'))).toContain('empty')

    const oversized = makeFile('content', 'large.pdf')
    Object.defineProperty(oversized, 'size', { value: MAX_FILE_SIZE + 1 })
    expect(validateFile(oversized)).toContain('20 MB')
  })
})

describe('extractDocument', () => {
  it('extracts a local text file into the domain contract', async () => {
    const file = makeFile('Myocardial infarction and troponin review content.', 'exam.txt')
    const result = await extractDocument(file, 'exam')

    expect(result.name).toBe('exam.txt')
    expect(result.role).toBe('exam')
    expect(result.text).toContain('troponin')
    expect(result.id).toContain('exam-exam.txt')
  })

  it('rejects files with too little selectable text', async () => {
    await expect(extractDocument(makeFile('tiny', 'exam.txt'), 'exam')).rejects.toThrow('too little selectable text')
  })

  it('extracts slide text from a PPTX container in slide order', async () => {
    const zip = new JSZip()
    zip.file('ppt/slides/slide2.xml', '<p:sld xmlns:p="p" xmlns:a="a"><a:t>Troponin follow-up</a:t></p:sld>')
    zip.file('ppt/slides/slide1.xml', '<p:sld xmlns:p="p" xmlns:a="a"><a:t>Myocardial infarction overview</a:t></p:sld>')
    const bytes = await zip.generateAsync({ type: 'uint8array' })
    const buffer = new ArrayBuffer(bytes.byteLength)
    new Uint8Array(buffer).set(bytes)
    const file = new File([buffer], 'lecture.pptx', { lastModified: 456 })
    Object.defineProperty(file, 'arrayBuffer', {
      value: async () => buffer,
    })

    const result = await extractDocument(file, 'resource')

    expect(result.text).toBe('Myocardial infarction overview\n\nTroponin follow-up')
  })
})
