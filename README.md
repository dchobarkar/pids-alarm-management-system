# PIDS Alarm Management System — Phase 1 (MVP)

A full-stack alarm management system built with Next.js 16, TypeScript, Prisma, and PostgreSQL. Supports alarm creation, chainage-based routing, assignment, field investigation reporting, and closure.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma 6.x
- **Auth:** NextAuth.js (Credentials + JWT)
- **Storage:** Azure Blob Storage (for investigation photos)
- **Styling:** Tailwind CSS 4

## Getting Started

### Prerequisites

- Node.js 20.9+
- PostgreSQL database
- (Optional) Azure Storage account for photo uploads

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pids_alarm?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-characters"
AZURE_STORAGE_ACCOUNT=""
AZURE_STORAGE_KEY=""
AZURE_BLOB_CONTAINER="investigation-photos"
```

### Database Setup

```bash
npm run db:push    # Create tables
npm run db:seed    # Seed default users
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default Users (after seed)

| Email | Password | Role | Chainage |
|-------|----------|------|----------|
| operator@pids.local | password123 | OPERATOR | 0-100 km |
| supervisor@pids.local | password123 | SUPERVISOR | 10-20 km |
| rmp@pids.local | password123 | RMP | 10-20 km |
| er@pids.local | password123 | ER | 15-25 km |
| qrvs@pids.local | password123 | QRV_SUPERVISOR | 0-100 km |

## User Roles & Capabilities

| Role | Create Alarms | View Alarms | Assign | Submit Report | Close | Manage Users |
|------|---------------|-------------|--------|---------------|-------|--------------|
| OPERATOR | ✓ | All | — | — | ✓ | ✓ |
| SUPERVISOR | — | Chainage | ✓ | — | — | — |
| NIGHT_SUPERVISOR | — | Chainage | ✓ | — | — | — |
| RMP | — | Chainage | Self | ✓ | — | — |
| ER | — | Chainage | Self | ✓ | — | — |
| QRV_SUPERVISOR | — | Oversight | — | — | — | — |

## Project Structure

```
/app
  /(auth)/login
  /(main)
    /dashboard
    /alarms/create, /alarms/[id]
    /assignments
    /reports
    /users
/api
  /auth/[...nextauth]
  /uploads
/lib
  db.ts, auth.ts, rbac.ts, chainage.ts, audit.ts, blob.ts
/prisma
  schema.prisma, seed.ts
```

## Deployment (Azure App Service)

1. Create App Service (Linux, Node 20+)
2. Configure environment variables
3. Connect GitHub repo for auto-deploy
4. Run `prisma migrate deploy` in build step

## License

Private / Internal Use
