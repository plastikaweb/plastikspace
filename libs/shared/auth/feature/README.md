# @plastik/shared/auth/feature

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/auth/feature](#plastiksharedauthfeature)
  - [Description](#description)
  - [Components](#components)
  - [Service Tokens and Interfaces](#service-tokens-and-interfaces)
    - [AuthFacade](#authfacade)
    - [AuthFormFacade](#authformfacade)
  - [Usage](#usage)

## Description

The `shared-auth-feature` library serves as the core "contracts" and common UI layer for the authentication system.
It centralizes the interfaces and injection tokens that define how authentication services and form facades should behave, ensuring consistency across different authentication providers (e.g., Firebase, PocketBase).

## Components

- **AuthFeatureComponent**: A generic container component for authentication forms. It orchestrates the display of the form and its associated links (like "Forgot Password" or "Register").

## Service Tokens and Interfaces

### AuthFacade

Defines the contract for an authentication service.

```typescript
export interface AuthFacade {
  loggedIn: Signal<boolean>;
  login(email: string, password: string): Observable<unknown> | Promise<unknown>;
  logout(): Observable<void> | Promise<void> | void;
  register?: (
    email: string,
    password: string,
    name: string
  ) => Observable<unknown> | Promise<unknown>;
  requestPassword?: (email: string) => Observable<unknown> | Promise<unknown>;
}

export const AUTH_SERVICE = new InjectionToken<AuthFacade>('AUTH_SERVICE');
```

### AuthFormFacade

Defines the contract for a component or service that manages the logic for a specific authentication form (Login, Register, etc.).

```typescript
export interface AuthFormFacade<T> {
  formConfig: FormConfig<T>;
  extraLinks?: Signal<{ label: string; route: string }[]>;
  onSubmit(data: T): void;
}

export const AUTH_FORM_FACADE = new InjectionToken<AuthFormFacade<unknown>>('AUTH_FORM_FACADE');
```

## Usage

Feature libraries like `@plastik/auth/login` or `@plastik/auth/register` utilize these tokens to provide concrete implementations.

```typescript
export const authLoginFeatureRoutes: Route[] = [
  {
    path: '',
    component: AuthFeatureComponent,
    providers: [
      { provide: AUTH_SERVICE, useClass: FirebaseAuthService },
      { provide: AUTH_FORM_FACADE, useClass: LoginFacadeService },
      { provide: FORM_TOKEN, useFactory: loginFormConfig },
    ],
  },
];
```
