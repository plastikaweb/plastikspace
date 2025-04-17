/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info('Hello logs!', { structuredData: true });
//   response.send('Hello from Firebase!');
// });

// Category
export const onUpdateCategoryUpdateProductCategory = functions.firestore
  .document('category/{categoryId}')
  .onUpdate(async (change, context) => {
    await (
      await import('./category/onUpdateCategoryUpdateProductCategory')
    ).default(change, context);
  });

export const onDeleteCategoryUpdateProductCategory = functions.firestore
  .document('category/{categoryId}')
  .onDelete(async (snapshot, context) => {
    await (
      await import('./category/onDeleteCategoryUpdateProductCategory')
    ).default(snapshot, context);
  });

// Product
export const onCreateProductUpdateCategoryProductCount = functions.firestore
  .document('product/{productId}')
  .onCreate(async (snapshot, context) => {
    await (
      await import('./product/onCreateProductCategoryUpdateCategoryProductCount')
    ).default(snapshot, context);
  });

export const onUpdateProductUpdateCategoryProductCount = functions.firestore
  .document('product/{productId}')
  .onUpdate(async (change, context) => {
    await (
      await import('./product/onUpdateProductCategoryUpdateCategoryProductCount')
    ).default(change, context);
  });

export const onDeleteProductUpdateCategoryProductCount = functions.firestore
  .document('product/{productId}')
  .onDelete(async (snapshot, context) => {
    await (
      await import('./product/onDeleteProductUpdateCategoryProductCount')
    ).default(snapshot, context);
  });

// User
export const onRequestRegisterUserBlockIfUserIsNotWhitelisted = functions.auth
  .user()
  .beforeCreate(async user => {
    await (await import('./user/onRequestRegisterUserBlockIfUserIsNotWhitelisted')).default(user);
  });

export const onLoginUserUpdateVerifiedEmailProperty = functions.auth
  .user()
  .beforeSignIn(async user => {
    await (await import('./user/onLoginUserUpdateVerifiedEmailProperty')).default(user);
  });

export const setUserAdminClaim = functions.https.onCall(async data => {
  await (await import('./user/setUserAdminClaim')).default(data);
});

export const onCreateWhiteListedUserCheckIfUserAlreadyExists = functions.firestore
  .document('user/{userId}')
  .onCreate(async snapshot => {
    await (
      await import('./user/onCreateWhiteListedUserCheckIfUserAlreadyExists')
    ).default(snapshot);
  });

export const onDeleteUserDeleteUserFromAuth = functions.firestore
  .document('user/{userId}')
  .onDelete(async snapshot => {
    await (await import('./user/onDeleteUserDeleteUserFromAuth')).default(snapshot);
  });

export const onUpdateUserUpdateAuth = functions.firestore
  .document('user/{userId}')
  .onUpdate(async (change, context) => {
    await (await import('./user/onUpdateUserUpdateAuth')).default(change, context);
  });

// Order list
export const onOrderListTimeFinishUpdateOrderListState = functions.pubsub
  .schedule('0 12 * * 1')
  .timeZone('Europe/Madrid')
  .onRun(async () => {
    await (await import('./order-list/onOrderListTimeFinishUpdateOrderListState')).default();
  });

export const onUserOrderCreatedUpdateOrderListUserOrdersCount = functions.firestore
  .document('order-list/{orderListId}/orders/{orderId}')
  .onCreate(async (snapshot, context) => {
    await (
      await import('./order-list/onUserOrderCreatedUpdateOrderListUserOrdersCount')
    ).default(snapshot, context);
  });

export const onUserOrderDeletedUpdateOrderListUserOrdersCount = functions.firestore
  .document('order-list/{orderListId}/orders/{orderId}')
  .onDelete(async (snapshot, context) => {
    await (
      await import('./order-list/onUserOrderDeletedUpdateOrderListUserOrdersCount')
    ).default(snapshot, context);
  });

export const onUserOrderStatusUpdateUpdateOrderListUserOrdersStatus = functions.firestore
  .document('order-list/{orderListId}/orders/{orderId}')
  .onWrite(async snapshot => {
    await (
      await import('./order-list/onUserOrderStatusUpdateUpdateOrderListUserOrdersStatus')
    ).default(snapshot);
  });

// User order
export const onCreateUserOrderCheckIfAnUserOrderExists = functions.firestore
  .document('order-list/{orderListId}/orders/{orderId}')
  .onCreate(async (snapshot, context) => {
    await (
      await import('./user-order/onCreateUserOrderCheckIfAnUserOrderExists')
    ).default(snapshot, context);
  });

export const onChangeUserOrderUpdateOrderListTotal = functions.firestore
  .document('order-list/{orderListId}/orders/{orderId}')
  .onWrite(async (_, context) => {
    await (await import('./user-order/onChangeUserOrderUpdateOrderListTotal')).default(context);
  });

export const onCancelOrderListCancelRelatedUserOrdersStatus = functions.firestore
  .document('order-list/{orderListId}')
  .onUpdate(async (change, context) => {
    await (
      await import('./user-order/onCancelOrderListCancelRelatedUserOrdersStatus')
    ).default(change, context);
  });

export const onDeleteOrderListDeleteRelatedUserOrders = functions.firestore
  .document('order-list/{orderListId}')
  .onDelete(async snapshot => {
    await (await import('./user-order/onDeleteOrderListDeleteRelatedUserOrders')).default(snapshot);
  });
