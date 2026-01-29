import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  srcDir: 'src',
  outDir: '../../dist/apps/plastikaweb',
  integrations: [],
  targets: {
    check: {
      executor: '@geekvetica/nx-astro:check',
      options: {
        autoInstall: true,
      },
    },
  },
});
