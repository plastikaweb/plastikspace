import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

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

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigate(['']);
      })

      .catch(() =>
        this.state.dispatch(
          notificationActions.show({
            configuration: this.notificationService.getInstance({
              type: 'ERROR',
              message: 'Revisa les credencials introduides<br> i torna a intentar-ho',
              duration: 5000,
              action: 'tancar',
            }),
          })
        )
      );
  }

  currentUser() {
    return this.auth.currentUser;
  }

  // registerUser(email: string) {
  //   const actionCodeSettings = {
  //     // URL a la que se redirigirá al usuario después de que haga clic en el enlace de verificación
  //     url: 'https://llevat-b0d66.firebaseapp.com/finishSignUp?cartId=1234',
  //     handleCodeInApp: false,
  //   };
  // }

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

  registerUser(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(response => {
        console.log(response);
        this.router.navigate(['']);
      })
      .catch((error: any) => {
        window.alert(error.message);
      });
  }

  registerUserWithLink(email: string): Promise<void> {
    const actionCodeSettings = {
      // Your redirect URL
      url: `https://llevat-b0d66.firebaseapp.com/login&email=${email}`,
      handleCodeInApp: true,
    };
    return sendSignInLinkToEmail(this.auth, email, actionCodeSettings).then(response => {
      console.log(response);
    });
  }

  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['login']);
    });
  }
}
