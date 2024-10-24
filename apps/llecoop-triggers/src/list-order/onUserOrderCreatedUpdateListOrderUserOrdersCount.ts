import { FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  functions.logger.debug(`Running create user order trigger for ${context.params.orderListId}`);

  const order = snapshot.data();
  if (!order) {
    functions.logger.debug(
      `Order ${JSON.stringify(order)} did not have a orderListId, skipping update`
    );
    return;
  }

  return firestore.doc(`order-list/${order.orderListId}`).update({
    orderCount: FieldValue.increment(1),
  });
};
