import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreUiFooterDefaultComponent } from './core-ui-footer-default.component';

describe('CoreUiFooterDefaultComponent', () => {
  let component: CoreUiFooterDefaultComponent;
  let fixture: ComponentFixture<CoreUiFooterDefaultComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CoreUiFooterDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
