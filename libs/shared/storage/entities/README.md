# @plastik/shared/storage/entities

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- [Description](#description)

## Description

A shared Angular library for defining the **entities of storage operations** (such as file upload and retrieval).

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
