import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async () => {
  functions.logger.debug(`Running update list order state to closed trigger`);

  const orderListCollection = firestore.collection('order-list');

  return orderListCollection
    .where('status', '==', 'progress')
    .get()
    .then(querySnapshot => {
      const batch = firestore.batch();
      querySnapshot.docs.forEach(doc => {
        functions.logger.debug(`Updating list order state to closed for ${doc.id}`);

        batch.update(doc.ref, { status: 'done' });
      });
      return batch.commit();
    });
};
