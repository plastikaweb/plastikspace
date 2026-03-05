import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AddressSelectorProps } from './address-selector-props';
import { AddressSelectorTypeComponent } from './address-selector-type.component';

describe('AddressSelectorTypeComponent', () => {
  let component: AddressSelectorTypeComponent;
  let fixture: ComponentFixture<AddressSelectorTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressSelectorTypeComponent, ReactiveFormsModule],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressSelectorTypeComponent);
    component = fixture.componentInstance;

    // Mock formly field and props
    component.field = {
      formControl: new FormControl(),
      parent: new FormGroup({}),
      props: {
        addresses: [
          {
            id: '1',
            name: 'Home',
            fullName: 'John Doe',
            address: '123 Main St',
            city: 'City',
            zip: '12345',
            country: 'Country',
            phone: '123456789',
            default: true,
          },
        ],
        editable: true,
      },
    } as unknown as FieldTypeConfig<AddressSelectorProps>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render address cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBe(1);

    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Home');
  });

  it('should update form control when a card is clicked', () => {
    const card = fixture.nativeElement.querySelector('mat-card');
    card.click();
    fixture.detectChanges();

    expect(component.formControl.value).toEqual(component.props.addresses[0]);
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEditSpy = jest.fn();
    component.field = {
      ...component.field,
      props: {
        ...component.field.props,
        editable: true,
        onEdit: onEditSpy,
      },
    };
    fixture.detectChanges();

    const editButton = fixture.nativeElement.querySelector('button');
    expect(editButton).toBeTruthy();
    expect(editButton.textContent).toContain('cart.shipping.address.edit');

    editButton.click();
    expect(onEditSpy).toHaveBeenCalledWith(component.props.addresses[0]);
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    await fixture.whenStable();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
