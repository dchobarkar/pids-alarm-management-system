# PIDS Alarm Management System

Alarm dispatch and field investigation management platform for Pipeline Intrusion Detection Systems (PIDS).

This system enables operators to log intrusion alarms, route incidents based on pipeline chainage, assign field responders, capture geo-validated investigation reports, and track alarm closure lifecycle.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16.1 (App Router, server components, server actions)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Prisma)
- **ORM:** Prisma with `@prisma/adapter-pg`
- **Auth:** Auth.js / NextAuth v5 (credentials provider, JWT sessions)
- **UI:** Tailwind v4, custom design tokens, Lucide Icons
- **Storage:** Local filesystem for alarm evidence (future: Azure Blob Storage)
- **Hosting (target):** Azure App Service + Azure Database for PostgreSQL

---

## 🧠 Core Features

- Alarm creation from PIDS readings
- Chainage-based alarm routing
- Territory visibility for supervisors & RMP
- Self & supervisor assignment
- Field investigation reporting
- Geo-location capture during remarks
- Photo evidence uploads
- Alarm lifecycle tracking
- Role-based access control (RBAC)
- Audit logging

---

## 👥 User Roles

- **Operator (Admin)** — Creates & closes alarms, manages users
- **Supervisor** — Assigns & monitors alarms
- **Night Supervisor** — Extended chainage coverage
- **RMP** — Field investigation & reporting
- **ER** — Emergency response (RMP equivalent)
- **QRV Supervisor** — Oversight monitoring

---

## 🔄 Alarm Lifecycle

1. Alarm created by Operator
2. Routed via chainage mapping
3. Assigned to RMP
4. Field investigation performed
5. Geo + photo evidence submitted
6. Operator reviews & closes

---

## 📂 Project Structure (App Router)

```structure
app/
  (auth)/           → Legacy auth group (replaced by /auth routes)
  (dashboard)/      → Role dashboards (operator, supervisor, rmp, qrv)
  api/              → Route handlers (NextAuth, register, cron)
  auth/             → Sign in, register, error, redirect pages
  loading.tsx       → Global app loading UI
  (dashboard)/loading.tsx → Dashboard skeleton while data loads

components/
  ui/               → Design system primitives (Button, Card, Table, Badge, Modal…)
  layout/           → App shell (navbar, sidebar, dashboard shell)
  alarms/           → Alarm-specific UI (scoped tables, assign modal)
  formComponents/   → Forms + their server actions (create alarm, chainage, mapping, profile, verify)
  dashboard/alarms/ → Role-aware alarms UX (operator/supervisor/RMP/QRV)

lib/
  auth/             → NextAuth config, session helpers, role guard, dashboard paths
  alarm/            → Alarm repository + scoped alarm loader
  assignment/       → Assignment repository (create/accept/reassign)
  verification/     → Verification repository + review queries
  evidence/         → Evidence upload & validation
  scope/            → Alarm scoping by role/chainage
  sla/              → SLA configuration + breach engine
  geo/              → Geo helpers (distance, browser location)
  validation/       → Zod schemas
  db.ts             → Prisma client

types/              → Shared domain & UI types (alarm, assignment, verification, geo, SLA, actions, UI, chainage mapping)
constants/          → Shared constants (auth, roles, alarm options, evidence, UI breakpoints, badge variants, dashboard config)
prisma/             → `schema.prisma`, migrations, seed script
docs/               → Phase specs, implementation notes
proxy.ts            → Next.js 16.1 proxy for auth-aware redirects
```

---

## 🔐 Authentication & Routing

- **Auth routes:**
  - `/auth/signin` – credentials sign-in (NextAuth)
  - `/auth/register` – operator self‑registration
  - `/auth/error` – friendly error surface for NextAuth error codes
- **Dashboards by role** (guarded on the server and via proxy):
  - `OPERATOR` → `/operator`
  - `SUPERVISOR` / `NIGHT_SUPERVISOR` → `/supervisor`
  - `RMP` / `ER` → `/rmp`
  - `QRV_SUPERVISOR` → `/qrv`
- **Proxy protection (`proxy.ts`):**
  - If **logged in**, visiting `/auth/*` redirects to the correct dashboard.
  - If **not logged in**, visiting any non‑public page redirects to `/auth/signin` with a `callbackUrl` back to the original path.
  - `/api/*` and static assets are excluded from proxy checks.

---

## ⚙️ Environment Variables

Create `.env`:

```bash
DATABASE_URL=
JWT_SECRET=

AZURE_STORAGE_ACCOUNT=
AZURE_STORAGE_KEY=
AZURE_BLOB_CONTAINER=
```

---

## 🛠️ Local Development

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev   # if you change schema
pnpm prisma db seed       # optional: seed roles, users, chainages, example alarms
pnpm dev
```

---

## ☁️ Deployment

Hosted on **Azure App Service** with:

- CI/CD via GitHub Actions
- Azure PostgreSQL
- Azure Blob Storage

---

## 📌 Phase Roadmap

### Phase 1

Core alarm & investigation workflow

### Phase 2

Realtime updates, escalations, notifications

### Phase 3

PIDS API ingestion, GIS analytics, patrol tracking

---

## 📜 License

Proprietary — Internal Use Only. See [LICENSE](LICENSE) for full terms.

---

## 🤝 Contributors

Internal operations & engineering teams.
