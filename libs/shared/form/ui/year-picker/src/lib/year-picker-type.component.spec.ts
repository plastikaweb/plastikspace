import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YearPickerTypeComponent } from './year-picker-type.component';

describe('YearPickerTypeComponent', () => {
  let component: YearPickerTypeComponent;
  let fixture: ComponentFixture<YearPickerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearPickerTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YearPickerTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
