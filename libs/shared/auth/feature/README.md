# auth-feature

- [auth-feature](#auth-feature)
  - [Description](#description)
  - [Components](#components)
  - [Service Tokens](#service-tokens)
  - [Usage](#usage)

## Description

The `auth-feature` library provides authentication features for the application. It includes components, services, and utilities to serve as a UI layer for authentication-related functionalities.

## Components

- **AuthFeatureComponent**: The main container component for the authentication feature.

## Service Tokens

- **AUTH_SERVICE**: The authentication service used to manage authentication.
- **AUTH_FORM_FACADE**: A service to pass the form structure and behavior.

  ```typescript
  export interface AuthFormFacade {
    formStructure?: Signal<FormlyFieldConfig[]>;
    onSubmit(search: object): void;
    extraLinks?: Signal<{ label: string; route: string }[]>;
  }
  ```

## Usage

- Create a `Route` in your application's routing configuration and associate it with the `AuthFeatureComponent`.
- Provide the `AUTH_SERVICE`, `AUTH_FORM_FACADE`, and `FORM_TOKEN` tokens with the appropriate services and configuration.

```typescript
export const authLoginFeatureRoutes: Route[] = [
  {
    path: '',
    component: AuthFeatureComponent,
    providers: [
      {
        provide: AUTH_SERVICE,
        useClass: FirebaseAuthService,
      },
      {
        provide: AUTH_FORM_FACADE,
        useClass: LoginFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLoginFormConfig(),
      },
    ],
  },
];
```
