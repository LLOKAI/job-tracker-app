# Job Tracker App

End-to-end full-stack job application tracker built with React, Express, Prisma, and PostgreSQL.

The app helps track job applications through the pipeline, including status, location, tags, notes, links, search, sorting, dashboard views, and analytics for current and historical status changes.

## Tech Stack

- Frontend: React 19, Vite, React Router, React Icons, Recharts, Nivo Sankey
- Backend: Node.js, Express 5, Prisma, Zod
- Database: PostgreSQL
- Dev tooling: Nodemon, ESLint

## Project Structure

```text
job-tracker-app/
  client/              React + Vite frontend
  server/              Express API + Prisma backend
  server/prisma/       Prisma schema and migrations
  scripts/             Local helper scripts for test data
  README.md            Project setup and operating notes
```

## Features

- Add, edit, view, and delete job applications
- Track application status: `APPLIED`, `INTERVIEW`, `REJECTED`, `OFFER`
- Search jobs by company, position, or tag
- Sort jobs by date, company, position, or status
- Infinite-scroll job list
- Toggle dashboard between list and compact grid views
- View job details in a modal
- Persist UI preferences in browser `localStorage`
- Stats page with status totals, recent application activity, charts, and status transition flow
- Status transition history stored when a job moves between statuses

## Prerequisites

- Node.js and npm
- PostgreSQL running locally or remotely
- A PostgreSQL database for the app

The backend reads its database connection from `server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

## Startup

Run the backend and frontend in separate terminals.

### 1. Install dependencies

From the repo root:

```bash
npm install
cd server
npm install
cd ../client
npm install
```

The root install is only needed for the helper scripts in `scripts/`.

### 2. Configure the database

Create `server/.env` if it does not exist, then add `DATABASE_URL`.

Apply the Prisma migrations:

```bash
cd server
npx prisma migrate dev
```

If Prisma Client ever gets out of date, regenerate it:

```bash
cd server
npx prisma generate
```

### 3. Start the API

```bash
cd server
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

The client currently calls this URL directly, so keep the backend on port `3000` unless you also update the frontend fetch URLs.

### 4. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

Vite usually serves the app at:

```text
http://localhost:5173
```

Open that URL in your browser.

## API Overview

Base URL:

```text
http://localhost:3000
```

Endpoints:

- `GET /` health check
- `GET /api/jobs` list jobs with optional `q`, `status`, `sort`, `page`, and `limit` query params
- `GET /api/jobs/:id` get one job
- `POST /api/jobs` create a job
- `PUT /api/jobs/:id` update a job
- `DELETE /api/jobs/:id` delete a job
- `GET /api/jobs/transitions/all` list stored status transitions

Example job payload:

```json
{
  "company": "Acme Corp",
  "position": "Frontend Developer",
  "status": "APPLIED",
  "appliedDate": "2026-05-12",
  "location": "Remote",
  "tags": ["react", "remote"],
  "notes": "Promising role.",
  "url": "https://example.com/job"
}
```

## Useful Commands

Backend:

```bash
cd server
npm run dev
npx prisma migrate dev
npx prisma generate
```

Frontend:

```bash
cd client
npm run dev
npm run build
npm run lint
npm run preview
```

Local helper scripts:

```bash
node scripts/bulkJobs.js
node scripts/deleteJobs.js
```

`bulkJobs.js` creates sample jobs through the running API. `deleteJobs.js` deletes jobs through the running API, so use it carefully.

## Development Notes

- The frontend fetches the API with hardcoded `http://localhost:3000/api/jobs` URLs.
- Settings such as name, theme, dashboard quote, compact mode, and profile image are stored in browser `localStorage`.
- Some Settings and Tools page items are placeholders for future work.
- Status transition records are created when an existing job changes status through the `PUT /api/jobs/:id` endpoint.
- The backend validates job payloads with Zod before writing to the database.

## Troubleshooting

- If the frontend shows failed API requests, make sure the backend is running on `http://localhost:3000`.
- If the backend fails on startup, confirm `server/.env` has a valid `DATABASE_URL`.
- If Prisma cannot query the database, run `npx prisma migrate dev` from `server/`.
- If dependencies seem stale after returning to the project, run `npm install` in both `server/` and `client/`.
