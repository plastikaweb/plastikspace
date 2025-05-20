import { ImageLoaderConfig } from '@angular/common';

export type ImageKitLoaderConfig = ImageLoaderConfig & {
  loaderParams: {
    width: number;
    height: number;
    quality?: number;
  };
};

/**
 * @description A custom image loader that uses ImageKit to resize and optimize images coming from Firebase.
 * @param { string } imageKitEndpoint The ImageKit endpoint.
 * @param { string } originalEndpoint The original endpoint.
 * @returns { string } Returns the image URL.
 */
export function imageKitLoader(imageKitEndpoint: string, originalEndpoint: string) {
  return ({ src, loaderParams }: ImageLoaderConfig): string => {
    try {
      if (!src) throw new Error('src is required');
      if (!loaderParams) throw new Error('loaderParams is required');

      const { width, height, quality = 80 } = loaderParams;

      if (!width || !height || width <= 0 || height <= 0)
        throw new Error('width and height are required and must be greater than 0');

      const transform = `tr=w-${width},h-${height},q-${quality}`;

      const url = new URL(src);
      const path = url.pathname.replace(originalEndpoint, '');
      const search = url.search;

      return `${imageKitEndpoint}${path}${search}&${transform}`;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[ImageKitLoader] Error:', error);
      return '';
    }
  };
}
