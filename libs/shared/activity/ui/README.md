# shared-activity-ui

- [shared-activity-ui](#shared-activity-ui)
  - [Description](#description)
  - [HTML element](#html-element)
  - [Inputs](#inputs)
  - [Examples](#examples)
  - [How to style](#how-to-style)
  - [Running unit tests](#running-unit-tests)
  - [Useful links](#useful-links)

## Description

Shared linear activity indicator to indicate some activity.

## HTML element

`<plastik-shared-activity-ui-linear>`

## Inputs

| Name     | Type              | Description                                                                                     | Default         |
| -------- | ----------------- | ----------------------------------------------------------------------------------------------- | --------------- |
| `active` | `boolean`         | Adds active class to indicator, that should be styled to show some kind of activity.            | false           |
| `mode`   | `ProgressBarMode` | Sets the type of material progress bar ('determinate' \| indeterminate' \| 'buffer' \| 'query') | 'indeterminate' |

## Examples

Use the shared component into a parent component.

- Import it into your app or feature module.

```typescript
import { SharedActivityUiLinearComponent } from '@plastik/shared/activity/ui';

@Component({
  selector: 'parent',
  standalone: true,
  imports: [SharedActivityUiLinearComponent],
  templateUrl: './parent.component.html',
})
export class ParentComponent {}
```

- Add the shared component into your component template.

```html
<plastik-shared-activity-ui-linear [active]="active$ | async"></plastik-shared-activity-ui-linear>
```

## How to style

If you want to overwrite the default color styling and height for the progress bar background and indicator `using tailwind vars`, you can add to your app styles:

```css
.mat-mdc-progress-bar {
  @apply bg-secondary-light;
  --mdc-linear-progress-track-height: var(--spacing-tiny);
  --mdc-linear-progress-active-indicator-color: var(--secondary-dark);
}
```

## Running unit tests

Run `nx test shared-activity-ui` to execute the unit tests.

## Useful links

- [Material Progress Bar](https://material.angular.io/components/progress-bar/overview)
