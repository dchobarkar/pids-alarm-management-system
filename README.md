# PIDS Alarm Management System

Alarm dispatch and field investigation management platform for Pipeline Intrusion Detection Systems (PIDS).

This system enables operators to log intrusion alarms, route incidents based on pipeline chainage, assign field responders, capture geo-validated investigation reports, and track alarm closure lifecycle.

---

## 🚀 Tech Stack

- **Frontend / Backend:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Azure Database)
- **ORM:** Prisma
- **Storage:** Azure Blob Storage
- **Auth:** JWT / NextAuth
- **Hosting:** Azure App Service

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

## 📂 Project Structure

```structure
app/            → Next.js routes & UI
api/            → Server APIs
lib/            → Utilities & services
prisma/         → Database schema
docs/           → Architecture & specs
```

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
