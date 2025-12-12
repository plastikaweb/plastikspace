# @plastik/core/router/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![NgRx](https://img.shields.io/badge/ngrx-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/core/router/data-access](#plastikcorerouterdata-access)
  - [Description](#description)
  - [Architecture](#architecture)
    - [Router State Object](#router-state-object)
  - [How to use](#how-to-use)
    - [Setup](#setup)
    - [Actions](#actions)
    - [Route Title](#route-title)
  - [Resources](#resources)
  - [Running Unit Tests](#running-unit-tests)

## Description

**Router State Management** library utilizing `@ngrx/router-store`. It integrates the Angular Router with the NgRx Store, allowing for time-travel debugging, consistent state selection, and a single source of truth.

**Key Features:**

- **Store Integration**: Router state (URL, params, query params) is part of the central store.
- **Common Actions**: Actions for navigation (`go`, `back`, `forward`) that can be dispatched.
- **Dynamic Titles**: `PrefixTitleService` for auto-prefixing page titles.
- **Scroll Restoration**: Automatic scroll top on navigation.

## Architecture

**Why use Router State in Store?**

- **Avoids Duplication**: No need to manually extract `ActivatedRoute` params in every component.
- **Consistency**: Centralized selection of route params to drive other state slices.
- **Debuggability**: Full state history and ability to replay actions via Redux DevTools.

### Router State Object

```typescript
interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
  data: Record<string, unknown>;
}
```

## How to use

### Setup

In your `app.config.ts` or root module:

```typescript
import { provideRouterStore, NavigationActionTiming } from '@ngrx/router-store';
import {
  CustomRouterSerializer,
  PrefixTitleService,
  routerReducers,
  RouterStateEffects,
} from '@plastik/core/router-state';
import { TitleStrategy } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    // 1. Store Setup
    importProvidersFrom(
      StoreModule.forRoot(routerReducers),
      EffectsModule.forRoot([RouterStateEffects])
    ),
    // 2. Router Store
    provideRouterStore({
      serializer: CustomRouterSerializer,
      navigationActionTiming: NavigationActionTiming.PreActivation,
    }),
    // 3. Title Strategy
    {
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
  ],
});
```

### Actions

Dispatch actions to navigate via the Store:

```typescript
// Navigate to URL
this.store.dispatch(
  routerActions.go({ path: ['section'], params: { id: 1 }, queryParams: { name: 'test' } })
);

// Navigate Back
this.store.dispatch(routerActions.back());

// Navigate Forward
this.store.dispatch(routerActions.forward());
```

> **Best Practice**: Use `[routerLink]` in templates for simple links. Use store actions for programmatic navigation side-effects.

### Route Title

Use standard Angular `title` property in routes. `PrefixTitleService` can automatically add the app name prefix.

```typescript
{
  path: 'home',
  component: HomeComponent,
  title: 'Home', // Becomes "App Name - Home" if configured
}
```

## Resources

- [@ngrx/router-store](https://ngrx.io/guide/router-store)
- [Angular TitleStrategy](https://angular.io/api/router/TitleStrategy)

## Running Unit Tests

Run `nx test core-router-data-access` to execute the unit tests.
