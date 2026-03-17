import { expect, vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// Increase default timeout for accessibility tests
vi.setConfig({ testTimeout: 30000 });

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

// Extend Vitest types for Axe
import type { AxeMatchers } from 'vitest-axe/matchers';
declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
