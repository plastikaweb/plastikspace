import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { NavigationService } from '@plastik/core/router-state';
import { PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { EcoStoreAuthForgotPasswordComponent } from './eco-store-auth-forgot-password.component';

describe('EcoStoreAuthForgotPasswordComponent', () => {
  let component: EcoStoreAuthForgotPasswordComponent;
  let fixture: ComponentFixture<EcoStoreAuthForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreAuthForgotPasswordComponent, FormlyModule.forRoot()],
      providers: [
        provideTranslateService(),
        provideRouter([]),
        {
          provide: AUTH_FORM_FACADE,
          useValue: {
            formConfig: {
              getConfig: vi.fn(() => []),
              getSubmitFormConfig: vi.fn(() => ({})),
            },
            onSubmit: vi.fn(),
            isLoading: vi.fn(() => false),
          },
        },
        {
          provide: ecoStoreTenantStore,
          useValue: {
            tenant: vi.fn(() => ({})),
          },
        },
        {
          provide: NavigationService,
          useValue: { back: vi.fn() },
        },
        {
          provide: PwaNavigationService,
          useValue: { isStandalone: vi.fn(() => false) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreAuthForgotPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
