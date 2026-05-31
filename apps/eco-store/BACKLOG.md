# Eco Store — BACKLOG

> **Phased sprint plan for the `eco-store` app.**
> Derived from `TASKS.md` v0.4 (post-ClickUp audit). Tasks ordered within each phase so dependencies always come first; phases ordered by priority + ROI.
>
> Companion to `TASKS.md` and PRD v1.8.

**Document version:** 0.6 · **Last updated:** 2026-05-30

---

## Estimating conventions

- **Unit:** dev-day = ~6 hours of focused work
- **Setup assumed:** solo developer with IDE agent assistance (Cursor/Claude Code) and patterns from adjacent libs
- **Buffer:** add ~30% on top of phase totals for sprint planning
- **Schema work** is split out as its own line when it's a meaningful chunk
- **MUST work** is prioritized within each phase
- ClickUp IDs in `code formatting` link to existing tickets

---

## Phase 0 — Cleanup, urgent bugs & foundation

**Goal:** Clean the deck, kill the urgent security bug, fix two PWA/route bugs, lock down obvious schema issues, verify the cart fix, kick off a11y audit.

**Estimated effort:** ~4.5 dev-days

| #   | Task                                                                | Priority   | Est   | Depends on | Notes                                                                                                                                                  |
| --- | ------------------------------------------------------------------- | ---------- | ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.0 | **OPS-02** Claude review workflow `pull-requests: write` ✅         | **Urgent** | 0.1d  | —          | Done 2026-05-23 — `permissions.pull-requests` raised `read` → `write` (also `issues`). CU `86c9y6xyb`                                                  |
| 0.1 | **BUG-005** Profile routes auth guard ✅                            | **Urgent** | 0.5d  | —          | Done 2026-05-23 (PR #1080) — shared `ecoStoreAuthGuard` on `/perfil` (also `/comandes`); redirect to `/accedir`, preserves `returnUrl`. CU `86c9uq8jq` |
| 0.2 | **META-01** Delete obsolete PRD ✅                                  | MUST       | 0.25d | —          | Done 2026-05-23 — `eco-store-req.md` removed; stale refs in cspell/markdownlint/CLAUDE.md/TASKS.md cleaned up                                          |
| 0.3 | **META-02** Remove `NOT_REGISTERED` enum ✅                         | MUST       | 0.25d | —          | Done 2026-05-30 — removed on local PB; `pb_schema.json` now 4 values; verified 0 staging records held it; staging syncs on merge. CU `86c9uq8k3`       |
| 0.4 | **BUG-001** Verify cart merge                                       | MUST       | 0.5d  | —          | 5 manual test cases from TASKS.md                                                                                                                      |
| 0.5 | **BUG-002** Deep-link `/cistella/resum` redirect ✅                 | MUST       | 0.5d  | —          | Done 2026-05-29 — empty-cart guard no-ops during SSR (`isPlatformBrowser`); deep-links keep items. CU `86c9uq8kb`                                      |
| 0.6 | **BUG-003** PWA manifest tenant name                                | MUST       | 0.5d  | —          | `PwaManifestService.applyBranding()`. CU `86c9dn9m0`                                                                                                   |
| 0.7 | **A11Y-001** + **A11Y-002** Audit phase                             | MUST       | 1d    | —          | Catalog 200% zoom breakdowns + mobile tenant button; fixes go to Phase 7                                                                               |
| 0.8 | **I18N-001** Hardcoded-string audit                                 | SHOULD     | 0.5d  | —          | `yarn i18n:validate` + manual scan                                                                                                                     |
| 0.9 | **META-05** ClickUp ↔ TASKS.md automation (Phase 1: read-only diff) | Low        | 0.5d  | —          | `/sync-eco-store-tasks` slash command. Validates token + IDs + PRD-ID-as-bridge before Phases 2–4 add writes. CU `86c9uwmzf`                           |

**Exit criteria:** Repo clean; `membershipStatus` has 4 values; profile is auth-gated; 3 bugs fixed; BUG-001 closed or has fresh repro; A11Y findings list exists.

---

## Phase 1 — Member completion (the #21 epic)

**Goal:** Close the in-flight member profile journey. All 5 active subtasks of ClickUp `#21 - Perfil d'usuari` plus the trial conversion CTA. After this phase, a member's profile area is feature-complete.

**Estimated effort:** ~10 dev-days

| #    | Task                                                    | Priority | Est   | Depends on | Notes                                                                                                                                    |
| ---- | ------------------------------------------------------- | -------- | ----- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1  | Schema: `user_addresses` typology + NIF + dual defaults | MUST     | 0.5d  | —          | `addressType` Select, `nif` Text, rename `default` → `defaultShipping`, add `defaultBilling`. Update `single_default_address.pb.js` hook |
| 1.2  | Schema: `users.notificationPrefs` JSON field            | MUST     | 0.25d | —          | For PRV-09                                                                                                                               |
| 1.3  | **PRV-02b** Email change with async verification        | MUST     | 2d    | —          | Non-blocking flow. CU `86c92g6ek`                                                                                                        |
| 1.4  | **PRV-02c** In-session password change                  | MUST     | 1d    | —          | 3 fields, different from PRV-03. CU `86c92g60y`                                                                                          |
| 1.5  | **PRV-04d** Billing address typology + NIF              | MUST     | 2d    | 1.1        | Form + UI badges + checkout pre-fill. CU `86c99dev0`                                                                                     |
| 1.6  | **PRV-09** Notification preferences panel               | SHOULD   | 2d    | 1.2        | 6 toggles → `notificationPrefs` JSON. CU `86c92g7fb`                                                                                     |
| 1.7  | **PRV-08** Self-service account deletion (RGPD)         | MUST     | 2.5d  | —          | Confirmation dialog + new `on_user_delete.pb.js` hook for hard delete + order anonymization + cascade. CU `86c92g6hd`                    |
| 1.8  | **TRL-03** Trial → member conversion CTA                | MUST     | 1.5d  | —          | `TrialBannerComponent` + dialog + PATCH + `authRefresh()`                                                                                |
| 1.9  | **TRL-04** Frontend checkout block + upsell             | MUST     | 0.5d  | TRL-05 ✅  | UX mirror of backend rule                                                                                                                |
| 1.10 | **TRL-06** Data preservation verification               | MUST     | 0.5d  | TRL-03     | Manual test                                                                                                                              |

**Exit criteria:** All 4 in-progress subtasks of #21 epic closed. Profile has: basic info, avatar, addresses (shipping + billing), email change, password change, account deletion, notification prefs. Trial users can self-convert.

---

## Phase 2 — Catalog quick wins & UX polish

**Goal:** Knock out catalog MUSTs that need no schema work + the cart UX polish. All live in similar surface area.

**Estimated effort:** ~4 dev-days

| #   | Task                                               | Priority | Est  | Depends on | Notes                               |
| --- | -------------------------------------------------- | -------- | ---- | ---------- | ----------------------------------- |
| 2.1 | **BOT-02b** Text search input                      | MUST     | 1.5d | —          | CU `86c8cjggk`                      |
| 2.2 | **BOT-02c** Tag filter chips                       | MUST     | 1d   | —          | CU `86c8cjgkj`                      |
| 2.3 | **BOT-08** Stock badge + overlay (Avisa'm stubbed) | MUST     | 1d   | —          | "Avisa'm" placeholder until Phase 5 |
| 2.4 | **BUG-004** Rationalize cart toasts                | SHOULD   | 0.5d | —          | UX debouncing/dedup. CU `86c8ta2kt` |

**Exit criteria:** Catalog feels complete for browsing — filters, search, stock state functional, cart UX clean.

---

## Phase 3 — Home page (INI module)

**Goal:** Build the front door. `/` → real homepage. Biggest MUST gap and highest LCP leverage.

**Estimated effort:** ~9 dev-days

| #    | Task                                                                   | Priority | Est   | Depends on    | Notes                                |
| ---- | ---------------------------------------------------------------------- | -------- | ----- | ------------- | ------------------------------------ |
| 3.1  | Schema: hero fields + `isFeatured` + `aboutUsText` + `howItWorksSteps` | MUST     | 0.5d  | —             | 7 fields in one Admin UI session     |
| 3.2  | Asset prep: 4 hero presets × {mobile, desktop} × {webp, avif}          | MUST     | 1.5d  | —             | Design effort more than dev          |
| 3.3  | Lib scaffolding `libs/eco-store/home/feature` + route at `''`          | MUST     | 0.25d | —             | Remove `**` fallback                 |
| 3.4  | **INI-01** Hero section                                                | MUST     | 1.5d  | 3.1, 3.2, 3.3 | `<picture>` + preload; LCP < 2.5s    |
| 3.5  | **INI-02** "Fes-te soci" anonymous CTA                                 | MUST     | 0.5d  | 3.3           | Routes to PRV-06 or `/accedir`       |
| 3.6  | **INI-05** Visual category navigation                                  | MUST     | 1d    | 3.3           | From `product_categories_stats` view |
| 3.7  | **INI-03** "Com funciona" with auto-gen from `logisticsConfig`         | MUST     | 2d    | 3.1, 3.3      | Hard part is the auto-gen logic      |
| 3.8  | **INI-04** Featured products showcase                                  | SHOULD   | 1d    | 3.1, 3.3      | Manual mode only (defer Q-11)        |
| 3.9  | **INI-06** "Qui som / impacte" section                                 | SHOULD   | 1d    | 3.1, 3.3      | Sanitize `aboutUsText` HTML          |
| 3.10 | **INI-08** Pre-footer conversion CTA                                   | SHOULD   | 0.5d  | 3.3           |                                      |
| 3.11 | **INI-09** Scroll reveal animations                                    | COULD    | 0.5d  | 3.3           | Respect `prefers-reduced-motion`     |

**Exit criteria:** `/` is a real landing page. LCP < 2.5s on throttled mobile.

**Splitting:** Phase 3 is large — consider 3A (3.1–3.7, ≈7d, working homepage) + 3B (3.8–3.11, ≈3d, polish).

---

## Phase 4 — Global search (SRC module)

**Goal:** Ship the persistent header search. Second-largest MUST gap after INI.

**Estimated effort:** ~6 dev-days

| #   | Task                                                   | Priority | Est  | Depends on | Notes                                         |
| --- | ------------------------------------------------------ | -------- | ---- | ---------- | --------------------------------------------- |
| 4.1 | **SRC-01** Header search bar (sticky, mobile collapse) | MUST     | 1d   | —          | Replaces `app.search-form.config.ts` scaffold |
| 4.2 | **SRC-02** Typeahead dropdown infrastructure           | MUST     | 1d   | 4.1        | Debounced 300ms, grouped, max 3-5/group       |
| 4.3 | **SRC-03** Product results                             | MUST     | 0.5d | 4.2        |                                               |
| 4.4 | **SRC-04** Category results                            | MUST     | 0.5d | 4.2        |                                               |
| 4.5 | **SRC-05** Own-orders results (authenticated)          | SHOULD   | 1d   | 4.2        |                                               |
| 4.6 | **SRC-07** Static page results                         | SHOULD   | 0.5d | 4.2        | Qui Som + LGL when ready                      |
| 4.7 | **SRC-08** Empty state with suggestions                | MUST     | 0.5d | 4.2        |                                               |
| 4.8 | **SRC-09** A11y combobox pattern                       | MUST     | 1d   | 4.2        | Full keyboard nav                             |

**Exit criteria:** Header search returns grouped multi-source results, fully accessible.

---

## Phase 5 — Wishlist + Reviews + Restock alerts

**Goal:** Engagement loop. Blocked on schema decisions (Q-13, Q-14) — resolve first.

**Estimated effort:** ~7 dev-days _(after decisions)_

| #   | Task                                                         | Priority | Est   | Depends on | Notes                                            |
| --- | ------------------------------------------------------------ | -------- | ----- | ---------- | ------------------------------------------------ |
| 5.1 | **Q-14** Resolve wishlist data model                         | —        | 0.25d | —          | Recommendation: dedicated `wishlists` collection |
| 5.2 | **Q-13** Resolve reviews data model                          | —        | 0.25d | —          | Recommendation: dedicated `reviews` collection   |
| 5.3 | Schema: `wishlists` + `stock_alerts` + `reviews` collections | MUST     | 1d    | 5.1, 5.2   | API rules, indexes, cascade                      |
| 5.4 | **BOT-07** Wishlist toggle                                   | SHOULD   | 2d    | 5.3        | Heart icon; inactive for anonymous               |
| 5.5 | **BOT-13a** "Avisa'm" anonymous form                         | SHOULD   | 1d    | 5.3        | Replaces BOT-08 stub                             |
| 5.6 | **BOT-13b** "Avisa'm" auto for wishlist                      | SHOULD   | 0.5d  | 5.4, 5.5   | Auto-create `stock_alert`                        |
| 5.7 | **VAL-01** Publish review form                               | SHOULD   | 1.5d  | 5.3        | Gated to buyers                                  |
| 5.8 | Hook: recompute `products.rating`/`reviewsCount`             | SHOULD   | 0.5d  | 5.3, 5.7   | New `.pb.js`                                     |

**Exit criteria:** Members favorite, get notified on restock, publish reviews. Anonymous can subscribe to restock emails.

---

## Phase 6 — Notification hooks & order lifecycle

**Goal:** Round out email lifecycle + order cycle automation. Mostly backend hooks.

**Estimated effort:** ~4 dev-days

| #   | Task                                                | Priority | Est  | Depends on | Notes                              |
| --- | --------------------------------------------------- | -------- | ---- | ---------- | ---------------------------------- |
| 6.1 | **NOT-02** Order status change email hook           | MUST     | 1d   | —          | Triggers on `orders.status` update |
| 6.2 | **NOT-04** Cycle opened email hook                  | SHOULD   | 0.5d | —          | On `order_cycles.status → OPEN`    |
| 6.3 | **NOT-05** Cycle closing reminder (scheduled)       | SHOULD   | 1d   | —          | Extend `cycle_cron.pb.js`          |
| 6.4 | **TRL-08** Trial expiry reminder hook               | SHOULD   | 1d   | —          | New scheduled hook                 |
| 6.5 | **PST-04** Order status transition on window change | SHOULD   | 0.5d | —          | CU `86c9e9964`                     |

**Exit criteria:** All transactional emails wired. Order cycle state machine complete.

---

## Phase 7 — Legal, a11y, polish & ops

**Goal:** Ship-ready compliance + finally execute the a11y fixes from Phase 0 audit + production deploy.

**Estimated effort:** ~8 dev-days

| #    | Task                                          | Priority | Est   | Depends on | Notes                                                                                                                                                                                                   |
| ---- | --------------------------------------------- | -------- | ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7.1  | **UI-04** Footer view                         | MUST     | 1d    | —          | CU `86c8cjgg9`                                                                                                                                                                                          |
| 7.2  | **LGL-01** Legal pages                        | MUST     | 2d    | —          | Static content + footer links + i18n. CU `86c8cjgm2`                                                                                                                                                    |
| 7.3  | **Q-10** Resolve cookie consent strategy      | —        | 0.25d | —          | CMP vs in-house                                                                                                                                                                                         |
| 7.4  | **LGL-02** Cookie consent banner              | MUST     | 1.5d  | 7.3        | CU `86c8cjgm3`                                                                                                                                                                                          |
| 7.5  | **A11Y-001** + **A11Y-002** Fixes             | MUST     | 1d    | Phase 0.7  | Execute findings                                                                                                                                                                                        |
| 7.6  | **SEO-01** Dynamic SEO titles                 | SHOULD   | 1d    | —          | CU `86c9autmu` — high priority                                                                                                                                                                          |
| 7.7  | **OPS-01** Production deploy pipeline         | MUST     | 1.5d  | —          | CU `86c8cjgm0` — needed before v1 launch                                                                                                                                                                |
| 7.8  | **TECH-01** `string \| LocalizedField` util   | SHOULD   | 0.5d  | —          | CU `86c9uq9rf`                                                                                                                                                                                          |
| 7.9  | **TECH-02** Modernize `libs/shared/*` libs ✅ | SHOULD   | 1d    | —          | Done 2026-05-29 — develop already modernized (May-1); residual cleanup (`#` methods + dead `matFormField` query) landed. Jules PRs #1073/#1078/#1087 closed (all targeted stale `main`). CU `86c9y6upw` |
| 7.10 | **BOT-16** Cart sidenav menu                  | SHOULD   | 1d    | —          | CU `86c8cjgj2`                                                                                                                                                                                          |
| 7.11 | **UI-03** Per-tenant color theme              | COULD    | 1d    | —          | If time                                                                                                                                                                                                 |

**Exit criteria:** Legally compliant (banner + pages), Pa11y CI passes, prod deploy works, footer present.

---

## Phase 8 — Post-order management

**Goal:** Self-service order ops. Schema already ready.

**Estimated effort:** ~5 dev-days

| #   | Task                                    | Priority | Est  | Depends on | Notes                                                      |
| --- | --------------------------------------- | -------- | ---- | ---------- | ---------------------------------------------------------- |
| 8.1 | **PST-01a** Cancel order — cycle mode   | SHOULD   | 1.5d | —          |                                                            |
| 8.2 | **PST-01b** Cancel order — 24/7 mode    | SHOULD   | 0.5d | 8.1        |                                                            |
| 8.3 | **PST-02** Modify items in active order | SHOULD   | 3d   | 8.1        | Re-uses cart UI in edit mode. CU `86c9ea1wg` + `86c9dpjmz` |

**Exit criteria:** Members self-service cancel/modify without contacting cooperative.

---

## Phase 9 — Anonymous engagement & registration

**Goal:** Convert visitors → members.

**Estimated effort:** ~4 dev-days

| #   | Task                                           | Priority | Est  | Depends on          | Notes          |
| --- | ---------------------------------------------- | -------- | ---- | ------------------- | -------------- |
| 9.1 | **PRV-06** Membership request form (anonymous) | SHOULD   | 1.5d | —                   |                |
| 9.2 | **PRV-07** Contact form                        | SHOULD   | 1d   | —                   |                |
| 9.3 | **PRV-05b** Registration with pre-auth email   | MUST     | 1.5d | PRV-05a (eco-admin) | CU `86c8cjgha` |

**Exit criteria:** Anonymous visitors have clear paths into membership. INI-02 lands on a real form.

---

## Phase 10 — Marketing & discounts

**Goal:** Conversion levers.

**Estimated effort:** ~4 dev-days

| #    | Task                                 | Priority | Est  | Depends on | Notes |
| ---- | ------------------------------------ | -------- | ---- | ---------- | ----- |
| 10.1 | Schema: `promo_codes` collection     | SHOULD   | 0.5d | —          |       |
| 10.2 | **MKT-01** Volume discounts          | SHOULD   | 1.5d | —          |       |
| 10.3 | **MKT-02** Promo codes at checkout   | SHOULD   | 1.5d | 10.1       |       |
| 10.4 | **MKT-03** Featured / sale highlight | SHOULD   | 0.5d | INI-04     |       |

**Exit criteria:** Tenants can run promotional campaigns without code changes.

---

## Phase 11 — Order statistics (Carlos's request from ClickUp)

**Goal:** Per-order statistics + groundwork for future EST-05.

**Estimated effort:** ~2 dev-days

| #    | Task                                        | Priority | Est | Depends on | Notes                                     |
| ---- | ------------------------------------------- | -------- | --- | ---------- | ----------------------------------------- |
| 11.1 | **EST-06** Per-order statistics calculation | SHOULD   | 2d  | —          | CU `86c9e8zxj` — likely a hook + read API |

**Exit criteria:** Each order has computed stats accessible for future EST-05 dashboards.

---

## ⏸️ Deferred (post-v1 or blocked)

| Task                        | PRD ID          | Reason                                      |
| --------------------------- | --------------- | ------------------------------------------- |
| Social proof / testimonials | INI-07          | COULD — defer until content strategy exists |
| PDF order export            | EST-04          | Blocked on Q-08                             |
| Personal consumption stats  | EST-05          | COULD — needs analytics design              |
| Reactions to reviews        | VAL-03          | Blocked on Q-01                             |
| SMS notification channel    | NOT-06          | Blocked on Q-07                             |
| AI chatbot                  | HLP-01          | Blocked on Q-04 (CU `86c8cjgkk`)            |
| Direct messaging            | HLP-02          | Blocked on Q-05                             |
| Recipe module               | RCT-01..04      | COULD — discovery first                     |
| Return / exchange requests  | PST-03          | COULD                                       |
| Cooperatives research       | MKT-research-01 | Not dev work (CU `86c8hb9ef`)               |
| Coverage badge fix          | META-03         | Low priority (CU `86c8tqjma`)               |
| README format SKILL         | META-04         | Internal tooling (CU `86c8cjgh6`)           |
| Clarify "add tags store"    | Q-15            | CU `86c8cjgj6` — needs clarification        |

---

## 📊 Effort summary

| Phase     | Theme                                |               Days | Cumulative |
| --------- | ------------------------------------ | -----------------: | ---------: |
| 0         | Cleanup, urgent bugs, foundation     |                4.5 |        4.5 |
| 1         | Member completion (#21 epic)         |                 10 |       14.5 |
| 2         | Catalog quick wins + UX polish       |                  4 |       18.5 |
| 3         | Home page (INI)                      |                  9 |       27.5 |
| 4         | Global search (SRC)                  |                  6 |       33.5 |
| 5         | Wishlist + Reviews + Restock         |                  7 |       40.5 |
| 6         | Notification hooks + order lifecycle |                  4 |       44.5 |
| 7         | Legal, a11y, polish, ops             |                  7 |       51.5 |
| 8         | Post-order management                |                  5 |       56.5 |
| 9         | Anonymous engagement                 |                  4 |       60.5 |
| 10        | Marketing & discounts                |                  4 |       64.5 |
| 11        | Order statistics                     |                  2 |       66.5 |
| **Total** | **v1 scope**                         | **~66.5 dev-days** |            |

**With 30% buffer:** ~86 dev-days ≈ 17 working weeks at full-time, or ~8-9 months at half-time.

**Critical path to "all MUSTs done":** Phases 0 + 1 + 2 + 3 + 4 + parts of 5 (BOT-08 Avisa'm) + 6 (NOT-02) + 7 (LGL + a11y + footer + ops) + 9.3 = ~48 dev-days.

---

## 🧭 How to adjust this plan

- **Velocity check after Phase 0–1:** Track actual vs estimate; recalibrate buffer
- **Reorder if priorities shift.** If revenue pressure → Phase 10 earlier. If discoverability → Phase 4 sooner
- **Schema decisions block phases.** Q-13/Q-14 (Phase 5), Q-10 (Phase 7), Q-15 (open) — earlier resolution unblocks parallel work
- **Phase 3 (INI) is the biggest single chunk.** Split into 3A (working homepage) + 3B (polish) if you want intermediate ROI
- **Phases 6 (hooks) and 7 (polish) can run in parallel** with feature phases — isolated work that doesn't compete for same surface area
- **Phase 1 ballooned** from 5 → 10 dev-days after re-incorporating PRV-08/09 + PRV-02c + PRV-04d. This is the natural cost of the #21 epic being complete

---

## 📝 Changelog

| Version | Date       | Notes                                                                                                                                                                                                                                                              |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.6     | 2026-05-30 | **META-02 done** (task 0.3): removed `NOT_REGISTERED` from `users.membershipStatus` (4 values remain). Verified 0 staging records; local PB change → `pb_schema.json` → staging sync on merge. CU `86c9uq8k3`.                                                     |
| 0.4     | 2026-05-23 | Added TECH-02 to Phase 7 as task 7.9 (`libs/shared/*` Angular 21 modernization derived from Jules PRs #1078 + #1073, 1d). Phase 7 grew 7 → 8 dev-days; subsequent rows renumbered. Fixed stale TECH-01 ClickUp ID (`86c8cjghn` → `86c9uq9rf`).                     |
| 0.3     | 2026-05-17 | Added META-05 to Phase 0 as task 0.9 (`/sync-eco-store-tasks` read-only diff command, CU `86c9uwmzf`, 0.5d). Phase 0 grew 4 → 4.5 dev-days; cumulative totals updated.                                                                                             |
| 0.2     | 2026-05-16 | Re-cut after ClickUp audit. Phase 1 expanded with PRV-02c/08/09/04d. New Phase 11 for EST-06. Added BUG-002..005 to Phase 0. SEO-01, OPS-01, UI-04, BOT-16, TECH-01 added to Phase 7. ClickUp IDs cross-referenced throughout. Total grew from ~55 → ~66 dev-days. |
| 0.1     | 2026-05-16 | Initial phased plan derived from TASKS.md v0.3.                                                                                                                                                                                                                    |
