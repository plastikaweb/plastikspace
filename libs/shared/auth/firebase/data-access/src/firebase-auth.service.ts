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

import {
  notificationActions,
  NotificationConfigService,
} from '@plastik/shared/notification/data-access';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly state = inject(Store);
  private readonly notificationService = inject(NotificationConfigService);
  private readonly user = new BehaviorSubject<User | null>(null);

  currentUser$ = this.user.asObservable();
  currentUser = signal<User | null>(null);
  currentUserEmail = computed(() => this.currentUser()?.email ?? '');
  loggedIn = computed(() => !!this.currentUser());
  verified = computed(() => !!this.currentUser()?.emailVerified);

  constructor() {
    this.auth.onAuthStateChanged(user => this.currentUser.set(user));
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigate(['']);
      })
      .catch(error => {
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
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(credentials => {
        this.logout();
        this.sendVerification(credentials.user);
      })
      .catch(error => {
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'ERROR',
              message: error?.message?.match(/"message":"(.*?)"/)?.[1] ?? 'Error de registre',
              action: 'tancar',
            }),
          })
        );
      });
  }

  logout(): void {
    signOut(this.auth).then(() => this.router.navigate(['login']));
  }

  sendVerification(user: User) {
    sendEmailVerification(user).then(e => {
      this.state.dispatch(
        notificationActions.show({
          configuration: this.notificationService.getInstance({
            type: 'SUCCESS',
            message:
              'Registre completat correctament<br> Revisa el teu correu per verificar el teu compte',
          }),
        })
      );
    });
  }

  requestPassword(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.router.navigate(['login']);
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'SUCCESS',
              message: 'Revisa el teu correu per restablir la contrasenya',
            }),
            preserve: true,
          })
        );
      })
      .catch(error => {
        console.error('error', error);
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'ERROR',
              message:
                error?.message?.match(/"message":"(.*?)"/)?.[1] ??
                "Error a l'enviar el correu per regenerar la contrasenya",
              action: 'tancar',
            }),
          })
        );
      });
  }
}
