import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (change, context) => {
  functions.logger.debug(
    `Running update trigger for category with id ${context.params.categoryId}`
  );

  const newCategory = change.after.data();
  const productCollection = firestore.collection('product');

  return productCollection
    .where('category.id', '==', context.params.categoryId)
    .get()
    .then(snapshot => {
      const batch = firestore.batch();
      snapshot.docs.forEach(doc => {
        functions.logger.debug(`Updating category ${newCategory} in product ${doc.id}`);

        batch.update(doc.ref, { category: newCategory });
      });
      return batch.commit();
    });
};
