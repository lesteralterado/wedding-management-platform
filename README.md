This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo Data

Use the seeded demo account to log in and view the dashboard data:

| Field | Value |
| --- | --- |
| Email | `admin@example.com` |
| Password | `Password123!` |
| Public wedding website | `/w/cherilyn-lester` |

To create or refresh the local demo data, run:

```bash
docker compose up -d
npx prisma db push
npm run db:seed
```

This seed resets the local database and creates demo guests, RSVPs, invitation links, and QR codes.

The app uses mock data by default. To enable demo mode, click the demo login button on the login page or use any credentials.

## Routes

### Public Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Home page (marketing/landing) |
| `/w/[slug]` | GET | Public wedding website by slug |

### Authentication Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/login` | GET, POST | Login page |
| `/register` | GET, POST | Registration page |
| `/api/auth/register` | POST | Create new user account |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth.js authentication handlers |

### Dashboard Routes (Authenticated Users)

| Route | Method | Description |
|-------|--------|-------------|
| `/dashboard` | GET | Dashboard home |
| `/dashboard/analytics` | GET | Analytics overview |
| `/dashboard/guests` | GET | Guest management |
| `/dashboard/rsvps` | GET | RSVP management |
| `/dashboard/invitations` | GET | Invitations management |
| `/dashboard/wedding` | GET | Wedding details |
| `/dashboard/gallery` | GET | Gallery management |
| `/dashboard/settings` | GET | Settings page |

### Platform Routes (Super Admin)

| Route | Method | Description |
|-------|--------|-------------|
| `/security` | GET | Security settings |
| `/weddings` | GET | All weddings list |
| `/subscriptions` | GET | Subscriptions management |
| `/users` | GET | Users management |

### Public Wedding Access Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/invite/[inviteCode]` | GET | Public invitation page by code |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/demo` | POST | Demo login (sets demo cookie, redirects to dashboard) |
| `/api/demo/role` | GET, POST | Get/set demo user role |
| `/api/wedding` | POST, PUT | Create wedding (POST) / update wedding details (PUT) |
| `/api/guests` | GET, POST | List all guests (GET, via `/api/guests?weddingId=...`) or create guest (POST) |
| `/api/guests/[id]` | PUT, DELETE | Update or delete specific guest |
| `/api/guests/import-preview` | POST | Preview CSV/Excel guest import file |
| `/api/guests/import-commit` | POST | Commit guest import to database |
| `/api/rsvp/[inviteCode]` | POST | Submit RSVP response |
| `/api/qr/[guestId]` | GET | Generate QR code for guest invitation |
| `/api/gallery` | POST | Upload gallery images |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
