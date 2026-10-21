# Portfolio

React, TypeScript, Vite, Tailwind CSS, and React Router portfolio.

## Commands

- `npm install` installs dependencies.
- `npm run dev` starts the local development server.
- `npm run build` checks TypeScript and builds for production.
- `npm run lint` checks the project with Oxlint.
- `npm run seed:firestore` adds missing project documents from `scripts/project-seed-data.mjs` to Firestore. It does not overwrite existing documents.

## Structure

- `src/pages` contains route-level pages and composes the Home page flow.
- `src/pages/ProjectDetailPage.tsx` renders project details from the project data.
- `src/sections` contains reusable Home, About, Work, and Footer sections.
- `src/components` contains the parallax image, hover text and staggered text primitives.
- `src/hooks/useScrollParallax.ts` provides bounded scroll-driven image movement.
- `src/data/useProjects.ts` loads all project records from the Firestore `projects` collection and reports loading, empty, or permission errors.
- `scripts/project-seed-data.mjs` contains one-time starter records for the Firestore Admin seeder; the website does not load project data from this file.
- `src/styles/tokens.css` defines shared colors, typography, grid, and layout tokens for Tailwind.
- `src/index.css` contains global, responsive section, menu, and motion styles.
- `public/assets/images` contains the local hero background and logo.

Display text uses Anton; supporting text uses Montserrat. Routes are `/`, `/projects` (Home work anchor), and `/projects/:slug` for data-driven details.

## Firebase projects

1. The Firebase web configuration is in the ignored `.env` file. Keep `.env` private and out of version control.
2. Deploy `firestore.rules`. This allows public reads only from `/projects/{projectId}` and denies all writes and all other reads.
3. Each project document must include `number`, `slug`, `title`, `category`, `year`, `description`, `image`, `heroImage`, `heroOverlay` (`color`, `opacity`) and `content` (an ordered array of `{ type: "text", text }` or `{ type: "image", src, alt, caption? }`). Add an optional `projectUrl` string containing the live project URL to show the “View project” button on its detail page.

Deploy the rules with `firebase deploy --only firestore:rules` after authenticating the Firebase CLI. Firestore creates the `projects` collection automatically when the first document is written.

To seed the initial five projects, authenticate Google Application Default Credentials for the Firebase project (for example, with `gcloud auth application-default login`) and run `npm run seed:firestore`. In PowerShell, set `$env:GCLOUD_PROJECT = "portfolio-sm7"` first if needed. The seeder uses the Admin SDK and only creates documents that do not already exist. Do not put a service-account key in `.env` or commit it.

Image fields accept either a hosted image URL or a path from `public`, for example `/assets/images/bolzano/hero.jpg`. Keep local assets in `public/assets/images` and store their public paths in Firestore. The Firebase web configuration is public client configuration; data access must be protected by Firestore rules.

The detail page uses the large hero image and ordered content blocks. It intentionally does not render a second title/description summary or a separate banner image. The app has no local project-data fallback; the collection must be seeded and readable for project cards and detail routes to appear.