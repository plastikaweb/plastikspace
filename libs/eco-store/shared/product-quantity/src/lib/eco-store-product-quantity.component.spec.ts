import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { axe } from 'vitest-axe';
import { EcoStoreProductQuantityComponent } from './eco-store-product-quantity.component';

describe('EcoStoreProductQuantityComponent', () => {
  let component: EcoStoreProductQuantityComponent;
  let fixture: ComponentFixture<EcoStoreProductQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductQuantityComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductQuantityComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have tooltips on action buttons', async () => {
    fixture.componentRef.setInput('product', {
      id: '1',
      name: 'Product',
      unitType: 'unit',
      minQuantity: 1,
    });
    fixture.componentRef.setInput('quantity', 1);
    fixture.componentRef.setInput('mode', 'card');
    fixture.detectChanges();

    const tooltips = fixture.debugElement.queryAll(By.directive(MatTooltip));
    expect(tooltips.length).toBe(2);
  });
});
