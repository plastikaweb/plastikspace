import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideMockStore } from '@ngrx/store/testing';
import { initializeApp } from 'firebase/app';
import { LlecoopOrderListFeatureDetailComponent } from './llecoop-order-list-feature-detail.component';

describe('LlecoopOrderListFeatureDetailComponent', () => {
  let component: LlecoopOrderListFeatureDetailComponent;
  let fixture: ComponentFixture<LlecoopOrderListFeatureDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderListFeatureDetailComponent],
      providers: [
        provideMockStore(),
        provideFirebaseApp(() =>
          initializeApp({
            apiKey: '',
            authDomain: 'llecoop.firebaseapp.com',
            projectId: 'llecoop',
          })
        ),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopOrderListFeatureDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
