import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoStoreProductCardQuantityControlComponent } from './eco-store-product-card-quantity-control.component';
import { axe, toHaveNoViolations } from 'jest-axe';

import { provideTranslateService } from '@ngx-translate/core';

describe('EcoStoreProductCardQuantityControlComponent', () => {
  let component: EcoStoreProductCardQuantityControlComponent;
  let fixture: ComponentFixture<EcoStoreProductCardQuantityControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductCardQuantityControlComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductCardQuantityControlComponent);
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
