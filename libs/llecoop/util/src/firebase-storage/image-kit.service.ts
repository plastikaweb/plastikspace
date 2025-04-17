import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@plastik/core/environments';
import { LlecoopEnvironment } from '@plastik/llecoop/entities';

@Injectable({
  providedIn: 'root',
})
export class ImageKitService {
  readonly #environment = inject(ENVIRONMENT) as LlecoopEnvironment;
  readonly #firebaseBucket = this.#environment['firebase']['storageBucket'];
  readonly #firebaseBucketUrl = `https://firebasestorage.googleapis.com/v0/b/${this.#firebaseBucket}/`;

  getEndpoint(url: string, width = 200, height = 200, quality = 80): string {
    const endpoint = url.replace(this.#firebaseBucketUrl, '');
    return `${endpoint}&tr=w-${width},h-${height},q-${quality}`;
  }
}
