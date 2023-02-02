# shared-button-ui

## Description

A highly configurable button wrapper.

It accepts an array of content of type `ButtonElement` and outputs an event on click.

> ButtonElement accepts string, SvgIconConfig and observables of both.

```typescript
type ButtonElement = string | SvgIconConfig | Observable<string | SvgIconConfig>;
```

## Dependencies

- MatButtonModule
- AngularSvgIconModule

## Inputs

| Name     | Type           | Description                                                                    | Default   |
| -------- | -------------- | ------------------------------------------------------------------------------ | --------- |
| `config` | `ButtonConfig` | A configuration object that passes a button configuration to build the button. | undefined |

## Outputs

| Name         | Type                         | Description                                       |
| ------------ | ---------------------------- | ------------------------------------------------- |
| `sendAction` | `EventEmitter<() => Action>` | Emits the attached button action on button click. |

## How to use

- Import the `SharedButtonUiComponent` in your parent standalone component or module.

- Create a configuration object.

```typescript
// component ts

export class CustomComponent {
  buttonConfig = {
    elements: [
      'hello',
      {
        icon: 'assets/svg/text.svg',
        svgClass: 'fill-white w-[14px]',
      },
    ],
    ariaLabel: 'hello',
    doAction: () => sayHello(), // this normally will be a @ngrx action
  };

  onButtonClickAction(action: () => Action): void {
    this.facade.dispatchAction(action);
  }
}
```

```html
<!-- component template -->

<plastik-shared-button [config]="buttonConfig" (sendAction)="onButtonClickAction($event)"> </<plastik-shared-button>
```

## Running unit tests

Run `nx test shared-button-ui` to execute the unit tests.
