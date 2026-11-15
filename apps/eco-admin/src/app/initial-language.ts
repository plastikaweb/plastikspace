/**
 * The `localStorage` key that holds the interface language. Shared with the storefront, so a
 * preference picked in one app of the product is the one the other app opens with on the same origin.
 */
export const ECO_ADMIN_LANGUAGE_STORAGE_KEY = 'eco-lang';

/**
 * Reads the stored language, tolerating a browser that blocks `localStorage`.
 * @returns {string | null} The stored language code, or null when there is none or storage is unavailable.
 */
function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(ECO_ADMIN_LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Picks the language the app starts in.
 *
 * The stored preference wins, then the browser language, then the default. A candidate outside
 * `languages` is skipped, so a stale or foreign value never reaches the translation loader.
 * @param {readonly string[]} languages The languages the app ships translations for.
 * @param {string} defaultLanguage The language used when no candidate is supported.
 * @returns {string} A language code that belongs to `languages`, or `defaultLanguage`.
 */
export function resolveInitialLanguage(
  languages: readonly string[],
  defaultLanguage: string
): string {
  const browserLanguage =
    typeof navigator === 'undefined' ? undefined : navigator.language?.split('-')[0];
  const candidates = [readStoredLanguage(), browserLanguage];

  return (
    candidates.find(
      (candidate): candidate is string => !!candidate && languages.includes(candidate)
    ) ?? defaultLanguage
  );
}
