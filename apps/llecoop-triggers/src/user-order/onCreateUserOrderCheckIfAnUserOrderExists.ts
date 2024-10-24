import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running update category trigger for ${context.params.orderListId}`);

  const orderSGroupCollection = firestore.collectionGroup('orders');
  const order = snapshot.data();

  const orders = await orderSGroupCollection
    .where('userId', '==', order.userId)
    .where('orderListId', '==', order.orderListId)
    .get();

  if (orders.size > 1) {
    await firestore.doc(`order-list/${order.orderListId}/orders/${order.id}`).delete();
    throw new functions.https.HttpsError(
      'already-exists',
      `Ja tens una comanda activa. Només pots modificar-la o eliminar-la.`
    );
  }

  return;
};
