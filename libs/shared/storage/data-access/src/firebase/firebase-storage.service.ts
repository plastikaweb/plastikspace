import { distinctUntilChanged } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';
import {
  getDownloadURL,
  listAll,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { StorageService, StorageServiceType } from '@plastik/storage/entities';

/**
 * Firebase Storage service implementation.
 * Handles file uploads and retrieval through Firebase Storage.
 */
@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService extends StorageService implements StorageServiceType {
  readonly #firebaseStorage = inject(Storage);

  /**
   * Uploads a file to Firebase Storage.
   * @param {File | null} file - The file to upload.
   * @param {string} [folder] - Optional folder path in storage.
   * @returns {Promise<void>} A promise that resolves when the upload is complete.
   */
  async upload(file: File | null, folder?: string): Promise<void> {
    this.reset();

    if (!file) {
      throw new Error('File not found');
    }

    try {
      const storageRef = ref(this.#firebaseStorage, `${folder}/${file.name}`);
      const task = uploadBytesResumable(storageRef, file, {
        cacheControl: 'public, max-age=31536000',
      });

      percentage(task)
        .pipe(
          distinctUntilChanged((a, b) => a.progress === b.progress),
          map((data: { progress: number }) => data.progress),
          takeWhile((progress: number) => progress <= 100, true)
        )
        .subscribe(data => this.progress.set(Math.round(data)));

      const snapshot = await task;

      this.fileUrl.set(await getDownloadURL(snapshot.ref));
      this.progress.set(0);
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  /**
   * Retrieves the download URL for a file in Firebase Storage.
   * @param {string} fileName - The name of the file.
   * @param {string} [folder] - Optional folder path.
   * @returns {Promise<string>} A promise resolving to the file's download URL.
   */
  async getFileUrl(fileName: string, folder?: string): Promise<string> {
    const storageRef = ref(this.#firebaseStorage, `${folder}/${fileName}`);
    const getFile = await listAll(storageRef);

    if (getFile.items.length === 0) {
      throw new Error('File not found');
    }
    const url = await getDownloadURL(getFile.items[0]);

    this.fileUrl.set(url);

    return url;
  }

  /**
   * Manually sets the file URL signal.
   * @param {string | null} url - The URL string or null.
   */
  setFileUrl(url: string | null): void {
    this.fileUrl.set(url);
  }
}
