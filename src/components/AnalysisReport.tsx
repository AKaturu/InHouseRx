import { AlertTriangle, ArrowDownRight, ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, ChevronRight, FileText, Gauge, Lightbulb, RotateCcw, ScanText, ShieldCheck, Sparkles } from 'lucide-react'
import type { AnalysisReportModel, TopicResult } from '../domain/types'

interface AnalysisReportProps {
  report: AnalysisReportModel
  onReset: () => void
}

const statusLabel: Record<TopicResult['status'], string> = {
  critical: 'Critical gap',
  moderate: 'Needs review',
  covered: 'Well covered',
  strong: 'Strong coverage',
}

function ScoreRing({ score }: { score: number }) {
  const degrees = Math.round(score * 3.6)
  return (
    <div className="score-ring" style={{ '--score-angle': `${degrees}deg` } as React.CSSProperties}>
      <div><strong>{score}</strong><span>/100</span></div>
    </div>
  )
}

function TopicGapCard({ topic, rank }: { topic: TopicResult; rank: number }) {
  return (
    <article className={`gap-card status-${topic.status}`}>
      <div className="gap-card-top">
        <div className="gap-rank">{String(rank).padStart(2, '0')}</div>
        <div className="gap-title">
          <div><span className="system-label">{topic.system}</span><span className={`status-badge ${topic.status}`}>{statusLabel[topic.status]}</span></div>
          <h3>{topic.name}</h3>
        </div>
        <div className="gap-delta"><ArrowDownRight size={16} /><strong>{topic.gap}</strong><span>pt gap</span></div>
      </div>
      <div className="coverage-comparison">
        <div className="coverage-line">
          <div><span>Exam emphasis</span><strong>{topic.examEmphasis}%</strong></div>
          <div className="progress-track"><span className="exam-progress" style={{ width: `${topic.examEmphasis}%` }} /></div>
        </div>
        <div className="coverage-line">
          <div><span>Resource coverage</span><strong>{topic.resourceCoverage}%</strong></div>
          <div className="progress-track"><span className="resource-progress" style={{ width: `${topic.resourceCoverage}%` }} /></div>
        </div>
      </div>
      <div className="evidence-row">
        <span>Detected in exam</span>
        <div>{topic.evidence.map((term) => <span className="evidence-chip" key={term}>{term}</span>)}</div>
      </div>
      <div className="recommendation"><Lightbulb size={17} /><p>{topic.action}</p></div>
    </article>
  )
}

export function AnalysisReport({ report, onReset }: AnalysisReportProps) {
  const priorityTopics = report.topicResults.filter((topic) => topic.status === 'critical' || topic.status === 'moderate')
  const coveredTopics = report.topicResults.filter((topic) => topic.status === 'covered' || topic.status === 'strong')

  return (
    <main className="report-page">
      <div className="report-container">
        <div className="report-breadcrumb">
          <button onClick={onReset}><ArrowLeft size={16} /> New analysis</button>
          <span>Analysis report</span>
        </div>

        <section className="report-hero">
          <div className="report-heading">
            <span className="section-kicker"><Sparkles size={13} /> Coverage report</span>
            <h1>Your highest-yield gaps, prioritized.</h1>
            <p>We found {report.recognizedTopics} tested topics across your materials and ranked the areas where your resources need reinforcement.</p>
            <div className="source-summary"><FileText size={15} /><strong>{report.examName}</strong><span>compared with</span><strong>{report.resourceNames.length} resource{report.resourceNames.length === 1 ? '' : 's'}</strong></div>
            {report.localTranscriberAssisted && (
              <div className="assistant-summary"><ScanText size={14} /> Local Content Transcriber assisted with extraction</div>
            )}
          </div>
          <div className="readiness-panel">
            <ScoreRing score={report.readinessScore} />
            <div><span>Resource alignment</span><strong>{report.readinessScore >= 75 ? 'Well aligned' : report.readinessScore >= 50 ? 'Good foundation' : 'Needs reinforcement'}</strong><small>Based on recognized exam topics</small></div>
          </div>
        </section>

        <section className="metric-grid" aria-label="Analysis summary">
          <div className="metric-card critical"><span><AlertTriangle size={19} /></span><div><strong>{report.criticalGaps}</strong><small>Critical gaps</small></div></div>
          <div className="metric-card moderate"><span><Gauge size={19} /></span><div><strong>{report.moderateGaps}</strong><small>Needs review</small></div></div>
          <div className="metric-card covered"><span><CheckCircle2 size={19} /></span><div><strong>{report.strongAreas}</strong><small>Covered areas</small></div></div>
          <div className="metric-card topics"><span><BookOpenCheck size={19} /></span><div><strong>{report.recognizedTopics}</strong><small>Topics mapped</small></div></div>
        </section>

        <div className="report-layout">
          <section className="priority-section" aria-labelledby="priority-title">
            <div className="content-heading">
              <div><span className="section-kicker">Priority queue</span><h2 id="priority-title">Study these first</h2></div>
              <span>{priorityTopics.length} actionable gaps</span>
            </div>
            <div className="gap-list">
              {priorityTopics.length ? priorityTopics.map((topic, index) => <TopicGapCard key={topic.id} topic={topic} rank={index + 1} />) : (
                <div className="empty-gaps"><CheckCircle2 size={30} /><h3>No major gaps detected</h3><p>Your resources track closely with the recognized exam topics.</p></div>
              )}
            </div>
          </section>

          <aside className="report-sidebar">
            <section className="sidebar-card system-card">
              <div className="sidebar-heading"><div><span className="section-kicker">System view</span><h2>Coverage map</h2></div></div>
              <div className="system-list">
                {report.systemCoverage.slice(0, 6).map((system) => (
                  <div className="system-item" key={system.name}>
                    <div><strong>{system.name}</strong><span>{system.resourceCoverage}% matched</span></div>
                    <div className="dual-track"><span style={{ width: `${system.examEmphasis}%` }} /><i style={{ width: `${system.resourceCoverage}%` }} /></div>
                  </div>
                ))}
              </div>
              <div className="legend"><span><i className="exam-key" />Exam</span><span><i className="resource-key" />Resources</span></div>
            </section>

            <section className="sidebar-card next-card">
              <div className="next-icon"><Sparkles size={21} /></div>
              <span className="section-kicker">Your next move</span>
              <h2>Close the biggest gap first.</h2>
              <p>{priorityTopics[0]?.action ?? 'Keep using retrieval practice to maintain your strongest areas.'}</p>
              <button onClick={() => document.querySelector('.gap-card')?.scrollIntoView({ behavior: 'smooth' })}>View top priority <ChevronRight size={16} /></button>
            </section>

            <section className="sidebar-card privacy-card">
              <ShieldCheck size={20} />
              <div><strong>Your analysis stayed private</strong><span>No file contents were saved or sent off-device.</span></div>
            </section>
            {report.extractionWarnings.length > 0 && (
              <section className="sidebar-card warning-card">
                <AlertTriangle size={18} />
                <div><strong>Extraction note</strong><span>{report.extractionWarnings[0]}</span></div>
              </section>
            )}
          </aside>
        </div>

        {coveredTopics.length > 0 && (
          <section className="covered-section">
            <div className="content-heading"><div><span className="section-kicker">Maintain</span><h2>Areas already covered</h2></div></div>
            <div className="covered-grid">
              {coveredTopics.map((topic) => (
                <div className="covered-topic" key={topic.id}>
                  <CheckCircle2 size={18} />
                  <div><strong>{topic.name}</strong><span>{topic.resourceCoverage}% resource coverage</span></div>
                  <ArrowRight size={15} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="report-disclaimer">
          <p>InHouseRx provides study-planning guidance based on textual coverage. It does not assess factual quality, predict scores, or represent affiliation with NBME or NBOME.</p>
          <button onClick={onReset}><RotateCcw size={15} /> Start another analysis</button>
        </section>
      </div>
    </main>
  )
}
