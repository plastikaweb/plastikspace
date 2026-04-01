import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { NavigationService } from '@plastik/core/router-state';
import { PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { EcoStoreAuthContainerComponent } from './eco-store-auth-container.component';

describe('EcoStoreAuthContainerComponent', () => {
  let component: EcoStoreAuthContainerComponent;
  let fixture: ComponentFixture<EcoStoreAuthContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreAuthContainerComponent],
      providers: [
        provideTranslateService(),
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

    fixture = TestBed.createComponent(EcoStoreAuthContainerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
