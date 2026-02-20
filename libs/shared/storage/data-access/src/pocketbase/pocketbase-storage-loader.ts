// my-image-loader.ts
import { ImageLoaderConfig } from '@angular/common';

export type PocketBaseImageLoaderConfig = ImageLoaderConfig & {
  loaderParams: {
    width?: number;
    height?: number;
    availableThumbs?: number[];
    quality?: number;
  };
};
/**
 * @description A custom image loader for pocketBase.
 * @param { string } baseUrl The pocketbase storage base url.
 * @returns { string } Returns the image url with thumbnail parameters.
 */
export function pocketBaseStorageLoader(baseUrl: string) {
  return ({
    src,
    loaderParams,
    width,
  }: PocketBaseImageLoaderConfig & { width?: number }): string => {
    try {
      if (!src) throw new Error('src is required');

      // The available thumb sizes configured in the PocketBase collection schema for products.images
      const availableThumbs = loaderParams?.availableThumbs?.length
        ? loaderParams.availableThumbs
        : [100, 300, 500, 750, 1600];

      // If width is provided via ngSrcset or dimensions, we find the closest equal or larger thumb size
      const targetWidth = width || loaderParams?.width;

      let params = '';
      if (targetWidth) {
        // Find the smallest thumbnail size that is still large enough to cover the requested width
        const bestThumb =
          availableThumbs.find(size => size >= targetWidth) ||
          availableThumbs[availableThumbs.length - 1];

        // PocketBase format is WxH, we use the same value for both to match square thumbs in schema
        params = `?thumb=${bestThumb}x${bestThumb}`;
      } else if (loaderParams?.height && loaderParams?.width) {
        // Fallback for explicitly typed old dimensions format if used directly
        params = `?thumb=${loaderParams.width}x${loaderParams.height}`;
      }

      return `${baseUrl}api/files/${src}${params}`;
    } catch {
      // console.error('[PocketBase Loader] Error:', error);
      return '';
    }
  };
}
