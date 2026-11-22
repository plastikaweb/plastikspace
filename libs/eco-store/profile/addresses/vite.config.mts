/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/eco-store/profile/addresses',
  plugins: [angular()],
  test: {
    name: 'eco-store-profile-addresses-feature',
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts', '../../../../vitest-setup.ts'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/eco-store/profile/addresses',
      provider: 'v8' as const,
    },
  },
}));
