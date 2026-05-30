# Palette's Journal

## 2025-05-14 - [Tooltip Discoverability for Icon-Only Buttons]
**Learning:** Sighted users often lack visual cues for icon-only buttons that rely solely on ARIA labels for accessibility. Adding tooltips provides an essential layer of discoverability without cluttering the UI with text labels.
**Action:** Always ensure that icon-only buttons or generic shared button components include tooltip support, ideally defaulting to the `ariaLabel` if a specific tooltip is not provided.
