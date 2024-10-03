import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, Timestamp } from '@angular/fire/firestore';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserFireService {
  private readonly firestore = inject(Firestore);
  private readonly userCollection = collection(this.firestore, 'user');

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
}
