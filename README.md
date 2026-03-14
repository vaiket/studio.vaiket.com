# studio.vaiket.com

Standalone Next.js 16 App Router app for the Vaiket Studio website builder. The dashboard redirects to `https://studio.vaiket.com/sso?token=...&siteId=...&intent=...`, Studio verifies the token, creates a session cookie, and routes the user into the editor.

## Environment Variables

```
DATABASE_URL=postgres://...
BUILDER_SSO_SECRET=...
NEXT_PUBLIC_STUDIO_URL=https://studio.vaiket.com
```

## Local Development

1. `npm install`
2. `npx prisma generate`
3. `npx prisma migrate dev`
4. `npm run dev`

## SSO Flow

- `GET /sso?token=...&siteId=...&intent=...`
- JWT is verified with `BUILDER_SSO_SECRET`.
- Builder user is created/updated.
- A signed `studio_session` cookie is set (httpOnly, secure, sameSite=Lax).
- Redirects to `/templates`, `/sites/new`, `/sites/[id]/editor`, or `/sites`.

## API Endpoints

- `GET /api/sites`
- `POST /api/sites`
- `GET /api/sites/[id]`
- `PUT /api/sites/[id]`
- `PUT /api/sites/[id]/content`
- `POST /api/sites/[id]/publish`
- `GET /api/templates`
