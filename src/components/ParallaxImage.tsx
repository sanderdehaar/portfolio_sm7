import type { ReactNode } from 'react'
import type { CSSProperties } from 'react'
import { useScrollParallax } from '../hooks/useScrollParallax'

type ParallaxImageProps = {
  alt: string
  className?: string
  children?: ReactNode
  maxOffset?: number
  style?: CSSProperties
  speed: number
  src?: string
}

export function ParallaxImage({
  alt,
  className = '',
  children,
  maxOffset = 70,
  style,
  speed,
  src = '/assets/images/background_image.png',
}: ParallaxImageProps) {
  const imageRef = useScrollParallax<HTMLDivElement>(speed, maxOffset)

  return (
    <div ref={imageRef} className={`parallax-image ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(event) => {
          const image = event.currentTarget
          if (!image.src.endsWith('/assets/images/background_image.png')) {
            image.src = '/assets/images/background_image.png'
          }
        }}
      />
      {children}
    </div>
  )
}