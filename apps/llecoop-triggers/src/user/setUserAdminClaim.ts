import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firestore } from '../init';

export default async (id, context) => {
  functions.logger.debug(`Running setUserAdminClaim trigger for ${id}`);
  return admin
    .auth()
    .getUser(id)
    .then(user => {
      if (!user) {
        throw new functions.https.HttpsError('not-found', `L'usuari ${id} no existeix`);
      }

      return admin.auth().setCustomUserClaims(user.uid, {
        ...user.customClaims,
        admin: true,
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
