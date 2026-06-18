# Plan: Role-Specific Demo Dashboards (Zero DB Changes)

## Goal
Each `WeddingRole` (OWNER, CO_ORGANIZER, PLANNER, STAFF, RECEPTIONIST, PHOTOGRAPHER) and `SUPER_ADMIN` shows a distinct dashboard populated with role-specific mock data when demo mode is active. No Prisma schema or seed changes. Existing dashboard code kept intact.

## Architecture: Demo Mode (Reuse Existing)
- `/api/demo` sets `demo=true` cookie (8h) — **already exists**
- New `/api/demo/role` sets `demo-role=<ROLE>` cookie — **to create**
- `getDashboardAccessOrRedirect()` and `requireSuperAdmin()` read the cookie and override returned role/data

## Files to Create
```
src/app/api/demo/role/route.ts
src/app/(platform)/layout.tsx
src/app/(platform)/page.tsx           # SUPER_ADMIN platform metrics
src/app/(platform)/users/page.tsx     # Mock users table
src/app/(platform)/weddings/page.tsx  # Mock weddings list
src/app/(platform)/subscriptions/page.tsx
src/app/(platform)/security/page.tsx
src/components/demo/role-switcher.tsx
```

## Files to Modify
```
src/lib/demo/demo-data.ts   → Add role-specific mocks + platform mocks
src/lib/auth/demo.ts        → Add getDemoRole() cookie reader
src/lib/wedding/current.ts  → Override weddingRole / userRole from demo cookie
src/lib/auth/rbac.ts        → Let SUPER_ADMIN demo bypass go to /platform
src/components/layout/dashboard-shell.tsx → Render RoleSwitcher when demo
src/components/layout/app-sidebar.tsx     → Highlight active nav per role
```

## Role Mock Data Blocks (in demo-data.ts)
- `getMockPlatformMetrics()` → SUPER_ADMIN totals
- `getMockPlatformUsers()` → user table
- `getMockPlatformWeddings()` → wedding list
- `getMockSubscriptions()` → plans table
- `getMockSecurityEvents()` → login/audit log
- `getMockPlannerSchedule()` → timeline/tasks
- `getMockStaffCheckInStats()` → check-in counters
- `getMockGalleryStats()` → upload stats

## Behavior Matrix
| Role | Home Page | Sidebar Items | Mock Content |
|------|-----------|---------------|--------------|
| SUPER_ADMIN | `/platform` | Users, Weddings, Subscriptions, Security, Analytics, Settings | Platform-wide stats |
| OWNER | `/dashboard` | All wedding items | Full guest list + analytics |
| CO_ORGANIZER | `/dashboard` | All except Settings | Same as OWNER read-only |
| PLANNER | `/dashboard` | Guests, RSVPs, Analytics | Task/timeline mock widgets |
| STAFF | `/dashboard` | Dashboard, Guests, RSVPs, Check-In | Today's shift stats |
| RECEPTIONIST | `/dashboard` | Guests, RSVPs, Check-In | Front-desk lookup mock |
| PHOTOGRAPHER | `/dashboard` | Gallery | Upload stats mock |

## New: Role Switcher Component
- Visible only in demo mode (`isDemoMode()`)
- Dropdown/segmented control to pick: OWNER / PLANNER / STAFF / RECEPTIONIST / PHOTOGRAPHER / SUPER_ADMIN
- Calls `/api/demo/role` and refreshes

## No Database
- Zero Prisma changes
- Zero seed changes
- `isDemoMode()` gates all mock returns in server components
