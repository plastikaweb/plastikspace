# Lens: code (Angular, TypeScript, forms, layering)

You review the touched TypeScript, with its templates and styles as context, for what no check decides. The repo's rules are in the root `CLAUDE.md`, `.claude/CLAUDE.md` and, for eco-store, `apps/eco-store/CLAUDE.md`; they are already loaded.

## Already mechanical (input, not work)

ESLint (`documentation/code-style.md` «Lint rules»): signal inputs, outputs and queries, `inject()`, `#private` fields, member ordering, native control flow, no `ngClass`/`ngStyle`, `@HostBinding`/`@HostListener` or `standalone: true`, `type` on every `<button>`, JSDoc form, `no-console`, naming warnings, module boundaries. `check-nx-tags`, `check-eco-conventions` (bare `<input>`, `<select>`, `<textarea>`; raw hex; `--mat-sys-*` declared), `i18n:validate` and `lint-delta` arrive as facts. Do not re-check or restate them.

## Judgement checks

1. **Forms.** Every field is declared in a `*.config.ts` with `@ngx-formly` and a Material field type, rendered inside `mat-form-field`. Flag a hand-written reactive form (a `FormGroup` or `FormControl` built in the component and bound with `formControlName`), a `<mat-select>`, `matInput` or `<mat-form-field>` written in a template, and a field type the route's Formly providers or the spec's TestBed does not register (the field then fails to render, or the spec fails). Labels, placeholders and option labels are translation keys present in every language file of the app: `i18n:validate` does not read Formly configs.
2. **Shared and Material first.** A native `<button>`, `<a>` styled as a button, card or field where a Material component does the job; a stylesheet that redraws what Material or a shared library already draws (fields, buttons, cards, notices); a component, provider or injection token written again when `libs/shared/*`, `libs/eco/*` or the sibling app already has it (eco-admin mirrors eco-store). A field gets its look from its Formly config and the eco field style, never from the screen's stylesheet.
3. **Signals and state.** Derived state is `computed()`; writable derived state is `linkedSignal()`. No `effect()` that writes a signal (no lint rule catches it). No manual `subscribe` where `toSignal()` would do; any left is `takeUntilDestroyed()`. Stores follow the NgRx Signal Store patterns of the cart store (`apps/eco-store/CLAUDE.md` «State management patterns»).
4. **Template calls.** A function call in a template that does real work (not a signal read, not a pure pipe) runs on every change detection: propose `computed()` or a pipe.
5. **Single responsibility.** A component or service with two jobs (fetching, formatting and orchestration together). Propose a split only when it lowers coupling; extract a helper only when two places use it.
6. **Layering.** The file sits in the right library and scope (`documentation/nx-architecture.md`; eco-store, eco-admin and `libs/eco` rules in the root `CLAUDE.md`); consumers import through the `@plastik/*` alias, never a relative path across libraries.
7. **Copy and i18n.** No user-facing text written in a template or TypeScript; Catalan is the default language. A key built at run time cannot be checked by `i18n:validate`: confirm each possible key exists.
8. **Errors and notifications.** Promises awaited; no empty `catch`. eco-store notifies through `StoreNotificationService` and `SharedConfirmDialogService`, never a raw `MatSnackBar`.
9. **Dead code.** Exports nobody imports (grep the repo), branches the change made unreachable, leftovers of a removed feature.
10. **Tests.** New logic has a spec next to it; a spec the branch changed still asserts behaviour (not only "should create"); no `.skip` or `.only` left.

## Ground truth

`.claude/CLAUDE.md` (Angular rules and «When a skill and this file disagree»), `documentation/code-style.md`, `documentation/nx-architecture.md`, `apps/eco-store/CLAUDE.md`, and for eco-admin `apps/eco-admin/DESIGN-BRIEF.md` (every drawn component maps to a Material component).
