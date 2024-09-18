import { ComponentFixture, TestBed } from '@angular/core/testing';

import { axe, toHaveNoViolations } from 'jest-axe';
import { SharedActivityUiOverlayComponent } from './shared-activity-ui-overlay.component';

describe('SharedActivityUiOverlayComponent', () => {
  let component: SharedActivityUiOverlayComponent;
  let fixture: ComponentFixture<SharedActivityUiOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedActivityUiOverlayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedActivityUiOverlayComponent);
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
