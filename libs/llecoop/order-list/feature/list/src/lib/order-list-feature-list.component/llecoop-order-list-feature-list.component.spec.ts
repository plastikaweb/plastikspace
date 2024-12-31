import { initializeApp } from 'firebase/app';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideMockStore } from '@ngrx/store/testing';

import { LlecoopOrderListFeatureListComponent } from './llecoop-order-list-feature-list.component';

describe('LlecoopOrderListFeatureListComponent', () => {
  let component: LlecoopOrderListFeatureListComponent;
  let fixture: ComponentFixture<LlecoopOrderListFeatureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderListFeatureListComponent],
      providers: [
        provideMockStore(),
        provideFirebaseApp(() =>
          initializeApp({
            apiKey: 'AIzaSyAPtqItl2UtYscGTCBnnNUK9gdWOikXU1c',
            authDomain: 'llecoop.firebaseapp.com',
            projectId: 'llecoop',
          })
        ),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopOrderListFeatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
