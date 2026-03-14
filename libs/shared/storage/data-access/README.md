# @plastik/shared/storage/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [Description](#description)
- [Services](#services)
  - [Implementation](#implementation)
  - [FirebaseStorageService](#firebasestorageservice)
- [Utils](#utils)
  - [ImageKitLoader](#imagekitloader)
  - [PocketBase Storage Loader](#pocketbase-storage-loader)
- [Running unit tests](#running-unit-tests)

## Description

A shared Angular library for handling **storage operations** (such as file upload and retrieval) using several Storage services.

## Services

### Implementation

All the upload services implement the [`StorageServiceType` interface and extends the `StorageService` abstract class](../entities/README.md).

### FirebaseStorageService

A service for handling storage operations using **Firebase Storage**.

Import the service in your Angular application:

```typescript
import { FirebaseStorageService } from '@plastik/storage-data-access';

// use the upload method
const storageService = inject(FirebaseStorageService);
const { upload } = storageService;

// upload a file
await upload('path/to/file', 'folder');

// point to the progress signal
const progress = storageService.progress();

// point to the fileUrl signal
const fileUrl = storageService.fileUrl();
```

## Utils

### ImageKitLoader

A utility function for getting images from Firebase Storage and using ImageKit as a CDN to download images. It works with Angular's `IMAGE_LOADER` token to provide optimized image loading.

#### Import and Configuration

Import the utility in your Angular application:

```typescript
import { ImageKitLoader } from '@plastik/storage-data-access';
import { ENVIRONMENT } from '@plastik/core/environments';

// app.config providers list
{
  provide: IMAGE_LOADER,
  useFactory: () => imageKitLoader(inject(ENVIRONMENT) as LlecoopEnvironment),
},
```

#### Usage with NgOptimizedImage

The loader integrates seamlessly with Angular's `NgOptimizedImage` directive:

```html
<img [ngSrc]="imagePath" [width]="300" [height]="300" [alt]="Product image" />
```

The loader will transform Firebase Storage URLs into ImageKit CDN URLs with proper optimization parameters.

#### Parameters

- **environment**: Environment object containing ImageKit configuration
- **loaderParams**: Object containing `width` and `height` for image optimization

#### Error Handling

The loader includes error handling for invalid URLs and missing environment configuration.

#### Example Configuration

```typescript
// environment.ts example
export const environment = {
  // ... other properties
  imageKit: {
    urlEndpoint: 'https://ik.imagekit.io/your-id',
    authenticationEndpoint: '/api/imagekit-auth',
  },
};
```

### PocketBase Storage Loader

A custom image loader for PocketBase storage that works with Angular's `IMAGE_LOADER` token. It generates thumbnail URLs with proper dimensions for optimized image loading.

#### Import and Configuration

Import the loader in your Angular application:

```typescript
import { pocketBaseStorageLoader } from '@plastik/storage-data-access';

// Configure in your app routes or providers
{
  provide: IMAGE_LOADER,
  useFactory: () => pocketBaseStorageLoader('https://your-pocketbase-url.com'),
}
```

#### Usage with NgOptimizedImage

The loader integrates seamlessly with Angular's `NgOptimizedImage` directive:

```html
<img [ngSrc]="collectionId/recordId/filename" [width]="300" [height]="300" [alt]="Product image" />
```

The loader will transform the image path into a PocketBase URL with thumbnail parameters:
`https://your-pocketbase-url.com/api/files/collectionId/recordId/filename?thumb=300x300`

#### Parameters

- **baseUrl**: Your PocketBase instance URL (e.g., `https://your-pocketbase-url.com`)
- **loaderParams**: Object containing `width`, `height`, `quality`, and `availableThumbs` for thumbnail generation. `availableThumbs` allows passing a specific array of thumbnail sizes matching the PocketBase schema.

#### Path Bypass

The loader automatically bypasses technical processing and returns the source URL directly if it starts with:

- `/` (absolute internal paths)
- `local/` (aliased local assets)
- `http` (external URLs)

This is useful for static assets or images hosted outside of PocketBase storage.

#### Error Handling

The loader includes error handling and will log errors to the console while returning an empty string for invalid inputs.

#### Example with Environment Variables

```typescript
import { pocketBaseStorageLoader } from '@plastik/storage-data-access';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';

{
  provide: IMAGE_LOADER,
  useFactory: () => {
    const env = inject(POCKETBASE_ENVIRONMENT);
    return pocketBaseStorageLoader(env.baseApiUrl);
  },
}
```

## Running unit tests

Run `nx test shared-storage-data-access` to execute the unit tests.
