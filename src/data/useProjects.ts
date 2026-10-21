import { useEffect, useState } from 'react'
import { firebaseConfig, isFirebaseConfigured } from './firebase'
import type { Project } from './projects'

type ProjectsState = {
  projects: Project[]
  loading: boolean
  error: string | null
}

export function useProjects() {
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let active = true

    const loadProjects = async () => {
      if (!isFirebaseConfigured) {
        setState({ projects: [], loading: false, error: 'Firebase configuration is missing.' })
        return
      }

      try {
        const [{ getApp, getApps, initializeApp }, { collection, getDocs, getFirestore }] = await Promise.all([
          import('firebase/app'),
          import('firebase/firestore'),
        ])
        const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
        const firestore = getFirestore(app)
        const snapshot = await getDocs(collection(firestore, 'projects'))
        const projects = snapshot.docs
          .map((document) => ({
            ...document.data(),
            slug: document.data().slug ?? document.id,
          }) as Project)
          .filter((project) => typeof project.number === 'string' && project.number.trim() !== '')
          .sort((first, second) => first.number.localeCompare(second.number))

        if (active) setState({ projects, loading: false, error: null })
      } catch (error) {
        const code = typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : ''
        const message = code.endsWith('/permission-denied')
          ? 'Firestore denied project reads. Deploy firestore.rules and confirm the projects collection exists.'
          : error instanceof Error ? error.message : 'Could not load projects from Firestore.'
        if (active) setState({ projects: [], loading: false, error: message })
      }
    }

    void loadProjects()

    return () => {
      active = false
    }
  }, [])

  return state
}