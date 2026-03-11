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
    expect(element.className).toContain('bg-success-100');
  });

  it('should display an icon when provided', () => {
    fixture.componentRef.setInput('icon', 'check');
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    expect(iconElement).toBeTruthy();
  });
});
