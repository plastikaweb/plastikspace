import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProductPriceComponent } from './eco-store-product-price.component';

describe('EcoStoreProductPriceComponent', () => {
  let component: EcoStoreProductPriceComponent;
  let fixture: ComponentFixture<EcoStoreProductPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductPriceComponent, TranslateModule.forRoot()],
    }).compileComponents();

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
    expect(component['containerClass']()).toBe('flex w-full');

    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();
    expect(component['containerClass']()).toBe('flex space-y-1');
  });

  it('should correctly format and extract priceParts via computed signal', () => {
    fixture.componentRef.setInput('price', 15.99);
    fixture.detectChanges();

    const parts = component['priceParts']();

    expect(parts.symbol).toBe('€');
    expect(parts.integer).toBe('15');
    expect(parts.decimal).toBe('99');
  });

  it('should provide fallback decimal when price has no decimals', () => {
    fixture.componentRef.setInput('price', 10);
    fixture.detectChanges();

    const parts = component['priceParts']();

    expect(parts.symbol).toBe('€');
    expect(parts.integer).toBe('10');
    expect(parts.decimal).toBe('00');
  });
});
