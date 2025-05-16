# shared-activity-ui

- [shared-activity-ui](#shared-activity-ui)
  - [Description](#description)
  - [Linear](#linear)
    - [HTML element](#html-element)
    - [Inputs](#inputs)
    - [Examples](#examples)
    - [How to style](#how-to-style)
  - [Overlay](#overlay)
    - [HTML element](#html-element-1)
    - [Content projection](#content-projection)
    - [Examples](#examples-1)
  - [Running unit tests](#running-unit-tests)
  - [Useful links](#useful-links)

## Description

Shared activity indicators to indicate some activity.

## Linear

### HTML element

`<plastik-shared-activity-ui-linear>`

### Inputs

| Name     | Type              | Description                                                                                     | Default         |
| -------- | ----------------- | ----------------------------------------------------------------------------------------------- | --------------- |
| `active` | `boolean`         | Adds active class to indicator, that should be styled to show some kind of activity.            | false           |
| `mode`   | `ProgressBarMode` | Sets the type of material progress bar ('determinate' \| indeterminate' \| 'buffer' \| 'query') | 'indeterminate' |

### Examples

Use the shared component into a parent component.

- Import it into your app or feature module.

```typescript
import { SharedActivityUiLinearComponent } from '@plastik/shared/activity/ui';

@Component({
  selector: 'parent',

  imports: [SharedActivityUiLinearComponent],
  templateUrl: './parent.component.html',
})
export class ParentComponent {}
```

- Add the shared component into your component template.

```html
<plastik-shared-activity-ui-linear [active]="active$ | async"></plastik-shared-activity-ui-linear>
```

### How to style

You can overwrite the styles from your main application declaring these CSS variables in your app `styles/_theme.scss` file:

```css
- --plastik-mdc-linear-progress-track-height: var(--spacing-tiny);
- --plastik-mdc-linear-progress-active-indicator-height: var(--spacing-tiny);
- --plastik-mdc-linear-progress-active-indicator-color: rgb(var(--secondary-dark));
- --plastik-mdc-linear-progress-track-color: rgb(var(--secondary-light));
```

## Overlay

### HTML element

`<plastik-shared-activity-ui-overlay>`

### Content projection

| Selector | Description                                                               |
| -------- | ------------------------------------------------------------------------- |
| ``       | Add any html inside the element, like text or any loading style animation |

### Examples

Use the shared component into a parent component.

- Import it into your app or feature module.

```typescript
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';

@Component({
  selector: 'parent',

  imports: [SharedActivityUiOverlayComponent],
  templateUrl: './parent.component.html',
})
export class ParentComponent {}
```

- Add the shared component into your component template.

```html
<plastik-shared-activity-ui-overlay *ngrxLet="active$">
  Loading...
</plastik-shared-activity-ui-overlay>
```

## Running unit tests

Run `nx test shared-activity-ui` to execute the unit tests.

## Useful links

- [Material Progress Bar](https://material.angular.io/components/progress-bar/overview)
- [The Four Ways To Create Loading Spinners In An Angular App](https://christianlydemann.com/four-ways-to-create-loading-spinners-in-an-angular-app/)
