import pkg from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import * as functions from 'firebase-functions';
const { auth } = pkg;

initializeApp();

export default async user => {
  const userId = user.id;
  functions.logger.debug(`Running delete trigger for ${userId}`);

  return auth()
    .getUser(userId)
    .then(userRecord => {
      if (!userRecord) {
        functions.logger.debug(`L'usuari ${userId} no existeix`);
        return;
      }

      return auth()
        .deleteUser(userId)
        .then(() => {
          const message = `L'usuari amb el id ${userId} s'ha eliminat`;
          functions.logger.debug(message);
          return {
            message,
          };
        })
        .catch(error => {
          functions.logger.error(error);
          throw new functions.https.HttpsError(
            'internal',
            `Error a l'intentar eliminar l'usuari de la llista de autenticació ${userId}`
          );
        });
    });
};
