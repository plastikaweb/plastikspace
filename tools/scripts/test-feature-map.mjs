#!/usr/bin/env node
/**
 * META-20: tests tools/scripts/feature-map.cjs.
 *
 * - A fixture workspace in a temp folder with every route shape the script follows: an alias
 *   with `./`, `export *` and a renamed re-export, a default import, `export default` and a
 *   default export assignment, `loadComponent` with and without `.then`, a spread array,
 *   children with `''`, `**` and none, a named outlet, inherited guards and titles, relative and
 *   absolute redirects. The whole map is compared with the expected one.
 * - What must stop it (exit 2): a guard in neither table, an alias or a file it cannot resolve,
 *   an unknown argument. What `--check` reports (exit 1): a missing map, a changed route, an
 *   added and a removed page. What `--find` prints: the pages matching every word, or the list.
 * - The real tree: every page points at a file that declares its component, inside a project,
 *   with specs that exist, one page per path, and the pages the skill relies on.
 *
 * Run: yarn feature-map:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '../..');
const SCRIPT = path.join(ROOT, 'tools/scripts/feature-map.cjs');
const { buildMap } = require(SCRIPT);

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

const FIXTURE = {
  'tsconfig.base.json': JSON.stringify({
    compilerOptions: {
      paths: {
        '@fx/shop': ['libs/shop/src/index.ts'],
        '@fx/auth': ['./libs/auth/src/index.ts'],
      },
    },
  }),
  'apps/eco-store/project.json': '{ "name": "eco-store" }',
  'apps/eco-store/src/app/pages.ts': `export class ProfileShellComponent {}
export class ProfileComponent {}
export class ParentComponent {}
export class ChildComponent {}
`,
  'apps/eco-store/src/app/app.routes.ts': `import { Route } from '@angular/router';
import { ecoStoreAuthGuard, emptyCartGuard, pocketBaseIsNotLoggedGuard } from '@plastik/elsewhere';
import { ChildComponent, ParentComponent, ProfileComponent, ProfileShellComponent } from './pages';

export const appRoutes: Route[] = [
  {
    path: 'accedir',
    canActivate: [pocketBaseIsNotLoggedGuard],
    loadChildren: () => import('@fx/auth').then(m => m.loginRoutes),
  },
  {
    path: 'botiga',
    title: 'shop.title',
    canActivate: [emptyCartGuard],
    loadChildren: () => import('@fx/shop').then(m => m.shopRoutes),
  },
  {
    path: 'perfil',
    component: ProfileShellComponent,
    canActivateChild: [ecoStoreAuthGuard],
    children: [
      { path: 'dades', component: ProfileComponent },
      { path: '**', redirectTo: 'dades' },
    ],
  },
  { path: 'vell', redirectTo: '/botiga' },
  { path: 'pare', component: ParentComponent, children: [{ path: 'fill', component: ChildComponent }] },
];
`,
  'apps/eco-admin/project.json': '{ "name": "eco-admin" }',
  'apps/eco-admin/src/app/home.component.ts': 'export class HomeComponent {}\n',
  'apps/eco-admin/src/app/app.routes.ts': `import { ecoAdminSessionGuard, ecoAdminTenantContextGuard } from '@plastik/elsewhere';
import { HomeComponent } from './home.component';

export const appRoutes = [
  { path: '', canActivate: [ecoAdminSessionGuard, ecoAdminTenantContextGuard], component: HomeComponent },
  { path: '**', redirectTo: '' },
];
`,
  'libs/shop/project.json': '{ "name": "fx-shop" }',
  'libs/shop/src/index.ts': "export * from './lib/shop.routes';\n",
  'libs/shop/src/lib/shop.routes.ts': `import { Routes } from '@angular/router';
import { ShopComponent } from './shop.component';

const extra: Routes = [{ path: 'extra', loadComponent: () => import('./extra.component') }];

export const shopRoutes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      { path: '', loadComponent: () => import('./list.component').then(m => m.ListComponent) },
      {
        path: '',
        outlet: 'sidenav',
        loadComponent: () => import('./side.component').then(m => m.SideComponent),
      },
      {
        path: ':slug',
        title: () => 'x',
        loadComponent: () => import('./detail.component').then(m => m.DetailComponent),
      },
      ...extra,
    ],
  },
];
`,
  'libs/shop/src/lib/shop.component.ts': 'export class ShopComponent {}\n',
  'libs/shop/src/lib/list.component.ts': 'export class ListComponent {}\n',
  'libs/shop/src/lib/list.component.spec.ts': '\n',
  'libs/shop/src/lib/side.component.ts': 'export class SideComponent {}\n',
  'libs/shop/src/lib/detail.component.ts': 'export class DetailComponent {}\n',
  'libs/shop/src/lib/extra.component.ts': 'export default class ExtraComponent {}\n',
  'libs/auth/project.json': '{ "name": "fx-auth" }',
  'libs/auth/src/index.ts': "export { authRoutes as loginRoutes } from './routes';\n",
  'libs/auth/src/routes.ts': `import LoginComponent from './login/login.component';

export const authRoutes = [{ path: '', component: LoginComponent }];
`,
  'libs/auth/src/login/login.component.ts':
    'class LoginComponent {}\nexport default LoginComponent;\n',
  'libs/auth/src/login/login.component.spec.ts': '\n',
  'libs/auth/src/login/auth.facade.spec.ts': '\n',
};

const SIDENAV = { sidenav: 'SideComponent' };
const SHOP = 'libs/shop/src/lib';
const CART = 'a cart with products (else /botiga)';
const EXPECTED = {
  'eco-store': {
    pages: [
      [
        '/accedir',
        'LoginComponent',
        'fx-auth',
        'anonymous',
        null,
        [],
        [],
        {},
        ['libs/auth/src/login/login.component.spec.ts', 'libs/auth/src/login/auth.facade.spec.ts'],
      ],
      [
        '/botiga',
        'ListComponent',
        'fx-shop',
        'public',
        'shop.title',
        [CART],
        ['ShopComponent'],
        SIDENAV,
        [`${SHOP}/list.component.spec.ts`],
      ],
      [
        '/botiga/:slug',
        'DetailComponent',
        'fx-shop',
        'public',
        '(dynamic)',
        [CART],
        ['ShopComponent'],
        SIDENAV,
        [`${SHOP}/list.component.spec.ts`],
      ],
      [
        '/botiga/extra',
        'ExtraComponent',
        'fx-shop',
        'public',
        'shop.title',
        [CART],
        ['ShopComponent'],
        SIDENAV,
        [`${SHOP}/list.component.spec.ts`],
      ],
      [
        '/perfil/dades',
        'ProfileComponent',
        'eco-store',
        'signed-in',
        null,
        [],
        ['ProfileShellComponent'],
        {},
        [],
      ],
      ['/pare', 'ParentComponent', 'eco-store', 'public', null, [], [], {}, []],
      [
        '/pare/fill',
        'ChildComponent',
        'eco-store',
        'public',
        null,
        [],
        ['ParentComponent'],
        {},
        [],
      ],
    ],
    redirects: [
      { path: '/perfil/**', to: '/perfil/dades' },
      { path: '/vell', to: '/botiga' },
    ],
  },
  'eco-admin': {
    pages: [['/', 'HomeComponent', 'eco-admin', 'signed-in', null, [], [], {}, []]],
    redirects: [{ path: '/**', to: '/' }],
  },
};

/**
 * Writes the fixture workspace, with changes, in a new temp folder under git.
 * @param {Record<string, string>} [changes] File → [from, to] replacements, or new content.
 * @returns {string} The folder.
 */
function fixture(changes = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'feature-map-'));
  for (const [file, content] of Object.entries(FIXTURE)) {
    let text = content;
    const change = changes[file];
    if (Array.isArray(change)) {
      if (!text.includes(change[0])) throw new Error(`fixture ${file} has no '${change[0]}'`);
      text = text.replace(change[0], change[1]);
    }
    fs.mkdirSync(path.join(dir, path.dirname(file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), text);
  }
  execFileSync('git', ['init', '-q'], { cwd: dir });

  return dir;
}

/**
 * Runs the script on a folder.
 * @param {string} dir The workspace.
 * @param {string[]} [args] Extra arguments.
 * @returns {{ status: number, out: string }} Exit code and output.
 */
function run(dir, args = []) {
  const result = spawnSync(process.execPath, [SCRIPT, '--root', dir, ...args], {
    encoding: 'utf8',
  });

  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

/**
 * Keeps the fields the expectations name.
 * @param {object} page A page of the map.
 * @returns {Array} The projection.
 */
function project(page) {
  return [
    page.path,
    page.component,
    page.project,
    page.access,
    page.title,
    page.needs,
    page.layout,
    page.outlets,
    page.specs,
  ];
}

const dirs = [];
try {
  const base = fixture();
  dirs.push(base);
  const missing = run(base, ['--check']);
  check(
    '--check without a map: exit 1, says it does not exist',
    missing.status === 1 && /does not exist/.test(missing.out),
    `${missing.status} ${missing.out}`
  );
  const written = run(base);
  check('writes the map', written.status === 0 && /8 pages written/.test(written.out), written.out);
  if (written.status !== 0) throw new Error(`the fixture map was not written: ${written.out}`);
  const map = JSON.parse(fs.readFileSync(path.join(base, 'tools/feature-map.json'), 'utf8'));
  for (const [app, expected] of Object.entries(EXPECTED)) {
    const found = map.apps[app];
    const pages = found.pages.map(project);
    check(
      `${app}: the pages, with component, project, access, title, needs, layout, outlets and specs`,
      JSON.stringify(pages) === JSON.stringify(expected.pages),
      `\n${pages.map(page => JSON.stringify(page)).join('\n')}`
    );
    check(
      `${app}: the redirects, targets made absolute`,
      JSON.stringify(found.redirects) === JSON.stringify(expected.redirects),
      JSON.stringify(found.redirects)
    );
  }
  const admin = map.apps['eco-admin'];
  check(
    'eco-admin: the session guard gives the roles; the app gives its dev URL and serve command',
    JSON.stringify(admin.pages[0].roles) === JSON.stringify(['TENANT_ADMIN', 'GLOBAL_ADMIN']) &&
      admin.devUrl === 'http://localhost:4204' &&
      admin.serve === 'yarn eco-admin:serve' &&
      map.apps['eco-store'].serve === 'yarn eco-store:serve',
    JSON.stringify(admin)
  );
  const store = map.apps['eco-store'].pages;
  check(
    'a page lists its file and the routes file it is declared in',
    store[0].file === 'libs/auth/src/login/login.component.ts' &&
      store[0].routes === 'libs/auth/src/routes.ts' &&
      store[3].file === `${SHOP}/extra.component.ts` &&
      store[3].routes === `${SHOP}/shop.routes.ts`,
    `${store[0].file} ${store[0].routes} ${store[3].file} ${store[3].routes}`
  );
  const clean = run(base, ['--check']);
  check('--check on a fresh map: exit 0', clean.status === 0, clean.out);

  const find = run(base, ['--find', 'BOTIGA', 'detail']);
  let found = [];
  try {
    found = JSON.parse(find.out);
  } catch {
    found = [];
  }
  check(
    '--find: every word must match, any case; the page comes with its app, full URL and serve command',
    find.status === 0 &&
      found.length === 1 &&
      found[0].app === 'eco-store' &&
      found[0].url === 'http://el-llevat.test:4200/botiga/:slug' &&
      found[0].serve === 'yarn eco-store:serve' &&
      found[0].component === 'DetailComponent',
    find.out
  );
  const none = run(base, ['--find', 'botiga', 'nowhere']);
  check(
    '--find with no match: exit 1, lists the pages',
    none.status === 1 &&
      /no page matches "botiga nowhere"/.test(none.out) &&
      none.out.includes('eco-admin / (HomeComponent)'),
    `${none.status} ${none.out}`
  );
  const empty = run(base, ['--find']);
  const both = run(base, ['--check', '--find', 'botiga']);
  check(
    '--find without words, or with --check: exit 2',
    empty.status === 2 && /needs at least one word/.test(empty.out) && both.status === 2,
    `${empty.status} ${empty.out} ${both.status} ${both.out}`
  );

  fs.writeFileSync(
    path.join(base, 'apps/eco-store/src/app/app.routes.ts'),
    FIXTURE['apps/eco-store/src/app/app.routes.ts']
      .replace("path: 'pare'", "path: 'mare'")
      .replace("title: 'shop.title'", "title: 'shop.other'")
  );
  const drift = run(base, ['--check']);
  check(
    '--check after a route changed: exit 1, lists the pages added, removed and changed',
    drift.status === 1 &&
      drift.out.includes('+ eco-store page /mare\n') &&
      drift.out.includes('- eco-store page /pare\n') &&
      drift.out.includes('- eco-store page /pare/fill\n') &&
      drift.out.includes('~ eco-store page /botiga/extra\n') &&
      !drift.out.includes('/perfil/dades'),
    `${drift.status} ${drift.out}`
  );

  const FATAL = [
    [
      'a guard in neither table',
      { 'apps/eco-store/src/app/app.routes.ts': ['[emptyCartGuard]', '[mysteryGuard]'] },
      /the guard mysteryGuard is in neither ACCESS_GUARDS nor CONDITION_GUARDS/,
    ],
    [
      'an alias that is not in tsconfig.base.json',
      { 'apps/eco-store/src/app/app.routes.ts': ["import('@fx/shop')", "import('@fx/nope')"] },
      /cannot find the routes 'shopRoutes' of '@fx\/nope'/,
    ],
    [
      'a relative import with no file',
      {
        'libs/shop/src/lib/shop.routes.ts': [
          "import('./detail.component')",
          "import('./gone.component')",
        ],
      },
      /shop\.routes\.ts: cannot resolve '\.\/gone\.component'/,
    ],
    [
      'an export the module does not have',
      { 'libs/auth/src/index.ts': ['as loginRoutes', 'as signInRoutes'] },
      /cannot find the routes 'loginRoutes' of '@fx\/auth'/,
    ],
    [
      'a matcher instead of a path',
      { 'apps/eco-store/src/app/app.routes.ts': ["path: 'vell',", 'matcher: () => null,'] },
      /a matcher the map cannot read/,
    ],
    [
      'a named outlet with a path',
      {
        'libs/shop/src/lib/shop.routes.ts': [
          "path: '',\n        outlet",
          "path: 'side',\n        outlet",
        ],
      },
      /an outlet route the map cannot place/,
    ],
  ];
  for (const [name, changes, message] of FATAL) {
    const dir = fixture(changes);
    dirs.push(dir);
    const result = run(dir);
    check(
      `stops on ${name}: exit 2, writes nothing`,
      result.status === 2 &&
        message.test(result.out) &&
        !fs.existsSync(path.join(dir, 'tools/feature-map.json')),
      `${result.status} ${result.out}`
    );
  }
  const usage = run(base, ['--frobnicate']);
  check(
    'an unknown argument: exit 2',
    usage.status === 2 && /Unknown argument/.test(usage.out),
    usage.out
  );
} finally {
  for (const dir of dirs) fs.rmSync(dir, { recursive: true, force: true });
}

const real = buildMap(ROOT);
const problems = [];
for (const [app, entry] of Object.entries(real.apps)) {
  const seen = new Set();
  for (const page of entry.pages) {
    if (seen.has(page.path)) problems.push(`${app} ${page.path}: two pages`);
    seen.add(page.path);
    const source = fs.readFileSync(path.join(ROOT, page.file), 'utf8');
    if (!new RegExp(`class ${page.component}\\b`).test(source))
      problems.push(`${app} ${page.path}: ${page.file} does not declare ${page.component}`);
    if (!page.project) problems.push(`${app} ${page.path}: no project`);
    for (const spec of page.specs)
      if (!fs.existsSync(path.join(ROOT, spec))) problems.push(`${app} ${page.path}: no ${spec}`);
  }
}
check(
  'the real tree: one page per path, each file declares its component, projects and specs exist',
  problems.length === 0,
  problems.join('; ')
);
const storePage = pagePath => real.apps['eco-store'].pages.find(page => page.path === pagePath);
check(
  'the real tree: the pages the skill relies on',
  storePage('/perfil/dades-personals')?.access === 'signed-in' &&
    storePage('/perfil/dades-personals')?.outlets.sidenav ===
      'EcoStoreProfileSidenavFeatureComponent' &&
    storePage('/cistella/enviament')?.access === 'signed-in' &&
    storePage('/botiga')?.access === 'public' &&
    !storePage('/') &&
    !storePage('/perfil'),
  JSON.stringify(real.apps['eco-store'].pages.map(page => [page.path, page.access]))
);
const adminPage = pagePath => real.apps['eco-admin'].pages.find(page => page.path === pagePath);
check(
  'the real tree: each eco-admin section names the one role its guard lets in',
  JSON.stringify(adminPage('/tauler')?.roles) === JSON.stringify(['TENANT_ADMIN']) &&
    JSON.stringify(adminPage('/cooperatives')?.roles) === JSON.stringify(['GLOBAL_ADMIN']) &&
    adminPage('/accedir')?.access === 'anonymous',
  JSON.stringify(real.apps['eco-admin'].pages.map(page => [page.path, page.access, page.roles]))
);

if (failures.length > 0) {
  console.error(`\n✗ feature-map tests: ${failures.length} failed\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('\n✓ feature-map tests passed');
}
