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
  fileUrl = signal('');

  async upload(file: File | null, folder = 'images'): Promise<string | null> {
    this.progress.set(0);

    if (!file) {
      return null;
    }
    const storageRef = ref(this.#firebaseStorage, `${folder}/${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

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
    return this.fileUrl();
  }

  async getFileUrl(fileName: string, folder = 'images'): Promise<string> {
    fileName = `${folder}/${fileName}`;
    const storageRef = ref(this.#firebaseStorage, fileName);
    const getFile = await listAll(storageRef);
    if (getFile.items.length === 0) {
      throw new Error('File not found');
    }
    const url = await getDownloadURL(getFile.items[0]);
    return url;
  }
}
