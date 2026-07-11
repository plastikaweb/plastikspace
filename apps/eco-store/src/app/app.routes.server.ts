import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 1. Static Auth Routes: Pre-rendered for instant loading
  { path: 'accedir', renderMode: RenderMode.Prerender },
  { path: 'recuperar-contrasenya', renderMode: RenderMode.Prerender },
  { path: 'recuperar-contrasenya-enviada', renderMode: RenderMode.Prerender },
  { path: 'restablir-contrasenya', renderMode: RenderMode.Prerender },

  // 2. Shop Landing: Pre-rendered as it's the main entry point for SEO
  { path: 'botiga', renderMode: RenderMode.Prerender },

  // 3. Dynamic Product Catalog: SSR to ensure SEO with up-to-date prices/stock.
  // Server mode (not Prerender) because category content changes at request time and
  // getPrerenderParams depends on a remote tenant fetch at build time, which is fragile
  // and caused build-time failures that left all category routes returning 404 at runtime.
  { path: 'botiga/:category', renderMode: RenderMode.Server },
  { path: 'botiga/:category/:slug', renderMode: RenderMode.Server },

  // 4. User-Specific Routes: SSR to maintain layout consistency (Shell)
  // while dynamic data is handled via Client Hydration.
  { path: 'cistella', renderMode: RenderMode.Server },
  { path: 'comandes', renderMode: RenderMode.Server },
  { path: 'comandes/nova', renderMode: RenderMode.Server },
  { path: 'perfil', renderMode: RenderMode.Server },

  // 5. Default Catch-all
  { path: '**', renderMode: RenderMode.Server },
];
