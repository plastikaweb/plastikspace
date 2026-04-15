import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { EcoStoreProductCategoriesStatsService } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { firstValueFrom } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  // 1. Static Auth Routes: Pre-rendered for instant loading
  { path: 'accedir', renderMode: RenderMode.Prerender },
  { path: 'recuperar-contrasenya', renderMode: RenderMode.Prerender },
  { path: 'recuperar-contrasenya-enviada', renderMode: RenderMode.Prerender },
  { path: 'restablir-contrasenya', renderMode: RenderMode.Prerender },

  // 2. Shop Landing: Pre-rendered as it's the main entry point for SEO
  { path: 'botiga', renderMode: RenderMode.Prerender },

  // 3. Dynamic Product Catalog: SSR to ensure SEO with up-to-date prices/stock
  {
    path: 'botiga/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const statsService = inject(EcoStoreProductCategoriesStatsService);
      const tenantStore = inject(ecoStoreTenantStore);

      // Ensure the tenant is loaded to get the ID
      await tenantStore.getTenant();
      const tenantId = tenantStore.tenant()?.id;

      if (!tenantId) {
        return [];
      }

      // Fetch categories for this tenant
      const stats = await firstValueFrom(
        statsService.getFullList({
          filter: `tenant ="${tenantId}"`,
        })
      );

      // Return the list of parameters to pre-render
      // Ensure we only return valid strings and satisfy the type requirements
      return stats
        .filter(stat => !!stat.normalizedName)
        .map(stat => ({
          category: stat.normalizedName as string,
        }));
    },
  },
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
