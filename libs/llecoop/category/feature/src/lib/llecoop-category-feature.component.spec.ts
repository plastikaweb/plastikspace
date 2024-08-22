import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { LlecoopCategoryFeatureComponent } from './llecoop-category-feature.component';

describe('LlecoopCategoryFeatureComponent', () => {
  let component: LlecoopCategoryFeatureComponent;
  let fixture: ComponentFixture<LlecoopCategoryFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      imports: [LlecoopCategoryFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopCategoryFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
