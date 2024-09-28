import { FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running delete product trigger for ${context.params.productId}`);

  const deletedProduct = snapshot.data();

  const categoryId = deletedProduct.category?.id;

  functions.logger.debug(`category affected: ${categoryId}`);

  if (!categoryId) {
    functions.logger.debug(`Product did not have a category, skipping update`);
    return;
  }

  return firestore.doc(`category/${categoryId}`).update({
    productCount: FieldValue.increment(-1),
  });
};
