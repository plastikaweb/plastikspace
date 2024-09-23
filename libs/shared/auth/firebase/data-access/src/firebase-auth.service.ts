import { inject, Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ENVIRONMENT } from '@plastik/core/environments';

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
  private readonly environment = inject(ENVIRONMENT);
  private readonly state = inject(Store);
  private readonly notificationService = inject(NotificationConfigService);

  private readonly user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

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

  async getUser(): Promise<User | null> {
    if (this.environment['useEmulators']) {
      const storedUserKey = Object.keys(sessionStorage).find(key =>
        key.startsWith('firebase:authUser:')
      );
      if (!storedUserKey) {
        return Promise.resolve(null);
      }

      const storedUser = sessionStorage.getItem(storedUserKey);
      if (!storedUser) {
        return Promise.resolve(null);
      }

      const user = JSON.parse(storedUser);
      const expirationTime = user.stsTokenManager.expirationTime;
      if (expirationTime > Date.now()) {
        this.user.next(user);
        return Promise.resolve(user);
      }

      sessionStorage.removeItem(storedUserKey);
      return Promise.resolve(null);
    }

    return new Promise(resolve =>
      onAuthStateChanged(this.auth, user => {
        this.user.next(user);
        resolve(user || null);
      })
    );
  }

  // async register(email: string, password: string, username: string): Promise<void> {
  //   return await createUserWithEmailAndPassword(this.auth, email, password)
  //     .then(response => {
  //       updateProfile(response.user, {
  //         displayName: username,
  //       });
  //       this.router.navigate(['']);
  //     })
  //     .catch(error => {
  //       window.alert(error.message);
  //     });
  // }

  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['login']);
    });
  }
}
