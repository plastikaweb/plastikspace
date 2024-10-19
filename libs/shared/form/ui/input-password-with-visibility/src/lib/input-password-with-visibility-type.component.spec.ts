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
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
