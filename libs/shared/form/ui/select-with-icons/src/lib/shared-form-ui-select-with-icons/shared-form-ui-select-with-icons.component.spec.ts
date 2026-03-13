import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedFormUiSelectWithIconsComponent } from './shared-form-ui-select-with-icons.component';

describe('SharedFormUiSelectWithIconsComponent', () => {
  let component: SharedFormUiSelectWithIconsComponent;
  let fixture: ComponentFixture<SharedFormUiSelectWithIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormUiSelectWithIconsComponent, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFormUiSelectWithIconsComponent);
    component = fixture.componentInstance;

    // Mock Formly field configuration
    component.field = {
      formControl: new FormControl(''),
      props: {
        label: 'Status',
        options: [
          { value: 'PENDING', label: 'Pending', icon: 'pending', type: 'warning' },
          { value: 'DELIVERED', label: 'Delivered', icon: 'check_circle', type: 'success' },
        ],
      },
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    const label = fixture.nativeElement.querySelector('mat-label');
    expect(label.textContent).toContain('Status');
  });

  it('should not show selection trigger when no value is selected', () => {
    const trigger = fixture.nativeElement.querySelector('mat-select-trigger div');
    expect(trigger).toBeNull();
  });

  it('should show selection trigger with icon and label when a value is selected', async () => {
    component.formControl.setValue('PENDING');
    fixture.detectChanges();
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('mat-select-trigger div');
    expect(trigger).toBeTruthy();
    expect(trigger.classList).toContain('select-type-warning');
    expect(trigger.querySelector('mat-icon').textContent).toContain('pending');
    expect(trigger.querySelector('span').textContent).toContain('Pending');
  });

  it('should render all options with icons', async () => {
    // Open the select to render options
    const select = fixture.nativeElement.querySelector('mat-select');
    select.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = document.querySelectorAll('mat-option');
    expect(options.length).toBe(2);

    expect(options[0].classList).toContain('select-type-warning');
    expect(options[0].querySelector('mat-icon').textContent).toContain('pending');
    expect(options[0].querySelector('span').textContent).toContain('Pending');

    expect(options[1].classList).toContain('select-type-success');
    expect(options[1].querySelector('mat-icon').textContent).toContain('check_circle');
    expect(options[1].querySelector('span').textContent).toContain('Delivered');
  });
});
