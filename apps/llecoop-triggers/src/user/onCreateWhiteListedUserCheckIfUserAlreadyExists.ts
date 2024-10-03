import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async (snapshot, context) => {
  const userId = snapshot.id;
  const userEmail = snapshot.data().email;

  functions.logger.debug(`Running create whiteListed user trigger for ${userId}`);

  const userCollection = firestore.collection('user');

  const userDocs = await userCollection.where('email', '==', userEmail).get();

  functions.logger.debug(`User with email ${userEmail} in users list ${userDocs.size} times`);

  if (userDocs.size > 1) {
    await firestore
      .doc(`user/${userId}}`)
      .get()
      .then(doc => {
        functions.logger.debug(`Deleting user with id ${userId}`);
        if (doc.exists) {
          doc.ref.delete();
        }
      });

    throw new functions.https.HttpsError(
      'permission-denied',
      `L'usuari amb id ${userId} ja existeix en la llista blanca de socis`
    );
  }

  return;
};
