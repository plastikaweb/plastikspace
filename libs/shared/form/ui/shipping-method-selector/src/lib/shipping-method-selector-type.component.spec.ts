import { CurrencyPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { axe } from 'vitest-axe';
import { ShippingMethodSelectorProps } from './shipping-method-selector-props';
import { ShippingMethodSelectorTypeComponent } from './shipping-method-selector-type.component';

describe('ShippingMethodSelectorTypeComponent', () => {
  let component: ShippingMethodSelectorTypeComponent;
  let fixture: ComponentFixture<ShippingMethodSelectorTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingMethodSelectorTypeComponent, CurrencyPipe],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingMethodSelectorTypeComponent);
    component = fixture.componentInstance;

    // Mock formly field and props
    component.field = {
      formControl: new FormControl(),
      parent: new FormGroup({}),
      props: {
        shippingMethodOptions: [
          {
            type: 'delivery',
            icon: 'local_shipping',
            title: 'Delivery',
            cost: 5,
          },
          {
            type: 'pickup',
            icon: 'store',
            title: 'Pickup',
            cost: 0,
          },
        ],
      },
    } as FieldTypeConfig<ShippingMethodSelectorProps>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all shipping method options', () => {
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBe(2);

    const titles = fixture.nativeElement.querySelectorAll('mat-card-title');
    expect(titles[0].textContent).toContain('cart.shipping.method.delivery.title');
    expect(titles[1].textContent).toContain('cart.shipping.method.pickup.title');
  });

  it('should update form control when a card is clicked', () => {
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    cards[0].click();
    fixture.detectChanges();

    expect(component.formControl.value).toBe('delivery');

    cards[1].click();
    fixture.detectChanges();

    expect(component.formControl.value).toBe('pickup');
  });

  it('should display free label when cost is 0', () => {
    fixture.detectChanges();
    const badges = fixture.nativeElement.querySelectorAll('mat-card-subtitle span');
    expect(badges[1].textContent).toContain('cart.shipping.freeAlways');
  });

  it('should show free from label when cost is greater than 0', () => {
    fixture.detectChanges();
    const badges = fixture.nativeElement.querySelectorAll('mat-card-subtitle span');
    expect(badges[0].textContent).toContain('cart.shipping.freeFrom');
  });

  it('should have no accessibility violations', async () => {
    await fixture.whenStable();
    const results = await axe(fixture.nativeElement);
    expect(results.violations).toEqual([]);
  });
});
