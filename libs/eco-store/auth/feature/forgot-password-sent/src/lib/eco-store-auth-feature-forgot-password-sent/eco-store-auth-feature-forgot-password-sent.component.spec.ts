import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { NavigationService } from '@plastik/core/router-state';
import { PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { EcoStoreAuthFeatureForgotPasswordSentComponent } from './eco-store-auth-feature-forgot-password-sent.component';

describe('EcoStoreAuthFeatureForgotPasswordSentComponent', () => {
  let component: EcoStoreAuthFeatureForgotPasswordSentComponent;
  let fixture: ComponentFixture<EcoStoreAuthFeatureForgotPasswordSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreAuthFeatureForgotPasswordSentComponent],
      providers: [
        provideTranslateService(),
        provideRouter([]),
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

    fixture = TestBed.createComponent(EcoStoreAuthFeatureForgotPasswordSentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
