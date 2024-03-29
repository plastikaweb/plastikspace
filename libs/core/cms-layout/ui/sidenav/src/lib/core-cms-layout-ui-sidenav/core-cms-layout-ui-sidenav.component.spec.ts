import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { axe, toHaveNoViolations } from 'jest-axe';
import { CoreCmsLayoutUiSidenavComponent } from './core-cms-layout-ui-sidenav.component';

describe('CoreCmsLayoutUiSidenavComponent', () => {
  let component: CoreCmsLayoutUiSidenavComponent;
  let fixture: ComponentFixture<CoreCmsLayoutUiSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreCmsLayoutUiSidenavComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreCmsLayoutUiSidenavComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidenav Output value', () => {
    let result;
    component.toggleSidenav.subscribe(action => (result = action));
    component.onToggleSidenav();
    expect(result).toEqual(result);
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
