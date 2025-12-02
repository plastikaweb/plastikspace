import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoStoreProductCardQuantityControlComponent } from './eco-store-product-card-quantity-control.component';

describe('EcoStoreProductCardQuantityControlComponent', () => {
  let component: EcoStoreProductCardQuantityControlComponent;
  let fixture: ComponentFixture<EcoStoreProductCardQuantityControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductCardQuantityControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductCardQuantityControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
