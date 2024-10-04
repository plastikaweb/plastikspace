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
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly state = inject(Store);
  private readonly notificationService = inject(NotificationConfigService);

  currentUser = signal<User | null>(null);
  currentUserEmail = computed(() => this.currentUser()?.email ?? '');
  loggedIn = computed(() => !!this.currentUser());
  verified = computed(() => !!this.currentUser()?.emailVerified);
  isAdmin = signal<boolean>(false);

  firstLoginAfterRegister = signal(true);

  constructor() {
    this.auth.onAuthStateChanged(async user => {
      this.currentUser.set(user);
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        this.isAdmin.set(!!tokenResult.claims['isAdmin']);
      } else {
        this.isAdmin.set(false);
      }
    });
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigate(['']);
      })
      .catch(error => {
        console.error(error);
        if (error.message?.match(/"message":"BLOCKING_FUNCTION_ERROR_RESPONSE"/)) {
          console.error('BLOCKING_FUNCTION_ERROR_RESPONSE');
        }
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'ERROR',
              message: error?.message?.match(/"message":"(.*?)"/)?.[1] ?? 'Revisa les teves dades',
              duration: 5000,
              action: 'tancar',
            }),
          })
        );
      });
  }

  register(email: string, password: string) {
    this.state.dispatch(activityActions.setActivity({ isActive: true }));

    createUserWithEmailAndPassword(this.auth, email, password)
      .then(credentials => {
        this.logout();
        this.sendVerification(credentials.user);
        this.state.dispatch(activityActions.setActivity({ isActive: false }));
      })
      .catch(error => {
        console.error(error);
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'ERROR',
              message: error?.message?.match(/"message":"(.*?)"/)?.[1] ?? 'Error de registre',
              action: 'tancar',
            }),
          })
        );
        this.state.dispatch(activityActions.setActivity({ isActive: false }));
      });
  }

  logout(): void {
    signOut(this.auth).then(() => this.router.navigate(['login']));
  }

  sendVerification(user: User) {
    this.firstLoginAfterRegister.set(false);

    sendEmailVerification(user)
      .then(() => {
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'SUCCESS',
              message:
                'Registre completat correctament<br> Revisa el teu correu per verificar el teu compte',
            }),
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  requestPassword(email: string) {
    this.state.dispatch(activityActions.setActivity({ isActive: true }));

    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.router.navigate(['login']);
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'SUCCESS',
              message: 'Revisa el teu correu per restablir la contrasenya',
            }),
          })
        );
        this.state.dispatch(activityActions.setActivity({ isActive: false }));
      })
      .catch(error => {
        console.error(error);
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'ERROR',
              message:
                error?.message?.match(/"message":"(.*?)"/)?.[1] ??
                'Petició denegada, revisa les teves dades',
              action: 'tancar',
            }),
          })
        );
        this.state.dispatch(activityActions.setActivity({ isActive: false }));
      });
  }
}
