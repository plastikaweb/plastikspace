/* eslint-disable no-console */
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { activityActions } from '@plastik/shared/activity/data-access';

import {
  notificationActions,
  NotificationConfigService,
} from '@plastik/shared/notification/data-access';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  readonly #auth = inject(Auth);
  readonly #router = inject(Router);
  readonly #state = inject(Store);
  readonly #notificationService = inject(NotificationConfigService);

  currentUser = signal<User | null>(null);
  currentUserEmail = computed(() => this.currentUser()?.email ?? '');
  loggedIn = computed(() => !!this.currentUser());
  verified = computed(() => !!this.currentUser()?.emailVerified);
  isAdmin = signal<boolean>(false);

  firstLoginAfterRegister = signal(true);

  constructor() {
    this.#auth.onAuthStateChanged(this.handleAuthStateChanged.bind(this));
  }

  private async handleAuthStateChanged(user: User | null): Promise<void> {
    this.currentUser.set(user);
    if (user) {
      const tokenResult = await user.getIdTokenResult();
      this.isAdmin.set(!!tokenResult.claims['isAdmin']);
    } else {
      this.isAdmin.set(false);
    }
  }

  /**
   * Logs in a user using their email and password.
   *
   * This method dispatches an activity action to indicate that a login attempt is in progress.
   * It uses Firebase's `signInWithEmailAndPassword` to authenticate the user.
   *
   * On successful login, it navigates to the home route and dispatches an activity action to indicate that the login attempt has ended.
   *
   * If an error occurs during login, it logs the error to the console and checks if the error message contains "BLOCKING_FUNCTION_ERROR_RESPONSE".
   * If such an error is found, it logs a specific message to the console.
   *
   * Regardless of the error type, it dispatches a notification action to show an error message to the user.
   * Finally, it dispatches an activity action to indicate that the login attempt has ended.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<void>} A promise that resolves when the login process is complete.
   */
  async login(email: string, password: string): Promise<void> {
    this.#state.dispatch(activityActions.setActivity({ isActive: true }));

    try {
      await signInWithEmailAndPassword(this.#auth, email, password);
      await this.#router.navigate(['']);
    } catch (error) {
      console.error(error);
      if ((error as Error).message?.includes('BLOCKING_FUNCTION_ERROR_RESPONSE')) {
        console.error('BLOCKING_FUNCTION_ERROR_RESPONSE');
      }
      this.#state.dispatch(
        notificationActions.show({
          configuration: this.#notificationService.getInstance({
            type: 'ERROR',
            message:
              (error as Error)?.message?.match(/"message":"(.*?)"/)?.[1] ??
              'Revisa les teves dades',
            duration: 5000,
            action: 'tancar',
          }),
        })
      );
    } finally {
      this.#state.dispatch(activityActions.setActivity({ isActive: false }));
    }
  }

  /**
   * Registers a new user with the provided email and password.
   *
   * This method dispatches an activity action to indicate that a registration
   * process is active. It attempts to create a new user with the given email
   * and password using Firebase authentication. If the registration is successful,
   * it logs out the user and sends a verification email. If an error occurs during
   * the registration process, it logs the error and dispatches a notification action
   * with the error message.
   * @param {string} email - The email address of the user to register.
   * @param {string} password - The password for the new user.
   * @returns {Promise<void>} A promise that resolves when the registration process is complete.
   */
  async register(email: string, password: string): Promise<void> {
    this.#state.dispatch(activityActions.setActivity({ isActive: true }));
    try {
      const credentials = await createUserWithEmailAndPassword(this.#auth, email, password);
      await this.logout();
      this.sendVerification(credentials.user);
    } catch (error) {
      console.error(error);
      this.#state.dispatch(
        notificationActions.show({
          configuration: this.#notificationService.getInstance({
            type: 'ERROR',
            message:
              (error as Error)?.message?.match(/"message":"(.*?)"/)?.[1] ?? 'Error de registre',
            action: 'tancar',
          }),
        })
      );
    } finally {
      this.#state.dispatch(activityActions.setActivity({ isActive: false }));
    }
  }

  /**
   * Logs out the current user.
   *
   * by signing them out of Firebase authentication,
   * navigating to the login page,
   * logging any errors to the console,
   * and dispatching a notification action to show an error message.
   * @returns {Promise<void>} A promise that resolves when the logout process is complete.
   */
  async logout(): Promise<void> {
    this.#state.dispatch(activityActions.setActivity({ isActive: true }));
    try {
      await signOut(this.#auth);
      await this.#router.navigate(['login']);
    } catch (error) {
      console.error('Error during logout:', error);
      this.#state.dispatch(
        notificationActions.show({
          configuration: this.#notificationService.getInstance({
            type: 'ERROR',
            message: 'Error during logout. Please try again.',
            action: 'tancar',
          }),
        })
      );
    } finally {
      this.#state.dispatch(activityActions.setActivity({ isActive: false }));
    }
  }

  /**
   * Sends a verification email to the specified user.
   *
   * This method sets the first login after registration flag to false,
   * attempts to send a verification email to the user, and dispatches
   * a success notification if the email is sent successfully. If an
   * error occurs while sending the email, it logs the error to the console.
   * @param {User} user - The user to whom the verification email will be sent.
   * @returns {Promise<void>} A promise that resolves when the email has been sent.
   */
  async sendVerification(user: User): Promise<void> {
    this.#state.dispatch(activityActions.setActivity({ isActive: true }));
    this.firstLoginAfterRegister.set(false);

    try {
      await sendEmailVerification(user);
      this.#state.dispatch(
        notificationActions.show({
          configuration: this.#notificationService.getInstance({
            type: 'SUCCESS',
            message:
              'Registre completat correctament<br> Revisa el teu correu per verificar el teu compte',
          }),
        })
      );
    } catch (error) {
      console.error('Error sending verification email:', error);
    } finally {
      this.#state.dispatch(activityActions.setActivity({ isActive: false }));
    }
  }

  /**
   * Requests a password reset email to be sent to the specified email address.
   *
   * This method dispatches an activity action to indicate that a password reset request is in progress.
   * It uses Firebase's `sendPasswordResetEmail` to send the reset email.
   *
   * On successful request, it navigates to the login route and dispatches a success notification.
   * If an error occurs during the request, it logs the error to the console and dispatches an error notification.
   * Finally, it dispatches an activity action to indicate that the password reset request has ended.
   * @param {string} email - The email address to send the password reset email to.
   * @returns {Promise<void>} A promise that resolves when the password reset request process is complete.
   */
  async requestPassword(email: string): Promise<void> {
    this.#state.dispatch(activityActions.setActivity({ isActive: true }));

    try {
      await sendPasswordResetEmail(this.#auth, email);
      await this.#router.navigate(['login']);
      this.#state.dispatch(
        notificationActions.show({
          configuration: this.#notificationService.getInstance({
            type: 'SUCCESS',
            message: 'Revisa el teu correu per restablir la contrasenya',
          }),
        })
      );
    } catch (error) {
      console.error(error);
      this.#state.dispatch(
        notificationActions.show({
          configuration: this.#notificationService.getInstance({
            type: 'ERROR',
            message:
              (error as Error)?.message?.match(/"message":"(.*?)"/)?.[1] ??
              'Petició denegada, revisa les teves dades',
            action: 'tancar',
          }),
        })
      );
    } finally {
      this.#state.dispatch(activityActions.setActivity({ isActive: false }));
    }
  }
}
