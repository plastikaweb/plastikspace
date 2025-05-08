import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async change => {
  const before = change.before.data();
  const after = change.after.data();

  if (before?.status === after?.status) {
    functions.logger.debug(`Status not changed, skipping update`);
    return;
  }
  const orderListId = before?.orderListId || after?.orderListId || '';

  if (!orderListId) {
    functions.logger.debug(`Order list id not found, skipping update`);
    return;
  }

  functions.logger.debug(`Running update list order user orders status trigger for ${orderListId}`);

  const orderListOrders = await firestore
    .collectionGroup('orders')
    .where('orderListId', '==', orderListId)
    .get();

  const userOrdersStatus = orderListOrders.docs.reduce((acc, order) => {
    const orderData = order.data();
    const orderStatus = orderData?.status;
    return {
      ...acc,
      [orderStatus]: (acc[orderStatus] || 0) + 1,
    };
  }, {});

  return firestore.doc(`order-list/${orderListId}`).update({
    userOrdersStatus,
  });
};
