# storage-data-access

- [storage-data-access](#storage-data-access)
  - [Description](#description)
  - [Services](#services)
    - [Implementation](#implementation)
    - [FirebaseStorageService](#firebasestorageservice)
  - [Utils](#utils)
    - [ImageKitLoader](#imagekitloader)
  - [Running unit tests](#running-unit-tests)

## Description

A shared Angular library for handling storage operations (such as file upload and retrieval) using several Storage services.

## Services

### Implementation

All the upload services implement the [`StorageServiceType` interface and extends the `StorageService` abstract class](../entities/README.md).

### FirebaseStorageService

A service for handling storage operations using Firebase Storage.

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

A utility function for getting images from Firebase Storage and using ImageKit as a CDN to download images.

Import the utility in your Angular application:

```typescript
import { ImageKitLoader } from '@plastik/storage-data-access';

// app.config providers list
{
  provide: IMAGE_LOADER,
  useFactory: () => imageKitLoader(inject(ENVIRONMENT) as LlecoopEnvironment),
},
```

## Running unit tests

Run `nx test storage-data-access` to execute the unit tests.
