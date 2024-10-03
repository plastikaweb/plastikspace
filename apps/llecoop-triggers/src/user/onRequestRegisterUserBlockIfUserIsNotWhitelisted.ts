import * as functions from 'firebase-functions';

import { firestore } from '../init';

export default async user => {
  if (!user.email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required');
  }

  functions.logger.debug(
    `Running registering user to see if user is whitelisted for ${user.email}`
  );

  const userCollection = firestore.collection('user');
  const allWhitelistDocs = await userCollection
    .where('email', '==', user.email)
    .where('registered', '!=', true)
    .get();

  if (allWhitelistDocs.empty) {
    functions.logger.debug(`El correu electrònic ${user.email} no correspon a cap soci del Llevat`);
    throw new functions.https.HttpsError(
      'permission-denied',
      "Només els socis d'El Llevat poden registrar-se a la plataforma"
    );
  }

  const whiteListDoc = allWhitelistDocs.docs[0];

  await userCollection.doc(user.uid).set({
    email: user.email,
    createdAt: whiteListDoc.data().createdAt,
    updatedAt: new Date(),
    registered: true,
    emailVerified: false,
    isAdmin: false,
    disabled: false,
  });

  await whiteListDoc.ref.delete();

  functions.logger.debug(`Soci registrat amb el correu electrònic ${user.email}`);

  return user;
};
