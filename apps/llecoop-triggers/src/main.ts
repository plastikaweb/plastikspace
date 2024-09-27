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

export const onUpdateCategoryUpdateProductCategory = functions.firestore
  .document('category/{categoryId}')
  .onUpdate(async (change, context) => {
    await (await import('./category/onUpdateCourse')).default(change, context);
  });

export const onDeleteCategoryUpdateProductCategory = functions.firestore
  .document('category/{categoryId}')
  .onDelete(async (snapshot, context) => {
    await (await import('./category/onDeleteCourse')).default(snapshot, context);
  });
