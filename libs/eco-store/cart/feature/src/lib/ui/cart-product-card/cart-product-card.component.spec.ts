import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { EcoStoreCartItem } from '@plastik/eco-store/entities';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CartProductCardComponent } from './cart-product-card.component';

describe('CartProductCardComponent', () => {
  let component: CartProductCardComponent;
  let fixture: ComponentFixture<CartProductCardComponent>;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 10,
    priceWithIva: 12.1,
    iva: 21,
    unitType: 'unit',
    unitBase: 1,
    categorySlug: 'test-category',
    normalizedName: 'test-product',
    images: ['image1.jpg'],
  } as any;

  const mockItem: EcoStoreCartItem = {
    product: mockProduct,
    quantity: 2,
    hasPriceChanged: false,
  };

  beforeEach(async () => {
    expect.extend(toHaveNoViolations);
    await TestBed.configureTestingModule({
      imports: [CartProductCardComponent],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(CartProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should render product name and price', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a')?.textContent).toContain('Test Product');
    expect(compiled.textContent).toContain('24.20'); // 12.1 * 2
  });

  it('should display quantity and unit type when not editable', () => {
    fixture.componentRef.setInput('editable', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('2');
    expect(compiled.querySelector('eco-store-product-quantity')).toBeFalsy();
  });

  it('should display quantity controls and delete button when editable', () => {
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('eco-store-product-quantity')).toBeTruthy();
    expect(compiled.querySelector('.cart-delete-button')).toBeTruthy();
  });

  it('should emit quantityChange when quantity is updated', () => {
    const spy = jest.spyOn(component.quantityChange, 'emit');
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();

    const quantityComponent = fixture.debugElement.query(
      el => el.name === 'eco-store-product-quantity'
    ).componentInstance;
    quantityComponent.quantityChange.emit(3);

    expect(spy).toHaveBeenCalledWith({ quantity: 3, product: mockProduct });
  });

  it('should emit quantityChange with 0 when delete button is clicked', () => {
    const spy = jest.spyOn(component.quantityChange, 'emit');
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('.cart-delete-button');
    deleteButton.click();

    expect(spy).toHaveBeenCalledWith({ quantity: 0, product: mockProduct });
  });
});
