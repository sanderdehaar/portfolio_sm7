import { useEffect, useState, type RefObject } from 'react'

// Turns true once `enterRatio` of the element is visible and back to false
// once less than `exitRatio` is left, so reveal animations replay on return.
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enterRatio = 0.3,
  exitRatio = 0.05,
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= enterRatio) setInView(true)
        else if (!entry.isIntersecting || entry.intersectionRatio <= exitRatio) setInView(false)
      },
      { threshold: Array.from({ length: 21 }, (_, step) => step / 20) },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, enterRatio, exitRatio])

  return inView
}
