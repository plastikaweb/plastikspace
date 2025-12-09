import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import EcoStoreProductsFeature from './eco-store-products-feature.component';

describe('EcoStoreProductsFeature', () => {
  let component: EcoStoreProductsFeature;
  let fixture: ComponentFixture<EcoStoreProductsFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductsFeature],
      providers: [provideTranslateService(), provideEnvironmentPocketBaseTranslationMock()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductsFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
