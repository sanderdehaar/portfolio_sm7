import { useEffect, useState } from 'react'

type TextState = {
  current: string
  phase: 'in' | 'out' | 'static' | 'hidden'
}

type StaggeredSwapProps = {
  className?: string
  text: string
  visible?: boolean
  delay?: number
}

function CharacterLine({ text, phase, delay = 0 }: { text: string; phase: 'in' | 'out'; delay?: number }) {
  const characters = Array.from(text)
  const duration = phase === 'out' ? 280 : 240
  const stagger = phase === 'out' ? 140 : 120
  const baseDelay = phase === 'in' ? delay : 0
  const words = text.split(' ')
  const offsets = words.map((_, index) => words
    .slice(0, index)
    .reduce((total, word) => total + Array.from(word).length + 1, 0))

  return (
    <span className={`swap-line swap-line-${phase}`} aria-hidden="true">
      {words.map((word, wordIndex) => (
        <span key={`${phase}-word-${wordIndex}`}>
          <span className="swap-word">
            {Array.from(word).map((character, index) => {
              const charIndex = offsets[wordIndex] + index
              const staggerIndex = phase === 'out' ? characters.length - charIndex - 1 : charIndex
              return (
                <span
                  className="swap-character"
                  key={`${phase}-${wordIndex}-${index}`}
                  style={{ animationDelay: `${baseDelay + (characters.length > 1 ? (staggerIndex / (characters.length - 1)) * stagger : 0)}ms`, animationDuration: `${duration}ms` }}
                >
                  {character}
                </span>
              )
            })}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  )
}

export function StaggeredSwap({ className = '', text, visible = true, delay = 0 }: StaggeredSwapProps) {
  const [state, setState] = useState<TextState>({ current: text, phase: visible ? 'static' : 'hidden' })

  useEffect(() => {
    setState((current) => {
      if (!visible) return { current: text, phase: 'hidden' }
      return current.phase === 'hidden' ? { current: text, phase: 'in' } : current
    })
  }, [visible, text])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setState((current) => current.phase === 'hidden'
        ? { current: text, phase: 'hidden' }
        : current.current === text
          ? current
          : { current: current.current, phase: 'out' })
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [text])

  useEffect(() => {
    if (state.phase !== 'out') return
    const timeout = window.setTimeout(() => {
      setState({ current: text, phase: 'in' })
    }, 440)

    return () => window.clearTimeout(timeout)
  }, [state.phase, text])

  useEffect(() => {
    if (state.phase !== 'in') return
    const timeout = window.setTimeout(() => {
      setState((current) => ({ ...current, phase: 'static' }))
    }, 380 + delay)

    return () => window.clearTimeout(timeout)
  }, [state.phase, delay])

  return (
    <span className={`staggered-swap ${className}`} aria-label={text}>
      {state.phase === 'static' || state.phase === 'hidden'
        ? <span className={`swap-line swap-line-${state.phase}`} aria-hidden="true">{state.current}</span>
        : <CharacterLine key={`${state.phase}-${state.current}`} text={state.current} phase={state.phase} delay={delay} />}
    </span>
  )
}