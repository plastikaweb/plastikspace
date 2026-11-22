/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '../../../../../node_modules/.vite/libs/eco-admin/auth/feature/recovery',
  plugins: [angular()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  test: {
    name: 'eco-admin-auth-recovery',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts', '../../../../../vitest-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../../coverage/libs/eco-admin/auth/feature/recovery',
      provider: 'v8' as const,
      reporter: ['text', 'json-summary'],
    },
  },
}));
