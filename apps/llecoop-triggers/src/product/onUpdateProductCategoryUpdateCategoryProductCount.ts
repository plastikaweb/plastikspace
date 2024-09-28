import { FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (change, context) => {
  functions.logger.debug(`Running update product trigger for ${context.params.productId}`);

  const previousProductCategoryId = change.before.data().category?.id;
  const updatedProductCategoryId = change.after.data().category?.id;

  if (updatedProductCategoryId === previousProductCategoryId) {
    functions.logger.debug(`Product category did not change, skipping update`);
    return;
  }

  return firestore.runTransaction(async transaction => {
    if (previousProductCategoryId) {
      const oldCategoryDoc = firestore.doc(`category/${previousProductCategoryId}`);
      const oldCategorySnapshot = await transaction.get(oldCategoryDoc);
      const oldProductCount = oldCategorySnapshot.data().productCount || 0;

      if (oldProductCount > 0) {
        transaction.update(oldCategoryDoc, {
          productCount: FieldValue.increment(-1),
        });
      }
    }

    if (updatedProductCategoryId) {
      const newCategoryDoc = firestore.doc(`category/${updatedProductCategoryId}`);
      transaction.update(newCategoryDoc, {
        productCount: FieldValue.increment(1),
      });
    }
  });
};
