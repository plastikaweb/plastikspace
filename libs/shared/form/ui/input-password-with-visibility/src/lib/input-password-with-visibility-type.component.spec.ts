import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputPasswordWithVisibilityTypeComponent } from './input-password-with-visibility-type.component';

describe('InputPasswordWithVisibilityTypeComponent', () => {
  let component: InputPasswordWithVisibilityTypeComponent;
  let fixture: ComponentFixture<InputPasswordWithVisibilityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPasswordWithVisibilityTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputPasswordWithVisibilityTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility when hidePassword is called', () => {
    const initialVisibility = component.hiddenPass();
    const event = new Event('click');

    component.hidePassword(event);

    expect(component.hiddenPass()).toBe(!initialVisibility);
  });
});
