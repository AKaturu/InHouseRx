import { useRef, useState } from 'react'
import { AnalysisReport } from './components/AnalysisReport'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProcessingView } from './components/ProcessingView'
import { UploadWorkspace } from './components/UploadWorkspace'
import type { AnalysisReportModel } from './domain/types'
import { sampleExam, sampleResources } from './data/sampleDocuments'
import { analyzeDocuments } from './services/analysisEngine'
import { extractDocument } from './services/documentExtractor'

type AppView = 'upload' | 'processing' | 'report'

function App() {
  const [view, setView] = useState<AppView>('upload')
  const [stage, setStage] = useState<'extracting' | 'analyzing'>('extracting')
  const [processingMeta, setProcessingMeta] = useState({ examName: '', resourceCount: 0 })
  const [report, setReport] = useState<AnalysisReportModel | null>(null)
  const [error, setError] = useState<string | null>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)

  const reset = () => {
    setView('upload')
    setReport(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showReport = (nextReport: AnalysisReportModel) => {
    setReport(nextReport)
    setView('report')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const analyzeFiles = async (examFile: File, resourceFiles: File[]) => {
    setError(null)
    setProcessingMeta({ examName: examFile.name, resourceCount: resourceFiles.length })
    setStage('extracting')
    setView('processing')
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const [exam, ...resources] = await Promise.all([
        extractDocument(examFile, 'exam'),
        ...resourceFiles.map((file) => extractDocument(file, 'resource')),
      ])
      setStage('analyzing')
      await new Promise((resolve) => window.setTimeout(resolve, 450))
      showReport(analyzeDocuments(exam, resources))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'The analysis could not be completed.')
      setView('upload')
      window.setTimeout(() => document.getElementById('analysis-error')?.focus(), 0)
    }
  }

  const analyzeSample = () => {
    setError(null)
    setProcessingMeta({ examName: sampleExam.name, resourceCount: sampleResources.length })
    setStage('analyzing')
    setView('processing')
    window.setTimeout(() => showReport(analyzeDocuments(sampleExam, sampleResources)), 650)
  }

  const explore = () => {
    document.getElementById('upload-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app" ref={workspaceRef}>
      <Header onReset={reset} />
      {view === 'upload' && (
        <>
          <Hero onExplore={explore} />
          {error && <div className="global-error" id="analysis-error" role="alert" tabIndex={-1}>{error}</div>}
          <UploadWorkspace onAnalyze={analyzeFiles} onSample={analyzeSample} />
          <footer className="site-footer"><span>InHouseRx</span><p>Know what’s missing. Study what matters.</p><small>Educational use only · Not affiliated with NBME or NBOME</small></footer>
        </>
      )}
      {view === 'processing' && <ProcessingView {...processingMeta} stage={stage} />}
      {view === 'report' && report && <AnalysisReport report={report} onReset={reset} />}
    </div>
  )
}

export default App
