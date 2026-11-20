import { AuthFormMessage } from './auth-form-facade.type';

/**
 * How setting a new password ended, as any screen that does it says it. The keys are written out in
 * full because the i18n validator cannot follow a key built at run time, and every app that mounts the
 * screen has to carry them in its language files, and to serve the two routes the links point to.
 * The reset screens hand them to the `outcome` of the shared auth screen, which draws a heading, a
 * sentence and one filled link and does not read `type`; it is kept for a screen that shows one as a notice.
 *
 * - `done`: the password was changed. The link takes the user to the login screen.
 * - `expired`: the link of the email was not accepted, or the address came without one. The backend
 *   answers the same for a link that expired, one that was already used and a request that failed, so
 *   there is one text for all of them. The link takes the user to ask for a new email.
 */
export const AUTH_RESET_PASSWORD_MESSAGES = {
  done: {
    type: 'SUCCESS',
    title: 'auth.resetPassword.done.title',
    body: 'auth.resetPassword.done.description',
    link: { label: 'auth.resetPassword.done.action', route: '/accedir' },
  },
  expired: {
    type: 'ERROR',
    title: 'auth.resetPassword.expired.title',
    body: 'auth.resetPassword.expired.description',
    link: { label: 'auth.resetPassword.expired.action', route: '/recuperar-contrasenya' },
  },
} as const satisfies Record<string, AuthFormMessage>;
