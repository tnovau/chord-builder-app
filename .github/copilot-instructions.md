# Copilot Instructions — ChordBuilder

## Project overview

ChordBuilder is a guitar chord identification and visualization tool built with Next.js 16 (App Router), TypeScript (strict), and Tailwind CSS. It uses a custom `wood` color palette with Playfair Display and Source Serif 4 fonts.

## Tech stack

- **Framework:** Next.js 16 App Router with `[lang]` dynamic segment for i18n (en/es)
- **Auth:** Better Auth v1 with email/password. Server config in `lib/auth.ts`, client hooks in `lib/auth-client.ts`.
- **Database:** PostgreSQL via Prisma v7 with `@prisma/adapter-pg`. Schema in `prisma/schema.prisma`.
- **Styling:** Tailwind CSS. Custom colors under `wood` namespace. No CSS modules.
- **i18n:** URL-based (`/en/...`, `/es/...`). Translations in `i18n/locales/{lang}.json`. Type-safe via `i18n/types.ts`. Access with `useLanguage()` hook.

## Key files

| File | Role |
|------|------|
| `lib/auth.ts` | Server-side Better Auth instance. Uses `prismaAdapter` with PostgreSQL and `nextCookies` plugin. |
| `lib/auth-client.ts` | Client-side `createAuthClient()` from `better-auth/react`. Provides `signIn`, `signUp`, `signOut`, `useSession`. |
| `app/api/auth/[...all]/route.ts` | Catch-all route handler for all `/api/auth/*` requests. Uses `toNextJsHandler`. |
| `prisma/schema.prisma` | Database models: User, Session, Account, Verification. Tables map to lowercase names. |
| `prisma.config.ts` | Prisma config. Reads `DATABASE_URL` from env. |
| `components/HeaderAuth.tsx` | Session-aware nav: shows login/register links or user name + sign-out. |
| `app/[lang]/login/page.tsx` | Login form. Uses `authClient.signIn.email()`. |
| `app/[lang]/register/page.tsx` | Register form. Uses `authClient.signUp.email()`. Client-side validation (password ≥ 8, confirm match). |
| `proxy.ts` | Next.js 16 proxy (middleware). Handles i18n locale detection and redirects. |

## Conventions

- **Components:** PascalCase filenames, `"use client"` directive, default exports. Props via `interface Props`.
- **Translations:** Every user-facing string goes in `i18n/locales/*.json` and `i18n/types.ts`. Access via `const { t } = useLanguage()`.
- **Auth patterns (client):** Use `authClient.useSession()` for reactive session state. Use `authClient.signIn.email()`, `authClient.signUp.email()`, `authClient.signOut()`.
- **Auth patterns (server):** Use `auth.api.getSession({ headers: await headers() })` in server components and server actions.
- **Styling:** Tailwind utility classes only. Use `wood-*` colors, `font-playfair` for headings, `font-source` for body. Labels use `text-[11px] tracking-[3px] uppercase`.
- **Database changes:** Edit `prisma/schema.prisma`, then `npx prisma migrate dev --name description`.
- **Prisma client:** Generated to `lib/generated/prisma/` (gitignored). Import from `@/lib/generated/prisma/client`. Regenerate with `npx prisma generate`.

## Common tasks

### Protect a server component page
```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/en/login");
  return <div>Welcome {session.user.name}</div>;
}
```

### Add a social auth provider
1. Add `PROVIDER_CLIENT_ID` and `PROVIDER_CLIENT_SECRET` to `.env`.
2. Add `socialProviders.providerName` in `lib/auth.ts`.
3. Call `authClient.signIn.social({ provider: "providerName" })` in the UI.

### Add a user field
1. Add to `user.additionalFields` in `lib/auth.ts`.
2. Add column in `prisma/schema.prisma` User model.
3. Run `npx prisma migrate dev --name add_field_name`.

### Add a new translation key
1. Add the key to `i18n/types.ts` in the `Translations` interface.
2. Add values in `i18n/locales/en.json` and `i18n/locales/es.json`.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `BETTER_AUTH_SECRET` | Yes | Session encryption (≥ 32 chars) |
| `BETTER_AUTH_URL` | Yes | Base URL for auth |
| `DATABASE_URL` | Yes | PostgreSQL connection string |

## Documentation

Detailed auth documentation: `docs/authentication.md`.
