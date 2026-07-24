const common = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }

export function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5.5 12a10 10 0 0 1 13 0" />
      <path d="M9 15.5a5 5 0 0 1 6 0" />
      <circle cx="12" cy="19" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
      <path d="M3 18v2M21 18v2" />
      <path d="M3 12V7a1 1 0 0 1 1-1h7v4" />
      <circle cx="7.5" cy="8.5" r="1.2" />
    </svg>
  )
}

export function ParkingIcon() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M9.5 16V8h3.2a2.6 2.6 0 0 1 0 5.2H9.5" />
    </svg>
  )
}

export function SurfboardIcon() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M12 2c3 4 5 10 5 14a5 5 0 0 1-10 0c0-4 2-10 5-14Z" />
      <path d="M12 6v14" />
    </svg>
  )
}

export function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  )
}

export function ShuttleIcon() {
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M3 15.5V11l2-4.5h10L17 11v4.5" />
      <path d="M3 15.5h14M3 12h14" />
      <circle cx="6.5" cy="17.5" r="1.4" />
      <circle cx="15" cy="17.5" r="1.4" />
    </svg>
  )
}
