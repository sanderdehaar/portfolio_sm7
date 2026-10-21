import { useEffect, useRef } from 'react'

export function useScrollParallax<T extends HTMLElement>(
  speed: number,
  maxOffset = 70,
  mobileSpeed = speed,
  mobileMaxOffset = maxOffset,
) {
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let documentTop = 0
    const measure = () => {
      const currentOffset = Number.parseFloat(
        element.style.getPropertyValue('--parallax-offset'),
      ) || 0
      documentTop = element.getBoundingClientRect().top + window.scrollY - currentOffset
    }

    const update = () => {
      const height = element.getBoundingClientRect().height
      const isMobile = window.matchMedia('(max-width: 760px)').matches
      const activeSpeed = isMobile ? mobileSpeed : speed
      const activeMaxOffset = isMobile ? mobileMaxOffset : maxOffset
      const distanceFromCenter = window.innerHeight / 2 - (documentTop - window.scrollY + height / 2)
      const offset = Math.max(-activeMaxOffset, Math.min(activeMaxOffset, distanceFromCenter * activeSpeed))
      element.style.setProperty('--parallax-offset', `${offset}px`)
    }

    measure()
    update()
    window.addEventListener('scroll', update, { passive: true })
    const handleResize = () => {
      measure()
      update()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', handleResize)
    }
  }, [maxOffset, speed, mobileMaxOffset, mobileSpeed])

  return elementRef
}