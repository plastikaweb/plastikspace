import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseMock } from '@plastik/core/environments';
import EcoStoreProductsSidenavFeatureComponent from './eco-store-products-sidenav-feature.component';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { axe, toHaveNoViolations } from 'jest-axe';

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
          useValue: {
            collection: () => ({
              getList: () => Promise.resolve({ items: [], totalItems: 0 }),
              getFullList: () => Promise.resolve([]),
            }),
          },
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
  });
});
