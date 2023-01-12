import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CoreUiHeaderDefaultComponent } from './core-ui-header-default.component';

describe('CoreUiHeaderDefaultComponent', () => {
  let component: CoreUiHeaderDefaultComponent;
  let fixture: ComponentFixture<CoreUiHeaderDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatToolbarModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreUiHeaderDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
