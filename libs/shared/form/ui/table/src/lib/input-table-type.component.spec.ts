import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputTableTypeComponent } from './input-table-type.component';

describe('InputTableTypeComponent', () => {
  let component: InputTableTypeComponent;
  let fixture: ComponentFixture<InputTableTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTableTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTableTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
