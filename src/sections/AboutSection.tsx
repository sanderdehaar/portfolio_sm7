import { ParallaxImage } from '../components/ParallaxImage'
import { useScrollParallax } from '../hooks/useScrollParallax'
import { useRef } from 'react'
import { useInView } from '../hooks/useInView'

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const hasEntered = useInView(sectionRef, 0.5, 0.35)
  const topFrameRef = useScrollParallax<HTMLDivElement>(0.24, 72, 0.07, 22)
  const bottomFrameRef = useScrollParallax<HTMLDivElement>(-0.24, 72, -0.07, 22)

  return (
    <section ref={sectionRef} id="about" className={`about-section${hasEntered ? ' has-entered' : ''}`} aria-labelledby="about-title">
      <div ref={topFrameRef} className="about-image about-image-top">
        <ParallaxImage alt="Sander" speed={0.08} maxOffset={20} src="/assets/images/sander.png" />
      </div>
      <div ref={bottomFrameRef} className="about-image about-image-bottom">
        <ParallaxImage alt="Motorcycle" speed={0.08} maxOffset={20} src="/assets/images/motorcycle.png" />
      </div>
      <h2 id="about-title" className="about-statement">
        <span>I’m driven by <em>progress</em> and the desire</span>
        <span>to <em>improve.</em> I challenge myself to</span>
        <span><em>think differently,</em> push beyond the</span>
        <span>obvious, and turn ideas into</span>
        <span>meaningful designs. There’s always</span>
        <span>another level to reach.</span>
      </h2>
    </section>
  )
}