import { Signal } from '@angular/core';

export interface StorageServiceType {
  // Progress of the upload.
  progress: Signal<number>;
  // URL of the uploaded file.
  fileUrl: Signal<string | null>;
  // Upload a file.
  upload(file: File | null, folder?: string): Promise<void>;
  // Get the URL of a file.
  getFileUrl(fileName: string, folder?: string): Promise<string>;
  // Reset the service fileUrl and progress values.
  reset(): void;
}
