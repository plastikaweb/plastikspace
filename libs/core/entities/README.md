# core-entities

- [core-entities](#core-entities)
  - [Description](#description)
  - [Entities](#entities)
    - [Base Entity](#base-entity)
    - [Form Configuration](#form-configuration)
    - [View Configuration](#view-configuration)
      - [Example Usage of ViewConfig](#example-usage-of-viewconfig)

## Description

This library provides foundational structures and configurations for managing entities and their forms and views within the application.

## Entities

### Base Entity

- **File**: `base-entity.ts`
- **Description**: Defines a basic entity structure with properties like `id`, `name`, `createdAt`, and `updatedAt`.
- **Type**: `BaseEntity`
  - `id`: Optional identifier for the entity.
  - `name`: Optional name of the entity.
  - `createdAt`: Timestamp of when the entity was created.
  - `updatedAt`: Timestamp of when the entity was last updated.

### Form Configuration

- **File**: `form-config.ts`
- **Description**: Provides interfaces and tokens for configuring forms.
- **Interfaces**:
  - `FormConfig<T>`: Configures form fields and actions.
  - `ExtraFormAction<T>`: Defines additional actions for forms.
  - `SubmitFormConfig`: Configures submit button behavior.
- **Token**: `FORM_TOKEN`

### View Configuration

- **File**: `view-config.ts`
- **Description**: Defines the structure and configuration of UI views.
- **Interfaces**:
  - `ViewConfig<T>`: Describes a UI view with properties like `id`, `name`, `title`, and `route`.
  - `ViewsConfigRecord<T>`: A record of view configurations.
- **Functions**:
  - `getVisibleNavigationList`: Returns a signal with a list of views included in navigation.

#### Example Usage of ViewConfig

Here's an example demonstrating how to use the `ViewConfig` interface to define a simple view configuration and utilize the `getVisibleNavigationList` function:

```typescript
import { ViewConfig, getVisibleNavigationList } from './src/view-config';

// Define a view configuration
const viewConfig: Record<string, ViewConfig<string>> = {
  home: {
    id: 1,
    name: 'home',
    title: 'Home',
    icon: 'home-icon',
    route: ['/home'],
    includedInNavigation: true,
  },
  about: {
    id: 2,
    name: 'about',
    title: 'About Us',
    icon: 'about-icon',
    route: ['/about'],
    includedInNavigation: true,
  },
  contact: {
    id: 3,
    name: 'contact',
    title: 'Contact',
    icon: 'contact-icon',
    route: ['/contact'],
    includedInNavigation: false, // Not included in navigation
  },
};

// Provide the view configuration with the `getVisibleNavigationList` function and add it to the providers in the app module, the app configuration, or any other module that needs access to the view configuration
{ provide: VIEW_CONFIG, useValue: getVisibleNavigationList(viewConfig) },
```

This example defines a set of views for a hypothetical application and uses the `getVisibleNavigationList` function to filter out only those views that should appear in the navigation menu.
