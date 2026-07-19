# PRV-04d Fiscal Profile ("Dades fiscals") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved PRV-04d redesign's capture half: a 0..1 `user_fiscal_profiles` PocketBase collection with server-side NIF checksum, plus an opt-in "Dades fiscals" section in the eco-store profile, gated by a tenant flag.

**Architecture:** A new PocketBase base collection holds the fiscal tuple (`fiscalName`, `nif`, `address`, `city`, `zip`) linked 0..1 to `users` via a unique relation index; a request-phase hook enforces the NIF checksum server-side. The frontend mirrors the existing addresses pattern: a `PocketBaseCrudService` subclass, state + methods on the shared `pocketBaseUserProfileStore`, and a new `eco-store-profile-fiscal-data-feature` lib mounted at `perfil/dades-fiscals` behind a `canMatch` guard on `tenant.fiscalDataEnabled`. `orders.billing` and the checkout "necessito factura" toggle stay deferred to invoicing.

**Tech Stack:** Angular 21 (standalone, signals, OnPush), NgRx Signal Store (`@angular-architects/ngrx-toolkit`), ngx-formly + Material, ngx-translate (ca/es/en), PocketBase 0.36.7 (JSVM hooks), Vitest, Nx 22.

## Global Constraints

- Branch: `feat/86c99dev0-prv04d-fiscal-profile`. Commit format: `<type>(eco-store): #86c99dev0 PRV-04d <imperative description>` — full header ≤ 100 chars, body ≤ 500 chars.
- Pre-commit needs local PocketBase on `http://127.0.0.1:8090` (it re-exports `pb_schema.json`) and runs i18n validation, affected lint, markdownlint. Run commits outside the sandbox. NEVER `--no-verify`.
- The hook auto-runs `git add -A` — stash anything that must not enter a commit.
- `nifValidator` is ALREADY COMMITTED on this branch (commit bb6cba31): `libs/shared/form/util/src/validations/validators/nif.validator.ts` + spec (18 tests), barrel export, `registerValidatorsTranslateExtension` `nif` entry, and `common.form.error.nif` i18n keys in ca/es/en. Do NOT recreate or re-commit any of it — just import it.
- PocketBase conventions: collection names `snake_case`, field names `camelCase`. Schema is edited on the LIVE local instance, then exported with `yarn eco-store:pb:export` (never hand-edit `pb_schema.json`).
- ESLint: ES6 `#private` fields, no `console`, JSDoc with typed tags on public APIs (capital start, period end), member ordering signature→field→constructor→method.
- All user-facing copy externalized to i18n (ca/es/en); Catalan is the default language.
- Run lib tests directly (`npx vitest run` from the lib dir, sandbox off) — nx swallows vitest output.
- Out of scope (deferred to invoicing): `orders.billing` snapshot, checkout "necessito factura" toggle, llecoop `validators-message.ts` `nif` entry, per-record fiscal-data delete UI (PRV-08's cascade covers RGPD deletion).

---

### Task 1: PocketBase schema — `user_fiscal_profiles` + `tenants.fiscalDataEnabled`

**Files:**

- Modify (generated): `apps/eco-store/pocketbase/pb_schema.json` (via live instance + export — never by hand)

**Interfaces:**

- Consumes: running local PocketBase (`http://127.0.0.1:8090`), superuser credentials from `apps/eco-store/.env`.
- Produces: collection `user_fiscal_profiles` with fields `user` (relation → `_pb_users_auth_`, required, cascadeDelete, maxSelect 1), `fiscalName` (text, required, max 120), `nif` (text, required, min 9, max 9, pattern `^[0-9A-Z]{9}$`), `address` (text, required), `city` (text, required, min 5, max 50), `zip` (text, required, min 5, max 5, pattern `^(0[1-9]|[1-4]\d|5[0-2])\d{3}$`), `created`/`updated` (autodate); UNIQUE index on `user`; bool `fiscalDataEnabled` on `tenants`.

- [ ] **Step 1: Create the collection on the live instance**

Use the PocketBase MCP tools (`mcp__pocketbase__auth_admin`, then `mcp__pocketbase__create_collection`) or the Admin UI at `http://localhost:8090/_/`. Collection `user_fiscal_profiles`, type `base`, fields exactly as in **Produces** above.

Indexes:

```sql
CREATE UNIQUE INDEX idx_user_fiscal_profiles_user ON user_fiscal_profiles (user)
```

API rules (mirror `user_addresses`; `createRule` is owner-only):

```text
listRule / viewRule / updateRule / deleteRule:
(user = @request.auth.id) ||
(@request.auth.role = "GLOBAL_ADMIN") ||
(@request.auth.role = "TENANT_ADMIN" && user.tenant = @request.auth.tenant)

createRule:
user = @request.auth.id
```

- [ ] **Step 2: Add `fiscalDataEnabled` to `tenants`**

On the live instance, add field `fiscalDataEnabled` — type `bool`, not required — to the `tenants` collection. Set it to `true` on the local test tenant (El Llevat) so manual verification works later.

- [ ] **Step 3: Export and review**

```bash
yarn eco-store:pb:export
yarn eco-store:pb:diff
```

Expected diff: the new `user_fiscal_profiles` collection object, the `fiscalDataEnabled` field on `tenants`, plus benign `_clone_*` id churn on the `product_categories_stats` view.

- [ ] **Step 4: Verify the unique constraint bites**

Create two records for the same user via MCP (`mcp__pocketbase__create_record`) — the second must fail with a UNIQUE constraint error. Delete both test records afterwards.

- [ ] **Step 5: Commit**

```bash
git add apps/eco-store/pocketbase/pb_schema.json
git commit -m "feat(eco-store): #86c99dev0 PRV-04d add user_fiscal_profiles collection and tenant flag" -m "PRV-04d: 0..1 fiscal tuple per user (unique index on the user relation), owner-only create, owner/admin read-write rules mirroring user_addresses. tenants.fiscalDataEnabled gates the profile section."
```

---

### Task 2: NIF checksum hook (server-side control)

**Files:**

- Create: `apps/eco-store/pocketbase/pb_hooks/validate_fiscal_profile.pb.js`

**Interfaces:**

- Consumes: collection `user_fiscal_profiles` (Task 1); the checksum algorithm ported from `libs/shared/form/util/src/validations/validators/nif.validator.ts`.
- Produces: create/update requests with an invalid `nif` fail with 400 before persisting. Honors the `x-bypass-hooks: true` header used during seeding.

- [ ] **Step 1: Write the hook**

```js
/// <reference path="../pb_data/types.d.ts" />

/**
 * Validates the NIF/NIE/CIF checksum. Port of the frontend nifValidator
 * (libs/shared/form/util) — keep both in sync.
 * @param {string} raw
 * @returns {boolean}
 */
function isValidNif(raw) {
  if (!raw) return false;
  const value = String(raw).trim().toUpperCase();
  const controlLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const cifControlLetters = 'JABCDEFGHI';
  const cifLetterOnlyOrgs = 'NPQRSW';
  const cifNumberOnlyOrgs = 'ABEH';

  const dniMatch = /^(\d{8})([A-Z])$/.exec(value);
  if (dniMatch) {
    return controlLetters[Number(dniMatch[1]) % 23] === dniMatch[2];
  }

  const nieMatch = /^([KLMXYZ])(\d{7})([A-Z])$/.exec(value);
  if (nieMatch) {
    const niePrefix = { K: '0', L: '0', M: '0', X: '0', Y: '1', Z: '2' }[nieMatch[1]];
    return controlLetters[Number(niePrefix + nieMatch[2]) % 23] === nieMatch[3];
  }

  const cifMatch = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/.exec(value);
  if (cifMatch) {
    const orgLetter = cifMatch[1];
    const digits = cifMatch[2];
    const controlChar = cifMatch[3];
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      const digit = Number(digits[i]);
      if (i % 2 === 0) {
        const doubled = digit * 2;
        sum += doubled > 9 ? Math.floor(doubled / 10) + (doubled % 10) : doubled;
      } else {
        sum += digit;
      }
    }
    const controlDigit = (10 - (sum % 10)) % 10;
    const expectedLetter = cifControlLetters[controlDigit];
    const expectedNumber = String(controlDigit);
    if (cifLetterOnlyOrgs.includes(orgLetter)) return controlChar === expectedLetter;
    if (cifNumberOnlyOrgs.includes(orgLetter)) return controlChar === expectedNumber;
    return controlChar === expectedLetter || controlChar === expectedNumber;
  }

  return false;
}

/**
 * Normalizes and validates the nif field on incoming writes.
 * @param {core.RecordRequestEvent} e
 */
function validateFiscalProfile(e) {
  if (e.httpContext && e.httpContext.request().header.get('x-bypass-hooks') === 'true') {
    return e.next();
  }
  const nif = String(e.record.getString('nif')).trim().toUpperCase();
  if (!isValidNif(nif)) {
    throw new BadRequestError('Invalid NIF/NIE/CIF: checksum failed.');
  }
  e.record.set('nif', nif);
  e.next();
}

onRecordCreateRequest(validateFiscalProfile, 'user_fiscal_profiles');
onRecordUpdateRequest(validateFiscalProfile, 'user_fiscal_profiles');
```

- [ ] **Step 2: Restart PocketBase to load the hook**

PocketBase loads `pb_hooks/*.pb.js` at startup. The hook file must also exist in the checkout the running instance serves from (the local instance runs from the MAIN checkout: `/Volumes/Feina/Projects/plastikspace/apps/eco-store/pocketbase/pb_hooks/`) — copy it there if working from a worktree, then restart the PocketBase process. **Ask the user before killing/restarting the :8090 process** (standing rule).

- [ ] **Step 3: Verify rejection and acceptance manually**

With an authenticated test user (throwaway PB user pattern), via curl or MCP `create_record`:

- `nif: "12345678A"` (bad checksum for 12345678 → expected letter `Z`) → expect **400**.
- `nif: "12345678Z"` (valid DNI) → expect **200**, record created, `nif` stored uppercase.
- Update the record to `nif: "X1234567T"` (invalid NIE checksum → expect 400) and `"X1234567L"` (valid) → expect 200.
- Delete the test record.

- [ ] **Step 4: Commit**

```bash
git add apps/eco-store/pocketbase/pb_hooks/validate_fiscal_profile.pb.js
git commit -m "feat(eco-store): #86c99dev0 PRV-04d enforce NIF checksum in PocketBase hook" -m "PRV-04d: request-phase hook on user_fiscal_profiles create/update — client-side validation is UX, this is the control. Ports the nifValidator checksum (DNI/NIE/CIF), normalizes to uppercase, honors x-bypass-hooks for seeding."
```

---

### Task 3: Entity types

**Files:**

- Create: `libs/core/entities/src/user-fiscal-profile.ts`
- Modify: `libs/core/entities/src/pocketbase-user.ts` (append record type)
- Modify: `libs/core/entities/src/index.ts` (barrel export)
- Modify: `libs/eco-store/core/entities/src/tenant.ts` (tenant flag)

**Interfaces:**

- Consumes: `BasePocketBaseEntity`, `PocketBaseUser` from the same lib.
- Produces: `UserFiscalProfile`, `UserFiscalProfileForm`, `PocketBaseUserFiscalProfile` exported from `@plastik/core/entities`; `fiscalDataEnabled?: boolean` on `EcoStoreTenant` from `@plastik/eco-store/entities`.

- [ ] **Step 1: Create `user-fiscal-profile.ts`** (mirror `user-contact.ts`)

```ts
import { BasePocketBaseEntity } from './base-pocketbase-entity';

export type UserFiscalProfile = Omit<
  BasePocketBaseEntity,
  'name' | 'normalizedName' | 'created' | 'updated' | 'collectionId' | 'collectionName'
> & {
  fiscalName: string;
  nif: string;
  address: string;
  city: string;
  zip: string;
};

export type UserFiscalProfileForm = Omit<UserFiscalProfile, 'id'> & { id?: string };
```

- [ ] **Step 2: Append the PocketBase record type to `pocketbase-user.ts`** (mirror `PocketBaseUserAddress`)

```ts
export type PocketBaseUserFiscalProfile = Pick<
  BasePocketBaseEntity,
  'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'
> &
  UserFiscalProfile & {
    user: PocketBaseUser['id'];
  };
```

Add `import { UserFiscalProfile } from './user-fiscal-profile';` at the top alongside the existing `UserContact` import.

- [ ] **Step 3: Barrel export** — in `libs/core/entities/src/index.ts` add `export * from './user-fiscal-profile';` next to the `user-contact` export.

- [ ] **Step 4: Add the tenant flag** — in `libs/eco-store/core/entities/src/tenant.ts`, inside `EcoStoreTenant`, after `closedReason`:

```ts
  fiscalDataEnabled?: boolean;
```

- [ ] **Step 5: Lint both libs**

```bash
pnpm nx run-many -t lint -p core-entities eco-store-entities
```

(Adjust project names if `nx show projects | grep entities` says otherwise.) Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add libs/core/entities libs/eco-store/core/entities
git commit -m "feat(eco-store): #86c99dev0 PRV-04d add fiscal profile entity types and tenant flag"
```

---

### Task 4: Data-access service lib

**Files:**

- Create (generator): `libs/shared/pocketbase-user-fiscal-profiles/data-access/` (new Nx lib)
- Create: `.../src/lib/pocketbase-user-fiscal-profile.service.ts`
- Test: `.../src/lib/pocketbase-user-fiscal-profile.service.spec.ts`
- Modify: `tsconfig.base.json` (alias — the generator adds it; verify the exact key)

**Interfaces:**

- Consumes: `PocketBaseCrudService` from `@plastik/core/api-pocketbase`, `PocketBaseUserFiscalProfile` from `@plastik/core/entities` (Task 3).
- Produces: `PocketBaseUserFiscalProfileService` (collection `user_fiscal_profiles`) exported from `@plastik/shared/pocketbase-user-fiscal-profiles`, inheriting `getFirstListItem/create/update/delete` returning Observables.

- [ ] **Step 1: Generate the lib** (invoke the `nx-generate` skill; target shape mirrors `libs/shared/pocketbase-user-addresses/data-access`)

```bash
pnpm nx g @nx/angular:lib data-access --directory=shared/pocketbase-user-fiscal-profiles --tags=scope:shared,type:data-access
```

Then, per workspace convention, remove the generator-added `outputs`/`reportsDirectory` from the `test` target in the new `project.json` so it reads `"test": { "executor": "@nx/vitest:test" }`. Verify the tsconfig alias matches the addresses lib pattern: `"@plastik/shared/pocketbase-user-fiscal-profiles": ["libs/shared/pocketbase-user-fiscal-profiles/data-access/src/index.ts"]` — fix the key if the generator produced a different one. Delete generator sample component files if any.

- [ ] **Step 2: Write the failing spec**

```ts
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { PocketBaseUserFiscalProfileService } from './pocketbase-user-fiscal-profile.service';

describe('PocketBaseUserFiscalProfileService', () => {
  it('targets the user_fiscal_profiles collection', () => {
    const service = TestBed.inject(PocketBaseUserFiscalProfileService);
    expect(service['collectionName']()).toBe('user_fiscal_profiles');
  });
});
```

Mirror the addresses service spec's TestBed setup (see `libs/shared/pocketbase-user-addresses/data-access/src/lib/*.spec.ts` — copy its providers block verbatim if it mocks the PocketBase client).

- [ ] **Step 3: Run it to make sure it fails**

```bash
cd libs/shared/pocketbase-user-fiscal-profiles/data-access && npx vitest run
```

Expected: FAIL (service module not found).

- [ ] **Step 4: Implement the service** (mirror `pocketbase-user-address.service.ts`)

```ts
import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@plastik/core/api-pocketbase';
import { PocketBaseUserFiscalProfile } from '@plastik/core/entities';

/**
 * CRUD access to the user_fiscal_profiles PocketBase collection.
 */
@Injectable({ providedIn: 'root' })
export class PocketBaseUserFiscalProfileService extends PocketBaseCrudService<PocketBaseUserFiscalProfile> {
  protected collectionName(): string {
    return 'user_fiscal_profiles';
  }
}
```

Export from `src/index.ts`: `export * from './lib/pocketbase-user-fiscal-profile.service';`

- [ ] **Step 5: Run tests and lint; expect green**

```bash
cd libs/shared/pocketbase-user-fiscal-profiles/data-access && npx vitest run
pnpm nx lint shared-pocketbase-user-fiscal-profiles-data-access
```

- [ ] **Step 6: Commit**

```bash
git add libs/shared/pocketbase-user-fiscal-profiles tsconfig.base.json
git commit -m "feat(eco-store): #86c99dev0 PRV-04d add fiscal profile PocketBase data-access service"
```

---

### Task 5: Store — fiscal profile state + methods

**Files:**

- Modify: `libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.ts`
- Test: `libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.spec.ts` (extend the existing spec)

**Interfaces:**

- Consumes: `PocketBaseUserFiscalProfileService` (Task 4), `UserFiscalProfileForm`/`PocketBaseUserFiscalProfile` (Task 3).
- Produces: on `pocketBaseUserProfileStore` — state `fiscalProfile: PocketBaseUserFiscalProfile | null`, `fiscalProfileLoaded: boolean`; methods `getFiscalProfile(): Promise<void>`, `saveFiscalProfile(data: UserFiscalProfileForm): Promise<boolean>` (create when no `fiscalProfile()`, update otherwise; normalizes `nif` to trimmed uppercase). Toasts via the existing `_notificationService` idiom.

- [ ] **Step 1: Write the failing tests** — extend the existing spec file, mirroring its mocking style for `PocketBaseUserAddressService` to mock `PocketBaseUserFiscalProfileService`:

```ts
describe('fiscal profile', () => {
  it('getFiscalProfile stores the record and marks loaded', async () => {
    // arrange: mock getFirstListItem to return of(fiscalProfileFixture)
    await store.getFiscalProfile();
    expect(store.fiscalProfile()).toEqual(fiscalProfileFixture);
    expect(store.fiscalProfileLoaded()).toBe(true);
  });

  it('getFiscalProfile treats a 404 as empty, not an error', async () => {
    // arrange: mock getFirstListItem to return throwError(() => ({ status: 404 }))
    await store.getFiscalProfile();
    expect(store.fiscalProfile()).toBeNull();
    expect(store.fiscalProfileLoaded()).toBe(true);
  });

  it('saveFiscalProfile creates when none exists and normalizes the nif', async () => {
    // arrange: fiscalProfile() is null; mock create to return of(created)
    const ok = await store.saveFiscalProfile({ ...formFixture, nif: ' 12345678z ' });
    expect(ok).toBe(true);
    // assert create was called with nif '12345678Z' and user id attached
  });

  it('saveFiscalProfile updates when a profile exists', async () => {
    // arrange: state has fiscalProfile with id 'fp1'; mock update to return of(updated)
    const ok = await store.saveFiscalProfile(formFixture);
    expect(ok).toBe(true);
    // assert update('fp1', …) was called
  });
});
```

Use fixture values with `test-`-safe literals; a valid NIF fixture is `12345678Z`.

- [ ] **Step 2: Run to verify the new tests fail**

```bash
cd libs/shared/auth/pocketbase/data-access && npx vitest run
```

Expected: the four new tests FAIL (`getFiscalProfile is not a function`); pre-existing tests stay green.

- [ ] **Step 3: Implement** — in the store file, mirroring the address methods' exact idiom (`updateState`/`patchState`, `lastValueFrom`, notification calls):

1. State: add `fiscalProfile: null` and `fiscalProfileLoaded: false` to `UserProfileState` + `initialState`.
2. `withProps`: add `_userFiscalProfileService: inject(PocketBaseUserFiscalProfileService)`.
3. Methods:

```ts
async getFiscalProfile(): Promise<void> {
  const user = store.user();
  if (!user || store.fiscalProfileLoaded()) return;
  try {
    const fiscalProfile = await lastValueFrom(
      store._userFiscalProfileService.getFirstListItem(`user="${user.id}"`)
    );
    updateState(store, '[profile] load fiscal profile', { fiscalProfile, fiscalProfileLoaded: true });
  } catch {
    updateState(store, '[profile] load fiscal profile (empty)', {
      fiscalProfile: null,
      fiscalProfileLoaded: true,
    });
  }
},

async saveFiscalProfile(data: UserFiscalProfileForm): Promise<boolean> {
  const user = store.user();
  if (!user) return false;
  const payload = { ...data, nif: data.nif.trim().toUpperCase(), user: user.id };
  const current = store.fiscalProfile();
  try {
    const saved = current
      ? await lastValueFrom(store._userFiscalProfileService.update(current.id, payload))
      : await lastValueFrom(store._userFiscalProfileService.create(payload));
    updateState(store, '[profile] save fiscal profile', { fiscalProfile: saved });
    store._notificationService.create('profile.fiscalData.success.save', 'SUCCESS');
    return true;
  } catch {
    store._notificationService.create('profile.fiscalData.error.save', 'ERROR');
    return false;
  }
},
```

Match the surrounding methods' exact notification call signature (`create(message, type, options?, parameters?)`) and `getFirstListItem` filter signature — check one existing call before writing.

- [ ] **Step 4: Run the lib tests; expect all green**

```bash
cd libs/shared/auth/pocketbase/data-access && npx vitest run
```

- [ ] **Step 5: Commit**

```bash
git add libs/shared/auth/pocketbase/data-access
git commit -m "feat(eco-store): #86c99dev0 PRV-04d add fiscal profile state and save flow to profile store"
```

---

### Task 6: Feature lib — "Dades fiscals" section

**Files:**

- Create (generator): `libs/eco-store/profile/fiscal-data/` (project `eco-store-profile-fiscal-data-feature`, tags `scope:eco-store,type:feature`)
- Create: `src/lib/eco-store-profile-fiscal-data-feature.routes.ts`
- Create: `src/lib/eco-store-profile-fiscal-data-feature/eco-store-profile-fiscal-data-feature.component.ts` + `.html`
- Create: `src/lib/eco-store-profile-fiscal-data-feature/eco-store-profile-fiscal-data-feature-form.config.ts`
- Test: `src/lib/eco-store-profile-fiscal-data-feature/eco-store-profile-fiscal-data-feature.component.spec.ts`
- Commit ALSO: the untracked `nifValidator` files (validator + spec + barrel + translate extension + `common.form.error.nif` i18n in ca/es/en) — they ship with their first consumer.

**Interfaces:**

- Consumes: `pocketBaseUserProfileStore.fiscalProfile()/fiscalProfileLoaded()/getFiscalProfile()/saveFiscalProfile()` (Task 5); `nifValidator`, `zipValidator`, `phoneValidator` pattern from `@plastik/shared/form/util`; `FormConfig`, `UserFiscalProfileForm` from `@plastik/core/entities`.
- Produces: `ecoStoreProfileFiscalDataFeatureRoutes: Route[]` exported from `@plastik/eco-store/profile/fiscal-data`.

- [ ] **Step 1: Generate the lib**

```bash
pnpm nx g @nx/angular:lib fiscal-data --directory=eco-store/profile --tags=scope:eco-store,type:feature
```

Normalize `project.json` (name `eco-store-profile-fiscal-data-feature`, prefix `eco`, plain `test` target) and the tsconfig alias `"@plastik/eco-store/profile/fiscal-data": ["libs/eco-store/profile/fiscal-data/src/index.ts"]`, mirroring the `basic` lib exactly.

- [ ] **Step 2: Form config** — `eco-store-profile-fiscal-data-feature-form.config.ts` (mirror `basic`'s config shape):

```ts
import { FormConfig, UserFiscalProfileForm } from '@plastik/core/entities';
import { nifValidator, zipValidator } from '@plastik/shared/form/util';

/**
 * Builds the fiscal data form configuration.
 * @returns {FormConfig<UserFiscalProfileForm>} The formly config for the fiscal data section.
 */
export function ecoStoreProfileFiscalDataFeatureFormConfig(): FormConfig<UserFiscalProfileForm> {
  const formConfig = [
    {
      fieldGroup: [
        {
          key: 'fiscalName',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.fiscalName.label',
            placeholder: 'profile.fiscalData.form.fiscalName.placeholder',
            required: true,
            translate: true,
            maxLength: 120,
            attributes: { autocomplete: 'name' },
          },
        },
        {
          key: 'nif',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.nif.label',
            placeholder: 'profile.fiscalData.form.nif.placeholder',
            required: true,
            translate: true,
            minLength: 9,
            maxLength: 9,
            attributes: { autocomplete: 'off' },
          },
          validators: { validation: [nifValidator] },
        },
        {
          key: 'address',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.address.label',
            placeholder: 'profile.fiscalData.form.address.placeholder',
            required: true,
            translate: true,
            attributes: { autocomplete: 'street-address' },
          },
        },
        {
          key: 'city',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.city.label',
            placeholder: 'profile.fiscalData.form.city.placeholder',
            required: true,
            translate: true,
            minLength: 5,
            maxLength: 50,
            attributes: { autocomplete: 'address-level2' },
          },
        },
        {
          key: 'zip',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.zip.label',
            placeholder: 'profile.fiscalData.form.zip.placeholder',
            required: true,
            translate: true,
            minLength: 5,
            maxLength: 5,
            attributes: { autocomplete: 'postal-code' },
          },
          validators: { validation: [zipValidator] },
        },
      ],
    },
  ];
  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'profile.fiscalData.form.submit',
      buttonStyle: 'w-full md:w-auto',
    }),
  };
}
```

Copy the exact `buttonStyle` string from the `basic` config so the button matches.

- [ ] **Step 3: Component** (mirror `EcoStoreProfileBasicFeatureComponent`):

```ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { UserFiscalProfileForm } from '@plastik/core/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';

import { ecoStoreProfileFiscalDataFeatureFormConfig } from './eco-store-profile-fiscal-data-feature-form.config';

/**
 * Profile "Dades fiscals" section: 0..1 fiscal identity per member.
 */
@Component({
  selector: 'eco-eco-store-profile-fiscal-data-feature',
  imports: [SharedFormFeatureModule, TranslateModule],
  templateUrl: './eco-store-profile-fiscal-data-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileFiscalDataFeatureComponent {
  readonly #profileStore = inject(pocketBaseUserProfileStore);

  protected readonly model = computed<UserFiscalProfileForm>(() => {
    const profile = this.#profileStore.fiscalProfile();
    return {
      fiscalName: profile?.fiscalName || '',
      nif: profile?.nif || '',
      address: profile?.address || '',
      city: profile?.city || '',
      zip: profile?.zip || '',
    };
  });

  protected readonly formConfig = ecoStoreProfileFiscalDataFeatureFormConfig();

  /**
   * Persists the fiscal profile (create or update).
   * @param {UserFiscalProfileForm} data - The submitted form model.
   */
  onSubmit(data: UserFiscalProfileForm): void {
    this.#profileStore.saveFiscalProfile(data);
  }
}
```

Check the exact `SharedFormFeatureModule` import path in the `basic` component and copy it. Template — copy `basic`'s `.html` verbatim, adjusting only the bound names (`formConfig`, `model()`, `onSubmit($event)`).

- [ ] **Step 4: Routes with a load resolver** (mirror the addresses resolver idiom):

```ts
import { inject } from '@angular/core';
import { ResolveFn, Route } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

import { EcoStoreProfileFiscalDataFeatureComponent } from './eco-store-profile-fiscal-data-feature/eco-store-profile-fiscal-data-feature.component';

const fiscalProfileResolver: ResolveFn<boolean> = async () => {
  const profileStore = inject(pocketBaseUserProfileStore);
  if (!profileStore.fiscalProfileLoaded()) {
    await profileStore.getFiscalProfile();
  }
  return true;
};

export const ecoStoreProfileFiscalDataFeatureRoutes: Route[] = [
  {
    path: '',
    data: { hasSidenav: true, title: 'profile.fiscalData.title', icon: 'receipt_long' },
    resolve: { loaded: fiscalProfileResolver },
    component: EcoStoreProfileFiscalDataFeatureComponent,
  },
];
```

Barrel `src/index.ts`: `export * from './lib/eco-store-profile-fiscal-data-feature.routes';`

- [ ] **Step 5: Component spec** — mirror the `basic` component spec's TestBed setup (providers for the store mock/translate). Assert: component creates; `model()` maps a stored profile into the form model; `onSubmit` delegates to `saveFiscalProfile`.

- [ ] **Step 6: Run tests + lint**

```bash
cd libs/eco-store/profile/fiscal-data && npx vitest run
pnpm nx lint eco-store-profile-fiscal-data-feature
```

Expected: green.

- [ ] **Step 7: Commit (feature lib + the nifValidator files that now have their consumer)**

```bash
git add libs/eco-store/profile/fiscal-data libs/shared/form/util apps/eco-store/public/i18n tsconfig.base.json
git commit -m "feat(eco-store): #86c99dev0 PRV-04d add Dades fiscals profile section with NIF validation" -m "PRV-04d: new eco-store-profile-fiscal-data-feature lib (form: fiscalName, nif, address, city, zip) saving through pocketBaseUserProfileStore. Ships nifValidator (DNI/NIE/CIF checksum, 18 tests) with its first consumer."
```

---

### Task 7: Mount the section — route, tenant gate, sidenav, i18n

**Files:**

- Modify: `libs/eco-store/profile/feature/src/lib/eco-store-profile-feature.routes.ts`
- Create: `libs/eco-store/profile/feature/src/lib/eco-store-fiscal-data-can-match.guard.ts`
- Modify: `libs/eco-store/profile/feature/src/lib/eco-store-profile-feature/eco-store-profile-sidenav-feature.component.ts` + `.html`
- Modify: `apps/eco-store/public/i18n/ca.json`, `es.json`, `en.json`

**Interfaces:**

- Consumes: `ecoStoreProfileFiscalDataFeatureRoutes` (Task 6), `ecoStoreTenantStore` from `@plastik/eco-store/tenant`, `EcoStoreTenant.fiscalDataEnabled` (Task 3).
- Produces: `perfil/dades-fiscals` route reachable only when the tenant flag is on; sidenav entry under "Configuració".

- [ ] **Step 1: Guard**

```ts
import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

/**
 * Matches the fiscal data section only when the tenant has fiscal capture enabled.
 * @returns {boolean} Whether the route may match.
 */
export const ecoStoreFiscalDataCanMatchGuard: CanMatchFn = () => {
  return !!inject(ecoStoreTenantStore).tenant()?.fiscalDataEnabled;
};
```

(Tenant is resolved in `provideAppInitializer` before routing, so reading the signal here is safe.)

- [ ] **Step 2: Route child** — in `ecoStoreProfileFeatureRoutes`, after the `'adreces'` entry and before the `'**'` redirect:

```ts
{
  path: 'dades-fiscals',
  title: 'profile.fiscalData.title',
  data: { hasSidenav: true, title: 'profile.fiscalData.title', icon: 'receipt_long', preferUserName: true },
  canMatch: [ecoStoreFiscalDataCanMatchGuard],
  providers: [providePlainInputFormly()],
  loadChildren: () =>
    import('@plastik/eco-store/profile/fiscal-data').then(m => m.ecoStoreProfileFiscalDataFeatureRoutes),
},
```

When the guard returns false the URL falls through to the existing `'**' → dades-personals` redirect — no dead end.

- [ ] **Step 3: Sidenav entry** — in the sidenav component, inject the tenant store and expose the flag:

```ts
readonly #tenantStore = inject(ecoStoreTenantStore);
protected readonly fiscalDataEnabled = computed(() => !!this.#tenantStore.tenant()?.fiscalDataEnabled);
```

In the template, under the "Configuració" group after the Adreces item (mirror the existing `mat-list-item` markup exactly):

```html
@if (fiscalDataEnabled()) {
<mat-list-item
  class="my-1"
  role="listitem"
  routerLinkActive="active"
  [routerLink]="['/', 'perfil', 'dades-fiscals']"
  [attr.aria-current]="currentUrl().includes('/perfil/dades-fiscals') ? 'page' : null">
  <div class="flex w-full items-center gap-2">
    <mat-icon aria-hidden="true" class="scale-90">receipt_long</mat-icon>
    <span matListItemTitle class="flex-1 truncate text-sm">Dades fiscals</span>
  </div>
</mat-list-item>
}
```

(The sidenav labels are hardcoded Catalan by existing convention — match it; do not introduce a translate pipe only for this item.)

- [ ] **Step 4: i18n subtree** — add to `ca.json` under `profile` (mirror in `es.json`/`en.json` with translated values):

```jsonc
"fiscalData": {
  "title": "Dades fiscals",
  "description": "Dades per a la facturació: només cal si necessites factura.",
  "form": {
    "fiscalName": { "label": "Nom fiscal o raó social", "placeholder": "Nom complet o raó social" },
    "nif": { "label": "NIF / NIE / CIF", "placeholder": "12345678Z" },
    "address": { "label": "Domicili fiscal", "placeholder": "Carrer i número" },
    "city": { "label": "Població", "placeholder": "La teva població" },
    "zip": { "label": "Codi postal", "placeholder": "08000" },
    "submit": "Guardar dades fiscals"
  },
  "success": { "save": "Dades fiscals guardades correctament." },
  "error": { "save": "No s'han pogut guardar les dades fiscals." }
}
```

es: `"title": "Datos fiscales"`, en: `"title": "Tax details"` — translate every leaf; keep key structure identical.

- [ ] **Step 5: Validate i18n + lint + test the touched libs**

```bash
yarn i18n:validate
pnpm nx lint eco-store-profile-feature
cd libs/eco-store/profile/feature && npx vitest run
```

Expected: i18n keys consistent; lint/test green.

- [ ] **Step 6: Commit**

```bash
git add libs/eco-store/profile/feature apps/eco-store/public/i18n
git commit -m "feat(eco-store): #86c99dev0 PRV-04d mount dades-fiscals route behind tenant flag with sidenav entry"
```

---

### Task 8: Manual verification + docs flip + wrap-up

**Files:**

- Modify: `apps/eco-store/TASKS.md`, `apps/eco-store/BACKLOG.md` (v0.38, lockstep), `CHANGELOG.md`, `apps/eco-store/CLAUDE.md` (hooks table + route map)

**Interfaces:**

- Consumes: everything above, running app via `yarn eco-store:local` at `http://el-llevat.test`.
- Produces: shipped-state docs; branch ready for PR.

- [ ] **Step 1: Manual pass** (throwaway PB user):
  - Flag ON (El Llevat): "Dades fiscals" appears in sidenav; form loads empty; save a valid DNI (`12345678Z`) → success toast; reload → values persist; edit to a CIF (`B1234567` + computed control) → persists.
  - Invalid NIF client-side → inline `NIF no vàlid` error, submit blocked. Invalid NIF via direct API (curl, bypassing the form) → 400 from the hook.
  - Flag OFF (toggle on tenant record): sidenav entry gone; direct URL `/perfil/dades-fiscals` redirects to `dades-personals`.
  - Second fiscal profile for the same user via API → UNIQUE index error.

- [ ] **Step 2: Docs flip**
  - `TASKS.md`: PRV-04d row → ✅ for the capture scope, note `orders.billing` + checkout toggle stay deferred to invoicing; spec section: mark capture as shipped 2026-07-19; correct the stale "13 tests" mentions to 18; remove the now-closed "Open before the invoicing work" hook item (shipped in Task 2). Add v0.38 changelog row.
  - `BACKLOG.md`: task 1.5 → ✅ Done 2026-07-19 (capture); v0.38 row mirroring TASKS; bump both headers to 0.38 in lockstep.
  - `CHANGELOG.md`: new `## [2026-07-19]` entry (Added) describing the fiscal profile feature with PRV-04d + [#86c99dev0](https://app.clickup.com/t/86c99dev0).
  - `apps/eco-store/CLAUDE.md`: add `validate_fiscal_profile.pb.js` to the hooks table; add `/perfil/dades-fiscals` context if the route map lists profile children.

- [ ] **Step 3: Commits** (CHANGELOG rides a feature commit; TASKS/BACKLOG as separate docs commit)

```bash
git add CHANGELOG.md apps/eco-store/CLAUDE.md
git commit -m "feat(eco-store): #86c99dev0 PRV-04d changelog and app docs for fiscal profile"
git add apps/eco-store/TASKS.md apps/eco-store/BACKLOG.md
git commit -m "docs(eco-store): #86c99dev0 PRV-04d flip status to done for fiscal capture, bump v0.38" -m "CLOSED: #86c99dev0"
```

- [ ] **Step 4: Full affected check before push**

```bash
pnpm nx affected -t lint test --base=develop
```

Expected: green. Then push (pre-push runs affected builds — slow, backgrounded; don't fire a retry push) and open the PR to `develop` titled `feat(eco-store): #86c99dev0 PRV-04d fiscal profile (Dades fiscals)` — body must reference PRV-04d + CU link, list the deferred invoicing scope, and note the two rescue commits (auto-fill fix + rejection record) already on the branch.

---

## Self-review notes

- **Spec coverage:** collection 0..1 ✓ (T1), server-side checksum ✓ (T2), separate collection not on `users` ✓ (T1/T4),
  opt-in behind tenant flag ✓ (T1/T3/T7), "Dades fiscals" section ✓ (T6/T7),
  zero added fields for non-invoice users ✓ (guard + sidenav gate), deferred `orders.billing`/checkout toggle out of scope ✓.
- **Type consistency:** `UserFiscalProfileForm` is the form/save type (T3→T5→T6);
  `PocketBaseUserFiscalProfile` is the record type (T3→T4→T5);
  route export name `ecoStoreProfileFiscalDataFeatureRoutes` (T6→T7); guard name `ecoStoreFiscalDataCanMatchGuard` (T7).
- **Known look-before-write points** (implementer must copy the neighbor's exact idiom):
  `SharedFormFeatureModule` import path, `getFirstListItem` filter signature, notification `create()` signature,
  store spec mocking style, `buttonStyle` string. Each is called out inline in its step.
