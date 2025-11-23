## Impossibl

Impossibl game for worldcoin

### Tech stack
- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4**
- **Better Auth** with **Sign-In with Farcaster (SIWF)**
- **Neynar** API client
- **Drizzle ORM** + **Turso (libSQL)**
- **Farcaster Mini App SDK/Core/Node**
- **Wagmi** + Farcaster connector

## Requirements
- Node >= 20.18.0
- pnpm >= 10.0.0

## Quick start
1) Install dependencies
```bash
pnpm install
```

2) Configure environment variables
```bash
cp .env.example .env
```
Fill in the values described in the Environment section below.

3) Run the dev server
```bash
pnpm dev
```

4) Expose localhost via a tunnel for Miniapp debugging
Use your preferred tunneling tool and follow this guide: https://dtech.vision/farcaster/miniapps/theultimatefarcasterminiappdebuggingguide/#warpcast-debugger

## Environment
Server-side (required):
- `BETTER_AUTH_SECRET`: Session encryption secret
- `NEYNAR_API_KEY`: Neynar API key
- `NOTIFICATION_SECRET`: Secret to authorize POST `/api/notify`
- `TURSO_DATABASE_URL`: Turso libSQL database URL
- `TURSO_DATABASE_TOKEN`: Turso auth token

Client-side:
- `NEXT_PUBLIC_APP_ENV`: `development` | `production` (default `production`)
- `NEXT_PUBLIC_URL`: Public base URL (e.g. `https://your-app.vercel.app` or tunnel URL)
- `NEXT_PUBLIC_FARCASTER_HEADER`: From Warpcast Manifest Tool
- `NEXT_PUBLIC_FARCASTER_PAYLOAD`: From Warpcast Manifest Tool
- `NEXT_PUBLIC_FARCASTER_SIGNATURE`: From Warpcast Manifest Tool
- `NEXT_PUBLIC_BASE_BUILDER_ADDRESS`: Base chain builder address (app-specific)
- `NEXT_PUBLIC_APPLICATION_NAME`: App display name
- `NEXT_PUBLIC_APPLICATION_DESCRIPTION`: App description

## Scripts
```bash
pnpm dev           # Start dev server (Turbopack)
pnpm build         # Lint then build
pnpm start         # Start production server
pnpm lint          # Biome checks
pnpm format        # Biome format --write
pnpm typecheck     # TypeScript noEmit

# Drizzle / Turso
pnpm db:generate   # Generate migrations
pnpm db:migrate    # Apply migrations
pnpm db:push       # Push schema
pnpm db:studio     # Drizzle Studio
```

## Features
### Authentication (Better Auth + MiniKit)
- Server config in `src/lib/auth.ts` with MiniKit for user resolution via World App
- Client in `src/lib/auth-client.ts` (cookies, MiniKit client plugin)
- Trusted origin and cookie settings are derived from `NEXT_PUBLIC_URL`

### API proxy/auth guard
- Middleware-like proxy in `src/proxy.ts` protects all `/api/*` endpoints by default
- Public APIs bypassed: `/api/og/*`, `/api/webhook/farcaster`, `/api/notify`, `/api/auth/*`

### Farcaster Mini App metadata
- Dynamic miniapp metadata embedded in `generateMetadata` of `src/app/profile/[userId]/page.tsx`
- `fc:miniapp` points to a deep link back into the app

### Dynamic OG images
- Endpoint: `GET /api/og/profile/[userId]` with optional `?ar=3x2` for Farcaster aspect ratio
- Components in `src/components/og-image/*`

### Webhooks and notifications
- Farcaster webhook: `POST /api/webhook/farcaster`
  - Validates events via `@farcaster/miniapp-node` and Neynar app key
  - Persists notification details per user; sends welcome/confirmation notifications
- Broadcast notifications: `POST /api/notify`
  - Requires header `x-notification-secret: ${NOTIFICATION_SECRET}`
  - Body: `{ "title": string, "body": string, "targetUrl?": string }`

### Example pages
- Home and profile flows using `src/components/pages/*`
- Profile route: `src/app/profile/[userId]/page.tsx`

## API overview
- `GET/POST /api/auth/[...all]`: Better Auth routes
- `POST /api/webhook/farcaster`: Farcaster event handler (miniapp added/removed, notifications enabled/disabled)
- `POST /api/notify`: Internal broadcast notifications
- `GET /api/og/profile/[userId]`: Dynamic OG images

## Database
- Drizzle ORM with Turso (libSQL)
- Schema in `src/lib/database/db.schema.ts`
- Queries in `src/lib/database/queries/*`
- Common commands:
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

## Deploy
- Recommended: Vercel
- Set all required env vars in the hosting provider
- Ensure `NEXT_PUBLIC_URL` matches the deployed public URL (affects cookies and auth)

## Notes
- This repository is intended for internal use as a generalized Farcaster Mini App template.
- Update copy, branding, and components under `src/components` to fit your app.

## Links
- World Mini Apps: https://docs.world.org/mini-apps
- Farcaster Mini Apps: https://miniapps.farcaster.xyz/
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Neynar: https://neynar.com
