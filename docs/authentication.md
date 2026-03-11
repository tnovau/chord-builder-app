# Authentication

This document covers the authentication system used in ChordBuilder. It is intended for maintainers and contributors who need to understand, modify, or extend the auth setup.

## Architecture overview

The auth stack is:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Auth framework | [Better Auth](https://better-auth.com) v1 | Session management, credential hashing, API routes |
| ORM | [Prisma](https://www.prisma.io) v7 | Type-safe database access and migrations |
| Database | PostgreSQL | Persistent storage for users, sessions, accounts |
| Client | `better-auth/react` | React hooks for sign-in/up/out and session state |
| Cookie handling | `nextCookies` plugin | Sets cookies from Next.js server actions |

## File map

```
lib/
├── auth.ts              # Server-side Better Auth instance (betterAuth())
├── auth-client.ts       # Client-side auth hooks (createAuthClient())
└── generated/prisma/    # Auto-generated Prisma client (gitignored)

app/
├── api/auth/[...all]/
│   └── route.ts         # Catch-all API handler for /api/auth/*
├── [lang]/login/
│   └── page.tsx         # Login page (email + password)
└── [lang]/register/
    └── page.tsx         # Registration page (name + email + password)

components/
└── HeaderAuth.tsx       # Session-aware header nav (login/register or user/sign-out)

prisma/
├── schema.prisma        # Database schema (User, Session, Account, Verification)
├── migrations/          # SQL migration history
└── ...

prisma.config.ts         # Prisma configuration (datasource URL, migration path)
.env                     # Environment variables (gitignored)
```

## Database schema

Four tables, all managed by Better Auth through Prisma:

```
┌──────────────┐       ┌──────────────┐
│    User      │       │   Session    │
├──────────────┤       ├──────────────┤
│ id       PK  │──1:N──│ userId    FK │
│ name         │       │ token   UQ   │
│ email    UQ  │       │ expiresAt    │
│ emailVerified│       │ ipAddress    │
│ image?       │       │ userAgent    │
│ createdAt    │       │ createdAt    │
│ updatedAt    │       │ updatedAt    │
└──────────────┘       └──────────────┘
        │
        │ 1:N
        ▼
┌──────────────┐       ┌──────────────────┐
│   Account    │       │   Verification   │
├──────────────┤       ├──────────────────┤
│ userId    FK │       │ id           PK  │
│ accountId    │       │ identifier       │
│ providerId   │       │ value            │
│ password?    │       │ expiresAt        │
│ accessToken? │       │ createdAt        │
│ refreshToken?│       │ updatedAt        │
│ scope?       │       └──────────────────┘
│ createdAt    │
│ updatedAt    │
└──────────────┘
```

- **User** — core identity (name, email, avatar).
- **Session** — one per login; stores token, device info, and expiry. Cascade-deletes with User.
- **Account** — links a user to an auth provider. For email/password auth, the `providerId` is `"credential"` and `password` stores the bcrypt hash. For future OAuth providers, this row stores tokens. Cascade-deletes with User.
- **Verification** — short-lived tokens for email verification, password reset, etc.

All table names in PostgreSQL are lowercase (`user`, `session`, `account`, `verification`) via Prisma's `@@map()`.

## Auth flows

### Sign up

1. User visits `/{locale}/register`.
2. Client-side validation: password ≥ 8 chars, confirmation matches.
3. `authClient.signUp.email({ name, email, password })` → `POST /api/auth/sign-up/email`.
4. Better Auth hashes the password (bcrypt), creates `user` + `account` + `session` rows.
5. `nextCookies` plugin sets the session cookie.
6. Client redirects to `/{locale}` (home).

### Sign in

1. User visits `/{locale}/login`.
2. `authClient.signIn.email({ email, password })` → `POST /api/auth/sign-in/email`.
3. Better Auth verifies credentials, creates a new `session` row.
4. Session cookie set, client redirects home.

### Session check (client)

```tsx
const { data: session, isPending } = authClient.useSession();
```

The `useSession` hook reads the session cookie and returns the current user. See `components/HeaderAuth.tsx` for the pattern.

### Session check (server component / server action)

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers(),
});
```

### Sign out

```tsx
authClient.signOut();
```

Invalidates the session on the server and clears the cookie.

### Protecting a page (server component)

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/en/login");

  return <div>Welcome {session.user.name}</div>;
}
```

### Protecting a page (proxy / middleware)

The project uses Next.js 16 proxy (`proxy.ts`). You can add auth checks there using cookie-based detection:

```tsx
import { getSessionCookie } from "better-auth/cookies";

// Inside the proxy function:
const sessionCookie = getSessionCookie(request);
if (!sessionCookie) {
  return NextResponse.redirect(new URL("/en/login", request.url));
}
```

> **Note:** Cookie checks in proxy are optimistic — they verify the cookie exists but don't validate it. Always validate the session server-side for protected data.

## Environment variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `BETTER_AUTH_SECRET` | Encryption key for sessions (≥ 32 chars) | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Base URL for auth callbacks | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/chord_builder_db` |

All three are required. They live in `.env` which is gitignored.

## Setup for new developers

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and fill in values
cp .env.example .env
# Edit .env: set DATABASE_URL, generate BETTER_AUTH_SECRET

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. Start dev server
npm run dev
```

## Extending authentication

### Add a social provider (e.g. GitHub)

1. Add credentials to `.env`:
   ```
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   ```

2. Update `lib/auth.ts`:
   ```ts
   export const auth = betterAuth({
     // ...existing config
     socialProviders: {
       github: {
         clientId: process.env.GITHUB_CLIENT_ID!,
         clientSecret: process.env.GITHUB_CLIENT_SECRET!,
       },
     },
   });
   ```

3. Add a sign-in button on the login page:
   ```tsx
   authClient.signIn.social({ provider: "github" });
   ```

No database migration needed — the existing `account` table already supports multiple providers.

### Add fields to the user model

1. Add the field in `lib/auth.ts`:
   ```ts
   export const auth = betterAuth({
     // ...existing config
     user: {
       additionalFields: {
         role: {
           type: "string",
           required: false,
           defaultValue: "user",
           input: false,
         },
       },
     },
   });
   ```

2. Add the column in `prisma/schema.prisma`:
   ```prisma
   model User {
     // ...existing fields
     role String @default("user")
   }
   ```

3. Run migration:
   ```bash
   npx prisma migrate dev --name add_user_role
   ```

### Add a Better Auth plugin

Better Auth has plugins for two-factor auth, magic links, passkeys, etc. To add one:

1. Install if needed (most are built-in).
2. Add to the `plugins` array in `lib/auth.ts` (keep `nextCookies()` last).
3. If the plugin adds tables, update `prisma/schema.prisma` and run `npx prisma migrate dev`.
4. If it has client-side features, import its client plugin in `lib/auth-client.ts`.

See [better-auth.com/docs/plugins](https://better-auth.com/docs/plugins) for the full list.

## i18n integration

All auth UI strings are in the `auth` key of the translation files:

- `i18n/locales/en.json` → `auth.*`
- `i18n/locales/es.json` → `auth.*`
- `i18n/types.ts` → `Translations.auth`

Components access translations via `const { t } = useLanguage()` and use `t.auth.*` keys.

When adding new auth UI strings, update all three files.

## Security notes

- Passwords are bcrypt-hashed by Better Auth before storage.
- Session tokens are cryptographically random, stored in HTTP-only cookies.
- `nextCookies` plugin ensures cookies are set correctly from server actions.
- CSRF protection is built into Better Auth.
- `BETTER_AUTH_SECRET` must be unique per environment and never committed.
- The `lib/generated/prisma/` directory is gitignored — regenerate with `npx prisma generate`.
- Session/Account rows cascade-delete when a User is deleted.
