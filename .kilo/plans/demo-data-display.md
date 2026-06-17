# Demo Data Display Plan

## Summary
Add a "Try demo" option on the login page that loads realistic mock data, letting the dashboard render fully without any Supabase/Prisma database setup.

## Changes

### 1. Create `src/lib/demo/demo-data.ts`
- Define mock wedding object, guests (12 entries), RSVPs, analytics, and invitations (mirrors `prisma/seed.ts`)
- Export `getMockWedding()`, `getMockGuests()`, `getMockRsvps()`, `getMockAnalytics()`, `getMockInvitations()`, `getMockDashboardMetrics()`

### 2. Add demo mode detection
- Create `src/lib/auth/demo.ts` with `isDemoMode()` that checks a `demo=true` session cookie
- Update `src/lib/auth/rbac.ts` so `requireCoupleAdmin()` skips auth when in demo mode and auto-creates a demo session state

### 3. Update feature queries to support demo mode
- Each server-only query checks `isDemoMode()` first:
  - `src/features/guests/queries.ts` → mock guests/groups
  - `src/features/rsvp/queries.ts` → mock RSVPs
  - `src/features/analytics/queries.ts` → mock analytics
  - `src/features/invitations/queries.ts` → mock invitations
  - `src/features/dashboard/queries.ts` → mock metrics
  - `src/lib/wedding/current.ts` → mock wedding

### 4. Add demo API route
- `src/app/api/demo/route.ts` — POST sets `demo=true` cookie and redirects to `/dashboard`

### 5. Update login page
- `src/app/(auth)/login/page.tsx` — add a "Try demo" button that calls `/api/demo`

## Behavior
- Default: All queries hit the database exactly as before, auth is required
- Demo mode: Cookie bypasses auth, all server components render with seeded mock data — no DB or login needed
