import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedFormUiTextTypeComponent } from './shared-form-ui-text.component';

describe('SharedFormUiTextComponent', () => {
  let component: SharedFormUiTextTypeComponent;
  let fixture: ComponentFixture<SharedFormUiTextTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormUiTextTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFormUiTextTypeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
