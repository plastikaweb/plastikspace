import { ImageLoaderConfig } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@plastik/core/environments';
import { LlecoopEnvironment } from '@plastik/llecoop/entities';

export type ImageKitLoaderConfig = ImageLoaderConfig & {
  loaderParams: {
    width: number;
    height: number;
    quality?: number;
  };
};

@Injectable({
  providedIn: 'root',
})
export class ImageKitService {
  readonly #environment = inject(ENVIRONMENT) as LlecoopEnvironment;
  readonly #firebaseBucket = this.#environment['firebase']['storageBucket'];
  readonly #firebaseBucketUrl = `/v0/b/${this.#firebaseBucket}/o`;
  readonly #imageKitUrl = this.#environment['imageKit']['endpoint'];

  getEndpoint({ src, loaderParams }: ImageKitLoaderConfig): string {
    try {
      if (!src) throw new Error('src is required');
      if (!loaderParams) throw new Error('loaderParams is required');

      const { width, height, quality = 80 } = loaderParams;

      if (!width || !height || width <= 0 || height <= 0)
        throw new Error('width and height are required and must be greater than 0');

      const transform = `tr:w-${width},h-${height},q-${quality}/`;

      const url = new URL(src);
      const path = url.pathname.replace(this.#firebaseBucketUrl, '');
      const search = url.search;

      return !src.startsWith('https://ik.imagekit.io/')
        ? `${this.#imageKitUrl}${transform}${path}${search}`
        : `${transform}${path}${search}`;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[ImageKitService.getEndpoint] Error:', error);
      return '';
    }
  }
}
