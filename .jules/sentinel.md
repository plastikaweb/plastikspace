## 2025-05-15 - [XSS Protection in HighlightPipe]
**Vulnerability:** The `HighlightPipe` used `bypassSecurityTrustHtml` on unescaped user-provided strings, allowing malicious HTML/script injection via search results.
**Learning:** Utilities that mark content as "safe" for Angular's `[innerHTML]` must ensure that only the intended markup is present. Relying on input being "plain text" is dangerous if that input is ever rendered as HTML.
**Prevention:** Always escape HTML special characters in dynamic inputs before wrapping them in trusted markup (like `<mark>` tags) and passing them to `DomSanitizer.bypassSecurityTrustHtml`.
