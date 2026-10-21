import { useScrollParallax } from '../hooks/useScrollParallax'
import { HoverSwapText } from '../components/HoverSwapText'
import { AboutSection } from '../sections/AboutSection'
import { SiteFooter } from '../sections/SiteFooter'
import { WorkSection } from '../sections/WorkSection'
import { useReplayOnScroll } from '../hooks/useReplayOnScroll'
import { useInView } from '../hooks/useInView'
import { StaggeredSwap } from '../components/StaggeredSwap'

export function HomePage() {
  const heroSectionRef = useScrollParallax<HTMLElement>(0.17, 90)
  useReplayOnScroll(heroSectionRef)
  const heroInView = useInView(heroSectionRef, 0.7, 0.03)

  return (
    <>
      <section
        ref={heroSectionRef}
        id="hero-home"
        className="hero-home replay-section"
        aria-labelledby="hero-title"
      >
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
        </div>

        <h1 id="hero-title" className="hero-title">
          <span><StaggeredSwap text="Design" visible={heroInView} /></span>
          <span><StaggeredSwap text="Driven" visible={heroInView} delay={120} /></span>
        </h1>

        <div className="scroll-cue" aria-label="Scroll naar beneden">
          <span />
        </div>

        <aside className="hero-facts" aria-label="Over Sander">
          <p className="hero-quote">A better solution starts with a different perspective.</p>
          <p><strong>Media &amp; Design</strong><br />Fontys ICT Eindhoven</p>
          <p><strong>Limburg</strong><br />The Netherlands</p>
          <p><strong>22</strong><br />Years old</p>
        </aside>

        <div className="hero-intro">
          <h2>Sander</h2>
          <p>A person who turns creative ideas into unique,<br className="desktop-break" /> interactive digital experiences.</p>
        </div>

        <a href="#work" className="hero-project-link">
          <span className="link-mark hero-link-mark" aria-hidden="true"><i /><i /></span>
          <HoverSwapText className="hero-link-label" text="View creations" />
        </a>
      </section>
      <AboutSection />
      <WorkSection />
      <SiteFooter />
    </>
  )
}
