import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async () => {
  functions.logger.debug(`Running update list order state to closed trigger`);

  const orderListCollection = firestore.collection('order-list');
  const orderListDocs = await orderListCollection.where('status', '==', 'progress').get();

  const batch = firestore.batch();

  // Array to store promises of nested collection operations
  const ordersPromises: Promise<void>[] = [];

  // Update the state of each order list to 'done'
  orderListDocs.docs.forEach(doc => {
    functions.logger.debug(`Updating list order state to closed for ${doc.id}`);
    batch.update(doc.ref, { status: 'done' });

    // Process all user orders within this list
    const ordersProcessingPromise = processUserOrders(doc);
    ordersPromises.push(ordersProcessingPromise);
  });

  // Execute the batch for updating order lists
  await batch.commit();

  // Wait for all nested collection operations to complete
  await Promise.all(ordersPromises);

  functions.logger.debug('Finished updating list order state and user orders');
  return;
};

/**
 * @description The function processes all user orders within a list of orders.
 * If the order does not have a 'deliver' status, it changes its status to 'miss'.
 * @param {admin.firestore.QueryDocumentSnapshot} orderListDoc - The document of the order list to process
 * @returns {Promise<void>} A promise that resolves when all orders have been updated
 */
async function processUserOrders(
  orderListDoc: admin.firestore.QueryDocumentSnapshot
): Promise<void> {
  const ordersBatch = firestore.batch();
  let batchCount = 0;

  // Get all orders in the list
  const ordersCollection = orderListDoc.ref.collection('orders');
  const ordersSnapshot = await ordersCollection.get();

  functions.logger.debug(`Processing ${ordersSnapshot.size} orders in list ${orderListDoc.id}`);

  // Check each order
  ordersSnapshot.docs.forEach(orderDoc => {
    const orderData = orderDoc.data();
    const status = orderData.status;
    const newOrderStatus =
      status === 'waitingReview' ? 'notReviewed' : status === 'reviewed' ? 'notDelivered' : status;

    // If the order does not have a 'deliver' status, change it to 'miss'
    if (status !== newOrderStatus) {
      functions.logger.debug(
        `Updating order ${orderDoc.id} state from ${status} to ${newOrderStatus}`
      );
      ordersBatch.update(orderDoc.ref, { status: newOrderStatus });
      batchCount++;
    }
  });

  // Execute the batch only if there are changes to apply
  if (batchCount > 0) {
    functions.logger.debug(`Committing batch with ${batchCount} order updates`);
    ordersBatch.commit();
  }

  return Promise.resolve();
}
