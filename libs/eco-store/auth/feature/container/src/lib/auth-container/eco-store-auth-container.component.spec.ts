import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { NavigationService } from '@plastik/core/router-state';
import { PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { EcoStoreAuthContainerComponent } from './eco-store-auth-container.component';

describe('EcoStoreAuthContainerComponent', () => {
  let component: EcoStoreAuthContainerComponent;
  let fixture: ComponentFixture<EcoStoreAuthContainerComponent>;
  const isStandalone = signal(false);

  beforeEach(async () => {
    isStandalone.set(false);
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
          useValue: { isStandalone },
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

  it('should mirror the standalone back button aria-label with a matching matTooltip', () => {
    // The back button only renders in PWA standalone mode.
    isStandalone.set(true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[matIconButton]'));
    const ariaLabel = button.nativeElement.getAttribute('aria-label');
    const tooltipMessage = button.injector.get(MatTooltip).message;

    expect(tooltipMessage).toBe(ariaLabel);
  });
});
