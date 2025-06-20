import { Timestamp } from 'firebase/firestore';

import { IMAGE_LOADER, TitleCasePipe } from '@angular/common';
import { ComponentRef, LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { By } from '@angular/platform-browser';
import { LlecoopProductCategory, LlecoopProductWithQuantity } from '@plastik/llecoop/entities';

import { UiUserOrderProductCardComponent } from './ui-user-order-product-card.component';

const mockProduct: LlecoopProductWithQuantity = {
  categoryRef: 'category/l2lXy4Jjg1KzFEP3KD3o' as unknown as DocumentReference<
    LlecoopProductCategory,
    DocumentData
  >,
  unit: {
    type: 'unitWithFixedWeight',
    base: 0.08,
  },
  id: 'Ye8bjcG6R0kVW',
  stock: 4,
  createdAt: new Date() as unknown as Timestamp,
  imgUrl:
    'https://firebasestorage.googleapis.com/v0/b/llevat-b0d66.appspot.com/o/products%2Fcanonigos.jpg?alt=media&token=3ced3832-6cbc-4885-b141-4956f28f138e',
  isAvailable: true,
  normalizedName: 'canonge',
  categoryName: 'fruita i verdura',
  iva: 5,
  name: 'canonge',
  provider: 'Cal Valls',
  searchableFields: ['cal valls', 'fruita i verdura'],
  category: {
    description: 'producte fresc',
    updatedAt: new Date() as unknown as Timestamp,
    productCount: 19,
    color: '#25c907',
    id: 'l2lXy4Jjg1KzFEP3KD3o',
    createdAt: new Date() as unknown as Timestamp,
    normalizedName: 'fruita i verdura',
    name: 'fruita i verdura',
  },
  price: 2.8,
  priceWithIva: 2.94,
  updatedAt: new Date() as unknown as Timestamp,
  quantity: 0,
};

describe('UiUserOrderProductCardComponent', () => {
  let component: UiUserOrderProductCardComponent;
  let fixture: ComponentFixture<UiUserOrderProductCardComponent>;
  let componentRef: ComponentRef<UiUserOrderProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          LOCALE_ID,
          useValue: 'es-ES',
        },
        {
          provide: IMAGE_LOADER,
          useFactory: () => (src: string) => `https://test.io/${src}`,
        },
        TitleCasePipe,
      ],
      imports: [UiUserOrderProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiUserOrderProductCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('product', mockProduct);
    componentRef.setInput('index', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name and category', () => {
    const cardTitle = fixture.debugElement.query(By.css('mat-card-title'));
    const cardSubtitle = fixture.debugElement.query(By.css('mat-card-subtitle'));

    expect(cardTitle.nativeElement.textContent).toContain('Canonge');
    expect(cardSubtitle.nativeElement.textContent).toContain('Fruita I Verdura');
  });

  it('should display product price with correct format', () => {
    const priceElement = fixture.debugElement.query(By.css('mat-card-content div'));
    expect(priceElement.nativeElement.textContent).toContain(mockProduct.priceWithIva.toFixed(2));
  });

  it('should emit viewDetails event when card is clicked', () => {
    const viewDetailsSpy = jest.spyOn(component.viewDetails, 'emit');

    const card = fixture.debugElement.query(By.css('mat-card'));
    card.triggerEventHandler('click', null);

    expect(viewDetailsSpy).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should display add button when quantity is 0', () => {
    componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('button'));
    expect(addButton).toBeTruthy();
    expect(addButton.nativeElement.textContent).toContain('Afegir');
  });

  it('should set quantity to 1 when add button is clicked', () => {
    componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    const addToCartSpy = jest.spyOn(component.addToCart, 'emit');

    const addButton = fixture.debugElement.query(By.css('button'));
    addButton.triggerEventHandler('click', {
      stopPropagation: () => {
        return;
      },
    });

    expect(addToCartSpy).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: 1,
    });
  });

  it('should display quantity input when quantity is greater than 0', () => {
    componentRef.setInput('product', { ...mockProduct, quantity: 2 });
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it('should calculate total price correctly', () => {
    componentRef.setInput('product', { ...mockProduct, quantity: 2 });
    fixture.detectChanges();

    expect(component.totalPrice()).toBe(mockProduct.priceWithIva * 2);

    const chipElement = fixture.debugElement.query(By.css('mat-chip'));
    expect(chipElement.nativeElement.textContent).toContain('5.88');
  });

  it('should emit addToCart event when remove button is clicked', () => {
    componentRef.setInput('product', { ...mockProduct, quantity: 2 });
    fixture.detectChanges();

    const addToCartSpy = jest.spyOn(component.addToCart, 'emit');

    const removeButton = fixture.debugElement.query(By.css('button[matChipRemove]'));
    removeButton.triggerEventHandler('click', {
      preventDefault: () => {
        return;
      },
      stopPropagation: () => {
        return;
      },
    });

    expect(addToCartSpy).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: 0,
    });
  });
});
