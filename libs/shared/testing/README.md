# @plastik/shared/testing

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Vitest](https://img.shields.io/badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white)

- [Description](#description)
- [Features](#features)
- [Basic Usage](#basic-usage)
- [API Documentation](#api-documentation)
  - [`angularFireAuthMock`](#angularfireauthmock)
  - [`angularFireStorageMock`](#angularfirestoragemock)

## Description

This library provides **shared testing utilities** for Angular components and services in our Nx monorepo, with Vitest as the test runner.

## Features

- Configured TestBed setups
- Common mocks for Angular services
- Custom Vitest matchers
- Testing utilities for reactive forms

## Basic Usage

Import utilities in your library test-setup files:

```typescript
// test-setup.ts
import '@plastik/shared/testing';
```

## API Documentation

### `angularFireAuthMock`

Implements `@angular/fire/auth` interface with Vitest spy methods.

### `angularFireStorageMock`

Implements `@angular/fire/storage` interface with Vitest spy methods.
