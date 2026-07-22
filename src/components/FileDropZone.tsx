import { FileCheck2, FileText, Plus, Trash2, UploadCloud } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react'

interface FileDropZoneProps {
  kind: 'exam' | 'resources'
  files: File[]
  onFiles: (files: File[]) => void
  onRemove: (index: number) => void
  error?: string
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileDropZone({ kind, files, onFiles, onRemove, error }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const isExam = kind === 'exam'
  const maxFiles = isExam ? 1 : 6

  const acceptFiles = (incoming: File[]) => {
    if (!incoming.length) return
    onFiles(isExam ? incoming.slice(0, 1) : incoming.slice(0, Math.max(0, maxFiles - files.length)))
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    acceptFiles(Array.from(event.dataTransfer.files))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div className={`file-panel ${error ? 'has-error' : ''}`}>
      <div className="file-panel-heading">
        <span className={`step-number ${files.length ? 'complete' : ''}`}>
          {files.length ? <FileCheck2 size={16} /> : isExam ? '1' : '2'}
        </span>
        <div>
          <h3>{isExam ? 'In-house exam' : 'Study resources'}</h3>
          <p>{isExam ? 'What your course expects you to know' : 'What you are currently studying from'}</p>
        </div>
      </div>

      {files.length === 0 ? (
        <div
          className={`drop-zone ${dragging ? 'is-dragging' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${isExam ? 'an in-house exam' : 'study resources'}`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="upload-icon"><UploadCloud size={24} /></div>
          <strong>Drop {isExam ? 'your exam' : 'your resources'} here</strong>
          <span>or <u>browse files</u></span>
          <small>PDF, DOCX, PPTX, TXT · up to 20 MB</small>
        </div>
      ) : (
        <div className="selected-files">
          {files.map((file, index) => (
            <div className="file-row" key={`${file.name}-${file.lastModified}`}>
              <div className="file-type"><FileText size={20} /></div>
              <div className="file-details">
                <strong>{file.name}</strong>
                <span>{formatSize(file.size)} · Ready to analyze</span>
              </div>
              <button className="icon-button" onClick={() => onRemove(index)} aria-label={`Remove ${file.name}`}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {files.length < maxFiles && (
            <button className="add-more" onClick={() => inputRef.current?.click()}>
              <Plus size={16} /> Add {isExam ? 'a different file' : 'another resource'}
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept=".pdf,.docx,.pptx,.txt,.md"
        multiple={!isExam}
        onChange={handleChange}
      />
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  )
}
