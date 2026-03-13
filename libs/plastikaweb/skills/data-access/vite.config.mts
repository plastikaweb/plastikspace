import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';
export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/libs/plastikaweb/skills/data-access',
  plugins: [angular(), nxViteTsPaths()],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: 'skills-data-access',
    watch: false,
    setupFiles: ['src/test-setup.ts', '../../../../vitest-setup.ts'],
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/plastikaweb/skills/data-access',
      provider: 'v8' as const,
      reporter: ['text', 'json-summary'],
    },
  },
  ssr: {
    noExternal: ['apollo-angular'],
  },
}));
