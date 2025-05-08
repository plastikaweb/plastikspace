# core-cms-layout-ui-sidenav

- [core-cms-layout-ui-sidenav](#core-cms-layout-ui-sidenav)
  - [Description](#description)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Content projection](#content-projection)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A core basic sidenav with content configuration options.

## Inputs

| Name              | Type            | Description                                                 | Default |
| ----------------- | --------------- | ----------------------------------------------------------- | ------- |
| `position`        | "start" / "end" | Position sidenav to the left or to the right in the layout. | "start" |
| `mode`            | MatDrawerMode   | Mode of the drawer; one of 'over', 'push' or 'side'.        | "over"  |
| `fixedInViewport` | boolean         | Whether the sidenav is fixed in the viewport.               | false   |
| `sidenavOpened`   | boolean         | Whether the drawer is opened.                               | false   |

## Outputs

| Name            | Type                    | Description                     |
| --------------- | ----------------------- | ------------------------------- |
| `toggleSidenav` | `EventEmitter<boolean>` | Emits the toggle sidenav event. |

## Content projection

| Selector       | Description                                |
| -------------- | ------------------------------------------ |
| `[header]`     | The contents at the top of the sidenav.    |
| `[menu-items]` | The sidenav main content.                  |
| `[footer]`     | The contents at the bottom of the sidenav. |

## How to use

- Import the `CoreCmsLayoutUiSidenavComponent` in your parent component.

- Insert the component in your template and use content projection and data flow to change state.

```html
<!-- component template -->

<plastik-core-cms-layout-ui-sidenav
  [position]="end"
  [mode]="'side'"
  [fixedInViewport]="false"
  [sidenavOpened]="(sidenavOpened$ | ngrxPush) || false"
  (toggleSidenav)="onToggleSidenav()">
  <h1 header>Menu</h1>
  <mat-list menu-items>
    @ngFor (let item of sidenavConfig) {
    <mat-list-item [routerLink]="item?.route">
      <mat-icon> {{ item.icon }} </mat-icon>
      <span>{{ item.title }}</span>
    </mat-list-item>
    }
  </mat-list>
  <p footer>&copy; 2023</p>
</plastik-core-cms-layout-ui-sidenav>
```

## Running unit tests

Run `nx test core-cms-layout-ui-sidenav` to execute the unit tests.
