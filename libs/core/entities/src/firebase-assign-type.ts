import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

/**
 * @description Assign types to Firestore documents.
 * @template T
 * **T** refers to the main feature model item used inside applications.
 * @returns {object} An object with methods to convert between Firestore documents and types:
 * - `toFirestore`: Converts a typed document to Firestore DocumentData
 * - `fromFirestore`: Converts a Firestore snapshot to typed document
 */
export function firebaseAssignTypes<T extends object>() {
  return {
    toFirestore(doc: T): DocumentData {
      return doc;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return snapshot.data() as T;
    },
  };
}
