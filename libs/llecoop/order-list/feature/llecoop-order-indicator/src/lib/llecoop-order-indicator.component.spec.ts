import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideMockStore } from '@ngrx/store/testing';
import { initializeApp } from 'firebase/app';
import { LlecoopOrderIndicatorComponent } from './llecoop-order-indicator.component';

describe('LlecoopOrderIndicatorComponent', () => {
  let component: LlecoopOrderIndicatorComponent;
  let fixture: ComponentFixture<LlecoopOrderIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderIndicatorComponent],
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

    fixture = TestBed.createComponent(LlecoopOrderIndicatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
