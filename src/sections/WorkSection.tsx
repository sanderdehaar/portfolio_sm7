import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ParallaxImage } from '../components/ParallaxImage'
import { StaggeredSwap } from '../components/StaggeredSwap'
import { useProjects } from '../data/useProjects'
import type { Project } from '../data/projects'

type ProjectRecord = Project

function ProjectCard({
  project,
  index,
  active,
  revealed,
}: {
  project: ProjectRecord
  index: number
  active: boolean
  revealed: boolean
}) {
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const moveCursor = (event: PointerEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()

    setCursorPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    })
  }

  const cursorStyle = {
    '--project-cursor-x': `${cursorPosition.x}px`,
    '--project-cursor-y': `${cursorPosition.y}px`,
  } as CSSProperties

  return (
    <article
      className={`work-step${active ? ' is-active' : ''}${revealed ? ' is-revealed' : ''}`}
      aria-label={`${project.number}: ${project.title}`}
      data-project-index={index}
    >
      <Link
        to={`/projects/${project.slug}`}
        className={`project-card-link${isHovered ? ' is-hovered' : ''}`}
        aria-label={`View project: ${project.title}`}
        style={cursorStyle}
        onPointerEnter={(event) => {
          setIsHovered(
            event.pointerType !== 'touch'
              && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
          )
        }}
        onPointerLeave={() => setIsHovered(false)}
        onPointerMove={(event) => {
          if (
            event.pointerType !== 'touch'
            && window.matchMedia('(hover: hover) and (pointer: fine)').matches
          ) moveCursor(event)
        }}
      >
        <ParallaxImage
          alt={`${project.title} project image`}
          className="work-project-image"
          speed={0.025}
          src={project.image}
        />
        <span
          className="work-center-trigger"
          data-project-index={index}
          aria-hidden="true"
        />
        <span
          className="project-cursor-cta"
          aria-hidden="true"
          style={isHovered ? { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' } : undefined}
        >
          <span className="link-mark"><i /><i /></span>
          <span>View project</span>
        </span>
      </Link>
      <div className="work-mobile-copy">
        <p className="work-project-meta">
          <StaggeredSwap text={project.category} visible={revealed} delay={120} />
          <span aria-hidden="true"> · </span>
          <StaggeredSwap text={project.year} visible={revealed} delay={160} />
        </p>
        <h3><StaggeredSwap text={project.title} visible={revealed} delay={220} /></h3>
        <p className="work-description"><StaggeredSwap text={project.description} visible={revealed} delay={340} /></p>
        <Link className="mobile-project-link" to={`/projects/${project.slug}`}>
          <StaggeredSwap text="View project" visible={revealed} delay={480} />
          <span className="link-mark" aria-hidden="true"><i /><i /></span>
        </Link>
      </div>
    </article>
  )
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { projects, loading, error } = useProjects()
  const [activeIndex, setActiveIndex] = useState(0)
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(() => new Set())
  const activeProject = projects[activeIndex] ?? projects[0]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.projectIndex)
            setActiveIndex(index)
          }
        }
      },
      { rootMargin: '-49% 0px -49% 0px', threshold: 0 },
    )
    const isMobile = window.matchMedia('(max-width: 760px)').matches
    const updateRevealed = (entries: IntersectionObserverEntry[], mode: 'add' | 'remove' | 'both') => {
      setRevealedIndices((current) => {
        const next = new Set(current)
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.projectIndex)
          if (entry.isIntersecting && mode !== 'remove') next.add(index)
          else if (!entry.isIntersecting && mode !== 'add') next.delete(index)
        }
        return next
      })
    }
    const revealObserver = new IntersectionObserver(
      (entries) => updateRevealed(entries, isMobile ? 'add' : 'both'),
      isMobile
        ? { rootMargin: '0px 0px -30% 0px', threshold: 0.35 }
        : { threshold: 0.12 },
    )
    // On mobile, hide a step once it is almost out of view so it can replay.
    const hideObserver = isMobile
      ? new IntersectionObserver(
        (entries) => updateRevealed(
          entries.filter((entry) => !entry.isIntersecting || entry.intersectionRatio <= 0.08)
            .map((entry) => ({ target: entry.target, isIntersecting: false }) as IntersectionObserverEntry),
          'remove',
        ),
        { threshold: [0, 0.04, 0.08, 0.12] },
      )
      : null

    section.querySelectorAll('.work-center-trigger').forEach((trigger) => activeObserver.observe(trigger))
    section.querySelectorAll('.work-step').forEach((step) => {
      revealObserver.observe(step)
      hideObserver?.observe(step)
    })
    return () => {
      activeObserver.disconnect()
      revealObserver.disconnect()
      hideObserver?.disconnect()
    }
  }, [projects])

  if (!activeProject) {
    return (
      <section id="work" className="work-section" aria-label="Selected work" aria-live="polite">
        <p className="work-data-status">
          {loading ? 'Loading selected work…' : error ?? 'No projects have been added yet.'}
        </p>
      </section>
    )
  }

  return (
    <section id="work" ref={sectionRef} className="work-section" aria-label="Selected work">
      <div className="work-stage">
        <aside className="work-panel work-panel-left" aria-live="polite" aria-atomic="true">
          <div className="work-panel-copy">
            <p className="work-project-meta">
              <StaggeredSwap text={activeProject.category} />
              <span aria-hidden="true"> · </span>
              <StaggeredSwap text={activeProject.year} />
            </p>
            <h3><StaggeredSwap text={activeProject.title} /></h3>
          </div>
        </aside>

        <div className="work-track">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={index}
              active={activeIndex === index}
              revealed={revealedIndices.has(index)}
            />
          ))}
        </div>

        <aside className="work-panel work-panel-right" aria-live="polite" aria-atomic="true">
          <div className="work-panel-copy">
            <p className="work-description"><StaggeredSwap text={activeProject.description} /></p>
          </div>
          <p className="work-counter" aria-label={`Project ${activeIndex + 1} of ${projects.length}`}>
            <span className="link-mark" aria-hidden="true"><i /><i /></span>
            <StaggeredSwap text={`${activeIndex + 1}/${projects.length}`} />
          </p>
        </aside>
      </div>
    </section>
  )
}