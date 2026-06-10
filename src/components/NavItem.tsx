import { useState, useRef } from 'react'

interface NavItemProps {
  label: string
  href?: string
}

export default function NavItem({ label, href = '#' }: NavItemProps) {
  const [cycle, setCycle] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCycle(c => c + 1)
  }

  const isAnimating = cycle > 0
  const phase = cycle % 2

  return (
    <a
      href={href}
      className="relative overflow-hidden inline-flex items-center h-5 cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <span
        className={`
          block text-sm font-medium tracking-wide text-white/60 
          group-hover:text-white transition-colors duration-300
          ${isAnimating && phase === 1 ? 'fly-out-up' : ''}
          ${isAnimating && phase === 0 && cycle > 1 ? 'fly-in-up' : ''}
        `}
        key={cycle}
      >
        {label}
      </span>
    </a>
  )
}
