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
});
