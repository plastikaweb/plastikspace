/* eslint-disable no-console */
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
  loggedIn = false;

  constructor() {
    this.auth.onAuthStateChanged(user => {
      this.user.next(user);
      this.loggedIn = !!user;
    });
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigate(['']);
      })

      .catch(error => {
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'ERROR',
              message: error?.message?.match(/"message":"(.*?)"/)[1] ?? 'Revisa les teves dades',
              duration: 5000,
              action: 'tancar',
            }),
          })
        );
      });
  }

  // async getUser(): Promise<User | null> {
  //   const storedUserKey = Object.keys(sessionStorage).find(key =>
  //     key.startsWith('firebase:authUser:')
  //   );
  //   if (!storedUserKey) {
  //     return Promise.resolve(null);
  //   }

  //   const storedUser = sessionStorage.getItem(storedUserKey);
  //   if (!storedUser) {
  //     return Promise.resolve(null);
  //   }

  //   const user = JSON.parse(storedUser);
  //   const expirationTime = user.stsTokenManager.expirationTime;
  //   if (expirationTime > Date.now()) {
  //     this.user.next(user);
  //     return Promise.resolve(user);
  //   }

  //   sessionStorage.removeItem(storedUserKey);
  //   return Promise.resolve(null);
  // }

  register(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(credentials => {
        console.log('User registered', credentials);
        sendEmailVerification(credentials.user).then(e => {
          console.log('Email verification sent', e);
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
      })
      .catch(error => {
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'ERROR',
              message: error?.message?.match(/"message":"(.*?)"/)[1] ?? 'Error de registre',
              action: 'tancar',
            }),
          })
        );
      });
  }

  // registerUserWithLink(email: string): Promise<void> {
  //   const actionCodeSettings = {
  //     // Your redirect URL
  //     url: 'http://localhost:4200/login',
  //     handleCodeInApp: true,
  //   };
  //   return sendSignInLinkToEmail(this.auth, email, actionCodeSettings).then(() => {
  //     this.router.navigate(['login']);
  //   });
  // }

  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['login']);
    });
  }
}
