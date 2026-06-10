import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: string
  baseRotation?: number
  baseOpacity?: number
  blurStrength?: string
  className?: string
  triggerStart?: string
  triggerEnd?: string
}

export default function ScrollReveal({
  children,
  baseRotation = 10,
  baseOpacity = 0,
  blurStrength = '12px',
  className = '',
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const words = children.split(' ')

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordEls = containerRef.current?.querySelectorAll('.word-unit')
      if (!wordEls) return

      gsap.set(wordEls, {
        rotationX: baseRotation,
        opacity: baseOpacity,
        filter: `blur(${blurStrength})`,
        transformPerspective: 800,
      })

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: triggerStart,
        end: triggerEnd,
        onEnter: () => {
          gsap.to(wordEls, {
            rotationX: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out',
            overwrite: true,
          })
        },
        onLeaveBack: () => {
          gsap.to(wordEls, {
            rotationX: baseRotation,
            opacity: baseOpacity,
            filter: `blur(${blurStrength})`,
            duration: 0.4,
            stagger: 0.03,
            ease: 'power2.in',
            overwrite: true,
          })
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [children, baseRotation, baseOpacity, blurStrength, triggerStart, triggerEnd])

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`} style={{ perspective: '800px' }}>
      {words.map((word, i) => (
        <span
          key={i}
          className="word-unit inline-block mr-[0.25em]"
          style={{ display: 'inline-block' }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}
