# core-cms-layout-ui-header

## Description

A core basic header with content configuration options.

## Content projection

| Selector  | Description                              |
| --------- | ---------------------------------------- |
| `[start]` | The contents at the left of the header.  |
| `[end]`   | The contents at the right of the header. |

## How to use

- Import the `CoreCmsLayoutUiHeaderComponent` in your root component app.

- Insert the component in your template and use content projection.

```html
<!-- component template -->

<plastik-core-cms-layout-ui-header>
  <div start>
    <a href="">
      <svg-icon *ngIf="headerConfig.mainIcon as icon" [src]="icon.iconPath" [svgClass]="icon.svgClass"></svg-icon>
      <span class="text-md">{{ headerConfig.mainTitle }}</span>
    </a>
  </div>
  <div end>
    <svg-icon *ngIf="headerConfig.secondaryIcon as icon" [src]="icon.iconPath" [svgClass]="icon.svgClass"></svg-icon>
  </div>
</plastik-core-cms-layout-ui-header>
```

## Running unit tests

Run `nx test core-cms-layout-ui-header` to execute the unit tests.
