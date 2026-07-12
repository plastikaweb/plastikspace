import { AngularSvgIconModule } from 'angular-svg-icon';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buttonAsLinkMock, buttonMock } from '@plastik/shared/button';

import { SharedButtonUiComponent } from './shared-button-ui.component';

describe('SharedButtonUiComponent', () => {
  let component: SharedButtonUiComponent;
  let fixture: ComponentFixture<SharedButtonUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedButtonUiComponent, AngularSvgIconModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedButtonUiComponent);
    fixture.componentRef.setInput('buttonConfig', buttonMock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output a button action on click', () => {
    let result;
    component.sendAction.subscribe(action => (result = action));
    component.onClick();
    expect(result).toEqual(result);
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should be disabled when buttonConfig.disabled is true', () => {
    fixture.componentRef.setInput('buttonConfig', { ...buttonMock, disabled: true });
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should handle link disabled state correctly', () => {
    fixture.componentRef.setInput('buttonConfig', {
      ...buttonAsLinkMock,
      disabled: true,
      link: 'http://example.com',
    });
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBeNull();
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.classList.contains('opacity-50')).toBe(true);
  });

  it('should have aria-hidden="true" on svg-icon', () => {
    const svgIcon = fixture.nativeElement.querySelector('svg-icon');
    expect(svgIcon.getAttribute('aria-hidden')).toBe('true');
  });
});
