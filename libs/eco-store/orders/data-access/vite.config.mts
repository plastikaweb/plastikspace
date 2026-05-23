import angular from '@analogjs/vite-plugin-angular';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';
export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/libs/eco-store/orders/data-access',
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: 'eco-store-orders-data-access',
    watch: false,
    setupFiles: ['src/test-setup.ts', '../../../../vitest-setup.ts'],
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/eco-store/orders/data-access',
      provider: 'v8' as const,
      reporter: ['text', 'json-summary'],
    },
  },

  ssr: {
    noExternal: [/rxfire/, /@firebase/, /@angular\/fire/, /apollo-angular/],
  },
}));
