# core-util-environments

A tiny library that provides a global `ENVIRONMENT` token service to share current app environment configuration across libraries.

## How to use

- Use `Environment` interface to type your app environments

```typescript
export interface Environment {
  production: boolean;
  name: string;
  apiUrl: string;
}
```

- Mark your environments to use the interface and pass the authentication provider configuration type as a generic argument.

```typescript
// apps/my-app/src/environments/environment.ts
import { Environment } from '@plastik/core/environments';

export const environment: Environment = {
  production: false,
  name: 'my-app',
  apiUrl: `https://api/my-app`,
};
```

- Provide the `ENVIRONMENT` token value in you app

```typescript
// apps/my-app/src/app/app.module.ts
import { ENVIRONMENT } from '@plastik/core/environments';
import { environment } from '../environments/environment';

@NgModule({
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
  ],
})
export class AppModule {}
```

- Use it with DI where needed

```typescript
// A library service that needs access to app environment values.
export class MyService {
  constructor(@Inject(ENVIRONMENT) private readonly env: Environment) {
    console.log(this.env.name);
  }
```

## Running unit tests

Run `nx test core-util-environments` to execute the unit tests.
