# Architectural Review: PR #1214

## Status: REQUEST CHANGES (MAJOR)

### Summary
PR #1214 represents a massive regression, rolling back the Angular 21 modernization, security hardening, and performance optimizations implemented over the last quarter.

### 🚨 Critical Issues & Logic Bugs
* **Security (XSS)**: Reversion of `escapeHtml` in `SharedConfirmFeatureComponent` and `SharedUtilFormattersService`. `[innerHTML]` is used with unescaped user-provided data.
* **Angular Downgrade**: `package.json` rolled back from v21 to v19.
* **Core Standards**: Replaced ES6 private fields (`#`) with `private` keyword.
* **Broken DI**: `SafeFormattedPipe` constructor/inject mismatch breaks runtime.

### 💡 Angular & Signal Patterns
* Removed `linkedSignal` in `SharedFormFeatureComponent`.
* Reintroduced manual `Subscription` management and legacy lifecycle hooks (`OnInit`).

### 🚀 Performance
* Removal of system timezone caching in `SharedUtilFormattersService`.
* Removal of optimized `deepClone` (TECH-11).

### ♿ Accessibility (A11y)
* Regression of `SkipLinkComponent` localized announcements.
* Loss of dynamic `aria-label` for table row expansion.

### 🎨 Styling
* Reverted `[class.name]` to `[ngClass]`.
* Reverted Tailwind 4 utility patterns to legacy classes.
