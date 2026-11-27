# Claude AI

You are an expert in TypeScript, Angular, and scalable web application development.
You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

ESLint turns most of the Angular rules below into errors (META-17): the Angular item of "Code Quality Rules (ESLint)" in the root `CLAUDE.md` lists which.

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- **Animations:** Do NOT use `provideAnimations()` or `provideAnimationsAsync()`; both are deprecated as of Angular v20+. Prefer native CSS animations/transitions and the new compiler-supported `animate.enter` and `animate.leave` APIs for element lifecycle animations.
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## When a skill and this file disagree, this file wins

The skills in `.claude/skills` are generic, written for any Angular project. This file and the root `CLAUDE.md` describe this repo. When a skill recommends something these files rule out, follow these files and do not mix the two approaches. Known conflicts:

- **Forms.** `angular-forms` recommends Signal Forms. This repo builds forms with `@ngx-formly` and Angular Material: fields render inside `mat-form-field` with `matInput`, configured in a `*.config.ts` next to the component. Never write a bare `<input>`, `<select>` or `<textarea>` (PR #1558 shipped one and needed a follow-up fix). In eco code, `yarn eco-conventions:check` fails on one (META-15).
- **Private fields.** angular-di, angular-directives, angular-signals, angular-ssr, angular-routing, angular-testing and angular-http write `private x = inject(...)`. ESLint rejects the `private` modifier here: write `readonly #x = inject(...)`.
- **rxjs.** It uses `*ngIf`, a `private destroy$` with `takeUntil` and `ngOnDestroy`, `console.error`, and RxJS 8. This repo: native control flow, `takeUntilDestroyed()`, no `console`, RxJS 7.8.
- **Generating code.** angular-tooling teaches `ng new` and `ng generate`, but `ng` is an alias of `nx` here, so those arguments go to Nx. nx-generate (and the Nx block of the root `CLAUDE.md`) says to start every scaffold with it; eco libraries (`libs/eco-store`, `libs/eco-admin`, `libs/eco`) come from `yarn eco-lib` instead.
- **Test setup.** angular-testing installs Vitest with npm and configures it in `angular.json`. This repo uses Yarn, has no `angular.json`, and Nx infers `vitest run` per project.
- **Colours.** tailwind-css-patterns uses palette classes (`bg-indigo-600`, `text-gray-900`) and a `tailwind.config.js`. Colours here come only from Material roles through CSS custom properties (`bg-tertiary-container`): no palette classes, no hex.
- **Injection tokens.** angular-di promotes an `InjectionToken` for each config value. Here a new token or provider needs a stated reason; reuse what exists first.
- **i18n.** i18n-localization shows react-i18next and next-intl. This repo uses ngx-translate with `i18n/{lang}.json` files, checked by `yarn i18n:validate`.
- **Fonts.** frontend-design asks for distinctive fonts. The eco apps use Manrope for all text.

Add a line here each time a skill and the repo conflict again.

## Guards

`.claude/hooks/guard.sh` runs before every Edit, Write and Bash call (`.claude/settings.json`). It blocks:

- edits to `apps/eco-store/pocketbase/pb_schema.json` and `yarn.lock`;
- git commands that skip the Husky hooks (`--no-verify`, `commit -n`, `HUSKY=0`, `core.hooksPath`);
- `git commit` or `git push` piped into another command, whose exit code then hides the hook's;
- `git commit -F` from a relative or `$TMPDIR` path, and a message commitlint rejects (`.claude/hooks/commit-msg-check.mjs`), before the pre-commit runs.

It asks before stopping, restarting or copying the local PocketBase on :8090, `eco-store:pocketbase:stop` included. It reads command words only: a grep pattern or a commit message that names a flag or PocketBase trips nothing, except inside `bash -c` and `eval`. When it blocks, do what its message says; do not look for another way around it. Tests: `yarn guard:test` (META-32).

## Stop check

`.claude/hooks/stop-check.mjs` runs when a turn ends (`Stop` in `.claude/settings.json`, META-14). On the files changed since the session started it runs ESLint (fast profile, errors only), markdownlint, `prettier --check`, `vitest related` for at most two projects, and `yarn tasks:check` when a task doc changed; it also reports each new `eslint-disable`, `@ts-ignore`, `prettier-ignore`, `.skip` or `.only` in `apps/` and `libs/`. When something fails, the turn stays open with the findings: fix the cause rather than silencing it, or tell the user why it stays. The same failure blocks once; after that the turn ends and the user is told. A session runs the copy of the checkout it started in and checks the checkout it works in (a worktree, say), with that checkout's `node_modules`.

## Keep awake

A second `SessionStart` hook (META-35) runs `caffeinate -i -w <session pid>` on macOS: while a session lives, idle sleep cannot pause a long hook, push or test run it started, and the `caffeinate` ends with the session. Runs started outside a session still need `caffeinate -i` in front.
