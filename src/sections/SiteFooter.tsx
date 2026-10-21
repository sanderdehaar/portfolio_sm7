import { useEffect, useRef } from 'react'

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    const wordmark = wordmarkRef.current
    if (!footer || !wordmark) return

    const fitWordmark = () => {
      const left = Number.parseFloat(getComputedStyle(wordmark).left) || 0
      const naturalWidth = wordmark.offsetWidth
      const targetWidth = footer.clientWidth - left + 8
      const scale = Math.max(0.75, targetWidth / naturalWidth)
      wordmark.style.setProperty('--footer-wordmark-scale-x', String(scale))
    }

    fitWordmark()
    window.addEventListener('resize', fitWordmark)
    void document.fonts.ready.then(fitWordmark)
    const resizeObserver = new ResizeObserver(fitWordmark)
    resizeObserver.observe(footer)
    resizeObserver.observe(wordmark)

    return () => {
      window.removeEventListener('resize', fitWordmark)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <footer ref={footerRef} id="contact" className="site-footer">
      <div className="footer-grid" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
      </div>
      <div className="footer-top">
        <a className="footer-contact" href="mailto:sanderdehaart@live.nl" aria-label="Let’s work together, email Sander">
          <span>Let’s work</span>
          <span>Together <img src="/assets/images/arrow_icon.svg" alt="" /></span>
        </a>
        <div className="footer-side">
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="/#hero-home">Home</a>
            <a href="/#work">My work</a>
            <a href="/#contact">Contact</a>
          </nav>
          <div className="footer-details">
            <a className="footer-email footer-cv" href="/assets/cv.pdf" target="_blank" rel="noreferrer">My CV</a>
            <a className="footer-email" href="mailto:sanderdehaart@live.nl">sanderdehaart@live.nl</a>
            <p className="footer-copyright">©2026</p>
          </div>
        </div>
      </div>
      <p ref={wordmarkRef} className="footer-wordmark" aria-hidden="true">Sander</p>
    </footer>
  )
}