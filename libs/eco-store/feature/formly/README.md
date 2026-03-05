# @plastik/eco-store/feature/formly

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Formly](https://img.shields.io/badge/formly-%23f05032.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/feature/formly](#plastikeco-storefeatureformly)
  - [Description](#description)
    - [Formly configuration](#formly-configuration)
    - [Search form](#search-form)
  - [Inputs](#inputs)
  - [How to use](#how-to-use)
    - [1. Register Formly config in the app](#1-register-formly-config-in-the-app)

## Description

Shared **Formly configuration** for the **eco-store** app.

### Formly configuration

`EcoStoreFormlyModule` registers:

- **Formly Material**:
  - `provideFormlyCore([...withFormlyMaterial(), ...])`.
- **Custom type**:
  - `input-search` → `InputSearchTypeComponent`.
- **Wrapper**:
  - `addons` → `FormlyAddonsWrapperComponent`.
- **Validators**:
  - `url` → `urlValidator`.
  - `phone` → `phoneValidator`.
- **Translation extensions**, using `FORMLY_CONFIG` and `TranslateService`:
  - Form field translation.
  - Form field group translation.
  - Button translation.
  - Validator translation.

This module is meant to be imported as a **provider** in the main application config.

### Search form

`appSearchFormConfig()` exposes the configuration for the main **site search form**:

- Model type: `{ query: string }`.
- A single field `query` of type `input-search` with:
  - Translated label and placeholder (`search.label`, `search.placeholder`),
  - `noButton`, `resetSearch`, `translate`, `buttonEnabledIfValue`,
  - `maxLength` and `autocomplete` attributes.
- Submit configuration:
  - `submitAvailable: false`
  - `disableOnSubmit: false`

## Inputs

This feature library does not expose Angular `@Input()`s directly.

It exposes **APIs** to be used from your app:

- `EcoStoreFormlyModule`: Formly configuration module, to be registered via providers.
- `appSearchFormConfig()`: Factory that returns:
  - `getConfig()` → Formly field configuration for the search form.
  - `getSubmitFormConfig()` → submit behaviour configuration.

## How to use

### 1. Register Formly config in the app

In your `app.config.ts`:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...other providers
    importProvidersFrom(EcoStoreFormlyModule),
  ],
};
```
