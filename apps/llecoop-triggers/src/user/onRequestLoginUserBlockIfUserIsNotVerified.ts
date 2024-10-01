import * as functions from 'firebase-functions';

export default async user => {
  if (!user.emailVerified) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Has de validar el teu compte. Revisa el teu correu electrònic'
    );
  }
  if (user.disabled) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'El teu compte ha estat deshabilitat. Consultar amb El LLevat'
    );
  }

  functions.logger.debug(`Soci validat amb el correu electrònic ${user.email}`);

  return user;
};
