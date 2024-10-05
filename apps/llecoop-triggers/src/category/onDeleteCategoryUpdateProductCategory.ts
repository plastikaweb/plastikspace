import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running delete category trigger for ${context.params.categoryId}`);

  const deletedCategory = snapshot.data();
  const productCollection = firestore.collection('product');

  return productCollection
    .where('categoryRef', '==', `category/${context.params.categoryId}`)
    .get()
    .then(querySnapshot => {
      const batch = firestore.batch();
      querySnapshot.docs.forEach(doc => {
        functions.logger.debug(`Deleting category${deletedCategory} in product ${doc.id}`);

        batch.update(doc.ref, { categoryRef: null });
      });
      return batch.commit();
    });
};
