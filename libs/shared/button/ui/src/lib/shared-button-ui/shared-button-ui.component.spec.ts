import { AngularSvgIconModule } from 'angular-svg-icon';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buttonMock, buttonAsLinkMock } from '@plastik/shared/button';

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

  describe('Disabled Button State', () => {
    it('should not be disabled by default', () => {
      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl).toBeTruthy();
      expect(buttonEl.disabled).toBe(false);
    });

    it('should be disabled when disabled property is true', () => {
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonMock,
        disabled: true,
      });
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl).toBeTruthy();
      expect(buttonEl.disabled).toBe(true);
    });

    it('should support reactive disabled state using an Observable', () => {
      const disabled$ = of(true);
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonMock,
        disabled: disabled$,
      });
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl).toBeTruthy();
      expect(buttonEl.disabled).toBe(true);
    });
  });

  describe('Link Variant UX and Accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('buttonConfig', buttonAsLinkMock);
      fixture.detectChanges();
    });

    it('should render an anchor link element with correct href when enabled', () => {
      const linkEl = fixture.nativeElement.querySelector('a');
      expect(linkEl).toBeTruthy();
      expect(linkEl.getAttribute('href')).toBe('');
      expect(linkEl.getAttribute('tabindex')).toBeNull();
      expect(linkEl.getAttribute('aria-disabled')).toBeNull();
      expect(linkEl.classList.contains('opacity-50')).toBe(false);
    });

    it('should apply disabled attributes, nullify href and add opacity-50 when disabled is true', () => {
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonAsLinkMock,
        disabled: true,
      });
      fixture.detectChanges();

      const linkEl = fixture.nativeElement.querySelector('a');
      expect(linkEl).toBeTruthy();
      expect(linkEl.getAttribute('href')).toBeNull();
      expect(linkEl.getAttribute('tabindex')).toBe('-1');
      expect(linkEl.getAttribute('aria-disabled')).toBe('true');
      expect(linkEl.classList.contains('opacity-50')).toBe(true);
    });

    it('should support reactive link disabled state using an Observable', () => {
      const disabled$ = of(true);
      fixture.componentRef.setInput('buttonConfig', {
        ...buttonAsLinkMock,
        disabled: disabled$,
      });
      fixture.detectChanges();

      const linkEl = fixture.nativeElement.querySelector('a');
      expect(linkEl).toBeTruthy();
      expect(linkEl.getAttribute('href')).toBeNull();
      expect(linkEl.getAttribute('tabindex')).toBe('-1');
      expect(linkEl.getAttribute('aria-disabled')).toBe('true');
      expect(linkEl.classList.contains('opacity-50')).toBe(true);
    });
  });

  describe('Decorative Icons Accessibility', () => {
    it('should set aria-hidden="true" on all internal svg-icon elements', () => {
      fixture.detectChanges();
      const svgIconEls = fixture.nativeElement.querySelectorAll('svg-icon');
      expect(svgIconEls.length).toBeGreaterThan(0);
      for (const svgIcon of svgIconEls) {
        expect(svgIcon.getAttribute('aria-hidden')).toBe('true');
      }
    });
  });
});
