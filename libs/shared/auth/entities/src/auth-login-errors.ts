import { AuthFormMessage } from './auth-form-facade.type';

/**
 * Why a login attempt ended without a session, as any login screen says it. The keys are written out
 * in full because the i18n validator cannot follow a key built at run time, and every app that mounts
 * a login screen has to carry them in its language files.
 *
 * - `wrong`: the credentials were not accepted, or the request failed. One text for both, and the same
 *   whether the address exists or not.
 * - `secondStep`: the account asks for the emailed code, which the screen cannot take.
 */
export const AUTH_LOGIN_ERRORS = {
  wrong: {
    type: 'ERROR',
    title: 'auth.login.error.wrong.title',
    body: 'auth.login.error.wrong.body',
  },
  secondStep: {
    type: 'ERROR',
    title: 'auth.login.error.secondStep.title',
    body: 'auth.login.error.secondStep.body',
  },
} as const satisfies Record<string, AuthFormMessage>;
