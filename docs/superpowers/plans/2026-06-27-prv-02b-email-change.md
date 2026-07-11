# PRV-02b — Email change with async verification — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a logged-in member change their account email via PocketBase's native, verified
email-change flow — inline request in a new "Accés i seguretat" profile section, confirmed on a
public page mirroring reset-password.

**Architecture:** Two new feature libs (`profile/access-security` for the inline request,
`auth/feature/confirm-email-change` for the public token+password confirmation), two new methods on
the shared PocketBase data-access (`requestEmailChange` / `confirmEmailChange`) mirroring the existing
`requestPassword` / `resetPassword` pair, plus routing, nav rewire, i18n, and a PocketBase
email-template reconfig.

**Tech Stack:** Angular 21 (standalone, OnPush, signals), NgRx Signal Store, ngx-formly, ngx-translate, PocketBase 0.36.7 SDK, Nx, Vitest.

## Global Constraints

- Path-alias prefix is **`@plastik/...`** (NOT `@plastikspace/...`).
- Components: standalone (no `standalone: true`), `ChangeDetectionStrategy.OnPush`, `inject()` (no
  constructor DI), `host` object (no `@HostBinding`/`@HostListener`), native control flow,
  `class`/`style` bindings (no `ngClass`/`ngStyle`), ES `#private` fields (no `private` modifier).
- Lib `project.json` `test` target must be exactly `{ "executor": "@nx/vitest:test" }` — delete generator-added `outputs`/`reportsDirectory`.
- Every commit/push must pass the husky hooks; **never** `--no-verify`. Commit body ≤500 chars **and**
  every line ≤100 chars. Commit header ≤100 chars. Run commits/pushes **outside the sandbox**
  (pre-commit boots PocketBase).
- eco-store changes must reference the PRD/TASKS id (`PRV-02b`) **and** the ClickUp id (`#86c9uq8mt`).
- All user-facing copy is i18n keys (ca default, es co-exists, en present); `yarn i18n:validate` must stay green.
- Branch: `feat/86c9uq8mt-prv02b-email-change` (already created; the design spec is its first commit).

## Reference (existing code being mirrored)

- Spec: `docs/superpowers/specs/2026-06-27-prv-02b-email-change-design.md`.
- Reset-password lib: `libs/eco-store/auth/feature/reset-password/` (component + facade + routes pattern).
- Forgot-password facade: `libs/eco-store/auth/feature/forgot-password/.../eco-store-auth-forgot-password-facade.service.ts`.
- Profile/basic lib: `libs/eco-store/profile/basic/` (inline form pattern).
- Data-access: `libs/shared/auth/pocketbase/data-access/` (`pocketbase-auth.service.ts`, `pocketbase-user-profile.store.ts`, `.mock.ts`).
- Profile routes + sidenav: `libs/eco-store/profile/feature/src/lib/eco-store-profile-feature.routes.ts` + `.../eco-store-profile-feature/eco-store-profile-sidenav-feature.component.html`.
- App routes: `apps/eco-store/src/app/app.routes.ts`.
- i18n: `apps/eco-store/public/i18n/{ca,es,en}.json`.

## Route-slug note (resolved)

The sidenav already renders an **"Accés i seguretat"** entry linking to `/perfil/seguretat`
(currently dead — hits the `**` redirect). Per the agreed design the section lives at
**`access-i-seguretat`**, so Task 3 **rewrites that existing nav link** (`seguretat` →
`access-i-seguretat`) rather than adding a new entry. The sibling `/perfil/compte`
("Gestió del compte") entry is left untouched (future PRV-08).

---

## Task 1: Data-access — `requestEmailChange` / `confirmEmailChange`

**Files:**

- Modify: `libs/shared/auth/entities/src/auth-form-facade.type.ts` (add `ConfirmEmailChangeData`)
- Modify: `libs/shared/auth/pocketbase/data-access/src/pocketbase-auth.service.ts`
- Modify: `libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.ts`
- Modify: `libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.mock.ts`
- Test: `libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.spec.ts` (create if absent) or the existing service/store spec.

**Interfaces:**

- Produces:
  - `ConfirmEmailChangeData { token: string; password: string }` (exported from `@plastik/auth/entities`).
  - `PocketBaseAuthService.requestEmailChange(newEmail: string): Promise<boolean>`
  - `PocketBaseAuthService.confirmEmailChange(token: string, password: string): Promise<boolean>`
  - `pocketBaseUserProfileStore.requestEmailChange(newEmail: string): Promise<boolean>`
  - `pocketBaseUserProfileStore.confirmEmailChange(data: ConfirmEmailChangeData): Promise<boolean>`
- Consumes: `POCKETBASE_INSTANCE` (`@plastik/core/api-pocketbase`), `StoreNotificationService`.

- [ ] **Step 1: Add the `ConfirmEmailChangeData` type**

In `libs/shared/auth/entities/src/auth-form-facade.type.ts`, next to `ResetPasswordData`, add:

```ts
export interface ConfirmEmailChangeData {
  token: string;
  password: string;
}
```

Confirm it is re-exported by the `@plastik/auth/entities` barrel (`libs/shared/auth/entities/src/index.ts` typically does `export * from './auth-form-facade.type'`; if it lists files explicitly, add the export).

- [ ] **Step 2: Write the failing store test**

Create/extend `libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { PocketBaseUserAddressService } from '@plastik/shared/pocketbase-user-addresses';
import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';

describe('pocketBaseUserProfileStore — email change', () => {
  const requestEmailChange = vi.fn();
  const confirmEmailChange = vi.fn();
  const usersCollection = { requestEmailChange, confirmEmailChange, authRefresh: vi.fn() };

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: POCKETBASE_INSTANCE,
          useValue: { collection: () => usersCollection, authStore: { isValid: false } },
        },
        { provide: StoreNotificationService, useValue: { create: vi.fn() } },
        { provide: PocketBaseUserAddressService, useValue: {} },
      ],
    });
    return TestBed.inject(pocketBaseUserProfileStore);
  }

  it('requestEmailChange delegates to pb and returns true on success', async () => {
    requestEmailChange.mockResolvedValueOnce(true);
    const store = setup();
    const ok = await store.requestEmailChange('new@mail.com');
    expect(requestEmailChange).toHaveBeenCalledWith('new@mail.com');
    expect(ok).toBe(true);
  });

  it('requestEmailChange returns false on error', async () => {
    requestEmailChange.mockRejectedValueOnce(new Error('boom'));
    const store = setup();
    expect(await store.requestEmailChange('new@mail.com')).toBe(false);
  });

  it('confirmEmailChange delegates token+password and returns true on success', async () => {
    confirmEmailChange.mockResolvedValueOnce(true);
    const store = setup();
    const ok = await store.confirmEmailChange({ token: 'tok', password: 'pw' });
    expect(confirmEmailChange).toHaveBeenCalledWith('tok', 'pw');
    expect(ok).toBe(true);
  });

  it('confirmEmailChange returns false on error', async () => {
    confirmEmailChange.mockRejectedValueOnce(new Error('bad token'));
    const store = setup();
    expect(await store.confirmEmailChange({ token: 'tok', password: 'pw' })).toBe(false);
  });
});
```

- [ ] **Step 3: Run the test, verify it fails**

Run: `NX_CLI_SET=classic npx nx test auth-pocketbase-data-access --testFile=pocketbase-user-profile.store.spec.ts`
Expected: FAIL — `store.requestEmailChange is not a function`.
(If the project name differs, resolve with `NX_CLI_SET=classic npx nx show projects | grep auth-pocketbase`.)

- [ ] **Step 4: Add the two service methods**

In `pocketbase-auth.service.ts`, after `confirmPasswordReset(...)`, add:

```ts
  async requestEmailChange(newEmail: string): Promise<boolean> {
    return await this.#pb.collection('users').requestEmailChange(newEmail);
  }

  async confirmEmailChange(token: string, password: string): Promise<boolean> {
    return await this.#pb.collection('users').confirmEmailChange(token, password);
  }
```

- [ ] **Step 5: Add the two store methods**

In `pocketbase-user-profile.store.ts` `withMethods`, alongside `resetPassword`, add (import `ConfirmEmailChangeData` from `@plastik/auth/entities`):

```ts
    async requestEmailChange(newEmail: string): Promise<boolean> {
      updateState(store, `[profile] request email change in process`, { isLoading: true });

      try {
        await store._authService.requestEmailChange(newEmail);
        updateState(store, `[profile] request email change success`, { isLoading: false });
        return true;
      } catch (error) {
        updateState(store, `[profile] request email change failed ${error}`, { isLoading: false });
        return false;
      }
    },

    async confirmEmailChange(data: ConfirmEmailChangeData): Promise<boolean> {
      updateState(store, `[profile] confirm email change in process`, { isLoading: true });

      try {
        await store._authService.confirmEmailChange(data.token, data.password);
        updateState(store, `[profile] confirm email change success`, { isLoading: false });
        return true;
      } catch (error) {
        updateState(store, `[profile] confirm email change failed ${error}`, { isLoading: false });
        return false;
      }
    },
```

- [ ] **Step 6: Run the test, verify it passes**

Run: `NX_CLI_SET=classic npx nx test auth-pocketbase-data-access --testFile=pocketbase-user-profile.store.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 7: Extend the store mock**

In `pocketbase-user-profile.store.mock.ts`, add to `mockPocketBaseUserProfileStore`:

```ts
  requestEmailChange: vi.fn(),
  confirmEmailChange: vi.fn(),
```

- [ ] **Step 8: Lint + full lib test, then commit**

Run: `NX_CLI_SET=classic npx nx run-many --target=lint,test --projects=auth-pocketbase-data-access,shared-auth-entities --parallel=2`
Expected: PASS, 0 lint errors.

```bash
git add libs/shared/auth/entities/src/auth-form-facade.type.ts \
        libs/shared/auth/pocketbase/data-access/src/pocketbase-auth.service.ts \
        libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.ts \
        libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.mock.ts \
        libs/shared/auth/pocketbase/data-access/src/pocketbase-user-profile.store.spec.ts \
        libs/shared/auth/entities/src/index.ts
git commit -m "feat(auth-pocketbase-data-access): #86c9uq8mt PRV-02b email-change store methods"
```

---

## Task 2: Public confirmation lib `auth/feature/confirm-email-change`

**Files:**

- Generate lib: `libs/eco-store/auth/feature/confirm-email-change/`
- Create: `.../src/lib/confirm-email-change/eco-store-auth-confirm-email-change.component.ts` + `.html`
- Create: `.../src/lib/confirm-email-change/eco-store-auth-confirm-email-change-facade.service.ts`
- Create: `.../src/lib/confirm-email-change/confirm-email-change-form.config.ts`
- Create: `.../src/lib/eco-store-auth-feature-confirm-email-change.routes.ts`
- Create/replace: `.../src/index.ts`
- Modify: `tsconfig.base.json` (add alias `@plastik/eco-store/auth/confirm-email-change`)
- Modify: `apps/eco-store/src/app/app.routes.ts` (add `confirmar-correu` route)
- Modify: `apps/eco-store/public/i18n/{ca,es,en}.json` (add `auth.confirmEmailChange.*`)
- Test: `.../src/lib/confirm-email-change/eco-store-auth-confirm-email-change-facade.service.spec.ts`

**Interfaces:**

- Consumes: `pocketBaseUserProfileStore.confirmEmailChange` (Task 1), `ConfirmEmailChangeData`, `AUTH_FORM_FACADE`, `FORM_TOKEN`, `providePasswordWithVisibilityFormly`, `providePlainInputFormly`, `pocketBaseIsNotLoggedGuard`.
- Produces: `ecoStoreAuthFeatureConfirmEmailChangeRoutes: Route[]`.

- [ ] **Step 1: Generate the lib**

Run: `NX_CLI_SET=classic npx nx g @nx/angular:lib confirm-email-change --directory=eco-store/auth/feature --tags=scope:eco-store,type:feature`
Then open `libs/eco-store/auth/feature/confirm-email-change/project.json` and set `test` to exactly
`{ "executor": "@nx/vitest:test" }` (delete generator `outputs`/`reportsDirectory`). Delete any
generator-created sample component/spec under `src/lib`.

- [ ] **Step 2: Add the path alias**

In `tsconfig.base.json`, beside `@plastik/eco-store/auth/reset-password`, add:

```json
      "@plastik/eco-store/auth/confirm-email-change": [
        "libs/eco-store/auth/feature/confirm-email-change/src/index.ts"
      ],
```

- [ ] **Step 3: Write the form config (single current-password field)**

Create `.../confirm-email-change/confirm-email-change-form.config.ts`:

```ts
import { ConfirmEmailChangeData } from '@plastik/auth/entities';
import { FormConfig } from '@plastik/core/entities';

/**
 * @description Form config for the public email-change confirmation page.
 * @returns {FormConfig<Pick<ConfirmEmailChangeData, 'password'>>} The confirm form config.
 */
export function confirmEmailChangeFormConfig(): FormConfig<
  Pick<ConfirmEmailChangeData, 'password'>
> {
  const formConfig = [
    {
      fieldGroup: [
        {
          key: 'password',
          type: 'password-with-visibility',
          props: {
            label: 'auth.confirmEmailChange.passwordLabel',
            placeholder: 'auth.confirmEmailChange.passwordLabel',
            required: true,
            translate: true,
            attributes: { autocomplete: 'current-password' },
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'auth.confirmEmailChange.submitButton',
      buttonStyle:
        'w-full md:w-auto mt-6 py-3 px-8 text-sys-on-primary bg-primary font-bold tracking-wide rounded-2xl shadow-md border-0',
    }),
  };
}
```

- [ ] **Step 4: Write the failing facade test**

Create `.../confirm-email-change/eco-store-auth-confirm-email-change-facade.service.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { signal } from '@angular/core';
import { EcoStoreAuthConfirmEmailChangeFacadeService } from './eco-store-auth-confirm-email-change-facade.service';
import { confirmEmailChangeFormConfig } from './confirm-email-change-form.config';

describe('EcoStoreAuthConfirmEmailChangeFacadeService', () => {
  const confirmEmailChange = vi.fn();
  const navigate = vi.fn();
  const create = vi.fn();

  function setup(token: string) {
    history.replaceState(
      null,
      '',
      token ? `/confirmar-correu?token=${token}` : '/confirmar-correu'
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: AUTH_FORM_FACADE, useClass: EcoStoreAuthConfirmEmailChangeFacadeService },
        { provide: FORM_TOKEN, useFactory: confirmEmailChangeFormConfig },
        { provide: Router, useValue: { navigate } },
        { provide: StoreNotificationService, useValue: { create } },
        {
          provide: pocketBaseUserProfileStore,
          useValue: { isLoading: signal(false), confirmEmailChange },
        },
      ],
    });
    return TestBed.inject(AUTH_FORM_FACADE) as EcoStoreAuthConfirmEmailChangeFacadeService;
  }

  it('on success: confirms with token+password, toasts success, navigates to /accedir', async () => {
    confirmEmailChange.mockResolvedValueOnce(true);
    const facade = setup('abc');
    await facade.onSubmit({ password: 'pw' });
    expect(confirmEmailChange).toHaveBeenCalledWith({ token: 'abc', password: 'pw' });
    expect(create).toHaveBeenCalledWith('auth.confirmEmailChange.success', 'SUCCESS');
    expect(navigate).toHaveBeenCalledWith(['/accedir']);
  });

  it('on failure: toasts error and does not navigate to /accedir', async () => {
    confirmEmailChange.mockResolvedValueOnce(false);
    const facade = setup('abc');
    await facade.onSubmit({ password: 'pw' });
    expect(create).toHaveBeenCalledWith('auth.confirmEmailChange.error', 'ERROR');
    expect(navigate).not.toHaveBeenCalledWith(['/accedir']);
  });

  it('with no token: toasts error, no confirm call', async () => {
    const facade = setup('');
    await facade.onSubmit({ password: 'pw' });
    expect(confirmEmailChange).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith('auth.confirmEmailChange.error', 'ERROR');
  });
});
```

- [ ] **Step 5: Run the test, verify it fails**

Run: `NX_CLI_SET=classic npx nx test eco-store-auth-feature-confirm-email-change`
Expected: FAIL — facade module not found.

- [ ] **Step 6: Write the facade**

Create `.../confirm-email-change/eco-store-auth-confirm-email-change-facade.service.ts`:

```ts
import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormFacade, ConfirmEmailChangeData } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';

/**
 * @description Facade for the public email-change confirmation page. Reads the token from the URL,
 * confirms with the user's current password, then forces re-login.
 */
@Injectable({ providedIn: 'root' })
export class EcoStoreAuthConfirmEmailChangeFacadeService implements AuthFormFacade<
  Pick<ConfirmEmailChangeData, 'password'>
> {
  readonly #router = inject(Router);
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #notificationService = inject(StoreNotificationService);

  readonly token = computed(() => new URL(window.location.href).searchParams.get('token') || '');
  readonly isLoading = this.#profileStore.isLoading;
  readonly formConfig = inject(FORM_TOKEN) as FormConfig<Pick<ConfirmEmailChangeData, 'password'>>;

  /**
   * @description Submits the confirmation: confirm email change, then re-login on success.
   * @param {Partial<Pick<ConfirmEmailChangeData, 'password'>>} data The current password.
   * @returns {Promise<void>} Resolves when handled.
   */
  async onSubmit(data: Partial<Pick<ConfirmEmailChangeData, 'password'>>): Promise<void> {
    if (this.token() && data.password) {
      const success = await this.#profileStore.confirmEmailChange({
        token: this.token(),
        password: data.password,
      });
      if (success) {
        this.#notificationService.create('auth.confirmEmailChange.success', 'SUCCESS');
        this.#router.navigate(['/accedir']);
      } else {
        this.#notificationService.create('auth.confirmEmailChange.error', 'ERROR');
      }
    } else {
      this.#notificationService.create('auth.confirmEmailChange.error', 'ERROR');
    }
  }
}
```

- [ ] **Step 7: Run the test, verify it passes**

Run: `NX_CLI_SET=classic npx nx test eco-store-auth-feature-confirm-email-change`
Expected: PASS (3 tests).

- [ ] **Step 8: Write the component + template + routes + barrel**

Create `.../confirm-email-change/eco-store-auth-confirm-email-change.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { EcoStoreAuthContainerComponent } from '@plastik/eco-store/auth/container';
import { SharedFormFeatureComponent } from '@plastik/shared/form';

@Component({
  selector: 'eco-store-auth-confirm-email-change',
  imports: [TranslateModule, EcoStoreAuthContainerComponent, SharedFormFeatureComponent],
  templateUrl: './eco-store-auth-confirm-email-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthConfirmEmailChangeComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
}
```

Create `.../confirm-email-change/eco-store-auth-confirm-email-change.component.html`:

```html
<eco-store-auth-container [isLoading]="facade.isLoading?.() ?? false">
  <span title>{{ 'auth.confirmEmailChange.title' | translate }}</span>
  <div content>
    <p class="text-on-surface/80 text-md mb-4">
      {{ 'auth.confirmEmailChange.description' | translate }}
    </p>
    <plastik-shared-form-feature
      [fields]="facade.formConfig.getConfig()"
      [submitConfig]="facade.formConfig.getSubmitFormConfig?.() ?? null"
      (changeEvent)="facade.onSubmit($event)">
    </plastik-shared-form-feature>
  </div>
</eco-store-auth-container>
```

Create `.../src/lib/eco-store-auth-feature-confirm-email-change.routes.ts`:

```ts
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { Route } from '@angular/router';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseIsNotLoggedGuard } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { confirmEmailChangeFormConfig } from './confirm-email-change/confirm-email-change-form.config';
import { EcoStoreAuthConfirmEmailChangeFacadeService } from './confirm-email-change/eco-store-auth-confirm-email-change-facade.service';
import { EcoStoreAuthConfirmEmailChangeComponent } from './confirm-email-change/eco-store-auth-confirm-email-change.component';

export const ecoStoreAuthFeatureConfirmEmailChangeRoutes: Route[] = [
  {
    path: '',
    title: 'auth.confirmEmailChange.title',
    component: EcoStoreAuthConfirmEmailChangeComponent,
    canActivate: [pocketBaseIsNotLoggedGuard],
    providers: [
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
      { provide: AUTH_FORM_FACADE, useClass: EcoStoreAuthConfirmEmailChangeFacadeService },
      { provide: FORM_TOKEN, useFactory: confirmEmailChangeFormConfig },
      { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
      providePlainInputFormly(),
      providePasswordWithVisibilityFormly(),
    ],
  },
];
```

Replace `.../src/index.ts` with:

```ts
export * from './lib/eco-store-auth-feature-confirm-email-change.routes';
```

- [ ] **Step 9: Wire the public route**

In `apps/eco-store/src/app/app.routes.ts`, after the `restablir-contrasenya` route, add:

```ts
  {
    path: 'confirmar-correu',
    loadChildren: () =>
      import('@plastik/eco-store/auth/confirm-email-change').then(
        m => m.ecoStoreAuthFeatureConfirmEmailChangeRoutes
      ),
  },
```

- [ ] **Step 10: Add i18n keys**

In each of `apps/eco-store/public/i18n/{ca,es,en}.json`, inside the `auth` object (beside `resetPassword`), add a `confirmEmailChange` block. Catalan (`ca.json`):

```json
    "confirmEmailChange": {
      "title": "Confirmar el canvi de correu",
      "description": "Introdueix la teva contrasenya actual per confirmar el canvi de correu electrònic.",
      "passwordLabel": "Contrasenya actual",
      "submitButton": "Confirmar el canvi",
      "success": "Correu electrònic actualitzat. Torna a iniciar sessió amb el nou correu.",
      "error": "No s'ha pogut confirmar el canvi. L'enllaç pot haver caducat o la contrasenya és incorrecta."
    },
```

Add the Spanish (`es.json`) and English (`en.json`) equivalents (same keys, translated). Keep keys identical across the three files.

- [ ] **Step 11: i18n validate + lint + test the new lib**

Run: `yarn i18n:validate`
Expected: PASS.
Run: `NX_CLI_SET=classic npx nx run-many --target=lint,test --projects=eco-store-auth-feature-confirm-email-change --parallel=2`
Expected: PASS.

- [ ] **Step 12: Commit**

```bash
git add libs/eco-store/auth/feature/confirm-email-change tsconfig.base.json \
        apps/eco-store/src/app/app.routes.ts apps/eco-store/public/i18n/ca.json \
        apps/eco-store/public/i18n/es.json apps/eco-store/public/i18n/en.json
git commit -m "feat(eco-store): #86c9uq8mt PRV-02b public confirmar-correu confirmation page"
```

---

## Task 3: Inline request lib `profile/access-security` + nav rewire

**Files:**

- Generate lib: `libs/eco-store/profile/access-security/`
- Create: `.../src/lib/eco-store-profile-access-security-feature/eco-store-profile-access-security-feature.component.ts` + `.html`
- Create: `.../src/lib/eco-store-profile-access-security-feature/access-security-email-form.config.ts`
- Create: `.../src/lib/eco-store-profile-access-security-feature.routes.ts`
- Create/replace: `.../src/index.ts`
- Modify: `tsconfig.base.json` (alias `@plastik/eco-store/profile/access-security`)
- Modify: `libs/eco-store/profile/feature/src/lib/eco-store-profile-feature.routes.ts` (add `access-i-seguretat` child)
- Modify: `.../eco-store-profile-feature/eco-store-profile-sidenav-feature.component.html` (rewire the existing nav link `seguretat` → `access-i-seguretat`)
- Modify: `apps/eco-store/public/i18n/{ca,es,en}.json` (add `profile.accessSecurity.*`)
- Test: `.../eco-store-profile-access-security-feature/eco-store-profile-access-security-feature.component.spec.ts`

**Interfaces:**

- Consumes: `pocketBaseUserProfileStore.requestEmailChange` + `.user` (Task 1), `PocketBaseUser`, `SharedFormFeatureModule`, `providePlainInputFormly`.
- Produces: `ecoStoreProfileAccessSecurityFeatureRoutes: Route[]`.

- [ ] **Step 1: Generate the lib**

Run: `NX_CLI_SET=classic npx nx g @nx/angular:lib access-security --directory=eco-store/profile --tags=scope:eco-store,type:feature`
Set `test` in its `project.json` to `{ "executor": "@nx/vitest:test" }`; delete generator sample files.

- [ ] **Step 2: Add the path alias**

In `tsconfig.base.json`, beside `@plastik/eco-store/profile/addresses`, add:

```json
      "@plastik/eco-store/profile/access-security": [
        "libs/eco-store/profile/access-security/src/index.ts"
      ],
```

- [ ] **Step 3: Write the email form config (with same-as-current guard)**

Create `.../eco-store-profile-access-security-feature/access-security-email-form.config.ts`:

```ts
import { FormConfig } from '@plastik/core/entities';

/**
 * @description Form config for the inline email-change request.
 * Blocks submit when the new email equals the current one.
 * @param {string} currentEmail The user's current email, to reject as a no-op.
 * @returns {FormConfig<{ email: string }>} The request form config.
 */
export function accessSecurityEmailFormConfig(currentEmail: string): FormConfig<{ email: string }> {
  const formConfig = [
    {
      fieldGroup: [
        {
          key: 'email',
          type: 'input',
          props: {
            label: 'profile.accessSecurity.email.label',
            placeholder: 'profile.accessSecurity.email.label',
            required: true,
            translate: true,
            type: 'email',
            attributes: { autocomplete: 'off' },
          },
          validators: {
            notCurrent: {
              expression: (control: { value: string }) =>
                !control.value || control.value.trim().toLowerCase() !== currentEmail.toLowerCase(),
              message: () => 'profile.accessSecurity.error.sameEmail',
            },
            email: {
              expression: (control: { value: string }) =>
                !control.value || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(control.value),
              message: () => 'profile.accessSecurity.error.invalidEmail',
            },
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'profile.accessSecurity.submitButton',
      buttonStyle:
        'w-full md:w-auto mt-6 py-3 px-8 text-sys-on-primary bg-primary font-bold tracking-wide rounded-2xl shadow-md border-0',
    }),
  };
}
```

- [ ] **Step 4: Write the failing component test**

Create `.../eco-store-profile-access-security-feature/eco-store-profile-access-security-feature.component.spec.ts`:

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { provideTranslateService } from '@ngx-translate/core';
import { EcoStoreProfileAccessSecurityFeatureComponent } from './eco-store-profile-access-security-feature.component';

describe('EcoStoreProfileAccessSecurityFeatureComponent', () => {
  const requestEmailChange = vi.fn();
  let fixture: ComponentFixture<EcoStoreProfileAccessSecurityFeatureComponent>;
  let component: EcoStoreProfileAccessSecurityFeatureComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileAccessSecurityFeatureComponent],
      providers: [
        provideTranslateService(),
        {
          provide: pocketBaseUserProfileStore,
          useValue: { user: signal({ email: 'old@mail.com' }), requestEmailChange },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EcoStoreProfileAccessSecurityFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('submitting a new email calls store.requestEmailChange', () => {
    component['onSubmit']({ email: 'new@mail.com' });
    expect(requestEmailChange).toHaveBeenCalledWith('new@mail.com');
  });

  it('exposes the current email to the form config', () => {
    expect(component['currentEmail']()).toBe('old@mail.com');
  });
});
```

- [ ] **Step 5: Run the test, verify it fails**

Run: `NX_CLI_SET=classic npx nx test eco-store-profile-access-security-feature`
Expected: FAIL — component not found.

- [ ] **Step 6: Write the component + template**

Create `.../eco-store-profile-access-security-feature/eco-store-profile-access-security-feature.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { accessSecurityEmailFormConfig } from './access-security-email-form.config';

@Component({
  selector: 'eco-eco-store-profile-access-security-feature',
  imports: [SharedFormFeatureModule, TranslateModule],
  templateUrl: './eco-store-profile-access-security-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileAccessSecurityFeatureComponent {
  readonly #profileStore = inject(pocketBaseUserProfileStore);

  protected readonly currentEmail = computed(() => this.#profileStore.user()?.email || '');
  protected readonly formConfig = computed(() =>
    accessSecurityEmailFormConfig(this.currentEmail())
  );

  onSubmit({ email }: { email: string }) {
    if (email) {
      this.#profileStore.requestEmailChange(email);
    }
  }
}
```

Create `.../eco-store-profile-access-security-feature/eco-store-profile-access-security-feature.component.html`:

```html
<section class="flex flex-col gap-6">
  <p class="text-on-surface/80 text-md">{{ 'profile.accessSecurity.description' | translate }}</p>

  <p class="text-on-surface text-sm">
    {{ 'profile.accessSecurity.email.currentLabel' | translate }}:
    <strong>{{ currentEmail() }}</strong>
  </p>

  <plastik-shared-form-feature
    [fields]="formConfig().getConfig()"
    [submitConfig]="formConfig().getSubmitFormConfig?.() || {}"
    (changeEvent)="onSubmit($event)">
  </plastik-shared-form-feature>
</section>
```

- [ ] **Step 7: Run the test, verify it passes**

Run: `NX_CLI_SET=classic npx nx test eco-store-profile-access-security-feature`
Expected: PASS (2 tests).

- [ ] **Step 8: Write the routes + barrel**

Create `.../src/lib/eco-store-profile-access-security-feature.routes.ts`:

```ts
import { Route } from '@angular/router';
import { EcoStoreProfileAccessSecurityFeatureComponent } from './eco-store-profile-access-security-feature/eco-store-profile-access-security-feature.component';

export const ecoStoreProfileAccessSecurityFeatureRoutes: Route[] = [
  {
    path: '',
    data: { hasSidenav: true, title: 'profile.accessSecurity.title', icon: 'security' },
    component: EcoStoreProfileAccessSecurityFeatureComponent,
  },
];
```

Replace `.../src/index.ts`:

```ts
export * from './lib/eco-store-profile-access-security-feature.routes';
```

- [ ] **Step 9: Wire the profile child route**

In `libs/eco-store/profile/feature/src/lib/eco-store-profile-feature.routes.ts`, add a child after `adreces` and before the `**` redirect:

```ts
          {
            path: 'access-i-seguretat',
            title: 'profile.accessSecurity.title',
            data: {
              hasSidenav: true,
              title: 'profile.accessSecurity.title',
              icon: 'security',
              preferUserName: true,
            },
            providers: [providePlainInputFormly()],
            loadChildren: () =>
              import('@plastik/eco-store/profile/access-security').then(
                m => m.ecoStoreProfileAccessSecurityFeatureRoutes
              ),
          },
```

(`providePlainInputFormly` is already imported in this file.)

- [ ] **Step 10: Rewire the existing sidenav nav link**

In `.../eco-store-profile-feature/eco-store-profile-sidenav-feature.component.html`, the "Accés i seguretat" entry currently links to `seguretat`. Change both the `routerLink` and the `aria-current` check:

```html
<mat-list-item
  class="my-1"
  role="listitem"
  routerLinkActive="active"
  [routerLink]="['/', 'perfil', 'access-i-seguretat']"
  [attr.aria-current]="currentUrl().includes('/perfil/access-i-seguretat') ? 'page' : null">
  <div class="flex w-full items-center gap-2">
    <mat-icon aria-hidden="true" class="scale-90">security</mat-icon>
    <span matListItemTitle class="flex-1 truncate text-sm">Accés i seguretat</span>
  </div>
</mat-list-item>
```

- [ ] **Step 11: Add i18n keys**

In each `apps/eco-store/public/i18n/{ca,es,en}.json`, inside the `profile` object, add (Catalan shown):

```json
    "accessSecurity": {
      "title": "Accés i seguretat",
      "description": "Gestiona el correu electrònic d'accés al teu compte.",
      "email": {
        "label": "Nou correu electrònic",
        "currentLabel": "Correu actual"
      },
      "submitButton": "Canviar el correu",
      "success": {
        "requested": "T'hem enviat un enllaç de verificació al nou correu electrònic."
      },
      "error": {
        "requested": "No s'ha pogut sol·licitar el canvi de correu. Torna a provar-ho.",
        "sameEmail": "El nou correu ha de ser diferent de l'actual.",
        "invalidEmail": "Introdueix un correu electrònic vàlid."
      }
    },
```

Add the toast on success/error: the request is fire-and-forget from the component, so surface feedback
by extending the store's `requestEmailChange` (added in Task 1 Step 5) to call
`store._notificationService.create('profile.accessSecurity.success.requested', 'SUCCESS')` on success
and `store._notificationService.create('profile.accessSecurity.error.requested', 'ERROR')` on failure;
then re-run Task 1's store spec to confirm it still passes. Add the es/en equivalents of these keys.

- [ ] **Step 12: i18n validate + lint + test, then commit**

Run: `yarn i18n:validate`
Expected: PASS.
Run: `NX_CLI_SET=classic npx nx run-many --target=lint,test --projects=eco-store-profile-access-security-feature,auth-pocketbase-data-access --parallel=2`
Expected: PASS.

```bash
git add libs/eco-store/profile/access-security tsconfig.base.json \
        libs/eco-store/profile/feature \
        libs/shared/auth/pocketbase/data-access \
        apps/eco-store/public/i18n/ca.json apps/eco-store/public/i18n/es.json apps/eco-store/public/i18n/en.json
git commit -m "feat(eco-store): #86c9uq8mt PRV-02b inline email-change request in access-i-seguretat"
```

---

## Task 4: PocketBase email template reconfig

**Files:**

- Modify (via Admin UI → export): `apps/eco-store/pocketbase/pb_schema.json` (`confirmEmailChangeTemplate`)

This is a **manual backend step** done against the local PocketBase instance, then exported.

- [ ] **Step 1: Start PocketBase locally**

Run: `yarn eco-store:pocketbase:run` (or `yarn eco-store:local`). Open `http://localhost:8090/_/`.

- [ ] **Step 2: Edit the Confirm-email-change template**

`users` collection → Options → Mail templates → **Confirm email change**. Set the action URL to point at the app route instead of the admin dashboard:

```text
{APP_URL}/confirmar-correu?token={TOKEN}
```

Translate subject/body to Catalan, matching the existing password-reset template. Confirm `{APP_URL}`
matches what the password-reset template uses (per-tenant host resolution); if password-reset hardcodes
a single URL, follow that exact approach and note it.

- [ ] **Step 3: Export the schema**

Run: `yarn eco-store:pb:export`
Then: `yarn eco-store:pb:diff` — expect only the `confirmEmailChangeTemplate` field to have changed in `pb_schema.json`.

- [ ] **Step 4: Commit**

```bash
git add apps/eco-store/pocketbase/pb_schema.json
git commit -m "feat(eco-store): #86c9uq8mt PRV-02b point confirm-email-change template at the app route"
```

---

## Task 5: Docs — flip PRV-02b + fix ClickUp ID drift

**Files:**

- Modify: `apps/eco-store/TASKS.md`
- Modify: `apps/eco-store/BACKLOG.md`

- [ ] **Step 1: Flip status + correct the ClickUp ID**

In `apps/eco-store/TASKS.md`: change PRV-02b status `🔄` → `✅`; replace the wrong ClickUp id
`86c92g6ek` with `86c9uq8mt` in every PRV-02b reference (Current-focus table + PRV section); add a
done note; add a changelog row bumping the version. In `apps/eco-store/BACKLOG.md`: flip the PRV-02b
Phase-1 row to done with the corrected id; add a changelog row; bump the version in lockstep with
TASKS.md. Also note the wider `PRV-02*` id drift for a later `/sync-eco-store-tasks` pass — do **not**
fix the other PRV ids here unless verified.

- [ ] **Step 2: Commit (markdown fast-path)**

```bash
git add apps/eco-store/TASKS.md apps/eco-store/BACKLOG.md
git commit -m "docs(eco-store): #86c9uq8mt PRV-02b mark done + correct ClickUp id + bump"
```

---

## Wrap-up (after all tasks)

- [ ] Push the branch: `git push -u origin feat/86c9uq8mt-prv02b-email-change` (pre-push runs affected lint/test/build + eco-store:a11y).
- [ ] Open a PR referencing PRV-02b + `#86c9uq8mt`; CHANGELOG entry describes the email-change flow.
- [ ] Manual verification: log in → `/perfil/access-i-seguretat` → submit a new email →
      confirm the mail links to `/confirmar-correu?token=…` → open it (logged out) →
      enter the current password → land on `/accedir`, log in with the new email.
- [ ] On merge: mark ClickUp `86c9uq8mt` complete.

## Self-review notes

- **CHANGELOG:** add the bullet in the **feature** commit (Task 2 or 3), not a standalone commit —
  per the repo's CHANGELOG-in-feature-commit rule. Stage `CHANGELOG.md` in the Task 2/3 commit (or
  the wrap-up PR commit). Folded here to avoid a CHANGELOG-only commit.
- **Toast on request:** Task 3 Step 11 moves the success/error toast into the store method (Task 1) so
  the fire-and-forget component still gives feedback — re-run Task 1's spec after that edit.
- **Type consistency:** `confirmEmailChange` takes `ConfirmEmailChangeData { token, password }`
  everywhere (store + facade + spec); `requestEmailChange` takes a bare `string` everywhere; the
  confirm facade's form model is `Pick<ConfirmEmailChangeData, 'password'>`.
