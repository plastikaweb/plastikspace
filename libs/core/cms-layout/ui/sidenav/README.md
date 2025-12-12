# @plastik/core/cms-layout/ui/sidenav

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/core/cms-layout/ui/sidenav](#plastikcorecms-layoutuisidenav)
  - [Description](#description)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Content Projection](#content-projection)
  - [Usage](#usage)
  - [Running Unit Tests](#running-unit-tests)

## Description

A **Core Sidenav Component** wrapper around `mat-sidenav` with built-in layout logic and content zones.

## Inputs

| Name              | Type              | Description                            | Default   |
| :---------------- | :---------------- | :------------------------------------- | :-------- |
| `position`        | `"start" / "end"` | Position of the sidenav (left/right).  | `"start"` |
| `mode`            | `MatDrawerMode`   | Mode: `'over'`, `'push'`, or `'side'`. | `"over"`  |
| `fixedInViewport` | `boolean`         | Whether the sidenav is fixed.          | `false`   |
| `sidenavOpened`   | `boolean`         | Control the open/close state.          | `false`   |

## Outputs

| Name            | Type                    | Description                      |
| :-------------- | :---------------------- | :------------------------------- |
| `toggleSidenav` | `EventEmitter<boolean>` | Emitted when visibility toggles. |

## Content Projection

| Selector       | Description                           |
| :------------- | :------------------------------------ |
| `[header]`     | Content at the top of the sidenav.    |
| `[menu-items]` | Main navigation list or content.      |
| `[footer]`     | Content at the bottom of the sidenav. |

## Usage

```html
<plastik-core-cms-layout-ui-sidenav
  [position]="'start'"
  [mode]="'side'"
  [sidenavOpened]="isOpen"
  (toggleSidenav)="onToggle($event)">
  <h1 header>Menu Header</h1>

  <mat-list menu-items>
    <mat-list-item>Home</mat-list-item>
    <mat-list-item>Profile</mat-list-item>
  </mat-list>

  <p footer>Footer Content</p>
</plastik-core-cms-layout-ui-sidenav>
```

## Running Unit Tests

Run `nx test core-cms-layout-ui-sidenav` to execute the unit tests.
