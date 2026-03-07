import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe } from 'vitest-axe';
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
    const results = await axe(fixture.nativeElement);
    expect(results.violations).toEqual([]);
  });
});
