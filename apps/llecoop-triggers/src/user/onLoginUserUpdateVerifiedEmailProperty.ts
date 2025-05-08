import * as functions from 'firebase-functions';

import { latinize } from '@plastik/shared/latinize';

import { firestore } from '../init';

export default async user => {
  functions.logger.debug(`Running checking if user ${JSON.stringify(user)} has verified email`);

  const userCollection = firestore.collection('user');
  const userDoc = await userCollection.doc(user.uid).get();

  if (!userDoc.exists) {
    functions.logger.debug(`No user found for ${user.email}`);
    throw new functions.https.HttpsError('permission-denied', 'No user found');
  }

  if (user.displayName) {
    await userCollection.doc(user.uid).update({
      name: user.displayName,
      normalizedName: latinize(user.displayName).toLowerCase(),
    });
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
