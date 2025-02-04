# Shared Testing Library

- [Shared Testing Library](#shared-testing-library)
  - [Description](#description)
  - [Features](#features)
  - [Basic Usage](#basic-usage)
  - [API Documentation](#api-documentation)
    - [`angularFireAuthMock`](#angularfireauthmock)

## Description

This library provides shared testing utilities for Angular components and services in our Nx monorepo, with Jest as the test runner.

## Features

- Configured TestBed setups
- Common mocks for Angular services
- Custom Jest matchers
- Testing utilities for reactive forms

## Basic Usage

Import utilities in your library test-setup files:

```typescript
// test-setup.ts
import '@plastik/shared/testing';
```

## API Documentation

### `angularFireAuthMock`

Implements `@angular/fire/auth` interface with Jest spy methods.
