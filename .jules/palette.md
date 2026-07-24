# Palette's UX & Accessibility Journal

This journal logs critical UX and accessibility (a11y) insights, surprising behaviors, design system constraints, and lessons learned.

## 2026-07-07 - Unconditional Search Reset Pattern
**Learning:** The clear/reset button for a search input field should never be disabled, even if the form control is invalid (for example, when the search term is below the mandatory `minLength`). Disabling this button traps keyboard and mouse users, forcing them to manually backspace or select-all and delete the text rather than clearing it with a single, highly accessible click/action.
**Action:** Ensure reset buttons are always interactive as long as a value is present in the input field, decoupling their disabled status from standard form validation states.
