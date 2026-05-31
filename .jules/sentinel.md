## 2025-05-15 - XSS Vulnerability in HighlightPipe
**Vulnerability:** The `HighlightPipe` used `DomSanitizer.bypassSecurityTrustHtml` on unescaped user input, allowing potential Cross-Site Scripting (XSS) attacks.
**Learning:** Even when adding intended HTML (like `<mark>` tags), all original content segments must be escaped first if the final output is marked as "safe" for Angular.
**Prevention:** Always use a utility like `escapeHtml` to sanitize user-provided strings before combining them with trusted HTML fragments and passing them to `bypassSecurityTrustHtml`.
