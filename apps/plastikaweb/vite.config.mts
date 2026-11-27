import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';
export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/plastikaweb',
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  test: {
    name: 'plastikaweb',
    watch: false,
    setupFiles: ['src/test-setup.ts', '../../vitest-setup.ts'],
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/plastikaweb',
      provider: 'v8' as const,
      reporter: ['text', 'json-summary'],
    },
  },
  ssr: {
    noExternal: ['apollo-angular'],
  },
}));
