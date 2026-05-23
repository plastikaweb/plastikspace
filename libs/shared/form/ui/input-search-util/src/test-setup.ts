import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

TestBed.initTestEnvironment([BrowserTestingModule], platformBrowserTesting());

import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);
