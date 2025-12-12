# @plastik/core/environments

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [Description](#description)
- [Interfaces](#interfaces)
- [Tokens & Providers](#tokens--providers)
- [Usage Examples](#usage-examples)

## Description

**Environments Utility** provides tools to define and provide application environments across libraries using Angular DI tokens. It supports base environments, HTTP API URLs, and PocketBase setups with translations.

## Interfaces

```typescript
export type EnvironmentName = 'development' | 'staging' | 'production' | 'test';

export interface Environment {
  readonly production: boolean;
  readonly name: string;
  readonly environment: EnvironmentName;
}

export type EnvironmentWithApiUrl = Environment & {
  readonly baseApiUrl: string;
};

export type EnvironmentWithTranslations = Environment & {
  languages: string[];
  defaultLanguage: string;
};

export type EnvironmentPocketBase = EnvironmentWithApiUrl & {
  client: string;
  collectionNames?: Record<string, string>;
};

export type EnvironmentPocketBaseWithTranslations = EnvironmentPocketBase &
  EnvironmentWithTranslations;
```

## Tokens & Providers

```typescript
import {
  ENVIRONMENT,
  ENVIRONMENT_WITH_API,
  POCKETBASE_ENVIRONMENT,
  POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
  provideWithApiEnv,
  providePocketBaseEnv,
  providePocketBaseWithTranslationsEnv,
} from '@plastik/core/environments';
```

- `ENVIRONMENT`: base environment token.
- `ENVIRONMENT_WITH_API`: environment with `baseApiUrl`.
- `POCKETBASE_ENVIRONMENT`: PocketBase environment.
- `POCKETBASE_WITH_TRANSLATION_ENVIRONMENT`: PocketBase with translations.

**Provider helpers:**

```typescript
provideWithApiEnv(env: EnvironmentWithApiUrl)
providePocketBaseEnv(env: EnvironmentPocketBase)
providePocketBaseWithTranslationsEnv(env: EnvironmentPocketBaseWithTranslations)
```

## Usage Examples

### 1) HTTP API environment

```typescript
// environments/environment.ts
import { EnvironmentWithApiUrl } from '@plastik/core/environments';

export const environment: EnvironmentWithApiUrl = {
  production: false,
  name: 'my-app',
  environment: 'development',
  baseApiUrl: 'https://api.example.com/v1',
};

// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideWithApiEnv } from '@plastik/core/environments';

export const appConfig: ApplicationConfig = {
  providers: [provideWithApiEnv(environment)],
};
```

### 2) PocketBase environment with translations

```typescript
// environments/environment.ts
import { EnvironmentPocketBaseWithTranslations } from '@plastik/core/environments';

export const environment: EnvironmentPocketBaseWithTranslations = {
  production: false,
  name: 'eco-store',
  environment: 'development',
  baseApiUrl: 'https://pocketbase.example.com',
  client: 'eco-store',
  languages: ['en', 'ca'],
  defaultLanguage: 'en',
};

// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { providePocketBaseWithTranslationsEnv } from '@plastik/core/environments';

export const appConfig: ApplicationConfig = {
  providers: [providePocketBaseWithTranslationsEnv(environment)],
};
```

### 3) Injecting the environment in a library service

```typescript
import { inject } from '@angular/core';
import { ENVIRONMENT } from '@plastik/core/environments';

export class MyService {
  readonly env = inject(ENVIRONMENT);
  log() {
    console.log(this.env.name, this.env.environment);
  }
}
```
