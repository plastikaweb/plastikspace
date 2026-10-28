import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EcoStoreProductPriceComponent } from './eco-store-product-price.component';

describe('EcoStoreProductPriceComponent', () => {
  let component: EcoStoreProductPriceComponent;
  let fixture: ComponentFixture<EcoStoreProductPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductPriceComponent, TranslateModule.forRoot()],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);

    translate.use('en');

    fixture = TestBed.createComponent(EcoStoreProductPriceComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('price', 10.5);
    fixture.componentRef.setInput('unitType', 'unit');
    fixture.componentRef.setInput('unitBase', 'unit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the correct classes based on size', () => {
    fixture.componentRef.setInput('size', 'detail');
    fixture.detectChanges();
    expect(component.containerClass()).toBe('flex w-full');

    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();
    expect(component.containerClass()).toBe('flex space-y-1');
  });

  it('should correctly format price parts', () => {
    const parts = component.priceParts();

    expect(parts.symbol).toBe('€');
    expect(parts.integer).toBe('10');
    expect(parts.decimal).toBe('50');
  });

  it('should handle invalid or nullish price inputs gracefully', () => {
    fixture.componentRef.setInput('price', NaN);
    fixture.detectChanges();

    const parts = component.priceParts();

    expect(parts.symbol).toBe('€');
    expect(parts.integer).toBe('0');
    expect(parts.decimal).toBe('00');
  });
});
