import { IMAGE_LOADER } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { NavigationService } from '@plastik/core/router-state';
import { PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { EcoStoreAuthLoginComponent } from './eco-store-auth-login.component';

describe('EcoStoreAuthLoginComponent', () => {
  let component: EcoStoreAuthLoginComponent;
  let fixture: ComponentFixture<EcoStoreAuthLoginComponent>;
  let navigationService: NavigationService;

  const authFacadeMock = {
    formConfig: {
      getConfig: () => [],
      getSubmitFormConfig: () => ({}),
    },
    extraLinks: signal([]),
    onSubmit: vi.fn(),
  };

  const navigationServiceMock = {
    back: vi.fn(),
  };

  const pwaNavigationServiceMock = {
    isStandalone: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreAuthLoginComponent, TranslateModule.forRoot(), FormlyModule.forRoot()],
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        provideRouter([]),
        { provide: AUTH_FORM_FACADE, useValue: authFacadeMock },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: NavigationService, useValue: navigationServiceMock },
        { provide: PwaNavigationService, useValue: pwaNavigationServiceMock },
        { provide: IMAGE_LOADER, useValue: (src: string) => src },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreAuthLoginComponent);
    component = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
