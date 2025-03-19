# shared-util-dynamic-bg-color

- [shared-util-dynamic-bg-color](#shared-util-dynamic-bg-color)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A simple directive to highlight the background of a HTML element on hover.

## How to use

- Import `SharedUtilDynamicBgColorDirective` into your component.

```typescript
import { SharedUtilDynamicBgColorDirective } from '@plastik/shared/dynamic-bg-color';

@Component({
  standalone: true,
  imports: [SharedUtilDynamicBgColorDirective],
  selector: 'exp-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
```

- use it in your template

```html
<h1 plastikDynamicBgColor color="orange">Welcome</h1>
```

## Running unit tests

Run `nx test shared-util-dynamic-bg-color` to execute the unit tests.
