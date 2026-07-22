import { ArrowDown, CheckCircle2, Sparkles } from 'lucide-react'

interface HeroProps {
  onExplore: () => void
}

export function Hero({ onExplore }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> Built for the way your school tests</div>
          <h1>Find what your study resources <em>missed.</em></h1>
          <p>
            Compare your in-house exam blueprint with the resources you trust. InHouseRx turns the difference into a focused, explainable study plan.
          </p>
          <button className="hero-link" onClick={onExplore}>
            Start a private analysis <ArrowDown size={16} />
          </button>
        </div>
        <aside className="hero-proof" aria-label="How InHouseRx helps">
          <div className="proof-topline">
            <span className="pulse-dot" /> Coverage intelligence
          </div>
          <div className="proof-score-row">
            <div>
              <span className="proof-label">Your resource match</span>
              <strong>68%</strong>
            </div>
            <div className="mini-ring" aria-hidden="true"><span>68</span></div>
          </div>
          <div className="proof-divider" />
          <ul>
            <li><CheckCircle2 size={16} /> Surfaces overlooked topics</li>
            <li><CheckCircle2 size={16} /> Shows the evidence behind each gap</li>
            <li><CheckCircle2 size={16} /> Keeps source files on your device</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
