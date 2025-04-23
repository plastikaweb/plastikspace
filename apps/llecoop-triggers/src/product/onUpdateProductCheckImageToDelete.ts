import * as functions from 'firebase-functions';

import { storage } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running checking product image trigger for ${context.params.productId}`);

  const previousProductImg = snapshot.before.data().imgUrl;
  const updatedProductImg = snapshot.after.data().imgUrl;

  if (previousProductImg === updatedProductImg || !previousProductImg) {
    functions.logger.debug(`Product image did not change or was not set, skipping update`);
    return;
  }

  functions.logger.debug(
    `Product image is different: ${previousProductImg} -> ${updatedProductImg}, continuing to deletion`
  );

  const bucket = storage.bucket();
  const sanitizedPreviousProductImg = extractEncodedStoragePath(previousProductImg);
  if (sanitizedPreviousProductImg) {
    functions.logger.debug(`Deleting previous product image: ${sanitizedPreviousProductImg}`);
    return await bucket.file(sanitizedPreviousProductImg).delete();
  }
  return;
};

/**
 * Extracts the encoded storage path from a Firebase Storage URL.
 * @param { string } url - The Firebase Storage URL.
 * @returns { string | null } The encoded storage path or null if not found.
 */
function extractEncodedStoragePath(url: string): string | null {
  const match = url.match(/\/o\/([^?]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
