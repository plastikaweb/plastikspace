# shared-ui-header

## Description

A shared header with material toolbar.

## Dependencies

- MatToolbarModule

## How to use

- Import the `SharedUiHeaderModule` in your feature module.

- Insert the component in your template using content projection for toolbar elements to start or end.

```html
<!-- component template -->

<plastikspace-ui-header>
  <div start>
    <p>Company Name</p>
  </div>
  <div end>
    <button (click)="sidenav.toggle()">
      <mat-icon>menu</mat-icon>
    </button>
  </div>
</plastikspace-ui-header>
```

## Running unit tests

Run `nx test shared-ui-header` to execute the unit tests.
