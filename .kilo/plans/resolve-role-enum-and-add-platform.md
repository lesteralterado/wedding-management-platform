# Plan: Resolve Role Enum Confusion & Add Platform Super Admin Access

## Problem Summary
1. **Role enum confusion**: `CUSTOMER` and `STAFF` user roles don't align with the 3-tier app structure (Super Admin / Wedding Workspace / Public Website)
2. **Missing Super Admin platform**: No `/platform` routes exist, but sidebar already references them and `requireCustomer()` redirects `SUPER_ADMIN` there
3. **STAFF user role conflicts**: `STAFF` exists in `UserRole` AND `WeddingRole` — ambiguous
4. **Seed uses invalid enum value**: `Role.COUPLE_ADMIN` doesn't exist in the enum

## Current State (Read-Only Analysis)
- `User.role` enum: `SUPER_ADMIN | CUSTOMER | STAFF` (in schema + types)
- `WeddingRole` enum: `OWNER | CO_ORGANIZER | PLANNER | STAFF | RECEPTIONIST | PHOTOGRAPHER` (already correct)
- `WeddingStaff` model properly gaps users to weddings with roles
- Sidebar already has `platformNav` defined for SUPER_ADMIN but no routes match `/platform/*`
- `requireCustomer()` in `rbac.ts` redirects SUPER_ADMIN to `/platform` (which 404s)
- `rbac.ts` references to `STAFF` user role: `requireCustomer()` allows it, `canAccessRole()` allows it

## Changes Required

### 1. Remove `STAFF` from `UserRole` (MVCAC fix)
**Rationale**: All staff/team members are managed via `WeddingStaff` model with `WeddingRole`. A generic `STAFF` user role is unnecessary and conflicts with wedding role naming.

**Files:**
- `prisma/schema.prisma` — remove `STAFF` from `Role` enum
- `src/types/domain.ts` — remove `"STAFF"` from `UserRole` union

### 2. Fix seed.ts invalid enum value
**Files:**
- `prisma/seed.ts` — change `Role.COUPLE_ADMIN` → `Role.CUSTOMER`

### 3. Clean up RBAC references to STAFF user role
**Files:**
- `src/lib/auth/rbac.ts`:
  - `requireCustomer()`: remove `&& user.role !== "STAFF"` condition
  - `canAccessRole()`: remove `STAFF` case (no longer needed since STAFF users don't exist)

### 4. Create `/platform` route structure
**New platform routes using Next.js route group `(platform)`:**

**Files to create:**
- `src/app/(platform)/layout.tsx` — Platform shell layout with `AppSidebar` (SUPER_ADMIN), requires `requireSuperAdmin()` 
- `src/app/(platform)/page.tsx` — Platform dashboard home (metrics: total weddings, subscriptions, revenue, users)
- `src/app/(platform)/users/page.tsx` — Users management table
- `src/app/(platform)/weddings/page.tsx` — All weddings overview
- `src/app/(platform)/subscriptions/page.tsx` — Subscription plans overview
- `src/app/(platform)/security/page.tsx` — Security/audit page

**Pattern:**
```
src/app/(platform)/
├── layout.tsx          ← SUPER_ADMIN gate + AppSidebar
├── page.tsx            ← Platform dashboard
├── users/page.tsx      ← Users management
├── weddings/page.tsx   ← All weddings
├── subscriptions/page.tsx
└── security/page.tsx
```

### 5. Post-change behavior
- `SUPER_ADMIN` login → redirects to `/platform` (already happens via `requireCustomer()`)
- Platform routes protected by `requireSuperAdmin()` 
- `CUSTOMER` users (wedding owners) access `/dashboard` with their wedding team
- All wedding team roles managed via `WeddingStaff` — no ambiguity

## Migrations
- Prisma migration needed to drop `STAFF` from `Role` enum in database
- Run: `npx prisma migrate dev --name remove-staff-from-role-enum`

## Validation
- Verify seed runs without TypeScript errors
- Verify SUPER_ADMIN can log in and see `/platform` dashboard
- Verify CUSTOMER still accesses `/dashboard` 
- Verify platform sidebar nav works with existing `AppSidebar` `platformNav`
