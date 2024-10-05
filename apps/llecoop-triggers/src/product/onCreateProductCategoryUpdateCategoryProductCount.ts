import { FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running create product trigger for ${context.params.productId}`);

  const product = snapshot.data();

  if (!product.categoryRef) {
    functions.logger.debug(`Product did not have a category, skipping update`);
    return;
  }
  const categoryId = product.categoryRef.split('/')[1];
  return firestore.doc(`category/${categoryId}`).update({
    productCount: FieldValue.increment(1),
  });
};
