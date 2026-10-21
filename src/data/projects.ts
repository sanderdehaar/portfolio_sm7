export type ProjectContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

export type Project = {
  number: string
  slug: string
  title: string
  category: string
  year: string
  description: string
  image: string
  heroImage: string
  projectUrl?: string
  heroOverlay?: {
    color: string
    opacity: number
  }
  content?: ProjectContentBlock[]
}

