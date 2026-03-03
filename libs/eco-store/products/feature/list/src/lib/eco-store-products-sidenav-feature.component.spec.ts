import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { provideEnvironmentPocketBaseMock } from '@plastik/core/environments/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { axe, toHaveNoViolations } from 'jest-axe';
import EcoStoreProductsSidenavFeatureComponent from './eco-store-products-sidenav-feature.component';

describe('EcoStoreProductsSidenavFeature', () => {
  let component: EcoStoreProductsSidenavFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProductsSidenavFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductsSidenavFeatureComponent],
      providers: [
        provideTranslateService(),
        provideEnvironmentPocketBaseMock(),
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

    fixture = TestBed.createComponent(EcoStoreProductsSidenavFeatureComponent);
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
