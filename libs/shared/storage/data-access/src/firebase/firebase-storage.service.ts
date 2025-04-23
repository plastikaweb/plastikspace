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

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService extends StorageService implements StorageServiceType {
  readonly #firebaseStorage = inject(Storage);

  async upload(file: File | null, folder?: string): Promise<void> {
    this.reset();

    try {
      if (!file) {
        throw new Error('File not found');
      }

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
      // eslint-disable-next-line no-console
      console.error(error);
      this.progress.set(0);
    }
  }

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

  setFileUrl(url: string | null): void {
    this.fileUrl.set(url);
  }
}
