import * as functions from 'firebase-functions';

import { LlecoopOrderProductTotal, LlecoopUserOrder } from '@plastik/llecoop/entities';

import { firestore } from '../init';

const calculateTotal = (orderListData: FirebaseFirestore.QuerySnapshot) => {
  const productMap = new Map<string, LlecoopOrderProductTotal>();

  orderListData.docs.forEach(order => {
    const userOrderData = order.data() as LlecoopUserOrder;
    const cart = userOrderData.cart;
    const status = userOrderData.status;

    cart.forEach(product => {
      functions.logger.debug(`product for ${order.id}: ${JSON.stringify(product)}`);

      const { initQuantity, finalQuantity, name, id, price, iva, priceWithIva, unit } = product;
      const existingProduct = productMap.get(id);

      if (!existingProduct) {
        functions.logger.debug(`new product found: ${name} ${id} ${finalQuantity}`);

        productMap.set(id, {
          id,
          name,
          quantity: finalQuantity,
          price,
          iva,
          priceWithIva,
          unit,
          totalPrice: finalQuantity * priceWithIva,
          reviewed: status !== 'waitingReview',
        });
      } else {
        const { quantity, reviewed } = existingProduct;
        const totalQuantity = quantity + (finalQuantity > 0 ? finalQuantity : initQuantity);

        productMap.set(id, {
          ...existingProduct,
          quantity: totalQuantity,
          totalPrice: totalQuantity * priceWithIva,
          reviewed: reviewed || (status !== 'waitingReview' && finalQuantity > 0),
        });
      }
    });
  });

  return Array.from(productMap.values());
};

export default async context => {
  functions.logger.debug(`Running update total trigger for ${context.params.orderListId}`);

  const orderListOrdersGroup = firestore
    .collectionGroup('orders')
    .where('orderListId', '==', context.params.orderListId);

  const orderListData = await orderListOrdersGroup.get();

  if (!orderListData) {
    functions.logger.debug(
      `Order list ${JSON.stringify(orderListOrdersGroup)} did not have a id, skipping update`
    );
    return;
  }

  const total = calculateTotal(orderListData);

  functions.logger.debug(`total for ${context.params.orderListId}: ${JSON.stringify(total)}`);

  return firestore.doc(`order-list/${context.params.orderListId}`).update({ total });
};
