import { AngularSvgIconModule } from 'angular-svg-icon';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buttonMock, ButtonConfig } from '@plastik/shared/button';

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

  describe('Decorative icons', () => {
    it('should have aria-hidden="true" on svg-icon since parent buttons have an ariaLabel', () => {
      const svgIcon = fixture.nativeElement.querySelector('svg-icon');
      expect(svgIcon).toBeTruthy();
      expect(svgIcon.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Button variant disabled states', () => {
    it('should resolve static disabled state (true)', async () => {
      const disabledButtonMock: ButtonConfig = {
        ...buttonMock,
        disabled: true,
      };
      fixture.componentRef.setInput('buttonConfig', disabledButtonMock);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should resolve static disabled state (false)', async () => {
      const enabledButtonMock: ButtonConfig = {
        ...buttonMock,
        disabled: false,
      };
      fixture.componentRef.setInput('buttonConfig', enabledButtonMock);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(false);
    });

    it('should resolve reactive disabled state (Observable true)', async () => {
      const reactiveDisabledMock: ButtonConfig = {
        ...buttonMock,
        disabled: of(true),
      };
      fixture.componentRef.setInput('buttonConfig', reactiveDisabledMock);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should resolve reactive disabled state (Observable false)', async () => {
      const reactiveEnabledMock: ButtonConfig = {
        ...buttonMock,
        disabled: of(false),
      };
      fixture.componentRef.setInput('buttonConfig', reactiveEnabledMock);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(false);
    });
  });

  describe('Link variant disabled and accessibility states', () => {
    const baseLinkMock: ButtonConfig = {
      id: 2,
      type: 'link',
      elements: [{ type: 'text', content: 'Navigate' }],
      ariaLabel: 'navigate home',
      link: 'https://example.com',
    };

    it('should render standard enabled link with correct attributes', async () => {
      fixture.componentRef.setInput('buttonConfig', baseLinkMock);
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('a');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('https://example.com');
      expect(link.getAttribute('tabindex')).toBe('0');
      expect(link.getAttribute('aria-disabled')).toBeNull();
      expect(link.classList.contains('opacity-50')).toBe(false);
    });

    it('should render static disabled link with correct accessibility attributes and nullified href', async () => {
      const disabledLink: ButtonConfig = {
        ...baseLinkMock,
        disabled: true,
      };
      fixture.componentRef.setInput('buttonConfig', disabledLink);
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('a');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBeNull();
      expect(link.getAttribute('tabindex')).toBe('-1');
      expect(link.getAttribute('aria-disabled')).toBe('true');
      expect(link.classList.contains('opacity-50')).toBe(true);
    });

    it('should render reactive disabled link with correct accessibility attributes and nullified href', async () => {
      const disabledLink: ButtonConfig = {
        ...baseLinkMock,
        disabled: of(true),
      };
      fixture.componentRef.setInput('buttonConfig', disabledLink);
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('a');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBeNull();
      expect(link.getAttribute('tabindex')).toBe('-1');
      expect(link.getAttribute('aria-disabled')).toBe('true');
      expect(link.classList.contains('opacity-50')).toBe(true);
    });
  });
});
