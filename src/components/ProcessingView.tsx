import { Check, FileText, ScanSearch, ShieldCheck } from 'lucide-react'

interface ProcessingViewProps {
  examName: string
  resourceCount: number
  stage: 'extracting' | 'analyzing'
}

export function ProcessingView({ examName, resourceCount, stage }: ProcessingViewProps) {
  return (
    <main className="processing-page">
      <section className="processing-card" aria-live="polite">
        <div className="processing-visual">
          <div className="processing-ring" />
          <ScanSearch size={34} />
        </div>
        <span className="section-kicker">Building your coverage map</span>
        <h1>{stage === 'extracting' ? 'Reading your documents…' : 'Comparing topic emphasis…'}</h1>
        <p>Everything is happening on your device. OCR and media may take a little longer.</p>
        <div className="processing-steps">
          <div className="process-step done"><span><Check size={15} /></span><div><strong>Files validated</strong><small>{examName} + {resourceCount} resource{resourceCount === 1 ? '' : 's'}</small></div></div>
          <div className={`process-step ${stage === 'analyzing' ? 'done' : 'active'}`}><span>{stage === 'analyzing' ? <Check size={15} /> : <FileText size={15} />}</span><div><strong>Text extracted locally</strong><small>PDF, document, and slide content</small></div></div>
          <div className={`process-step ${stage === 'analyzing' ? 'active' : ''}`}><span><ScanSearch size={15} /></span><div><strong>Coverage mapped</strong><small>Comparing systems, topics, and evidence</small></div></div>
        </div>
        <div className="processing-private"><ShieldCheck size={16} /> No source content leaves this device</div>
      </section>
    </main>
  )
}
