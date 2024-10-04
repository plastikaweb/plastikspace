import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, Timestamp } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { EntityId } from '@ngrx/signals/entities';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserFireService {
  private readonly firestore = inject(Firestore);
  private readonly userCollection = collection(this.firestore, 'user');
  private readonly functions = inject(Functions);

  getAll(): Observable<LlecoopUser[]> {
    return collectionData(this.userCollection, { idField: 'id' }) as Observable<LlecoopUser[]>;
  }

  create(email: string) {
    return from(
      addDoc(this.userCollection, {
        email,
        whiteListed: true,
        createdAt: Timestamp.now(),
      })
    );
  }

  addAdminClaim(userId: EntityId) {
    const callable = httpsCallable(this.functions, 'setUserAdminClaim');
    return from(callable(userId));
  }
}
