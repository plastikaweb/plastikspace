import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedFormUiYearPickerComponent } from './shared-form-ui-year-picker.component';

describe('SharedFormUiYearPickerComponent', () => {
  let component: SharedFormUiYearPickerComponent;
  let fixture: ComponentFixture<SharedFormUiYearPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormUiYearPickerComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFormUiYearPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on writeValue', () => {
    const value = 2000;
    component.writeValue(value);
    expect(component.formControl.value).toEqual(value);
  });
});
