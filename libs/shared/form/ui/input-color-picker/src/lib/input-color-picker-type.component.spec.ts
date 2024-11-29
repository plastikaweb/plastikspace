import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputColorPickerTypeComponent } from './input-color-picker-type.component';

describe('InputColorPickerTypeComponent', () => {
  let component: InputColorPickerTypeComponent;
  let fixture: ComponentFixture<InputColorPickerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputColorPickerTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputColorPickerTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
