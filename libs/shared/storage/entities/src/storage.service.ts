import { signal } from '@angular/core';

import { StorageServiceType } from './storage';

export abstract class StorageService implements StorageServiceType {
  progress = signal<number>(0);
  fileUrl = signal<string | null>(null);

  abstract upload(file: File | null, folder?: string): Promise<void>;
  abstract getFileUrl(fileName: string, folder?: string): Promise<string>;

  reset(): void {
    this.progress.set(0);
    this.fileUrl.set(null);
  }
}
