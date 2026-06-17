# Role-Based Navigation Plan

## Architecture Decision
- **Global roles** (UserRole enum): `SUPER_ADMIN`, `CUSTOMER`
- **Wedding-level roles** (WeddingStaff model): `OWNER`, `CO_ORGANIZER`, `PLANNER`, `STAFF`, `RECEPTIONIST`, `PHOTOGRAPHER`
- **Guests** have no login role — they access public invite pages via code

## Changes

### 1. Prisma Schema (`prisma/schema.prisma`)
- Rename `Role` enum values: `COUPLE_ADMIN` → `CUSTOMER`, `EVENT_STAFF` → `STAFF`, add `SUPER_ADMIN`
- Add `WeddingStaff` model:
  - `id`, `weddingId`, `userId`, `role` (wedding-level enum), `permissions` (Json), `createdAt`
  - Relations: belongsTo Wedding, belongsTo User
  - One user can have multiple staff records across weddings

### 2. Types (`src/types/domain.ts`, `src/types/next-auth.d.ts`)
- Update `UserRole` to `"SUPER_ADMIN" | "CUSTOMER" | "STAFF"`
- Update NextAuth session/JWT/User types
- Add `WeddingRole` and `Permission` types

### 3. Auth/RBAC (`src/lib/auth/rbac.ts`)
- Rename `requireCoupleAdmin()` → `requireCustomer()`
- Add `requireSuperAdmin()`
- Add `getWeddingStaffRole(userId, weddingId)` helper
- Add `hasPermission(userRole, weddingRole, permission)` helper
- Keep demo mode compatibility

### 4. Navigation Components
- **`src/components/layout/app-sidebar.tsx`**: Accept `role` + `weddingRole` props, filter nav items
- **`src/components/layout/mobile-nav.tsx`**: Pass role through
- **`src/components/layout/dashboard-shell.tsx`**: Fetch user role and pass to sidebar
- Create role-based nav config:
  - `WEDDING_OWNER`/`CO_ORGANIZER`: all items
  - `PLANNER`: Dashboard, Guests, RSVPs, Analytics (no Settings)
  - `STAFF`/`RECEPTIONIST`: RSVPs, Guests (read-only), Check-In
  - `PHOTOGRAPHER`: Gallery only
  - `SUPER_ADMIN`: separate platform nav (new sidebar or redirect)

### 5. Dashboard Layout (`src/app/dashboard/layout.tsx`)
- Fetch authenticated user
- Determine wedding staff role
- Pass role info to DashboardShell → AppSidebar

### 6. Super Admin Routes (new)
- `/platform` or `/admin` layout with platform nav
- Protected by `requireSuperAdmin()`

### 7. Demo Data (`src/lib/demo/demo-data.ts`)
- Add `SUPER_ADMIN` mock user
- Add mock WeddingStaff entries
- Add permission helpers for demo mode

### 8. Seed Update (`prisma/seed.ts`)
- Update role references from `COUPLE_ADMIN` → `CUSTOMER`
- Add seed for `WeddingStaff` records

## Navigation Matrix

| Nav Item | Owner | Co-Organizer | Planner | Staff | Receptionist | Photographer | Super Admin |
|----------|-------|--------------|---------|-------|--------------|--------------|-------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Wedding Details | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Guests | ✅ | ✅ | ✅ | 👁️ | 👁️ | ❌ | ❌ |
| Invitations | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| RSVPs | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Gallery | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Platform Dashboard | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Users Mgmt | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Weddings Mgmt | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Subscriptions | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

✅ = full access, 👁️ = read-only, ❌ = hidden
