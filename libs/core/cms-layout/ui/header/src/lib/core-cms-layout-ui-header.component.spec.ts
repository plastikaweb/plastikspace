import { ComponentFixture, TestBed } from '@angular/core/testing';

import { axe, toHaveNoViolations } from 'jest-axe';
import { CoreCmsLayoutUiHeaderComponent } from './core-cms-layout-ui-header.component';

describe('CoreCmsLayoutUiHeaderComponent', () => {
  let component: CoreCmsLayoutUiHeaderComponent;
  let fixture: ComponentFixture<CoreCmsLayoutUiHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreCmsLayoutUiHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreCmsLayoutUiHeaderComponent);
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
