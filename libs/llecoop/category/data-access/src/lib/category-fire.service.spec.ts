import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { LlecoopCategoryFireService } from './category-fire.service';

describe('LlecoopCategoryFireService', () => {
  let service: LlecoopCategoryFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() =>
          initializeApp({
            apiKey: '',
            authDomain: 'llecoop.firebaseapp.com',
            projectId: 'llecoop',
          })
        ),
        provideFirestore(() => getFirestore()),
      ],
    });
    service = TestBed.inject(LlecoopCategoryFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
