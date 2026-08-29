import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { mockEcoStoreCartStore } from '@plastik/eco-store/cart/data-access/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { activityStore } from '@plastik/shared/activity/data-access';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { CountdownService } from '@plastik/shared/countdown/util';
import { LanguageSwitcherService } from '@plastik/shared/translation';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoFooterComponent } from './footer/footer.component';
import { EcoHeaderComponent } from './header/header.component';
import EcoLayoutComponent from './layout.component';
import { EcoMenuComponent } from './menu/menu.component';

describe('LayoutComponent', () => {
  let component: EcoLayoutComponent;
  let fixture: ComponentFixture<EcoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoLayoutComponent, EcoHeaderComponent, EcoFooterComponent, EcoMenuComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        providePlainInputFormly(),
        ...provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: LanguageSwitcherService,
          useValue: {
            init: vi.fn().mockReturnValue('en'),
            save: vi.fn(),
            currentLanguage: signal(null),
          },
        },
        {
          provide: POCKETBASE_INSTANCE,
          useValue: mockPocketBase,
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: ecoStoreCartStore,
          useValue: mockEcoStoreCartStore,
        },
        {
          provide: pocketBaseUserProfileStore,
          useValue: mockPocketBaseUserProfileStore,
        },
        activityStore,
        {
          provide: CountdownService,
          useValue: {
            createCountdown: vi.fn().mockReturnValue({
              data: vi.fn(),
              text: vi.fn().mockReturnValue(''),
              isExpired: vi.fn(),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  }, 30000);
});
