# shared util latinize

## Description

Angular utility used to convert special characters to latin characters.

## How to use

```typescript
import { latinize } from '@plastik/shared/latinize';

const text = 'áéíóú';
const latinizedText = latinize(text);

console.log(latinizedText); // 'aeiou'
```

## Running unit tests

Run `nx test latinize` to execute the unit tests.
