import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe } from 'jest-axe';
import { EcoStoreProductQuantityControlComponent } from './eco-store-product-quantity-control.component';

import { provideTranslateService } from '@ngx-translate/core';

describe('EcoStoreProductQuantityControlComponent', () => {
  let component: EcoStoreProductQuantityControlComponent;
  let fixture: ComponentFixture<EcoStoreProductQuantityControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductQuantityControlComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductQuantityControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
