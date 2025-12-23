import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoStoreProductCategoryLabelComponent } from './eco-store-product-category-label.component';

describe('EcoStoreProductCategoryLabelComponent', () => {
  let component: EcoStoreProductCategoryLabelComponent;
  let fixture: ComponentFixture<EcoStoreProductCategoryLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductCategoryLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductCategoryLabelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'Test Category');
    fixture.componentRef.setInput('color', '#FF0000');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the category name', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Test Category');
  });

  it('should apply the correct size classes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(component.containerClass()).toContain('gap-3');
    expect(component.dotClass()).toContain('h-3 w-3');

    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(component.containerClass()).toContain('gap-2');
    expect(component.dotClass()).toContain('h-2 w-2');
  });
});
