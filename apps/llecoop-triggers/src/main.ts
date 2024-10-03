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
export const onCreateProductCategoryUpdateCategoryProductCount = functions.firestore
  .document('product/{productId}')
  .onCreate(async (snapshot, context) => {
    await (
      await import('./product/onCreateProductCategoryUpdateCategoryProductCount')
    ).default(snapshot, context);
  });

export const onUpdateProductCategoryUpdateCategoryProductCount = functions.firestore
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
export const onRegisterUserBlockIfUserIsNotWhitelisted = functions.auth
  .user()
  .beforeCreate(async user => {
    await (await import('./user/onRequestRegisterUserBlockIfUserIsNotWhitelisted')).default(user);
  });

export const OnLoginUserUpdateVerifiedEmailProperty = functions.auth
  .user()
  .beforeSignIn(async user => {
    await (await import('./user/onLoginUserUpdateVerifiedEmailProperty')).default(user);
  });

export const onCreateWhiteListedUserCheckIfUserAlreadyExists = functions.firestore
  .document('user/{userId}')
  .onCreate(async (snapshot, context) => {
    await (
      await import('./user/onCreateWhiteListedUserCheckIfUserAlreadyExists')
    ).default(snapshot, context);
  });
