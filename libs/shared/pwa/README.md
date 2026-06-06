# shared/pwa

Shared library providing a PWA install prompt for Angular apps. Handles the
`beforeinstallprompt` browser event, persists dismiss state, and shows a
Material bottom sheet with install / dismiss CTAs.

## Architecture

```bash
PwaInstallService        — singleton service (providedIn: 'root')
PwaManifestService       — optional singleton service (providedIn: 'root')
PwaPromptComponent       — bottom sheet UI component (lazily loaded)
PWA_APP_DATA_FN          — injection token to supply app identity (name/logo)
```

The library has **no dependency on any app-scoped code**. App identity data is
injected via `PWA_APP_DATA_FN` so each consuming app wires up its own source.

## Setup

### 1. Provide app identity data

In your `app.config.ts`:

```typescript
import { inject } from '@angular/core';
import { PWA_APP_DATA_FN } from '@plastik/shared/pwa';
import { myTenantStore } from '@my-app/tenant';

{
  provide: PWA_APP_DATA_FN,
  useFactory: () => {
    const store = inject(myTenantStore);
    return () => {
      const tenant = store.tenant();
      return { name: tenant?.name, logo: tenant?.logo };
    };
  },
},
```

### 2. Trigger the install service

Inject `PwaInstallService` in your root `AppComponent` so browser event
listeners are registered. On iOS, trigger the prompt manually after a short
delay (iOS does not fire `beforeinstallprompt`):

```typescript
constructor() {
  const pwa = inject(PwaInstallService);

  // Android: handled automatically via beforeinstallprompt event.
  // iOS Safari: trigger manually after first paint.
  setTimeout(() => {
    if (pwa.isIos() && pwa.shouldShowPrompt()) pwa.showPrompt();
  }, 5000);
}
```

The service automatically:

- Skips initialization when running in standalone (already-installed) mode.
- Skips initialization during SSR.
- Checks the dismiss / installed state before showing the prompt.
- Shows the prompt again after `DISMISS_DAYS` (15) days.

### 3. Apply dynamic branding (optional)

Inject `PwaManifestService` and call `applyBranding()` once tenant data is
available to patch the web app manifest and `apple-touch-icon` with the
tenant's name and logo:

```typescript
const manifest = inject(PwaManifestService);

effect(() => {
  const tenant = tenantStore.tenant();
  if (tenant) {
    manifest.applyBranding({ name: tenant.name, logo: tenant.logo });
  }
});
```

`applyBranding` is a no-op on the server (SSR-safe) and when neither a name nor
a logo is provided. It fetches the static `/manifest.webmanifest`, patches the
name/short_name when a name is provided and the icons + `apple-touch-icon` when
a logo is provided (tenants without a logo keep the static fallback icons), and
replaces the manifest `<link>` with a Blob URL. The Blob URL is revoked
automatically on destroy.

## Dismiss / install state

| localStorage key    | Meaning                                   |
| ------------------- | ----------------------------------------- |
| `eco_pwa_dismissed` | Unix timestamp of last dismissal          |
| `eco_pwa_installed` | `"1"` when the user accepted installation |

## Testing in DevTools (Chrome)

1. Open DevTools → **Application** tab → **Manifest**.
2. Scroll to **Add to homescreen** and click **Add to homescreen** to
   simulate the `beforeinstallprompt` event.
3. To reset state: open **Application → Storage → Clear site data** (clears
   `localStorage` entries above).
4. To test iOS instructions: in DevTools → **Sensors**, set **User agent** to
   `Mobile Safari` on an iPhone/iPad UA string.

## Translations

All UI strings are keyed under `common.pwa.*` in the app's i18n JSON files:

| Key                                  | Used when                        |
| ------------------------------------ | -------------------------------- |
| `common.pwa.title`                   | Always                           |
| `common.pwa.description`             | Always                           |
| `common.pwa.install`                 | Android / Chrome install button  |
| `common.pwa.later`                   | Android / Chrome defer button    |
| `common.pwa.close`                   | iOS and non-Safari close button  |
| `common.pwa.howToInstall`            | iOS Safari step list eyebrow     |
| `common.pwa.iosInstructionsStep1`    | iOS ≥ 17 (Share button location) |
| `common.pwa.iosInstructionsStep1Old` | iOS < 17 (Share button location) |
| `common.pwa.iosInstructionsStep2`    | iOS: "Add to Home Screen" scroll |
| `common.pwa.iosInstructionsStep3`    | iOS: confirm add                 |
| `common.pwa.iosSafariRequired`       | iOS with non-Safari browser      |

## Running unit tests

```bash
yarn nx test pwa
```
