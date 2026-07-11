# @plastik/shared/button/ui

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/button/ui](#plastiksharedbuttonui)
  - [Description](#description)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A highly configurable button wrapper.

It accepts an array of content of type `ButtonElement` and outputs an event on click.

> ButtonElement accepts string, SvgIconConfig and observables of both.

```typescript
type ButtonElement =
  | {
      type: 'text';
      content: string | Observable<string>;
    }
  | {
      type: 'icon';
      content: SvgIconConfig | Observable<SvgIconConfig>;
    };
```

## Inputs

| Name     | Type           | Description                                                                    | Default     |
| :------- | :------------- | :----------------------------------------------------------------------------- | :---------- |
| `config` | `ButtonConfig` | A configuration object that passes a button configuration to build the button. | `undefined` |

## Outputs

| Name         | Type                         | Description                                       |
| :----------- | :--------------------------- | :------------------------------------------------ |
| `sendAction` | `EventEmitter<() => Action>` | Emits the attached button action on button click. |

## How to use

- Import the `SharedButtonUiComponent` in your parent standalone component or module.

- Create a configuration object.

```typescript
// component ts

export class CustomComponent {
  buttonConfig = {
    id: 12,
    elements: [
      { type: 'text', content: 'hello' },
      {
        type: 'icon',
        content: {
          icon: 'assets/svg/text.svg',
          svgClass: 'fill-white w-[14px]',
        },
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
