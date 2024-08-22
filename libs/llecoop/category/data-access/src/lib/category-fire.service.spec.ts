import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { CategoryFireService } from './category-fire.service';

describe('CategoryFireService', () => {
  let service: CategoryFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() =>
          initializeApp({
            apiKey: '',
            authDomain: 'llecoop.firebaseapp.com',
            projectId: 'llecoop',
          }),
        ),
        provideFirestore(() => getFirestore()),
      ],
    });
    service = TestBed.inject(CategoryFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
