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

## Development Commands

| Task               | Command                      | Description                                           |
| :----------------- | :--------------------------- | :---------------------------------------------------- |
| **Build for CF**   | `yarn eco-store:build-cf`    | Builds the app and applies CF-specific optimizations. |
| **Local Preview**  | `yarn eco-store:cf:local`    | Runs the app locally using Wrangler.                  |
| **Deploy Staging** | Automated via GitHub Actions | Triggered on push to `develop` branch.                |

---

> Part of the [**Eco-Store**](./README.md) documentation.
