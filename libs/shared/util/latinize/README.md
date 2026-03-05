# @plastik/shared/util/latinize

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- [@plastik/shared/util/latinize](#plastiksharedutillatinize)
  - [Description](#description)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

Angular utility to convert **special characters (diacritics)** to their Latin equivalents. Essential for implementing search and sort functionality that ignores accents.

## Usage

```typescript
import { latinize } from '@plastik/shared/util/latinize';

const text = 'áéíóú'; // Special characters
const latinizedText = latinize(text);

console.log(latinizedText); // 'aeiou'
```

## Running unit tests

Run `nx test shared-util-latinize` to execute the unit tests.
