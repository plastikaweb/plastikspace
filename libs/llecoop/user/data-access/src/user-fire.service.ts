import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, Timestamp } from '@angular/fire/firestore';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserFireService {
  private readonly firestore = inject(Firestore);
  private readonly userCollection = collection(this.firestore, 'user');

  addWhiteListedUser(email: string) {
    return from(
      addDoc(this.userCollection, {
        email,
        whiteListed: true,
        createdAt: Timestamp.now(),
      })
    );
  }
}
