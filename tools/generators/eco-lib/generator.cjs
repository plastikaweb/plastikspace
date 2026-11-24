/**
 * META-19 — `eco-lib`: a new eco library with the repo's conventions, in one command.
 *
 *   yarn eco-lib --app eco-admin --domain auth --type feature --name login
 *
 * Names (the eco-admin scheme, owner's choice 2026-11-24; existing libraries keep theirs):
 *   libs/<app>/<domain>/<type>[/<name>]  project <app>-<domain>-<name|type>  alias @plastik/<app>/<domain>/<name|type>
 *   libs/<app>/core/<name>               project <app>-<name>                alias @plastik/<app>/<name>
 *   libs/eco/<name>                      project eco-<name>                  alias @plastik/eco/<name>
 *
 * It runs @nx/angular:library (no component of its own), then:
 *   - puts back `.gitignore`, the root `eslint.config.mjs` and `nx.json`, which that generator
 *     edits in this workspace (an ignore entry, a key order) and whose change makes every project
 *     affected;
 *   - writes the alias without the `./` prefix the other aliases do not have;
 *   - writes `eslint.config.mjs` (the root config first, the app's selector prefix) and
 *     `vite.config.mts` (`angular({ tsconfig })`, the root `vitest-setup.ts`, the `json-summary`
 *     coverage that CI reads) as the other eco libraries have them; the project keeps
 *     `"targets": {}`, since Nx infers lint and test;
 *   - writes the sources flat in `src/`, named after the project: a component for feature and ui
 *     (with a spec that runs axe, and `setup-vitest.d.ts` for its matcher types), a routes file
 *     for feature, a placeholder export for the other types;
 *   - writes a README stub.
 */

const fs = require('fs');
const path = require('path');
const {
  formatFiles,
  getProjects,
  names,
  offsetFromRoot,
  readJson,
  updateJson,
} = require('@nx/devkit');
const { libraryGenerator } = require('@nx/angular/generators');

const APPS = {
  'eco-store': { prefix: 'eco' },
  'eco-admin': { prefix: 'eco-admin' },
  eco: { prefix: 'eco' },
};
const TYPES = ['feature', 'ui', 'data-access', 'util', 'entity'];
const COMPONENT_TYPES = new Set(['feature', 'ui']);
const KEBAB = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const ROOT_FILES = ['.gitignore', 'eslint.config.mjs', 'nx.json'];
const SETUP_VITEST_TYPES = fs.readFileSync(
  path.join(__dirname, 'setup-vitest.d.ts.template'),
  'utf8'
);

/**
 * Checks the options and derives the library's folder, project name and alias.
 * @param {{ app?: string, domain?: string, type?: string, name?: string }} options The generator options.
 * @returns {object} The normalized options.
 */
function normalizeOptions(options) {
  const { app, type } = options;
  const domain = options.domain?.trim() || undefined;
  const name = options.name?.trim() || undefined;
  if (!Object.hasOwn(APPS, app ?? ''))
    throw new Error(`--app must be one of ${Object.keys(APPS).join(', ')}; got "${app}".`);
  if (!TYPES.includes(type))
    throw new Error(`--type must be one of ${TYPES.join(', ')}; got "${type}".`);
  for (const [flag, value] of [
    ['domain', domain],
    ['name', name],
  ]) {
    if (value !== undefined && !KEBAB.test(value))
      throw new Error(
        `--${flag} must be kebab-case (lowercase words joined by -); got "${value}".`
      );
  }
  let directory;
  let projectName;
  let importPath;
  if (app === 'eco') {
    if (domain)
      throw new Error('libs/eco has no domain folders: leave --domain out with --app eco.');
    if (!name) throw new Error('--app eco needs --name: its libraries sit at libs/eco/<name>.');
    directory = `libs/eco/${name}`;
    projectName = `eco-${name}`;
    importPath = `@plastik/eco/${name}`;
  } else if (!domain) {
    throw new Error(`--app ${app} needs --domain (core for the app's foundation libraries).`);
  } else if (domain === 'core') {
    if (!name)
      throw new Error(`--domain core needs --name: core libraries sit at libs/${app}/core/<name>.`);
    directory = `libs/${app}/core/${name}`;
    projectName = `${app}-${name}`;
    importPath = `@plastik/${app}/${name}`;
  } else {
    const last = name ?? type;
    directory = `libs/${app}/${domain}/${type}${name ? `/${name}` : ''}`;
    projectName = `${app}-${domain}-${last}`;
    importPath = `@plastik/${app}/${domain}/${last}`;
  }
  const { className, propertyName, fileName } = names(projectName);

  return {
    app,
    type,
    directory,
    projectName,
    importPath,
    prefix: APPS[app].prefix,
    className,
    propertyName,
    fileName,
  };
}

/**
 * Stops before writing anything when the library would collide with one that exists.
 * @param {import('@nx/devkit').Tree} tree The workspace.
 * @param {object} lib The normalized options.
 */
function assertNew(tree, lib) {
  if (tree.exists(lib.directory)) throw new Error(`${lib.directory} already exists.`);
  if (getProjects(tree).has(lib.projectName))
    throw new Error(`A project named ${lib.projectName} already exists.`);
  const paths = readJson(tree, 'tsconfig.base.json').compilerOptions?.paths ?? {};
  if (Object.hasOwn(paths, lib.importPath))
    throw new Error(`The alias ${lib.importPath} already exists in tsconfig.base.json.`);
}

/**
 * Builds the files this generator writes over or next to those of @nx/angular:library.
 * @param {object} lib The normalized options.
 * @returns {Record<string, string>} Path inside the library → content.
 */
function libraryFiles(lib) {
  const up = offsetFromRoot(lib.directory);
  const directivePrefix = names(lib.prefix).propertyName;
  const files = {
    'README.md': [
      `# ${lib.importPath}`,
      '',
      '_What this library provides, and to which screen or module. Replace this line._',
      '',
      `Project \`${lib.projectName}\`, tags \`scope:${lib.app}\` + \`type:${lib.type}\`.`,
      '',
      '## Running unit tests',
      '',
      `Run \`yarn nx test ${lib.projectName}\` to execute the unit tests.`,
      '',
    ].join('\n'),
    'eslint.config.mjs': `import baseConfig from '${up}eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: '${directivePrefix}',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: '${lib.prefix}',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...nx.configs['flat/angular-template'],
];
`,
    'vite.config.mts': `/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '${up}node_modules/.vite/${lib.directory}',
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
  test: {
    name: '${lib.projectName}',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts', '${up}vitest-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '${up}coverage/${lib.directory}',
      provider: 'v8' as const,
      reporter: ['text', 'json-summary'],
    },
  },
}));
`,
  };
  const component = `${lib.className}Component`;
  if (!COMPONENT_TYPES.has(lib.type)) {
    files['src/index.ts'] = `/**
 * Public API of \`${lib.importPath}\`: export from here what the library provides.
 */
export type ${lib.className}Placeholder = never;
`;

    return files;
  }
  files[`src/${lib.fileName}.component.ts`] =
    `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '${lib.projectName}',
  templateUrl: './${lib.fileName}.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${component} {}
`;
  files[`src/${lib.fileName}.component.html`] = `<p>${lib.projectName}</p>\n`;
  files[`src/${lib.fileName}.component.spec.ts`] =
    `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe } from 'vitest-axe';

import { ${component} } from './${lib.fileName}.component';

describe('${component}', () => {
  let fixture: ComponentFixture<${component}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${component}],
    }).compileComponents();

    fixture = TestBed.createComponent(${component});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
`;
  files['src/setup-vitest.d.ts'] = SETUP_VITEST_TYPES;
  const exports = [`export { ${component} } from './${lib.fileName}.component';`];
  if (lib.type === 'feature') {
    files[`src/${lib.fileName}.routes.ts`] = `import { Routes } from '@angular/router';

import { ${component} } from './${lib.fileName}.component';

export const ${lib.propertyName}Routes: Routes = [{ path: '', component: ${component} }];
`;
    exports.push(`export { ${lib.propertyName}Routes } from './${lib.fileName}.routes';`);
  }
  files['src/index.ts'] = `${exports.join('\n')}\n`;

  return files;
}

/**
 * Creates the library.
 * @param {import('@nx/devkit').Tree} tree The workspace.
 * @param {{ app: string, domain?: string, type: string, name?: string }} options The generator options.
 * @returns {Promise<void>} Resolves once the files are written to the tree.
 */
async function ecoLibGenerator(tree, options) {
  const lib = normalizeOptions(options);
  assertNew(tree, lib);
  const rootFiles = new Map(ROOT_FILES.map(file => [file, tree.read(file, 'utf-8')]));
  await libraryGenerator(tree, {
    directory: lib.directory,
    name: lib.projectName,
    importPath: lib.importPath,
    tags: `scope:${lib.app},type:${lib.type}`,
    prefix: lib.prefix,
    standalone: true,
    skipModule: true,
    style: 'scss',
    linter: 'eslint',
    unitTestRunner: 'vitest-analog',
    skipFormat: true,
  });
  for (const [file, content] of rootFiles) {
    if (content === null) {
      if (tree.exists(file)) tree.delete(file);
    } else if (tree.read(file, 'utf-8') !== content) tree.write(file, content);
  }
  updateJson(tree, 'tsconfig.base.json', json => {
    const paths = json.compilerOptions.paths;
    paths[lib.importPath] = paths[lib.importPath].map(entry => entry.replace(/^\.\//, ''));

    return json;
  });
  if (tree.exists(`${lib.directory}/src/lib`)) tree.delete(`${lib.directory}/src/lib`);
  for (const [file, content] of Object.entries(libraryFiles(lib)))
    tree.write(`${lib.directory}/${file}`, content);
  await formatFiles(tree);
}

module.exports = ecoLibGenerator;
module.exports.default = ecoLibGenerator;
module.exports.normalizeOptions = normalizeOptions;
