import { map, takeWhile } from 'rxjs/operators';

import { inject, Injectable, signal } from '@angular/core';
import {
  getDownloadURL,
  listAll,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  readonly #firebaseStorage = inject(Storage);
  progress = signal<number>(0);
  fileUrl = signal<string | null>(null);

  async upload(file: File | null, folder = 'images'): Promise<void> {
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
          map((data: { progress: number }) => data.progress ?? 0),
          takeWhile((progress: number) => progress < 100, true)
        )
        .subscribe(data => {
          this.progress.set(Math.round(data));
        });

      const snapshot = await task;
      this.fileUrl.set(await getDownloadURL(snapshot.ref));
      this.progress.set(0);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async getFileUrl(fileName: string, folder = 'images'): Promise<string> {
    const storageRef = ref(this.#firebaseStorage, `${folder}/${fileName}`);
    const getFile = await listAll(storageRef);
    if (getFile.items.length === 0) {
      throw new Error('File not found');
    }
    const url = await getDownloadURL(getFile.items[0]);
    this.fileUrl.set(url);
    return url;
  }

  reset(): void {
    this.progress.set(0);
    this.fileUrl.set(null);
  }
}
