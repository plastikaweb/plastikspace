# nasa-images-search-data-access

- [nasa-images-search-data-access](#nasa-images-search-data-access)
  - [Description](#description)
  - [Services](#services)
    - [NasaImagesApiService](#nasaimagesapiservice)
  - [State](#state)
    - [Actions](#actions)
    - [Selectors](#selectors)
    - [Facade](#facade)
  - [Running unit tests](#running-unit-tests)
  - [Useful links](#useful-links)

## Description

This library gives some state management and services to deal with NASA Images API and internal app state.

## Services

### NasaImagesApiService

It extends `ApiService` and implement concrete logic to send API calls and map the response, send request result, manage errors.
Use as usual with a regular service, usually inside an `@ngrx Effects'.

## State

```typescript
export interface NasaImage {
  id: string;
  title: string;
  description: string;
  keywords?: string[];
  dateCreated: Date;
  creator: string;
  links: NasaImageLink[];
  location?: string;
}

// The store feature is called 'images'.
export const NASA_IMAGES_FEATURE_KEY = 'images';

export interface NasaImagesState extends EntityState<NasaImage> {
  selectedId?: string;
  loading: boolean;
  count: number;
  error?: string | null;
}
```

Import the store segment and the corresponding Effects array it in the feature module as usual.

### Actions

- loadNasaImages
- loadNasaImagesSuccess
- loadNasaImagesFailure
- cleanupNasaImages

### Selectors

- selectNasaImagesLoading
- selectNasaImagesError
- selectAllNasaImages
- selectNasaImagesEntities
- selectSelectedId
- selectEntity
- selectNasaImagesCount
- selectNasaImagesIsActiveSearch

### Facade

To use selectors and dispatch actions, DI the `NasaImagesFacade` service.

## Running unit tests

Run `nx test nasa-images-search-data-access` to execute the unit tests.

## Useful links

- [@ngrx/store](https://ngrx.io/guide/store)
- [@ngrx/effects](https://ngrx.io/guide/effects)
