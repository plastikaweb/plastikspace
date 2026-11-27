# Lens: PocketBase and tenants (API rules, tenant isolation, hooks)

eco-store and eco-admin share one PocketBase (0.36.7) with many cooperatives (tenants) in the same collections. The API rules are the only wall between them: the frontend's checks are for UX only. This is where eco's open risks are (`yarn task SEC-09`, `yarn task SEC-10`).

## Already mechanical (input, not work)

The pre-commit exports the schema; `pb-schema-guard.yml` fails a PR that changes `pb_schema.json` without eco code or removes a collection or field, unless labelled. Neither judges what a rule allows.

## Judgement checks

1. **API rules of each new or changed collection** (`apps/eco-store/pocketbase/pb_schema.json`). List, view, create, update and delete each restrict by `@request.auth.id` and `tenant = @request.auth.tenant` on multi-tenant data, and by `@request.auth.role` where only admins may act. An empty rule (`""`, public) or `null` (superusers only) is deliberate and said so. A create rule pins the tenant (SEC-09 is the known gap on `orders`). Membership gates (TRL-05) stay on carts and orders.
2. **Tenant isolation in the client.** A write never takes its tenant from user input where the rule does not pin it. A `filter` string built from user input goes through `pb.filter()` with parameters, never string concatenation or a `replace()` on the filter. A list query that relies on the rule for tenant scoping says so.
3. **Hooks** (`pb_hooks/*.pb.js`, PocketBase's JS VM). A bypass of a hook check (such as the `x-bypass-hooks` header) is honoured only for a superuser. Errors raise PocketBase's error types, not a bare `throw`. Nothing logs tokens, passwords or personal data. Mail content localises through `users.language`. A hook that writes several records does it in a transaction.
4. **Schema changes.** A new required field on a collection with data, or a `select` value removed while records still hold it (PocketBase keeps them, and they fail validation on their next write), is high risk (`apps/eco-store/POCKETBASE.md` «Safety Guidelines»). Collection names in `snake_case`, fields in `camelCase`, i18n fields as JSON `{ ca, es, en }`, a `tenant` relation on every multi-tenant collection.
5. **Data access.** After a PATCH of the signed-in user's record, `authRefresh()` runs; nothing sensitive goes to `localStorage`; storage keys are tenant-scoped like the cart's (`${tenant.normalizedName}-cart-v1`); SSR-safe access to browser APIs.

## Ground truth

`apps/eco-store/CLAUDE.md` «PocketBase backend», `apps/eco-store/POCKETBASE.md`, AGENTS.md «PocketBase Schema Workflow», the `pocketbase-best-practices` skill (`rules-locked-vs-open`, `rules-cross-collection`), and the live rules in `pb_schema.json`, never a doc's summary of them.
