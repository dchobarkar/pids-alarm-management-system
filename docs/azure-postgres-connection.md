# Azure PostgreSQL connection string for GitHub Actions & Web App

The app expects **`DATABASE_URL`** (PostgreSQL connection string). Use the same value for both the Azure Web App (runtime) and, if you run migrations in CI, for GitHub Actions.

---

## Why DATABASE_URL isn’t used at build time (Next.js + Prisma + Azure/CI)

This affects **any** Next.js app that uses a DB (Prisma or not) when you build in CI and deploy elsewhere:

- During **`next build`**, Next.js runs “Collecting page data” and loads server code (including API routes and their imports). If that code reads `DATABASE_URL` (or creates a DB client) at **module load time**, the build fails in CI because `DATABASE_URL` isn’t set there—it’s only set on the Web App at **runtime**.
- **Next.js:** Non-`NEXT_PUBLIC_` env vars are server-only. The docs recommend reading them in code that runs at **request time** (e.g. inside Route Handlers or after `connection()` in dynamic components), not at module load. [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) · [Runtime env](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#runtime-environment-variables)
- **Prisma:** The [Next.js + Prisma guide](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices) focuses on avoiding multiple client instances in dev; it doesn’t require `DATABASE_URL` at build time. Lazy-initializing the client (read `DATABASE_URL` only when the client is first used) keeps the build env-agnostic and matches the “evaluate at runtime” idea.
- **Azure:** App settings (e.g. `DATABASE_URL`) are available when the app **runs** on the Web App, not during the GitHub Actions **build**. So the build must not depend on them.

This repo uses **lazy initialization** in `api/db.ts`: the Prisma client is created on first use, so `DATABASE_URL` is only read at runtime. Builds in CI succeed without `DATABASE_URL`; the deployed app gets it from Azure Web App configuration.

---

## Where to find the connection string

### Option 1: Azure Portal

1. Open [Azure Portal](https://portal.azure.com) and go to the **resource group** where you deployed the app (e.g. the one containing `dev-pids-ams-wa`).
2. Open the **PostgreSQL Flexible Server** resource (name may look like `dev-pids-ams-db` or similar).
3. In the left menu, go to **Settings** → **Connection strings** (or **Connect**).
4. Copy the **ADO.NET** or **Connection string** and convert it to PostgreSQL format, or note:
   - **Server** (e.g. `yourserver.postgres.database.azure.com`)
   - **Database** (e.g. `postgres` or a DB you created)
   - **Admin username** (e.g. `myadmin`)
   - **Password** (set at creation; reset under **Settings** → **Authentication** if needed).

**PostgreSQL format:**

```text
postgresql://USERNAME:PASSWORD@SERVER.postgres.database.azure.com:5432/DATABASE?sslmode=require
```

Example:

```text
postgresql://myadmin:MyP%40ssw0rd@dev-pids-ams-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

Encode special characters in the password (e.g. `@` → `%40`).

### Option 2: Azure CLI

List Flexible Servers and get connection info:

```bash
az postgres flexible-server list --output table
```

Connection string (replace placeholders):

```bash
az postgres flexible-server show-connection-string \
  --server-name YOUR_SERVER_NAME \
  --database-name postgres \
  --admin-user YOUR_ADMIN_USER \
  --admin-password YOUR_PASSWORD
```

Or build it manually:  
`postgresql://YOUR_ADMIN_USER:YOUR_PASSWORD@YOUR_SERVER_NAME.postgres.database.azure.com:5432/postgres?sslmode=require`

### If the deployment wizard added it

If you chose “PostgreSQL flexible database” when creating the Web App, the connection string may already be in the Web App config:

1. In Azure Portal, open **Web App** → **dev-pids-ams-wa**.
2. Go to **Settings** → **Configuration** → **Application settings**.
3. Look for **DATABASE_URL** or a variable like **POSTGRESQLCONNSTR\_...**.
4. Copy the value to use as `DATABASE_URL` (and for the GitHub secret below).

---

## Add secrets to GitHub Actions (Web App config)

The workflow **Set Web App configuration** injects these as Application settings on the Web App. Add them as repository secrets (or environment-specific secrets if you use GitHub Environments for staging/prod).

**Repo** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** for each:

| Secret name         | Description | Example / notes |
|---------------------|-------------|------------------|
| `DATABASE_URL`      | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `NEXTAUTH_SECRET`   | Secret used to sign JWT/session cookies | e.g. `openssl rand -base64 32` |
| `NEXTAUTH_URL`      | Full URL of the app (required for auth callbacks) | `https://dev-pids-ams-wa.azurewebsites.net` (or your custom domain) |
| `AUTH_TRUST_HOST`   | NextAuth trust proxy host (needed behind Azure) | `true` |

The workflow uses these and configures the Web App so the deployed app has the right DB and auth settings. No need to put these values in the repo or in the workflow file.

---

## Optional: run migrations in CI

To run `prisma migrate deploy` in the workflow, add a step that has access to `DATABASE_URL` (e.g. from the same GitHub secret) and run the command in the deploy job after setting the Web App config (or in a separate job that uses the secret as an env var).
