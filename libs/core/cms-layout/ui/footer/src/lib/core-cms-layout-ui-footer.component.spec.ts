import { axe, toHaveNoViolations } from 'jest-axe';

import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreCmsLayoutUiFooterComponent } from './core-cms-layout-ui-footer.component';

describe('CoreCmsLayoutUiFooterComponent', () => {
  let component: CoreCmsLayoutUiFooterComponent;
  let fixture: ComponentFixture<CoreCmsLayoutUiFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreCmsLayoutUiFooterComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();
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
