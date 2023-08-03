# router-state

- [router-state](#router-state)
  - [Description](#description)
  - [What happens when router state isn’t part of your central store](#what-happens-when-router-state-isnt-part-of-your-central-store)
    - [Code Duplication](#code-duplication)
    - [Inconsistency](#inconsistency)
    - [Unmaintainable](#unmaintainable)
  - [Router State Object](#router-state-object)
  - [How to use](#how-to-use)
    - [RouterState Actions](#routerstate-actions)
    - [Route title](#route-title)
      - [Route title with app name prefix](#route-title-with-app-name-prefix)
    - [Automatic scroll on route navigation](#automatic-scroll-on-route-navigation)
  - [Running unit tests](#running-unit-tests)
  - [Useful links](#useful-links)

## Description

This library compiles common router state management using @ngrx/router.

The router is inserted in the store as a `router` segment, so any action that involves getting router URL, params, query params and any action that involves a route change must use this router store.

- Common actions (navigate, back, forward).
- Serialized state ({url, params, queryParams, title}).
- Update page title dynamically.
- Automatic scroll to top on router navigation.
- Internal unit testing.

## What happens when router state isn’t part of your central store

### Code Duplication

Letting components to extract path/query params from navigation/router-state and then use it to select respective state slices and/or dispatch actions we end up with:

- lot of code duplication between sibling components.
- unnecessary coupling between parent and children components where a child component may need a router param extracted by parent component alongside its own.

### Inconsistency

Users may navigate to a nested route directly, for example by clicking on a shared link, bookmark or even typing in route in the browser's navigation bar.
We need route params to establish/select the state for target component trees mounted in one or more the `<route-outlets/>` before anything meaningful can render.

### Unmaintainable

We can’t replay or jump across state snapshots using the redux dev tools as route changes if weren’t reduced by NgRx, can’t be jumped-to or re-played.

## Router State Object

```typescript
interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
  data: Record<string, unknown>;
}
```

## How to use

Changes to your imports on your app root module (app.module).

- Use `routerReducers` const into the StoreModule.
- Add StoreRouterConnectingModule with the custom serializer provided by the library ( `CustomRouterSerializer` ).
- Import `RouterStateEffects` to EffectsModule.forRoot.

```typescript
// app main.ts

import { TitleStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CustomRouterSerializer, PrefixTitleService, routerReducers, RouterStateEffects } from '@plastik/core/router-state';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      StoreModule.forRoot(routerReducers, {
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }),
      EffectsModule.forRoot([RouterStateEffects]),
      isDevMode() ? StoreDevtoolsModule.instrument({ name: environment.name, maxAge: 25 }) : [],
    ),
    provideRouterStore({
      serializer: CustomRouterSerializer,
      navigationActionTiming: NavigationActionTiming.PreActivation,
    }),
    {
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
  ],
});
```

Every time a route change is dispatched, the local state will be updated.

### RouterState Actions

```typescript
// navigate to a given URL. Any segment must be part of the path param array

this.store.dispatch(routerActions.go({ path: ['section'], params: {id: 1}, queryParams: {name: 'test'} }));

// navigate back

this.store.dispatch(routerActions.back());

// navigate forward

this.store.dispatch(routerActions.forward();

```

> On component templates, **always use routerLink directive** over a class store router `Go` action dispatch.
>
> Example: `<a [routerLink]="['new']">Add new user</a>`

### Route title

For a specific title on any route, set a title property.

> You can use a service resolver to set it dynamically.

```typescript
// app.routes.ts

@Injectable({ providedIn: 'root' })
export class CustomTitleResolver {
  resolve() {
    return of('Custom About Me');
  }
}

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'custom',
    component: CustomComponent,
    title: CustomTitleResolver,
  },
];
```

#### Route title with app name prefix

If you want to prefix your routes with the specific app name:

- you must have a name property in your Environment object as the main app name.
- you must provide `PrefixTitleService` as a TitleStrategy service and provide it in your root module.

```typescript
NgModule({
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    {
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
  ],
});
export class AppModule {}
```

### Automatic scroll on route navigation

In the Effects file, we have an `@Effect` called `scrollToTop$` that makes an `scrollTo(0, 0)` on an existing HTML element with the id of `mainContent`.
It can be used to scroll a container with a table and pagination, so on each table results filtering, it will scroll to top of the table.

> If no `mainContent` is present, no scrolling will be applied.

## Running unit tests

Run `nx test router-state` to execute the unit tests.

## Useful links

- [@ngrx/router-store](https://ngrx.io/guide/router-store)
- [NgRx Router Store | Reduce & Select Route Params](https://medium.com/simars/ngrx-router-store-reduce-select-route-params-6baff607dd9)
- [Angular TitleStrategy](https://angular.io/api/router/TitleStrategy)
- [Handling Page Titles in Angular by Netanel Basal](https://netbasal.com/handling-page-titles-in-angular-40b53823af4a)
