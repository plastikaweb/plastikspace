import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { LlecoopProductFireService } from './product-fire.service';

describe('LlecoopProductFireService', () => {
  let service: LlecoopProductFireService;

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
    service = TestBed.inject(LlecoopProductFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
