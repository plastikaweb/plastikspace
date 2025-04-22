import { Signal } from '@angular/core';

export interface StorageServiceType {
  progress: Signal<number>;
  fileUrl: Signal<string | null>;
  upload(file: File | null, folder?: string): Promise<void>;
  getFileUrl(fileName: string, folder?: string): Promise<string>;
}
