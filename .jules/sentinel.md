## 2026-08-30 - Programmatic window.open reverse-tabnabbing in configuration objects

**Vulnerability:** `window.open(url, '_blank')` called in configuration callbacks (e.g. `headerConfig.widgetsConfig` in `apps/nasa-images/src/app/cms-layout-config.ts`) omitted window feature options, allowing target external links to access `window.opener` and navigate the parent window (reverse-tabnabbing).
**Learning:** While template `<a>` tags with `target="_blank"` are often scanned or linted for `rel="noopener noreferrer"`, programmatic `window.open` calls embedded in TypeScript configuration structures can easily slip through template static analysis.
**Prevention:** Always explicitly pass `'noopener,noreferrer'` as the 3rd argument to `window.open(url, '_blank', 'noopener,noreferrer')` whenever opening external links programmatically, and write unit tests asserting that `window.open` is called with those feature flags.
