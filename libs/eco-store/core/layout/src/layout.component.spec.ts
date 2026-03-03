import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { CountdownService } from '@plastik/shared/countdown/util';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EcoFooterComponent } from './footer/footer.component';
import { EcoHeaderComponent } from './header/header.component';
import EcoLayoutComponent from './layout.component';
import { EcoMenuComponent } from './menu/menu.component';

describe('LayoutComponent', () => {
  let component: EcoLayoutComponent;
  let fixture: ComponentFixture<EcoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EcoLayoutComponent,
        EcoHeaderComponent,
        EcoFooterComponent,
        EcoMenuComponent,
        EcoStoreFormlyModule,
      ],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        ...provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: POCKETBASE_INSTANCE,
          useValue: mockPocketBase,
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: pocketBaseUserProfileStore,
          useValue: mockPocketBaseUserProfileStore,
        },
        {
          provide: CountdownService,
          useValue: {
            createCountdown: jest.fn().mockReturnValue({
              data: jest.fn(),
              text: jest.fn().mockReturnValue(''),
              isExpired: jest.fn(),
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
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 30000);
});
