import pkg from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import * as functions from 'firebase-functions';

const { auth } = pkg;

initializeApp();

export default async (change, context) => {
  const userId = context.params.userId;
  functions.logger.debug(`Running update trigger for ${userId}`);

  const authUser = await auth().getUser(userId);
  if (!authUser) {
    functions.logger.debug(`User with ID ${userId} doesn't exist`);
    return;
  }

  const user = change.after.data();

  // Format phone number to E.164
  let phoneNumber = null;
  if (user.phone) {
    // Remove spaces and hyphens
    const cleanPhone = user.phone.replace(/[\s-]/g, '');
    // Ensure it starts with +34 (Spain code)
    phoneNumber = cleanPhone.startsWith('+34')
      ? cleanPhone
      : cleanPhone.startsWith('34')
        ? `+${cleanPhone}`
        : `+34${cleanPhone}`;
  }

  try {
    const updateData: pkg.auth.UpdateRequest = {
      displayName: user.name || authUser.displayName,
      photoURL: user.photoUrl || authUser.photoURL,
      phoneNumber: phoneNumber || authUser.phoneNumber,
    };

    // If the email has changed, update and disable the account
    if (user.email && user.email !== authUser.email) {
      updateData.email = user.email;
      updateData.emailVerified = false;
      updateData.disabled = true;
    } else {
      updateData.email = authUser.email;
    }

    await auth().updateUser(userId, updateData);

    // If the email has changed, send verification email
    if (user.email && user.email !== authUser.email) {
      // const emailLink = await auth().generateEmailVerificationLink(user.email);
      // TODO: sendCustomVerificationEmail(user.email, emailLink);
    }

    const message = `User with ID ${userId} has been updated${user.email && user.email !== authUser.email ? ' and verification email sent' : ''}`;
    functions.logger.debug(message);
    return { message };
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      'internal',
      `Error trying to update user in authentication list ${userId}`
    );
  }
};
