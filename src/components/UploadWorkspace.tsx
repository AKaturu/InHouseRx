import { ArrowRight, FileSearch, Info, LockKeyhole, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { FileDropZone } from './FileDropZone'
import { CompanionStatus } from './CompanionStatus'
import { validateFile } from '../services/documentExtractor'

interface UploadWorkspaceProps {
  onAnalyze: (exam: File, resources: File[]) => void
  onSample: () => void
}

export function UploadWorkspace({ onAnalyze, onSample }: UploadWorkspaceProps) {
  const [examFiles, setExamFiles] = useState<File[]>([])
  const [resourceFiles, setResourceFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<{ exam?: string; resources?: string; form?: string }>({})

  const addExam = (incoming: File[]) => {
    const error = incoming[0] ? validateFile(incoming[0]) : null
    if (error) return setErrors((current) => ({ ...current, exam: error }))
    setExamFiles(incoming)
    setErrors((current) => ({ ...current, exam: undefined, form: undefined }))
  }

  const addResources = (incoming: File[]) => {
    const error = incoming.map(validateFile).find(Boolean)
    if (error) return setErrors((current) => ({ ...current, resources: error }))
    setResourceFiles((current) => [...current, ...incoming].slice(0, 6))
    setErrors((current) => ({ ...current, resources: undefined, form: undefined }))
  }

  const submit = () => {
    const nextErrors = {
      exam: examFiles.length ? undefined : 'Add one in-house exam or exam blueprint.',
      resources: resourceFiles.length ? undefined : 'Add at least one study resource.',
    }
    if (nextErrors.exam || nextErrors.resources) {
      setErrors({ ...nextErrors, form: 'Your analysis needs both sides of the comparison.' })
      return
    }
    onAnalyze(examFiles[0], resourceFiles)
  }

  return (
    <main className="workspace-shell" id="upload-workspace">
      <section className="workspace-card" aria-labelledby="workspace-title">
        <div className="workspace-heading">
          <div>
            <span className="section-kicker">New analysis</span>
            <h2 id="workspace-title">Compare your coverage</h2>
            <p>Add both sides of the study equation. Your files stay on this device.</p>
          </div>
          <div className="workspace-tools">
            <CompanionStatus />
            <button className="sample-button" onClick={onSample}>
              <PlayCircle size={17} /> View sample report
            </button>
          </div>
        </div>

        <div className="upload-grid">
          <FileDropZone
            kind="exam"
            files={examFiles}
            onFiles={addExam}
            onRemove={() => setExamFiles([])}
            error={errors.exam}
          />
          <div className="comparison-mark" aria-hidden="true"><FileSearch size={17} /></div>
          <FileDropZone
            kind="resources"
            files={resourceFiles}
            onFiles={addResources}
            onRemove={(index) => setResourceFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
            error={errors.resources}
          />
        </div>

        <div className="workspace-footer">
          <div className="privacy-note">
            <LockKeyhole size={18} />
            <div><strong>Private by design</strong><span>Files are analyzed locally and never uploaded.</span></div>
          </div>
          <div className="analyze-actions">
            {errors.form && <span className="form-error" role="alert">{errors.form}</span>}
            <button className="primary-button" onClick={submit}>
              Analyze coverage <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <div className="guidance-note">
        <Info size={17} />
        <p><strong>Best results:</strong> Use a detailed exam blueprint or review copy. The optional local companion adds OCR, image, audio, and video support.</p>
      </div>
    </main>
  )
}
