#!/usr/bin/env node
/**
 * META-20 — the feature map of the eco apps: which page answers at which URL, who may open it,
 * and where its code and spec are. Generated from the route tables, never written by hand.
 *
 * From `appRoutes` of apps/eco-store and apps/eco-admin it follows every `children`,
 * `loadChildren` and `loadComponent` with the TypeScript parser (aliases from
 * tsconfig.base.json, relative imports, re-exports). Per page:
 *   - path: the URL path, `:params` included;
 *   - title: the translation key of the deepest route title, or `(dynamic)`;
 *   - access: `signed-in`, `anonymous` (only without a session) or `public`, from ACCESS_GUARDS;
 *     roles, when the guard asks for some;
 *   - needs: what else it takes to open it (a cart with products...), from CONDITION_GUARDS;
 *   - guards: every guard that runs on the way (canMatch, canActivate, canActivateChild of the
 *     parents, canDeactivate);
 *   - project, component, file, specs (the specs in the component's folder, its own first),
 *     routes (the file of the route), layout (the components it renders inside), outlets (the
 *     named outlets beside it, such as the sidenav).
 * Redirects are listed apart, their target as an absolute path. Each app gives its dev URL and
 * the command that serves it.
 *
 * A route the script cannot follow (an import it cannot resolve, a shape it does not know) or a
 * guard in neither table stops it with exit 2 instead of leaving the map wrong.
 *
 * Usage:
 *   node tools/scripts/feature-map.cjs            write tools/feature-map.json (yarn feature-map)
 *   node tools/scripts/feature-map.cjs --check    fail when it is out of date (yarn feature-map:check)
 *   node tools/scripts/feature-map.cjs --find <words...>
 *       print the pages whose app, path, title, component, project or file contain every word,
 *       with their full URL, from the routes as they are now (yarn feature-map:find avatar)
 *   [--root <dir>]
 *
 * Exit codes: 0 written, up to date or found; 1 out of date (--check) or no page found (--find);
 * 2 usage, IO or parse error.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const OUT = 'tools/feature-map.json';
const APPS = [
  {
    name: 'eco-store',
    routes: 'apps/eco-store/src/app/app.routes.ts',
    devUrl: 'http://el-llevat.test:4200',
    // Not eco-store:local, which stops any PocketBase and whatever holds port 4200.
    serve: 'yarn eco-store:serve',
  },
  {
    name: 'eco-admin',
    routes: 'apps/eco-admin/src/app/app.routes.ts',
    devUrl: 'http://localhost:4204',
    serve: 'yarn eco-admin:serve',
  },
];
const ROUTES_EXPORT = 'appRoutes';
// Every guard on a route is in one of these two tables, or the script stops: a new guard has to
// say what it asks for before the map can call a page public.
// Who may open a page.
const ACCESS_GUARDS = {
  ecoStoreAuthGuard: { access: 'signed-in' },
  // An anonymous visitor gets a dialog: sign in, or back to /cistella/resum.
  ecoStoreNotLoggedShippingGuard: { access: 'signed-in' },
  pocketBaseIsNotLoggedGuard: { access: 'anonymous' },
  ecoAdminSessionGuard: { access: 'signed-in', roles: ['TENANT_ADMIN', 'GLOBAL_ADMIN'] },
  ecoAdminAnonymousGuard: { access: 'anonymous' },
  // The section guards of the eco-admin shell: under ecoAdminSessionGuard, they narrow its roles.
  ecoAdminTenantRoleGuard: { access: 'signed-in', roles: ['TENANT_ADMIN'] },
  ecoAdminPlatformRoleGuard: { access: 'signed-in', roles: ['GLOBAL_ADMIN'] },
};
// What else the page needs to open (`needs`), or null for a guard that never keeps anyone out.
const CONDITION_GUARDS = {
  emptyCartGuard: 'a cart with products (else /botiga)',
  shippingAvailableGuard: 'a tenant that ships (else /cistella/pendent)',
  shippingUnavailableGuard: 'a tenant that does not ship (else /cistella/resum)',
  isStoreOpenGuard: 'the store open for orders now (else /cistella/resum)',
  shippingInfoGuard: 'the shipping step filled in (else /cistella/enviament)',
  ecoStoreTrialExpiredGuard:
    'a trial that has not expired (else a dialog, then /perfil or /botiga)',
  ecoStoreFiscalDataCanMatchGuard:
    'a tenant with fiscal data enabled (else the URL does not match: /perfil/dades-personals)',
  ecoStoreProductCanDeactivateGuard: null,
  ecoStoreProfileAddressesCanDeactivateGuard: null,
  ecoAdminTenantContextGuard: null,
};
const GUARD_KEYS = ['canMatch', 'canActivate', 'canDeactivate'];
const DYNAMIC = '(dynamic)';

class FatalError extends Error {}

/**
 * Parses the command line.
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ check: boolean, find: string[] | null, root: string, help: boolean }} The options.
 */
function parseArgs(argv) {
  const opts = { check: false, find: null, root: REPO_ROOT, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--check') opts.check = true;
    else if (arg === '--find') {
      opts.find = [];
      while (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--'))
        opts.find.push(...argv[++i].toLowerCase().split(/\s+/).filter(Boolean));
      if (opts.find.length === 0) throw new FatalError('--find needs at least one word');
    } else if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--root') {
      const value = argv[++i];
      if (value === undefined || value.startsWith('--'))
        throw new FatalError('--root needs a value');
      opts.root = path.resolve(value);
    } else throw new FatalError(`Unknown argument: ${arg}`);
  }

  return opts;
}

/**
 * Reads the workspace facts the map needs: aliases and project roots.
 * @param {string} root Workspace root.
 * @returns {{ root: string, aliases: Record<string, string>, projects: { root: string, name: string }[], sources: Map<string, ts.SourceFile> }} The context.
 */
function workspace(root) {
  let tsconfig;
  try {
    tsconfig = JSON.parse(fs.readFileSync(path.join(root, 'tsconfig.base.json'), 'utf8'));
  } catch (error) {
    throw new FatalError(`tsconfig.base.json: ${error.message}`);
  }
  const aliases = Object.fromEntries(
    Object.entries(tsconfig.compilerOptions?.paths ?? {}).map(([alias, [target]]) => [
      alias,
      target.replace(/^\.\//, ''),
    ])
  );
  let listed;
  try {
    listed = execFileSync(
      'git',
      ['ls-files', '-co', '--exclude-standard', '-z', '--', 'apps', 'libs'],
      {
        cwd: root,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
  } catch (error) {
    throw new FatalError(
      `git ls-files failed in ${root}: ${String(error.stderr || error.message).trim()}`
    );
  }
  const projects = listed
    .split('\0')
    .filter(file => path.posix.basename(file) === 'project.json')
    .filter(file => fs.existsSync(path.join(root, file)))
    .map(file => ({
      root: `${path.posix.dirname(file)}/`,
      name: JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')).name,
    }))
    .sort((left, right) => right.root.length - left.root.length);

  return { root, aliases, projects, sources: new Map() };
}

/**
 * Parses a file once.
 * @param {object} ctx The context.
 * @param {string} file Path relative to the root.
 * @returns {ts.SourceFile} Its syntax tree.
 */
function sourceOf(ctx, file) {
  if (!ctx.sources.has(file)) {
    const abs = path.join(ctx.root, file);
    if (!fs.existsSync(abs)) throw new FatalError(`${file}: no such file`);
    ctx.sources.set(
      file,
      ts.createSourceFile(file, fs.readFileSync(abs, 'utf8'), ts.ScriptTarget.Latest, true)
    );
  }

  return ctx.sources.get(file);
}

/**
 * Resolves an import specifier to a workspace file.
 * @param {object} ctx The context.
 * @param {string} from The importing file.
 * @param {string} specifier The module specifier.
 * @returns {string | null} The file, or null for a package outside the workspace.
 */
function resolveModule(ctx, from, specifier) {
  let candidates;
  if (specifier.startsWith('.')) {
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier));
    candidates = [`${base}.ts`, `${base}/index.ts`, base];
  } else if (Object.hasOwn(ctx.aliases, specifier)) candidates = [ctx.aliases[specifier]];
  else return null;
  const found = candidates.find(
    file => fs.existsSync(path.join(ctx.root, file)) && file.endsWith('.ts')
  );
  if (!found) throw new FatalError(`${from}: cannot resolve '${specifier}'`);

  return found;
}

/**
 * Tells whether a statement carries a modifier.
 * @param {ts.Node} node The statement.
 * @param {ts.SyntaxKind} kind The modifier.
 * @returns {boolean} True when it has it.
 */
function hasModifier(node, kind) {
  return (ts.canHaveModifiers(node) ? (ts.getModifiers(node) ?? []) : []).some(
    m => m.kind === kind
  );
}

/**
 * Finds where a name a module exposes, or a file declares or imports, is declared.
 * @param {object} ctx The context.
 * @param {string} file The module.
 * @param {string} name The name, or `default`.
 * @param {Set<string>} [seen] Modules already visited for this name.
 * @returns {{ file: string, node: ts.Node, name: string } | null} The declaration, or null.
 */
function findDeclaration(ctx, file, name, seen = new Set()) {
  const key = `${file}#${name}`;
  if (seen.has(key)) return null;
  seen.add(key);
  const sf = sourceOf(ctx, file);
  const follow = (specifier, target) => {
    const module = resolveModule(ctx, file, specifier);

    return module === null ? null : findDeclaration(ctx, module, target, seen);
  };
  for (const statement of sf.statements) {
    if (ts.isVariableStatement(statement) && name !== 'default') {
      const declaration = statement.declarationList.declarations.find(
        d => ts.isIdentifier(d.name) && d.name.text === name
      );
      if (declaration) return { file, node: declaration, name };
    }
    if (
      (ts.isClassDeclaration(statement) || ts.isFunctionDeclaration(statement)) &&
      statement.name
    ) {
      const isDefault =
        hasModifier(statement, ts.SyntaxKind.ExportKeyword) &&
        hasModifier(statement, ts.SyntaxKind.DefaultKeyword);
      if (statement.name.text === name || (name === 'default' && isDefault))
        return { file, node: statement, name: statement.name.text };
    }
    if (
      ts.isExportAssignment(statement) &&
      name === 'default' &&
      ts.isIdentifier(statement.expression)
    )
      return findDeclaration(ctx, file, statement.expression.text, seen);
    if (ts.isImportDeclaration(statement) && statement.importClause) {
      const specifier = statement.moduleSpecifier.text;
      const clause = statement.importClause;
      if (clause.name?.text === name) return follow(specifier, 'default');
      if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        const element = clause.namedBindings.elements.find(e => e.name.text === name);
        if (element) return follow(specifier, (element.propertyName ?? element.name).text);
      }
    }
  }
  for (const statement of sf.statements) {
    if (!ts.isExportDeclaration(statement)) continue;
    const specifier = statement.moduleSpecifier?.text;
    if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      const element = statement.exportClause.elements.find(e => e.name.text === name);
      if (!element) continue;
      const target = (element.propertyName ?? element.name).text;

      return specifier ? follow(specifier, target) : findDeclaration(ctx, file, target, seen);
    }
    if (!statement.exportClause && specifier) {
      const found = follow(specifier, name);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Strips `as`, `satisfies` and parentheses.
 * @param {ts.Expression} node An expression.
 * @returns {ts.Expression} The expression inside.
 */
function unwrap(node) {
  let current = node;
  while (
    current &&
    (ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isParenthesizedExpression(current))
  )
    current = current.expression;

  return current;
}

/**
 * Reads the text of a string literal.
 * @param {ts.Node | undefined} node A node.
 * @returns {string | undefined} Its text, or undefined when it is not a literal.
 */
function literal(node) {
  const value = node && unwrap(node);

  return value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))
    ? value.text
    : undefined;
}

/**
 * Describes where a node is, for errors.
 * @param {ts.Node} node A node.
 * @returns {string} `file:line`.
 */
function at(node) {
  const sf = node.getSourceFile();

  return `${sf.fileName}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;
}

/**
 * Reads a lazy import: `() => import('x').then(m => m.Y)`, or `() => import('x')` for a default export.
 * @param {ts.Expression} node The loader.
 * @returns {{ specifier: string, name: string }} What it imports.
 */
function lazyImport(node) {
  let specifier;
  let name = 'default';
  const visit = child => {
    if (ts.isCallExpression(child)) {
      if (child.expression.kind === ts.SyntaxKind.ImportKeyword)
        specifier ??= literal(child.arguments[0]);
      if (
        ts.isPropertyAccessExpression(child.expression) &&
        child.expression.name.text === 'then' &&
        child.arguments[0] &&
        ts.isArrowFunction(child.arguments[0])
      ) {
        const body = unwrap(child.arguments[0].body);
        if (ts.isPropertyAccessExpression(body)) name = body.name.text;
      }
    }
    ts.forEachChild(child, visit);
  };
  visit(node);
  if (!specifier) throw new FatalError(`${at(node)}: a loader without import('...')`);

  return { specifier, name };
}

/**
 * Resolves a routes array: an array literal, or an identifier declared elsewhere.
 * @param {object} ctx The context.
 * @param {string} file The file the expression is in.
 * @param {ts.Expression} expression The expression.
 * @returns {{ file: string, elements: ts.Expression[] }} The array's elements, spreads expanded.
 */
function routesArray(ctx, file, expression) {
  const node = unwrap(expression);
  if (ts.isIdentifier(node)) {
    const found = findDeclaration(ctx, file, node.text);
    if (!found || !ts.isVariableDeclaration(found.node) || !found.node.initializer)
      throw new FatalError(`${at(node)}: cannot find the routes '${node.text}'`);

    return routesArray(ctx, found.file, found.node.initializer);
  }
  if (!ts.isArrayLiteralExpression(node))
    throw new FatalError(`${at(node)}: routes that are not an array`);
  const elements = [];
  for (const element of node.elements) {
    if (ts.isSpreadElement(element)) {
      const spread = routesArray(ctx, file, element.expression);
      elements.push(...spread.elements);
    } else elements.push({ file, route: element });
  }

  return { file, elements };
}

/**
 * Reads the properties of a route literal.
 * @param {ts.Expression} node The route.
 * @returns {Map<string, ts.Expression>} Property name → value.
 */
function routeProperties(node) {
  const route = unwrap(node);
  if (!ts.isObjectLiteralExpression(route))
    throw new FatalError(`${at(node)}: a route that is not an object literal`);
  const props = new Map();
  for (const property of route.properties) {
    if (
      ts.isPropertyAssignment(property) &&
      (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
    )
      props.set(property.name.text, property.initializer);
    else if (ts.isMethodDeclaration(property) && ts.isIdentifier(property.name))
      props.set(property.name.text, property);
    else if (ts.isShorthandPropertyAssignment(property))
      props.set(property.name.text, property.name);
    else throw new FatalError(`${at(property)}: a route property the map cannot read`);
  }

  return props;
}

/**
 * Names the guards of a guard array.
 * @param {ts.Expression | undefined} node The array.
 * @returns {string[]} The guard names (`name(...)` for a factory call).
 */
function guardNames(node) {
  if (!node) return [];
  const array = unwrap(node);
  if (!ts.isArrayLiteralExpression(array))
    throw new FatalError(`${at(node)}: guards that are not an array`);

  return array.elements.map(element => {
    const value = unwrap(element);
    let name;
    if (ts.isIdentifier(value)) name = value.text;
    else if (ts.isCallExpression(value)) name = value.expression.getText();
    else throw new FatalError(`${at(element)}: a guard the map cannot name`);
    if (!Object.hasOwn(ACCESS_GUARDS, name) && !Object.hasOwn(CONDITION_GUARDS, name))
      throw new FatalError(
        `${at(element)}: the guard ${name} is in neither ACCESS_GUARDS nor CONDITION_GUARDS of tools/scripts/feature-map.cjs; add it with what it asks for`
      );

    return name;
  });
}

/**
 * Finds the project a file belongs to.
 * @param {object} ctx The context.
 * @param {string} file Path relative to the root.
 * @returns {string | null} The project name.
 */
function projectOf(ctx, file) {
  return ctx.projects.find(project => file.startsWith(project.root))?.name ?? null;
}

/**
 * Resolves the component a route renders.
 * @param {object} ctx The context.
 * @param {string} file The routes file.
 * @param {Map<string, ts.Expression>} props The route.
 * @returns {{ name: string, file: string } | null} The component, or null.
 */
function componentOf(ctx, file, props) {
  let found = null;
  let node = props.get('component');
  if (node) {
    node = unwrap(node);
    if (!ts.isIdentifier(node))
      throw new FatalError(`${at(node)}: a component that is not an identifier`);
    found = findDeclaration(ctx, file, node.text);
  } else if (props.has('loadComponent')) {
    node = props.get('loadComponent');
    const { specifier, name } = lazyImport(node);
    const module = resolveModule(ctx, file, specifier);
    found = module && findDeclaration(ctx, module, name);
  } else return null;
  if (!found) throw new FatalError(`${at(node)}: cannot find the component`);

  return { name: found.name, file: found.file };
}

/**
 * Resolves the child routes of a route.
 * @param {object} ctx The context.
 * @param {string} file The routes file.
 * @param {Map<string, ts.Expression>} props The route.
 * @returns {{ file: string, elements: object[] } | null} The children, or null.
 */
function childrenOf(ctx, file, props) {
  if (props.has('children')) return routesArray(ctx, file, props.get('children'));
  if (!props.has('loadChildren')) return null;
  const node = props.get('loadChildren');
  const { specifier, name } = lazyImport(node);
  const module = resolveModule(ctx, file, specifier);
  const found = module && findDeclaration(ctx, module, name);
  if (!found || !ts.isVariableDeclaration(found.node) || !found.node.initializer)
    throw new FatalError(`${at(node)}: cannot find the routes '${name}' of '${specifier}'`);

  return routesArray(ctx, found.file, found.node.initializer);
}

/**
 * Joins route paths into a URL path.
 * @param {string} prefix The parent path, without slashes at the ends.
 * @param {string} segment The route path.
 * @returns {string} The joined path.
 */
function join(prefix, segment) {
  return [prefix, segment].filter(Boolean).join('/');
}

/**
 * Lists the specs beside a component, its own first.
 * @param {object} ctx The context.
 * @param {string} file The component file.
 * @returns {string[]} The spec files of its folder.
 */
function specsOf(ctx, file) {
  const own = file.replace(/\.ts$/, '.spec.ts');
  const dir = path.posix.dirname(file);

  return fs
    .readdirSync(path.join(ctx.root, dir))
    .filter(name => name.endsWith('.spec.ts'))
    .map(name => `${dir}/${name}`)
    .sort((left, right) => (left === own ? -1 : right === own ? 1 : left.localeCompare(right)));
}

/**
 * Reads the outlet of a route: null for the primary one.
 * @param {Map<string, ts.Expression>} props The route.
 * @returns {string | null} The outlet name.
 */
function outletOf(props) {
  if (!props.has('outlet')) return null;
  const outlet = literal(props.get('outlet'));
  if (outlet === undefined)
    throw new FatalError(`${at(props.get('outlet'))}: an outlet that is not a literal`);

  return outlet === 'primary' ? null : outlet;
}

/**
 * Tells whether a route path matches an empty rest of the URL: a parent whose children have
 * one renders that child at its own URL, not itself alone.
 * @param {{ route: ts.Expression }} child A child route.
 * @returns {boolean} True for a primary `''` or `**` route.
 */
function matchesEmpty({ route }) {
  const props = routeProperties(route);
  const own = literal(props.get('path'));

  return outletOf(props) === null && (own === '' || own === '**');
}

/**
 * Walks a routes array, adding pages and redirects to the app's map.
 * @param {object} ctx The context.
 * @param {{ file: string, elements: object[] }} routes The routes.
 * @param {{ prefix: string, guards: string[], layout: string[], outlets: Record<string, string>, title: string | null }} inherited What the parents pass down.
 * @param {{ pages: object[], redirects: object[] }} out The app's map.
 */
function walk(ctx, routes, inherited, out) {
  const outlets = { ...inherited.outlets };
  const primary = [];
  // A named outlet on an empty path shows beside every page under its parent: the sidenavs.
  for (const element of routes.elements) {
    const props = routeProperties(element.route);
    const outlet = outletOf(props);
    if (outlet === null) {
      primary.push({ ...element, props });
      continue;
    }
    const component = componentOf(ctx, element.file, props);
    if (
      literal(props.get('path')) !== '' ||
      !component ||
      props.has('children') ||
      props.has('loadChildren')
    )
      throw new FatalError(
        `${at(element.route)}: an outlet route the map cannot place (only an empty path with a component)`
      );
    outlets[outlet] = component.name;
  }
  for (const { file, route, props } of primary) {
    const own = literal(props.get('path'));
    if (props.has('matcher')) throw new FatalError(`${at(route)}: a matcher the map cannot read`);
    if (props.has('path') && own === undefined)
      throw new FatalError(`${at(route)}: a path that is not a literal`);
    const full = join(inherited.prefix, own ?? '');
    const url = `/${full}`;
    if (props.has('redirectTo')) {
      const to = literal(props.get('redirectTo'));
      out.redirects.push({
        path: url,
        to: to === undefined ? DYNAMIC : to.startsWith('/') ? to : `/${join(inherited.prefix, to)}`,
      });
      continue;
    }
    const guards = [...inherited.guards, ...GUARD_KEYS.flatMap(key => guardNames(props.get(key)))];
    const title = props.has('title') ? (literal(props.get('title')) ?? DYNAMIC) : inherited.title;
    const component = componentOf(ctx, file, props);
    const children = childrenOf(ctx, file, props);
    if (!component && !children)
      throw new FatalError(`${at(route)}: a route with no component, children or redirect`);
    if (component && !children?.elements.some(matchesEmpty)) {
      // The outermost access guard says who may open the page; the innermost one that names
      // roles narrows them (a section guard under the shell's session guard).
      const accesses = guards.map(guard => ACCESS_GUARDS[guard]).filter(Boolean);
      const narrowest = accesses.filter(entry => entry.roles).at(-1);
      const access = accesses.length
        ? { ...accesses[0], ...(narrowest && { roles: narrowest.roles }) }
        : { access: 'public' };
      const unique = [...new Set(guards)];
      out.pages.push({
        path: url,
        title,
        ...access,
        needs: unique.map(guard => CONDITION_GUARDS[guard]).filter(Boolean),
        guards: unique,
        project: projectOf(ctx, component.file),
        component: component.name,
        file: component.file,
        specs: specsOf(ctx, component.file),
        routes: file,
        layout: inherited.layout,
        outlets,
      });
    }
    if (children) {
      walk(
        ctx,
        children,
        {
          prefix: full,
          guards: [...guards, ...guardNames(props.get('canActivateChild'))],
          layout: component ? [...inherited.layout, component.name] : inherited.layout,
          outlets,
          title,
        },
        out
      );
    }
  }
}

/**
 * Builds the map.
 * @param {string} root Workspace root.
 * @returns {object} The map.
 */
function buildMap(root) {
  const ctx = workspace(root);
  const apps = {};
  for (const app of APPS) {
    const found = findDeclaration(ctx, app.routes, ROUTES_EXPORT);
    if (!found || !ts.isVariableDeclaration(found.node) || !found.node.initializer)
      throw new FatalError(`${app.routes}: no '${ROUTES_EXPORT}'`);
    const out = { pages: [], redirects: [] };
    walk(
      ctx,
      routesArray(ctx, found.file, found.node.initializer),
      { prefix: '', guards: [], layout: [], outlets: {}, title: null },
      out
    );
    apps[app.name] = { devUrl: app.devUrl, serve: app.serve, routes: app.routes, ...out };
  }

  return {
    generatedBy:
      'tools/scripts/feature-map.cjs (yarn feature-map). Do not edit by hand: yarn feature-map:check fails on any difference.',
    apps,
  };
}

/**
 * Formats the map as Prettier would, so the pre-commit leaves the file alone.
 * @param {string} root Workspace root.
 * @param {object} map The map.
 * @returns {Promise<string>} The file content.
 */
async function render(root, map) {
  const prettier = require('prettier');
  const file = path.join(root, OUT);
  const config = (await prettier.resolveConfig(file)) ?? {};

  return prettier.format(JSON.stringify(map, null, 2), { ...config, filepath: file });
}

/**
 * Lists the pages and redirects that differ between two maps.
 * @param {object} before The committed map.
 * @param {object} after The generated map.
 * @returns {string[]} One line per difference.
 */
function differences(before, after) {
  const index = map =>
    new Map(
      Object.entries(map?.apps ?? {}).flatMap(([app, entry]) => [
        ...(entry.pages ?? []).map(page => [`${app} page ${page.path}`, JSON.stringify(page)]),
        ...(entry.redirects ?? []).map(r => [`${app} redirect ${r.path}`, JSON.stringify(r)]),
        [`${app} app`, JSON.stringify({ ...entry, pages: undefined, redirects: undefined })],
      ])
    );
  const old = index(before);
  const now = index(after);
  const lines = [];
  for (const [key, value] of now) {
    if (!old.has(key)) lines.push(`+ ${key}`);
    else if (old.get(key) !== value) lines.push(`~ ${key}`);
  }
  for (const key of old.keys()) if (!now.has(key)) lines.push(`- ${key}`);

  return lines;
}

/**
 * Finds the pages that contain every word.
 * @param {object} map The map.
 * @param {string[]} words Lowercase words.
 * @returns {object[]} The pages, each with its app and full URL first.
 */
function findPages(map, words) {
  return Object.entries(map.apps).flatMap(([app, entry]) =>
    entry.pages
      .filter(page => {
        const text = [app, page.path, page.title, page.component, page.project, page.file]
          .join(' ')
          .toLowerCase();

        return words.every(word => text.includes(word));
      })
      .map(page => ({ app, url: `${entry.devUrl}${page.path}`, serve: entry.serve, ...page }))
  );
}

/**
 * Runs the generator or the check.
 * @param {string[]} argv Arguments after the script name.
 * @returns {Promise<number>} The exit code.
 */
async function main(argv) {
  try {
    const opts = parseArgs(argv);
    if (opts.help) {
      process.stdout.write(
        'Usage: node tools/scripts/feature-map.cjs [--check | --find <words...>] [--root <dir>]\n'
      );

      return 0;
    }
    if (opts.check && opts.find) throw new FatalError('--check and --find do not go together');
    const map = buildMap(opts.root);
    if (opts.find) {
      const found = findPages(map, opts.find);
      if (found.length > 0) {
        process.stdout.write(`${JSON.stringify(found, null, 2)}\n`);

        return 0;
      }
      const all = Object.entries(map.apps).flatMap(([app, entry]) =>
        entry.pages.map(page => `  ${app} ${page.path} (${page.component})`)
      );
      process.stdout.write(
        `✗ feature-map: no page matches "${opts.find.join(' ')}". The pages:\n${all.join('\n')}\n`
      );

      return 1;
    }
    const text = await render(opts.root, map);
    const file = path.join(opts.root, OUT);
    const pages = Object.values(map.apps).reduce((sum, app) => sum + app.pages.length, 0);
    if (!opts.check) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
      process.stdout.write(`✓ feature-map: ${pages} pages written to ${OUT}\n`);

      return 0;
    }
    const committed = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    if (committed === text) {
      process.stdout.write(`✓ feature-map: ${OUT} matches the routes (${pages} pages)\n`);

      return 0;
    }
    let before = null;
    try {
      before = committed === null ? null : JSON.parse(committed);
    } catch {
      before = null;
    }
    const lines = differences(before, map);
    process.stdout.write(
      `✗ feature-map: ${committed === null ? `${OUT} does not exist` : `${OUT} is out of date`}. Run yarn feature-map and commit it.\n` +
        lines.map(line => `  ${line}\n`).join('')
    );

    return 1;
  } catch (error) {
    if (!(error instanceof FatalError)) throw error;
    process.stderr.write(`feature-map: ${error.message}\n`);

    return 2;
  }
}

if (require.main === module) main(process.argv.slice(2)).then(code => (process.exitCode = code));

module.exports = { main, buildMap, ACCESS_GUARDS };
