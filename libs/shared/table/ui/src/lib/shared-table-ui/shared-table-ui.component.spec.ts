import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTableUiComponent } from './shared-table-ui.component';

describe('SharedTableUiComponent', () => {
  let component: SharedTableUiComponent<unknown>;
  let fixture: ComponentFixture<SharedTableUiComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTableUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedTableUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
