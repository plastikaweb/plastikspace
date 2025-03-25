import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running update category trigger for ${context.params.orderListId}`);

  const orderSGroupCollection = firestore.collectionGroup('orders');
  const userOrder = snapshot.data();

  const orders = await orderSGroupCollection
    .where('userId', '==', userOrder.userId)
    .where('orderListId', '==', userOrder.orderListId)
    .get();

  if (orders.size > 1) {
    await firestore.doc(`order-list/${userOrder.orderListId}/orders/${userOrder.id}`).delete();
    throw new functions.https.HttpsError(
      'already-exists',
      `Ja tens una comanda activa. Només pots modificar-la o eliminar-la.`
    );
  }

  return;
};
