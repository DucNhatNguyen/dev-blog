# Decap CMS: production setup

The admin interface is available at `/admin/` and is intentionally marked `noindex`. It is not secure until Git Gateway and an identity provider are configured.

## Required external setup

1. Push this project to a private GitHub repository. The current workspace has no Git remote, so Decap cannot yet persist posts.
2. Create or connect a Netlify site to that repository. Netlify can be used only for Identity and Git Gateway; the public app may still deploy elsewhere.
3. In Netlify, enable **Identity** and set registration to **Invite only**. Do not enable public sign-up.
4. Invite only your own email address. Delete any other Identity users.
5. Enable **Git Gateway** and keep access limited to authenticated Identity users.
6. Deploy the site and open `/admin/`. Only the invited account can authenticate and create commits in `content/posts/`.

## Local preview

For local Decap editing, run the Decap proxy and the Next.js app in separate terminals:

```bash
corepack pnpm exec decap-server
corepack pnpm dev
```

Then open `http://localhost:3000/admin/`. Do not expose the local proxy to the internet.

## Security notes

- `/admin/` is hidden from crawlers but hiding a URL is not authentication.
- Invite-only Identity plus Git Gateway enforces author access server-side and prevents unauthenticated visitors from writing content.
- Keep GitHub, Netlify, and deployment credentials out of the repository. Set `NEXT_PUBLIC_SITE_URL` in the deployment environment.
