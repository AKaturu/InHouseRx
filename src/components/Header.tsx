import { LockKeyhole, ShieldCheck } from 'lucide-react'

interface HeaderProps {
  onReset?: () => void
}

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={onReset} aria-label="InHouseRx home">
          <span className="brand-mark" aria-hidden="true">Rx</span>
          <span className="brand-name">InHouseRx</span>
        </button>
        <div className="header-status" aria-label="Privacy status">
          <ShieldCheck size={16} aria-hidden="true" />
          <span className="status-full">Private, on-device analysis</span>
          <span className="status-short">On-device</span>
          <LockKeyhole size={13} aria-hidden="true" />
        </div>
      </div>
    </header>
  )
}
