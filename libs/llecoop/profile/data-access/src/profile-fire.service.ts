import { catchError, from, map, Observable, of, Subject, takeUntil, throwError } from 'rxjs';

import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  collection,
  doc,
  docData,
  DocumentData,
  Firestore,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { EntityId } from '@ngrx/signals/entities';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProfileFireService {
  protected readonly path = 'user';

  readonly #firebaseAuthService = inject(FirebaseAuthService);
  protected readonly firestore = inject(Firestore);
  protected readonly destroy$ = new Subject<void>();

  protected readonly injectionContext = inject(EnvironmentInjector);
  protected collection: ReturnType<typeof collection> | null = null;
  readonly activeConnection = signal(true);

  protected get firestoreCollection() {
    if (!this.collection && this.activeConnection()) {
      this.collection = collection(this.firestore, this.path);
    }
    return this.collection;
  }

  protected firebaseAssignTypes() {
    return {
      toFirestore: (doc: LlecoopUser): DocumentData => {
        return {
          ...doc,
          name: doc.name || doc.email,
          normalizedName: latinize(doc.name || doc.email).toLowerCase(),
          createdAt: doc.createdAt ?? Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
      },
    };
  }

  update(item: Partial<LlecoopUser>): Observable<void> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const firestoreCollection = this.firestoreCollection;
        if (!firestoreCollection) {
          return throwError(() => new Error('No collection available'));
        }

        const docRef = doc(firestoreCollection, item.id?.toString() ?? '');
        const converter = this.firebaseAssignTypes();
        const convertedData = converter.toFirestore(item as LlecoopUser);

        return from(updateDoc(docRef, convertedData)).pipe(
          takeUntil(this.destroy$),
          catchError(error => throwError(() => error))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  getItem(id: EntityId): Observable<LlecoopUser | null> {
    try {
      return runInInjectionContext(this.injectionContext, () => {
        const firestoreCollection = this.firestoreCollection;
        if (!firestoreCollection) {
          return of(null);
        }

        const docRef = doc(firestoreCollection, id.toString());
        return docData(docRef, { idField: 'id' }).pipe(
          takeUntil(this.destroy$),
          map(item => item as LlecoopUser),
          catchError(error => this.handlePermissionError(error, null))
        );
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getLoggedUser(): Observable<LlecoopUser> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const userId = this.#firebaseAuthService.currentUser()?.uid;
        if (!userId) {
          throw new Error('User not authenticated');
        }
        return this.getItem(userId).pipe(
          map(user => {
            if (!user) {
              throw new Error('User not found');
            }
            return user;
          })
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  protected handlePermissionError<R>(error: FirebaseError, defaultValue: R) {
    if (
      error?.code === 'permission-denied' ||
      (error?.message && error.message.includes('Missing or insufficient permissions'))
    ) {
      return of(defaultValue);
    }
    return throwError(() => error);
  }

  setActiveConnection(active: boolean): void {
    if (this.activeConnection() === active) {
      return;
    }
    this.activeConnection.set(active);
    if (!active) {
      this.destroy$.next();
      this.destroy$.complete();
      this.collection = null;
    }
  }
}
