import { ExternalLink, ScanText, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getLocalTranscriberCapabilities, type LocalTranscriberCapabilities } from '../services/localTranscriberClient'

type CompanionState =
  | { status: 'checking' }
  | { status: 'offline' }
  | { status: 'ready'; capabilities: LocalTranscriberCapabilities }

export function CompanionStatus() {
  const [state, setState] = useState<CompanionState>({ status: 'checking' })

  useEffect(() => {
    let active = true
    getLocalTranscriberCapabilities()
      .then((capabilities) => {
        if (active) setState({ status: 'ready', capabilities })
      })
      .catch(() => {
        if (active) setState({ status: 'offline' })
      })
    return () => { active = false }
  }, [])

  if (state.status === 'checking') {
    return <span className="companion-status checking"><span className="status-pulse" /> Checking local tools…</span>
  }

  if (state.status === 'offline') {
    return (
      <a
        className="companion-status offline"
        href="https://github.com/AKaturu/local-content-transcriber"
        target="_blank"
        rel="noreferrer"
        title="Set up optional local OCR and media transcription"
      >
        <WifiOff size={14} /> Browser-only mode <ExternalLink size={11} />
      </a>
    )
  }

  const { ocrReady, speechReady } = state.capabilities
  const label = ocrReady && speechReady ? 'OCR + media ready' : ocrReady ? 'Local OCR ready' : speechReady ? 'Local media ready' : 'Companion connected'
  return <span className="companion-status ready" title={state.capabilities.detail}><ScanText size={14} /> {label}</span>
}
