// my-image-loader.ts
import { ImageLoaderConfig } from '@angular/common';

export type PocketBaseImageLoaderConfig = ImageLoaderConfig & {
  loaderParams: {
    width: number;
    height: number;
  };
};
/**
 * @description A custom image loader for pocketBase.
 * @param { string } baseUrl The pocketbase storage base url.
 * @returns { string } Returns the image url with thumbnail parameters.
 */
export function pocketBaseStorageLoader(baseUrl: string) {
  return ({ src, loaderParams }: PocketBaseImageLoaderConfig): string => {
    try {
      if (!src) throw new Error('src is required');

      const { width, height } = loaderParams ?? {};
      let params = '';
      if (width && height) {
        params = `?thumb=${height}x${width}`;
      }
      return `${baseUrl}api/files/${src}${params}`;
    } catch {
      // console.error('[PocketBase Loader] Error:', error);
      return '';
    }
  };
}
