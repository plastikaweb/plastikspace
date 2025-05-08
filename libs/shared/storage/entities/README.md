# shared-storage-entities

- [shared-storage-entities](#shared-storage-entities)
  - [Description](#description)

## Description

A shared Angular library for defining the entities of storage operations (such as file upload and retrieval).

All the upload services must implement the [`StorageServiceType` interface](../entities/README.md).

```typescript
export interface StorageServiceType {
  progress: Signal<number>;
  fileUrl: Signal<string | null>;
  upload(file: File | null, folder?: string): Promise<void>;
  getFileUrl(fileName: string, folder?: string): Promise<string>;
}
```

and extend the [`StorageService` abstract class](../entities/README.md).

```typescript
export abstract class StorageService implements StorageServiceType {
  progress = signal<number>(0);
  fileUrl = signal<string | null>(null);

  abstract upload(file: File | null, folder?: string): Promise<void>;
  abstract getFileUrl(fileName: string, folder?: string): Promise<string>;

  protected reset(): void {
    this.progress.set(0);
    this.fileUrl.set(null);
  }
}
```
