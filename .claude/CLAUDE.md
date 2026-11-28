# Claude AI

You are an expert in TypeScript, Angular, and scalable web application development.
You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Angular rules ESLint does not check

ESLint turns most Angular rules into errors (META-17: `standalone: true`, `@HostBinding`/`@HostListener`, decorator inputs and outputs, `NgClass`/`NgStyle`, structural directives, constructor injection): the Angular item of "Code Quality Rules (ESLint)" in the root `CLAUDE.md` lists them. What it does not check:

- **Animations:** never `provideAnimations()` or `provideAnimationsAsync()`, both deprecated since Angular v20. Use CSS transitions and the compiler's `animate.enter` / `animate.leave`.
- **Images:** `NgOptimizedImage` for every static image; it does not work for inline base64 images.
- **Components:** `changeDetection: ChangeDetectionStrategy.OnPush` (the generators set it; hand-written components must too).
- **Services:** `providedIn: 'root'` for singletons; component-specific services in the component's `providers`.
- **Routing:** lazy-load feature routes from a `*.routes.ts` entry point per feature or scope. Guards are functional (`CanActivateFn`) and run before resolvers: never rely on resolver data in a guard of the same route.
- **RxJS interop:** `toSignal(obs$, { initialValue: ... })` for templates (no `undefined` in strict templates); `takeUntilDestroyed()` instead of a manual `ngOnDestroy` unsubscription.

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

## Session settings

`.claude/settings.json` (META-33) sets `NX_WORKSPACE_ROOT_PATH=""`, so Nx in a worktree uses the worktree instead of the main checkout the session inherited, and `NX_DEFAULT_OUTPUT_STYLE=static`, so a failed task prints its log. Its `sandbox.excludedCommands` runs `gh`, `git fetch`/`pull`/`push`/`ls-remote`, `git worktree` and the Angular builds outside the sandbox, where they work; they still go through the permission prompts. The exclusion applies only when every command of the call matches: a call with `cd`, a redirect to a file, a heredoc or a command substitution stays sandboxed, so `git push … > "$log" 2>&1` still needs the sandbox off. Settings load from the checkout a session starts in.
