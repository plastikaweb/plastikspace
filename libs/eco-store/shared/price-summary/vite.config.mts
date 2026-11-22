/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/eco-store/shared/price-summary',
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  test: {
    name: 'eco-store-price-summary',
    watch: false,
    globals: true,
    environment: 'jsdom',
    testTimeout: 10000,
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts', '../../../../vitest-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/eco-store/shared/price-summary',
      provider: 'v8' as const,
      reporter: ['text', 'json-summary'],
    },
  },

  ssr: {
    noExternal: [/rxfire/, /@firebase/, /@angular\/fire/, /apollo-angular/],
  },
}));
