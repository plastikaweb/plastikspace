import { FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running create product trigger for ${context.params.productId}`);

  const product = snapshot.data();

  if (!product.category?.id) {
    functions.logger.debug(`Product did not have a category, skipping update`);
    return;
  }

  return firestore.doc(`category/${product.category.id}`).update({
    productCount: FieldValue.increment(1),
  });
};
