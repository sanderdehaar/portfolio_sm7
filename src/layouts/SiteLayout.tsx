import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { HoverSwapText } from '../components/HoverSwapText'

export function SiteLayout() {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoOnLight, setLogoOnLight] = useState(false)

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const resetInitialScroll = () => {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash)
        target?.scrollIntoView({ block: 'start', behavior: 'instant' })
        return
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    resetInitialScroll()
    const frame = window.requestAnimationFrame(resetInitialScroll)

    return () => {
      window.cancelAnimationFrame(frame)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.1,
      wheelMultiplier: 1.12,
    })
    lenisRef.current = lenis

    return () => {
      lenisRef.current = null
      lenis.destroy()
    }
  }, [])

  useLayoutEffect(() => {
    if (!location.pathname.startsWith('/projects/')) return

    const resetScroll = () => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    resetScroll()
    const frame = window.requestAnimationFrame(resetScroll)
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  useEffect(() => {
    const updateLogoContrast = () => {
      const logo = document.querySelector('.site-logo')
      if (!logo) return

      const logoBounds = logo.getBoundingClientRect()
      const logoCenterY = logoBounds.top + logoBounds.height / 2
      const overLightSection = Array.from(
        document.querySelectorAll<HTMLElement>('.about-section, .project-content, .site-footer'),
      ).some((section) => {
        const bounds = section.getBoundingClientRect()
        return bounds.top <= logoCenterY && bounds.bottom > logoCenterY
      })

      setLogoOnLight(overLightSection)
    }

    updateLogoContrast()
    window.addEventListener('scroll', updateLogoContrast, { passive: true })
    window.addEventListener('resize', updateLogoContrast)

    return () => {
      window.removeEventListener('scroll', updateLogoContrast)
      window.removeEventListener('resize', updateLogoContrast)
    }
  }, [location.pathname])

  return (
    <div className={`site-shell min-h-screen bg-black text-white${menuOpen ? ' menu-visible' : ''}`}>
        <header className="site-header">
          <Link
            to="/"
            aria-label="Sander, home"
            className={`site-logo${logoOnLight || menuOpen ? ' is-dark' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <img src="/assets/images/logo.svg" alt="" />
          </Link>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </header>

        <nav id="site-menu" className={`menu-overlay${menuOpen ? ' is-open' : ''}`} aria-label="Hoofdnavigatie" inert={!menuOpen}>
          <div className="menu-grid" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
          </div>
          <div className="menu-links">
            <a href="/#hero-home" aria-label="Home" onClick={() => setMenuOpen(false)}><HoverSwapText text="Home" /></a>
            <a href="/#work" aria-label="My work" onClick={() => setMenuOpen(false)}><HoverSwapText text="My work" /></a>
            <a href="/#contact" aria-label="Contact" onClick={() => setMenuOpen(false)}><HoverSwapText text="Contact" /></a>
          </div>
          <div className="menu-socials">
            <a href="https://www.instagram.com/">Instagram</a>
            <a href="https://www.linkedin.com/">LinkedIn</a>
            <a href="mailto:sanderdehaart@live.nl">sanderdehaart@live.nl</a>
          </div>
        </nav>

        <main className="site-main">
          <Outlet />
        </main>
    </div>
  )
}
