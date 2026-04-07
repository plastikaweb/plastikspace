import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { TestBed } from '@angular/core/testing';

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

import { expect, vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

expect.extend(matchers);
