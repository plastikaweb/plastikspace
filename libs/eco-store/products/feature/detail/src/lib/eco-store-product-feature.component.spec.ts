import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { axe, toHaveNoViolations } from 'jest-axe';
import EcoStoreProductFeatureComponent from './eco-store-product-feature.component';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';

describe('EcoStoreProductFeatureComponent', () => {
  let component: EcoStoreProductFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProductFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductFeatureComponent],
      providers: [
        provideTranslateService(),
        provideEnvironmentPocketBaseTranslationMock(),
        provideRouter([]),
        {
          provide: POCKETBASE_INSTANCE,
          useValue: mockPocketBase,
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductFeatureComponent);
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
  }, 10000);
});
