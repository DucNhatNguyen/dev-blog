# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 blog using the App Router, React 19, TypeScript, and Tailwind CSS 4. Application code lives in `app/`: `layout.tsx` defines the shared document shell, `page.tsx` renders the blog index, and `blog/[slug]/page.tsx` handles article routes. Global styling is centralized in `app/globals.css`. Place static, directly served files in `public/`. Framework and tool configuration stays at the repository root (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`). Generated directories such as `.next/` and `node_modules/` must not be committed or edited.

## Build, Test, and Development Commands

Use pnpm; `pnpm-lock.yaml` is the source of truth for dependency resolution.

- `pnpm install` installs exact locked dependencies.
- `pnpm dev` starts the local development server at `http://localhost:3000`.
- `pnpm lint` runs the Next.js Core Web Vitals and TypeScript ESLint rules.
- `pnpm build` creates a production build and performs Next.js type checks.
- `pnpm start` serves the completed production build.

Run `pnpm lint` and `pnpm build` before requesting review.

## Coding Style & Naming Conventions

Write strict TypeScript and functional React components. Follow the existing two-space indentation, double quotes, semicolons, and trailing commas. Use `PascalCase` for components and types, `camelCase` for functions and variables, and lowercase kebab-case for URL slugs (for example, `distributed-systems-clock-skew`). Keep route entry files named according to App Router conventions (`page.tsx`, `layout.tsx`). Prefer the `@/*` alias for cross-directory imports. Preserve accessible labels, semantic elements, keyboard behavior, responsive styles, and reduced-motion support when changing UI code.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. Treat linting and a production build as the required baseline. Manually verify the home page and at least one `/blog/[slug]` route at desktop and mobile widths, including search, tag filters, theme switching, carousel controls, and keyboard focus. If tests are introduced, colocate them as `*.test.ts` or `*.test.tsx` and add the runner to `package.json`.

## Commit & Pull Request Guidelines

No repository-specific commit convention is available in the current checkout. Use concise, imperative subjects, optionally with Conventional Commit prefixes such as `feat:`, `fix:`, or `docs:`. Keep commits focused. Pull requests should explain the change and validation performed, link related issues, and include before/after screenshots for visual changes. Call out accessibility, responsive-layout, dependency, or configuration impacts explicitly.
