import { useEffect, type RefObject } from 'react'

export function useReplayOnScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => element.classList.toggle('is-in-view', entry.isIntersecting),
      { threshold: 0.01 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
}