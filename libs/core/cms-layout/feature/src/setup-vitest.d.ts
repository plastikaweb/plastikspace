import '@vitest/expect';
import { AxeMatchers } from 'vitest-axe/matchers';

/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
declare module '@vitest/expect' {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

declare global {
  namespace Vi {
    interface Assertion<T = any> extends AxeMatchers {}
    interface AsymmetricMatchersContaining extends AxeMatchers {}
  }
}
/* eslint-enable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
