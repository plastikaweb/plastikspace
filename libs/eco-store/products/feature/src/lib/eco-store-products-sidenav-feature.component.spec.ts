import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import EcoStoreProductsSidenavFeatureComponent from './eco-store-products-sidenav-feature.component';

describe('EcoStoreProductsSidenavFeature', () => {
  let component: EcoStoreProductsSidenavFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProductsSidenavFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductsSidenavFeatureComponent],
      providers: [
        provideTranslateService(),
        provideEnvironmentPocketBaseTranslationMock(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductsSidenavFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
