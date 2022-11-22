# shared-header

## Description

A shared header with material toolbar.

## Dependencies

- MatToolbarModule

## How to use

- Import the `SharedHeaderModule` in your feature module.

- Insert the component in your template using content projection for toolbar elements to right or left.

```html
<!-- component template -->

<plastikspace-header>
  <div start>
    <p>Company Name</p>
  </div>
  <div end>
    <button (click)="sidenav.toggle()">
      <mat-icon>menu</mat-icon>
    </button>
  </div>
</plastikspace-header>
```

## Running unit tests

Run `nx test shared-header` to execute the unit tests.
