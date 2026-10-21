import type { CSSProperties } from 'react'
import { useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { SiteFooter } from '../sections/SiteFooter'
import { useProjects } from '../data/useProjects'
import { useReplayOnScroll } from '../hooks/useReplayOnScroll'
import { useInView } from '../hooks/useInView'
import { ParallaxImage } from '../components/ParallaxImage'
import { StaggeredSwap } from '../components/StaggeredSwap'
import type { Project, ProjectContentBlock } from '../data/projects'

function ProjectHeroTitle({ title }: { title: string }) {
  const lockupRef = useRef<HTMLDivElement>(null)
  const inView = useInView(lockupRef, 0.5, 0.05)
  const longestWord = Math.max(4, ...title.split(/\s+/).map((word) => Array.from(word).length))
  const style = { '--title-fit': `calc(min(90vw, 1200px) / ${longestWord * 0.55})` } as CSSProperties

  return (
    <div ref={lockupRef} className="project-hero-lockup">
      <h1 id="project-title" className="project-hero-title" style={style}>
        <StaggeredSwap text={title} visible={inView} />
      </h1>
    </div>
  )
}

function ProjectStory({ project, paragraphs }: { project: Project; paragraphs: string[] }) {
  const detailsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(detailsRef, 0.15, 0.01)
  const isExternal = /^https?:\/\//i.test(project.projectUrl ?? '')

  return (
    <div ref={detailsRef} className={`project-story-details${inView ? ' is-in-view' : ''}`}>
      <div className="project-story-copy">
        {paragraphs.map((text, index) => (
          <p className="project-copy" key={`${project.slug}-text-${index}`}>{text}</p>
        ))}
      </div>
      {project.projectUrl?.trim() && (
        <a
          className="project-detail-cta"
          href={project.projectUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        >
          <span className="link-mark" aria-hidden="true"><i /><i /></span>
          <span>View project</span>
        </a>
      )}
    </div>
  )
}

function ProjectImageSlider({ images, title }: { images: Extract<ProjectContentBlock, { type: 'image' }>[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const figureRef = useRef<HTMLElement>(null)
  const inView = useInView(figureRef, 0.3, 0.02)
  const [hasRevealed, setHasRevealed] = useState(false)
  if (inView && !hasRevealed) setHasRevealed(true)
  const image = images[activeIndex]

  const showPrevious = () => setActiveIndex((current) => (current - 1 + images.length) % images.length)
  const showNext = () => setActiveIndex((current) => (current + 1) % images.length)

  return (
    <figure ref={figureRef} id="project-gallery" className={`project-image-carousel${images.length > 1 ? ' has-multiple-images' : ''}${hasRevealed ? ' is-in-view' : ''}`}>
      <ParallaxImage
        key={`${image.src}-${activeIndex}`}
        alt={image.alt}
        className="project-parallax-image"
        speed={activeIndex % 2 === 0 ? 0.08 : -0.07}
        maxOffset={90}
        src={image.src}
      />
      {images.length > 1 && (
        <div className="project-carousel-controls" aria-label={`${title} images`}>
          <div className="project-carousel-count" aria-live="polite">
            {activeIndex + 1} of {images.length} images
          </div>
          <div className="project-carousel-arrows">
            <button type="button" className="project-carousel-arrow" aria-label="Previous image" onClick={showPrevious}>
              <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.8} />
            </button>
            <button type="button" className="project-carousel-arrow" aria-label="Next image" onClick={showNext}>
              <ArrowRight aria-hidden="true" size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </figure>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams()
  const { projects, loading, error } = useProjects()
  const projectIndex = projects.findIndex((project) => project.slug === slug)
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  useReplayOnScroll(heroRef)

  if (loading) return null
  if (error) return <p className="project-data-status" role="alert">{error}</p>
  if (projectIndex < 0) return <Navigate to="/" replace />

  const project = projects[projectIndex]
  const storyBlocks = project.content ?? []
  const storyImages = storyBlocks.filter((block): block is Extract<ProjectContentBlock, { type: 'image' }> => block.type === 'image')
  const images = storyImages.length > 0
    ? storyImages
    : [{ type: 'image' as const, src: project.image, alt: `${project.title} project imagery` }]
  const storyText = storyBlocks.filter((block): block is Extract<ProjectContentBlock, { type: 'text' }> => block.type === 'text')
  const heroStyle = {
    '--project-overlay-color': project.heroOverlay?.color ?? '#17452f',
    '--project-overlay-opacity': project.heroOverlay?.opacity ?? 0.78,
  } as CSSProperties

  return (
    <>
      <article key={project.slug} className="project-detail" style={heroStyle}>
        <section ref={heroRef} className="project-hero replay-section" aria-labelledby="project-title">
          <img className="project-hero-image" src={project.heroImage} alt="" />
          <div className="project-hero-overlay" aria-hidden="true" />
          <div className="project-hero-grid" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
          </div>
          <ProjectHeroTitle title={project.title} />
          <a className="project-scroll-cue" href="#project-story" aria-label="Scroll down to project details">
            <span />
          </a>
        </section>

        <div id="project-story" ref={contentRef} className="project-content">
          <ProjectImageSlider images={images} title={project.title} />
          <ProjectStory
            project={project}
            paragraphs={storyText.length > 0
              ? storyText.map((block) => block.text)
              : [`A closer look at the design, details and direction behind ${project.title}.`]}
          />
        </div>

      </article>
      <SiteFooter />
    </>
  )
}