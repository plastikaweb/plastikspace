import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running update category trigger for ${context.params.categoryId}`);

  const newCategory = snapshot.after.data();
  const productCollection = firestore.collection('product');

  return productCollection
    .where('categoryRef', '==', `category/${context.params.categoryId}`)
    .get()
    .then(snapshot => {
      const batch = firestore.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { category: newCategory, categoryName: newCategory.name });
      });
      return batch.commit();
    });
};
