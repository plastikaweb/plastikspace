import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { TestBed } from '@angular/core/testing';

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);
