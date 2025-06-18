import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SharedActivityUiLinearComponent } from './shared-activity-ui-linear.component';

describe('SharedActivityUiLinearComponent', () => {
  let component: SharedActivityUiLinearComponent;
  let fixture: ComponentFixture<SharedActivityUiLinearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedActivityUiLinearComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedActivityUiLinearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
