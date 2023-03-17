import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedActivityUiLinearComponent } from './shared-activity-ui-linear.component';

describe('SharedActivityUiLinearComponent', () => {
  let component: SharedActivityUiLinearComponent;
  let fixture: ComponentFixture<SharedActivityUiLinearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedActivityUiLinearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedActivityUiLinearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
