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

  it('should format priceParts accurately using the computed signal', () => {
    const parts = component['priceParts']();

    expect(parts.symbol).toBe('€');
    expect(parts.integer).toBe('10');
    expect(parts.decimal).toBe('50');
  });

  it('should update priceParts when price input signal changes', () => {
    fixture.componentRef.setInput('price', 1234.99);
    fixture.detectChanges();

    const parts = component['priceParts']();

    expect(parts.symbol).toBe('€');
    expect(parts.decimal).toBe('99');
    expect(parts.integer.replace(/\s/g, '')).toMatch(/1234|1\.234/);
  });

  it('should apply the correct classes based on size', () => {
    fixture.componentRef.setInput('size', 'detail');
    fixture.detectChanges();
    expect(component['containerClass']()).toBe('flex w-full');
    expect(component['contentClass']()).toBe('items-start flex-row gap-8 text-xl');
    expect(component['unityTypeClass']()).toBe('text-lg font-medium text-sys-primary');
    expect(component['priceContainerClass']()).toBe('flex items-baseline gap-4 mb-4');
    expect(component['priceClass']()).toBe('text-display-medium font-bold text-sys-primary');
    expect(component['chipClass']()).toBe('scale-125 origin-left mt-2');

    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(component['priceClass']()).toBe('text-title-medium font-bold text-sys-primary');

    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(component['priceClass']()).toBe('text-headline-large font-bold text-sys-primary');

    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();
    expect(component['containerClass']()).toBe('flex space-y-1');
    expect(component['contentClass']()).toBe('items-baseline flex-col');
    expect(component['unityTypeClass']()).toBe('text-sm font-normal text-sys-primary');
    expect(component['priceClass']()).toBe('text-headline-small font-bold text-sys-primary');
    expect(component['chipClass']()).toBe('');
  });
});
