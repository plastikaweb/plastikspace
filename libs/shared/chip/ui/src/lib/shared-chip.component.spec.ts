import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe } from 'vitest-axe';
import { SharedChipComponent } from './shared-chip.component';

describe('SharedChipComponent', () => {
  let component: SharedChipComponent;
  let fixture: ComponentFixture<SharedChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });

  it('should display the label', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('span');

    expect(element.textContent).toContain('Test Label');
  });

  it('should have the correct type class', () => {
    fixture.componentRef.setInput('type', 'success');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('span');

    expect(element.className).toContain('bg-success-50');
  });

  it('should colour the tertiary variant with Material roles only', () => {
    fixture.componentRef.setInput('type', 'tertiary');
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement.querySelector('span');

    expect(element.classList).toContain('bg-sys-tertiary-container');
    expect(element.classList).toContain('text-sys-on-tertiary-container');
    expect(element.className).not.toMatch(/tertiary-\d|dark:/);
  });

  it('should display an icon when provided', () => {
    fixture.componentRef.setInput('icon', 'check');
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('mat-icon');

    expect(iconElement).toBeTruthy();
  });
});
