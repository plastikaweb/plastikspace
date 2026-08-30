import { AngularSvgIconModule } from 'angular-svg-icon';
import { of } from 'rxjs';
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
    expect(result).not.toBeNull();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });

  describe('disabled state for type: button', () => {
    it('should natively disable the button when config.disabled is true', async () => {
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonMock,
        disabled: true,
      });
      await fixture.whenStable();
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.disabled).toBe(true);
    });

    it('should natively disable the button when config.disabled is an observable emitting true', async () => {
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonMock,
        disabled: of(true),
      });
      await fixture.whenStable();
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.disabled).toBe(true);
    });

    it('should not disable the button when config.disabled is false', async () => {
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonMock,
        disabled: false,
      });
      await fixture.whenStable();
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.disabled).toBe(false);
    });
  });

  describe('disabled state for type: link', () => {
    it('should handle standard enabled links correctly', async () => {
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonAsLinkMock,
        link: 'https://example.com',
        disabled: false,
      });
      await fixture.whenStable();
      fixture.detectChanges();

      const linkEl = fixture.nativeElement.querySelector('a');
      expect(linkEl.getAttribute('href')).toBe('https://example.com');
      expect(linkEl.getAttribute('tabindex')).toBeNull();
      expect(linkEl.getAttribute('aria-disabled')).toBeNull();
      expect(linkEl.classList.contains('opacity-50')).toBe(false);
      expect(linkEl.classList.contains('cursor-not-allowed')).toBe(false);
    });

    it('should modify anchor attributes and classes when link is disabled', async () => {
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonAsLinkMock,
        link: 'https://example.com',
        disabled: true,
      });
      await fixture.whenStable();
      fixture.detectChanges();

      const linkEl = fixture.nativeElement.querySelector('a');
      expect(linkEl.getAttribute('href')).toBeNull();
      expect(linkEl.getAttribute('tabindex')).toBe('-1');
      expect(linkEl.getAttribute('aria-disabled')).toBe('true');
      expect(linkEl.classList.contains('opacity-50')).toBe(true);
      expect(linkEl.classList.contains('cursor-not-allowed')).toBe(true);
    });

    it('should modify anchor attributes when link is disabled by observable', async () => {
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonAsLinkMock,
        link: 'https://example.com',
        disabled: of(true),
      });
      await fixture.whenStable();
      fixture.detectChanges();

      const linkEl = fixture.nativeElement.querySelector('a');
      expect(linkEl.getAttribute('href')).toBeNull();
      expect(linkEl.getAttribute('tabindex')).toBe('-1');
      expect(linkEl.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('SVG icon accessibility', () => {
    it('should set aria-hidden="true" on internal decorative icons', async () => {
      fixture.componentRef.setInput('buttonConfig', buttonMock);
      await fixture.whenStable();
      fixture.detectChanges();

      const iconEl = fixture.nativeElement.querySelector('svg-icon');
      expect(iconEl).toBeTruthy();
      expect(iconEl.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
