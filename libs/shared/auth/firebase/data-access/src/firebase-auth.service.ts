import { LiveAnnouncer } from '@angular/cdk/a11y';
/* eslint-disable no-console */
import { computed, inject, Injectable, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { activityStore } from '@plastik/shared/activity/data-access';
import {
  NotificationConfigService,
  notificationStore,
} from '@plastik/shared/notification/data-access';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  readonly #auth = inject(Auth);
  readonly #router = inject(Router);
  readonly #notificationService = inject(NotificationConfigService);
  readonly #notificationStore = inject(notificationStore);
  readonly #activityStore = inject(activityStore);
  readonly #liveAnnouncer = inject(LiveAnnouncer);

  currentUser = signal<User | null>(null);
  currentUserEmail = computed(() => this.currentUser()?.email ?? '');
  loggedIn = computed(() => !!this.currentUser());
  verified = computed(() => !!this.currentUser()?.emailVerified);
  isAdmin = signal<boolean>(false);

  firstLoginAfterRegister = signal(true);

  constructor() {
    this.#auth.onAuthStateChanged(user => this.handleAuthStateChanged(user));
  }

  /**
   * Updates the email of the currently authenticated user.
   * @returns {Promise<void>} A promise that resolves when the email has been updated.
   */
  async updateEmail(): Promise<void> {
    try {
      const user = this.currentUser();
      if (!user) {
        throw new Error('No hi ha usuari autenticat');
      }
      await this.handleAuthStateChanged(user);
    } catch (error) {
      console.error('Error al actualitzar el email:', error);

      throw error;
    }
  }

  /**
   * Handles changes in the authentication state.
   * @param {User | null} user - The user object or null if the user is not authenticated.
   * @returns {Promise<void>} A promise that resolves when the authentication state has been handled.
   */
  async handleAuthStateChanged(user: User | null): Promise<void> {
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
    this.#activityStore.setActivity(true);

    try {
      this.#notificationStore.dismiss();
      await signInWithEmailAndPassword(this.#auth, email, password);
      await this.#router.navigate(['']);
      this.#liveAnnouncer.announce('Sessió iniciada', 'assertive', 100);
    } catch (error: unknown) {
      console.error(error);
      if ((error as Error).message?.includes('BLOCKING_FUNCTION_ERROR_RESPONSE')) {
        console.error('BLOCKING_FUNCTION_ERROR_RESPONSE');
      }

      const firebaseError = error as FirebaseError;

      const message =
        firebaseError.code === 'auth/invalid-credential'
          ? 'Revisa les teves dades'
          : firebaseError.message;

      this.#notificationStore.show(
        this.#notificationService.getInstance({
          type: 'ERROR',
          message,
          action: 'tancar',
        })
      );
    } finally {
      this.#activityStore.setActivity(false);
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
   * @param {string} name - The name of the user.
   * @returns {Promise<void>} A promise that resolves when the registration process is complete.
   */
  async register(email: string, password: string, name: string): Promise<void> {
    this.#activityStore.setActivity(true);
    this.#notificationStore.dismiss();

    try {
      const credentials = await createUserWithEmailAndPassword(this.#auth, email, password);
      await updateProfile(credentials.user, { displayName: name });
      await this.logout();
      this.sendVerification(credentials.user);
    } catch (error: unknown) {
      console.error(error);

      const firebaseError = error as FirebaseError;

      const message =
        firebaseError.code === 'auth/email-already-in-use'
          ? 'Aquest correu electrònic ja esta registrat'
          : (error as Error).message.includes('PERMISSION_DENIED')
            ? "Només els socis d'El Llevat poden registrar-se a la plataforma"
            : 'Error de registre';

      this.#notificationStore.show(
        this.#notificationService.getInstance({
          type: 'ERROR',
          message,
          action: 'tancar',
        })
      );
    } finally {
      this.#activityStore.setActivity(false);
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
    this.#activityStore.setActivity(true);
    try {
      this.#notificationStore.dismiss();
      await signOut(this.#auth);
      await this.resetAuth();
      await this.#router.navigate(['login']);
      this.#liveAnnouncer.announce('Sessió tancada', 'assertive', 100);
    } catch (error: unknown) {
      console.error('Error during logout:', error);

      this.#notificationStore.show(
        this.#notificationService.getInstance({
          type: 'ERROR',
          message: 'Error durante el tancament de la sessió. Si us plau, torna a intentar-ho.',
          action: 'tancar',
        })
      );
    } finally {
      this.#activityStore.setActivity(false);
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
    this.#activityStore.setActivity(true);
    this.firstLoginAfterRegister.set(false);

    try {
      this.#notificationStore.dismiss();
      await sendEmailVerification(user);

      this.#notificationStore.show(
        this.#notificationService.getInstance({
          type: 'SUCCESS',
          message:
            'Registre completat correctament<br> Revisa el teu correu per verificar el teu compte',
        })
      );
    } catch (error: unknown) {
      console.error('Error sending verification email:', error);

      this.#notificationStore.show(
        this.#notificationService.getInstance({
          type: 'ERROR',
          message:
            (error as Error)?.message?.match(/"message":"(.*?)"/)?.[1] ??
            'Error enviant el correu de verificació',
          action: 'tancar',
        })
      );
    } finally {
      this.#activityStore.setActivity(false);
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
    this.#activityStore.setActivity(true);

    try {
      this.#notificationStore.dismiss();
      await sendPasswordResetEmail(this.#auth, email);
      await this.#router.navigate(['login']);
      this.#notificationStore.show(
        this.#notificationService.getInstance({
          type: 'SUCCESS',
          message: 'Revisa el teu correu per restablir la contrasenya',
        })
      );
    } catch (error: unknown) {
      console.error(error);

      this.#notificationStore.show(
        this.#notificationService.getInstance({
          type: 'ERROR',
          message:
            (error as Error)?.message?.match(/"message":"(.*?)"/)?.[1] ??
            'Petició denegada, revisa les teves dades',
          action: 'tancar',
        })
      );
    } finally {
      this.#activityStore.setActivity(false);
    }
  }

  /**
   * Resets the authentication state by clearing the current user and admin signals and ensuring the user is logged out.
   * @returns {Promise<void>} A promise that resolves when the authentication state is reset.
   */
  async resetAuth(): Promise<void> {
    this.currentUser.set(null);
    this.isAdmin.set(false);

    try {
      if (this.#auth.currentUser) {
        await this.#auth.currentUser.getIdToken(true);

        const currentUser = this.#auth.currentUser;
        if (currentUser) {
          await currentUser.reload();
        }
      } else {
        console.log('state after resetAuth: User not found');
      }
    } catch (error) {
      console.warn('Error al limpiar el estado de autenticación:', error);
    }
  }
}
