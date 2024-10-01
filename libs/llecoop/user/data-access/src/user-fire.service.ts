import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, Timestamp } from '@angular/fire/firestore';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserFireService {
  private readonly firestore = inject(Firestore);
  private readonly userWhiteListCollection = collection(this.firestore, 'userWhiteList');

  addToWhiteList(email: string) {
    return from(
      addDoc(this.userWhiteListCollection, {
        email,
        registered: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    );
  }
}
