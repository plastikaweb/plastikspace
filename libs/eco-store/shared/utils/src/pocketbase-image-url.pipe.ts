import { Pipe, PipeTransform } from '@angular/core';

export interface PocketBaseImageSource {
  id: string;
  collectionId: string;
}

@Pipe({
  name: 'pocketBaseImageUrl',
  standalone: true,
})
export class PocketBaseImageUrlPipe implements PipeTransform {
  /**
   * @description Transforms a product (or source with collectionId and id) and an image filename into a PocketBase URL fragment.
   * @param {PocketBaseImageSource | null | undefined} source An object containing collectionId and id.
   * @param {string | null | undefined} image The filename of the image.
   * @returns {string | null} The formatted URL fragment: `collectionId/id/image` or null if image is missing.
   */
  transform(
    source: PocketBaseImageSource | null | undefined,
    image: string | null | undefined
  ): string | null {
    return getPocketBaseImageUrl(source, image);
  }
}

/**
 * @description Returns the PocketBase image URL fragment for a given source and image filename.
 * @param {PocketBaseImageSource | null | undefined} source An object containing collectionId and id.
 * @param {string | null | undefined} image The filename of the image.
 * @returns {string | null} The formatted URL fragment: `collectionId/id/image` or null if image is missing.
 */
export function getPocketBaseImageUrl(
  source: PocketBaseImageSource | null | undefined,
  image: string | null | undefined
): string | null {
  if (!source?.collectionId || !source?.id || !image) {
    return null;
  }
  return `${source.collectionId}/${source.id}/${image}`;
}
