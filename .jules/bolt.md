# Bolt Journal

## 2026-08-08 - [Optimizing Empty and Plain Object Utility Checks]
**Learning:** Checking array and string emptiness using Object-level iteration has massive O(N) performance overhead. Using high-performance O(1) checks for length and safe prototype checking with Object.getPrototypeOf avoids expensive O(N) array allocation. Additionally, prototype-less objects created with Object.create(null) throw/fail in simple constructor-based object identity checks; validating that prototype is null or Object.prototype resolves both issues cleanly.
**Action:** Always favor high-performance O(1) length checks for arrays and strings, and use Object.getPrototypeOf to safely validate both plain objects and prototype-less objects.
