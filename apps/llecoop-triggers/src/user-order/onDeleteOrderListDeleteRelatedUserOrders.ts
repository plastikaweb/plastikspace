import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async snapshot => {
  const orderListId = snapshot.id;
  functions.logger.debug(`Running delete related user orders trigger for ${orderListId}`);

  const userOrders = await firestore
    .collectionGroup('orders')
    .where('orderListId', '==', orderListId)
    .get();

  const batch = firestore.batch();
  userOrders.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  functions.logger.debug(`All user orders for order list ${orderListId} have been deleted`);

  return batch.commit();
};
