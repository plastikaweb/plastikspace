import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentMock } from '@plastik/core/environments';
import EcoStoreProductsSidenavFeature from './eco-store-products-sidenav-feature';

describe('EcoStoreProductsSidenavFeature', () => {
  let component: EcoStoreProductsSidenavFeature;
  let fixture: ComponentFixture<EcoStoreProductsSidenavFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductsSidenavFeature],
      providers: [provideTranslateService(), provideEnvironmentMock(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductsSidenavFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
