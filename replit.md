# TRUE CONCEPT Learning Portal

## Overview

A full-stack learning management portal for TRUE CONCEPT private tuition institute, serving Class IX and X students under SEBA/CBSE boards.

pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- **Frontend**: React + Vite + Tailwind CSS v4 + shadcn/ui
- **Auth**: JWT (jsonwebtoken), stored in localStorage as `trueconcept_token`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

### Artifacts
- `artifacts/api-server` — Express 5 REST API server on port 8080, prefix `/api`
- `artifacts/true-concept` — React + Vite SPA frontend (student & admin UI)
- `artifacts/mockup-sandbox` — Component preview server for design work

### Database (lib/db)
Tables: `users`, `subjects`, `chapters`, `notes`, `mcqs`, `qa` (questions & answers), `videos`, `experiments`, `progress`

### API Client (lib/api-client-react)
Auto-generated React Query hooks from OpenAPI spec. Auth token injected via `setAuthTokenGetter()`.

## Demo Credentials
- Student: `student1` / `student123`
- Admin: `admin` / `admin123`

## Features
- **Subject/Chapter Organization** — Mathematics, Science, Advanced Math for Class IX & X
- **Text Notes** — Markdown-rendered study notes per chapter
- **MCQ Quizzes** — Interactive quiz with scoring, explanations, and result tracking
- **Q&A Accordion** — Important exam questions with detailed answers
- **YouTube Videos** — Embedded video lessons per chapter
- **Virtual Science Lab** — 5 interactive canvas simulations:
  - Light Reflection (angle slider)
  - Light Refraction through glass slab (Snell's law)
  - Electric Circuit (toggle switch, Ohm's law)
  - Convex Lens (object distance slider, lens formula)
  - Bar Magnet field lines
- **Student Progress Tracking** — Dashboard with chapter visits, MCQ scores, subject progress
- **Admin CMS** — CRUD for subjects, chapters, experiments
- **Role-based Auth** — `admin` and `student` roles with route protection

## Design System
- Primary: Deep blue `hsl(222,47%,25%)`
- Accent: Gold `hsl(45,93%,47%)`
- Font: Inter (sans-serif) + Playfair Display (serif headings)
- Mobile-first with bottom navigation bar for students

## Auth Flow
1. `POST /api/auth/login` returns `{ token, user }` 
2. Token stored in `localStorage["trueconcept_token"]`
3. `setAuthTokenGetter()` injects token into all API calls
4. Protected routes redirect unauthenticated users to `/login`
5. Admin routes redirect students to `/dashboard`

## Color Theme
Deep blue primary + gold accent — consistent with the institute's branding.
