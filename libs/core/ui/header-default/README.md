# core-ui-header-default

- [core-ui-header-default](#core-ui-header-default)
  - [Description](#description)
  - [Dependencies](#dependencies)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A core default header with material toolbar.

## Dependencies

- MatToolbarModule

## How to use

- Import the `CoreUiHeaderDefaultComponent` in your root component app.

- Insert the component in your template using content projection for toolbar elements to start or end.

```html
<!-- component template -->

<plastik-header-default>
  <div start>
    <p>Company Name</p>
  </div>
  <div end>
    <button (click)="sidenav.toggle()">
      <mat-icon>menu</mat-icon>
    </button>
  </div>
</plastik-header-default>
```

## Running unit tests

Run `nx test core-ui-header-default` to execute the unit tests.
