import { ComponentFixture, TestBed } from '@angular/core/testing';

import { axe, toHaveNoViolations } from 'jest-axe';
import { CoreCmsLayoutUiFooterComponent } from './core-cms-layout-ui-footer.component';

describe('CoreCmsLayoutUiFooterComponent', () => {
  let component: CoreCmsLayoutUiFooterComponent;
  let fixture: ComponentFixture<CoreCmsLayoutUiFooterComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CoreCmsLayoutUiFooterComponent);
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
