import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { projects } from './project-seed-data.mjs'

const projectId = process.env.GCLOUD_PROJECT || 'portfolio-sm7'
const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
const hasAdcFile = [
  credentialPath,
  join(homedir(), 'AppData', 'Roaming', 'gcloud', 'application_default_credentials.json'),
  join(homedir(), '.config', 'gcloud', 'application_default_credentials.json'),
].some((path) => path && existsSync(path))

if (!hasAdcFile) {
  console.error('Google credentials are missing. Run `gcloud auth application-default login`, then retry `npm run seed:firestore`.')
  process.exit(1)
}

async function seedProjects() {
  const app = initializeApp({
    credential: applicationDefault(),
    projectId,
  })
  const firestore = getFirestore(app)
  let created = 0
  let skipped = 0

  for (const project of projects) {
    const document = firestore.collection('projects').doc(project.slug)
    const wasCreated = await firestore.runTransaction(async (transaction) => {
      const existing = await transaction.get(document)
      if (existing.exists) return false
      transaction.create(document, project)
      return true
    })

    if (wasCreated) created += 1
    else skipped += 1
  }

  console.log(`Firestore seed complete: ${created} created, ${skipped} already existed.`)
  await app.delete()
}

try {
  await seedProjects()
} catch (error) {
  console.error('Firestore seeding failed:', error)
  process.exitCode = 1
}