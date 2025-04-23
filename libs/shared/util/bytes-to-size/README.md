# shared-util-bytes-to-size

- [shared-util-bytes-to-size](#shared-util-bytes-to-size)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Usage](#usage)
    - [1. Import the `BytesToSizePipe` in your component or module](#1-import-the-bytestosizepipe-in-your-component-or-module)
    - [2. Use the pipe in your component's template](#2-use-the-pipe-in-your-components-template)
  - [Running unit tests](#running-unit-tests)

This pipe is used to convert a number representing bytes into a human-readable format.

## Inputs

| Name    | Type     | Description                                                  | Default |
| ------- | -------- | ------------------------------------------------------------ | ------- |
| `value` | `number` | The number of bytes to be converted.                         |         |
| `fixed` | `T`      | The number of decimal places to round the converted size to. | 0       |

## Outputs

Returns a string representing the converted value in a human-readable format.

> For example, if the input value is `1024`, the output will be `'1 KB'`.

## Usage

### 1. Import the `BytesToSizePipe` in your component or module

```typescript
import { BytesToSizePipe } from '@shared/utils/bytes-to-size/bytes-to-size.pipe';
```

or add it to the `imports` array of your module:

```typescript
@NgModule({
  imports: [BytesToSizePipe],
})
export class MyModule {}
```

### 2. Use the pipe in your component's template

```html
<p>{{ 1024 | bytesToSize }}</p>
```

## Running unit tests

Run `nx test shared-util-bytes-to-size` to execute the unit tests.
