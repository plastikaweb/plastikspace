# @plastik/core/cms-layout/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![NgRx](https://img.shields.io/badge/ngrx-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/core/cms-layout/data-access](#plastikcorecms-layoutdata-access)
  - [Description](#description)
  - [State Management](#state-management)
    - [`LayoutFacade`](#layoutfacade)
  - [Services](#services)
    - [`LayoutObserverService`](#layoutobserverservice)
  - [Tokens](#tokens)
    - [`CORE_CMS_LAYOUT_HEADER_CONFIG`](#core_cms_layout_header_config)
    - [`VIEW_CONFIG`](#view_config)
  - [Usage](#usage)
    - [1. Import Module](#1-import-module)
    - [2. Use Facade](#2-use-facade)
  - [Running Unit Tests](#running-unit-tests)

## Description

Manages **CMS Layout State** (e.g., sidenav status, mobile detection) and provides configuration tokens for layout features.

## State Management

### `LayoutFacade`

The main entry point for interacting with the CMS layout state. It abstracts the underlying NgRx store and provides properties and methods to control the layout.

**Properties:**

- `sidenavOpened$`: Observable emitting the current open state of the sidenav.
- `isMobile$`: Observable emitting whether the current view is considered mobile.
- `headerConfig`: The injected header configuration.
- `sidenavConfig`: The injected sidenav view configuration.
- `isActive`: Signal indicating if there is background activity (loading).

**Methods:**

- `toggleSidenav(opened?: boolean)`: Toggles the sidenav state or sets it to a specific value.
- `setIsMobile(isMobile: boolean)`: Updates the mobile state in the store.
- `dispatchAction(action: () => Action)`: Dispatches a generic NgRx action.

![Layout State Diagram](layout-state.png)

## Services

### `LayoutObserverService`

A utility service that wraps Angular CDK's `BreakpointObserver` to simplify responsive layout detection.

```typescript
@Injectable({ providedIn: 'root' })
export class LayoutObserverService {
  /**
   * Returns an observable that emits true if the current viewport matches the provided breakpoints.
   * Default breakpoints: Handset, Tablet, Medium.
   */
  getMatches(breakpoints?: string[]): Observable<boolean>;
}
```

## Tokens

### `CORE_CMS_LAYOUT_HEADER_CONFIG`

Injects header configuration (title, icon, buttons, user menu, widgets).

```typescript
export interface CoreCmsLayoutHeaderConfig {
  showToggleMenuButton: boolean;
  sidenavPosition?: LayoutPosition;
  title: string;
  extendedTitle?: string;
  mainIcon?: SvgIconConfig;
  widgetsConfig?: {
    position: LayoutPosition;
    widgets: CoreCmsLayoutHeaderWidget[];
  };
  userMenuConfig?: {
    label?: Signal<string>;
    position: LayoutPosition;
    config: HeaderMenuConfig<string>[];
  };
}

export const CORE_CMS_LAYOUT_HEADER_CONFIG = new InjectionToken<CoreCmsLayoutHeaderConfig>(
  'CORE_CMS_LAYOUT_HEADER_CONFIG'
);
```

### `VIEW_CONFIG`

Injects the sidenav menu configuration.

```typescript
export const VIEW_CONFIG = new InjectionToken<ViewConfig<unknown>[]>('VIEW_CONFIG');
```

## Usage

### 1. Import Module

```typescript
import { CoreCmsLayoutDataAccessModule } from '@plastik/core/cms-layout/data-access';

@NgModule({
  imports: [CoreCmsLayoutDataAccessModule],
})
export class ParentModule {}
```

### 2. Use Facade

Inject `LayoutFacade` to interact with the state:

```typescript
@Component({ ... })
export class FeatureComponent {
  private facade = inject(LayoutFacade);
  sidenavOpened$ = this.facade.sidenavOpened$;
  isMobile$ = this.facade.isMobile$;

  toggleSidenav(opened?: boolean) {
    this.facade.toggleSidenav(opened);
  }
}
```

## Running Unit Tests

Run `nx test core-cms-layout-data-access` to execute the unit tests.
