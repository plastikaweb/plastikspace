## 2025-05-18 - Avoid In-Place Array Mutation in Angular Pipes
**Learning:** Calling `Array.prototype.sort()` directly on pipe parameters mutates the underlying input array in place. In Angular, this breaks pure transformation assumptions and can trigger unwanted side effects across change detection passes.
**Action:** Always shallow copy input arrays via spread operator (`[...list]`) or `.slice()` prior to sorting or mutating operations inside Angular pipes.
