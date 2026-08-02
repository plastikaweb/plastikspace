import { of } from 'rxjs';
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

  it('should support button disabled state', async () => {
    fixture.componentRef.setInput('buttonConfig', {
      ...buttonMock,
      disabled: true,
    });
    fixture.detectChanges();

    const buttonEl = fixture.nativeElement.querySelector('button');
    expect(buttonEl.disabled).toBe(true);
  });

  it('should support button disabled state via Observable', async () => {
    fixture.componentRef.setInput('buttonConfig', {
      ...buttonMock,
      disabled: of(true),
    });
    fixture.detectChanges();

    const buttonEl = fixture.nativeElement.querySelector('button');
    expect(buttonEl.disabled).toBe(true);
  });

  it('should support active link button', async () => {
    const linkMock = {
      ...buttonAsLinkMock,
      link: 'https://example.com',
    };
    fixture.componentRef.setInput('buttonConfig', linkMock);
    fixture.detectChanges();

    const linkEl = fixture.nativeElement.querySelector('a');
    expect(linkEl).toBeTruthy();
    expect(linkEl.getAttribute('href')).toBe('https://example.com');
    expect(linkEl.getAttribute('tabindex')).toBeNull();
    expect(linkEl.getAttribute('aria-disabled')).toBeNull();
    expect(linkEl.classList.contains('opacity-50')).toBe(false);

    // Verify aria-hidden on internal icon
    const iconEl = fixture.nativeElement.querySelector('svg-icon');
    expect(iconEl).toBeTruthy();
    expect(iconEl.getAttribute('aria-hidden')).toBe('true');
  });

  it('should support disabled link button', async () => {
    const linkMock = {
      ...buttonAsLinkMock,
      link: 'https://example.com',
      disabled: true,
    };
    fixture.componentRef.setInput('buttonConfig', linkMock);
    fixture.detectChanges();

    const linkEl = fixture.nativeElement.querySelector('a');
    expect(linkEl).toBeTruthy();
    expect(linkEl.getAttribute('href')).toBeNull();
    expect(linkEl.getAttribute('tabindex')).toBe('-1');
    expect(linkEl.getAttribute('aria-disabled')).toBe('true');
    expect(linkEl.classList.contains('opacity-50')).toBe(true);
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
