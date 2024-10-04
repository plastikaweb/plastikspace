import pkg from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firestore } from '../init';
const { auth } = pkg;

export default async id => {
  functions.logger.debug(`Running setUserAdminClaim trigger for ${id}`);
  return auth()
    .getUser(id)
    .then(user => {
      if (!user) {
        throw new functions.https.HttpsError('not-found', `L'usuari ${id} no existeix`);
      }

      return auth().setCustomUserClaims(user.uid, {
        ...user.customClaims,
        isAdmin: true,
      });
    })
    .then(() => {
      const message = `L'usuari amb el correu electrònic ${id} ara és administrador`;
      functions.logger.debug(message);
      const userCollection = firestore.collection('user');
      userCollection.doc(id).update({ isAdmin: true });

      return {
        message,
      };
    })
    .catch(error => {
      functions.logger.error(error);
      throw new functions.https.HttpsError(
        'internal',
        `Error en fer administrador l'usuari amb el correu electrònic ${id}`
      );
    });
};
