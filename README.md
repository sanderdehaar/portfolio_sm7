# Portfolio

A personal portfolio website by Sander. Built with React, TypeScript, Vite, Tailwind CSS and React Router. Project data comes from Firebase Firestore.

## Quick start

```
npm install
npm run dev
```

Other commands:

- `npm run build` checks TypeScript and builds the site into `dist`.
- `npm run lint` checks the code.
- `npm run seed:firestore` adds the starter projects to Firestore (see below).

## Pages and routing

| Route | Page |
| --- | --- |
| `/` | Home: hero, about and work sections, footer |
| `/projects` | Project list (the work section on the Home page) |
| `/projects/:slug` | Project detail page |
| anything else | Redirects to `/` |

Routes are set in `src/App.tsx`.

## Environment variables

Create a `.env` file in the project root. Do not commit it.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

You can find these values in the Firebase console under Project settings. They are public client settings, so data is protected by Firestore rules, not by hiding them.

## How project data works

- The site reads all documents from the Firestore `projects` collection (`src/data/useProjects.ts`).
- Projects are sorted by `number`. A project without a `number` is not shown.
- There is no local fallback. If Firestore is empty or not readable, no projects appear.

Each project document needs:

- `number`, `slug`, `title`, `category`, `year`, `description`
- `image` (card image) and `heroImage` (big image on the detail page)
- `heroOverlay`: `{ color, opacity }`
- `content`: a list of blocks, either `{ type: "text", text }` or `{ type: "image", src, alt, caption? }`
- `projectUrl` (optional): shows a "View project" button

Image fields accept a full URL or a path from `public`, for example `/assets/images/projects/1/image.png`.

## Firebase setup

1. Deploy the rules: `firebase deploy --only firestore:rules`. The rules allow public reads on `/projects` and block all writes.
2. Seed the starter projects: log in with `gcloud auth application-default login`, then run `npm run seed:firestore`. It only creates missing documents and never overwrites existing ones.
3. Never put a service-account key in `.env` or in Git.

## Deploying (Vercel)

1. Push the project to GitHub (optional but easiest).
2. Import the repo in Vercel. Build command: `npm run build`. Output folder: `dist`.
3. Add the `VITE_FIREBASE_*` variables in Vercel under Settings > Environment Variables.
4. Add a `vercel.json` so direct links like `/projects/my-project` work:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Folder guide

- `src/pages` has the pages (Home, Projects, Project detail).
- `src/sections` has the Home sections: About, Work and Footer.
- `src/components` has small shared parts: parallax image, hover text and staggered text.
- `src/hooks` has scroll hooks: parallax, replay and in-view.
- `src/data` has the Firebase setup, the project type and the project loader.
- `src/styles/tokens.css` has shared colors, fonts and layout values.
- `src/index.css` has the global and responsive styles.
- `public/assets/images` has local images and the logo.
- `scripts` has the Firestore seed script and the starter data.

Fonts: Anton for headings, Montserrat for body text.
