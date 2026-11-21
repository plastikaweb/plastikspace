# @plastik/auth/feature

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/auth/feature](#plastikauthfeature)
  - [Description](#description)
  - [Usage](#usage)
    - [A view that projects its parts](#a-view-that-projects-its-parts)
    - [A view that projects nothing](#a-view-that-projects-nothing)
  - [What the application says once](#what-the-application-says-once)
  - [Inputs](#inputs)
  - [The notice over the form](#the-notice-over-the-form)
  - [Where a flow ended](#where-a-flow-ended)
  - [What the application must bring](#what-the-application-must-bring)
  - [Running unit tests](#running-unit-tests)

## Description

`plastik-auth-feature` (`AuthFeatureComponent`) is the screen every auth view of an application is drawn in: the mark and the name of the application
over a Material card, the heading of the view, what the last attempt ended in, the form, the foot of the card and the theme control.

It is the one auth screen of eco-store and eco-admin (it replaced the storefront's own `eco-store-auth-container`), and of llecoop.
The library exports the component and nothing else: the contracts it reads (`AuthFormFacade`, `AUTH_FORM_FACADE`, `AuthScreenDefaults`, `AUTH_SCREEN_DEFAULTS`,
`AuthFormMessage`) live in `@plastik/auth/entities`. Project `plastik-shared-auth-feature`, tags `scope:shared` + `type:feature`.

## Usage

### A view that projects its parts

A view fills up to three slots, and hands over the state of its facade:

```html
<plastik-auth-feature
  [isLoading]="facade.isLoading?.() ?? false"
  [error]="facade.error?.() ?? null"
  [success]="facade.success?.() ?? null">
  <span title>{{ 'auth.login.title' | translate }}</span>
  <span description>{{ 'auth.forgotPassword.description' | translate }}</span>

  <div content>
    <plastik-shared-form-feature
      [fields]="facade.formConfig.getConfig()"
      [submitConfig]="facade.formConfig.getSubmitFormConfig?.() ?? null"
      (pendingChangesEvent)="$event && facade.clearError?.()"
      (changeEvent)="facade.onSubmit($event)" />
  </div>
</plastik-auth-feature>
```

| Slot            | Drawn as                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `[title]`       | The `<h2>` of the card. Left empty, the heading is hidden.                                                                            |
| `[description]` | The paragraph under the heading. Its lines are balanced (`text-balance`), so a sentence never leaves one word alone on the last line. |
| `[content]`     | Whatever the view needs under the notice: the form, links, a message.                                                                 |

The view decides when a notice goes away: the line `(pendingChangesEvent)="$event && facade.clearError?.()"` clears it as soon as a field is edited.

### A view that projects nothing

With no `[content]`, the screen draws the form of the facade its route provides under `AUTH_FORM_FACADE`, with the facade's `extraLinks` under it.
This is how llecoop uses it. The notice of such a view still comes through the `error` and `success` inputs.

## What the application says once

What surrounds the slots is the same on every auth view of an application, so the application says it once, under `AUTH_SCREEN_DEFAULTS`:

```ts
export function provideEcoAdminAuthScreen(): Provider {
  return {
    provide: AUTH_SCREEN_DEFAULTS,
    useFactory: (): AuthScreenDefaults => ({
      title: signal('Eco Admin'),
      subtitle: toSignal(inject(TranslateService).stream('auth.frame.subtitle'), {
        initialValue: '',
      }),
      icon: 'eco',
      cardClass: 'eco-shake-on-error',
    }),
  };
}
```

| Key         | Type                     | What it says                                                                         |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `title`     | `Signal<string>`         | The name over the card (`<h1>`).                                                     |
| `subtitle`  | `Signal<string>`         | The line under the name.                                                             |
| `logo`      | `Signal<string \| null>` | The image of the mark, as the image loader of the application takes it.              |
| `icon`      | `string`                 | The icon drawn while there is no `logo`. `lock` when nobody says one.                |
| `footer`    | `Signal<string>`         | The line at the foot of the card.                                                    |
| `cardClass` | `string`                 | Classes added to the card, for a behaviour such as the shake on an error.            |
| `canGoBack` | `Signal<boolean>`        | Whether the way back is drawn, for an installed application that has no browser bar. |
| `goBack`    | `() => void`             | What the way back does.                                                              |

The texts are signals because they change after the screen is drawn: a tenant loads, the language changes.
It is a provider, and not a wrapper component per application, so that a view of either application reads `<plastik-auth-feature>` and nothing between.

**How the card looks is not said here.** An application that wants another fill or an edge writes it in a stylesheet, from its palette:

```scss
plastik-auth-feature .mat-mdc-card {
  background-color: var(--eco-auth-card-background);
  outline: 1px solid var(--mat-sys-outline-variant);
}
```

The rule must stay out of any cascade layer to win over the fill utility of the card. The card switches its border off and owns its box shadow, both with `!important`,
so an edge is an `outline`. eco-store and eco-admin share this rule (`eco_auth_card`, [`libs/eco/styles`](../../../eco/styles/README.md)) and each one names its fill;
an application that loads no such rule keeps the card as the screen draws it.

## Inputs

A view hands over the state of its attempt:

| Input       | Type                      | Default | What it does                                                      |
| ----------- | ------------------------- | ------- | ----------------------------------------------------------------- |
| `isLoading` | `boolean`                 | `false` | An attempt is running: the card is dimmed and takes no pointer.   |
| `error`     | `AuthFormMessage \| null` | `null`  | Why the last attempt failed.                                      |
| `success`   | `AuthFormMessage \| null` | `null`  | How the last attempt ended well. Shown while there is no `error`. |
| `outcome`   | `AuthFormMessage \| null` | `null`  | Where the flow of the view ended. See below.                      |

Four more inputs name the application. They are **llecoop's**, which mounts the screen straight on its routes and fills them from the `data` of each route
(`withComponentInputBinding()`); they go when llecoop does. An eco view sets none of them: its application speaks through `AUTH_SCREEN_DEFAULTS`.

| Input      | Type             | What it does                                                                          |
| ---------- | ---------------- | ------------------------------------------------------------------------------------- |
| `title`    | `string`         | The name over the card. Wins over the one of the defaults.                            |
| `logo`     | `string \| null` | The image of the mark. Wins over the one of the defaults.                             |
| `name`     | `string`         | Who signs the foot of the card, followed by the year, when the defaults give no foot. |
| `nameLink` | `string`         | Where that name links to.                                                             |

The line under the name, the icon, the foot and the classes of the card have no input: nothing set them, and on a screen mounted straight on a route
every input can also be set from the query string of the address.

## The notice over the form

How an attempt ended is said inside the card, by the shared alert (`plastik-shared-alert`), never in a toast:

- An `AuthFormMessage` carries `title`, and optionally `body`, `type` and `link`. All three texts are translation keys. Without a `type`, an error is drawn as `ERROR` and a success as `SUCCESS`.
- The alert is a live region (`role="alert"`). A failure also takes the focus, so that the keyboard goes on from it.
- The alert stays a column at every width, with its link under its text. On its own the shared alert turns into a row from the `md` breakpoint,
  and the card is never wide enough for that: the link took the right-hand side and left the text a third of the line.
- The notice is drawn again for every failed attempt. An application that wants the card to shake on a failure adds a class that reacts to the alert being there
  (eco: `eco-shake-on-error`, `libs/eco/styles`).
- When the screen is destroyed it calls `clearError()` on the facade, which can outlive the visit: the next one must not open on an old failure.

## Where a flow ended

Some views end: the password was changed, the link no longer works. Nothing is left to fill in, so a notice over a form is the wrong shape for it.
A view hands that end to `outcome`, and the screen draws it **in place of** the heading, the description and the notice:

```html
<plastik-auth-feature [outcome]="facade.success?.() ?? facade.error?.() ?? null">
  <span title>{{ 'auth.resetPassword.title' | translate }}</span>
  <div content>
    @if (facade.canSubmit?.() ?? true) {
    <plastik-shared-form-feature … />
    }
  </div>
</plastik-auth-feature>
```

- It is a heading (`title`), one sentence (`body`) and one filled link (`link`), with no coloured box and no icon. `type` is not read.
- The panel is a `role="group"` named by its heading and described by its sentence, and **it takes the focus when it appears**:
  the button the user pressed has usually just left the screen. A focus set this way shows its ring only while the keyboard is in use.
- `[content]` is still drawn under it. Taking the form away is the view's part (`canSubmit`), and so is whatever link stays under the end.
- While `outcome` is set, `error` and `success` draw nothing; the card does not shake either, since no alert appears.

It is an input of the shared screen, and not markup of each view, so that the focus and the semantics are written once for every application.

## What the application must bring

- The translation keys of the theme control (`common.theme.*`), and `auth.common.back` if it provides `canGoBack`.
- An icon font holding its mark, `arrow_back` if it provides `canGoBack`, the icons of the alert (`error`, `warning`, `check_circle`, `info`) and of the theme control
  (`light_mode`, `dark_mode`, `desktop_mac`).
- `<main id="mainContent" tabindex="-1">` is drawn by the screen: an application must not wrap an auth view in a `<main>` of its own.

The theme control is loaded on idle (`@defer`), so it stays out of the chunk of the view.

## Running unit tests

Run `nx test plastik-shared-auth-feature` to execute the unit tests.
