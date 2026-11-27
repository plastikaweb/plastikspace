// Fixture of tools/scripts/test-eslint-profiles.mjs (META-13): code that each ESLint rule needing
// type information reports. Each `expect:` comment ends the line of code it describes and lists
// what the typed profile (ESLINT_TYPED=1) reports on that line; the fast profile reports none of it.

/**
 * An API that `@typescript-eslint/no-deprecated` reports wherever it is called.
 * @deprecated Use {@link current} instead.
 * @returns {number} Always 1.
 */
export function legacy(): number {
  return 1;
}

/**
 * The replacement for {@link legacy}.
 * @returns {number} Always 2.
 */
export function current(): number {
  return 2;
}

export const enabled = legacy() > 0; // expect: no-deprecated warn, naming-convention warn

/**
 * A class whose private field is never reassigned.
 */
export class Counter {
  #count = current(); // expect: prefer-readonly error

  /**
   * Reads the count.
   * @returns {number} The count.
   */
  read(): number {
    return this.#count;
  }
}
