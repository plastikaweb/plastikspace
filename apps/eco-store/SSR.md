# Eco-Store SSR Documentation

This document explains the Server-Side Rendering (SSR) implementation and configuration for the **Eco-Store** application.

- [Eco-Store SSR Documentation](#eco-store-ssr-documentation)
  - [Overview](#overview)
  - [Architecture](#architecture)
    - [Key Files](#key-files)
  - [Rendering Strategies](#rendering-strategies)
  - [Cloudflare Deployment](#cloudflare-deployment)
    - [Wrangler Configuration](#wrangler-configuration)
    - [Optimization Scripts](#optimization-scripts)
  - [Development Commands](#development-commands)

## Overview

Eco-Store uses **Angular SSR** (part of Angular 21) to improve SEO and initial load performance. The application is deployed as a **Cloudflare Worker** that handles both server-side rendering and static asset serving.

## Architecture

The SSR implementation follows the standard Angular pattern with specific adaptations for the Cloudflare environment.

### Key Files

- **`src/main.server.ts`**: The entry point for the server-side application.
- **`src/server.ts`**: The Cloudflare Worker entry point using `@angular/ssr`.
- **`src/app/app.config.server.ts`**: Server-specific providers. It includes a `ServerTranslateLoader` that loads translation files directly from the filesystem to avoid unnecessary HTTP requests during rendering.
- **`src/app/app.routes.server.ts`**: Defines the rendering mode for each route (SSR vs. Prerendering).

## Rendering Strategies

We use a **Hybrid Rendering Strategy** to balance speed and SEO:

1. **Prerender (Static)**:
   - Auth routes (`/accedir`, `/recuperar-contrasenya`, etc.).
   - Shop landing page (`/botiga`).
   - These pages are generated at build time for maximum performance.
   - At build time the host is `localhost`, which names no tenant, so these pages hold no tenant data and the build asks PocketBase nothing (TECH-18):
     `injectIsBuildTimeRender()` (`@plastik/eco-store/tenant`) is true on the server with no `REQUEST`, the tenant store then stays unloaded, and the product list stays loading.
     The browser loads the tenant. Asking the hosted PocketBase from every build made the prerender time out when it answered slowly.
2. **Server (SSR)**:
   - Dynamic product catalog (`/botiga/:category`, `/botiga/:category/:slug`).
   - User-specific pages (`/cistella`, `/comandes`, `/perfil`).
   - These pages are rendered on-demand to ensure search engines and users always see up-to-date content and metadata.

## Cloudflare Deployment

The application is deployed as a **Workers Assets** application.

### Wrangler Configuration

The `apps/eco-store/wrangler.jsonc` file configures the deployment:

- `main`: Points to the server worker bundle.
- `assets`: Configures the directory for static files (`browser` folder).
- `compatibility_flags`: Includes `nodejs_compat` to support Angular SSR requirements.

### Optimization Scripts

- **`tools/scripts/add-cfasync.cjs`**: This script post-processes the build to add `data-cfasync="false"` to all script tags in `index.html` and `index.csr.html`.
  This prevents Cloudflare Rocket Loader from deferring Angular scripts, which is critical for successful hydration.

## Per-tenant PWA identity (BUG-003)

iOS Safari "Add to Home Screen" reads the **server-rendered** document and
ignores JS-injected/`blob:` manifests and JS-set titles. So tenant PWA identity
must be emitted by the worker, the only layer that sees the request `Host`:

- **`/manifest.webmanifest`** is routed to the worker via
  `assets.run_worker_first` in `wrangler.jsonc` (the static asset would
  otherwise bypass the worker). The worker resolves the tenant from the
  subdomain through an edge-cached, time-bounded, unauthenticated PocketBase
  lookup and returns a per-tenant manifest (`name`/`short_name`/logo icons),
  falling back to the generic manifest for non-tenant hosts.
- The served HTML `<head>` gets `apple-mobile-web-app-title` (the load-bearing
  iOS tag) plus `apple-mobile-web-app-capable`/`mobile-web-app-capable`,
  injected with `HTMLRewriter` for both SSR and prerendered routes.

Pure helpers live in `src/tenant-branding.ts` (unit-tested); the Cloudflare glue
lives in `src/server.ts`.

Two traps when checking which layer answered:

- A static asset carries the same security headers as a worker response: the
  `_headers` file that `scripts/generate-cf-headers.cjs` writes during
  `build-cf` stamps them on every path. Headers do not prove the worker ran.
- Check with `wrangler dev` (`yarn eco-store:cf:dev`) on a `build-cf` artifact,
  never on `build:production`, which writes no `_headers` and skips
  `add-cfasync`. For the manifest, the worker answers
  `application/manifest+json; charset=utf-8`; the static file answers with
  wrangler's `max-age=0, must-revalidate`.

## Development Commands

| Task               | Command                      | Description                                           |
| :----------------- | :--------------------------- | :---------------------------------------------------- |
| **Build for CF**   | `yarn eco-store:build-cf`    | Builds the app and applies CF-specific optimizations. |
| **Local Preview**  | `yarn eco-store:cf:local`    | Runs the app locally using Wrangler.                  |
| **Deploy Staging** | Automated via GitHub Actions | Triggered on push to `develop` branch.                |

---

> Part of the [**Eco-Store**](./README.md) documentation.
