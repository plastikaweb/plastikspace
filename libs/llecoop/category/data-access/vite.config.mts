import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/llecoop/category/data-access',
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  test: {
    name: 'llecoop-category',
    watch: false,
    setupFiles: ['src/test-setup.ts', '../../../../vitest-setup.ts'],
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/llecoop/category/data-access',
      provider: 'v8' as const,
      reporter: ['text', 'json-summary'],
    },
  },

  ssr: {
    noExternal: [/rxfire/, /@firebase/, /@angular\/fire/, /apollo-angular/],
  },
}));
