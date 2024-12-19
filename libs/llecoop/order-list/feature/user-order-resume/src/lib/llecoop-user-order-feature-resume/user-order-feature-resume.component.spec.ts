import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { SafeFormattedPipe } from '@plastik/shared/formatters';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';
import { LlecoopUserOrderResumeFacadeService } from '../user-order-resume-facade.service';
import { LlecoopUserOrderFeatureResumeComponent } from './user-order-feature-resume.component';

describe('LlecoopUserOrderFeatureResumeComponent', () => {
  let component: LlecoopUserOrderFeatureResumeComponent;
  let fixture: ComponentFixture<LlecoopUserOrderFeatureResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopUserOrderFeatureResumeComponent, SharedTableUiComponent, SafeFormattedPipe],
      providers: [
        provideRouter([]),
        provideMockStore({}),
        LlecoopUserOrderResumeFacadeService,
        provideFirebaseApp(() =>
          initializeApp({
            apiKey: 'AIzaSyAPtqItl2UtYscGTCBnnNUK9gdWOikXU1c',
            authDomain: 'llecoop.firebaseapp.com',
            projectId: 'llecoop',
          })
        ),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        { provide: VIEW_CONFIG, useValue: signal([]) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopUserOrderFeatureResumeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
