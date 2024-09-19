import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  private readonly user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        authState(this.auth)
          .pipe(take(1))
          .subscribe(user => {
            if (user) {
              this.router.navigate(['']);
            }
          });
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  async getUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
        this.auth,
        user => {
          if (user) {
            this.user.next(user);
            resolve(user);
          } else {
            resolve(null);
          }
        },
        reject
      );
    });
  }

  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['login']);
    });
  }
}
