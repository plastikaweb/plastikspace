import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async user => {
  functions.logger.debug(`Running checking if user with ${user.email} has verified email`);

  const userCollection = firestore.collection('user');
  const userDoc = await userCollection.doc(user.uid).get();

  if (!userDoc.exists) {
    functions.logger.debug(`No user found for ${user.email}`);
    throw new functions.https.HttpsError('permission-denied', 'No user found');
  }

  if (user.emailVerified && !userDoc.data().emailVerified) {
    await userCollection.doc(user.uid).update({
      emailVerified: true,
    });
  }

  functions.logger.debug(
    `Soci amb el correu electrònic ${user.email} ha verificat el correu i s'ha actualitzat a la base de dades`
  );

  return user;
};
