# PIDS System — Phase 1 Implementation Instructions

This document defines the complete implementation guide for **Phase 1 (MVP)** of the PIDS Alarm Management System using **Next.js** hosted on **Azure**.

The goal of Phase 1 is to build a fully functional operational system that supports alarm creation, routing, assignment, investigation reporting, and closure.

---

## 1. Tech Stack

### Frontend + Backend

- Next.js (App Router)
- TypeScript
- Server Actions + API Routes

### Database

- PostgreSQL (Azure Database for PostgreSQL)
- ORM: Prisma (recommended) or Drizzle

### Storage

- Azure Blob Storage (for investigation photos)

### Auth

- JWT / NextAuth (Credentials provider)

### Hosting

- Azure App Service (Node runtime)

---

## 2. Core Modules in Phase 1

1. Authentication & Role Management
2. User Management
3. Chainage Mapping
4. Alarm Creation
5. Alarm Routing & Visibility
6. Alarm Assignment
7. Field Investigation Reporting
8. Photo Uploads
9. Alarm Closure
10. Audit Logs

---

## 3. User Roles

Define fixed roles enum:

```structure
OPERATOR
SUPERVISOR
NIGHT_SUPERVISOR
RMP
ER
QRV_SUPERVISOR
```

### Role Capabilities

**Operator**

- Create alarms
- View all alarms
- Manage users
- Close alarms

**Supervisor / Night Supervisor**

- View alarms in assigned chainage
- Assign alarms to RMP
- Monitor status

**RMP / ER**

- View alarms in their chainage
- Self‑assign alarms
- Submit remarks + geo + photos

**QRV Supervisor**

- Oversight visibility (read‑only in Phase 1)

---

## 4. Database Schema (Prisma Reference)

### User

Fields:

- id (uuid)
- name
- email
- passwordHash
- role
- supervisorId (nullable)
- chainageStart (decimal)
- chainageEnd (decimal)
- createdAt

---

### Alarm

Fields:

- id (uuid)
- latitude
- longitude
- chainage
- alarmType
- criticality
- incidentTime
- createdBy
- status
- createdAt

Status enum:

```
CREATED
ASSIGNED
INVESTIGATION_DONE
CLOSED
```

---

### AlarmAssignment

Fields:

- id
- alarmId
- assignedTo
- assignedBy
- assignedAt

---

### FieldReport

Fields:

- id
- alarmId
- userId
- remark
- geoLat
- geoLng
- createdAt

---

### Media

Fields:

- id
- reportId
- fileUrl
- uploadedAt

---

### AuditLog

Fields:

- id
- action
- entityType
- entityId
- performedBy
- metadata (json)
- createdAt

---

## 5. Alarm Routing Logic

When Operator creates an alarm:

1. Read alarm.chainage
2. Fetch users where:

```
chainageStart <= alarm.chainage <= chainageEnd
```

3. Filter roles:

- RMP
- ER
- Supervisor

4. Make alarm visible to them in dashboard.

---

## 6. Application Folder Structure

```
/app
  /(auth)
    /login

  /dashboard

  /alarms
    /create
    /[id]

  /assignments

  /reports

  /users

/api
  /auth
  /alarms
  /assignments
  /reports
  /uploads

/lib
  db.ts
  auth.ts
  rbac.ts
  chainage.ts

/prisma
  schema.prisma
```

---

## 7. Authentication Flow

1. User logs in via credentials.
2. Validate password hash.
3. Issue JWT session.
4. Store role in token.
5. Protect routes via middleware.

Middleware checks:

```
IsAuthenticated?
RoleAllowed?
```

---

## 8. Alarm Creation UI

Form fields:

- Latitude
- Longitude
- Chainage (3 decimal precision)
- Alarm Type (dropdown)
- Criticality (Low / Medium / High)
- Incident Time

On submit:

1. Create alarm record.
2. Trigger routing logic.
3. Insert audit log.

---

## 9. Alarm Dashboard Views

### Operator

- All alarms
- Filter by status
- Filter by criticality

### Supervisor

- Alarms in chainage
- Assignment status

### RMP

- Available alarms
- Assigned alarms

---

## 10. Alarm Assignment Flow

### Self‑Assignment (RMP)

1. Click "Assign to Me"
2. Create assignment record
3. Update alarm status → ASSIGNED
4. Log audit

---

### Supervisor Assignment

1. Select RMP
2. Create assignment
3. Update status
4. Notify RMP (Phase 2 realtime)

---

## 11. Field Investigation Reporting

RMP submits:

- Remark text
- Geo coordinates (auto captured)
- Timestamp
- Photos

---

### Geo Capture (Frontend)

Use browser/mobile GPS:

```
navigator.geolocation.getCurrentPosition()
```

Store lat/lng with report.

---

## 12. Photo Upload Flow

Use Azure Blob Storage.

### Steps

1. Client requests upload URL.
2. API generates SAS token.
3. Client uploads directly.
4. Store Blob URL in Media table.

---

## 13. Alarm Closure

Operator reviews:

- Remarks
- Geo validation
- Photos

If valid:

```
status → CLOSED
closedBy → operatorId
closedAt → timestamp
```

Audit log required.

---

## 14. RBAC Enforcement

### UI Level

- Hide unauthorized pages.

### API Level

Example:

```
Only Operator → create alarm
Only Supervisor → assign others
Only RMP → submit report
```

Never trust frontend checks alone.

---

## 15. Audit Logging

Track:

- Alarm created
- Assignment done
- Report submitted
- Alarm closed

Metadata example:

```
{
  previousStatus,
  newStatus,
  assignedTo
}
```

---

## 16. Environment Variables

```
DATABASE_URL=
JWT_SECRET=
AZURE_STORAGE_ACCOUNT=
AZURE_STORAGE_KEY=
AZURE_BLOB_CONTAINER=
```

Store in Azure App Service config.

---

## 17. Deployment (Azure App Service)

### Steps

1. Create App Service (Linux, Node 20+)
2. Configure env variables
3. Enable WebSockets
4. Connect GitHub repo
5. Auto deploy on push

---

## 18. MVP Acceptance Criteria

Phase 1 is complete when:

- Operator can create alarms
- Chainage routing works
- RMP can view & assign
- Field reports captured with geo
- Photos uploaded to Blob
- Operator can close alarms
- Role access enforced
- Audit logs recorded

---

## 19. Post‑Phase 1 Roadmap (Preview)

Phase 2 will introduce:

- Real‑time updates
- Escalation timers
- Push notifications
- Offline sync

(Defined later)

---

**End of Phase 1 Instructions**
