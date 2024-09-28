import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (change, context) => {
  functions.logger.debug(`Running update category trigger for ${context.params.categoryId}`);

  const newCategory = change.after.data();
  const productCollection = firestore.collection('product');

  return productCollection
    .where('category.id', '==', context.params.categoryId)
    .get()
    .then(snapshot => {
      const batch = firestore.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { category: newCategory });
      });
      return batch.commit();
    });
};
