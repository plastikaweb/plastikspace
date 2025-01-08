import { AngularSvgIconModule } from 'angular-svg-icon';

import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';

import { CmsLayoutComponent } from './cms-layout.component';

describe('CmsLayoutComponent', () => {
  let component: CmsLayoutComponent;
  let fixture: ComponentFixture<CmsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, CmsLayoutComponent, AngularSvgIconModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideMockStore({}),
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
        { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CmsLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
