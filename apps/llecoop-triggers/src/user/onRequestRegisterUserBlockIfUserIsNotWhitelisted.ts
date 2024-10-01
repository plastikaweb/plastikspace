import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async user => {
  if (!user.email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required');
  }

  functions.logger.debug(
    `Running registering user to see if user is whitelisted for ${user.email}`
  );

  const allWhitelistDocs = await firestore
    .collection('userWhiteList')
    .where('email', '==', user.email)
    .get();

  if (allWhitelistDocs.empty) {
    functions.logger.debug(`El correu electrònic ${user.email} no correspon a cap soci del Llevat`);
    throw new functions.https.HttpsError('permission-denied', 'No estàs autoritzat a registrar-te');
  }

  functions.logger.debug(`Soci registrat amb el correu electrònic ${user.email}`);

  return user;
};
