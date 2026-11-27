#!/usr/bin/env node
/**
 * META-19: tests tools/generators/eco-lib.
 *
 * - The names: folder, project and alias for each app, `core`, a library without a name,
 *   and the errors for options the scheme does not allow.
 * - The generator on the real workspace, in memory (an FsTree reads the disk and keeps the
 *   writes; nothing is flushed): the files of a feature, a ui and an empty library, the
 *   root files it must leave alone, the alias, and the collisions it stops on.
 *
 * The acceptance run, lint and test on generated libraries, is in the PR of META-19; this
 * checks the generator's output without running the slow tools on it.
 *
 * Run: yarn eco-lib:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '../..');
const generator = require(path.join(ROOT, 'tools/generators/eco-lib/generator.cjs'));
const { FsTree } = require('nx/src/generators/tree');

const failures = [];

/**
 * Records a check.
 * @param {string} name The case name.
 * @param {boolean} passed Whether it passed.
 * @param {string} [detail] What was found instead.
 */
function check(name, passed, detail = '') {
  if (passed) console.log(`✓ ${name}`);
  else failures.push(`${name}${detail ? `: ${detail}` : ''}`);
}

/**
 * Runs the generator on the workspace in memory.
 * @param {object} options The generator options.
 * @returns {Promise<{ tree: FsTree, error: Error | null }>} The tree and the error, if any.
 */
async function generate(options) {
  const tree = new FsTree(ROOT, false);
  try {
    await generator(tree, options);

    return { tree, error: null };
  } catch (error) {
    return { tree, error };
  }
}

const NAMES = [
  [
    { app: 'eco-admin', domain: 'auth', type: 'feature', name: 'login' },
    ['libs/eco-admin/auth/feature/login', 'eco-admin-auth-login', '@plastik/eco-admin/auth/login'],
  ],
  [
    { app: 'eco-admin', domain: 'auth', type: 'data-access' },
    [
      'libs/eco-admin/auth/data-access',
      'eco-admin-auth-data-access',
      '@plastik/eco-admin/auth/data-access',
    ],
  ],
  [
    { app: 'eco-admin', domain: 'core', type: 'entity', name: 'entities' },
    ['libs/eco-admin/core/entities', 'eco-admin-entities', '@plastik/eco-admin/entities'],
  ],
  [
    { app: 'eco-store', domain: 'orders', type: 'ui', name: 'order-card' },
    [
      'libs/eco-store/orders/ui/order-card',
      'eco-store-orders-order-card',
      '@plastik/eco-store/orders/order-card',
    ],
  ],
  [
    { app: 'eco', type: 'entity', name: 'entities' },
    ['libs/eco/entities', 'eco-entities', '@plastik/eco/entities'],
  ],
  [
    { app: 'eco-store', domain: ' cart ', type: 'data-access', name: '' },
    [
      'libs/eco-store/cart/data-access',
      'eco-store-cart-data-access',
      '@plastik/eco-store/cart/data-access',
    ],
  ],
];

const REFUSED = [
  [{ app: 'llecoop', domain: 'x', type: 'ui', name: 'y' }, /--app must be one of/],
  [{ app: 'eco-store', domain: 'x', type: 'service', name: 'y' }, /--type must be one of/],
  [{ app: 'eco-admin', type: 'ui', name: 'y' }, /needs --domain/],
  [{ app: 'eco-admin', domain: 'core', type: 'util' }, /--domain core needs --name/],
  [{ app: 'eco', domain: 'x', type: 'ui', name: 'y' }, /has no domain folders/],
  [{ app: 'eco', type: 'ui' }, /--app eco needs --name/],
  [{ app: 'eco-store', domain: 'Orders', type: 'ui', name: 'y' }, /--domain must be kebab-case/],
  [
    { app: 'eco-store', domain: 'orders', type: 'ui', name: 'order_card' },
    /--name must be kebab-case/,
  ],
];

for (const [options, [directory, projectName, importPath]] of NAMES) {
  const lib = generator.normalizeOptions(options);
  const found = [lib.directory, lib.projectName, lib.importPath];
  check(
    `names: ${JSON.stringify(options)}`,
    JSON.stringify(found) === JSON.stringify([directory, projectName, importPath]),
    found.join(' | ')
  );
}
for (const [options, message] of REFUSED) {
  let error = null;
  try {
    generator.normalizeOptions(options);
  } catch (caught) {
    error = caught;
  }
  check(
    `refused: ${JSON.stringify(options)}`,
    message.test(error?.message ?? ''),
    error?.message ?? 'no error'
  );
}

const feature = await generate({
  app: 'eco-admin',
  domain: 'probe',
  type: 'feature',
  name: 'demo',
});
const dir = 'libs/eco-admin/probe/feature/demo';
if (feature.error) failures.push(`feature generation: ${feature.error.message}`);
else {
  const { tree } = feature;
  const changes = tree.listChanges();
  const outside = changes.filter(change => !change.path.startsWith(`${dir}/`));
  check(
    'only tsconfig.base.json changes outside the library (.gitignore, eslint.config.mjs and nx.json put back)',
    outside.length === 1 &&
      outside[0].path === 'tsconfig.base.json' &&
      outside[0].type === 'UPDATE',
    outside.map(change => `${change.type} ${change.path}`).join(', ')
  );
  const paths = JSON.parse(tree.read('tsconfig.base.json', 'utf-8')).compilerOptions.paths;
  check(
    'the alias has no ./ prefix',
    JSON.stringify(paths['@plastik/eco-admin/probe/demo']) ===
      JSON.stringify([`${dir}/src/index.ts`]),
    JSON.stringify(paths['@plastik/eco-admin/probe/demo'])
  );
  const files = changes
    .filter(change => change.type === 'CREATE')
    .map(change => change.path.slice(dir.length + 1))
    .sort();
  const expected = [
    'README.md',
    'eslint.config.mjs',
    'project.json',
    'src/eco-admin-probe-demo.component.html',
    'src/eco-admin-probe-demo.component.spec.ts',
    'src/eco-admin-probe-demo.component.ts',
    'src/eco-admin-probe-demo.routes.ts',
    'src/index.ts',
    'src/setup-vitest.d.ts',
    'src/test-setup.ts',
    'tsconfig.json',
    'tsconfig.lib.json',
    'tsconfig.spec.json',
    'vite.config.mts',
  ];
  check(
    'a feature library has its files flat in src/',
    JSON.stringify(files) === JSON.stringify(expected),
    files.join(', ')
  );
  const project = JSON.parse(tree.read(`${dir}/project.json`, 'utf-8'));
  check(
    'project.json: name, both tags, prefix and no targets (Nx infers lint and test)',
    project.name === 'eco-admin-probe-demo' &&
      JSON.stringify(project.tags) === JSON.stringify(['scope:eco-admin', 'type:feature']) &&
      project.prefix === 'eco-admin' &&
      Object.keys(project.targets ?? {}).length === 0,
    JSON.stringify(project)
  );
  const vite = tree.read(`${dir}/vite.config.mts`, 'utf-8');
  check(
    'vite.config.mts: angular({ tsconfig }), the root vitest-setup.ts and the json-summary coverage',
    vite.includes("angular({ tsconfig: 'tsconfig.spec.json' })") &&
      vite.includes("'../../../../../vitest-setup.ts'") &&
      vite.includes("reporter: ['text', 'json-summary']") &&
      vite.includes("reportsDirectory: '../../../../../coverage/libs/eco-admin/probe/feature/demo'")
  );
  const eslint = tree.read(`${dir}/eslint.config.mjs`, 'utf-8');
  check(
    'eslint.config.mjs: the root config first, the app prefix on selectors',
    /export default \[\s*\.\.\.baseConfig,/.test(eslint) &&
      eslint.includes("prefix: 'eco-admin'") &&
      eslint.includes("prefix: 'ecoAdmin'")
  );
  const component = tree.read(`${dir}/src/eco-admin-probe-demo.component.ts`, 'utf-8');
  check(
    'the component: selector without a doubled prefix, OnPush',
    component.includes("selector: 'eco-admin-probe-demo'") &&
      component.includes('ChangeDetectionStrategy.OnPush')
  );
  check(
    'index.ts exports the component and the routes',
    tree.read(`${dir}/src/index.ts`, 'utf-8').includes('ecoAdminProbeDemoRoutes')
  );
}

const ui = await generate({ app: 'eco-store', domain: 'probe', type: 'ui', name: 'card' });
if (ui.error) failures.push(`ui generation: ${ui.error.message}`);
else {
  const base = 'libs/eco-store/probe/ui/card';
  const eslint = ui.tree.read(`${base}/eslint.config.mjs`, 'utf-8');
  check(
    'a ui library: a component, no routes, the eco prefix',
    ui.tree.exists(`${base}/src/eco-store-probe-card.component.ts`) &&
      !ui.tree.exists(`${base}/src/eco-store-probe-card.routes.ts`) &&
      eslint.includes("prefix: 'eco'") &&
      !eslint.includes("prefix: 'eco-store'")
  );
}

const empty = await generate({
  app: 'eco-store',
  domain: 'core',
  type: 'data-access',
  name: 'probe-state',
});
if (empty.error) failures.push(`data-access generation: ${empty.error.message}`);
else {
  const base = 'libs/eco-store/core/probe-state';
  const created = empty.tree
    .listChanges()
    .filter(change => change.type === 'CREATE' && change.path.startsWith(`${base}/src/`))
    .map(change => change.path.slice(base.length + 1))
    .sort();
  check(
    'a data-access library: only index.ts and test-setup.ts, with a placeholder export',
    JSON.stringify(created) === JSON.stringify(['src/index.ts', 'src/test-setup.ts']) &&
      empty.tree.read(`${base}/src/index.ts`, 'utf-8').includes('EcoStoreProbeStatePlaceholder'),
    created.join(', ')
  );
}

const existing = await generate({
  app: 'eco-admin',
  domain: 'auth',
  type: 'feature',
  name: 'login',
});
check(
  'an existing folder stops it before writing',
  /already exists/.test(existing.error?.message ?? '') && existing.tree.listChanges().length === 0,
  existing.error?.message ?? 'no error'
);
// A new folder whose project name another library has (eco-store's auth libraries use the full path).
const project = await generate({
  app: 'eco-store',
  domain: 'auth',
  type: 'feature',
  name: 'feature-login',
});
check(
  'an existing project name stops it before writing',
  /project named eco-store-auth-feature-login already exists/.test(project.error?.message ?? '') &&
    project.tree.listChanges().length === 0,
  project.error?.message ?? 'no error'
);
// A new folder and project name whose alias another library has (products/feature/detail).
const alias = await generate({
  app: 'eco-store',
  domain: 'core',
  type: 'feature',
  name: 'product',
});
check(
  'an existing alias stops it before writing',
  /alias @plastik\/eco-store\/product already exists/.test(alias.error?.message ?? '') &&
    alias.tree.listChanges().length === 0,
  alias.error?.message ?? 'no error'
);

if (failures.length > 0) {
  console.error(
    `\n✗ eco-lib generator tests: ${failures.length} failed\n- ${failures.join('\n- ')}`
  );
  process.exitCode = 1;
} else {
  console.log('\n✓ eco-lib generator tests passed');
}
