import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async snapshot => {
  const userId = snapshot.id;
  const userEmail = snapshot.data().email;

  functions.logger.debug(`Running create whiteListed user trigger for ${userId}`);

  const userCollection = firestore.collection('user');
  const userDocs = await userCollection.where('email', '==', userEmail).get();

  if (userDocs.size > 1) {
    await firestore.doc(`user/${userId}}`).delete();
    functions.logger.debug(`Deleted user with ID ${userId} from firestore`);

    throw new functions.https.HttpsError(
      'already-exists',
      `L'usuari amb id ${userId} s'ha eliminat perquè ja existeix en la llista blanca de socis`
    );
  }

  return;
};
