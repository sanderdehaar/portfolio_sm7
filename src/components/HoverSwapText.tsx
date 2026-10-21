import { useState } from 'react'

type HoverSwapTextProps = {
  className?: string
  stagger?: boolean
  text: string
}

function TextLine({ text, stagger }: { text: string; stagger: boolean }) {
  if (!stagger) return <>{text}</>

  return <>{Array.from(text).map((character, index) => (
    <span
      className="hover-swap-character"
      key={`${character}-${index}`}
      style={{ transitionDelay: `${index * 22}ms` }}
    >
      {character === ' ' ? '\u00a0' : character}
    </span>
  ))}</>
}

export function HoverSwapText({ className = '', stagger = false, text }: HoverSwapTextProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <span
      className={`hover-swap-text${stagger ? ' is-staggered' : ''}${isHovered ? ' is-hovered' : ''} ${className}`}
      aria-hidden="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <span className="hover-swap-current"><TextLine text={text} stagger={stagger} /></span>
      <span className="hover-swap-next"><TextLine text={text} stagger={stagger} /></span>
    </span>
  )
}