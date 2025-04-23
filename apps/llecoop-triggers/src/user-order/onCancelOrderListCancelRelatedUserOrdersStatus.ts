import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  const orderListId = context.params.orderListId;
  functions.logger.debug(`Running cancel list order trigger for ${orderListId}`);

  // get if the orderList status is 'canceled'
  const orderList = snapshot.after.data();
  if (orderList.status !== 'cancelled') {
    functions.logger.debug(`Order list ${orderListId} is not canceled, skipping update`);
    return;
  }

  // get all user orders for this orderList
  const userOrders = await firestore
    .collectionGroup('orders')
    .where('orderListId', '==', orderListId)
    .get();

  // update status of all user orders to 'canceled'
  const batch = firestore.batch();
  userOrders.docs.forEach(doc => {
    batch.update(doc.ref, { status: 'cancelled' });
  });
  await batch.commit();

  functions.logger.debug(`All user orders for order list ${orderListId} have been canceled`);

  return;
};
