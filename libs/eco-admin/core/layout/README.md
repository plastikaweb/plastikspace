# @plastik/eco-admin/layout

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-admin/layout](#plastikeco-adminlayout)
  - [What it draws](#what-it-draws)
  - [Layers](#layers)
  - [How the rail works](#how-the-rail-works)
  - [Top bar](#top-bar)
  - [Colours](#colours)
  - [Not built yet](#not-built-yet)
  - [Testing](#testing)

The application shell of **eco-admin** (AP-0 0.7, part 2): the side navigation, the top bar and the main landmark every signed-in view renders in.
Project `eco-admin-layout`, tags `scope:eco-admin` + `type:feature`. The app lazy-loads `EcoAdminLayoutComponent` as the parent route of every section.

The design contract is the frozen corpus of round 40.18: `00 Components/Rail`, `00 Components/Top bar`, `00 Components/Calaix mòbil`, `01 Tauler/Shell Tauler A` and `10 Superadmin/Vista Superadmin`.

## What it draws

| Piece                       | Selector               | What it holds                                                                                    |
| :-------------------------- | :--------------------- | :----------------------------------------------------------------------------------------------- |
| `EcoAdminLayoutComponent`   | `eco-admin-layout`     | `mat-sidenav-container`: the drawer, then the rail, the top bar and `<main id="mainContent">`.   |
| `EcoAdminNavPanelComponent` | `eco-admin-nav-panel`  | The header (the «menu» button beside the content), who the panel belongs to, one link per entry. |
| `EcoAdminTopBarComponent`   | `eco-admin-top-bar`    | The title of the view, the language and theme menus, the account menu.                           |
| `EcoAdminShellState`        | provided by the layout | AMPLE or PLEGAT, whether the rail is folded, whether the drawer is open.                         |

Only `EcoAdminLayoutComponent` is exported. The entries come from `EcoAdminNavigation` in [`@plastik/eco-admin/layout-config`](../layout-config/README.md): the tenant's ten or the platform's three.
The names in the rail header, `ECO_ADMIN_APP_NAME` and `ECO_ADMIN_PLATFORM_NAME`, come from [`@plastik/eco-admin/entities`](../entities/README.md).

## Layers

| Layer  | Viewport | Rail                                               | «menu»                     |
| :----- | :------- | :------------------------------------------------- | :------------------------- |
| AMPLE  | ≥ 976 px | 256 px expanded or 72 px folded, the user's choice | Folds or expands the rail. |
| PLEGAT | < 976 px | 72 px, whatever the choice says                    | Opens the drawer.          |

976 = 720 px of panel + 256 px of rail (`ECO_ADMIN_AMPLE_MIN_PX`, internal to the lib).
CALAIX, with no rail at all, belongs to the four phone surfaces, which do not exist yet; with no rail, its «menu» will be in its top bar.
Until then, a top bar under 560 px wide (a phone only) closes its gaps, so the account menu always fits; the title gives way with an ellipsis.

## How the rail works

- The rail is a plain column inside `mat-sidenav-content`, beside the top bar and `<main>`: 256 or 72 px, and the content takes the rest.
- It slides between the two widths in 0.2 s only after the user folds or expands it (`railAnimated`).
  On load it starts at its final width, so a rail folded in an earlier visit never animates closed. No motion under `prefers-reduced-motion`.
- The folded choice is kept per user in `localStorage` under `eco-admin-rail:<userId>`. A browser that refuses its storage keeps it for the visit.
- Folded, each label stays in the accessibility tree (`sr-only`) and shows in a tooltip on the right.
- The current entry carries `aria-current="page"`.
- The rail's header is «menu», as in ChatGPT or Linear: the mark and who the panel belongs to are one button.
  - Expanded, it ends with `left_panel_close`, and folds the rail.
  - Folded, it is the mark alone; under the pointer or the focus the mark turns into `left_panel_open`, and a tooltip says what it does.
  - Its name starts with the words on screen and ends with the action, «El Llevat, Eco Admin, Plega el menú» (WCAG 2.5.3); folded, it is the action alone.
  - The mock draws «menu» in the top bar and the header as plain text.
- The drawer is Material's `mat-sidenav` in `over` mode, 290 px with 48 px rows, a modal dialog (`role="dialog"`, `aria-modal`) with a focus trap. Its header is plain, with a close button.
  - The rail behind it stays focusable, so Material can give the focus back to «menu».
    Its navigation is «Navegació principal» and the drawer's «Navegació», so the two landmarks keep distinct names.
  - Material brings the scrim, Escape, the focus trap, the focus back to «menu» and the animation.
    The shell state closes it on its close button, on a navigation and when the window grows to AMPLE. `openedChange(false)` reports Material's own closes.
  - A left swipe of 80 px or more closes it too: `plastikSwipeToClose`, from [`@plastik/shared/util/swipe-to-close`](../../../shared/util/swipe-to-close/README.md).
- «menu» says whether what it controls is expanded (`aria-expanded`) and names it (`aria-controls`): the rail in AMPLE, the drawer while it is open in PLEGAT.

## Top bar

- The title is the route's `title`, the i18n key of the rail label; the page title says the same through `EcoAdminTitleStrategy`.
- Language: the shared `plastik-language-switcher`.
  A change is applied, remembered in `localStorage['eco-lang']` and written to `users.language`, which the PocketBase mail hooks read.
- Theme: the shared `plastik-mat-theme-toggle`.
- Account: the two initials of the user, for both roles.
  The menu names the user and the role (and the tenant, for a tenant administrator) and offers «Tanca la sessió», which closes the session and goes to `/accedir`.
- No SUPERADMIN chip: the platform rail already says «Eco Platform · Superadmin», on a fill that is dark in both themes.

## Colours

Every colour is a Material role from `eco_tokens`; none is fixed.
The platform rail is dark in both themes: its fill follows the page (`neutral-variant20` in light, `surface-container-lowest` in dark),
and its content sets `color-scheme: dark`, so every `light-dark()` role inside it takes its dark value.

## Not built yet

- The store chip of the top bar (row 0.6d), the Sol·licituds badge (AP-1).
- The crumb and the way back of the top bar (row 0.4, with the first detail view).
- A redirect away from `/cicles` for a tenant without cycles: the rail hides the entry, the route stays.
- «El meu perfil» and «Preferències» in the account menu.

## Testing

`nx test eco-admin-layout`. The specs replace the CDK `BreakpointObserver` to move between AMPLE and PLEGAT,
and use the mocks of the profile store and the tenant-context store, with Material's animations off. Each component is checked with axe, the drawer open included.
The swipe itself is tested in its own lib; here one test checks that it closes the drawer.
