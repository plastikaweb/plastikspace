# Eco Admin — Design review log

> Critique log for the Claude design iterations over [`DESIGN-BRIEF.md`](./DESIGN-BRIEF.md). One entry per round: verdict, findings, and the exact change package sent back to the design tool. Rules that graduate from a review into the system get folded into the brief (§3.11–3.12) — this file is the audit trail.

**Document version:** 0.2.67 · 2026-08-30

---

## Round 1 — 2026-08-11 · Tauler (TA dashboard), v1

**Verdict:** passes the anti-slop test (tinted organic surfaces, Manrope, pill accents, specific Catalan copy — no AI palette/gradients/glass). Strongest asset: the three-zone IA (_Ara mateix_ → _Cicles_ → _Estadístiques_) matches the weekly operator's mental model; the interactive store-status chip in the top bar beats the banner ADSH-06 asked for. Watch the "hero metric grid" pattern if the card row ever grows.

**Key findings:**

1. RGPD chip "7 dies" ambiguous (elapsed vs remaining) — on a statutory clock that's a bug, not a nit. Escalation ladder missing.
2. Cycle countdown contradicted the page date (mock said 2d 14h with ~6d actually left) — derivation rules had to be pinned.
3. Category chart series recycled the **status** palette (orange=warning, grey=neutral as data colors) — semantic collision; the schema's own `product_categories.color` is the fix.
4. Unselected chart bars ≈ primary-100 on white (~1.2:1) — fails WCAG 1.4.11 (3:1 non-text).
5. Scope: the whole "Estadístiques globals" zone + per-cycle chart is **ASTA** (blocked on EST-06) — decision: don't cut the design, cut the build; analytics moved to a dedicated _Estadístiques_ view.
6. Minor: gender-inconsistent copy (socis/sòcies), CONTACT request type missing, SUSPENDED row policy unstated.

**Change package sent (v2):** 8 points — RGPD direction + elapsed-based escalation + page-level critical treatment; pinned derivations (countdown/progress); categorical colors from `product_categories.color` + ≥3:1 bars; Tauler/Estadístiques split; dark + empty states + prefers-contrast; deep-linked rows without nested interactives; unified copy + conditional SUSPENDED; a11y annotations (headings, progressbar wiring, per-chart data-table toggle, aria-live).

**Doc fallout:** REQUIREMENTS 0.3.1 (ADSH operational-only) · DESIGN-BRIEF 0.2.0 (§3.11 categorical dataviz tokens, §3.12 derived-value rules, view 10) · TASKS 0.1.1 (task 2.6 scoped, ASTA row annotated, D.2 dataviz tokens).

---

## Round 2 — 2026-08-12 · Tauler v2 + Estadístiques (new view)

**Verdict: 7.5 / 8 of the round-1 package implemented and verifiable** — several checked arithmetically: ISO week correct (S33 2026 = Aug 10–16), countdown exact (dl. 10 08:00 → dg. 16 22:00 = 158h; 4d 12h left ⇒ 32% elapsed ✓), 1.842,50/23 = 80,11 € ✓, chart table sums to its KPI (24) ✓, "Setmana passada" = 3–9 d'agost ✓. RGPD chip now reads "Queden 7 dies" with elapsed-based escalation (23 elapsed ⇒ critical — red now justified); Contacte row added (badge 5 = 2+1+1+1 ✓); "Taula" accessible toggle implemented and shown open; "total provisional · cicle en curs" is an excellent honesty label. Outstanding from round 1: dark-mode and empty-state **mocks** (specced but not rendered).

**New findings (severity order):**

| #   | Finding                                                                                                                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N1  | "Vendes per cicle" contradicts its own KPI: S33 stacked bar sits below the 1.500 € gridline while the cycle KPI says 1.842,50 €; y-axis ceiling clips the data                                                                               |
| N2  | Category-color robustness missing: `product_categories.color` is tenant-editable free text — series can clash (mock's Fruita/Forn adjacency already borders deutan confusion); needs pairwise-distinguishability guard + tonal fallback ramp |
| N3  | "Selected cycle is highlighted" is unreadable on stacked multicolor bars — needs outline + label, not tone change                                                                                                                            |
| N4  | RGPD critical chip pulse: must respect `prefers-reduced-motion` and pulse on state transition only, not perpetually                                                                                                                          |
| N5  | Trial "3 dies" row uses error red — expiring trial is _warning_; error stays reserved for the statutory clock                                                                                                                                |
| N6  | Estadístiques spec silent on 24/7 tenants — "Per cicle" section must hide; "Per dates" is the only analytics                                                                                                                                 |

### Change package v3 (paste into Claude design)

```text
Round-3 revision — only deltas, both views are close:

1. "Vendes per cicle": series must reconcile with the cycle KPI shown above (S33 stacked
   total = 1.842,50 €) and the y-axis ceiling must cover the max value. Selected cycle:
   highlight with an outline + label on the column (tone change is unreadable on stacked
   multicolor bars).
2. Category colors: add the robustness rule — colors come from product_categories.color
   (tenant-editable), so run a pairwise-distinguishability check (incl. deutan simulation)
   across active series and fall back to a primary-tonal ramp when colors are missing or
   clash. Add a thin surface-colored separator between stack segments.
3. RGPD critical chip: pulse only on state transition and respect prefers-reduced-motion.
4. Trials card: "3 dies" row uses warning tone, not error — error stays reserved for the
   statutory RGPD clock.
5. Estadístiques for 24/7 tenants: hide the whole "Per cicle" section; "Per dates" is the
   only analytics. State it in the view spec.
6. Still owed from round 2: RENDERED dark-mode variants of Tauler + Estadístiques and the
   empty states as actual mocks (at minimum "tenant nou" — it is the onboarding first
   impression), not just spec notes.
```

---

## Round 3 — 2026-08-13 · Full project audit (15 files)

**Scope:** the complete Claude design project — `Eco Admin DS`, `Shell Tauler A`, 9 views (Sol·licituds, Socis, Socis mòbil, Comandes, Cicles, Productes, Categories, Botiga, Estadístiques), 2 dark variants and the `tenant nou` scenario.

**Method:** every file read in full via the `DesignSync` MCP (read-only; note it is available only at the top session level — subagents cannot call it). 55 evidence-backed findings, then submitted to 4 independent verification lenses run in parallel: requirements traceability, PocketBase schema truth, adversarial refutation, and completeness critique. Outcome: **6 findings killed, 12 reframed, 37 confirmed, +47 new** raised by the lenses. Killed and reframed items are listed below so the decision stays auditable.

**Verdict: the system is well built; the defects are coverage and data truth, not aesthetics.** The DS is serious — 15 sections, faithful tokens, all 6 chip families matching the schema enums, and AA contrast verified across 11 chip pairs in both themes (5.05 min, 10.55 max). The v3 package landed in Estadístiques: S33 = 1.842,50 € reconciles with its KPI, the axis uses `nice(max × 1.08)`, stack segments carry 1px separators, the "Taula" toggle and the 24/7 rule are in. Dark and `tenant nou` exist as `<dc-import theme="dark">` / `scenario="tenant nou"` of the same component — round 2's debt is settled. What fails: **9 MUST views undesigned, 7 invented fields that do not exist in PocketBase, and not one error, loading or conflict state in 15 files.**

### Blockers

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | Seven invented fields: `tenants.storeStatus` (real: `closed` + `closedReason`), `tenants.orderCycle` (real: `logisticsConfig.orderWindow`), `pickupEnabled`/`deliveryEnabled` (real: `logisticsConfig.options[]`), `categories.order`, the category "Oculta" state, the product "Actiu/Ocult" state — which also displaces the `inStock` filter APRD-01 requires — and "SKU" |
| B2  | "Edita la cadència" cannot work as drawn: `cycle_cron.pb.js` hardcodes `"59 23 * * 0"`; only the open/close weekday+time inside a fixed 7-day rhythm is editable                                                                                                                                                                                                             |
| B3  | Closing the store silently skips next week's cycle: the cron selects `active = true AND closed = false`                                                                                                                                                                                                                                                                      |
| B4  | After an RGPD erasure the request row keeps the deleted identity (`tenant_requests` holds its own `name`/`email`, `user` is `cascadeDelete=false`); no post-execution mock exists                                                                                                                                                                                            |
| B5  | `orders.user` is nullified and the address scrubbed to `{zip}`, yet Comandes renders a "Sòcia / soci" column on every row with no orphaned-order design                                                                                                                                                                                                                      |
| B6  | The allowlist module (AMBR-04/05 MUST, PRV-05a) does not exist although the DS already defines its chip family; "Importa CSV" opens nothing                                                                                                                                                                                                                                  |
| B7  | `product_categories_stats.totalProducts` counts only in-stock products (`LEFT JOIN … AND p.inStock = TRUE`) and drops categories with zero stock                                                                                                                                                                                                                             |
| B8  | Deleting a `category_groups` row cascades two levels (group → categories → products) across all tenants, unguarded                                                                                                                                                                                                                                                           |
| B9  | The delivered mobile view (Socis) is on neither the brief's nor REQUIREMENTS' mobile list; and the real phone job — marking orders READY/DELIVERED at a pickup point — has no design                                                                                                                                                                                         |

### Undesigned MUST views

APRD-02/03 product form + image manager · AORD-02 order detail · AORD-03 transition confirm · AORD-04 paymentStatus · AMBR-02 member detail · AMBR-04/05 allowlist + CSV stepper · ACYC-02/03 cycle create/edit + manual override · ACFG-06/07 tenant languages + `fiscalDataEnabled` · ACAT-02 `group` field (schema-required) + cascade confirm · ATNT/AGLB the entire Superadmin layer · §2.2 login with PARTNER rejection.

### States, flows, operational reality

No error / 403 / 404 / session-expiry / loading state anywhere · no post-action feedback despite `withPocketBaseCrud` doing optimistic writes · no concurrency story (two volunteers, no realtime, no claim on the inbox → an irreversible deletion can run twice) · confirms never disclose the emails they trigger (AORD-03, ACYC-03 require it) · no print design though the picking list is a printable deliverable and tonal chips vanish in greyscale · nothing organises orders by pickup point / weekday / slot, which is how the work physically happens · no offline handling · no authorship or reason capture for handover between volunteers · the 24/7 tenant has no IA of its own.

### System & accessibility

- **The dataviz palette fails its own robustness rule.** Simulating deuteranopia over `#457b2e / #b3541e / #8a6d00 / #7a4b32 / #3b5f8a / #1f6e63`, 5 of 15 pairs collapse: Fruita↔Ous i làctics 0.020, Verdura↔Ous i làctics 0.044, Verdura↔Fruita 0.057, Verdura↔Forn 0.073, Forn↔Begudes 0.098 (0–1 linear-RGB; the same pairs score 0.207/0.202/0.407/0.186/0.221 in normal vision).
- **The fallback ramp is the default path, not the exception:** `product_categories.color` is optional and no view sets it, so a new tenant renders every series from a ramp the DS names in five words and never draws.
- The critical RGPD chip pulses `infinite` in Sol·licituds while the Shell SPEC promises 3 beats on transition only.
- Requests rows are `div`s with `cursor:pointer` wrapping nested buttons — unreachable by keyboard, and the nesting the DS forbids elsewhere.
- The data-table pattern states no ARIA contract (sort announcement, checkbox name, `aria-haspopup`/`aria-expanded`).
- `html{font-size:15px}` silently rescales the rem-based `--space-*` scale and overrides the reader's browser font-size preference.
- Status icons diverge between DS and Tauler; four gender conventions coexist across the project (a round-1 fix that never propagated past the Tauler).

### Killed after refutation (not sent)

Paginator "1–9 de 9" (mock artifact) · the cross-view S33 dataset divergence as a _contradiction_ — brief §3.12 is an intra-view rule and a sample page is normal practice; only the intra-view defects are sent (a footer summing visible rows labelled "total del cicle"; "Tots · 47" beside "1–8 de 8") · `height` vs `transform` on 8 chart bars (the alternative distorts labels and strokes) · documenting the confirm's top escalation tier for a WON'T-v1 action · the check icon on "Respon per correu" · the WCAG half of the i18n completeness dot (filled/empty is already a non-colour cue).

### Our own doc fixes (not the designer's fault)

1. DESIGN-BRIEF §3.4 is stale — it lists `PAID` in the order-status chip family although AQ-07 made it legacy; the DS chip collision originates there.
2. DESIGN-BRIEF §1 mis-attributes the 44px target to WCAG 2.1 AA (2.5.5 is AAA; the AA criterion is WCAG 2.2's 2.5.8 at 24×24) — it is a house rule.
3. REQUIREMENTS §5.3 B-02 is incomplete: `product_categories.normalizedName` is also globally UNIQUE.
4. New backend fixes to file: indexes on `users(tenant)`, `users(membershipStatus)` and `orders(orderCycle)` — `users` is the only tenant-scoped collection with no tenant index.
5. **Real eco-store bug found in passing:** `orders.tax` has `max: 100` but stores an amount (`tax = totalWithIva − subtotal`), so it breaks above a ~476 € subtotal at 21%; `carts.tax` has no cap. Deserves its own BUG ticket.
6. `tenant_addresses.tenant` is optional with public list/view — the ACFG-08 form must set it explicitly (relates to B-03).

### Change package v4 (paste into Claude design)

```text
Round-4 review — the system is solid; these are coverage and data-truth defects.
Priorities: BLOCKERS first, then the missing MUST views, then system fixes.

== A. BLOCKERS — invented fields and unbuildable models ==
A1. Seven fields in the SPECs do not exist in PocketBase. Rewrite every SPEC that names
    them: tenants.storeStatus → tenants.closed (bool) + tenants.closedReason (i18n JSON);
    tenants.orderCycle → tenants.logisticsConfig.orderWindow {enabled, openDay, openTime,
    closeDay, closeTime}; tenants.pickupEnabled / deliveryEnabled → logisticsConfig.options[]
    {type:'pickup'|'delivery', enabled, cost, tiers, slots, instructions, addressOverride};
    categories.order (no ordering field exists — drop drag-reorder or request a schema field
    explicitly); the category "Oculta" state (no field); the product "Actiu/Ocult" state
    (no field — and it displaces the inStock filter APRD-01 requires); "SKU" (search is over
    normalizedName only).
A2. "Edita la cadència" cannot work as drawn: cycle generation is a hardcoded weekly cron
    ("59 23 * * 0"); only the open/close weekday+time inside that 7-day rhythm is editable.
    Re-scope the control and say so in the UI.
A3. Closing the store skips next week's cycle generation (the cron filters closed=false).
    The close dialog must warn about it.
A4. Botiga's logistics editor is missing delivery COST and TIERS (min→cost thresholds) — a
    coop that charges for delivery cannot be configured today.
A5. Pickup points: tenant_addresses.slots is Record<weekday, TimeRange[]> — many days, many
    ranges. The single day + single range per point cannot express it. Also add per point:
    active, default, location, i18n instructions, province, phone.
A6. tenants.logo: the schema allows png/jpeg/webp/bmp/avif/bpg up to 2.5 MB — NOT SVG, and
    not 512 KB. Fix the hint.
A7. Botiga is missing tenants.shortName (≤12, drives the PWA short_name), province, timezone,
    languages (ACFG-06 MUST) and the fiscalDataEnabled toggle (ACFG-07 MUST). accessModel
    stays OUT — it is GLOBAL_ADMIN-only by design.

== B. RGPD / deletion aftermath — design the state after the flagship flow ==
B1. Executing an erasure deletes the users row but tenant_requests keeps name + email as a
    historical record. Design the post-execution request row: what identity remains visible,
    for how long, and to whom.
B2. orders.user is nullified and the address is scrubbed to { zip }. Vista Comandes renders a
    "Sòcia / soci" column on every row — design the orphaned order row.
B3. The deletion request in the mock literally says "4 comandes actives al cicle" — that is
    the exact 409 in-flight-orders blocker. Design the BLOCKED state: list the blocking
    orders, disable execution, explain the way out. Today it shows an enabled green button.
B4. MEMBERSHIP_TERMINATION is mark-only ("the app only channels the request"): remove the
    "Aprova la baixa" affordance. And the SPEC's word for ACCOUNT_DELETION is wrong — it is a
    hard delete plus a transactional order scrub, not "anonimització".

== C. MISSING MUST VIEWS — please design these ==
C1. Product form (i18n name/description, unitType with its 6 enum values, unitBase,
    price/iva/priceWithIva with auto-compute + override, min/maxQuantity, provider, origin,
    tags, features) + image manager (≤4 images, 5 MB, protected files need tokens).
C2. Order detail: items snapshot, address snapshot, subtotal/shipping/tax/total, status
    timeline; and a home for paymentStatus (UNPAID/PAID/REFUNDED/FAILED — manual bookkeeping,
    there is no gateway).
C3. Member detail: profile, addresses and fiscal profile READ-ONLY, order history, and the
    transition dialog with its mandatory reason field. Add "extend trialEndsAt".
C4. Allowlist module — completely absent today although the DS already defines its chips:
    CRUD over member_allowlist (PENDING/CONSUMED/REVOKED, usedAt, linked user, notes),
    UNIQUE (tenant,email) collision UX, and the CSV stepper instantiated in the Socis tab.
C5. Cycles: create/edit (name, code UNIQUE — surface the collision), and manual state
    override (force open / close / complete) with a consequences confirm.
C6. Categories: the `group` field is REQUIRED by the schema and absent from the view — a
    category cannot be created without it. Add the cascade-delete confirm with a live product
    count, and render global categories (tenant = null) as read-only for a tenant admin.
C7. The whole Superadmin layer (the DS §13 draws its nav but no view exists): Cooperatives
    list, tenant onboarding wizard, TENANT_ADMIN account management, global catalogs.
C8. Login screen with an explicit PARTNER rejection state (REQUIREMENTS §2.2 — members share
    the same credentials as the storefront).

== D. STATES AND FLOWS — nothing exists today ==
D1. Per view: loading, error, 403, 404 / deleted-record, session expiry (the PocketBase token
    is 7 days).
D2. Post-action feedback: success toast, failure recovery, optimistic rollback — the reused
    store (withPocketBaseCrud) already does optimistic writes.
D3. Concurrency: two volunteers, no realtime. Add a last-refreshed indicator, a manual
    refresh, and a stale/conflict warning. The requests inbox needs a claim so an irreversible
    deletion cannot be executed twice.
D4. Every confirm whose action sends email must say so (AORD-03: NOT-02 on status change;
    ACYC-03: NOT-04/05 on cycle open/close).
D5. Render the destructive-confirm at its real worst case: deleting a category cascades to
    its products, and deleting a category GROUP cascades two levels across tenants.

== E. OPERATIONAL REALITY (a volunteer-run coop) ==
E1. Print: the picking list is a printable deliverable and the operation runs on paper.
    Design a print stylesheet — the app background is a tinted #f8faf0 and status is carried
    by tonal chips that vanish in greyscale.
E2. Organise orders the way the work happens: by pickup point, weekday and time slot, not
    only by status. orders carry deliveryMethod / day / time; tenant_addresses carry the slots.
E3. Rethink the mobile scope. The brief asked for dashboard + requests + store open/close;
    what was delivered is Socis, which is on neither list. And the real phone job is marking
    orders READY/DELIVERED while standing at a pickup point during a 3-hour slot — design
    that one first, offline-tolerant (queue + retry + clear pending indicator).
E4. Handover between volunteers: authorship on sensitive actions, the reason captured on
    membership transitions, and somewhere to leave a note on a record.
E5. Give the 24/7 tenant its own IA — today the Tauler's hero is the current cycle.

== F. DATAVIZ AND SYSTEM ==
F1. Your own palette fails your own robustness rule. Simulating deuteranopia over
    #457b2e / #b3541e / #8a6d00 / #7a4b32 / #3b5f8a / #1f6e63, 5 of 15 pairs collapse —
    worst Fruita vs Ous i làctics (0.020 on a 0..1 linear-RGB scale, vs 0.207 in normal
    vision), then Verdura vs Ous i làctics (0.044), Verdura vs Fruita (0.057), Verdura vs
    Forn (0.073), Forn vs Begudes (0.098). Either ship a palette that passes the check, or
    show the fallback ramp engaging.
F2. And the fallback IS the default path: product_categories.color is optional and NO view
    ever sets it, so a new tenant renders 100% of series from a ramp that is named in five
    words and never drawn. Design the multi-series primary tonal ramp, and add the color
    field to the category editor.
F3. The critical RGPD chip pulses forever in Sol·licituds (animation: pulse ... infinite)
    while the Shell SPEC promises 3 beats on transition only. Make the two agree.
F4. Requests rows are divs with cursor:pointer containing nested buttons — not keyboard
    reachable, and the nesting is what the DS forbids elsewhere. Rebuild as a list where the
    row is one target and the actions sit outside it.
F5. The data-table pattern (§3.2) must state its ARIA contract: sorted-column announcement,
    accessible name on the selection checkbox, aria-haspopup/aria-expanded on the status chip
    that opens a menu.
F6. Drop html{font-size:15px}. --space-* is declared in rem, so a 15px root silently rescales
    the whole spacing scale the brief pinned, and it overrides the reader's browser font-size
    preference. Get density from the dense-layer tokens instead (row heights, field heights,
    paddings), which you already defined.
F7. Status icons must match the DS everywhere: En preparació = package_2, A punt =
    order_approve (the Tauler currently uses autorenew and check_circle, and check_circle is
    "Confirmada" in the DS).
F8. Gender convention: round 1 fixed this on the Tauler and it never propagated. Four
    conventions coexist — "socis" (Shell), "Sòcia / soci" (Socis, Comandes), "Sòcies"
    (Cicles), "les sòcies" ×7 (Botiga) — plus "Josep M. Riera · sòcia des de 2019". Pick one
    and sweep every file.
F9. Intra-view number coherence: Comandes' footer sums only the visible rows and calls it
    "total del cicle" (label it "total de la pàgina" or serve a real cycle total); Socis shows
    "Tots · 47" next to a paginator reading "1–8 de 8". Also: the "comandes" metric in charts
    must come from the order count, never be derived from revenue (today round(€/78) yields 24
    where every other view says 23).
F10. i18n editor: the completeness counter's denominator must be the tenant's ACTIVE
    languages (tenants.languages, maxSelect 3), not a hardcoded 3; and an unlabelled dot is a
    weak completeness signal at that size — add a label or a count.
F11. Can the operator filter orders to EXPIRED at all? It is system-set, but it needs to be
    findable.
```

---

## Round 4 — screen-by-screen · 4.1 Sol·licituds (post-v4)

**Applied from v4:** blocked (409) state, MEMBERSHIP_TERMINATION as mark-only ("Marca com a gestionada"), post-execution row ("Executada"), Contacte tab. Good turnaround.

**Is a mixed inbox valid?** Feasible — one collection (`tenant_requests`, four `type` values, created by PRV-08 to unblock PRV-06/07 at once). Valid for the three membership-lifecycle types (decide → mark). **CONTACT is the outlier**: it is a question, not a request; its primary action leaves the app (mailto); and PRV-07 is a public form, so it is the one entry point for anonymous spam — mixed into a legally-timed inbox. → same collection, same view, **two tabs: Sol·licituds | Missatges**.

**Density:** row 1 carries 10 elements and encodes "urgent" four ways (row tint, bold title, red chip, "Blocada" chip). Root cause: four different jobs forced into one row template. → **list triages, detail acts** (no execution of an irreversible action from a list row; only SIGNUP keeps an inline "Aprova"); one status per row (drop "Pendent" in the pending tab, "Blocada" is the button state not a chip); age _or_ deadline; explanatory second lines move to the detail/empty state. Target anatomy: icon · title · one meta line · age-or-deadline · chevron.

**Data realism (verified against hooks/schema):**

| Row                                             | Verdict                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Josep — "4 comandes actives al cicle"           | **Impossible**: `on_create_order.pb.js:36-53` rejects a second order per user per cycle. Realistic block = 1 (open cycle) + maybe 1 (previous PROCESSING). C33-014 is also Rosa Martí's order elsewhere. Missing the real operational choice: wait for cycle close vs cancel the member's order to unblock |
| Marta Vidal — termination with "Queden 14 dies" | **Wrong**: the 30-day art. 12.3 clock is for RGPD rights requests; a statutory termination has no legal clock (AREQ-02 scopes it to ACCOUNT_DELETION). No deadline chip, no warning tint                                                                                                                   |
| Núria — "a la llista blanca · aval: Marta Puig" | **Contradictory**: allowlisted people register directly; the SIGNUP form is only offered to those _not_ on it (TASKS:L256). `aval` is not a field                                                                                                                                                          |
| Oriol — off-list signup                         | Real. But the mock reuses an existing INACTIVE member's name — which surfaces a real missing case: requester email = existing INACTIVE user → reactivation, not signup                                                                                                                                     |
| Rosa — contact about her order                  | Plausible; a member asking about her order is HLP-02 territory rather than the public form                                                                                                                                                                                                                 |
| Carme — "conserva nom i correu 12 mesos"        | **Invented retention policy** — no document sets it; legal decision for Carlos → **AQ-10**                                                                                                                                                                                                                 |

**SPEC errors that would be copied into the build:** "SIGNUP: aprova → whitelist Consumida + soci Actiu" is wrong twice (approval creates the allowlist entry as **PENDING**; the member does not exist yet). "Descarta" on an ACCOUNT_DELETION needs a mandatory reason — a refusal is a legal response within the 30 days.

### Change package — Sol·licituds (paste)

```text
Sol·licituds — round-4 follow-up:
1. Split into two tabs on the same collection: "Sol·licituds" (SIGNUP · MEMBERSHIP_TERMINATION ·
   ACCOUNT_DELETION) and "Missatges" (CONTACT). Public-form spam must not share a lane with a
   statutory clock.
2. Row anatomy: icon · title · one meta line · age (or the deadline chip, ACCOUNT_DELETION only) ·
   chevron. Remove the "Pendent" chip from the pending tab, remove the "Blocada" chip (it is the
   button state, shown in the detail), remove inline execute/discard buttons — the list triages,
   the detail acts (typed confirm lives there). Only SIGNUP keeps an inline "Aprova".
3. Explanatory second lines (statutory note, 409 explanation) move to the detail panel and the
   type's empty state.
4. Data realism: a member has ONE order per cycle (hook-enforced) — the blocked case is 1–2 orders,
   not 4; the blocked detail must offer both exits: "espera al tancament del cicle" or "cancel·la
   les comandes i executa". Remove the deadline chip and warning tint from MEMBERSHIP_TERMINATION.
   Núria cannot be "a la llista blanca" AND requesting signup; drop "aval" (no such field).
5. Add the reactivation case: a SIGNUP whose email matches an existing INACTIVE member — offer
   "Reactiva" instead of the allowlist path.
6. Fix the SPEC: approving a SIGNUP creates a member_allowlist entry as PENDING (CONSUMED only when
   the person registers); no member exists yet. Discarding an ACCOUNT_DELETION requires a reason.
7. The 12-month retention on executed erasure requests is a decision we have not taken — mark it
   "pending decision (AQ-10)" in the mock, do not present it as policy.
8. "Processades" tab: rename to "Historial" and show the resolution chip per row (Processada /
   Descartada / Executada) with processedBy/processedAt.
```

### 4.1b Sol·licituds — second pass (2026-08-16)

**Applied from 4.1: all 8 points** (three tabs incl. Historial · 5-element rows · actions in the detail, only SIGNUP inline · one blocking order + two exits · no clock on terminations · reactivation case · allowlist PENDING in SPEC · mandatory discard reason · AQ-10 marked pending · Historial with resolution chip + processedBy/At). Clean round.

**New findings:**

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                               | Severity                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | **"Espera al tancament del cicle (dg. 22:00)" is wrong logic**: cycle close = OPEN→PROCESSING (`cycle_cron.pb.js:188-202`); the order stays "En preparació" (in-flight). The 409 lifts only when the order becomes DELIVERED (admin action, delivery day) or CANCELLED. Also drawn as a button — clicking does nothing (false affordance)                                                                                             | major                       |
| 2   | Arithmetic: detail "Rebuda 24 de jul." + today 12 Aug = 19 elapsed → 11 remaining, not "Queden 7" (needs 20 Jul)                                                                                                                                                                                                                                                                                                                      | major                       |
| 3   | Action hierarchy inverted: the only enabled primary in the panel is "Cancel·la la comanda i executa la supressió" — the most destructive action in the app, error-filled and prominent — while Execute/Discard sit disabled below                                                                                                                                                                                                     | major                       |
| 4   | Missatges has no **Descarta**: spam cannot be removed; "Respon per correu" (mailto) does not visibly mark PROCESSED. Sidebar badge (6) counts messages incl. spam — separate: badge = Sol·licituds only                                                                                                                                                                                                                               | major                       |
| 5   | Nobody notifies the requester: approving a SIGNUP creates an allowlist entry and nothing else → PENDING forever. The mock already assumes a notification exists ("Descartada · correu inexistent, rebota"). v1 (zero hooks): mailto with prefilled text on approve and on RGPD dismiss (the legal reply must be communicated) → **AREQ-07**                                                                                           | major                       |
| 6   | "Reactiva" inline with no confirm/reason contradicts AMBR-03 (all membership transitions confirm + reason)                                                                                                                                                                                                                                                                                                                            | major                       |
| 7   | Historial: Pere Camps meta "(Pendent)" vs effect "consumida el 30/07" contradict — show live allowlist state; "Alta — adreça no vàlida" loses the identity in the title; accordion here vs side panel in the other tabs (one pattern); no type/date filters                                                                                                                                                                           | minor–major                 |
| 8   | **"Executada" is not a `status` value** (PENDING/PROCESSED/DISMISSED). Fine as a derived label (`type=ACCOUNT_DELETION` + PROCESSED) — DS must document it as such or the builder adds an enum                                                                                                                                                                                                                                        | major                       |
| 9   | "soci #087": `users` has no member number. Real coop concept — decide: schema field or drop → **AQ-11**                                                                                                                                                                                                                                                                                                                               | minor                       |
| 10  | Dev-speak in operator copy: "hard delete", "user → null", "El hook només permet una comanda per soci i cicle" — rewrite in human Catalan                                                                                                                                                                                                                                                                                              | minor                       |
| 11  | Detail lacks the requester's `message`, `membershipStatus`, link to the member record; SPEC text leaked into the spam message body; sub-filter chips lost their counts; still no mobile mock (mandated view)                                                                                                                                                                                                                          | minor                       |
| 12  | **Backend: `users.email` is hidden from a TENANT_ADMIN.** PocketBase auth collections expose `email` only to the owner/superuser unless `emailVisibility = true`, and eco-store never sets it (grep: only in `libs/core/entities/src/pocketbase-user.ts`). Vista Socis' email column is unbuildable as-is; email-based reactivation matching against `users` must be verified. `tenant_requests.email` (own field) is fine → **B-11** | **critical (cross-screen)** |

### Change package — Sol·licituds 4.1b (paste)

```text
Sol·licituds — second pass, only deltas:
1. Blocked state: closing the cycle does NOT unblock (orders stay in-flight until DELIVERED or
   CANCELLED). Replace the "Espera al tancament del cicle" BUTTON with a note: "Es desbloquejarà
   quan la comanda es lliuri (previst dc. 19)". Demote "Cancel·la la comanda i executa" to an
   outlined secondary with a consequences confirm (order cancelled, no payment, member notified).
2. Fix the numbers: "Queden 7 dies" ⇒ received 20 Jul, not 24 Jul.
3. Missatges: add "Descarta" (→ DISMISSED) on every message; after "Respon per correu" show
   "Marca com a respost" (or auto-mark with undo). Sidebar badge counts Sol·licituds only;
   Missatges gets a quiet dot.
4. Requester communication (AREQ-07): on SIGNUP approve, open a prefilled mailto ("Ja et pots
   registrar…") and record it; on RGPD dismiss, prefilled mailto with the reason. No hooks in v1.
5. "Reactiva" opens the AMBR-03 transition dialog (confirm + reason) — not one click.
6. Historial: same side panel as the other tabs (drop the accordion); title keeps the identity,
   reason in the meta; show LIVE allowlist state (Pere Camps is Consumida, not Pendent); add
   type + date-range filters. Document "Executada" as a derived label of PROCESSED for
   ACCOUNT_DELETION, not a status value.
7. Copy: no "hard delete", "user → null", "hook" in operator-facing text. Add the requester's own
   message, membershipStatus and a link to the member record in the detail.
8. "soci #087" is pending decision (AQ-11) — mark it or drop it. Remove SPEC prose from the spam
   message body. Restore counts on the sub-filter chips. Sol·licituds mobile is still owed.
```

### 4.1c Sol·licituds — third pass (2026-08-18)

**Applied from 4.1b: all 8 points** (unblock note instead of button · arithmetic coherent — the mock's "today" is 16 Aug: Josep 27 days elapsed → "Queden 3", delivery dc. 19 · "Anul·la la comanda…" demoted to secondary with consequences · Missatges "Descarta" · "Reactiva…" with ellipsis · Historial as side panel with type + date filters, counts back on chips, "Executada" documented as derived · `message`, `membershipStatus`, member link in the detail · no "hook"/"hard delete" in copy). Clean round.

**Verdict:** the skeleton is right and stays — tabs + list + side panel, _list triages, detail acts_; for this volume nothing beats it (a persistent master-detail or a dense table adds nothing to a 4-row queue). The problems are in the `ACCOUNT_DELETION` flow logic and in loose ends.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Severity |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **No non-destructive reply path on `ACCOUNT_DELETION`.** The blocked panel offers wait / cancel-the-member's-order-and-execute / dismiss (refusal). Art. 12.3 is a _reply_ clock ("information on action taken", extendable), not an _execute-by_ clock — the mock nudges the operator into cancelling a member's order to switch off a red chip. `tenant_requests` (PENDING/PROCESSED/DISMISSED + processedBy/At) has nowhere to record "replied, execution pending" → spec gap, not only mock. Realism cue: Josep requested erasure on 20 Jul and has C33-021 in cycle 33 — he kept ordering after asking to be erased; the detail should say so (talk to the member, don't delete him) | critical |
| 2   | Inline "Conseqüències" confirm violates DS §6 (no typed/checkbox acknowledgment for the most destructive action in the app) and its copy promises two emails ("el d'anul·lació i el de confirmació de la supressió") that nothing sends: NOT-02 is 📋 and the PRV-08 hook spec has no confirmation mail (`TASKS:L234-244`). Same class as 4.1b #5                                                                                                                                                                                                                                                                                                                                         | critical |
| 3   | The unblocked (happy-path) execute state is not in the set; in the blocked state the sticky bar holds only "Descarta" — refusal takes the primary slot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | critical |
| 4   | Historial has no CONTACT rows: dismissed/answered messages vanish, no undo; "Marca com a respost" (AREQ-08) not shown after the mailto                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | major    |
| 5   | Josep's Historial row keeps "josep.riera@… · soci des de 2019" — data that no longer exists after erasure (`users.created`) and inconsistent with Carme's "Executada el 28 de jul. · Marta Puig"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | major    |
| 6   | Dismissing a `SIGNUP` captures no reason (bare button in Robert's panel), yet Historial shows Jordi Fabra «correu inexistent, rebota». AREQ-07 is silent on whether a refused signup is told                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | major    |
| 7   | Dev-speak: "(AMBR-03)", "(B-11)" in Robert's amber callout; "(AQ-10)" as an intentional mock note must be tagged so it isn't built; the page subtitle "La llista tria i prioritza; les accions viuen al detall." is design philosophy, not operator guidance                                                                                                                                                                                                                                                                                                                                                                                                                              | minor    |
| 8   | Tabs and sub-filter chips are the same visual component (outlined pills, active green vs light green) — navigation and refinement with identical shape                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | major    |
| 9   | "Executada" black filled chip is the heaviest element on the page for a _closed_ item; three resolutions, three weights                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | minor    |
| 10  | Typo "Anul·la **la la** comanda…"; the "Es desbloquejarà quan la comanda / es lliuri (previst dc. 19 d'ag.) / o s'anul·li." line renders as three columns                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | minor    |
| 11  | No search; Historial grows unbounded; the detail shows no earlier requests from the same email                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | major    |
| 12  | Row title encodes the type three times (icon + "Sol·licitud d'alta —" prefix + active sub-filter)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | minor    |
| 13  | "Missatges ●" without a count — the quiet-dot rule was for the sidebar badge, not the in-page tab                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | minor    |
| 14  | Carried from earlier rounds, still not drawn: mobile (mandated), empty states (a zero inbox is the _success_ state), post-action feedback + undo, concurrency claim, keyboard semantics of rows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | major    |

### Change package — Sol·licituds 4.1c (paste)

```text
Sol·licituds — tercer pase (4.1c), només deltes:
1. ACCOUNT_DELETION: afegeix "Respon al soci" (mailto prellenat: acusament + data prevista
   d'execució) tant a l'estat bloquejat com al normal; registra la resposta i rebaixa el xip
   a "Resposta enviada · executa després del <data>". Mostra "N comandes des de la sol·licitud".
2. "Anul·la la comanda i executa": diàleg modal amb checkbox de reconeixement (patró DS §6).
   Conseqüències veraces: cap correu automàtic a v1 — l'operadora ho comunica (mailto).
3. Afegeix el mock de l'estat desbloquejat: primària "Executa la supressió" a la barra,
   "Descarta" secundària. A l'estat bloquejat la barra no pot dur només "Descarta".
4. Historial: inclou Missatges (xip propi); una sola anatomia de fila
   "<Resolució> el DD · qui" (Josep ≠ Carme); afegeix cercador. Detall: sol·licituds
   anteriors del mateix correu.
5. Missatges: després de "Respon per correu" → "Marca com a respost" amb desfés.
   Tab amb comptador ("Missatges · 2"); el punt discret és només per al sidebar.
6. Descartar un SIGNUP: diàleg amb motiu opcional + mailto opcional (Historial ja mostra
   motius). Copy: fora "(AMBR-03)", "(B-11)"; "(AQ-10)" marcat com a anotació de mock.
   Subtítol "La llista tria…" fora. Errata "la la"; línia "Es desbloquejarà…" en un paràgraf.
7. Tabs = mat-tab-group, filtres = mat-chip-listbox. Xips de resolució tots tonals.
8. Pendents heretats: mòbil, estats buits (safata a zero = èxit), snackbar + desfés
   post-acció, claim de concurrència, files com a botó/enllaç sense niuar.
```

### 4.1d Sol·licituds — fourth pass (2026-08-18)

**Applied from 4.1c:** tabs vs chips · "Resolts" (ex-Historial) with Missatges, single row anatomy and "Resposta" as derived label · search + paginator · tonal resolution chips · unblocked state (Núria) with "Executa la supressió" primary · "Respon al soci" in blocked and normal · "Des de la sol·licitud: N comandes" · "Anteriors del mateix correu" · typo + layout fixed · AQ-10 marked as mock annotation · Josep panel hierarchy corrected (primary = reply, not cancel).

**Headline:** the design tool **changed the backend on its own** — the Missatges panel reads _"la resposta es desa a la sol·licitud i un hook de PocketBase genera el correu — sense sortir de l'app"_. That contradicts REQUIREMENTS §5.4 (v1 adds zero hooks) and AREQ-07 (mailto in v1), puts dev-speak in operator copy again, and inverts the priority: the _recorded_ in-app reply goes to a contact message (low stakes) while the RGPD acknowledgment — the one reply you legally need on file — stays a `mailto:` with no trace. The direction is right (in-app reply is better UX and yields the audit trail AQ-03 wants), but it is a schema + hook + sender-identity decision, not something a mock can assume. The mock's SPEC blob now diverges from REQUIREMENTS.md: two sources of truth.

| #   | Finding                                                                                                                                                                                                                                                                              | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | In-app reply only for CONTACT; RGPD still mailto. One mechanism (`reply` field + hook) must serve both; if only one, it is the RGPD one                                                                                                                                              | critical |
| 2   | "un hook de PocketBase" in operator copy                                                                                                                                                                                                                                             | major    |
| 3   | Carme's executed panel shows "Correu: <carme.bosch@exemple.cat>" and "Anteriors del mateix correu" — the mock **resolves AQ-10 by default** (identity retention + linkage after erasure). "Sol·licitud d'alta · març 2019" is impossible: the collection is born with PRV-08 in 2026 | major    |
| 4   | Núria: "Rebuda 9 d'ag." + row "fa 9 dies" + "Queden 21" don't reconcile with the mock's today (16 Aug → 7 elapsed, 23 left). Same class as 4.1b #2                                                                                                                                   | major    |
| 5   | Neutral-state RGPD row shows "fa 9 dies" with no deadline indicator — the operator can't tell a legally-timed row from a termination except by icon; DS §5 "normal" is a state of the indicator too                                                                                  | major    |
| 6   | "Respon al soci (acusament + data prevista)" — spec parenthesis in a button label; in Núria's panel (nothing blocks) "data prevista" doesn't apply; no mock of the post-reply chip state nor of where the date comes from                                                            | major    |
| 7   | Sticky bar with three stacked full-width buttons (Núria)                                                                                                                                                                                                                             | minor    |
| 8   | The SPEC itself says "s'esperen centenars de missatges" and adds a paginator — but discarding spam is still panel → button, one by one; no inline "×" nor multi-select                                                                                                               | major    |
| 9   | Paginator defaults to 10 on the **pending** tab: a work queue is not paginated; row 11 disappears (oldest-first mitigates, doesn't solve)                                                                                                                                            | minor    |
| 10  | "Pendents heretats" (mobile, empty states, snackbar+undo, claim, keyboard) carried for three rounds; SIGNUP simple (Oriol) and MEMBERSHIP_TERMINATION (Marta) panels never shown; SIGNUP dismiss dialog "designed" without a mock                                                    | major    |
| 11  | The mock's SPEC block is now a 40-clause paragraph and contradicts REQUIREMENTS                                                                                                                                                                                                      | minor    |
| 12  | Micro: "Sol·licituds ·5" vs "Totes · 5"; "Resposta el 25 de jul." agrees with _sol·licitud_ but the row is a _missatge_                                                                                                                                                              | minor    |

**PB contract — first draft** (fields, rules, indexes, hook, anti-spam, Batch API for "Anul·la i executa") written here and promoted to REQUIREMENTS §5.6; the 409 from `on_delete_user` is the safety net, not the source of the blocked state — the UI queries in-flight orders proactively.

### Change package — Sol·licituds 4.1d (paste)

```text
Sol·licituds — 4.1d, només deltes:
1. Un sol patró "Respon des de l'app" per a CONTACT i ACCOUNT_DELETION (camp reply, mailto
   com a alternativa). Fora "hook de PocketBase" del copy. Mock del xip post-resposta.
2. Files ACCOUNT_DELETION sempre amb "Queden N dies" (neutre <14 · warning · error).
3. Fila executada: correu emmascarat + "Anteriors del mateix correu" ocult fins AQ-10;
   dates realistes (≥ 2026). Núria: Rebuda 7 d'ag.
4. Barra d'accions: primària + secundària, "Descarta" com a text button.
   "Respon al soci" sense parèntesi; diàleg amb text prellenat i data opcional.
5. Missatges: "×" inline (o multiselecció). Safata pendent sense paginador.
6. Dibuixa: mòbil, safata a zero, panell SIGNUP simple, panell MEMBERSHIP_TERMINATION,
   diàleg de descarte SIGNUP, snackbar + desfés. Res més "heretat".
7. SPEC del mock = punters a AREQ-xx; la prosa va a REQUIREMENTS.md.
```

### 4.1e Sol·licituds — fifth pass (2026-08-18)

**Applied from 4.1d:** single reply dialog for CONTACT and RGPD with mailto as fallback · hook copy gone · "Respon al soci" without parenthesis · sticky bar = primary + text button · Núria with neutral "Queden 21 dies" · SPEC reduced to pointers · link to a mobile view (not in the captures) · Carme masked per SPEC (not in the captures).

**Headline:** the reply dialog makes three promises the system cannot keep. (1) The prefilled text says _"T'enviarem la confirmació quan s'hagi executat"_ — nobody sends it: the PRV-08 hook sends no mail, an executed row has no "Respon", and after erasure the requester's email is precisely what AQ-10 wants masked. Fourth time a mock assumes a notification that doesn't exist (4.1b #5, 4.1c #2, 4.1d #1). (2) The "Data prevista d'execució" **goes to the chip, not to the email** (the helper says so literally) — the member gets an acknowledgment without a date. (3) After "Envia la resposta" there is **no lifecycle**: PENDING with a calm chip and nothing signals when the delivery on the 19th makes the erasure executable. The design resolves the legal clock and creates an operational limbo.

| #   | Finding                                                                                                                                                                                                                                                                                                                                  | Severity |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Prefilled reply promises a post-execution confirmation that doesn't exist                                                                                                                                                                                                                                                                | critical |
| 2   | Planned date never reaches the member                                                                                                                                                                                                                                                                                                    | critical |
| 3   | **No post-reply state machine.** Needed: `Queden N` (neutral/warning/error) → `Resposta enviada · bloquejada fins <data>` (neutral) → **`Llesta per executar`** (primary — the "now" cue) → `Data prevista superada` (warning, delivery slipped) → Executada/Descartada. Cross-screen: ADSH-02 must not count replied requests as urgent | critical |
| 4   | Missatges: "Respon" as full-width primary and "Descarta (spam)" as a tiny text button — for a tray the SPEC sizes at hundreds of mostly-spam messages; replying to spam confirms a live inbox; no inline "×" (4.1d #8 not applied); "(spam)" mislabels every non-answered legit message                                                  | major    |
| 5   | Resolts chips: Rosa "Respost", Anna "Resposta"                                                                                                                                                                                                                                                                                           | minor    |
| 6   | Resolts has no recognizable order (avui · 28 jul · 30 jul · 21 jul · 25 jul)                                                                                                                                                                                                                                                             | minor    |
| 7   | Placeholder "Hola! Sí, encara acceptem sòcies noves…" on an SEO-spam dialog — mock artifact that also reveals a real opportunity: reply **templates** for the 3–4 recurring questions                                                                                                                                                    | minor    |
| 8   | Prefilled textarea clips the sign-off "El Llevat"                                                                                                                                                                                                                                                                                        | minor    |
| 9   | Via mailto: is `reply`/`repliedAt` recorded? The dialog says "queda desada" but a mailto cannot confirm sending → save anyway, the operator affirms sending (legal responsibility is theirs)                                                                                                                                             | major    |
| 10  | Still undelivered: SIGNUP simple panel, MEMBERSHIP_TERMINATION panel, SIGNUP dismiss dialog, empty tray, snackbar+undo, 409 conflict state, mobile in the package                                                                                                                                                                        | major    |
| 11  | "Sol·licituds ·5" vs "Totes · 5" — still                                                                                                                                                                                                                                                                                                 | minor    |

**PB deltas:** `plannedExecutionAt` (date, nullable — captured by the dialog, shown by the chip, absent from the SPEC contract) · `updateRule` guards against double resolution/reply · hook: don't send if `email` is masked, template subject/footer per `language`, dialog prefill from client i18n by the same `language`.

### Change package — Sol·licituds 4.1e (paste)

```text
Sol·licituds — 4.1e, només deltes:
1. RGPD: prellenat veraç (data d'execució interpolada; res de "confirmació" si no es
   dissenya); si es vol confirmar l'execució, "Respon" a la fila executada ABANS
   d'emmascarar el correu (decisió AQ-10 explícita).
2. Màquina d'estats del xip RGPD: Queden N → Resposta enviada · bloquejada fins <data>
   → Llesta per executar (primary) → Data prevista superada (warning) → Executada.
   Mock de fila + panell en cada estat. Tauler ADSH-02 no compta les respostes com a urgents.
3. Missatges: "Descarta" outlined al costat de "Respon"; "×" inline; fora "(spam)".
   Placeholder neutre; plantilles com a COULD.
4. Resolts: ordre processedAt desc; xip "Respost" únic.
5. Contracte PB: + plannedExecutionAt; updateRule amb guardes de doble resolució/resposta.
6. Entregar: panell SIGNUP simple, panell MEMBERSHIP_TERMINATION, diàleg descarte SIGNUP,
   safata a zero, snackbar + desfés, conflicte 409, i la vista mòbil dins el paquet.
```

### 4.1f Sol·licituds — sixth pass (2026-08-18)

**Applied from 4.1e:** RGPD state machine complete and visible in the list · "Data superada" panel with "Respon amb la nova data" · Carme masked, no "Respon", AQ-10 decision said aloud in the panel · Resolts sorted, chips consistent, gender agreement (Descartat/Descartada) · Missatges with Respon + Descarta at the same level, "(spam)" gone · templates (COULD, done) · mailto also records · MEMBERSHIP_TERMINATION panel · destructive confirm with checkbox (DS §6) · mock state switcher (7 states). Best round of the series.

**Headline:** the "Anul·lar C33-021 i executar la supressió?" dialog — the one dialog that must be perfect — carries implementation jargon in operator copy (_"Les dues escriptures són una sola transacció (Batch API)"_, _"(v1)"_): the reviewer's PB note leaked verbatim onto the screen. It says _"Cap correu automàtic"_ while the SPEC already defines the reply hook — the mock contradicts itself. Worse: it promises a mailto **after** execute while the SPEC masks the email **on** execute — broken sequence. Second focus: the SPEC says _"reply només si era buit"_ (updateRule guard) and at the same time designs _"Respon amb la nova data"_ — the second send is impossible under that rule. Both would be built wrong as-is.

| #   | Finding                                                                                                                                                                                                                             | Severity |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Destructive dialog: "Batch API", "transacció", "escriptures", "(v1)"; "Cap correu automàtic" contradicts the reply hook; mailto-after-execute vs mask-on-execute                                                                    | critical |
| 2   | PB contract: "reply only if empty" vs re-reply; hook must also fire when only the date changes                                                                                                                                      | critical |
| 3   | Marta (baixa): AREQ-06 asks for an **optional note** — no field. "Marca com a gestionada" correctly doesn't touch `membershipStatus`, but nothing leads to AMBR-03 — the operator will mark and forget to deactivate the member     | major    |
| 4   | Miquel "Data superada": the callout blames "el lliurament s'ha endarrerit", but the panel says "1 comanda nova (C33-011)" — the member **ordered again after** the reply. Two causes, two responses (re-date vs talk to the member) | major    |
| 5   | Miquel: the "Termini" row disappears after replying; a met deadline is what you want visible in an inspection                                                                                                                       | minor    |
| 6   | List: Núria (unreplied, unblocked) is executable now but her chip only says "Queden 21 dies"; with 5 open RGPD rows "what can I execute now?" costs 5 clicks                                                                        | major    |
| 7   | Mock hygiene: Rosa (legit question) now "Descartat", and the "Com fer-se sòcia" template applied to the SEO spam — examples crossed                                                                                                 | minor    |
| 8   | Chip "Resposta enviada · bloquejada fins el 22 d'ag." is long; will wrap on tablet                                                                                                                                                  | minor    |
| 9   | Marta: "Rebuda 31 de jul." without origin; the exit comes from the profile (authenticated), not the public form                                                                                                                     | minor    |
| 10  | Switcher lists 7 states; 2 seen (Panell baixa, Anul·la). Unseen: Panell alta (Oriol), Diàleg descarte alta, Conflicte 409, Snackbar + desfés, Safata a zero, mobile ("descarte" → "descart" in the switcher itself)                 | major    |

**PB deltas:** keep `reply` / `plannedExecutionAt` as the _latest_ reply (overwritable), make **`repliedAt` immutable** = first reply (the one that counts for art. 12.3); relax the guard to allow re-reply only on `ACCOUNT_DELETION`; a full thread → `request_replies` in Layer 3, not now · hook fires on `reply` **or** `plannedExecutionAt` change, includes the date in the body · masking on execute belongs in the PRV-08 `on_delete_user` hook (server-side, same transaction), not a second write from eco-admin · templates v1 = hardcoded i18n in eco-admin by `language`; no `tenants.replyTemplates` until a second cooperative asks · MEMBERSHIP_TERMINATION note → `resolutionNote`, no write on `users` from this flow.

### Change package — Sol·licituds 4.1f (paste)

```text
Sol·licituds — 4.1f, només deltes:
1. Diàleg Anul·la+executa: fora "Batch API/transacció/escriptures/(v1)"; "Si la supressió no
   es pot completar, la comanda no s'anul·la." Comunicació al soci = diàleg de resposta de
   l'app ABANS d'executar (mateix mecanisme que la resta); cap mailto post-execució.
2. Contracte: repliedAt immutable (primera resposta); reply/plannedExecutionAt sobreescrivibles
   només a ACCOUNT_DELETION; hook dispara per reply O plannedExecutionAt.
3. Panell baixa: "Nota (opcional)" → resolutionNote; després de marcar, enllaç
   "Canvia l'estat de la sòcia". Origen "des del perfil".
4. Data superada: callout ramificat (comanda nova vs lliurament endarrerit).
5. Termini es manté després de respondre ("complert el DD"). Meta de fila amb
   "cap comanda en curs / N en curs". Xip "Bloquejada fins el DD".
6. Mock: Rosa resposta, SEO descartat. Lliurar els 5 estats del commutador + mòbil.
```

### 4.1g Sol·licituds — reference-state sheet (2026-08-18) · **final, mock frozen**

**Applied from 4.1f:** all 7 switcher states delivered (Oriol panel, Marta with note, dismiss-signup dialog, RGPD reply with interpolated date and truthful text, 409 conflict "Algú s'hi ha avançat", snackbar + undo, empty tray "Tot al dia!") · mobile complete (cards, bottom sheet, reply sheet, inline "×" on messages, infinite scroll) · row meta with "N comandes en curs" · shortened chip "Bloquejada fins…" · sidebar badge = requests count + quiet dot for messages · Termini kept and origin "des del perfil". Closing round.

**Verdict:** buildable. Further mock rounds return less than they cost; what remains is copy-level plus one mechanism inconsistency. **The mock is frozen at 4.1g** — from here on changes go through REQUIREMENTS.md (v0.4.0 carries the fallout: AREQ-07 rewritten, AREQ-09/10 new, §5.4 amended to one hook, §5.6 `tenant_requests` contract).

| #   | Finding                                                                                                                                                                                                                                                                                                                           | Severity |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | SIGNUP approve/dismiss still open `mailto:` (Oriol panel, dismiss dialog) — the most frequent communication in the module and the only one leaving the app; worse on mobile. Same reply dialog with a "Ja et pots registrar" template; the hook only needs to accept `type = SIGNUP`                                              | major    |
| 2   | Copy: "(AREQ-07)" in Oriol's callout; "(409)" and "les guardes del servidor" in the conflict dialog; "(decisió AQ-10 pendent)" in the reply-dialog helper. Fifth round of the same finding → graduated to a brief rule: no spec IDs, HTTP codes or implementation terms in operator copy; mock annotations only in the SPEC block | major    |
| 3   | Snackbar "Desfés" after approve: the mail is already out (or the client already opened). Undo reverts data, not communication → send only when the undo window closes (write `reply` after the timeout / on dismiss); trivial with hook-based sending, and the only way "Desfés" is honest                                        | major    |
| 4   | Mobile bottom sheet: "Anul·la la comanda i executa…" directly under the primary — fat finger on the irreversible; put it inside the red callout as on desktop, or after a divider                                                                                                                                                 | minor    |
| 5   | Mobile card: "fa 16 dies" wraps; empty state still shows badge "0" and paginator "0–0 de 0"                                                                                                                                                                                                                                       | minor    |
| 6   | "Descartar «Oriol Serra»?" — the request is discarded, not the person; background of the same capture shows Oriol "Processada" with the dismiss dialog open (crossed mock)                                                                                                                                                        | minor    |
| 7   | Marta: helper "fes-ho des de la seva fitxa" is passive — a post-mark snackbar with an "Obre la fitxa" action                                                                                                                                                                                                                      | minor    |
| 8   | Inline "×" only on mobile; desktop still without it although confirm + undo now exist — add it or accept the asymmetry consciously                                                                                                                                                                                                | minor    |

**PB notes for the builder:** (a) the "409" of the conflict dialog is not a 409 — a failed `updateRule` (double-resolution guards) returns **404** in PocketBase; only `on_delete_user` throws 409 for in-flight orders. Treat 404 on `tenant_requests` update as "someone got there first" and refresh; never cite a code in copy. (b) Approving a signup = two writes (create `member_allowlist` + update the request with `reply` → hook sends): allowlist first, request second; if the second fails, the "status only from PENDING" guard allows a retry, and the retry must treat the UNIQUE(tenant,email) collision on the allowlist as idempotent success, not as an error.

### Change package — Sol·licituds 4.1g (paste, final)

```text
Sol·licituds — 4.1g (final):
1. SIGNUP: aprovar/descartar amb el diàleg de resposta de l'app (plantilla "Ja et pots
   registrar"); cap mailto primari enlloc.
2. Copy sense IDs ni codis (Oriol, conflicte, helper AQ-10). Títol "Descartar la sol·licitud d'…".
3. Desfés honest: l'enviament s'executa en tancar-se l'avís.
4. Mòbil: destructiva dins el callout; "fa 16 dies" sense salt; badge 0 i paginador ocults al buit.
```

**Verified against the live mock (DesignSync read of `Vista Sol·licituds.dc.html` + `Vista Sol·licituds (mòbil).dc.html`, 2026-08-18 — source, not captures): all four 4.1g points applied.** SIGNUP approve opens the reply dialog with the "Ja et pots registrar" template and dismiss offers "Envia el motiu com a resposta (des de l'app)"; no `AREQ-07`, `409`, "guardes" or "Batch API" left in operator copy (only in the SPEC block and the mock switcher labels); dismiss title is "Descartar la sol·licitud d'…"; snackbar reads "Resposta desada — s'envia en tancar aquest avís" with undo; mobile keeps the destructive button inside the blocked callout, ages don't wrap, badge and paginator hide on empty; the "Data superada" callout branches by cause ("El soci ha fet una comanda nova… Parla-hi — potser ja no vol la supressió — o respon amb la nova data"). **Closed.** Three build-time notes, not design rounds: (a) the template select label reads "Plantilla (opcional · COULD)" — drop the MoSCoW word; (b) mobile confirms defer the DS §3.6 checkbox and the mandatory RGPD dismiss reason to "el diàleg complet (escriptori)" — the build gets no mobile exemption: checkbox and reason field ship on mobile too; (c) the masked email value carries "AQ-10" as a mock annotation — it must not render.

**Implementation is not a design deliverable:** building the view is AP-1 (TASKS 1.1–1.1c, 1.6, 1.7), gated on AP-0 scaffold and G-01/G-02 (eco-store PRV-05b-A / PRV-08 with the §5.6 contract). No code is written from the mock until those land.

---

## Round 5 — 2026-08-22 · Eco Admin DS (system sheet) audit

**Scope:** `Eco Admin DS.dc.html` (16 sections, badge "v0.1 proposal · 2026-08-10") read as source via DesignSync and cross-checked against `apps/eco-store/src/styles/eco-store-theme.css` (tokens, root 15px per `_base.scss`), `pb_schema.json`, DESIGN-BRIEF 0.2.2, REQUIREMENTS 0.4.0 and the live `Vista Sol·licituds` / `Vista Socis` mocks. Four lenses: internal consistency · omissions vs brief/views · contradictions vs schema/requirements · token/M3 discipline + a11y. Also answers the open question _row detail: side sheet vs modal vs route vs inline vs bottom sheet_ (see "Detail surfaces" below).

**Verdict:** the token work is right. Every chip hex is a real step of `eco-store-theme.css` (success/info/neutral 100/700 · 800/300, warning 100/800 · 950/300, error 100/600 · 800/300); hover/selected match the state-layer formulas (on-surface 8 % → `#ededec`; primary 12 % over lowest → `#252f1f` dark); chip contrasts pass AA (success 5.0 · warning 5.4 · error 7.0 · info 8.8 · neutral 9.1 light, ≥ 7.1 dark, error-fill 6.5); the destructive dialog is truthful against the schema (`products.category.cascadeDelete = true`, orders keep their items snapshot per AORD-02). **The sheet is not wrong — it is stale.** Frozen at v0.1 (08-10) while Sol·licituds went through 4.1a–g: it omits patterns the views already use (side sheet, tabs, snackbar), lacks the derived / post-reply RGPD chips, states two schema-false copy strings (logo limits, CSV contract) and carries ~40 off-scale values (`0.8rem` ×35, radii 6/10px) under a header that says "every token is law".

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                              | Severity |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **Side sheet undefined.** `Vista Sol·licituds` has used a 420px right sheet (scrim, `panelIn`, header icon · title · chip · close, k/v meta, actions) since 4.1; the DS never specifies it — width, Material mapping, focus/Esc, URL state, prev/next, mobile → bottom sheet. The most-used composite in the app is outside the system                                                                                                               | critical |
| 2   | **RGPD chips one lifecycle behind.** §06 lacks the derived labels (`Executada` info, `Respost/Resposta` success, `Descartat` gender) and the post-reply chain of AREQ-09 (`Bloquejada fins <data>` neutral → `Data prevista superada` warning → `Llesta per executar` primary). §07 Stage 0 still says "quiet age text" — the brief (§3.5) requires "Queden N dies" on every `ACCOUNT_DELETION` row                                                  | critical |
| 3   | **Logo copy false vs schema** (§10): "SVG o PNG · màx. 512 KB"; `tenants.logo` accepts png/jpeg/webp/bmp/avif/bpg (no SVG), ≤ 2.5 MB, single file                                                                                                                                                                                                                                                                                                    | critical |
| 4   | §06 SPEC prose says "steps 100/700 light · 800/300 dark" while the §02 token block (and the rendered chips) use warning 100/**800** · **950**/300 and error 100/**600** · 800/300. Prose ≠ tokens; the 950 exception (contrast: warning-800 on warning-300 is 4.2:1) is undocumented                                                                                                                                                                 | major    |
| 5   | `--admin-field-h: 44px` is "default" but no field in the sheet measures 44: filter bar (§05), forms (§10), tenant selector (§12) all use 40 and §10 SPEC says "fields dense 40px". The default token is dead                                                                                                                                                                                                                                         | major    |
| 6   | §03 SPEC "`mat-form-field` density -2 (dense) / -1" does not yield 44/40: Angular Material steps 4px from 56 (-1 = 52, -2 = 48, **-3 = 44, -4 = 40**) — verify in `@angular/material` at D.2, but the numbers as written are wrong                                                                                                                                                                                                                   | major    |
| 7   | Four chip heights (20 mini · 24 status · 28 store-status · 32 filter/legend/language) and three button heights (40 · 36 · 32); only `--admin-chip-h: 24` is tokenized and no `mat-chip`/`mat-button` density level is named. M3 deviations (top bar 56 vs 64, rail 72 vs 80, drawer 256 vs 360, chip 24 vs 32) are legitimate density deltas but undeclared                                                                                          | major    |
| 8   | Nav Tenant Admin (§12) has 8 items — **Estadístiques missing** (brief §3.10; `Vista Socis` nav already has 9). §13 puts the UI-language selector "a la top bar, abans del toggle de tema"; the §12 top-bar anatomy does not show it                                                                                                                                                                                                                  | major    |
| 9   | `--dv-cat-N` tokens announced in the §14 subtitle, absent from the §02 block. D.2 has nothing to copy                                                                                                                                                                                                                                                                                                                                                | major    |
| 10  | **Focus-visible unspecified** anywhere (brief §1 demands visible focus) for the non-Material composites: clickable list rows, chip-menus, sticky cells, language pills, stepper steps                                                                                                                                                                                                                                                                | major    |
| 11  | Patterns the views use and the DS lacks: **snackbar + desfés** (AREQ-08; `snackIn` exists in the view) · **tabs** (3px indicator, badge-in-tab) · **conflict/error states** ("Algú s'hi ha avançat", generic error banner, 403) — only empty/loading exist                                                                                                                                                                                           | major    |
| 12  | CSV stepper (§11) invents a contract: "Columnes: email, nom, cognoms · UTF-8 · màx. 500 files". AMBR-05 only fixes email format + duplicates; `member_allowlist` does not exist yet (G-02). Pin it in REQUIREMENTS or drop it from copy                                                                                                                                                                                                              | major    |
| 13  | Off-scale typography: `0.8rem` ×35, `0.9rem` ×4, `0.7rem` ×1, `1.125rem` ×1 (scale is 0.688 / 0.75 / 0.875 / 1 / 1.375 / 1.5 / 2). Bulk bar, filter chips, paginator, empty state, dashboard-card rows, CSV preview, §13 titles                                                                                                                                                                                                                      | major    |
| 14  | Legibility: at root 15px `0.75rem` = 11.25px and it is the body of chips, meta and ~30 % of table cells. For volunteer operators, body-medium (13.1px) should be the floor for any value cell; 0.75rem stays for true metadata                                                                                                                                                                                                                       | major    |
| 15  | i18n editor (§09): per-tab completeness is a 6px green/orange dot → **colour-only**, against the sheet's own Assumption 4. Two different language switchers in the same section (pill toggle vs toolbar text) and two codes for one language (`CA` in §09, `CAT` in §13)                                                                                                                                                                             | major    |
| 16  | An order row carries `Pendent` (warning) and `No pagada` (warning): two identical yellow chips. Payment family needs its own visual (outlined, leading `€`) — the brief already flagged the PAID duplication                                                                                                                                                                                                                                         | major    |
| 17  | Density toggle lives in every table's toolbar while §13 stores the UI language "a user prefs" — same class of preference, two treatments, divergent state across tables                                                                                                                                                                                                                                                                              | major    |
| 18  | Mobile scope: brief requires Tauler · Sol·licituds · store open/close; the package has `Socis (mòbil)` (not required) and §15 anchors the degradation on it — **no Tauler nor Botiga mobile**                                                                                                                                                                                                                                                        | major    |
| 19  | `--deadline-crit-row` (RGPD token) reused for CSV error rows (§11) — semantic misnomer → `--admin-row-error-bg` / `--admin-row-warn-bg`, RGPD consumes them                                                                                                                                                                                                                                                                                          | minor    |
| 20  | Off-scale radii: 6px ×7 (rich-editor toolbar), 10px ×1 (dashboard-card highlighted row); §03 density demo cards at 12px while §01 fixes "cards 16"                                                                                                                                                                                                                                                                                                   | minor    |
| 21  | Copy: bulk action "Desactiva" vs status chip "Ocult" (same `visibility_off` icon) · "cau al català" is true today (`environment.defaultLanguage = 'ca'`, app-level, not per tenant) but a tenant without `ca` in `languages` falls to "first available" — make the editor require the default language instead of warning                                                                                                                            | minor    |
| 22  | Icon reuse across families: `block` ×2, `pending` ×2, `task_alt` ×2, `error` ×2; `close`/`clear` near-identical for Cancel·lada (error) vs Descartada (neutral), and `close` is also "tanca el panell"                                                                                                                                                                                                                                               | minor    |
| 23  | Row hover does not reach sticky cells (explicit `td` bg) — add "hover/selected propagate to sticky cells" to the §04 SPEC                                                                                                                                                                                                                                                                                                                            | minor    |
| 24  | `prefers-reduced-motion` promised in §04/§07 prose; the sheet has no media query (views do) — the §07 pulsing dot is unguarded in the DS itself                                                                                                                                                                                                                                                                                                      | minor    |
| 25  | Stale chrome: version badge "v0.1 · 2026-08-10 · DESIGN-BRIEF §3" vs §13 "rondes 2–4" and brief 0.2.2; header links only 4 of 20+ views; §13 "Cards del Tauler" card has no sample (empty box); §15 "Carrega'n més (scroll infinit a producció)" names two behaviours; §07 dashboard card/§12 badge predate 4.1g (requests count + quiet dot for Missatges); Superadmin nav lists "Comptes admin" at root (brief: inside tenant context, ATNT-02/04) | minor    |
| 26  | Forward risk: `eco-theme.css` / `fresh-theme.css` carry different `warning`/`error` scales (warning-950 = `#070700`). The admin does not load tenant themes today (ACFG-09 COULD), but the 950 exception turns the dark warning chip black if UI-03 lands — document it                                                                                                                                                                              | minor    |

**Killed after refutation (not sent):** "warning chip colours are not from the theme" — they are, from `eco-store-theme.css` (the tenant files differ, see #26) · "category delete copy overstates" — cascade is real · slogan ≤ 30 matches `tenants.slogan.max` · chip contrasts (all pass).

### Detail surfaces — decision (graduates to DESIGN-BRIEF §3.13)

Today: Sol·licituds → modal side sheet; Socis / Comandes → route page (`Vista Sòcia (detall)`, `Vista Comanda (detall)`); Productes → form route. Three surfaces, no written rule. 4.1c already defended the sheet for Sol·licituds; that stands. The answer is not one surface for everything — it is a rule:

| Surface                | Use when…                                                                                                                              | Here                                    | Why not elsewhere                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Side sheet (modal)** | Triage queue; detail ≤ 1 viewport; ≤ 3 actions; the list must stay visible (RGPD escalation order); "next, next" work; no long forms   | Sol·licituds ✓ (frozen 4.1g)            | Socis/Comandes content (profile + addresses + fiscal + history; items + timeline + printable) does not fit 420px |
| **Route page**         | Entity with identity and history; > 1 viewport; forms with save bar; printable; linked from other modules and the Tauler; bookmarkable | Socis · Comandes · Cicles · Productes ✓ | For a 4–10-item queue navigation loses filters/scroll and the urgency context; one round-trip per item           |
| **Dialog**             | Decisions only: confirm (DS §08), reply, reason                                                                                        | Already so                              | As detail it blocks the list, no prev/next, forces inner scroll                                                  |
| **Inline row expand**  | One read-only tier (items snapshot under an order, CSV error reason). Never actions                                                    | Optional in Comandes / CSV              | Breaks sticky columns + horizontal scroll (1180px tables), shifts the list, variable height, poor keyboard       |
| **Bottom sheet**       | Mobile render of the side sheet (≤ 720)                                                                                                | Already so (4.1g)                       | On desktop wastes width and hides the list                                                                       |
| Persistent split pane  | ≥ 1600 with narrow lists                                                                                                               | No (4.1c)                               | At 1280 the 1180px tables cannot share the viewport; the queue does not justify it                               |

**Side-sheet spec to add as DS §16:** `mat-sidenav position="end" mode="over"` inside the content area (or CDK `Dialog` with slide), 420px / `max-width: calc(100vw − 4rem)`, scrim on-surface 30 % (45 % dark), `surface-container-lowest`, level2, 220ms emphasized-decelerate in (none under reduced-motion); header = icon · title (title-medium) · status chip · close; scrollable body; sticky action footer; **Esc closes, focus trapped and returned to the row, ↑/↓ or "Anterior / Següent" without closing; state in the URL** (`/sol-licituds/:id` as a child route rendering the sheet over the same list — Tauler deep links and reload work); mobile → full-height bottom sheet with the same content. Optional, not priority: ≥ 1440 without scrim (`mode="side"`) to chain items.

### Change package — DS v0.2 (paste into Claude design)

```text
Eco Admin DS — ronda 5 (auditoria de la hoja de sistema). Genera "Eco Admin DS v0.2":
mateix fitxer, mateixes 15 seccions + 2 de noves. Tokens base intocables; tota mida ha de
ser un pas de l'escala (tipus 0.688/0.75/0.875/1/1.375/1.5/2 rem · radis 4/8/12/16/28/pill ·
espai --space-*). Copy d'operador en català sense IDs ni termes d'implementació.

1. Capçalera: badge "v0.2 · 2026-08-22 · DESIGN-BRIEF 0.2.3 · D.1/D.3 tancades"; enllaços a
   totes les vistes del projecte.
2. §02 tokens — completa el bloc: --admin-field-h 40 (escriptori) / --admin-field-h-touch 44
   (mòbil/tablet), amb el nivell de densitat mat-form-field de cadascun; --admin-chip-h 24
   (estat) i 32 (interactiu); alçades de botó 40/36/32 amb la densitat mat-button; renombra
   --deadline-*-row → --admin-row-warn-bg / --admin-row-error-bg (l'RGPD els consumeix);
   afegeix --dv-cat-1..6 + fallback tonal (§14); llista explícita de desviacions M3
   (top bar 56 vs 64, rail 72 vs 80, drawer 256 vs 360, xip 24 vs 32) com a deltes de densitat.
3. §03 SPEC: corregeix els nivells de densitat (44 ≈ -3, 40 ≈ -4; verifica), no -1/-2.
4. §04: el toggle Densa/Còmoda surt de la taula — és preferència d'usuari (menú d'usuari,
   desada com l'idioma). SPEC: hover/seleccionat es propaguen a les cel·les sticky.
   Acció massiva "Oculta" (no "Desactiva") per quadrar amb el xip "Ocult".
5. §06: prosa = tokens (success/info/neutral 100/700·800/300, warning 100/800·950/300,
   error 100/600·800/300; justifica el 950). Afegeix fila "Sol·licitud — derivats":
   Executada (info), Resposta (success), Descartat/Descartada; i fila "RGPD post-resposta":
   Bloquejada fins <data> (neutral) → Data prevista superada (warning) → Llesta per executar
   (primary) → Executada (info). Família Pagament en variant outlined amb glif € al davant
   (mai dos xips warning idèntics a la mateixa fila). Revisa icones duplicades: block ×2,
   pending ×2, task_alt ×2, error ×2, close/clear.
6. §07: Stage 0 (<14 d) = xip neutral "Queden N dies" (mai edat nua); card Tauler i badge
   del sidenav com a 4.1g (recompte de sol·licituds + punt discret per Missatges);
   pulsació amb @media (prefers-reduced-motion) a la pròpia hoja.
7. §09: un sol commutador d'idioma (pill toggle) també al variant ric; completesa per
   pestanya amb glif (check / warning) + text, no punt de color; codi "CA" (no "CAT") arreu;
   el camp de l'idioma per defecte és obligatori (no avís).
8. §10: copy del logotip segons esquema — "PNG, JPEG, WebP o AVIF · màx. 2,5 MB" (sense SVG).
9. §11: treu "email, nom, cognoms · màx. 500 files" fins que REQUIREMENTS ho fixi (deixa
   "Columnes segons la plantilla" + enllaç a la plantilla); files d'error amb
   --admin-row-error-bg.
10. §12: nav TA amb Estadístiques (9 ítems); top bar amb el selector d'idioma abans del
    toggle de tema; nav GA només Cooperatives + Catàlegs globals (comptes dins del context
    de tenant).
11. §13: mostra visual per a "Cards del Tauler" (com les altres tres); títols en title-medium.
12. §15: una sola regla de paginació mòbil (scroll infinit); el mock mòbil de referència
    ha de ser Tauler o Sol·licituds (Socis mòbil no és àmbit); afegeix Botiga obrir/tancar
    mòbil a la llista de comps.
13. NOVA §16 "Superfícies de detall": la taula de decisió (side sheet modal = cues de
    triatge, Sol·licituds · pàgina de ruta = entitats amb identitat/formularis/imprimible,
    Socis/Comandes/Cicles/Productes · diàleg = només decisions · expansió inline = un nivell
    de lectura, mai accions · bottom sheet = render mòbil del sheet) + spec del side sheet:
    420px, scrim on-surface 30 %/45 %, surface-container-lowest, level2, 220 ms, capçalera
    icona·títol·xip·tanca, cos scrollable, peu d'accions sticky, Esc, focus atrapat i
    retornat a la fila, Anterior/Següent, estat a la URL (/sol-licituds/:id), mòbil →
    bottom sheet. Mapeig: mat-sidenav end/over (o CDK Dialog).
14. NOVA §17 "Feedback i focus": focus-visible (2 px primary, offset 2 px, corner del
    component) per a files clicables, xips-menú, cel·les sticky, pills; snackbar + Desfés
    (mat-snack-bar, inferior centrat, 6 s, live region, l'acció s'executa en tancar);
    estat de conflicte "Algú s'hi ha avançat" + Actualitza; banner d'error genèric; 403.
15. Higiene global: elimina 0.8/0.9/0.7/1.125 rem (→ 0.75 o 0.875) i radis 6/10 px
    (→ 8/12); cards de densitat §03 a 16 px; cap valor de cel·la per sota de body-medium
    (0.75 rem només per a metadades).
Entrega: la hoja actualitzada en clar i fosc, SPEC per secció amb el mapeig Material.
```

**Doc fallout:** DESIGN-BRIEF 0.2.3 (§3.1 field density + height inventory + declared M3 deltas, §3.2 sticky state propagation, §3.4 payment family distinct, §3.13 detail surfaces, §3.14 focus & feedback) · REQUIREMENTS 0.4.1 (AMBR-05 import contract marked open, ACFG-04 logo limits from schema) · TASKS 0.1.3 (D.2 scope widened, D.4 apply round-5 package).

---

## Round 6 — 2026-08-22 · Tauler (TA dashboard) v3 — post-split audit

**Scope:** `Shell Tauler A.dc.html` read as source via DesignSync (template L25–241, logic L244–495; scenarios `normal · sense cicle · cap sol·licitud · tenant nou`) and cross-checked against REQUIREMENTS §4.1 (ADSH-01..06) + §4.7 (AREQ-08/09), DESIGN-BRIEF §3.11/§3.12/view 1, the DS sheet (§06 chips, §13 dashboard cards, §14 dataviz), `pb_schema.json`, `eco-store-theme.css` and the real `calculateStoreWindowStatus` derivation. Four lenses: information architecture and ordering · requirements/schema traceability · dataviz method · data realism, copy, a11y and states. Rounds 1–2 fixes were re-verified rather than re-reported.

**Verdict:** the anatomy is right and the arithmetic holds (12/08/2026 is a Wednesday; the order window dl. 10 08:00 → dg. 16 22:00 is 158 h, so 4 d 12 h left and 32 % elapsed are both exact; 23 = 5+8+6+4; 1.842,50/23 = 80,11 €; RGPD 23 elapsed → "Queden 7 dies" and critical ≥ 21). **The problem is scope contamination poisoning the order.** The full-width Socis card puts a 36-month analytics line chart in the second-most prominent slot of a dashboard REQUIREMENTS declares "operational only", and pushes both MUST cards (ADSH-01 cycle, ADSH-03 orders-by-status) into the third zone. The chart itself has no data source in the schema, no y-axis, no table toggle and a sub-3:1 series. Three findings are the same class as Round 3's B1 (invented backend) and Round 1's #4 (sub-3:1 chart marks) — the analytics split moved the view out but let one chart back in through the members card.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Severity |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **The Socis card is analytics inside an operational-only dashboard.** REQUIREMENTS §4.1: "Operational only — analytics (charts, period stats, top sellers) live in a dedicated _Estadístiques_ view"; the mock's own SPEC (L208) repeats it and then specifies a 36-month line chart with a Mesos/Anys toggle and horizontal scroll. Round 1 moved the global-stats zone out for exactly this reason — this puts one chart back in, at full width, in slot 2                                                                                                                                                                                                                                               | critical |
| 2   | **The «Baixes» series cannot be computed from the schema.** The SPEC says "aggregated from `users.created` + membership transitions", but `users` carries only `membershipStatus`, `trialEndsAt`, `created`, `updated` — **no transition timestamp** — and the audit trail is still an open decision (AQ-03). Half the chart plots data that does not exist. Same class as Round 3 B1                                                                                                                                                                                                                                                                                                                      | critical |
| 3   | **The chart's demo data is degenerate and contradicts its own KPIs.** The generator is `av = (m*5 + y*3) % 5` and `(m*5) % 5 = 0` always, so altes depend only on the year: 2023 alternates 4/1, 2024 is flat 2, **2025 is flat 0 (twelve consecutive months with nobody joining)**, 2026 is flat 3. Net 58 − 22 = 36 against the 47 accounts the same card declares (42 actius + 3 prova + 2 inactius). DESIGN-BRIEF §3.12: "chart series must reconcile with the KPIs shown beside them"                                                                                                                                                                                                                 | critical |
| 4   | **The chart breaks the DS dataviz contract.** No y-axis labels, no values, and **no «Taula» toggle** (`grep Taula` = 0 in the Tauler, 2 in the DS/Estadístiques) — the tooltip is the only way to read a value. DESIGN-BRIEF §3.11: "Every chart ships an accessible data-table toggle". The «Baixes» stroke also uses the **inverted** token pair `light-dark(#94998c,#72796b)` where `--mat-sys-outline` is `light-dark(#72796b,#94998c)`: **2.92:1** on the white card, below the 3:1 of WCAG 1.4.11 (correct pair: 4.50:1 light, 6.14:1 dark). With no axis and no table the line _is_ the information, so 1.4.11 applies without argument. The tooltip swatch (L144) is inverted against the line too | critical |
| 5   | **Both MUST cards sit behind two SHOULDs and the chart.** Order today: _Ara mateix_ (ADSH-02 MUST + ADSH-04/05 **SHOULD**) → Socis + chart → _Cicle actual_ (ADSH-01 **MUST**) + _Comandes per estat_ (ADSH-03 **MUST**). It barely fits the 1440×900 preview; at the brief's 1280+ baseline the cards narrow, grow taller and the cycle drops below the fold                                                                                                                                                                                                                                                                                                                                              | critical |
| 6   | **The cycle exists only in `OPEN`.** ADSH-01 asks for the five states. The mock renders "Obert" with a countdown or "Cap cicle actiu" — nothing for **PROCESSING**, which is precisely when 23 orders must be prepared and _Comandes per estat_ becomes the work queue; there the `endsAt` countdown is meaningless and should run to `approxDelivery` (a real `order_cycles` field the view never surfaces). The empty copy also conflates two situations: "El proper cicle encara no s'ha obert, **o** la botiga funciona en mode 24/7"                                                                                                                                                                  | critical |
| 7   | **"Reobertura automàtica" is invented backend — and never renders.** `tenants` has `closed` (bool) + `closedReason` (json) only; no scheduled-reopen field exists. Worse, the mock computes the text (`reopenTxt`, L491) and the template never prints it (the chip reads `closedReasonTxt` only, L50): the operator picks "reobre demà a les 08:00" and the UI never mentions it again. The custom reason is also single-language against an i18n `closedReason`                                                                                                                                                                                                                                          | critical |
| 8   | **Hero and sidebar badge count CONTACT messages.** AREQ-08: "messages never count toward the statutory-clock badge"; round 4.1g froze **badge = requests count + a quiet dot for Missatges**. The mock shows hero `5` = 2+1+1+**1 Contacte** and `['mail', 'Sol·licituds', …, 5]` (L394). The ADSH-02 "llestes per executar" row (replied deletions, excluded from the urgent count) is missing too                                                                                                                                                                                                                                                                                                        | critical |
| 9   | **Orders-by-status bars are scaled to the max, not the total.** Confirmades (8) renders at **100 %**, so the row reads as "all of them"; the real shares are 22 / 35 / 26 / 17 % of 23. It is a part-to-whole rendered as four independent meters                                                                                                                                                                                                                                                                                                                                                                                                                                                          | major    |
| 10  | **Chip icons contradict DS §06 — a Round 3 finding that was never applied.** DS: En preparació = `package_2`, A punt = `order_approve`. The Tauler uses `autorenew` and `check_circle`, the latter **duplicating** Confirmades. Round 3 L239 already named it                                                                                                                                                                                                                                                                                                                                                                                                                                              | major    |
| 11  | **"Proves que caduquen" mislabels its hero:** "3 socis en prova" is the trial total, but the card is trials expiring ≤ 14 days (ADSH-04). They coincide only by accident here (3 and 3); with 10 trials and 3 expiring the hero would lie. It also duplicates the "En prova 3" row of the Socis card                                                                                                                                                                                                                                                                                                                                                                                                       | major    |
| 12  | **Order states are inconsistent with an open cycle:** 6 "En preparació" and 4 "A punt" while the ordering window is still open at 32 % elapsed. In the weekly model preparation starts at close (PROCESSING)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | major    |
| 13  | **The most operational facts of the week are absent:** delivery day (`order_cycles.approxDelivery`), **unpaid orders** (`orders.paymentStatus = UNPAID` — there is no gateway, so chasing payment is manual operator work) and the picking-list shortcut (AORD-06). These are numbers and links, not charts                                                                                                                                                                                                                                                                                                                                                                                                | major    |
| 14  | **ADSH-06 asks for a banner; closed state is a 28px grey chip in the top bar.** A closed store means zero orders — the costliest state in the system is the least visible one. The chip is right while open (Round 1 praised it); closed deserves the banner the requirement names                                                                                                                                                                                                                                                                                                                                                                                                                         | major    |
| 15  | **Design annotation in operator copy:** "estat present — no depèn de cap filtre" explains the absence of a filter this page does not have. Brief §1 rule, graduated in 4.1g: annotations live in the SPEC block only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | major    |
| 16  | **No overflow policy:** the alert cards show exactly three rows with no "+N més", no stated sort, and only the oldest RGPD clock — nothing specifies what happens with two simultaneous deletion requests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | major    |
| 17  | Gender: the close dialog says "Les **sòcies** veuran la botiga tancada" against «socis» everywhere else in the same view (Round 3 F8, still unpropagated)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | minor    |
| 18  | Dead code: `PP.cur` still carries the v1 values Round 2 corrected in the template (`'2 d 14 h'`, `'11–17 d'agost'`, `dg. 17`), plus ~150 lines of Estadístiques machinery (`BW`, `TOPS`, `mkGroups`, `DEFS`, `CAL`, `gShortcuts`) with no binding in the template — the analytics split is visual, not structural, in this file                                                                                                                                                                                                                                                                                                                                                                            | minor    |
| 19  | Off-scale values (inherits Round 5 #13/#20): `0.8rem` ×22, `2.25rem` ×5, `1.125rem` ×2, plus `0.563rem`, `0.625rem`, `0.85rem`; radii 10px and 6px. X-axis labels at `0.563rem` ≈ 8.4px with a 15px root                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | minor    |
| 20  | "Bon dia" is fixed at any hour; the board carries no "actualitzat fa X" marker although its data is live                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | minor    |

**Killed after refutation (not sent):** `#558dd5` is a real token (`--info-400`, `eco-store-theme.css:85`) — only its fixed value across both themes, where every neighbouring bar uses a `light-dark()` pair, is worth a note · the orders-by-status bars at `#fc8803` (2.42:1) do **not** fail 1.4.11 — the count sits in text beside them, so the bar is redundant · the countdown/date contradiction of Round 1 #2 is fixed and verified.

### Does the dashboard need a chart?

One goes, one is re-formed, none is added.

| Chart                      | Verdict                 | Why                                                                                                                                                                            |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 36-month altes/baixes line | **Out** → Estadístiques | Analytics (§4.1), no data source, degenerate demo data, no axis or table, sub-3:1 series                                                                                       |
| "Comandes per estat"       | **Re-form**             | It is part-to-whole over 23 → one stacked bar with the four segments and counts as direct labels (≤ 6 segments, status colour + icon + label). Minimum fix: scale to the total |
| Cycle progress             | **Keep**                | Correct form — a ratio against a limit is a meter; already wired to `role="progressbar"`                                                                                       |
| Anything new               | **No**                  | What is missing (delivery day, unpaid orders, picking list) is figures and links. A weekly operational board for a 42-member coop needs no more chart surface                  |

### Target order

```text
[banner botiga tancada]      ← only when closed/cancelled (ADSH-06)
Row 1 · Aquesta setmana      [ Cicle actual  2fr ][ Comandes per estat  1fr ]
Row 2 · Requereix atenció    [ Sol·licituds ][ Proves que caduquen ][ Estoc ]
Row 3 · Context              [ Socis — compact stat card ]
```

Cycle and orders are one subject and the two most-consulted MUSTs — together and first. Sol·licituds drops to row 2 **without losing urgency**: it already owns the attention mechanism designed for it (error-container emphasis, filled red chip, transition pulse), so it does not need the first slot to be seen. All three MUSTs then fit above the fold at 1280×800. Keeping "Ara mateix" first is defensible; what is not negotiable is that nothing analytical sits between the alerts and the cycle.

### Change package — Tauler v3 (paste into Claude design)

```text
Tauler — ronda 6. Genera "Shell Tauler A v3". El tauler és NOMÉS operativa:
tota anàlisi viu a Estadístiques. Tokens i escales del DS, copy d'operador en català
sense anotacions de disseny.

1. Fora el gràfic de 36 mesos (altes/baixes) del Tauler → mou-lo a Estadístiques com a
   secció "Socis". Socis passa a stat card compacta amb la mateixa anatomia que les
   altres (icona + títol, hero "42 actius", files En prova / Inactius / Llista blanca /
   Suspesos només si >0, footer "Tots els socis →").
2. Reordena en tres files:
   fila 1 "Aquesta setmana": [Cicle actual 2fr][Comandes per estat 1fr]
   fila 2 "Requereix atenció": [Sol·licituds][Proves que caduquen][Estoc]
   fila 3: [Socis compacta]
   Els tres MUST (cicle, comandes per estat, sol·licituds) han de cabre sense scroll
   a 1280×800.
3. Cicle en tres estats, no un: (a) OBERT — l'actual; (b) EN PREPARACIÓ / COMPLETAT —
   xip corresponent, hero "Lliurament previst dc. 19 · falten 2 d" (approxDelivery),
   barra = comandes lliurades/total, i "Comandes per estat" com a llista de treball;
   (c) sense cicle — separa els dos casos: "Proper cicle: obre dl. 17 a les 08:00"
   (des de logisticsConfig.orderWindow) i, per a tenants 24/7, un tauler sense zona
   de cicle. Afegeix sempre el dia de lliurament previst a la card.
4. "Comandes per estat": una sola barra apilada del total (23) amb els 4 segments i el
   recompte com a etiqueta directa — no quatre barres escalades al màxim (avui
   Confirmades = 8 pinta 100%). Afegeix una fila "Sense pagar · N" (paymentStatus
   UNPAID) i un enllaç "Llista de preparació →".
5. Icones segons DS §06: En preparació = package_2, A punt = order_approve
   (avui autorenew i check_circle, i check_circle es repeteix amb Confirmades).
6. Sol·licituds: el hero i el badge del sidenav compten només sol·licituds (4), amb
   punt discret per a Missatges — els missatges de contacte no entren al rellotge
   estatutari. Afegeix la fila "Llestes per executar · N" (supressions ja respostes).
   Defineix el desbordament: màxim 3 files + "+N més", ordre declarat, i què passa amb
   dues supressions RGPD alhora.
7. Botiga tancada: banner a dalt de tot amb el motiu i accés a Botiga (el xip
   interactiu es queda per a l'estat obert). Modela també fora de finestra de comandes
   i tancament del superusuari. Treu "Reobertura automàtica" del diàleg de tancament
   (no existeix al backend) o marca-la com a proposta pendent al SPEC; el motiu
   personalitzat ha de ser multiidioma com closedReason.
8. "Proves que caduquen": el hero ha de comptar les proves que caduquen (≤14 dies),
   no totes les proves; treu la duplicitat amb la fila "En prova" de Socis.
9. Copy: fora "estat present — no depèn de cap filtre" (anotació de disseny);
   "socis" també al diàleg de tancament (avui "Les sòcies veuran…"); salutació segons
   l'hora o neutra; afegeix "actualitzat fa X".
10. Higiene: elimina els valors morts de la v1 ('2 d 14 h', '11-17 d'agost', 'dg. 17')
    i la maquinària d'Estadístiques que no es pinta; mides a l'escala del DS
    (fora 0.8/0.85/0.563/0.625/1.125/2.25 rem, radis 10/6 px); si es manté algun
    gràfic, línia i eixos amb el parell de token correcte
    (outline = light-dark(#72796b,#94998c), avui invertit i a 2,92:1).
Entrega: clar i fosc, i els escenaris tancada · cicle en preparació · sense sol·licituds
· tenant nou.
```

**Doc fallout:** REQUIREMENTS 0.4.2 (ADSH-01 cycle states + `approxDelivery`; ADSH-02 CONTACT excluded from hero/badge + "llestes per executar"; ADSH-03 part-to-whole + unpaid; ADSH-06 banner-when-closed and the six window states; ACFG-01 no scheduled reopen + i18n custom reason; new B-12 membership-transition timestamp) · DESIGN-BRIEF 0.2.4 (view 1: no analytics chart on the Tauler, cycle-state renders, orders-by-status form) · TASKS 0.1.4 (2.6 constraints, new D.5).

---

## Round 7 — 2026-08-22 · Tauler v3 verification

**Scope:** `Shell Tauler A v3.dc.html` read as source via DesignSync (template L25–281, logic L283–491; 6 scenarios × 5 store states) against the Round 6 change package, plus the project's file graph.

**Verdict: 10/10 of the round-6 package applied and verifiable in the source — the best round of the series.** The chart and its machinery are gone (`polyline` = 0, `socMonths` = 0); the three-row order is in place; the cycle ships **five** renders where the package asked for three (OPEN · PROCESSING · proper cicle · 24/7 · tenant nou); orders-by-status is a real part-to-whole (`role="img"` with a complete `aria-label`, in-segment number only when the share fits ≥ 13 %, DS §06 icons `package_2`/`order_approve`); the requests hero and the sidenav badge count 4 requests with the hollow dot for messages and a "Llestes per executar" row; the close dialog lost its scheduled reopen and gained a per-language reason with CA required and an explicit fallback hint; and the hygiene sweep is total — **zero** off-scale type sizes, zero off-scale radii, zero hardcoded colours outside `light-dark()`, zero dead v1 values. Cross-scenario arithmetic holds: 9+14 = 23 (39 % + 61 %), `proc` 4+7+12 = 23 with the bar at 12/23 = 52.2 % ≈ `cyPct 52`, 24/7 3+2+1 = 6 = "6 comandes obertes"; carrying the same 23 orders from OPEN into PROCESSING is a continuity detail the package never asked for.

What follows is what the rebuild left open — and one modelling hole it exposed rather than created.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Severity |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **Two cycles coexist Monday→Wednesday and the board models one.** The `cicle en preparació` scenario sets today to **dl. 17** with S33 "tancat · en preparació" and delivery dc. 19, while `nxTxt` declares the window "dl. 08:00 → dg. 22:00" — so **S34 opened that same Monday at 08:00** and the chip reads "Oberta · tanca dg. 22:00". On one screen: a zone titled "Aquesta setmana" describing a closed S33 and a store chip announcing an open week 34. ADSH-01 says "Current cycle card", singular; the overlap is ~3 days **every week**, not an edge case. Not a mock bug — a spec gap the rebuild surfaced | critical |
| 2   | **The store chip does not know the 24/7 scenario.** `BOT['oberta'].txt` is the fixed string `'Oberta · tanca dg. 22:00'`; with `orderWindow` disabled there is no closing time, and the zone right below says "venda contínua · sense finestra setmanal". The closed banner has the same defect: "El cicle continua igualment fins a dg. 16, 22:00" is hardcoded regardless of scenario                                                                                                                                                                                                                                | major    |
| 3   | **The RGPD clock does not move with the scenario.** `rgpdElapsed = 23` sits outside the scenario branches, but `proc` moves today +5 days (dc. 12 → dl. 17): it should read 28 elapsed → "Queden 2 dies", still critical. Both scenarios show "Queden 7 dies". Same family as the date arithmetic caught in rounds 1–2                                                                                                                                                                                                                                                                                                 | major    |
| 4   | **"No pagada · 11" never says what it is 11 of.** It hangs inside the status block, separated only by a `border-top`, next to a bar totalling 23 — an orthogonal axis (`paymentStatus`) that reads as a fourth status, inviting 9+14+11. Label it "11 de 23 sense pagar" or give it a `Pagament` sub-heading                                                                                                                                                                                                                                                                                                           | major    |
| 5   | **Row 3 collapses without the SPEC block.** The SPEC takes `grid-column: span 2`; strip it for the real app and Socis sits alone at 1/3 with two thirds empty. The round-6 package under-specified this row                                                                                                                                                                                                                                                                                                                                                                                                            | minor    |
| 6   | **Branches specified but never drawn:** `reqOverflow: false` (the "+N més"), `hasSusp: false` (Suspesos row), and the two-live-RGPD-clocks case the SPEC describes in prose. Same class as the Round 3 "specced, not drawn" findings                                                                                                                                                                                                                                                                                                                                                                                   | minor    |
| 7   | Shares do not sum to 100 in `proc` (17 + 30 + 52 = 99) — a part-to-whole needs largest-remainder rounding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | minor    |
| 8   | "Llestes per executar" uses the success pair; AREQ-09 assigns **primary** to that derived state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | minor    |
| 9   | `greetH = 9` is a constant — correct for a deterministic mock, but the SPEC claims "greeting derived from the hour"; the build must actually derive it                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | minor    |

### Project housekeeping — the fork

The rebuild landed in a **new file**, `Shell Tauler A v3.dc.html`; the original `Shell Tauler A.dc.html` survives untouched, chart and all. Both wrappers still import the old one:

- `Tauler (mode fosc).dc.html` → `<dc-import name="Shell Tauler A" theme="dark">` → **renders the old design in dark**
- `Tauler (tenant nou).dc.html` → same import → the old dashboard

So the project has **no dark render of v3**, a tenant-nou wrapper showing the superseded board, and two sources of truth for one view — exactly what Round 3 penalised elsewhere in the package. Fix before anything else: overwrite `Shell Tauler A.dc.html` with the v3 content (keeping the name) and drop the v3 file, or repoint both wrappers at `Shell Tauler A v3`. One source.

### Change package — Tauler v3.1 (paste into Claude design)

```text
Tauler v3 — ronda 7. Correccions sobre "Shell Tauler A v3" (el paquet de la ronda 6
està aplicat sencer; això són els serrells).

0. PRIMER, intendència: el rebuild ha anat a un fitxer nou i el vell segueix viu.
   Deixa una sola font: aboca el v3 sobre "Shell Tauler A" (mateix nom) i esborra el
   v3, o repunta "Tauler (mode fosc)" i "Tauler (tenant nou)" cap al v3. Ara mateix
   els dos wrappers importen el disseny antic, així que no hi ha render fosc del v3.
1. Dos cicles alhora (dl → dc). Amb finestra dl. 08:00 → dg. 22:00, el dilluns
   conviuen el cicle que es prepara (S33, lliurament dc. 19) i el que ja rep comandes
   (S34). Ara la zona parla només de S33 mentre el xip diu "Oberta · tanca dg. 22:00":
   dues setmanes diferents a la mateixa pantalla. Dibuixa la zona amb DOS blocs quan
   se solapin — «Rep comandes · S34» (compte enrere al tancament) i «En preparació ·
   S33» (compte enrere al lliurament, barra preparades/total, comandes per estat com
   a llista de treball) — i decideix quin mana visualment. Escenari nou: "solapament".
2. El xip de botiga i el bàner han de derivar el text de l'estat real:
   - 24/7 (sense finestra): "Oberta" sense hora de tancament.
   - Bàner de tancada: la frase del cicle només si hi ha cicle viu.
   Avui totes dues cadenes són fixes.
3. Rellotge RGPD lligat a la data de l'escenari: si "cicle en preparació" mou l'avui
   a dl. 17, són 28 dies transcorreguts → "Queden 2 dies" (segueix crític), no 7.
4. "No pagada": digues de què és — "11 de 23 sense pagar" (o sub-encapçalament
   "Pagament"). Ara sembla un quart estat i convida a sumar 9+14+11.
5. Fila 3: sense el bloc SPEC, Socis es queda sola a 1/3 amb dos terços buits.
   Resol-ho: Socis dins la fila 2 (graella de 4) o una fila 3 amb dues cards.
6. Dibuixa el que ja està especificat però no es veu: "+N més" amb més de 3 files
   urgents, fila "Suspesos", i el cas de dues supressions RGPD vives (la fila mostra
   el recompte i el xip, el més urgent).
7. Percentatges de la barra amb resta major: han de sumar 100 (ara "en preparació"
   fa 17+30+52 = 99).
8. "Llestes per executar" en to primary (AREQ-09), no success.
Entrega: clar i fosc del mateix fitxer, i els escenaris solapament · 24/7 · tancada.
```

**Doc fallout:** REQUIREMENTS 0.4.3 (ADSH-01 gains the overlapping-cycles rule, ADSH-06 the derived chip/banner copy, new **AQ-13** on which cycle is "current") · TASKS 0.1.5 (new D.6, AQ-13 in the open-decisions line).

---

### 7.1 Tauler — verification (2026-08-22) · **final, mock frozen**

**Verified against the live source** (DesignSync read of `Shell Tauler A.dc.html`, not captures): **all nine round-7 points applied**, de-fork included. The project is back to one Tauler file under its canonical name, with five scenario wrappers (`mode fosc · solapament · 24-7 · botiga tancada · tenant nou`) — `Tauler (mode fosc)` now imports the current design, so a dark render finally exists.

| Point                  | Evidence in source                                                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 de-fork              | `Shell Tauler A v3.dc.html` gone; canonical file relabelled "Tauler — operativa"; 5 wrappers                                                                                 |
| 1 overlapping cycles   | `overlap = sce === 'solapament'`, chip «⇄ Dos cicles actius», `winClose` shifts to dg. 23, S34 as a low-emphasis strip. Arithmetic: dg. 23 22:00 − dl. 17 10:00 = 6 d 12 h ✓ |
| 2 derived chip/banner  | `openTxt = c247 ? 'Oberta' : 'Oberta · tanca ' + winCloseShort`                                                                                                              |
| 3 RGPD tracks the date | `clock(monday ? 28 : 23)` → the Monday board reads «Queden 2 dies» ✓                                                                                                         |
| 4 unpaid labelled      | `ordUnpaidTxt: unpaid + ' de ' + ordTotal + ' sense pagar'` under its own `PAGAMENT` sub-head                                                                                |
| 5 no orphan row        | row 2 is `grid-template-columns:1.15fr 1fr 1fr 1fr` — Socis joins the attention row                                                                                          |
| 6 undrawn branches     | new `cua saturada` scenario drives `reqOverflow: reqMore > 0`, `hasSusp: busy`, and «Data prevista superada · 1» as its own urgent row                                       |
| 7 largest remainder    | `floor` + gap distributed by descending fractional part → 17 + 31 + 52 = **100** ✓                                                                                           |
| 8 primary tone         | «Llestes per executar» on `light-dark(#356a1f,#9ad67d)` with `play_circle` — a queued action, not a success                                                                  |

**Improvement we did not ask for, better than what we asked for:** the bar dropped its in-segment numerals. The SPEC reasons it correctly — with no text over the fills, they only have to clear 3:1 (WCAG 1.4.11) instead of 4.5:1 for text, so one colour pair per status survives both card surfaces and both themes. Round 7 had settled for an in-segment label when the share reached 13 %; this is cleaner.

| #   | Residual finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | **AQ-13 was decided by the design tool, not by Carlos.** REQUIREMENTS §9 proposed "show both, the **open** one leads"; the mock leads with the **preparing** cycle and argues it in the SPEC — _"preparation leads — it is the work of the day; S34 is a low-emphasis strip because it only accumulates"_. **The mock is right and the proposal was wrong**: on Monday the job is 23 orders to prepare for Wednesday delivery, while S34 holds 3 orders that need nothing until Sunday. AQ-13's recorded proposal is flipped to match (§9); the decision itself stays Carlos's | major    |
| 2   | **«Aquesta setmana» heads a cycle from last week.** Under overlap today is dl. 17 (week 34) and the leading card is **S33 · 10–16 d'agost**. The subtitle rescues the meaning, the h2 does not. → «Cicles actius» or «La feina d'avui»                                                                                                                                                                                                                                                                                                                                         | major    |
| 3   | **The window close time is stated in two formats one screen apart.** `winCloseShort = 'dg. 22:00'` is a constant feeding the chip; `winClose = 'dg. 23, 22:00'` is derived and feeds the strip. Pick one form                                                                                                                                                                                                                                                                                                                                                                  | minor    |
| 4   | **The props allow incoherent pairs** — 8 scenarios × 5 store states, and several combinations do not exist (`cicle en preparació` without overlap, which the SPEC defines as "a tenant whose next window has not opened", plus `botiga: oberta` yields "Oberta · tanca dg. 22:00" with no cycle receiving orders). Mock affordance, not design                                                                                                                                                                                                                                 | minor    |
| 5   | **Row 2 still stretches: ~145 px of dead space in three cards.** `align-items: stretch` with footers pinned by `margin-top:auto` grows the gap with the tallest card (Sol·licituds, now six rows). Better than `align-items:start`: let Proves/Estoc/Socis show five rows when the space exists — useful data instead of emptiness                                                                                                                                                                                                                                             | minor    |

### Change package — Tauler 7.1 (paste into Claude design, final)

```text
Tauler — 7.1 (tancament). Quatre retocs sobre "Shell Tauler A":
1. En solapament el títol de la zona no pot ser «Aquesta setmana»: la card principal
   és S33 (10–16), que és la setmana passada. Usa «Cicles actius» (o «La feina d'avui»).
2. Una sola forma per a l'hora de tancament: el xip diu «tanca dg. 22:00» i la franja
   de S34 diu «tanca dg. 23, 22:00». Deriva les dues del mateix valor.
3. Fila 2: hi ha ~145 px buits a Proves, Estoc i Socis perquè Sol·licituds és més
   alta. Deixa que aquestes tres mostrin 5 files quan hi hagi espai (millor que
   estirar-les buides).
4. El switcher hauria d'acotar les combinacions que existeixen: «cicle en preparació»
   sense solapament no pot conviure amb «botiga oberta».
```

**Frozen.** Further Tauler changes go through REQUIREMENTS.md, as with Sol·licituds at 4.1g. Building the view is AP-2 task 2.6, gated on AP-0 and on AQ-13 for the two-block hierarchy.

---

## Round 8 — 2026-08-22 · Socis (members + allowlist)

**Scope:** `Vista Socis.dc.html` read as source via DesignSync (template L25–238, logic L241–378) covering four states: members table, allowlist tab, add-to-allowlist dialog and the CSV stepper. Cross-checked against REQUIREMENTS §4.6 (AMBR-01..08), the `users` schema, the DS (§04 table, §06 chips, §11 stepper, §17 feedback & focus), the frozen Tauler v3.1, and the prior rounds' member findings (round 1 #6, round 3 F8/B9, round 4.1b #6, round 4.1d).

**Verdict: the allowlist tab is the best-specified artefact in the project; the members tab carries a hard numeric contradiction and re-opens two findings previous rounds had closed.** The allowlist SPEC diagnoses **B-11 on its own**, cites the migration that proves it (`pb_migrations/1777053549_updated_users.js` — "listRule dóna accés al TA però el camp email no viatja"), scopes the blast radius correctly ("la pestanya Llista blanca no en depèn"), and proposes a schema whose three UI states are **derived, not stored** (`Pendent` = neither `usedAt` nor `revoked`). That is better engineering than the requirement it implements. The members tab, by contrast, paginates 8 rows under a chip that claims 47, and lets an operator suspend a member in one click with no confirm and no reason.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Severity |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **Counts, rows and paginator describe three different datasets.** Filter chips are constants (`nAct = 42, nPro = 3, nIn = 2`, L289) while the table renders real data (`DATA` = 8 rows, `total: filtered.length`, L318) and the "1–8" of the paginator is fixed text (L117). Members tab: chip «Tots · 47» · 8 rows · «1–8 de 8». Allowlist tab: chip «Pendents · 12» · 5 rows · «1–8 de 18». Filtering to «Actius · 42» renders the literally impossible «1–8 de 4». With «Files per pàgina: 25» and 8 rows the paginator should not render at all | critical |
| 2   | **Cross-view contradiction with the frozen Tauler.** Round 6 #11 forced the Tauler to split «3 caduquen en ≤ 14 dies» from «5 en prova», and its SPEC delegates the second figure here verbatim: _"not all trials (5 — that figure lives in the Socis card)"_. This view sets `nPro = 3` and its three trial rows are exactly the three expiring ones. The number the frozen mock delegates to Socis does not exist in Socis                                                                                                                        | critical |
| 3   | **Membership transitions bypass confirm + reason — AMBR-03 breached.** AMBR-03 is explicit: _"Confirm + reason"_. The chip menu writes state directly (L286: `pick: … setState({ ov: { …s.ov, [r.name]: o[0] } })`) — no dialog, no reason, no undo, and **«Suspès» is one click away** (it cuts the member's access to the store). This is round 4.1b #6 («Reactiva inline with no confirm/reason contradicts AMBR-03») resurfacing in another view. Two paths for one action, too: the chip menu and the row menu's "marca suspès"                | critical |
| 4   | **The «Alta» column has no schema field and its dates are impossible.** `users` carries `id, password, tokenKey, email, emailVisibility, verified, name, avatar, tenant, normalizedName, role, phone, membershipStatus, trialEndsAt, created, updated, language` — **no `memberSince`**. `created` is an autodate, so "Marta Puig · 03/2016" cannot exist in a collection born in 2026. Same class as round 4.1d. Either the column is `created` (and the fixture dates move to 2026) or a field is needed → **B-13**                               | major    |
| 5   | **Núria Solé joined in 2021 and consumed an invitation in 2026.** The member row is `since: '05/2021'` with 96 orders; the allowlist row is `{ email: 'nuria.sole@gmail.com', st: 'consumida', used: '05/08 · Núria Solé' }`. A five-year member does not consume a whitelist invitation this August. (Pere Camps is coherent: joined 07/2026, consumed 30/07 ✓)                                                                                                                                                                                    | major    |
| 6   | **The trial-expiry column AMBR-01 requires was folded into the status chip.** AMBR-01 asks for a _"trial-expiry column (TRL-09)"_ — a column. The design puts it inside the chip («Prova · 3 dies») and varies the chip colour by urgency (L271: `stC = r.days < 5 ? chip.warning : chip.info`), so the Estat column shows two colours for one state and the DS §06 membership family gains an undocumented "state + urgency" modifier. Restore the column (sortable) or document the modifier                                                      | major    |
| 7   | **SUSPENDED cannot be filtered and is never drawn.** Four states in the machine, three filter chips; a suspended member is reachable only through «Tots». `stMap.suspes → chip.error` exists in code and no row uses it. Round 1 #6 already recorded "SUSPENDED row policy unstated". The `verified` filter AMBR-01 requires is absent entirely                                                                                                                                                                                                     | major    |
| 8   | **Both header actions belong to the other tab.** With «Sòcies i socis» active the header offers «Importa CSV» and «Afegeix a la llista blanca» — both operate on the allowlist. The page's primary action does nothing for the tab in view                                                                                                                                                                                                                                                                                                          | major    |
| 9   | **«Comandes» and «Darrer cicle» are aggregates with no declared source.** Both need `orders` aggregated per user (count, and max `orderCycle`); PocketBase cannot aggregate in a list query, so this is either a view collection or N+1 per page. B-09 only adds the index. → **B-14**                                                                                                                                                                                                                                                              | major    |
| 10  | **A third CSV contract.** DS §11 says "email, nom, cognoms · màx. 500 files"; this dialog says "email (obligatòria), nom, notes · UTF-8 · màx. 1.000 files"; AMBR-05 has it marked **open** with a ≤500 proposal. Round 5 #12 asked to remove the invented contract until REQUIREMENTS pinned it; a third variant appeared instead. Pinned now in AMBR-05 — DS §11 must follow                                                                                                                                                                      | major    |
| 11  | The header subtitle repeats the filter chips exactly, 60 px above them; the chips are actionable, the subtitle is not                                                                                                                                                                                                                                                                                                                                                                                                                               | minor    |
| 12  | Fourth gender convention: column «Sòcia / soci», tab «Sòcies i socis», nav «Socis», Tauler «socis» (round 3 F8, still open)                                                                                                                                                                                                                                                                                                                                                                                                                         | minor    |
| 13  | The bulk bar only exports, duplicating the «Exporta CSV» button already in the filter row — give the selection real actions or drop the 44 px checkbox column                                                                                                                                                                                                                                                                                                                                                                                       | minor    |
| 14  | **No empty states at all**: no "cap soci encara" (new tenant), no "cap resultat" for the search, no empty allowlist — which is the initial state of **every** tenant. The Tauler ships 8 scenarios; this view ships none                                                                                                                                                                                                                                                                                                                            | minor    |
| 15  | Only two columns sort. «Comandes» and «Darrer cicle» — the ones an operator actually sorts by to find who stopped buying — do not                                                                                                                                                                                                                                                                                                                                                                                                                   | minor    |

### Accessibility — and why it is a project finding, not a view finding

**Zero ARIA in the whole view**: 0 `aria-*`, 0 `role=`, 0 `scope=`, 0 `aria-hidden`.

| Element                | Defect                                                                                                                             | Fix                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Sortable header        | `<span cursor:pointer>` inside the `<th>` — not focusable, no `aria-sort`                                                          | `<button>` + `aria-sort`             |
| Row / header checkbox  | icon button with **no accessible name** — a screen reader announces "button"                                                       | `aria-label="Selecciona Marta Puig"` |
| Status chip            | opens a menu with no `aria-haspopup` / `aria-expanded`; the menu is not `role="menu"`, ignores Esc and arrows, never returns focus | real Material menu                   |
| `⋮` row button         | no name **and no `onClick`** (L109) — described in the SPEC, never wired                                                           | name + menu                          |
| Paginator arrows       | `<span>` with `cursor:pointer` — outside the tab order entirely                                                                    | `<button>` with names                |
| «Files per pàgina: 25» | looks like a select, is a span                                                                                                     | `mat-select`                         |
| Avatar initials        | read before the name → "M P Marta Puig"                                                                                            | `aria-hidden="true"`                 |
| Both dialogs           | no `role="dialog"`, no `aria-modal`, no focus trap, no Esc                                                                         | `mat-dialog` pattern                 |
| Filter chips           | buttons without `aria-pressed`                                                                                                     | expose state                         |
| Revoke / delete        | adjacent destructive icons, `title` only, ~28 px real target (house rule ≥ 44), no DS §08 confirm                                  | visible label or menu + confirm      |

`Vista Sol·licituds` measures 0 ARIA too; only the Tauler is instrumented (9 `aria-*`, 5 `role=`) — precisely because rounds 1, 6 and 7 demanded it. **Accessibility in this project exists only where a review asked for it by hand.** The fix is not to patch this view: it is to write the table a11y contract into DESIGN-BRIEF §3.14 (the section round 5 opened) and hold every list to it.

### What works

- The allowlist SPEC **diagnoses B-11 unprompted**, cites the migration proving it, and scopes what is and is not affected — the best technical reasoning the tool has produced in eight rounds.
- Three UI states **derived rather than stored**, cleaner than the enum AMBR-04 implies.
- "Una fila Consumida no es pot eliminar" with a disabled icon and its tooltip: referential integrity expressed in the UI.
- The add dialog parses live, detects duplicates against the list, and gates the button until something valid exists; the CSV stepper separates _vàlides / duplicades / no vàlides_ and states that duplicates are skipped without error.
- Pere Camps reconciles across tabs (joined 07/2026 ↔ consumed 30/07).

### Change package — Socis v2 (paste into Claude design)

```text
Socis — ronda 8. Dues pestanyes en un sol fitxer; la de Llista blanca està molt bé i
gairebé no es toca. El gruix és a «Sòcies i socis».

1. Una sola font de dades: els xips de filtre, les files i el paginador han de sortir
   del mateix conjunt. Avui el xip diu «Tots · 47», la taula pinta 8 files i el
   paginador diu «1–8 de 8» (i filtrant per Actius diria «1–8 de 4»). Si hi ha menys
   files que la mida de pàgina, el paginador no es dibuixa. Mateix problema a la
   Llista blanca (xip 12 · 5 files · «1–8 de 18»).
2. Canviar l'estat d'un soci ha de passar per diàleg amb motiu obligatori (patró DS §08):
   cap escriptura directa des del xip. Deixa UN sol camí (el menú de fila o el xip, no
   tots dos). «Suspès» mai a un clic.
3. Quadra amb el Tauler, que està congelat: 5 en prova en total i 3 que caduquen en
   ≤14 dies. Recupera la columna «Caduca» (ordenable) i treu la variació de color del
   xip: un estat, un color.
4. Filtres que falten: «Suspesos» i «Verificats». I dibuixa almenys una fila suspesa.
5. Dades coherents: la columna «Alta» surt de la data de creació del compte, així que
   no pot dir 2016 en una col·lecció que neix el 2026 — mou les dates a 2026. I la
   Núria no pot ser sòcia des del 2021 i consumir una invitació el 05/08/2026: o és
   sòcia antiga, o va consumir la invitació.
6. Les accions «Importa CSV» i «Afegeix a la llista blanca» pertanyen a la pestanya
   Llista blanca — mou-les allà (o canvia-les segons la pestanya activa).
7. Accessibilitat de taula (contracte nou, DESIGN-BRIEF §3.14) — avui la vista no té
   cap atribut ARIA: capçalera ordenable com a botó amb aria-sort · caselles amb nom
   («Selecciona Marta Puig», «Selecciona-ho tot») · xip d'estat amb aria-haspopup i
   aria-expanded, menú amb teclat (fletxes, Esc) i retorn de focus · botó ⋮ amb nom i
   menú real (ara no té ni acció) · paginació amb botons, no spans · inicials de
   l'avatar aria-hidden · els dos diàlegs amb role=dialog, aria-modal, Esc i trampa de
   focus · xips de filtre amb aria-pressed · revocar i eliminar amb etiqueta visible,
   àrea ≥44px i confirmació.
8. Estats buits: cap soci encara (tenant nou) · cap resultat per a la cerca · llista
   blanca buida — aquest últim és l'estat inicial de qualsevol cooperativa nova.
9. Contracte del CSV, un de sol a tot el projecte: email (obligatòria), nom, notes ·
   UTF-8 · màx. 1.000 files. Actualitza també el DS §11, que encara diu «cognoms» i 500.
10. Neteja: el subtítol de la capçalera repeteix els xips — deixa-hi només el que no
    hi és (llista blanca) · «socis» com a única forma (avui «Sòcia / soci» i «Sòcies i
    socis») · la barra de selecció només exporta i duplica el botó del filtre: dona-li
    accions reals o treu la columna de selecció · fes ordenables «Comandes» i «Darrer
    cicle».
Entrega: clar i fosc, i els estats buits com a escenaris del switcher.
```

**Doc fallout:** REQUIREMENTS 0.4.5 (AMBR-01 trial-expiry column + missing filters, AMBR-03 no inline state writes, AMBR-04 derived states recorded, **AMBR-05 CSV contract pinned**, new **B-13** `memberSince` and **B-14** member aggregates) · DESIGN-BRIEF 0.2.5 (§3.14 gains the table a11y contract) · TASKS 0.1.7 (new D.7).

---

### 8.1 Socis — verification of v3 (2026-08-22)

**Method:** `Vista Socis.dc.html` v3 read as source via DesignSync (813 lines; template L25–350, logic L352–813; 4 scenarios) and put through four independent lenses — data coherence, schema/requirements truth, deep accessibility, UX/IA/copy — then synthesised; every critical finding below was re-verified by hand against the source, `pb_schema.json`, `apps/eco-store/CLAUDE.md` and the eco-store libs before being recorded.

**Verdict: all ten round-8 points applied, several applied well — and a new class of defect has arrived with the new dialogs.** Verified correct in source: one data source when no search is active (50 / 42·5·2·1·47 / «1–25 de 50»); `trBlocked = !S.reason.trim()` makes the reason genuinely mandatory and puts «Suspèn» four steps away; the three trial rows are exactly the frozen Tauler's Laia 3 · Pere 9 · Anna 13; the 8 consumed allowlist rows map one-to-one onto the 8 accounts created after the 12/02/2026 census migration, each invitation 1–3 days before its account; no date precedes 2026; 28 = 24+3+1 in the CSV review; 21 = 12+8+1 across tabs and matches the Tauler's «12 pendents»; the §3.14 table contract is implemented end to end (v2 had zero ARIA). What v3 added on top is **copy that promises what the backend cannot do and schema jargon in operator text** — the exact pattern closed in rounds 4.1c/4.1e/4.1f — plus five functional defects that did not exist in v2.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Severity |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **The transition dialog promises three things the backend does not do.** «La prova caduca sola: … el compte passa a Inactiu» (L620) — false: nothing changes the status (`apps/eco-store/CLAUDE.md` L210 "status stays TRIAL until manually converted"; no cron, no hook — only `orders.createRule` stops an expired trial from buying). «Motiu (obligatori — queda al registre)» (L246), «Queda a la fitxa … qui ho ha fet i quan» (L627) and the toast «motiu registrat» (L641) — there is **nowhere to store it**: §5.5 says member transitions have no authorship trail, AQ-03 is open, and the view's own SPEC admits it (L164). The SPEC and the visible copy contradict each other | critical |
| 2   | **«Deixa d'accedir a la botiga» is false from the schema.** `users.authRule = ""` — an INACTIVE or SUSPENDED member logs in and browses; only `orders.createRule` (ACTIVE, or TRIAL with `trialEndsAt > @now`) blocks buying (L610). «La botiga li dirà que el compte està suspès» (L607) promises a storefront screen eco-store does not have — a real need, but an **eco-store** requirement, not something eco-admin can promise today                                                                                                                                                                                                                                                 | critical |
| 3   | **Copy regression, new in v3:** «(AREQ-06)» (L613) and «trialEndsAt passa del…» (L617) in operator-facing text against brief §1; «sòcia de ple dret» (L624) against the «socis» rule (round 3 F8). None of the three strings exists in v2                                                                                                                                                                                                                                                                                                                                                                                                                                                 | critical |
| 4   | **Filter chips ignore the search.** `cnt = k => MEM.filter(m => eff(m) === k).length` (L464) and `nVer` (L466) do not apply `inQ`; `list` (L474) does. In the declared «cerca sense resultats» scenario the bar reads «Tots · 50 · Actius · 42 …» above «Cap resultat», and clicking «Actius · 42» returns zero because the click does not clear the search — the very thing AMBR-01 was amended to forbid in round 8                                                                                                                                                                                                                                                                     | critical |
| 5   | **Bulk action on a mixed selection names an operation it does not perform.** `bulkOpts` (L711) is a fixed list of three that ignores the state machine the row respects; «Activa» on Prova + Actiu opens «Reactiva 2 socis?» (L621–627, `from = 'divers'`) when for the trial it **converts** (the irreversible half) and for the active one it does nothing — and the toast counts 2 transitions                                                                                                                                                                                                                                                                                         | critical |
| 6   | **«Exporta CSV» promises an email no hook sends.** `exportAll` toasts «rebràs el CSV per correu» (L683); §5.4 allows exactly one hook in v1 (`on_request_reply`). Renders in «tenant nou» as «0 files». Inherited from v2 — round 8 missed it. With B-11 open the email column is not even exportable by a TENANT_ADMIN                                                                                                                                                                                                                                                                                                                                                                   | critical |
| 7   | **The mandatory «Motiu» field has no accessible name and focus falls to `<body>`.** The `<textarea>` (L246) carries only a `placeholder` — its sibling in the add dialog has `aria-label` (L331), so it is an omission, not a pattern. `openTr` (L491) stores the `role=menuitem` as trigger and unmounts it in the same `setState`, so `back()`'s `isConnected` guard (L381) always fails and focus drops to `<body>` on confirm and on cancel — in the screen's central flow; §3.14 requires return to the trigger                                                                                                                                                                      | critical |
| 8   | **Nothing writes `users.trialEndsAt`.** `cadOf = addD(m.alta, 30 + extra)` (L461) and the SPEC's «trialEndsAt = alta + 30 dies» present a convention as a rule. In the repo: the field is an optional date with no `onCreate`; `register()` does not set it; no hook in `pb_hooks/` mentions it; `convertTrialToActive` nulls it. Without a writer the «Caduca» column, the «En prova» filter and the Tauler's ADSH-04 hero have no source → **B-15**                                                                                                                                                                                                                                     | major    |
| 9   | **Sorting by «Comandes» / «Darrer cicle» kills B-14's plan B.** `KEY = { com, cic }` (L471) with sortable headers (L116–117); an N+1 per page can only sort what it already fetched, so over a server-paginated table (50 rows, page 25) the order would be wrong. Round 8 turned `member_stats` from an option into a condition without saying so → B-14 hardened                                                                                                                                                                                                                                                                                                                        | major    |
| 10  | **`sc-if showPager` wraps the page-size selector too** (L148–151): with 50 members and `ps = 50`, `showPager` is false and the only control that would return to 25 disappears — and since the total never exceeds 50, it never comes back. The allowlist tab has no footer at all (0 `wlPager`/`wlRange`) although the SPEC (L224) claims a conditional one — exactly the kind of claim the next round would take as verified                                                                                                                                                                                                                                                            | major    |
| 11  | **CSV step 3 announces the import before it happens.** «24 adreces afegides com a Pendent» (L310) in the past tense, but the write is in `csvDone` (L796), fired by «Fet»; step 3 has no «Cancel·la», so Esc → `closeCsv` discards without writing. The operator reads the success screen, presses Esc, and loses 24 addresses believing them saved. The three toast numbers are hand-coded                                                                                                                                                                                                                                                                                               | major    |
| 12  | Selection survives pagination and `toggleAll` (L702) **replaces** instead of merging (row `toggle`, L510, merges); 25 selected on page 1 → page 2 shows «25 seleccionats» with nothing checked; «Selecciona-ho tot» only marks the page; the transition dialog lists 6 names (`trNames`, L752)                                                                                                                                                                                                                                                                                                                                                                                            | major    |
| 13  | «Caduca» opens **descending** on first click (`sortCol`, L537) and the 45 «—» carry sentinel `9999` (L471): page 1 is entirely dashes, the 5 trials land on page 2. The urgency tint fires under **5** days (`cadSt`, L512) while the Tauler marks ≤ 14 — of the three Tauler-urgent trials only Laia looks urgent here                                                                                                                                                                                                                                                                                                                                                                   | major    |
| 14  | Fixture: **20 rows carry «Setmana 33»**; the frozen Tauler says «18 socis han comprat». And with the store open, zero of the 50 members has bought in the open week while the Tauler already counts 3 orders in week 34                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | major    |
| 15  | A11y remainder: the CSV stepper's `csvNext`/`csvBack` unmount the focused button and `dlgRef` returns early (L359) → **the focus trap stops existing** mid-wizard; `role="tablist"` with no `tabpanel`, `aria-controls` or arrow keys; the three `role="menu"`s contain free-text `<div>`s (and in the ⋮ that text is the only explanation of where state is changed — unreachable in menu mode); the only results `aria-live` (`rangeTxt`, L151) lives **inside** `showPager` and vanishes precisely when the result is small (WCAG 4.1.3)                                                                                                                                               | major    |
| 16  | No sticky columns: `min-width:1180px` (L107) inside ~941px at the 1280 baseline — «Estat» and ⋮, the only path to change state, start off-screen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | major    |
| 17  | «Restaura» is the only state action without a confirm (L742 vs `revoke` L741), and with `revoked` boolean a restored row is indistinguishable from one never revoked — the delete dialog's «sense perdre l'historial» (L761) is not true under this contract → `revokedAt` in §5.7                                                                                                                                                                                                                                                                                                                                                                                                        | minor    |
| 18  | The chip carries the primary action and the ⋮ carries a paragraph explaining why it does not («L'estat es canvia des del xip d'estat…», L133, repeated per row) — compensatory copy. Resolve together with the sticky columns, not before                                                                                                                                                                                                                                                                                                                                                                                                                                                 | minor    |
| 19  | Six mutually exclusive filters exposed as six independent toggles (`aria-pressed` + a visual separator promising a second combinable axis that `S.filter` does not have) — the brief should distinguish toggle chips from single-select chips                                                                                                                                                                                                                                                                                                                                                                                                                                             | minor    |
| 20  | «Alta» renamed in spirit but not in label: 42 of 50 share the migration date 12/02/2026 and the explanation lives only in the SPEC; the screen-reader `caption` says «ordenats per data d'alta» (L692). → «Compte creat», sort by «Soci» by default while `created` is the only date; B-13 stays open                                                                                                                                                                                                                                                                                                                                                                                     | minor    |

**What v3 got right and the review should protect:** the fixture is arithmetically honest (26 weeks since the 12/02 migration, max 26 orders); the states are derived; the add dialog parses live and gates; the §3.14 contract is real; 17/08/2026 is now the load-bearing "today" in two files and v3 picked the consistent reading (the frozen Tauler's card says week 33 closes «dg. 16» in the future while Laia's «3 dies» implies 17/08 — any unfreezing of the Tauler corrects the card, not the trial days).

### Change package — Socis 8.1 (paste into Claude design)

```text
Socis — 8.1. El paquet de la ronda 8 està aplicat sencer. Això són correccions sobre
el que s'hi ha afegit, ordenades per cost.

COPY (cinc cadenes, zero risc)
1. Diàleg de transició: la prova NO caduca sola — «En arribar la data, la persona deixa
   de poder fer comandes però continua com a En prova fins que la converteixis o
   l'ampliïs». Treu «el compte passa a Inactiu».
2. Mentre no hi hagi registre d'autoria: «Motiu (obligatori)» i prou — fora «queda al
   registre», «Queda a la fitxa … qui ho ha fet i quan» i el toast «motiu registrat».
3. Inactiu/Suspès: «No podrà fer comandes; podrà entrar i consultar el seu historial».
   Fora «deixa d'accedir a la botiga» i «la botiga li dirà que el compte està suspès».
4. Fora la jerga: «La baixa de soci es tramita fora de l'app» (sense AREQ-06) · «La prova
   passa del 20/08 al 19/09 — 30 dies més» (sense trialEndsAt) · «soci de ple dret»
   (no «sòcia»).
5. Exporta CSV: descàrrega directa — «S'ha descarregat socis-2026-08-17.csv». Cap correu.
   Amaga el botó quan no hi ha socis.

ESTRUCTURAL
6. Els xips de filtre compten dins de la consulta activa (cerca inclosa). Si hi ha cerca,
   mostra-la com a token eliminable a la barra de filtres i que un clic en un xip la
   netegi — o bé compta només el que la cerca deixa.
7. Acció en bloc: agrupa la selecció per estat abans d'obrir el diàleg. Ofereix només les
   transicions legals per a TOTA la selecció; si n'hi ha de mixtes, títol neutre i
   desglossament («3 proves passaran a actives · 2 ja són actives i no canviaran») i el
   toast compta només les que canvien.
8. Camp «Motiu»: nom accessible («Motiu del canvi d'estat — obligatori»), aria-required,
   i el peu com a aria-describedby. Retorn de focus: no sobreescriguis el disparador amb
   l'ítem del menú que desmuntes — torna el focus al xip o al ⋮, que sobreviuen.
9. Peu de taula: que el condicional amagui només els botons de pàgina; «Files per pàgina»
   i el rang sempre visibles amb files. El mateix peu a la Llista blanca (avui no en té,
   i el SPEC diu que sí).
10. Assistent CSV: la importació s'executa en passar de 2 a 3 («Importa 24 adreces»
    escriu), «Fet» només tanca. Recompte del pas 3 derivat, no escrit a mà.
11. Selecció: neteja-la en paginar/ordenar/canviar mida (o «25 seleccionats · 0 en
    aquesta pàgina»); «Selecciona-ho tot» fusiona i es diu «Selecciona les 25 files
    d'aquesta pàgina»; el diàleg llista tots els noms o «i N més».
12. «Caduca»: obre ascendent; els «—» fora de l'ordre en tots dos sentits; urgència a
    ≤14 dies (segon esglaó <5 si vols graduar). «Darrer cicle» igual amb els «—».
13. Columnes «Estat» i ⋮ fixes a la dreta (a 1280 queden fora de pantalla).
14. Regió viva de resultats sempre muntada: «N socis · filtre X · ordenat per Y» + recompte
    de selecció; el stepper CSV ha de mantenir la trampa de focus entre passos (focus al
    títol del pas); tablist complet (tabpanel, aria-controls, fletxes) o dues subrutes
    amb aria-current; els menús sense <div> de text (la nota del ⋮ passa a
    aria-describedby).

FIXTURE I MENORS
15. «Setmana 33» a 18 files (el Tauler diu 18); dues o tres files a «Setmana 34».
16. «Alta» → «Compte creat»; ordre per defecte «Soci» ascendent; caption del lector de
    pantalla coherent.
17. «Restaura» també confirma.
Entrega: clar i fosc, i els quatre escenaris.
```

**Doc fallout:** REQUIREMENTS 0.4.7 (new **B-15** `trialEndsAt` has no writer; **B-14 hardened** — `member_stats` is a condition of AMBR-01, not an option; AMBR-03 copy constraint: no promise of an authorship record until AQ-03 closes; §5.7 gains `revokedAt`) · TASKS 0.1.9 (D.7 → 8.1 scope; B-15 gates AP-1).

---

### 8.2 Socis — verification of v4 (2026-08-23) · **final, mock frozen**

**Verified against the live source** (DesignSync read of `Vista Socis.dc.html`, 968 lines / 122 KB, up from 813): **all seventeen 8.1 points applied.** Three literal greps first read as misses and all three were false negatives — recorded here so the next reviewer does not repeat the mistake.

| 8.1 point                      | Evidence in source                                                                                                                                                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1 trial does not expire itself | L678 `trFoot = 'En arribar la data, una prova no caduca sola: cal convertir-la o ampliar-la.'` — inverted, not deleted; «passa a Inactiu» = 0 hits. SPEC L169 now carries a «Model de la prova» paragraph stating the domain rule |
| 2 no authorship promise        | «queda al registre» · «motiu registrat» · «qui ho ha fet i quan» = 0 hits                                                                                                                                                         |
| 3 access copy                  | «accedir a la botiga» · «la botiga li dirà» = 0; «podrà fer comandes» ×2                                                                                                                                                          |
| 4 jargon out                   | «AREQ-06» · «trialEndsAt passa» · «sòcia» = 0                                                                                                                                                                                     |
| 5 export                       | «S'ha descarregat» ×2; the only remaining «per correu» is the reason placeholder «Ho demana per correu, marxa del barri…» (L664) — a false positive                                                                               |
| 6 chips inside the query       | L521 `const scoped = MEM.filter(inQ)` — `cnt`, `nVer` and `list` all derive from `scoped`; «Neteja la cerca» with `aria-label` (L91); a chip click resets `q` (L823)                                                              |
| 7 bulk grouped by state        | L627–651: `trBreak` (per-group breakdown, «no canviaran») kept separate from `changing`; names capped at 8 + «i N més»                                                                                                            |
| 8 reason field a11y            | `aria-label="Motiu…"` + `aria-required` ×2; `aria-describedby` ×3                                                                                                                                                                 |
| 9 footer                       | «Files per pàgina» ×4 outside the pager conditional; the allowlist has its own pager (`wlPage` / `wlPs` / `wlShown`, L735–739)                                                                                                    |
| 10 CSV commit on 2→3           | L952–953: `// the write happens here, moving from review to result — «Fet» only closes` → `wlNew.concat(csvNew), csvAdded: csvNew.length, csvStep: 2`; `csvDone` only closes (L956); step-3 count reads `S.csvAdded`              |
| 11 selection hygiene           | `sel: {}` on paging/sorting/page-size (9 sites); «Selecciona les 25 files d'aquesta pàgina»                                                                                                                                       |
| 12 Caduca sort                 | L607 `(k === 'nom' \|\| k === 'cad' ? 'asc' : 'desc')`; dashes out of the order in both directions (`KEY.cad` split on `eff(m) !== 'prova'`, L528), SPEC says so                                                                  |
| 13 sticky Estat / ⋮            | L123–138: `position:sticky; right:60px` / `right:0`, `z-index` on both header and cells                                                                                                                                           |
| 14 live region + tabs + menus  | `role="status"` visually hidden and **always mounted** (L77, outside `showPager`); tablist with `aria-controls="panel-socis                                                                                                       | panel-wl"`, `aria-selected`, roving `tabIndex`; `role="tabpanel"` ×2 |
| 15 fixture                     | 18 rows on «Setmana 33», 3 on «Setmana 34» — exactly as asked                                                                                                                                                                     |
| 16 «Compte creat»              | ×2                                                                                                                                                                                                                                |
| 17 Restaura confirms           | `kind: 'restore'`                                                                                                                                                                                                                 |

**Frozen.** Nothing left in the mock justifies another round. The three open items are **construction blockers, not design ones**, and all three are already recorded: **B-15** (nothing writes `users.trialEndsAt` — the «Caduca» column that now sorts perfectly reads an empty field), **B-14 hardened** (`member_stats` before AMBR-01, because «Comandes» / «Darrer cicle» sort), and **§5.7 synced into the PRV-05b spec** with `name` yes/no and AQ-10(c) decided — the only one with a real deadline. Further Socis changes go through REQUIREMENTS.md, as with Sol·licituds (4.1g) and the Tauler (7.1).

**Series note.** Socis took four iterations (v1 → 8 → 8.1 → 8.2) where the Tauler took three; the extra one was self-inflicted — round 8 asked for rich dialogs without restating the "no promises the backend cannot keep" rule that 4.1c–f had already paid for. AMBR-03 now carries it as a copy constraint; the next list view (Comandes) should not need the round.

---

## Round 9 — 2026-08-23 · Categories

**Scope:** `Vista Categories.dc.html` read as source via DesignSync (one screen, grouped list of 8 categories across 3 global groups, an add dialog and a delete confirm; no scenarios beyond `theme`), cross-checked against `pb_schema.json` (`product_categories`, `category_groups`, `products.category`, the `product_categories_stats` view and its `viewQuery`), the storefront's category store (`libs/eco-store/product-categories/data-access`), REQUIREMENTS §4.3 ACAT-01..04 / AGLB / B-02 / B-03 / B-07 and the round-3 findings the mock already answered (B1 invented «Oculta», B7 stats count, B8 group cascade, C6, D5). The user's opening question — "I think deactivating categories is missing, globals and custom" — is the thread.

**Verdict: the mock does what round 3 asked and its SPEC is schema-true; it is also the least finished view in the project.** Nothing writes (create and delete only close the dialog), there is no edit dialog at all (the pencil has no handler), three ACAT-02 MUST fields are absent, there are zero scenarios and zero ARIA. And the deactivation question exposes a **product incoherence the view inherits without knowing**: the storefront already hides categories implicitly — by stock — and nobody chose that.

### The deactivation question

The schema has no `hidden` / `active` / `archived` on `product_categories` or `category_groups`; round 3 B1 removed the invented «Oculta» state and the SPEC's "NO hidden state (schema truth)" is correct. **But the storefront already deactivates categories — by accident.** It loads `product_categories_stats` filtered by `tenant = <id>`, and that view groups by `(category, p.tenant)` over `LEFT JOIN products … AND inStock = TRUE`:

| Situation                                                      | Row in the view              | Shown in the storefront |
| -------------------------------------------------------------- | ---------------------------- | ----------------------- |
| Global category with in-stock products of the tenant           | `tenant = <id>`, `total > 0` | yes                     |
| Global category with **no** products of the tenant             | only the `tenant = NULL` row | **no** — filtered out   |
| Global category whose tenant products are **all out of stock** | only the `tenant = NULL` row | **no** — vanishes       |

So a cooperative that runs out of «Ous i làctics» for a week loses the category from navigation with nobody deciding it; and a tenant that does not want a global category cannot remove it — it can only refrain from stocking it. That is what the user is sensing as "missing deactivate". The rule of rounds 3/6/7 stands — nothing in the UI without a field — so this is a **B-item + an open decision**, not a mock change: **B-16** (an explicit hide mechanism: `hidden` on own rows, a per-tenant relation for globals, both respected by the view and by `products.listRule`) and **AQ-14** (what "deactivating a global category" means for a tenant). Until decided, the mock should at least **show the real behaviour** — a derived "no es veu a la botiga" marker on categories with zero in-stock tenant products — instead of hiding it.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | **The product count is a partial lie, and the delete confirm repeats it.** «Verdura · 32 productes» reads `product_categories_stats.totalProducts`, which counts **only `inStock = TRUE`** (round 3 B7, never resolved). The confirm says «S'eliminaran també els 6 productes» with that same number: with 6 in stock and 3 out, the cascade deletes **9** and warns of 6. A destructive confirm must use `COUNT(products WHERE category = X)` with no stock filter (`products.category.cascadeDelete = true`)                 | critical |
| 2   | **The confirm claims a scope it cannot guarantee.** «…de la botiga i dels cicles oberts que encara no els hagin comandat» — orders keep `items` as a snapshot (AORD-02), so placed orders survive; but "open cycles not yet ordered" describes live `carts`, and no hook touches `carts.items` on category delete. A backend promise without backend — the class that closed Socis. → say only what happens: «S'eliminaran els N productes. Les comandes ja fetes conserven la seva còpia»                                     | critical |
| 3   | **ACAT-02 requires i18n `description`, `color` and `icon`; the dialog has `name` and `group` only.** All three exist in the schema and `description` is **required** (`json!`) — a category created from this dialog fails PocketBase validation. `color` feeds the Estadístiques series (DESIGN-BRIEF §3.11), `icon` is what the storefront draws. The fixture does not model them either: row tiles are `TONES[i % 4]`, a decorative cycle, not `category.color`                                                             | critical |
| 4   | **There is no edit.** The pencil has no `onClick`; no edit dialog exists. ACAT-02 is "create/**edit**", and edit is where the hard case lives: changing `group` on a category with products moves them in the storefront navigation with no warning                                                                                                                                                                                                                                                                            | critical |
| 5   | **`product_categories_stats` is public (`listRule: ""`) and exposes `tenant` + per-tenant stock counts.** Not this view's fault, but this view rests on it: anyone can list how many in-stock products every cooperative has per category without auth. B-03 (cross-tenant public reads) did not list the view → added                                                                                                                                                                                                         | critical |
| 6   | **Own categories live inside global groups and the operator has no exit.** Correct by schema (`group` required, `category_groups` has no `tenant`) but unexplained: a tenant cannot create a group (ACAT-03 is GA-only). If «Ofertes» fits none of Fresc / Rebost / Llar, the cooperative is stuck — and the fixture itself shows it (a _price_ category inside a _product-type_ group). The hint «Grup del catàleg global — defineix la posició a la navegació» should say «Si cap grup encaixa, demana'n un a la plataforma» | major    |
| 7   | **«El nom normalitzat ha de ser únic a tota la plataforma — si ja existeix, veuràs l'error aquí» is schema copy and an information leak.** `normalizedName` UNIQUE is **global**: a collision on a private name of another tenant reveals that name exists. B-02 (round 3) asked for a composite `(tenant, normalizedName)` index for exactly this; the mock turned the bug into a feature. Design against the corrected index                                                                                                 | major    |
| 8   | **A global with zero tenant products looks identical to an active one**, although only one of them exists in the storefront (see above). A derived «no es veu a la botiga» marker costs nothing — the data is already there                                                                                                                                                                                                                                                                                                    | major    |
| 9   | **No empty states, no scenarios** (`theme` only): new tenant (globals only, zero own), tenant with no products (all zeros), group with no categories. Tauler ships 8 scenarios, Socis 4, Categories 0                                                                                                                                                                                                                                                                                                                          | major    |
| 10  | **Zero ARIA — third view in a row.** Dialogs without `role=dialog` / `aria-modal` / Esc / focus trap; pencil and trash with no accessible name (only the lock and the chips carry `title`); the dialog's language tabs are `<span>`s, not focusable; group headers are `<span>`, not `<h2>`, so a screen-reader user cannot jump between groups. The §3.14 contract exists — apply it                                                                                                                                          | major    |
| 11  | **«Crea la categoria» and «Elimina» only close the dialog.** No write → no toast → no undo; a cascade delete with no «Desfés» is precisely where round 4.1g demanded the honest snackbar                                                                                                                                                                                                                                                                                                                                       | major    |
| 12  | Deleting an own category **with products** should require the DS §08 acknowledgment checkbox (the DS defines it for cascades) and the typed confirmation above 50 children — the dialog has neither                                                                                                                                                                                                                                                                                                                            | minor    |
| 13  | Copy: title «Eliminar «…»?» vs button «Elimina categoria i 6 productes» (two verb forms); «L'esborrament és en cascada» is jargon (brief §1) → «S'eliminarà amb tots els seus productes»                                                                                                                                                                                                                                                                                                                                       | minor    |
| 14  | Lock icon + «Global» chip say the same thing twice per row; with 6 of 8 rows global the noise dominates. One indicator — or invert prominence: mark the **own** rows (the actionable ones) and leave globals flat                                                                                                                                                                                                                                                                                                              | minor    |
| 15  | 8 categories need no search, but the global catalogue is cross-tenant and will grow: at 30 globals + N own the page needs a «Pròpies / Globals» filter and search. State the threshold in the SPEC                                                                                                                                                                                                                                                                                                                             | minor    |

**What works:** submit blocked until a group is picked, with the mandatory-field message in red · globals locked with no actions, faithful to the API rules · a product count inside the destructive confirm (the wrong number, but the right place) · grouping by global group with headers, which is how the storefront sees it · «Serà pròpia de la cooperativa i només visible a la vostra botiga» is exactly what happens.

### Change package — Categories v2 (paste into Claude design)

```text
Categories — ronda 9. La vista fa el que la ronda 3 va demanar, però està a mig fer:
res no escriu, no hi ha edició, falten camps obligatoris i no té escenaris ni ARIA.
Regla de sempre: res a la UI sense camp a l'esquema.

1. Recompte REAL al confirm d'esborrat: tots els productes de la categoria, no només
   els que tenen estoc (avui surt de la view d'estadístiques, que filtra inStock). A la
   llista pots mantenir «N en estoc» si ho dius així; al confirm, el total.
2. Confirm: fora «de la botiga i dels cicles oberts que encara no els hagin comandat»
   (no hi ha cap hook que toqui els carros). Copy: «S'eliminarà «Higiene i llar» amb els
   seus 9 productes. Les comandes ja fetes en conserven la còpia.» Afegeix la casella de
   reconeixement del DS §08 (cascada) i confirmació escrita si >50 productes. Títol i
   botó amb la mateixa forma verbal; fora «en cascada».
3. El diàleg de creació ha de portar TOTS els camps d'ACAT-02: nom i descripció (i18n,
   DS §09 — descripció és obligatòria a l'esquema), grup (obligatori), color (selector
   de la paleta — és el color de les sèries d'Estadístiques) i icona. Amb això ja no és
   un diàleg: fes-lo amb el patró de formulari del DS §10 (o un diàleg ample amb les dues
   seccions). Les pestanyes d'idioma han de ser botons, no text.
4. Edició: el mateix formulari sobre una categoria pròpia. Cas dur: canviar de grup amb
   productes — avís «Els 6 productes passaran a veure's sota «Rebost i begudes» a la
   botiga».
5. Grup: el text d'ajuda ha de dir que els grups són de la plataforma i que, si cap
   encaixa, cal demanar-ne un (la cooperativa no en pot crear). Fora «defineix la
   posició a la navegació».
6. Nom únic: fora «únic a tota la plataforma» i «veuràs l'error aquí». Dissenya contra
   un nom únic DINS la cooperativa (l'índex global és un error registrat, B-02): «Ja
   tens una categoria amb aquest nom».
7. Marca derivada «No es veu a la botiga» a les categories sense cap producte en estoc
   de la cooperativa (avui la botiga les amaga en silenci). Cap acció de desactivar
   mentre no hi hagi camp (B-16 / AQ-14 obertes) — però al SPEC, deixa anotada la
   proposta: hidden per a les pròpies, relació per tenant per a les globals.
8. Escriptures reals al mock: crear, editar i esborrar canvien la llista, amb toast;
   esborrar amb «Desfés» honest (l'esborrat s'executa en tancar-se l'avís).
9. Escenaris: tenant nou (només globals, cap pròpia), cooperativa sense productes (tot a
   zero), grup sense categories — i el llindar de cerca/filtre «Pròpies · Globals» al SPEC.
10. Accessibilitat §3.14: diàlegs amb role=dialog, aria-modal, nom, Esc i trampa de focus;
    llapis i paperera amb nom («Edita Higiene i llar»); capçaleres de grup com a <h2>;
    un sol indicador de global per fila (xip o cadenat, no tots dos).
Entrega: clar i fosc i els tres escenaris.
```

**Doc fallout:** REQUIREMENTS 0.4.9 (new **B-16** explicit category hide mechanism · new **AQ-14** what "deactivate a global" means per tenant · B-03 gains `product_categories_stats` · ACAT-01 count semantics + derived visibility marker · ACAT-02 all fields, edit-with-products warning, name uniqueness scoped per tenant) · TASKS 0.1.11 (new D.8; 3.5 gated on B-16/AQ-14 for the hide affordance, not for the rest).

---

### 9.1 Categories — verification of v2 (2026-08-23) · **final, mock frozen**

**Verified against the live source** (DesignSync read of `Vista Categories.dc.html`, 372 lines / 50 KB, up from 14 KB): **all ten round-9 points applied**, several beyond what was asked.

| Point               | Evidence in source                                                                                                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 real count        | L260 `total` + `out` → «N · cap en estoc» / «N · 3 sense estoc»; confirm L158 «amb els seus N productes — tots, també els que no tenen estoc»                                                                                       |
| 2 honest confirm    | «cicles oberts» = 0, «en cascada» = 0; L159 «Les comandes ja fetes en conserven la còpia»; §3.6 checkbox «Entenc les conseqüències» (L164); **typed confirmation** auto-switched above 50 products (L267) with its own `aria-label` |
| 3 full ACAT-02 form | Description i18n with `*` on CAT only (L298), Color, Icona — and the form is a **page with `<h1>` and breadcrumb**, not a dialog (L102, L283): the DS §10 pattern, the right call                                                   |
| 4 edit              | `fMode: 'edit'`, change snapshot (L249), warning «Els N productes passaran a veure's sota «…» a la botiga» (L308)                                                                                                                   |
| 5–6 copy            | «defineix la posició» = 0 · «tota la plataforma» = 0 · «Ja tens una categoria amb aquest nom» ✓                                                                                                                                     |
| 7 derived marker    | L82 `visibility_off` «No es veu a la botiga»; SPEC L93 carries the B-16 / AQ-14 proposal and states «CAP acció de desactivar: no hi ha camp»                                                                                        |
| 8 writes + undo     | delete **executes when the snackbar closes**, «Desfés» cancels (L243, L364) — the honest pattern of 4.1g                                                                                                                            |
| 9 scenarios         | `per defecte · tenant nou · sense productes · grup buit`                                                                                                                                                                            |
| 10 a11y             | `role=dialog` + `aria-modal` + `aria-labelledby`; `aria-label="Edita X"` / `"Elimina X"` (L84); `<h2>` group headers; tiles `aria-hidden`; search/filter threshold «~20 files» in the SPEC                                          |

Residual, not worth a round: the form page has no `aria-live` on save and no stated focus management back to the list; «Global» chip and lock still coexist per row (point 10 asked for one). Both travel with construction.

**Frozen.** Further Categories changes go through REQUIREMENTS.md.

### The out-of-stock question — resolved as a store policy, not a per-row toggle

The user's follow-up: _if a category has products but none in stock, the admin should be able to choose whether to show it — and the same for products._ Today production answers each piece differently and incoherently: out-of-stock **products are shown** (no `inStock` filter in the products store; BOT-08 adds the badge/overlay/«Avisa'm»), while a category whose products are all out of stock **disappears** (the stats view filters `inStock = TRUE`) — a member can see a sold-out product but cannot reach it through its category. The fix is a rule, not 130 switches: **B-16 rewritten** as a display policy on the tenant (`displayConfig`: `showOutOfStockProducts`, `showEmptyCategories`, both default true) plus per-row `hidden` for the exception, **AQ-14 widened** to the display policy and its defaults, and a new **ACFG-10** so the Botiga view designs the two toggles where they belong. The stats view exposes `totalProducts` **and** `inStockProducts` instead of filtering.

---

## Round 10 — 2026-08-23 · Productes (list + form)

**Scope:** `Vista Productes.dc.html` (dense list, filter bar, bulk bar, 8-row fixture) and `Vista Producte (formulari).dc.html` (two-column form: Informació · Preu i unitats · Disponibilitat · Imatges, sticky save bar), both read as source via DesignSync, cross-checked against the full `products` schema, the `tags` collection, the storefront's unit-chip and product store (`libs/eco-store/shared/product-price`, `libs/eco-store/products/data-access`), the storefront i18n (`apps/eco-store/public/i18n/ca.json` — the six `unitType` labels), the `on_create_order` hook (which `priceWithIva` it reads), REQUIREMENTS §4.2 APRD-01..07, ACAT-04, B-16 / AQ-14 / ACFG-10 (decided yesterday), and the round-3 rulings (B1 «Actiu/Ocult» invented, SKU absent).

**Verdict: the list sits correctly on the frozen DS pattern and keeps the round-3 rulings (availability IS `inStock`, no SKU); the form is the best form in the project — and it models three schema fields in a shape the schema does not have.** That is the expensive class of error: the mock looks right, so the builder inherits it. Plus one field that does not exist at all.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | **«Destacat» does not exist — in either view.** `products` has no `featured` / `isFeatured`; APRD-05 says verbatim _"Field pending in schema (TASKS:L83); **hide until it ships**. Q-11 open"_. The list renders it as a column with an inline star (SPEC: _"toggles products.featured inline (optimistic write)"_), the form as a switch under Disponibilitat. Q-11 (manual / dynamic / both) may never resolve to a boolean                                                                                                                                                                                                                                                                    | critical |
| 2   | **`unitType` is wrongly modelled: six values that are not the schema's six.** Schema: `unit · weight · unitWithFixedWeight · unitWithVariableWeight · unitWithFixedVolume · unitWithVariableVolume`. Mock: `unitat · pes (kg) · pes (100 g) · litre · paquet · dotzena`. "paquet"/"dotzena" are `unitBase` values of type `unit`, "pes (100 g)" does not exist, and the four `unitWith*` — the ones the storefront labels distinctly («Pesa {value}» / «Ocupa {value}» / «Pes variable» / «Volum variable», `ca.json` L329–335) — are missing. Variable-weight products are priced differently; this is not cosmetic. The SPEC says "els 6 valors de l'esquema"; the template does not have them | critical |
| 3   | **`unitBase`, `minQuantity`, `maxQuantity` are numbers; the mock treats them as free text** (`ub: '1 kg'`, `minQ: '0,5 kg'`, `maxQ: '5 kg'`). The unit comes from `unitType`; the field carries only the figure. As drawn, the form teaches the operator to type «0,5 kg» into a field that rejects text, and the SPEC's "min ≤ max inline" validation cannot run on strings                                                                                                                                                                                                                                                                                                                     | critical |
| 4   | **`features` is a free i18n list in the code and three fixed checkboxes in the mock.** Entity: `LocalizedFields[] \| string[]`; the store reads `feature[currentLang]`. The mock collapses an open, translatable list into `granel / fràgil / fred` toggles, without i18n                                                                                                                                                                                                                                                                                                                                                                                                                        | critical |
| 5   | **«Productor» and «Origen» drawn as catalogue selects; both are free text** (`provider`, `origin`: `text`, no relation, no `providers` collection). Either a text input with autocomplete over the tenant's existing values, or a new collection — a product decision, not a mock one → **B-17**                                                                                                                                                                                                                                                                                                                                                                                                 | critical |
| 6   | **«Etiquetes» ignores that `tags` are per-tenant rows per language.** `tags = { name, lang (relation), client (relation), color }`: one row per language, with a colour — not i18n text. The mock adds tags as free text with a bare «Afegeix». APRD-02 says `tags (multi)` = multi-relation; ACAT-04 (tag CRUD) is **blocked** on Q-06/Q-15 (fixed list vs free-form). Free chips here pre-decide Q-06. → a selector over the tenant's existing tags; creation lives where ACAT-04 decides                                                                                                                                                                                                      | major    |
| 7   | **IVA closed to {4, 10, 21}; the schema accepts any number.** Right for food today, but 0 % and 5 % have existed (2023–24 basics) and may return; three closed pills leave the operator stranded when the law changes. → pills for the usual rates **plus** «Altre» with a numeric field. (The override is real: `on_create_order` reads `priceWithIva` from the DB, L136 — «Edita a mà» reaches the order)                                                                                                                                                                                                                                                                                      | major    |
| 8   | The list's «Categoria ⌄» is a decorative span and the search is a div; the SPEC does not say what the category filter does (globals? grouped?) nor that APRD-01 also asks for a `tags` filter                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | major    |
| 9   | **No `hidden`, and it was decided yesterday** (B-16 / APRD-01 0.4.10: _"the `hidden` filter and a per-row «Amaga de la botiga» action"_). The form's Disponibilitat section is exactly where «Amagat de la botiga» goes; the list needs the filter. Not the mock's fault — but the package must ask for it now so the view is not reopened                                                                                                                                                                                                                                                                                                                                                       | major    |
| 10  | **The `inStock` helper — «Esgotat es continua veient a la botiga però no es pot comandar» — is true today and becomes conditional on `displayConfig.showOutOfStockProducts` (ACFG-10).** When a tenant turns the flag off the sentence is false. → neutral copy («Esgotat: no es pot comandar»); visibility detail lives in Botiga                                                                                                                                                                                                                                                                                                                                                               | major    |
| 11  | Schema jargon in operator copy: `nameHint` «El nom en català alimenta la cerca (normalizedName)»; `pwiHint` «Override manual — no es recalcula» (brief §1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | major    |
| 12  | Bulk «Marca esgotat» writes `inStock=false` on N rows silently — no toast, no «Desfés»; both exports have no contract and no write; the row's trash the SPEC promises (_"delete goes through DS §08 confirm with cascade counts"_) **is not in the row** (edit + a ⋮ with no handler)                                                                                                                                                                                                                                                                                                                                                                                                            | major    |
| 13  | **Zero ARIA in the list** (sortable headers as `<span>`, nameless checkboxes, span pagination, handler-less ⋮, nameless star); the form does carry `role="switch"` + `aria-checked` + `aria-label` on both switches — the one good spot. §3.14 still to apply, as in Socis v2 and Categories v1                                                                                                                                                                                                                                                                                                                                                                                                  | major    |
| 14  | **No scenarios** (`theme` only): new tenant with no products, empty search, product with no images, a `unitWithVariableWeight` product (the case the form cannot represent)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | major    |
| 15  | Header «6 categories» is a literal; the row count is fixed text                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | minor    |
| 16  | `minQuantity > maxQuantity` validation is in the SPEC, not in the mock (error scenario)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | minor    |
| 17  | No «Elimina el producte» in the form (APRD-02 is CRUD; the trash is missing in the list too, #12) and no mention of «Duplica» (APRD-06, COULD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | minor    |
| 18  | «actualitzat fa 2 dies **per Marta Puig**» — `updated` exists, `updatedBy` does not (AQ-03 open). Same authorship promise caught in Socis 8.1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | minor    |
| 19  | Images copy «JPG, PNG o WebP» — the schema also accepts **AVIF**. Third file-limits copy that does not match the schema (logo in R5, CSV in R8)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | minor    |

**What works — and it is a lot:** i18n tabs with the fallback said aloud («Buit — la botiga mostrarà el nom en català»), better than DS §09 in one detail (the hint changes per tab) · live `priceWithIva` with «Edita a mà» / «Torna a l'automàtic», and it is real — the order hook reads the stored value · images: ≤4, 5 MB, first is main with star-reorder, and the copy «fitxers protegits … token temporal, mai per URL pública» explains a security constraint in operator language — a first in the project (`images.protected: true`) · sticky save bar with snapshot-based dirty state · `role="switch"` on both toggles · list: Tots / En estoc / Esgotats derived from `inStock` (the round-3 B1 reversal done right), Esgotat/Baix chips with icon + text, «Marca esgotat» = APRD-07.

### Change package — Productes v2 (paste into Claude design)

```text
Productes — ronda 10. Dos fitxers: la llista i el formulari. El formulari és el millor
del projecte i s'hi ha de tocar poc — però tres camps tenen una forma que l'esquema no
té, i un no existeix. Regla: res a la UI sense camp; cada camp amb el tipus real.

1. Fora «Destacat» de les dues vistes (columna + estrella a la llista; commutador al
   formulari): el camp no existeix i la decisió de com funcionaran els destacats és
   oberta. Si el vols deixar dibuixat, com a escenari apagat i anotat al SPEC.
2. «Tipus d'unitat» amb els SIS valors reals i les etiquetes que fa servir la botiga:
   unitat · pes (preu per kg) · volum (preu per L) · unitat amb pes fix («Pesa 500 g») ·
   unitat amb pes variable («Pes variable») · unitat amb volum fix («Ocupa 75 cl») ·
   unitat amb volum variable. «paquet» i «dotzena» no són tipus: són la unitat base
   d'un producte de tipus «unitat».
3. «Unitat base», «Mínim» i «Màxim per comanda» són NÚMEROS: camp numèric amb la unitat
   derivada del tipus com a sufix fix (kg · g · L · cl · u), no text lliure. Validació
   mínim ≤ màxim en viu (escenari d'error).
4. «Característiques» és una llista lliure i traduïble (una línia per característica,
   amb pestanyes d'idioma com el nom) — no tres caselles fixes.
5. «Productor» i «Origen» són text lliure: input amb autocompletat sobre els valors ja
   usats per la cooperativa (no un selector de catàleg — no existeix cap catàleg de
   productors; B-17 obert).
6. «Etiquetes»: selector de les etiquetes existents de la cooperativa (cada etiqueta té
   idioma i color), no text lliure. La creació d'etiquetes no va aquí (decisió oberta).
7. IVA: pastilles 4 · 10 · 21 + «Altre» amb camp numèric.
8. Disponibilitat: afegeix «Amagat de la botiga» (interruptor, APRD-01 / B-16) amb el
   seu escenari; el text d'«En estoc» passa a ser neutre — «Esgotat: no es pot comandar»
   (la visibilitat dels esgotats es decideix a Botiga). Llista: filtre «Amagats».
9. Copy: fora «(normalizedName)» i «Override manual» → «El nom en català és el que es fa
   servir per cercar» / «Preu fixat a mà — no es recalcula». «actualitzat fa 2 dies»
   sense «per Marta Puig». Imatges: «JPG, PNG, WebP o AVIF».
10. Llista: «Marca esgotat» amb toast + Desfés; paperera a la fila amb el confirm DS §08
    (fora el ⋮ sense menú); «Categoria» com a filtre real (digues si inclou les globals
    i si va agrupat); filtre per etiqueta (APRD-01); comptadors derivats.
11. Accessibilitat §3.14 a la llista (capçaleres-botó amb aria-sort, caselles amb nom,
    paginació amb botons, estrella/paperera amb nom). El formulari ja ho fa bé als
    commutadors.
12. Escenaris: tenant nou, cerca sense resultats, producte sense imatges, producte de
    pes variable, error mínim > màxim.
Entrega: clar i fosc, i els escenaris.
```

**Doc fallout:** REQUIREMENTS 0.4.11 (APRD-02 pins the real shape of `unitType` / `unitBase` / `minQuantity` / `maxQuantity` / `features` / `tags` / `provider` / `origin` and the IVA rule; APRD-05 restated as "hidden until the field ships"; new **B-17** `provider` catalogue decision) · DESIGN-BRIEF 0.2.8 (view 6 drops "featured toggle" and names the six unit types) · TASKS 0.1.13 (new D.9; 3.2/3.3 notes).

---

### 10.1 Productes — verification of v2 + five additions (2026-08-23)

**Verified against the live source** (list 336 lines / 51 KB, form v2 read in full): **all twelve round-10 points applied.** «Destacat» survives only as a SPEC explanation; `UNITS` are the six schema values with an operator label **and a storefront preview** («A la botiga: ‹0,5 kg unitat›» — not asked for, better than asked); `inputMode="decimal"` with the unit suffix derived from the type and `unitBase` hidden for `unit`/`weight`; min ≤ max validated live with `role="alert"` and its own scenario; `features` as a free per-language list; `provider`/`origin` as text with a `role="listbox"` of used values; `tags` as a selector over five tenant tags with colour dot and `aria-pressed`, hint «Crear-ne i editar-ne és una decisió oberta — no es fa des d'aquí»; IVA 4 · 10 · 21 + «Altre» numeric; `hidden` as «Amagat de la botiga» switch with explanatory callout in the form, «Amagats» filter + row chip in the list, neutral `inStock` helper; jargon gone; trash with confirm, «Marca esgotat» with «Desfés», `⋮` gone, category filter declared («inclou pròpies I globals, agrupat pel grup global, amb recompte»), tag filter, derived counters; `scope="col"` + `aria-sort` ×3, 13 `aria-label`, button pagination; scenarios 3 (list) + 4 (form, incl. «pes variable» and «error mín-màx»). The «Sense imatges» callout («la botiga mostra un marcador gris… Amb una n'hi ha prou») is a second unasked-for improvement.

**Five user additions, adjudicated against schema and open decisions:**

| #   | Addition                                             | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Tags visible in the row when the list filters by tag | **Yes.** A filter on X the row does not show is filtering blind. Density constraint: the DS fixes 48px rows; pills go **on the name line** (20px, colour dot, truncated to 2 + «+N») the way `unit` already rides beside the name — not a second line. A second line means a 56–60px row and a DS §04 variant; not worth it here                                                                                                                                                                                                                                                                                                                                                                                   |
| 2   | IVA with a 0 % option                                | **Yes, explicitly.** «Altre» covers the rare case; 0 % is not rare (basic food was at 0 % in 2023–24 and the debate is alive). Pills **0 · 4 · 10 · 21 · Altre**. APRD-02 amended                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 3   | Mark one or many products as hidden from the list    | **Yes.** Same pattern and field as «Marca esgotat» (`hidden`, B-16): «Amaga de la botiga» / «Mostra a la botiga» in the bulk bar with toast + «Desfés»; already the row chip exists. APRD-01 / APRD-07 amended                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 4   | Create tags and features here, with translations     | **Features: already so** — `features` is per-product JSON `[{cat,es,en}]`, created and translated in the form. **Tags: not from here, and not yet.** `tags` is a collection the TENANT_ADMIN may create in (`client = @request.auth.tenant`), but (a) **Q-06 is open** («fixed list per tenant vs free-form — In progress»): inline creation pre-decides it, and free-form needs de-duplication that only a dedicated screen can do; (b) a tag is **one row per language** (`tags.lang` → `languages`), so "one tag with translations" is three linked rows and **the schema has no field linking them** → **B-18**. Creation lives in the tags section; the form gets a «+ Nova etiqueta» shortcut pointing there |
| 5   | A global section to view/edit tags and features      | **Tags: yes — it is ACAT-04** («Tag CRUD per tenant, colour, language — Blocked on Q-06/Q-15. Ship read-only list first»). Placement decided: an «Etiquetes» tab in Categories (where the other taxonomies live), read-only now with the create dialog disabled and a Q-06 note, full CRUD after Q-06. **Features: needs a decision first** — there is no collection, so "a section to edit features" cannot exist without turning `products.features` from per-product JSON into a per-tenant catalogue (`product_features` + multi-relation), a schema change **with data migration in eco-store**. Opened as **AQ-15**; the section is not drawn until decided                                                  |

### Change package — Productes 10.1 (paste into Claude design)

```text
Productes — 10.1. El paquet de la ronda 10 està aplicat sencer; això són cinc afegits,
tots petits.

1. Llista: les etiquetes del producte com a pastilles de 20 px a la MATEIXA línia que el
   nom (punt de color + text; màxim 2 i «+N»), igual que ja hi va la unitat. Les files es
   queden a 48 px. Si un producte no en té, res.
2. Formulari · IVA: pastilles 0 · 4 · 10 · 21 + «Altre» (el 0 % no és un cas rar).
3. Llista · barra de selecció: «Amaga de la botiga» i «Mostra a la botiga» al costat de
   «Marca esgotat», amb avís + Desfés; el xip «Amagat» de la fila ja hi és.
4. Formulari · Etiquetes: un enllaç «+ Nova etiqueta» que porta a la pestanya Etiquetes
   de Categories (no creació inline — decisió oberta). Les característiques ja es creen
   i tradueixen aquí; no cal tocar-les.
5. Categories: nova pestanya «Etiquetes» — llista de només lectura de les etiquetes de
   la cooperativa agrupades per etiqueta lògica, amb els tres idiomes i el color; botó
   «Nova etiqueta» desactivat amb la nota (al SPEC) «pendent de decidir si les etiquetes
   són llista fixa o lliures». Cap secció de característiques: no hi ha catàleg (decisió
   oberta AQ-15).
Entrega: clar i fosc.
```

**Doc fallout:** REQUIREMENTS 0.4.12 (APRD-01 tag pills + bulk hide/show; APRD-02 IVA 0 %; ACAT-04 placement = Categories tab, read-only now; new **B-18** `tags` has no field linking the per-language rows of one logical tag; new **AQ-15** `features` per-product JSON vs per-tenant catalogue) · TASKS 0.1.14 (3.6 repointed; D.10).

---

### 10.2 Productes + Categories — verification of the 10.1 additions (2026-08-23) · **final, mocks frozen**

**Verified against the live source of all three files** (list 367 lines, form re-read in full, Categories 420 lines): **all five 10.1 points applied.**

| Point                  | Evidence in source                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 tag pills in the row | 20px pills on the name line (border + subtle fill, colour dot) with a «+N» overflow — option (a) as asked; rows stay 48px                                                                                                                                                                                                                                                                                                                 |
| 2 IVA 0 %              | `ivaItems: [[0,'0%'],[4,'4%'],[10,'10%'],[21,'21%'],['altre','Altre']]`; SPEC updated                                                                                                                                                                                                                                                                                                                                                     |
| 3 bulk hide/show       | Bulk bar: «Marca esgotat · Amaga de la botiga · Mostra a la botiga · Exporta», with toast + «Desfés»                                                                                                                                                                                                                                                                                                                                      |
| 4 tag shortcut         | «+ Nova etiqueta» is a link to `Categories#etiquetes`; hint says «la creació no es fa des d'aquí»                                                                                                                                                                                                                                                                                                                                         |
| 5 Etiquetes tab        | Table **Etiqueta · Català · Castellà · Anglès · Ús**, grouped per logical tag with its colour; «Nova etiqueta» disabled; the why is **visible operator copy** («Crear-ne i editar-ne: pendent de decidir si són una llista fixa de la plataforma o lliures per cooperativa») — better than asked, which only required a SPEC note. The SPEC also scopes AQ-15: «cap catàleg de característiques: es creen lliures a la fitxa de producte» |

**Three residuals for the builder — no package, they travel with construction:** (a) the disabled «Nova etiqueta» has `opacity + cursor:not-allowed` but no `aria-disabled` and no `aria-describedby` to the visible explanation; (b) the Categories/Etiquetes switcher carries no tab semantics (`role="tab"` / `aria-selected` = 0) — inconsistent with Socis v4, which implemented the §3.14 tab pattern after 8.1; (c) the Etiquetes SPEC draws the logical-tag grouping without citing **B-18** — the drawing is the correct target contract, but the schema cannot group per-language rows until B-18 lands, and the builder must know it.

**Frozen: Productes (list + form) and Categories (with its Etiquetes tab).** The catalogue module now matches the Tauler and Socis bar: schema-true, scenario-covered, §3.14-compliant, with its construction gates on record — B-16 (`hidden` + `displayConfig`), B-17 (`provider`), B-18 (tag row linking), AQ-15 (features catalogue), Q-06 (tags fixed vs free). Further changes go through REQUIREMENTS.md. Remaining design surface: Comandes, Cicles, Botiga, Estadístiques, Superadmin.

---

## Round 11 — 2026-08-23 · Comandes (list + detail)

**Scope:** `Vista Comandes.dc.html` (cycle-scoped list: KPI cards as filters, bulk bar, orphan rows) and `Vista Comanda (detall).dc.html` (stepper, basket, activity, member/delivery/payment/cycle cards, advance + cancel dialogs), both read as source via DesignSync. Cross-checked against the full `orders` schema (8 status values, `paymentStatus`, `deliveryMethod`/`day`/`time`, `address`/`items` snapshots, `tax` as a 0–100 **rate**), the `EcoStoreOrderItemSnapshot` entity, the hooks (`on_create_order`, `cycle_cron`), AORD-01..07, the round-3 rulings (B5 orphans, C2, D4, F9), the frozen Tauler v3.1 and brief §3.4 (payment family outlined + €), and AQ-07/11/13.

**Verdict: the list is a strong post-round-3 rebuild — the orphan row answers B5 exactly, the KPI-cards-as-filters share the dashboard anatomy, past cycles go read-only, and the detail's advance dialog declares its email (D4 done right). But the module has three sources of truth for one state machine, promises two backend behaviours that do not exist anywhere, and misses the one workflow the schema was explicitly built for: preparation with quantity adjustment.**

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Severity |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **The detail invents a third chip family for the same six states.** List `ST`: `pending · check_circle · package_2 · order_approve · local_shipping · close` with warning/info/info/primary/success/error — matches DS §06. Detail `CH`/stepper: `schedule · check_circle · autorenew · location_on · task_alt · block` with Confirmada on **primary-container**, En preparació on **tertiary/orange**, Cancel·lada on **neutral**. Three of six states change colour and five change icon between the row you clicked and the page that opens | critical |
| 2   | **«L'estoc dels productes torna a la botiga» is doubly invented.** No hook restores stock on cancellation — and none ever _decrements_ it: `on_create_order` only **checks** `stock` (L114–116) and `products.update` is TA/GA-only, so a member's order cannot touch it. The cancel dialog and both SPECs promise a stock lifecycle that does not exist in any direction → **B-19**                                                                                                                                                           | critical |
| 3   | **The Activitat card and the stepper timestamps have no data source.** Per-transition times («dl. 08:35», «dc. 9:10») and authorship («Marta Puig», «automàtic») are rendered, but `orders` stores only `updated`; no history collection or field exists and AQ-03 is open. Same family as B-15 (`trialEndsAt`) and the Socis 8.1 authorship promise → **B-20**, or the card strips down to current state + `updated`                                                                                                                          | critical |
| 4   | **The preparation workflow the schema anticipates is missing.** `EcoStoreOrderItemSnapshot` carries `requestedQuantity`, `finalQuantity`, `isAvailable`, `lockedPrice`, `lineTotal` — the fields a cooperative needs to weigh variable-weight items and mark unavailable lines during `PREPARING`, recomputing the total. The detail renders a single read-only «Quantitat» column and the SPEC declares the basket immutable. The module's core job — what «En preparació» is _for_ — has no UI → **AQ-16**                                   | critical |
| 5   | **Same transition, two behaviours.** In the detail, advancing opens a confirm that names the email it triggers (AORD-03 ✓). In the list, the inline «Confirma/Prepara/…» button and the bulk «Passa a l'estat següent» write **silently** — no confirm, no email statement, and the bulk has no per-row failure report (AORD-05 requires it) and no grouping for mixed selections (the Socis 8.1 R5 lesson)                                                                                                                                    | critical |
| 6   | **Fixture incoherence across the module.** The list's C33-014 is Rosa Martí · 17 articles · 95,30 € · pagada; the detail's C33-014 is Núria Solé · 5 productes · 29,01 € · pendent. The detail dates cycle 33 «8–14 **des.**» (the whole project is frozen on S33 = 10–16 d'agost); its cycle card says «18 comandes» while the list shows 10 and the frozen Tauler 23                                                                                                                                                                         | critical |
| 7   | **`EXPIRED` and legacy `PAID` rows are unrenderable.** `orders.status` has 8 values; the KPI cards cover 6 and `ST` maps 6. `EXPIRED` (Caducada — DS §06 defines it, AORD-03 says "set by system") and legacy `PAID` (AQ-07 open) will appear in production data and hit an undefined chip. The orphan SPEC repeats the miss: it lists terminal states as «Lliurada/Cancel·lada», omitting Caducada, though AMBR-07 counts EXPIRED as terminal                                                                                                 | critical |
| 8   | **Payment family ignores the frozen treatment.** Brief §3.4 (round 5) and the frozen Tauler v3.1 render payment **outlined with a leading €** so it never reads as a second status chip; both Comandes views use filled chips identical to the status family. The detail also omits `FAILED` (Fallida — AORD-04 includes it), relabels «No pagada» as «Pendent de pagament» (colliding with the order-status «Pendent») and paints Reemborsada neutral+`undo` where the list uses info+`history`                                               | major    |
| 9   | **AORD-01 filters mostly missing:** no user text search at all (the orphan SPEC even references «la cerca per sòcia» — a search that does not exist), no `paymentStatus`, `deliveryMethod` or `day` filters, no delivery-method column. For pickup-vs-delivery staffing, `day` and method are the working filters                                                                                                                                                                                                                              | major    |
| 10  | **`more_vert` is a link, not a menu.** The row's ⋮ opens the detail; the SPEC promises a row menu with «Cancel·lada reachable from the row menu» and «delivery staff open each order's basket (row menu → detall)». Wrong affordance, and cancellation is unreachable from the list                                                                                                                                                                                                                                                            | major    |
| 11  | **The VAT line is wrong and the schema cannot back it.** Detail: «IVA inclòs: 1,16 € (4 %) · sobre 27,85 € de base» — 4 % of 27,85 is 1,11; the correct backing-out of 29,01 is base 27,89 + 1,12. And `orders.tax` is a single 0–100 **rate**, which cannot represent a mixed 4/10/21 basket — the display must derive VAT from the items' `taxRate`, never from `orders.tax` (the known eco-store tax-field bug)                                                                                                                             | major    |
| 12  | Footer «total del cicle 583,40 €» **includes cancelled orders** (o9 + o10) — money that will not be collected; and under a KPI filter the range reads «1–4 de 4» as if the cycle had four orders                                                                                                                                                                                                                                                                                                                                               | major    |
| 13  | **Zero ARIA in both files** (§3.14): sortable headers as `<span cursor:pointer>`, nameless checkboxes, span pagination, dialogs without `role="dialog"`/`aria-modal`/Esc/focus trap                                                                                                                                                                                                                                                                                                                                                            | major    |
| 14  | **No scenarios in either file** (`theme` only): empty cycle, 24/7 tenant, read-only past-cycle detail, cancelled/orphan detail, delivery-method variant, mixed-IVA basket                                                                                                                                                                                                                                                                                                                                                                      | major    |
| 15  | The member card re-invents known gaps: «Sòcia #124» (`memberNumber` does not exist — AQ-11, flagged in round 4.1 and back again), «en període de prova fins al 15 de set.» (B-15: nothing writes `trialEndsAt`; date also collides with the fixture's own December), the email shown is blocked by B-11                                                                                                                                                                                                                                        | major    |
| 16  | The cycle dropdown carries a design annotation as operator copy: «Cooperatives sense cicles (botiga 24/7): 'Totes', 'Última setmana'…» describes what _other_ tenants would see — SPEC material (brief §1)                                                                                                                                                                                                                                                                                                                                     | minor    |
| 17  | «Sòcia / soci» column header and «Sòcia» card title against the single-form «socis» rule (round 3 F8)                                                                                                                                                                                                                                                                                                                                                                                                                                          | minor    |
| 18  | «Marca com a pagada» / «Registra un reemborsament» write silently — no confirm and no undo, on bookkeeping actions the cooperative reconciles money against                                                                                                                                                                                                                                                                                                                                                                                    | minor    |

**What works — protect it:** the orphan row answers round-3 B5 exactly (italic «Compte suprimit», RGPD·CP chip, terminal-only, out of member search) · KPI cards as filters with live counts + € share the dashboard card anatomy · cycle selector with searchable history and past-cycles-read-only · payment explicitly separate from fulfilment with «El cobrament es fa fora de l'app» · the advance dialog names the email per step, including the honest «No s'envia cap correu — pas intern» (D4 as intended) · cancel requires a mandatory reason · address/slot/instructions framed as checkout-time snapshots (AORD-02 ✓) · the no-manual-PDFs stance.

### Change package — Comandes v2 (paste into Claude design)

```text
Comandes — ronda 11. Dos fitxers. La llista és una bona reconstrucció post-ronda-3
(fila òrfena, KPI-filtres, cicles passats només consulta); el problema és que el detall
no parla el mateix idioma que la llista, i que hi ha dues promeses de backend que no
existeixen. Regla: un sol llenguatge d'estats a tot el mòdul, i cap promesa sense hook.

1. UNA sola família de xips d'estat (la del DS §06 i la llista): pending ·
   check_circle · package_2 · order_approve · local_shipping · close, amb
   warning/info/info/primary/success/error. El detall (capçalera, stepper, activitat)
   l'ha de fer servir exactament — fora schedule/autorenew/location_on/task_alt i fora
   els colors propis.
2. Fora «L'estoc dels productes torna a la botiga» (diàleg d'anul·lació i SPECs): res
   no descompta ni retorna estoc avui. Copy honest: «La comanda s'anul·la i la sòcia rep
   el correu amb el motiu» — i para. (Si es vol el cicle d'estoc real, és decisió de
   backend, no de copy.)
3. Activitat: mentre no hi hagi registre, la targeta mostra només l'estat actual i la
   data de darrera modificació — sense hores per pas ni «qui». El stepper perd les
   hores («pendent» als passos futurs, res als passats). Si es vol la línia de temps
   completa, cal el registre de backend (obert com a B-20).
4. Preparació amb ajustos — el flux que falta: en estat «En preparació», les línies de
   la cistella s'editen: marca «no disponible» (la línia es ratlla i surt del total) i
   fixa la quantitat final dels productes de pes variable («demanat 1,5 kg → final
   1,42 kg»), amb el total recalculat i la diferència visible. Fora d'«En preparació»,
   només lectura. Aquesta és la feina real del cicle i l'esquema ja hi té els camps.
5. El mateix confirm a tot arreu: l'avanç des de la fila i en bloc obre EL MATEIX
   diàleg que el detall (amb el correu que dispara). En bloc: agrupat per estat, amb
   desglossament «N passen a X · M no canvien», i informe per fila si alguna falla.
6. Coherència de dades: C33-014 ha de ser LA MATEIXA comanda a la llista i al detall;
   dates del cicle 33 = 10–16 d'agost (no desembre); el nombre de comandes del cicle
   igual a la llista, al detall i al Tauler (congelat: 23).
7. Estats que falten: xip «Caducada» (history_toggle_off, neutral) al DS ja hi és —
   afegeix-lo a ST i una setena targeta KPI només si n'hi ha (>0); regla per als PAID
   antics: es pinten com a Lliurada + xip de pagament Pagada amb nota al SPEC (decisió
   AQ-07 pendent).
8. Pagament com al Tauler congelat: xips outlined amb «€» davant (mai plens); afegeix
   «Fallida» (error); «No pagada» (no «Pendent de pagament»); Reemborsada = info +
   history a tot arreu. «Marca com a pagada» i el reemborsament amb confirm lleuger +
   Desfés.
9. Llista: cerca per sòcia (el SPEC ja la cita), filtres de pagament, mètode de
   lliurament i dia; columna o icona de mètode (recollida/entrega). El ⋮ passa a menú
   real (Obre el detall · Anul·la…) o la fila sencera obre el detall i l'anul·lació viu
   al detall — però que el SPEC i la plantilla diguin el mateix.
10. IVA del detall derivat de les línies (cada línia té el seu tipus): «IVA inclòs:
    1,12 € · base 27,89 €» — mai del camp tax de la comanda (no pot representar
    cistelles mixtes). Fixture amb una cistella mixta 4/10/21.
11. Peu: el total del cicle exclou Cancel·lades i Caducades (o s'etiqueta «facturable»);
    amb filtre actiu, «1–4 de 10».
12. Fora l'anotació 24/7 del desplegable de cicles (és SPEC, no copy d'operador);
    «Soci» com a única forma (capçalera i targeta).
13. Accessibilitat §3.14 als dos fitxers: capçaleres-botó amb aria-sort, caselles amb
    nom, paginació amb botons, diàlegs amb role=dialog + aria-modal + nom + Esc + focus.
14. Escenaris: llista (cicle buit · 24/7 · cicle passat) i detall (cancel·lada · òrfena ·
    cicle passat només consulta · entrega a domicili · cistella mixta d'IVA · en
    preparació amb ajustos).
Entrega: clar i fosc, i els escenaris.
```

**Doc fallout:** REQUIREMENTS 0.4.14 (AORD-02 basket renders the snapshot fields and derives VAT from items; AORD-03 one confirm everywhere + EXPIRED/legacy-PAID rendering; AORD-04 FAILED + the outlined € family; new **B-19** stock lifecycle — nothing decrements or restores stock; new **B-20** no per-transition history; new **AQ-16** preparation adjustments in scope) · TASKS 0.1.16 (new D.11; 2.1/2.2 notes; gates).

---

## Round 12 — 2026-08-23 · Filter-system harmonisation (DS-level)

**Trigger:** the user compared the filter rows of Sol·licituds (tabs + chips + right-hand search), Socis (left search + chips + separated «Verificats» axis) and Comandes (KPI stat-cards as status filters), liked the Comandes pattern, and asked whether the styles should be unified.

**Ruling: the three patterns stay — they are three different jobs, not three arbitrary styles.** KPI-cards-as-filters work in Comandes because the set is a bounded **pipeline** (6 cycle states), the aggregate (count + €) is itself the operational summary, and the page is scoped to one container (the cycle). In Socis the states are not a pipeline, no monetary aggregate matters, and six 180px cards would push a 50–500-row table below the fold for an occasional control — chips with live counts are correct. In Sol·licituds the tabs are structure (three trays, frozen at 4.1g) and chips filter within one. Unifying the _component_ would make views worse; what was missing is the _system_: the pattern the user likes exists only in the Comandes SPEC, not in the DS — which is exactly how a fourth variant would have appeared in Cicles.

**What is genuinely inconsistent (and gets fixed):**

| #   | Finding                                                                                                                                                                                                                      | Severity |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **The KPI-card-as-filter pattern is undocumented.** It lives in the Comandes SPEC («double as status filters, active = 2px primary outline») and nowhere in the DS sheet — no usage rule, no anatomy, no a11y contract       | major    |
| 2   | Chip anatomy diverges in detail: Sol·licituds' selected chip carries a check («✓ Totes · 8»), Socis' does not («Tots · 50» filled only); Socis separates its second axis (Verificats) with a vertical rule, nobody else does | minor    |
| 3   | Search placement drifts: DS §05 fixes it left (300px input, chips after); Socis complies, Sol·licituds has it on the right, Comandes has none (already in the round-11 package)                                              | minor    |

**Sol·licituds stays frozen** — the search position is recorded as a deviation and corrected opportunistically when the view is next touched (its mobile files are still unreviewed). Cicles, when reviewed, inherits KPI-cards by rule.

### Change package — DS filter system (paste into Claude design)

```text
Eco Admin DS — ronda 12. Només la fulla del sistema («Eco Admin DS»): dues seccions.
Cap vista no es toca — això és la regla perquè les properes no inventin una quarta
variant.

1. §05 «Filter bar» ampliada — anatomia única del xip de filtre:
   · xip actiu = fons secondary-container + text on-secondary-container + CHECK davant
     (com Sol·licituds); inactiu = outlined. Recompte viu «· N» sempre, del mateix
     conjunt que les files i el paginador.
   · la cerca sempre a l'ESQUERRA (input 300px, corner-medium), xips després,
     accions a la dreta. Un segon eix de filtre (p. ex. Verificats) se separa amb
     un separador vertical d'1px outline-variant — documenta-ho com a variant.
   · aria-pressed als xips; els de selecció única es documenten com a grup exclusiu.
   Mostra les dues variants (un eix / dos eixos) i anota que Sol·licituds té la cerca
   a la dreta com a desviació heretada (congelada a 4.1g — es corregirà quan la vista
   es toqui per una altra raó).
2. NOVA §18 «KPI-cards com a filtres» — el patró de Comandes, promogut:
   · QUAN: conjunt acotat (≤7) que és un PIPELINE d'estats, amb un agregat
     operativament significatiu (recompte + €), en una pàgina acotada a un contenidor
     (un cicle). Si falta qualsevol de les tres condicions → xips de §05.
   · ANATOMIA: la stat-card compartida del Tauler (badge tonal 34px + títol tinta,
     hero + agregat apagat); actiu = outline 2px primary; les targetes es col·loquen
     sobre la taula en una fila de N.
   · A11Y: cada targeta és un <button> amb aria-pressed; el conjunt porta un
     encapçalament ocult («Filtra per estat»); recompte i € llegibles com a text, no
     només visuals.
   · Candidats declarats: Comandes (fet) i Cicles (quan es revisi). Anti-exemple
     declarat: llistes d'entitats (Socis, Productes) → xips.
Entrega: la fulla actualitzada en clar i fosc.
```

**Doc fallout:** DESIGN-BRIEF 0.2.9 (§3.3 filter bar gains the single chip anatomy + the two-pattern rule and names §18) · TASKS 0.1.17 (new D.12).

### Amendment 12.1 — 2026-08-25 · Reset de filtres: a rule, not plausibility

**Trigger:** while applying Round 12, the designer started adding a reset-filters option «allí on sigui plausible». The control is right; the criterion is the problem — per-view plausibility judgment is the exact mechanism Round 12 exists to remove, and it would produce four variants of the reset the same way it produced three variants of the filter bar.

**Rule (goes into DS §05; §18 references it):**

1. **Presence is conditional, not optional.** Every view with filter state carries the control, but it renders **only when the state differs from the default** (search text present, any chip ≠ «Tots/Totes», second axis active, or a KPI-card selected). At rest it does not exist — a permanently visible reset is noise, and an always-enabled button with nothing to do is an a11y anti-pattern.
2. **Anatomy:** one M3 text button «Neteja els filtres» with `filter_alt_off`, chip-row height (32px), at the **right end of the filter bar** next to the actions — never mixed among the chips. Same component under §18, aligned right of the KPI-card row.
3. **What it clears:** everything that constrains rows — search, chips back to default, second axis, KPI selection — and pagination returns to page 1. It does **not** touch sort, density, or column preferences (view preferences, not filters), and in Sol·licituds it does **not** change tray tab (tabs are structure — 4.1g ruling).
4. **Focus:** on activation the button unrenders (state is back to default), so focus must be returned deliberately — to the search input, first control of the bar; the live results count announces the effect.
5. **Empty-state wiring:** the filtered-empty state («Cap resultat amb aquests filtres») offers the same reset as its primary action — DS §04's empty-state slot already exists; this is where the control earns its place.

**Freeze note:** adding the reset to Sol·licituds touches a frozen view; it is authorized only as part of this registered amendment (system-level pattern), not as ad-hoc plausibility.

#### Change package — reset de filtres (paste into Claude design)

```text
Eco Admin DS — esmena 12.1 (reset de filtres). Va DINS de la ronda 12: §05 guanya
un punt i §18 hi remet. És una regla, no un criteri de plausibilitat:

1. PRESÈNCIA condicional: el control existeix a totes les vistes amb filtres, però
   NOMÉS es renderitza quan l'estat difereix del per defecte (text de cerca, xip
   ≠ «Tots/Totes», segon eix actiu, o KPI-card seleccionada). En repòs, no hi és —
   un reset permanent és soroll i un botó actiu sense efecte és un antipatró d'a11y.
2. ANATOMIA: un únic botó de text M3 «Neteja els filtres» amb icona filter_alt_off,
   alçada de la fila de xips (32px), a l'extrem DRET de la barra, amb les accions —
   mai barrejat entre els xips. A §18, alineat a la dreta de la fila de KPI-cards.
3. QUÈ NETEJA: tot el que restringeix files — cerca, xips a per defecte, segon eix,
   selecció de KPI-card — i la paginació torna a la pàgina 1. NO toca ordenació,
   densitat ni preferències de columnes; a Sol·licituds NO canvia de pestanya
   (les pestanyes són estructura, regla de 4.1g).
4. FOCUS: en activar-lo el botó desapareix (estat per defecte) — el focus torna
   explícitament a l'input de cerca; el recompte viu de resultats anuncia l'efecte.
5. EMPTY STATE: l'estat «Cap resultat amb aquests filtres» ofereix el mateix reset
   com a acció primària (l'slot d'empty state de §04 ja existeix — connecta'ls).
Sol·licituds: afegir-hi el reset queda autoritzat per aquesta esmena (patró de
sistema); cap altre canvi a la vista congelada.
```

**Doc fallout (12.1):** DESIGN-BRIEF 0.2.10 (§3.3 gains the reset rule) · TASKS 0.1.18 (D.12 scope grows).

### Round 12.2 — 2026-08-25 · Verification of DS v0.3 + reset rollout

Verified against source (`get_file`), never screenshots. **The DS sheet passes the full round-12 + 12.1 checklist**: §05 shows both variants (one axis / two axes with the 1px separator), single chip anatomy (selected = secondary-container fill + leading check, `aria-pressed` everywhere), the reset rule verbatim as a spec block plus working demos, the Sol·licituds deviation note, and new §18 with the three-condition usage rule, stat-card anatomy, a11y contract, candidates and anti-example. Footer bumped to v0.3. The dark file is a clean `dc-import theme="dark"` wrapper, not a fork. Two designer additions accepted as improvements: **second click on a KPI-card deselects it**, and a **conditional «Caducades» card shown only when > 0** (answers Round 11's EXPIRED finding).

**View rollout (scope discipline held):**

| View         | Verdict                                                                                                                                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Productes    | ✅ Surgical — diff vs frozen 10.1 source shows exactly 4 hunks, all reset: conditional `anyFilter` button, tonal reset in the filtered-empty state, `role="status"` on the count, logic with focus return. Nothing else touched   |
| Socis        | ✅ Best implementation — both bars (Socis + Llista blanca each with own `anyF`/reset), dedicated sr-only live region, empty states wired. «Verificats» IS covered: it shares the exclusive `S.filter` state with the status chips |
| Comandes     | ✅ `anyFilter` covers all five axes (KPI + search + Pagament + Mètode + Dia), `bump` resets page, KPI cards are `<button aria-pressed>` with toggle-off — but see finding 2                                                       |
| Sol·licituds | ✅ Authorized scope respected (reset + search `aria-label`, tab untouched, `page: 0` included) — but see finding 1                                                                                                                |

**Findings (2, both view-level — the sheet is clean):**

| #   | Finding                                                                                                                                                                                                                                                                                                                                    | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | **Sol·licituds `anyF` misses the Resolts tray.** Chips render and filter whenever `tab !== 'msg'` (`showChips`, filter predicate), but `anyF` only counts `tab === 'sol'` — with a type chip active in Resolts the rows are filtered and the reset never renders, violating rule point 1. Fix: `(S.tab !== 'msg' && S.tFilter !== 'tots')` | major    |
| 2   | **Comandes KPI group lacks the hidden heading «Filtra per estat»** that §18's own a11y contract requires — the sr-only technique is already used in the same view (the «Accions» header), so this is an omission, not a pattern gap                                                                                                        | minor    |
| —   | Residuals (note, no action): the §18 demo on the sheet states the hidden heading in prose only (spec sheets may); Sol·licituds has no filtered-empty rendering to wire the reset into — next-touch item                                                                                                                                    | note     |

#### Change package — 12.2 fixes (paste into Claude design)

```text
Eco Admin — correccions 12.2, dues línies, res més:

1. Vista Sol·licituds — anyF (el que decideix si es veu «Neteja els filtres»):
   ara és `q || (tab === 'sol' && tFilter !== 'tots')`, però els xips de tipus
   també filtren a Resolts. Canvia la condició del xip a
   `tab !== 'msg' && tFilter !== 'tots'` — cap altre canvi a la vista.
2. Vista Comandes — el grup de KPI-cards ha de portar l'encapçalament ocult
   «Filtra per estat» (sr-only, com el th «Accions» de la mateixa vista),
   tal com exigeix la §18 de la fulla.
```

**Doc fallout (12.2):** TASKS 0.1.19 (D.12 → done: DS sheet verified in light + dark; the two view fixes tracked here).

---

## Round 11.1 — 2026-08-25 · Comandes v2 verification

**Verified against source** (`Vista Comandes.dc.html` + `Vista Comanda (detall).dc.html` + the scenario wrappers, all via `get_file`). **14/14 package points applied in substance — the strongest application round of the project.** Highlights, point by point:

- **P1 one chip family** ✓ — the detail's `ST()` now maps pendent/pending·warning, confirmada/check_circle·info, preparacio/package_2·info, punt/order_approve·primary, lliurada/local_shipping·success, cancelada/close·error, exactly the list and DS §06; the surviving `schedule`/`autorenew`/`location_on` occurrences are legitimate non-status uses (card headers, delivery-method icon, nav).
- **P2 stock promise gone** ✓ — cancel copy everywhere is «La comanda s'anul·la i el soci rep el correu amb el motiu»; both SPECs cite B-19 explicitly.
- **P3 activity honest** ✓ — Activitat card = current state + «Última modificació» only; the sole timestamp in the fixture is the `updated` data field.
- **P4 preparation adjustments (AQ-16)** ✓ — `adjustable` gated to «En preparació» only (`!cancelled && !readOnly && preparacio`); per-line availability toggle with accessible name, final-quantity input only for `weight` lines, recomputed total, and «Diferència amb el demanat … s'inclou al correu 'a punt'». Read-only note otherwise.
- **P5 one confirm everywhere** ✓ — list row/bulk advance opens the same dialog with the per-step `MAILS` map; bulk shows «N passen a X» groups + «M no canvien (estat terminal)»; per-row server-failure report declared in SPEC (unmockable).
- **P6 fixture coherent** ✓ — C33-014 = Núria Solé · 5 productes · 35,41 € · nopagada · preparacio in both files; every detail scenario (C33-012, C33-004, C32-004, C32-007) matches its list row; 23 C33 orders = frozen Tauler; cycle 33 = 10–16 d'agost.
- **P7 EXPIRED/PAID** ✓ list — `caducada` in ST (history_toggle_off, neutral, terminal), 7th KPI card pushed only `if DATA.some(caducada)`, legacy PAID renders Lliurada + Pagada with the AQ-07 note in `payTitle`. **But see finding 1.**
- **P8 payment family** ✓ — outlined chip (1px border, transparent) with a leading bold **€** in both files; Fallida present; «No pagada»; Reemborsada = info everywhere; pay actions confirm lightly + snackbar «Desfés».
- **P9 list filters + menu** ✓ — search per soci, Pagament/Mètode/Dia menus (`role="menu"`, `menuitemradio`, counts), ⋮ is a real menu (aria-haspopup/expanded, «Obre el detall» + conditional «Anul·la…») and list-side cancellation carries the mandatory-reason dialog.
- **P10 VAT derived** ✓ — `vatTxt` computed from the lines (mixed 4/10/21 fixture); no hand-typed arithmetic left to be wrong.
- **P11 footer** — facturable total excludes cancelada + caducada ✓. **Accepted deviation:** the package asked for «1–4 de 10» under a KPI filter; the build keeps the Material paginator convention («1–4 de 4» of the filtered set) and adds «· facturable del cicle: X €» alongside. That resolves the original ambiguity better than the package's literal wording — recorded as the better call, not a miss.
- **P12 copy** ✓ — the 24/7 dropdown annotation became a real `escenari` (with «Totes les comandes / Última setmana» items); «Soci» single form (list header + detail card); «Sòcia #124» removed (AQ-11 honoured); trial note consistent with the frozen Socis treatment (B-15 tracked).
- **P13 a11y** ✓ — both files: sortable headers with `aria-sort`, named row checkboxes with `aria-pressed`, button pagination, dialogs with `role="dialog"` + `aria-modal` + `aria-labelledby` + `tabIndex` + Esc handler + focus-on-open effect.
- **P14 scenarios** ✓ — list: per defecte / cicle passat / cicle buit / 24/7 (+ dark); detail: per defecte **is** «en preparació amb ajustos» on the mixed-VAT basket, plus entrega a domicili / cancel·lada / òrfena / cicle passat (+ dark); wrapper files expose every state in the gallery.

**Findings (3 — the freeze waits for them):**

| #   | Finding                                                                                                                                                                                                                                                                                   | Severity |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **The detail's `ST()` has 6 states — `caducada` is missing.** The list renders Caducada and its conditional KPI card, but an EXPIRED order opened from the list hits an undefined state in the detail (header chip, stepper, Activitat). Same class as round-11 finding 7, one level down | major    |
| 2   | The Activitat card note says «(updated)» and «necessita backend (B-20)» — a schema field name and a spec ID in operator-visible copy (brief §1). The sentence belongs in the SPEC block; the visible copy stops at «Només es guarda la darrera modificació.»                              | minor    |
| 3   | Fixture typo: Xavier Mas's phone reads «610 774 club»                                                                                                                                                                                                                                     | cosmetic |

### Change package — 11.1 fixes (paste into Claude design)

```text
Comandes — verificació 11.1: 14/14 aplicats. Tres correccions i queda congelable:

1. Vista Comanda (detall) — el mapa d'estats ST() només té 6 estats: hi falta
   «caducada» (history_toggle_off · Caducada · neutral — la mateixa entrada que la
   llista). Una comanda EXPIRED oberta des de la llista no es pot pintar
   (capçalera, stepper, Activitat). Al stepper es tracta com a terminal, com
   Cancel·lada: banner d'estat i cap avanç possible.
2. Vista Comanda (detall) — la nota de la targeta Activitat diu «(updated)» i
   «necessita backend (B-20)»: nom d'esquema i ID d'especificació en copy
   d'operador (brief §1). El copy visible es queda en «Només es guarda la darrera
   modificació.»; la frase del registre pas a pas va al bloc SPEC.
3. Fixture: el telèfon de Xavier Mas diu «610 774 club» — han de ser dígits.
Recordatori — 12.2 encara pendent: anyF de Sol·licituds (tab !== 'msg' &&
tFilter !== 'tots') i l'encapçalament ocult «Filtra per estat» del grup de
KPI-cards de la llista de Comandes.
```

**Doc fallout (11.1):** TASKS 0.1.20 (D.11 verified; freeze gated on the 11.1 + 12.2 fix batch). AQ-16 note: the mock now draws the minimal preparation-adjustment scope proposed in round 11 — the product decision (and B-19/B-20 backend work) stays open in REQUIREMENTS.

---

## Round 13 — 2026-08-25 · Row-action grammar (cross-view)

**Trigger:** the user spotted that each list treats row actions differently — direct icons in some, ⋮ menus in others, different affordances for reaching the detail. **Inventory against source of all six lists confirms it: five different paths to the row's detail, four different action affordances, and three meanings for `chevron_right`.** Same disease as the filters in round 12: no rule in the DS, so every view invented its own grammar.

**Inventory (source-verified):**

| List          | Way to the detail                                                               | Row actions                                                                                       |
| ------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Sol·licituds  | full-row click (`div onClick`) + passive chevron                                | none on the row (panel actions)                                                                   |
| Socis         | name is a link **and** ⋮ «Obre la fitxa»                                        | ⋮ with the full a11y kit (aria + `role="menu"` + arrows/Home/End/Esc + focus return, 44px)        |
| Llista blanca | —                                                                               | visible labelled buttons (Revoca / Restaura / Elimina)                                            |
| Categories    | none — the name is plain text; the pencil opens the form                        | direct icon pair `stylus` + `delete` (aria-label + title); global rows: `lock` marker with a name |
| Productes     | none — name plain text; pencil opens the form                                   | direct icon pair `stylus` + `delete`                                                              |
| Comandes      | ⋮ «Obre el detall» only — the Codi is plain text                                | inline labelled advance «Confirma ›» + ⋮ (has aria, menu lacks the keyboard kit)                  |
| Cicles        | bare icon-only `chevron_right` link — **no accessible name**; row not clickable | conditional ⋮ (state override) with `title` only — no aria-haspopup/expanded, no `role="menu"`    |

| #   | Finding                                                                                                                                                                                                                                       | Severity |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | No canonical way into a row's detail: five patterns across six lists, two of which (Productes, Categories) have **no** identity affordance at all — the name is dead text                                                                     | major    |
| 2   | Cicles' action cell mixes a conditional ⋮ and a naked chevron link in one cell; the chevron has no accessible name; the ⋮ and its menu carry none of the §3.14 kit; the row itself is not clickable though the SPEC promises «row → Comandes» | major    |
| 3   | Menu a11y is a lottery: Socis implements the full §3.14 kit, Comandes has the aria but no menu keyboard handling, Cicles has neither                                                                                                          | major    |
| 4   | `chevron_right` means three things: passive open-affordance (Sol·licituds), navigation control (Cicles), forward-glyph inside a labelled button (Comandes) — the bare-link use is the broken one                                              | minor    |

**What is right and gets protected (the rule is built from it):** Socis' ⋮ kit (the reference implementation) · Categories/Productes' direct `stylus`+`delete` pair with names · the Categories `lock` read-only marker · Llista blanca's visible labelled workflow verbs · Comandes' inline labelled advance. **Ruling: not one component — a ladder.** Identity cell = canonical link; operational verbs visible and labelled; edit/delete pair as direct icons; 3+/rare/dangerous → ⋮ with the Socis kit; chevron never a bare icon-link.

### Change package — row actions (paste into Claude design)

```text
Eco Admin — ronda 13: accions de fila. Sis llistes, cinc gramàtiques — la regla va
al DS i quatre vistes es retoquen. El DS primer:

1. Eco Admin DS — §04 «Taula» guanya el bloc «Accions de fila»:
   · IDENTITAT = ENLLAÇ: la cel·la d'identitat de la fila (nom, codi) és sempre
     l'enllaç al seu detall o formulari, si en té — el camí canònic d'entrada.
     Les llistes de targetes (Sol·licituds) mantenen la fila sencera clicable amb
     chevron passiu: són cues, no taules.
   · ESCALA D'ACCIONS: cap acció → marcador passiu amb aria-label (el candau de
     Categories) · verbs operatius del mòdul → SEMPRE visibles i amb etiqueta (el
     botó outlined «Confirma ›» de Comandes; Revoca/Restaura de la llista blanca)
     · només editar/esborrar → parell d'icones directes stylus + delete, en aquest
     ordre, amb aria-label i title (Categories, Productes) · 3 o més accions, o
     accions rares o perilloses → menú ⋮ amb el kit complet de Socis:
     aria-haspopup + aria-expanded + nom «Accions de <entitat>», role=menu i
     menuitem, fletxes + Home/End + Esc + retorn de focus, objectiu 44px.
   · El ⋮ pot dur «Obre …» com a primer ítem (drecera; el camí canònic segueix
     sent l'enllaç d'identitat).
   · chevron_right: glif passiu a les files-targeta o DINS d'un botó amb
     etiqueta — MAI un enllaç d'icona sola en una cel·la de taula.
2. Vista Cicles — «Setmana N» esdevé l'enllaç a Comandes filtrada al cicle (el
   SPEC ja ho promet); fora la columna del chevron nu. El ⋮ d'override es queda,
   però amb el kit de Socis (aria-haspopup/expanded + nom, role=menu, teclat).
3. Vista Comandes — el Codi esdevé enllaç al detall («Obre el detall» es queda al
   ⋮ com a drecera); el menú de fila rep el teclat del kit (fletxes, Esc, retorn
   de focus).
4. Vista Productes (congelada — retoc autoritzat per aquesta ronda): el nom del
   producte esdevé enllaç al formulari, el mateix destí que el llapis. Res més.
5. Vista Categories (congelada — retoc autoritzat): el nom de les categories
   PRÒPIES esdevé enllaç a l'edició; les globals no enllacen (no tenen detall).
   Res més.
Socis i la llista blanca són el patró de referència: no es toquen. Sol·licituds
tampoc: la seva fila-div sense accés per teclat queda anotada com a desviació
congelada (4.1g), a corregir quan la vista es toqui per una altra raó.
```

**Doc fallout:** DESIGN-BRIEF 0.2.11 (table contract gains the row-action grammar, naming DS §04) · TASKS 0.1.21 (new D.13).

---

## Round 11.2 — 2026-08-25 · Fix batch verified — Comandes frozen

All five points of the combined 11.1 + 12.2 paste verified in source:

1. ✅ The detail's `ST()` gains `caducada` (history_toggle_off · Caducada · neutral) — and the designer over-delivered: a new «caducada» detail scenario (C32-002, David Prat) with full terminal gating (`canAdvance` and `canCancel` blocked on `F.expired`, `showStepper` off, state banner instead), plus two caducada rows in the list's past cycle (C32-001/002, matching the detail fixture one-to-one) — the conditional 7th KPI card is now demonstrable in the «cicle passat» scenario.
2. ✅ The Activitat card's visible copy is «Només es guarda la darrera modificació.» — the schema field name and the spec ID moved to the SPEC block.
3. ✅ Phone reads «610 774 293».
4. ✅ Sol·licituds `anyF` = `q || (tab !== 'msg' && tFilter !== 'tots')` — the reset now renders for chips active in the Resolts tray.
5. ✅ The list's KPI group carries the sr-only `<h2 id="kpi-filter-h">Filtra per estat</h2>`.

One hygiene residual, not gating: the detail's `icon_names` font subset misses `history_toggle_off` — the glyph still renders through the full-family stylesheet link, but the subset should list it (the list file's does). One word for the next touch.

**Comandes — list, detail and their 10 scenario states — FROZEN.** Changes from here go through REQUIREMENTS or a registered round; round 13's touches (Codi as identity link, menu keyboard kit) are already authorized and pending application. The 12.2 pending pair is closed. Module bar joins Tauler, Socis, Productes + Categories and Sol·licituds — remaining design surface: **Cicles, Botiga, Estadístiques, Superadmin** and the mobile files.

**Doc fallout (11.2):** TASKS 0.1.22 (D.11 frozen; D.12 residuals closed; AP-2 freeze intro).

---

## Round 13.1 — 2026-08-25 · Menu contents (what earns a place)

**Trigger:** round 13 fixed the _form_ of row actions; the user asked the second half — whether each menu's _contents_ are the right tasks. Ruled list by list, against source, schema state and the module's actual jobs. **New principle (graduates to the brief):** menu items are tasks named as verbs, each earning its place by frequency or necessity; a single-item menu is acceptable only for a guarded escape hatch; destructive items go last, after a separator.

| List         | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Comandes     | Missing the payment task: the operator reconciling the remesa marks orders paid one by one from the detail. Row ⋮ gains **«Marca com a pagada»** (only on No pagada/Fallida rows; the detail's light confirm + Desfés) and the bulk bar gains **«Marca com a pagades»** (batch is the remesa's natural shape; grouped summary like the advance dialog: N es marquen · M no canvien)                                                                                                                                                                                                                                                                                                                                                                               |
| Socis        | «Copia l'adreça» lacks the weight of its neighbours — the user is right. The task is _contacting the member_, not clipboard management: replaced by **«Escriu-li un correu»** (mailto:, same B-11 gate as the column). One contact item, task-named; two items for one job would dilute the menu                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Sol·licituds | **Position held on the side sheet** (4.1c, §3.13): triage queue, detail ≤ 1 viewport, prev/next without losing the queue, list visible for RGPD prioritization — a route would cost a round-trip per item. No quick actions on rows either: every action requires the request's text on screen first (deliberate friction on RGPD). The real gap found: the view's SPEC never recorded that the sheet is **URL-addressable** (`/sol-licituds/:id` child route, brief §3.13) — SPEC-only annotation, no visual change                                                                                                                                                                                                                                              |
| Cicles       | The single-item menu is the smell round 13.1's principle names — the override is a correctly-guarded escape hatch, but it should not live alone. The menu earns weight with the cycle's real tasks: **«Obre les comandes»** (shortcut to the round-13 identity-link destination) + **«Llista de preparació»** (AORD-06 picking, printable — the frequent per-cycle action once En procés) + the state override, conditional and last. **«Edita el cicle»** only on puntual drafts (weekly windows are governed from Botiga). **No dedicated cycle detail route**: per §3.13 a cycle's content _is_ its orders — Comandes scoped to the cycle is the detail; a route would duplicate it. (Items validated against `order_cycles` when the full Cicles review runs) |
| Productes    | The honest answer flips the pattern: per-row **«Amaga/Mostra»** (the 10.1 bulk action's frequent single case — one sold-out product) and **«Duplica»** (prefills the form; catalogue variants are routine) take the count to 4 → by the round-13 ladder Productes moves to a ⋮ menu: **Edita / Duplica / Amaga·Mostra / Elimina…** (destructive last). The icon pair stays only where the count is truly 2                                                                                                                                                                                                                                                                                                                                                        |
| Categories   | Stays the direct `stylus`+`delete` pair — edit and delete are genuinely all there is today (hide-category is gated on B-16 shipping; when it ships, the ladder flips Categories to a menu too — noted). Global rows stay lock-only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Etiquetes    | **No actions is correct** — the same reason creation is disabled: B-18 (a tag is one row per language with no linking field, so "editing a tag" would edit unlinked rows) + Q-06 undecided; the view already explains it to the operator (10.1). When B-18/Q-06 resolve, edit/delete arrive and the ladder applies                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Icons        | Two pencils coexist: `stylus` everywhere except Cicles' Esborrany chip (`edit`). Rule: **one glyph per meaning** — `stylus` is the edit glyph project-wide, `edit` leaves the vocabulary, and the Esborrany chip switches to `draft` (semantically better anyway). No mixing variants of one glyph                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### Change package — 13.1 menu contents (paste into Claude design, together with round 13)

```text
Eco Admin — ronda 13.1: contingut dels menús (s'aplica JUNTA amb la ronda 13).
Principi nou al DS §04: cada ítem de menú és una TASCA amb nom de verb i es guanya
el lloc (freqüència o necessitat); un menú d'un sol ítem només és acceptable per a
una via d'escapament protegida; el destructiu sempre al final, rere separador.

1. Vista Comandes — el ⋮ de fila guanya «Marca com a pagada» (només a files
   No pagada / Fallida; el mateix confirm lleuger + Desfés del detall). La barra
   d'accions en bloc guanya «Marca com a pagades» al costat de l'avanç, amb
   desglossament com el del diàleg d'avanç: «N es marquen · M no canvien».
   Ordre del ⋮: Obre el detall · Marca com a pagada · — · Anul·la…
2. Vista Socis — fora «Copia l'adreça»; entra «Escriu-li un correu» (mailto:,
   mateixa porta B-11 que la columna). El menú queda: Obre la fitxa · Historial
   de comandes · Escriu-li un correu.
3. Vista Sol·licituds — cap canvi visual: el side sheet es manté (cua de triatge,
   §3.13). Només al bloc SPEC: anota que el sheet és una ruta filla adreçable
   (/sol-licituds/:id) — enllaços profunds i recàrrega hi funcionen.
4. Vista Cicles — el ⋮ passa de 1 ítem a menú real: «Obre les comandes» ·
   «Llista de preparació» (AORD-06, imprimible) · «Edita el cicle» (NOMÉS
   esborranys puntuals — les finestres setmanals es governen des de Botiga) ·
   — · override d'estat (condicional per estat, com ara). El chip Esborrany
   canvia la icona edit → draft.
5. Vista Productes — les dues icones directes es converteixen en ⋮ (la llista
   passa de 2 a 4 accions): Edita · Duplica (obre el formulari preomplert) ·
   Amaga/Mostra (l'acció del 10.1, ara per fila; mateix undo) · — · Elimina…
   Kit d'a11y de Socis, com a la ronda 13.
6. Vista Categories — es queda com està (parell stylus + delete): avui només
   hi ha dues accions. Quan B-16 arribi, «Amaga» s'hi afegirà i saltarà a menú.
7. Etiquetes — cap acció, i és correcte (B-18/Q-06): res a tocar.
8. ICONES — un sol llapis a tot el projecte: stylus. El glif «edit» surt del
   vocabulari (l'únic ús, el chip Esborrany de Cicles, passa a draft). Regla al
   DS §04: un glif = un significat; mai variants del mateix llapis barrejades.
```

**Doc fallout:** DESIGN-BRIEF 0.2.12 (row-action grammar gains the menu-content principle) · TASKS 0.1.23 (D.13 scope grows). Comandes/Productes/Socis/Sol·licituds touches ride on round 13's authorization.

---

## Round 13.2 — 2026-08-25 · DS half of 13 + 13.1 verified (views pending)

The sheet's application of rounds 13 + 13.1 verified in source — diff vs v0.3 is 21 lines, all in §04, §06 and the footer. **Every DS-level package point landed:**

- §04 «Accions de fila» with a working 4-rung ladder demo: passive `lock` marker with aria-label (and the «global — sense detall: tampoc enllaç» nuance), labelled operational verb «Confirma ›», the `stylus`+`delete` pair with per-row names, and a ⋮ trigger with `aria-haspopup`/`aria-expanded`/«Accions de Marta Puig». Identity cells in the demos are links.
- The five rule blocks verbatim: identity = link (+ card-list exception), the Socis ⋮ kit (+ «Obre …» first-item allowance), the chevron rule, the 13.1 menu-content principle (verb-named tasks, single-item = escape hatch only, destructive last behind a 1px separator), and one-glyph-per-meaning (`stylus` action · `draft` state · `edit` out).
- The Sol·licituds div-row keyboard gap recorded as a frozen deviation on the sheet itself.
- §06's Esborrany chip already switched `edit` → `draft` — the sheet practices its own rule (the two remaining `edit`/`draft` strings in prose are `<code>` mentions, not glyphs).

**Two hygiene residuals (one line each, next touch):** the `icon_names` font subset doesn't list `draft` (renders via the full-family link) and still lists the now-unused `edit`; the header version badge still reads **v0.2** — the sheet is substantively at v0.4 (round-5 finding A6 was about exactly this traceability).

**Views pending:** Cicles, Comandes, Socis, Sol·licituds (SPEC note), Productes, Categories — verify when the designer finishes them.

---

## Schema note — 2026-08-25 · Pagament vs Estat (AQ-07 sharpened · new B-21)

**Trigger:** the user suspected the Comandes view misunderstands PocketBase — that «pagada» is an order _status_, not a separate property, so Pagament and Estat would be one source drawn as two.

**Settled against the schema and the code — the view is right, and the suspicion is the symptom of a real schema smell:**

- `orders.paymentStatus` **is a real field** (`UNPAID / PAID / REFUNDED / FAILED`) — payment and fulfilment are two sources in PocketBase, exactly as the two chip families render them.
- **But** `orders.status` _also_ still lists `PAID` among its 8 values — the legacy remnant the user remembered. The frontend entity (`libs/eco-store/core/entities/src/order.ts`) already excludes it (`ORDER_STATUSES` has 6 values — no `PAID`, **no `EXPIRED`** either), and no hook writes it: the enum value is dead weight that keeps confusing every reader of the schema. AQ-07's resolution path is now concrete: check live data for legacy rows → migrate to `DELIVERED` + `paymentStatus=PAID` → drop `PAID` from the enum.
- **New finding while checking: nothing writes `EXPIRED` (→ B-21).** `cycle_cron` only transitions _cycle_ statuses (OPEN → PROCESSING); no hook or frontend code ever sets an order to EXPIRED, and the frontend type doesn't include it. AORD-03's «set by system» describes a system that does not exist — the Caducada UI (rounds 11–11.2: chip, conditional 7th KPI, detail scenario) renders a state production will never produce until a writer ships (proposal in B-21: expire still-PENDING orders when their cycle leaves OPEN, one more branch in the cycle watcher).

No design changes — the mock's model is faithful; the fixes are eco-store-side (enum cleanup + expiry writer), parked as AQ-07/B-21 for Carlos.

---

## Round 14 — 2026-08-25 · Cicles (full review)

**Scope:** `Vista Cicles.dc.html` read as source, cross-checked against the full `order_cycles` schema (5 status values, `name`/`code`/`startsAt`/`endsAt`/`approxDelivery`, TA create/update/delete rules, indexes), the complete `cycle_cron.pb.js`, `on_create_order`/`generateOrderNumber`, REQUIREMENTS ACYC-01..03 + ADSH-01 (round-7 overlap model, AQ-13), the frozen Comandes fixture, DS §06's cycle chip family and the pending 13/13.1 rulings.

**Verdict: the view draws the right target model — and that is precisely the finding. The mock's Esborrany, its «Tancat» history, its per-cooperative unique codes and its `C33-014` order numbers are all better than what the backend does today, and none of them exist: the module sits on THREE backend gaps (B-22, B-23, B-24), one of which is a live multi-tenant bug.**

**What the ground truth says:**

- `cycle_cron` creates next week's cycle **already `OPEN` at Sunday 23:59** (the code comments «Assign 'open' for now, Angular will process it accordingly») — `DRAFT` is never written, no transition opens a cycle at `startsAt`, and **nothing ever writes `COMPLETED` or `CLOSED`** (the watcher only does OPEN → PROCESSING). The mock's S34 «Esborrany» and its history full of «Tancat» render states data never contains → **B-22**.
- The `code` UNIQUE index is **global** (`idx_order_cycles_code` on `code` alone) while the cron generates the **same** `WK33-2026` code for **every** active tenant each week — with a second active cooperative, Sunday night's second insert violates the index. It works today only because there is one tenant. The mock's «Codi ÚNIC per cooperativa» copy is the _correct_ target; the schema is wrong → **B-23** (index → UNIQUE(tenant, code); ACYC-02's «UNIQUE global» contract flips).
- `orderNumber` is generated **client-side** as `TENANT-timestamp-random` (`generateOrderNumber`, cart store). The `C33-014` cycle-scoped human format the whole admin module renders — and the puntual dialog's «prefixa els codis de comanda» hint — exist nowhere → **B-24** (server-side cycle-scoped numbering in `on_create_order`; also removes trust in client-generated IDs).

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                        | Severity |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **The Cicle column renders a computed «Setmana N» label, not `order_cycles.name`** — a puntual cycle («Cistella extra de Nadal») created by the view's own dialog could not be displayed by the view's own list                                                                                                                                                                                                | critical |
| 2   | **B-22/B-23/B-24 (above):** three backend promises drawn as reality — draft state, closed history, per-coop codes, human order numbers                                                                                                                                                                                                                                                                         | critical |
| 3   | **§18 candidacy overturned.** Cicles fails its own conditions: 4 of 5 states have ~1 occupant (no meaningful count), no operational € aggregate per state, and the page spans all history, not one container. Filtering a cycles list by state filters nothing — Cicles becomes a **declared anti-example** in §18; no filter bar at all (pagination suffices; a year selector when history outgrows ~2 years) | major    |
| 4   | Fixture incoherence with the frozen Comandes: S33 shows **1.842,50 €** where the 23 C33 rows sum 1.044,13 € (facturable 990,52 €); S32 claims **31 comandes** where the Comandes «cicle passat» fixture has 8. The Total column must follow the round-11 facturable rule (excludes Cancel·lades/Caducades)                                                                                                     | major    |
| 5   | Operator copy leaks spec IDs: the override confirms say «(NOT-04)» / «(NOT-05)» (brief §1); «Sòcies» header and «les sòcies» copy against the single-form «Socis» rule (round 3 F8, round 11 P12)                                                                                                                                                                                                              | major    |
| 6   | §3.14 gaps: both dialogs lack `role="dialog"`/`aria-modal`/name/Esc/focus trap; pagination prev/next buttons unnamed; «Cicles per pàgina» trigger without `aria-haspopup`/`expanded`; the puntual dialog's Obre/Tanca fields are unnamed `<div cursor:pointer>`; the footer range is not a live region. Plus the already-authorized round-13 items (naked chevron, ⋮ kit)                                      | major    |
| 7   | The puntual dialog's code hint promises order-number prefixing that is B-24's undecided backend («prefixa els codis de comanda») — until decided, the hint stops at identifying the cycle                                                                                                                                                                                                                      | minor    |
| 8   | No scenarios and no dark wrapper: tenant nou (empty), 24/7 (the cron **skips** these tenants — the view would be permanently empty; nav treatment must be specified), mode fosc                                                                                                                                                                                                                                | minor    |

**What works — protect it:** the 5 chips match DS §06's cycle family exactly, including the inverse «Tancat» (declared in the DS — not an invention); the S32-En procés + S33-Obert overlap honours the round-7/AQ-13 model; «Edita la finestra» correctly routes to Botiga (the cadence IS cron-fixed); the puntual dialog validates code collision inline with an honest hint; current-cycle row highlight; `prefers-reduced-motion`; honest subtitle («el sistema genera el cicle cada diumenge a la nit» — true). **13.1's menu validated against schema:** name/code/startsAt/endsAt are editable and TA update rules allow it — with one amendment: «Edita el cicle» applies to **any Esborrany row** (weekly drafts included — holiday-week adjustments are ACYC-02's own scope), not only puntuals.

### Change package — Cicles v2 (paste into Claude design; includes the authorized 13/13.1 touches)

```text
Cicles — ronda 14 (inclou els retocs 13/13.1 ja autoritzats). El fitxer + escenaris.

1. NOM I IDENTITAT: la columna Cicle renderitza order_cycles.name («Setmana 33»
   ve del nom desat, no d'un càlcul) — un cicle puntual («Cistella extra de
   Nadal») creat pel diàleg de la mateixa vista avui no es podria mostrar. El nom
   és l'ENLLAÇ a Comandes filtrada al cicle (ronda 13); fora la columna del
   chevron nu.
2. CAP KPI-CARD NI BARRA DE FILTRES: Cicles no compleix §18 (4 dels 5 estats
   tenen ~1 ocupant, cap agregat operatiu per estat, la pàgina abasta tot
   l'històric) — a la fulla del DS, §18 el declara ANTI-EXEMPLE. La paginació
   basta; el SPEC anota que un selector d'any arribarà quan l'històric passi de
   ~2 anys.
3. MENÚ ⋮ (13.1, validat contra esquema): Obre les comandes · Llista de
   preparació (AORD-06, imprimible) · Edita el cicle — en QUALSEVOL fila
   Esborrany, setmanal o puntual (dates/nom/codi, ACYC-02); la cadència setmanal
   segueix governant-se des de Botiga · — · override d'estat (condicional per
   estat, com ara). Kit d'a11y de Socis. El chip Esborrany passa a draft.
4. COPY: fora «(NOT-04)» i «(NOT-05)» dels confirms — «S'enviarà el correu
   d'obertura a tots els socis actius» i para (brief §1). «Socis» com a única
   forma: capçalera i tot el copy (fora «Sòcies»/«les sòcies»).
5. CODI: «únic per cooperativa» ES MANTÉ (és el model correcte — B-23 arregla
   l'índex global actual); la pista del camp deixa de prometre la numeració de
   comandes (B-24 pendent): «Únic per cooperativa · identifica el cicle a les
   llistes» i para.
6. FIXTURE coherent amb Comandes (congelada): S33 = 23 comandes · 990,52 €
   (total FACTURABLE, mateixa regla que el peu de Comandes: exclou Cancel·lades
   i Caducades) · 18 socis; S32 = les mateixes xifres que l'escenari «cicle
   passat» de Comandes (les seves 8 files C32 i la seva suma facturable).
7. A11Y §3.14: els DOS diàlegs amb role="dialog" + aria-modal + nom + Esc +
   trampa de focus; botons de paginació amb nom; «Cicles per pàgina» amb
   aria-haspopup/expanded; els camps Obre/Tanca del diàleg puntual com a botons
   amb nom (no divs); el rang del peu com a role="status".
8. ESCENARIS + FOSC: per defecte · tenant nou (buit honest: «El primer cicle es
   crearà diumenge a la nit» — sense CTA de creació setmanal) · 24/7
   (explicador: aquesta cooperativa no fa cicles; el SPEC anota que l'ítem de
   nav s'amaga per a tenants 24/7) · mode fosc com a wrapper dc-import.
9. SPEC: cita B-22 (avui el cron crea el cicle ja OBERT diumenge a la nit;
   Esborrany i les transicions a Completat/Tancat no tenen escriptor — la vista
   dibuixa el model objectiu), B-23 i B-24.
```

**Doc fallout:** REQUIREMENTS 0.4.16 (ACYC-01/02/03 amended; new **B-22**, **B-23**, **B-24**) · DESIGN-BRIEF 0.2.13 (§3.3: Cicles moves from §18 candidate to anti-example) · TASKS 0.1.27 (new D.14; 2.5 notes) · eco-store TASKS/BACKLOG v0.42 (B-22/23/24 rows in Phase 12 + schema table).

---

## Round 14.1 — 2026-08-25 · Cicles v2 verified (9/9) + retrieval-filter amendment

**Verification, against source:** all nine package points applied, with over-deliveries.

1. ✅ The Cicle column renders `order_cycles.name` as the identity link (S32 even deep-links to the «Comandes (cicle passat)» wrapper); no chevron column; sr-only «Accions» header.
2. ✅ No KPI-cards, no filter bar; the DS sheet's §18 declares Cicles an anti-example with the full reasoning.
3. ✅ Real ⋮ menu: Obre les comandes · Llista de preparació · Edita el cicle on **any** Esborrany (with the honest «la cadència setmanal es canvia des de Botiga» explainer) · separator · conditional override — full Socis kit (named trigger, `role="menu"`, arrows + Home/End + Esc, focus-first-on-open, focus return, menu flip near the fold). Esborrany chip on `draft`; the icon subset dropped `edit` and gained `draft`/`stylus`/`print` — cleaner than asked.
4. ✅ No spec IDs in operator copy; «Socis» single form throughout. Over-delivery: the «Marca com a completat» warn is now state-aware and matches the S32 fixture one-to-one («5 lliurades, 1 cancel·lada, 2 caducades. No s'envia cap correu»).
5. ✅ Code hint stops at «identifica el cicle a les llistes».
6. ✅ Fixture coherent: S33 = 23 · 990,52 € · 18; S32 = 8 · 235,67 € · 7 with the COUNT-DISTINCT note (the RGPD orphan doesn't count); the column is honestly labelled «Total facturable».
7. ✅ Both dialogs: `role="dialog"` + `aria-modal` + `aria-labelledby` + focus trap with Esc + focus return; named pagination with `aria-disabled`; per-page trigger with the menu kit (`menuitemradio`/`aria-checked`); the Obre/Tanca fields are real named `<button aria-haspopup="dialog">`; footer range `role="status"`; inputs with `aria-label` + `aria-describedby`. The shell header also gained menu aria — bonus.
8. ✅ Scenarios as props + wrappers («Cicles (tenant nou)», «(botiga 24-7)», «(mode fosc)»); the 24/7 explainer hides the nav item and offers «Obre Comandes»; tenant nou is the honest «El primer cicle es crearà diumenge a la nit».
9. ✅ SPEC cites B-22/B-23/B-24 and the target state machine.

**Amendment 14.1 — retrieval filters (user request, accepted with a scope line).** The round-14 ruling rejected a **state** filter and stands (near-singleton states). The user asked for date/name lookup — a different job, and real: by year two, finding «el cicle de Sant Joan» means paging through 50+ closed rows; the round-14 SPEC already conceded a year selector «eventually». Resolution: the standard **§05 bar, minimal form** — search left («Cerca per nom o codi…», 300px) + an **any (year) exclusive axis** rendered only when history spans more than one year, with the 12.1 conditional reset and filtered-empty state inherited for free. Still no state filter; the §18 anti-example is nuanced, not reopened.

### Change package — 14.1 retrieval filters (paste into Claude design)

```text
Cicles — esmena 14.1 (la verificació 9/9 està feta; això és l'única resta).
Filtres de RECUPERACIÓ, no d'estat:

1. Vista Cicles guanya la barra §05 mínima: cerca a l'ESQUERRA («Cerca per nom o
   codi…», 300px) + un eix d'ANY com a grup exclusiu («Tots · N» «2026 · N»
   «2025 · N») que només es renderitza quan l'històric abasta més d'un any.
   Reset «Neteja els filtres» per la regla 12.1 (condicional, focus a la cerca)
   i l'estat buit filtrat amb el mateix reset com a acció primària.
   CAP filtre d'estat: la decisió de la ronda 14 es manté.
2. Fixture: allarga l'històric fins a finals del 2025 (setmanes 49–52) perquè
   l'eix d'any es mostri amb «Tots / 2026 / 2025» i el paginador passi de dues
   pàgines.
3. Eco Admin DS §18 — matisa l'anti-exemple de Cicles: «cap KPI-card ni filtre
   d'ESTAT; la recuperació (cerca + eix d'any) va per la barra de §05».
4. SPEC: la cerca busca per name i code; l'eix d'any deriva de startsAt.
```

**Doc fallout (14.1):** REQUIREMENTS 0.4.17 (ACYC-01: retrieval filters per §05, never state) · TASKS 0.1.28 (D.14 verified; freeze gated on 14.1). Cicles freezes when 14.1 is verified.

---

## Round 14.2 — 2026-08-25 · Amendment 14.1 verified — Cicles frozen

All four points verified in source:

1. ✅ Minimal §05 bar: search left (aria-label + ref), exclusive year axis with `aria-pressed` and live «· N» counts, rendered only when `years.length > 1`; the 12.1 reset is conditional (`anyF`), clears search + year + page and returns focus to the search input via a ref retry; the filtered-empty state («Cap cicle no coincideix amb els filtres») offers the tonal reset as its primary action. No state filter.
2. ✅ Fixture extended into 2025 (setmanes 49–52) — the year axis and third page are demonstrable.
3. ✅ DS §18 anti-example nuanced verbatim: «cap KPI-card ni filtre d'ESTAT; la recuperació (cerca + eix d'any) va per la barra de §05 (esmena 14.1)».
4. ✅ SPEC records search on `name`/`code`, the year axis derived from `startsAt`, the conditional render and the 12.1 reset rule.

**Cicles — list, dialogs and its 3 scenario states (+ dark) — FROZEN.** Build against REQUIREMENTS ACYC-01..03 (0.4.17) and the round-14 rulings; construction gates: B-22 (state writers), B-23 (per-tenant unique code — the fuse), B-24 (order numbering). Remaining design surface: **Botiga, Estadístiques, Superadmin** and the mobile files.

---

## Round 15 — 2026-08-25 · Botiga (full review)

**Scope:** `Vista Botiga.dc.html` read as source, cross-checked against the full `tenants` schema (24 fields — no `reopenAt`, no `accessModel`), the `EcoStoreTenantLogistics` TypeScript shape (orderWindow + options[] with tiers/slots/instructions), `tenant_addresses` (exists, full field set), `cycle_cron.pb.js`, REQUIREMENTS ACFG-01..10 and the frozen fixtures.

**Verdict: the strongest first-draft view since Comandes — the SPEC already carries the real field shapes (logo mimetypes + 2,5 MB + no-SVG, `shortName` ≤12, `languages` maxSelect 3, the exact orderWindow and options[] shapes, the cron-fixed cadence with the skip-cycle warning) and the tiers editor matches the TS model to the letter. But it draws one backend promise that has no field and no writer, omits two required sections, and the a11y kit stops at the four switches.**

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Severity |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **«Reobertura automàtica» is invented end to end.** The close dialog offers timer presets and the closed banner interpolates a reopen date — but `tenants` has **no** `reopenAt`/`closedUntil` field and nothing ever reopens a store (the 15-min watcher only touches cycles). Same class as B-19's stock return: no field, no writer, drawn as reality → **B-25** (proposal: `tenants.reopenAt` + a watcher branch — genuinely valuable, it's the cure for «forgot to reopen» that the skip-cycle warning only diagnoses). Per the B-19 precedent (no schema backing → copy leaves), the timer section exits the dialog until B-25 is decided | critical |
| 2   | **ACFG-10 «Visualització» is missing** — round 9.1 added it to the brief's view 7 (two default-on display toggles + the hidden-global-categories list); the mock never drew it. Build stays gated on B-16, but the view is its contracted home                                                                                                                                                                                                                                                                                                                                                                                                  | major    |
| 3   | **The pickup-point editor is undrawn** — ACFG-08 is a MUST and its core interaction (create/edit a `tenant_addresses` point: name, address, phone, active, default, per-weekday slots, i18n instructions) has only a pencil with no destination. The «Cicle puntual» dialog is the in-system precedent for small entity forms                                                                                                                                                                                                                                                                                                                   | major    |
| 4   | §3.14 stops at the switches: the close dialog is plain divs (no `role="dialog"`/`aria-modal`/name/Esc/trap); pickup and tier `stylus`/`delete` pairs carry **no accessible names** (the round-13 ladder requires them); reason and timer preset chips and the Castellà/English toggles lack `aria-pressed`; «Desa» needs `aria-disabled` when pristine                                                                                                                                                                                                                                                                                          | major    |
| 5   | **«les sòcies» throughout** — banner, section subtitles, fiscal toggle, delivery copy («com arriba la comanda a la sòcia») — against the single-form «Socis» rule (round 3 F8), the project's most-repeated finding                                                                                                                                                                                                                                                                                                                                                                                                                             | major    |
| 6   | Fixture incoherence with frozen Comandes: its Dia filter and rows use **dv.** (divendres) but Botiga's drawn config has no Friday anywhere (delivery = dc. only; pickup slots dc./dj.). Frozen view wins — a dv. slot must exist in the Botiga config                                                                                                                                                                                                                                                                                                                                                                                           | minor    |
| 7   | `closedReason` is i18n JSON but the custom-reason input is single-language — the SPEC must state the rule (presets translate app-side; custom writes the active language and falls back to CA)                                                                                                                                                                                                                                                                                                                                                                                                                                                  | minor    |
| 8   | ACFG-05 (hero/content fields) rightly undrawn — but the SPEC doesn't say why; one gating line needed. Same for scenarios: no `escenari` prop (closed state only reachable by clicking) and no dark/tancada/24-7 wrappers                                                                                                                                                                                                                                                                                                                                                                                                                        | minor    |

**What works — protect it:** the open/close hero banner first with the honest, specific skip-cycle warning («si continua tancada diumenge a la nit, el cicle de la setmana que ve no es crearà») · the cadència-fixa inline note mirroring Cicles · the tiers model exactly as shipped (`{min, cost}[]`, highest matching tier wins, base cost as fallback) · the ≥1-active-pickup guard · language toggles with the conservation note («els continguts es conserven però deixen de mostrar-se») · `role="switch"` + `aria-checked` on all four switches · timezone placed inside Finestra where it matters · description 400-char cap with per-language tabs · the mock **correctly refuses to draw `accessModel`** (REQUIREMENTS invented it — no schema field, no TS type → **B-26**, requirements-side).

### Change package — Botiga v2 (paste into Claude design)

```text
Botiga — ronda 15. Un fitxer + escenaris. El SPEC ja és dels bons; això el remata:

1. FORA «Reobertura automàtica»: cap camp ni procés no reobre la botiga (B-25,
   pendent de backend) — el diàleg de tancament es queda amb motiu + avís de
   salt de cicle, i el banner tancat diu només el motiu. Quan B-25 existeixi,
   tornarà. El SPEC ho cita com a model objectiu.
2. NOVA secció «Visualització» (ACFG-10, ronda 9.1): dos commutadors per defecte
   actius — «Mostra els productes esgotats» i «Mostra les categories sense
   estoc» — i la llista de categories globals amagades per a aquesta cooperativa
   (cerca + treu). SPEC: gated en B-16/AQ-14 (avui no hi ha camps; és el
   contracte de la UI).
3. EDITOR de punt de recollida (ACFG-08): diàleg com el «Cicle puntual» de
   Cicles — nom, adreça, població, CP, província, telèfon, actiu, per defecte,
   franges per dia de la setmana (afegeix/treu), instruccions d'arribada i18n
   (pestanyes per idioma actiu). Esborrar amb confirm §08; el punt per defecte
   no es pot desactivar sense triar-ne un altre. El nom del punt és l'enllaç a
   l'editor (DS §04 identitat = enllaç); el parell stylus/delete guanya
   aria-label i title per fila («Edita/Elimina 'Mercat de Sant Andreu'»).
4. A11Y §3.14: el diàleg de tancament amb role="dialog" + aria-modal + nom +
   Esc + trampa i retorn de focus; els presets de motiu i els xips de
   temporitzador (mentre existeixin) com a grup exclusiu amb aria-pressed;
   Castellà/English amb aria-pressed; «Desa els canvis» amb aria-disabled quan
   no hi ha canvis; el parell d'icones dels trams amb noms.
5. COPY: «els socis / el soci» com a única forma a tota la vista (fora «les
   sòcies» — banner, subtítols, fiscal, lliurament).
6. FIXTURE: la Comandes congelada té lliuraments en divendres (dv.) — afegeix
   una franja de dv. (p. ex. al punt «Espai veïnal de Gràcia» o al repartiment)
   perquè la configuració expliqui les dades que l'operador veu a Comandes.
7. SPEC: regla del motiu personalitzat (closedReason és i18n: els presets es
   tradueixen; el text lliure s'escriu en l'idioma actiu amb reserva al català)
   · línia de gating d'ACFG-05 (els camps de portada arriben amb l'esquema INI)
   · nota que accessModel NO existeix a l'esquema (B-26) i no es dibuixa.
8. ESCENARIS + FOSC: per defecte · botiga tancada · 24/7 (finestra desactivada)
   com a props amb wrappers, i el wrapper de mode fosc.
```

**Doc fallout:** REQUIREMENTS 0.4.18 (ACFG-01 loses the scheduled-reopen assumption pending **B-25**; ACFG-07 splits — `accessModel` blocked on **B-26**, no schema field; new B-25/B-26 rows) · TASKS 0.1.30 (new D.15) · eco-store TASKS/BACKLOG v0.43 (Phase 12: 12.13 B-25 scheduled reopen, 12.14 B-26 accessModel definition).

---

## Round 15.1 — 2026-08-25 · Botiga v2 verified (8/8) — Botiga frozen

All eight points verified in source (file 63 → 95 KB):

1. ✅ «Reobertura automàtica» fully out — zero timer/reopen markup; the SPEC records B-25 as the target model («quan B-25 existeixi, el temporitzador torna»).
2. ✅ «Visualització» section: the two default-on switches + the hidden-global-categories list with per-chip remove; SPEC gates on B-16/AQ-14.
3. ✅ Pickup-point editor: a 620px scrollable dialog with the full kit, serving **create and edit** («Nou punt / Edita el punt de recollida» — over-delivery), plus a §08 delete confirm; the point's name opens the editor (identity rule, button-to-dialog semantics) and the `stylus`/`delete` pair carries per-row names.
4. ✅ Three dialogs with `role="dialog"` + `aria-modal` + `aria-labelledby` + trap/Esc/focus return; 5 `aria-pressed` groups; «Desa els canvis» with `aria-disabled`.
5. ✅ Zero «sòcies/sòcia» — single form throughout.
6. ✅ dv. slots added (Mercat de Sant Andreu + repartiment) — the frozen Comandes days are now explained by the config.
7. ✅ SPEC carries the custom-reason i18n rule (fallback al català), the ACFG-05 INI-schema gating line and the B-26 no-draw note.
8. ✅ `escenari` prop (per defecte · botiga tancada · 24/7) with the three wrappers, dark included.

**Botiga — view, 3 dialogs and its 3 scenario states (+ dark) — FROZEN.** Build against REQUIREMENTS ACFG-01..10 (0.4.18); gates: B-16/AQ-14 (Visualització), B-25 (reopen timer returns when it ships), B-26 (accessModel decision). Remaining design surface: **Estadístiques, Superadmin** and the mobile files.

---

## Round 16 — 2026-08-25 · Estadístiques (full review)

**Scope:** `Vista Estadístiques.dc.html` (+ its existing dark wrapper) read as source, against the ASTA requirement row (Layer 3, gated on **EST-06** — the per-order stats read API, eco-store BACKLOG 11.1, unbuilt), the `product_categories` schema, brief §3.11/§3.12 and view 10, and the frozen fixtures (Cicles 14.2, Socis 8.2, Comandes 11.2).

**Verdict: the most sophisticated SPEC in the project — and it aged past two freezes.** The dataviz system is genuinely excellent and schema-backed (`product_categories.color` exists; the ΔE + deutan/protan distinguishability check with tonal-ramp fallback; the nice() y-axis ladder; B-12 honesty — baixes deliberately unplotted «rather than plotting a series that cannot be derived»; the 24/7 mode hides the whole «Per cicle» zone; bars are keyboard-focusable divs with per-bar names in all three charts). The faults are all reconciliation and gating:

| #   | Finding                                                                                                                                                                                                                                                                                                                                                              | Severity |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **Fixture drift past the round-14 freeze:** the 8-cycle series carries S32 = 2.310 and S33 = 1.842,5 where frozen Cicles says **235,67** and **990,52**; the per-cycle KPI and the SPEC's own reconciliation clause («all 6 categories = the full 1.842,50 €») anchor to the stale number. S26–S31 match the frozen table exactly — only the two live cycles drifted | major    |
| 2   | **The facturable rule is absent** — «facturable» appears nowhere; sales figures must follow the same definition as the Comandes footer and the Cicles column (exclou Cancel·lades i Caducades) and say so next to the KPI                                                                                                                                            | major    |
| 3   | **EST-06 is uncited** — every aggregate in the view (per-category series, period stats, «Més venuts») needs the per-order stats API that doesn't exist; the SPEC gates nothing (the Botiga «Visualització»/B-16 precedent applies). The ASTA row's zip-level stats and stock-alert demand are also unscoped                                                          | major    |
| 4   | Socis zone reconciles to **49** comptes (42+5+2) — frozen Socis says **50** (the 1 suspès is still an account and `users.created` includes it)                                                                                                                                                                                                                       | minor    |
| 5   | **Zero `aria-pressed`** — the €\|comandes metric toggles, the three «Taula» toggles and the category multiselect chips expose no state (§3.14)                                                                                                                                                                                                                       | minor    |

### Change package — Estadístiques v2 (paste into Claude design)

```text
Estadístiques — ronda 16. Quatre correccions i una regla; l'aparell de dataviz
(ΔE, nice(), colors per categoria de product_categories.color) es queda tal qual.

1. FIXTURE amb els cicles congelats (rondes 11–14): S32 = 235,67 € (8 comandes,
   En procés) i S33 = 990,52 € (23 comandes) — a la sèrie BW, a la KPI del cicle
   i a la clàusula de reconciliació del SPEC (les 6 categories sumen 990,52 €,
   no 1.842,50). S26–S31 ja quadren i no es toquen.
2. REGLA DE VENDES: totes les xifres de vendes d'aquesta vista són FACTURABLES —
   exclouen Cancel·lades i Caducades, la mateixa regla que el peu de Comandes i
   la columna de Cicles. Una línia visible al costat de la KPI del cicle
   («total facturable») i la definició al SPEC.
3. ZONA SOCIS: el total quadra amb la Socis congelada — 50 comptes = 42 actius +
   5 en prova + 2 inactius + 1 suspès (el suspès també és un compte; la sèrie
   d'altes per users.created l'inclou).
4. ARIA-PRESSED als commutadors: € | comandes, «Taula» i els xips del
   multiselect de categories exposen l'estat, com mana §3.14.
5. SPEC: TOT el que agrega comandes aquí està gated en EST-06 (l'API de lectura
   d'estadístiques per comanda — BACKLOG eco-store 11.1); sense EST-06 no hi ha
   «Més venuts» ni sèries per categoria. Les estadístiques per codi postal i la
   demanda d'avisos d'estoc (fila ASTA) arriben més tard amb PRV-08/BOT-13a —
   anota-ho com a abast futur.
```

**Doc fallout:** REQUIREMENTS 0.4.19 (ASTA row: facturable rule + fixture alignment note) · TASKS 0.1.32 (new D.16).

---

## Round 16.1 — 2026-08-25 · Estadístiques v2 verified (5/5) — Estadístiques frozen

1. ✅ Frozen-fixture totals everywhere: the 8-cycle series, the per-cycle KPI and the SPEC reconciliation clause now carry S32 = 235,67 € and S33 = 990,52 €; no trace of 1.842,5/2.310.
2. ✅ The facturable rule is visible next to the cycle KPI («facturable — exclou les comandes Cancel·lades…»), echoed in «Per dates» («facturables del període») and defined in the SPEC.
3. ✅ Socis zone reconciles to 50 (42 + 5 + 2 + 1 suspès).
4. ✅ `aria-pressed` on all 11 toggle controls (metric, Taula ×3, category multiselect).
5. ✅ SPEC gates every aggregate on EST-06 (BACKLOG eco-store 11.1) and scopes zip-level stats + stock-alert demand as future (PRV-08/BOT-13a).

**Estadístiques — view + dark wrapper — FROZEN.** Build is Layer 3: gated on EST-06 regardless of the design freeze. Remaining design surface: **Superadmin** and the mobile files.

---

## Round 17 — 2026-08-25 · Superadmin (full review)

**Scope:** `Vista Superadmin.dc.html` read as source, against ATNT-01..06 + AGLB-01..04, the §2.2 privacy boundary, the round-5 C6 nav ruling, B-08, the `tenants`/`category_groups` schemas (a false alarm on `category_groups` rules was self-caught: `''` is public, not locked) and the frozen Categories/Socis fixtures.

**Verdict: strong L2 craft — the dark platform rail, the 3-step onboarding with inline slug collision, the typed-name cascade delete with per-coop breakdown, suspension semantics true to the cron (`active=false` really does skip generation), and the mock rightly draws no tenant delete (ATNT-05 WON'T). But it re-litigates a settled ruling, invents its own requirement IDs, and ships a state no field supports.**

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                      | Severity |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **«Comptes» as a root nav item re-litigates round-5 C6** — the ruling (applied to DS §12 v0.2) and ATNT-06 place TENANT_ADMIN account management **inside each tenant's context**, never as a cross-tenant list. SUPERADMIN account management belongs to no requirement at all → **AQ-17** (proposal: console-only for v1 — there are two superadmins; a UI is unjustified) | major    |
| 2   | **The SPEC cites invented requirement IDs** («ASUP-01/02/03») — the families are ATNT and AGLB; five reviews of operator-copy discipline don't excuse spec-side fiction either                                                                                                                                                                                               | major    |
| 3   | **«Onboarding» status has no schema source** — `tenants` has `active` + `closed` bools; three chip states from two bools leaves Onboarding underivable as drawn → **B-27** (derive it declaredly or add a field; until then the chip is target-model with the SPEC citing B-27)                                                                                              | major    |
| 4   | **The wizard cannot create the record it promises**: step 1 draws nom + slug + província + zona horària, but `tenants.name/email/phone/address` are **required** by schema (and the slug is `normalizedName`, not an invented `ecoplatform.coop` scheme). The TA-account creation also needs **B-08** cited (today it would ride the G-01 hole)                              | major    |
| 5   | **Tenant-context entry — the core GA workflow — is undrawn**: the brief demands a top-bar tenant-context selector; the row offers only an unnamed icon-only `settings` button (round-13 grammar: identity cell not a link, no named affordance, no menu)                                                                                                                     | major    |
| 6   | Fixture vs frozen views: El Llevat shows **124** members (frozen Socis: **50**); the groups pane gives «Llar i altres» a **global** «Higiene» (frozen Categories: zero globals there — Higiene i llar is Pròpia) and drops Conserves from Rebost i begudes; the cascade breakdown says El Llevat Fresc = 44 products (frozen Categories: 35+24+15+12 = **86**)               | major    |
| 7   | «sòcies» (×4: header count, column, module hint) + «administradora» against the single-form rule; both dialogs are plain divs (no §3.14 kit); inputs unlabelled; province/timezone selects are `<div cursor:pointer>` (the Botiga precedent made them named buttons); L2 nav without `aria-current`; no dark wrapper                                                         | major    |

**What works — protect it:** the visually distinct dark L2 rail + «Àmbit: tota la plataforma» badge + SUPERADMIN top-bar chip · onboarding stepper with inline slug collision and the honest invitation copy · «l'últim TENANT_ADMIN d'un tenant actiu no es pot revocar» guard · suspension semantics that match `cycle_cron` reality · module chips derived from real fields (`fiscalDataEnabled`, `logisticsConfig.options[].enabled`) · escalated typed-name group delete with per-coop breakdown (the §08 + Categories >50 lineage) · no tenant delete drawn.

### Change package — Superadmin v2 (paste into Claude design)

```text
Superadmin — ronda 17. Un fitxer + fosc.

1. NAV: fora «Comptes» com a ítem arrel (ronda 5 C6 + ATNT-06) — els comptes
   TENANT_ADMIN es gestionen DINS del context de cada cooperativa; la gestió de
   comptes SUPERADMIN no és de cap requisit (AQ-17: consola only per v1). Fora
   els IDs «ASUP-nn» del SPEC: les famílies són ATNT i AGLB.
2. CONTEXT DE TENANT — el flux central del GA: selector de context al top bar
   (brief §10) i, a la fila, el nom de la cooperativa és l'ENLLAÇ que entra al
   context (DS §04). El settings sense nom es converteix en ⋮ amb el kit de
   Socis: Entra al context · Edita la fitxa · — · Suspèn/Reactiva… (confirm de
   conseqüències: tanca la botiga pública i el cron salta els cicles).
3. ESTAT «Onboarding»: cap camp el suporta (B-27) — el chip es manté com a model
   objectiu i el SPEC ho cita (derivació declarada o camp nou, pendent).
4. WIZARD pas 1 amb els camps REQUERITS de l'esquema: adreça electrònica,
   telèfon i adreça postal (tenants.email/phone/address són required) — i el
   slug és tenants.normalizedName (fora el domini inventat: el SPEC diu que la
   resolució és per host). La creació del compte TA cita B-08 com a gate.
5. FIXTURE congelat: El Llevat = 50 socis; grups exactes de la Categories
   congelada — Fresc 4 · Rebost i begudes 3 (amb Conserves) · Llar i altres
   SENSE globals (només la nota «també conté les pròpies dels tenants»); el
   desglossament del confirm d'esborrat de Fresc usa El Llevat = 86 productes.
6. COPY: «socis» com a única forma (fora «sòcies», «administradora» → «admin»).
7. A11Y §3.14: els DOS diàlegs amb role="dialog" + aria-modal + nom + Esc +
   trampa + retorn; inputs amb aria-label; Província/Zona horària com a botons
   amb nom; nav L2 amb aria-current="page"; tota icona sola amb nom.
8. FOSC: wrapper «Superadmin (mode fosc)».
```

**Doc fallout:** REQUIREMENTS 0.4.20 (new **B-27** tenant-lifecycle state, new **AQ-17** GA-account management — proposal console-only v1; ATNT-01/02 notes) · TASKS 0.1.34 (new D.17) · eco-store TASKS/BACKLOG v0.44 (Phase 12: 12.15 B-27).

---

## Round 17.1 — 2026-08-25 · Superadmin v2 verified (8/8) — freeze held

All eight points applied, several over-delivered:

1. ✅ «Comptes» gone; SPEC cites ATNT/AGLB + AQ-17 («comptes SUPERADMIN sense UI: consola only v1»); no invented IDs.
2. ✅ Top-bar context selector (role=menu, keyboard, tenant list) + row name as «Entra al context» link + a full-kit ⋮ (Entra al context · Edita la fitxa · — · **Suspèn…/Reactiva, state-aware** with play_arrow on suspended rows).
3. ✅ Onboarding chip kept as target model, SPEC cites B-27.
4. ✅ Wizard step 1 carries all schema-required fields (email, telèfon, adreça postal) with validation gating; the slug is honestly `normalizedName` with host-resolution copy; no invented domain.
5. ✅ Fixture: El Llevat = 50; header «238 socis» = the row sum; groups match frozen Categories (Fresc 4 · Rebost i begudes 3 amb Conserves · Llar i altres sense globals); cascade shows El Llevat Fresc = 86 and **totals computed from the per-coop rows** — «Llar i altres» would honestly cascade «3 categories pròpies dels tenants».
6. ✅ «socis»/«admin» single form throughout.
7. ✅ Both dialogs full kit; labelled inputs; listbox-buttons for Província/Zona horària; `aria-current` nav; named icon pairs; `scope="col"`; sr-only Accions.
8. ✅ «Superadmin (mode fosc)» wrapper exists.

**Two residuals (one line each):**

1. The step-2 info box puts a requirements ID in operator-visible copy: «**Gate B-08**: l'excepció GA de "users"…» — the invitation sentence before it is perfect; the gate sentence moves to the SPEC block (brief §1).
2. «Slug (normalizedName)» + the hint name a schema field in visible copy — which raises a fair question the rule never answered: **L2's only audience is the platform operator, who is technical.** Proposal for Carlos: an explicit brief §1 carve-out — _GA-only (L2) screens may name schema fields where precision helps; requirement IDs stay SPEC-only everywhere._ If accepted, the slug label stands and only the B-08 sentence moves; if declined, the label becomes «Slug».

**Freeze held** — not for the residuals (one-liners) but because the user flagged their own concerns pending review. Superadmin freezes after both are resolved.

---

## Round 17.2 — 2026-08-25 · Carlos's review: the boundary closes (Superadmin v3)

**Trigger:** the user ruled that superadmins must not enter tenant backends nor see sensitive figures like member counts, and flagged missing views (tenant detail, language management) plus a global-config completeness question.

**The ruling was already the contract — the mock and round 17's own package broke it.** REQUIREMENTS §2.2 (decision 2026-08-10) says verbatim: «GLOBAL_ADMIN administers tenants, not tenant data … GA never enters a tenant's operational modules». Round 17's «Entra al context» pointing at the tenant Tauler, and the «Socis» count column, both violate it — **the reviewer's package over-reached and this round corrects its own round**. Worse, the schema audit shows the boundary was never enforced API-side: **the list/view rules grant `GLOBAL_ADMIN` read over `users`, `orders`, `carts`, `user_addresses` and `user_fiscal_profiles` (fiscal PII)** → **B-28**, the most privacy-serious finding since B-11.

**Rulings:**

1. **No tenant-backend entry, anywhere**: «Entra al context» (row + ⋮), the top-bar «Context» selector and «Surt al tenant demo» all leave. The cooperative's name opens its **fitxa inside Superadmin** — a record-only detail view. §2.2's «tenant selector» sentence is amended to match (the list is the selector; the fitxa is the record screen).
2. **No member counts**: the «Socis» column and «238 socis en total» leave (member-derived aggregates are tenant data). Replaced by an **«Admins» column** (TENANT_ADMIN account count — GA-managed under B-08, and it surfaces cooperatives left without an admin). The cascade-delete **product** counts stay: a destructive confirm must state its blast radius (SPEC-justified exception).
3. **New view — tenant fitxa** (ATNT-04/06 home): header (name, slug, status, Suspèn/Reactiva), Identitat i contacte + Presentació (the `tenants` record, reusing Botiga's form components), Mòduls, and **Comptes TENANT_ADMIN** (list, invite, disable; last-admin guard). Zero operational data.
4. **New view — Idiomes** (AGLB-03): the `languages` catalog (code, name, active, order) as the third nav item — **read-only with disabled controls and a visible explainer** (the Etiquetes-tab precedent) because writes are superuser-locked until AQ-02 decides. (Schema wart noted: the field is `Active`, capitalized — against the camelCase convention.)
5. **Global-config completeness audit** (the user's question): global surfaces = `tenants` ✓, `category_groups` + global `product_categories` ✓, `languages` → the new Idiomes view, `_superusers` → console (AQ-17), `tags` → per-tenant (via a `client` field — naming wart for B-18's file). SMTP/deploy are ops, outside the admin app. **With Idiomes, the surface is complete.**
6. The 17.1 one-liners resolve conservatively: the «Gate B-08…» sentence moves to SPEC; «Slug (normalizedName)» becomes «Slug» (the L2 carve-out stays proposed, not approved).

### Change package — Superadmin v3 (paste into Claude design)

```text
Superadmin — ronda 17.2 (revisió de Carlos). La frontera es tanca: el GA gestiona
REGISTRES de tenant, mai el backend del tenant ni les seves dades.

1. FORA l'entrada al context: ni «Entra al context» (fila i ⋮), ni el selector
   «Context: …» del top bar, ni «Surt al tenant demo». El nom de la cooperativa
   obre la seva FITXA dins de Superadmin (punt 3).
2. FORA el recompte de socis: ni columna «Socis» ni «238 socis en total» — és
   dada operativa del tenant (§2.2; B-28 en retira també l'accés per API). La
   columna passa a «Admins» (recompte de comptes TENANT_ADMIN — B-08) i permet
   detectar cooperatives sense admin. Els recomptes de PRODUCTES del confirm
   d'esborrat en cascada ES QUEDEN: un confirm destructiu ha de dir el seu abast
   (el SPEC ho justifica com a excepció).
3. NOVA vista: FITXA de cooperativa (ruta pròpia dins Superadmin) — capçalera
   (nom, slug, estat, Suspèn/Reactiva amb confirm), seccions: Identitat i
   contacte + Presentació (el registre tenants, reutilitzant els components de
   formulari de Botiga), Mòduls, i COMPTES TENANT_ADMIN (llista, convida,
   desactiva; guard de l'últim admin d'un tenant actiu). Cap dada operativa.
4. NOVA vista: IDIOMES — tercer ítem de nav. El catàleg languages (codi, nom,
   actiu, ordre), NOMÉS LECTURA amb controls desactivats i explicador visible
   (com la pestanya Etiquetes): l'escriptura està bloquejada a superusuari
   (AQ-02 pendent). El SPEC ho cita.
5. Línies pendents de 17.1: la frase «Gate B-08…» surt del quadre del pas 2 i
   va al SPEC; «Slug (normalizedName)» passa a «Slug» (el nom del camp, a
   l'hint del SPEC).
6. FOSC: el wrapper cobreix les tres subvistes (llista, fitxa, idiomes).
```

**Doc fallout:** REQUIREMENTS 0.4.21 (§2.2 selector sentence amended; ATNT-01 Admins column; ATNT-04 fitxa-not-context; ATNT-06 lives in the fitxa; AGLB-03 view designed read-only; new **B-28**) · DESIGN-BRIEF §10 (Superadmin nav: Cooperatives · Catàlegs globals · Idiomes; no context selector) · TASKS 0.1.36 (D.17 scope grows to v3) · eco-store TASKS/BACKLOG v0.45 (Phase 12: **12.16 B-28**, HIGH — strip GA from operational list/view rules).

---

## Round 17.3 — 2026-08-26 · Carlos's second pass: the fitxa shrinks to the essential (Superadmin v4)

**v3 verification first:** everything from 17.2 applied — context entry gone (0 hits), «Admins» column with `openFitxa` on the name, the fitxa with the no-admin warning and the last-admin guard, read-only Idiomes, the B-08 sentence out of operator copy, «Slug» label. **But the fitxa carries editable identity inputs, a «Presentació» section (description + «Canvia el logotip») and Mòduls toggles — and the logo copy re-introduces «PNG o SVG», which round 5 C1 banned.** The root cause is ATNT-04 itself: since 2026-08-10 it said «edit … identity, branding, toggles, logisticsConfig» — the requirement over-scoped, the mock obeyed it, and the SVG regression on first iteration is the proof of the underlying law: **duplicated edit surfaces drift; every field gets one owner.**

**Real-case analysis (the user's framing):** onboarding (wizard) · pre-handover corrections (no admin exists yet) · admin-access recovery (the one recurring case) · suspension (non-payment, dissolution, abuse) · slug change (console — breaks URLs) · everything else — identity typos, logo, slogan, modules, logistics — is the tenant admin's job in Botiga (ACFG-02/03/04/07 already cover every field). **The GA edits nothing a tenant can edit for itself.**

**Rulings:**

1. **ATNT-04 rewritten at the root**: the GA's surface over a live tenant = lifecycle (Suspèn/Reactiva) + TA-account recovery. The fitxa is a **read-only record summary** (name, slug, contact, province, timezone, module chips, status, created) — no inputs, no logo, no description, no toggles.
2. **Onboarding exception**: while the state is «Onboarding» (B-27), «Edita les dades bàsiques» reopens wizard step 1 — the coop has no admin yet to fix its own data. It disappears on Activa/Suspesa.
3. **Modules**: initial set in the wizard stays; afterwards TA-owned (`fiscalDataEnabled` = ACFG-07, delivery/pickup = ACFG-02). Toggles leave the fitxa.
4. **AQ-18** (the user's explicit question): day-to-day co-admin management could move to the tenant (a future «Equip» section in Botiga — requires a `users`-rule change letting a TA create/disable TENANT_ADMIN accounts in its own tenant). Proposal: **split by job** — GA keeps recovery only (B-08: rare, critical); TA self-service post-v1. And **Desactiva, never delete**: account deletion is the RGPD flow; disabling keeps the trace.

### Change package — Superadmin v4 (paste into Claude design)

```text
Superadmin — ronda 17.3 (revisió de Carlos, 2a passada). La fitxa es queda en
l'ESSENCIAL: el GA no edita mai el que el tenant pot editar-se.

1. FITXA NOMÉS LECTURA: fora els inputs d'Identitat i contacte, fora TOTA la
   secció Presentació (descripció, logotip) i fora els commutadors de Mòduls —
   tot això és de l'admin del tenant, a Botiga (ACFG-02/03/04/07). La fitxa
   mostra el resum del registre (nom, slug, contacte, província, zona horària,
   mòduls com a XIPS, estat, data de creació) sense cap control d'edició.
2. EXCEPCIÓ D'ONBOARDING: mentre l'estat és «Onboarding» (cap admin ha pres el
   relleu), un botó «Edita les dades bàsiques» reobre el pas 1 del wizard per
   corregir errades. En estat Activa/Suspesa desapareix: les correccions són
   feina de l'admin del tenant, a Botiga.
3. Es queden les DUES úniques accions del GA sobre un tenant viu: Suspèn/
   Reactiva (amb el confirm de conseqüències) i COMPTES TENANT_ADMIN (convida /
   desactiva — mai esborrar: conserva la traça, l'esborrament de comptes és el
   flux RGPD; guard de l'últim admin; avís de «cap admin»). El SPEC llista els
   casos reals: recuperació d'accés, suspensió, correcció pre-relleu.
4. SPEC: canvi de slug = consola only (trenca URLs) · AQ-18 anotada — la gestió
   d'admins addicionals del dia a dia podria passar al tenant (secció «Equip» a
   Botiga, post-v1, amb canvi de regles de users); el GA conserva NOMÉS la
   recuperació (B-08).
5. El text «PNG o SVG» desapareix amb la secció del logotip (l'esquema no admet
   SVG — ronda 5 C1; el drift entre superfícies duplicades és exactament el
   motiu d'aquesta ronda).
```

**Doc fallout:** REQUIREMENTS 0.4.22 (ATNT-04 rewritten — read-only fitxa + lifecycle + recovery; ATNT-02 gains the onboarding-phase edit note; new **AQ-18**) · DESIGN-BRIEF 0.2.15 (§10 fitxa description tightened) · TASKS 0.1.37 (D.17 → v4 pending).

---

## Round 17.4 — 2026-08-26 · Carlos's third pass: minimal birth, TA-completed everything (Superadmin v5)

**v4 verification:** clean — the fitxa is fully read-only («Registre del tenant» with the lock note and the one-owner sentence, module chips, zero inputs, no Presentació, no SVG trace), «Edita les dades bàsiques» gated to Onboarding, Suspèn/Reactiva + TA accounts with the never-delete RGPD note, SPEC correct. Only the wizard's step 3 (module switches) remains — exactly where the user's two questions land.

**Q1 — post-creation basic-data editing.** The user's flow wins: coop asks for signup → GA creates the tenant with the MINIMUM (name, slug, contact email) + the linked TA account → the TA's invitation mail → **the TA fills everything in on first entry**. Schema caveat: `tenants` requires `phone`/`address`/`languages`/`logisticsConfig` at creation → **B-29** (birth defaults: `languages ['ca']`, neutral `logisticsConfig`, phone/address un-required or defaulted, **born `closed=true`** so the storefront is not live until handover). Side effect: **B-27 finally gets its clean derivation** — the handover moment is defined (the TA saves identity + configures ≥1 delivery option → Onboarding → Activa; field vs derivation stays B-27's call, but the moment is now pinned). The onboarding-only «Edita les dades bàsiques» shrinks to the GA-typed trio.

**Q2 — module lifecycle.** The answer already exists and is frozen: after creation **the TA manages them in Botiga** (the Punts de recollida / Repartiment toggles and the Perfil fiscal switch — drawn and frozen at 15.1). Modules are tenant settings, not platform-gated capabilities; the wizard's step 3 only wrote their initial values. Under minimal birth, **step 3 drops** — the TA enables what it needs on first run. → **AQ-19**: v1 = tenant settings, TA-owned; if modules ever become billed platform capabilities, that is a new GA-governed field (B-26 family).

### Change package — Superadmin v5 (paste into Claude design)

```text
Superadmin — ronda 17.4 (revisió de Carlos, 3a passada). L'alta es fa MÍNIMA i el
relleu és del tenant admin.

1. WIZARD DE DOS PASSOS: pas 1 = nom, slug i adreça electrònica de contacte —
   res més (B-29 defineix els valors de naixement: idiomes [ca], logística
   neutra, botiga TANCADA fins al relleu); pas 2 = admin inicial (nom + correu,
   invitació). FORA el pas 3 de mòduls.
2. RELLEU: el SPEC defineix el final de l'Onboarding (lligat a B-27): en la
   primera entrada, l'admin completa Botiga — identitat, contacte, logística —
   i quan desa la identitat i configura almenys una opció de lliurament, el
   tenant passa a Actiu i pot obrir la botiga.
3. «Edita les dades bàsiques» (només Onboarding) es redueix al trio que el GA
   va escriure: nom, slug i adreça electrònica.
4. MÒDULS: fora del wizard; a la fitxa es queden com a XIPS derivats (lectura).
   El SPEC anota AQ-19: en v1 els «mòduls» són configuració del tenant — l'admin
   els activa o desactiva a Botiga (ja dissenyat i congelat a 15.1); si mai
   esdevenen capacitats de plataforma facturables, serà un camp nou governat
   pel GA.
```

**Doc fallout:** REQUIREMENTS 0.4.23 (ATNT-02 rewritten to minimal birth + handover contract; new **B-29** and **AQ-19**; B-27 gains the handover-moment note) · TASKS 0.1.38 (D.17 → v5) · eco-store TASKS/BACKLOG v0.46 (Phase 12: 12.17 B-29).

---

## Round 17.5 — 2026-08-26 · Superadmin v5 verified (4/4) — Superadmin FROZEN, desktop complete

1. ✅ Two-step wizard («Dades» · «Admin inicial»): step 1 = nom + slug + adreça electrònica de contacte with an honest nothing-else note; no step 3, no module switches, no phone/address/province inputs.
2. ✅ The handover contract in SPEC: identity saved + ≥1 delivery option → Actiu, store can open.
3. ✅ «Edita les dades bàsiques» reopens the wizard **limited to the GA-typed trio**; the fitxa's read-only rows render honest pending states («Telèfon: — es completa a Botiga durant el relleu») and the slug row carries the console-only warning inline.
4. ✅ Modules as read-only chips; AQ-19 in SPEC; the Idiomes switches disabled per the Etiquetes precedent.

**Two recorded deviations (two words each, authorized for the next touch):** the wizard's step-1 note says «B-29» and the Idiomes disabled-switch tooltip says «(AQ-02)» — requirement IDs in operator-visible copy (brief §1). After four passes on this view, the friction of another round-trip exceeds the value; the build inherits neither (it builds against REQUIREMENTS, and brief §1 already bans IDs in copy).

**Superadmin — list + fitxa + Idiomes + wizard + dark wrapper — FROZEN at 17.5.** Build against REQUIREMENTS ATNT/AGLB (0.4.23); gates: B-08 (users GA exception), B-27+B-29 (lifecycle + birth defaults), B-28 (strip GA reads — HIGH), AQ-02/17/18/19 as decided.

**Milestone: the entire desktop surface is frozen** — Tauler, Sol·licituds, Socis, Categories, Productes, Comandes, Cicles, Botiga, Estadístiques, Superadmin. Remaining design surface: the mobile files (Sol·licituds/Socis mòbil unreviewed; Tauler/Botiga mobile required by the brief, undesigned).

---

## Round 17.6 — 2026-08-26 · Global catalogs, language lifecycle, and the post-creation question

**Q1a — can the GA create global catalogs?** Yes, already: the CRUD is drawn (frozen at 17.5) and schema-backed — `category_groups` and `product_categories` writes grant GA. But the audit found the symmetric over-grant to B-28: **the GA write branch on `product_categories` is unrestricted** — GA can edit/delete a tenant's OWN categories (tenant data, §2.2). B-28's scope grows: narrow the GA branches to `tenant = null`.

**Q1b — activate/add/remove languages?** The catalog is **disconnected from real usage** → **B-30**: `tenants.languages` is a hardcoded select `['ca','es','en']` (not a relation to `languages`), and translation files/pipeline are code. Adding or removing a language is an **engineering event**, not a data event. What the catalog CAN govern with a one-line rule change is **Active + order** of existing languages — exactly AQ-02. Ruling (proposed resolved by the user's question): open `languages` create/update to GA for Active/order; the Idiomes view's toggles and drag-order go live; «Afegeix un idioma» stays disabled with an honest explainer (B-30). Delete stays out entirely.

**Q2 — post-creation basic-data edits: position held.** The current design already does what the user asks: post-handover the GA edits nothing (name/email → TA in Botiga per ACFG-03; slug → console). The Onboarding-only window exists because (a) no working TA exists yet, and (b) it is the only SAFE moment for slug fixes — no URLs are live. Removing it gains no privacy (the GA typed those three fields) and worsens ops.

### Change package — Superadmin 17.6 touch (authorized on the frozen view)

```text
Superadmin — ronda 17.6 (retoc autoritzat sobre la vista congelada).

1. IDIOMES esdevé editable en l'àmbit que AQ-02 obre: el commutador Actiu i
   l'ordre (arrossega) funcionen — el SPEC cita el canvi de regla (escriptura
   GA a languages, una línia). «Afegeix un idioma» es queda DESACTIVAT amb
   explicador honest: afegir o treure un idioma és feina d'enginyeria de
   plataforma (B-30: el selector de tenants.languages i les traduccions van
   per codi) — cap promesa que el catàleg no pugui complir. Res d'esborrar.
2. Les dues desviacions de 17.5, fora: la nota del wizard perd «B-29» («Res
   més a l'alta: la resta es completa durant el relleu — la botiga neix
   tancada») i el tooltip d'Idiomes perd «(AQ-02)» («Bloquejat: només
   modificable des de la plataforma» — o cap tooltip si el commutador ja és
   actiu).
3. SPEC de Catàlegs globals: anota que la regla d'escriptura GA es restringeix
   a tenant = null (esmena B-28) — el GA mai no toca les categories pròpies
   d'un tenant.
```

**Doc fallout:** REQUIREMENTS 0.4.24 (AQ-02 proposed-resolved: GA writes for Active/order; **B-28 amended** — narrow `product_categories` GA writes to `tenant = null`; new **B-30** — the language catalog is disconnected from `tenants.languages` and the i18n pipeline; ATNT-04 gains the post-handover ownership sentence) · TASKS 0.1.40 · eco-store TASKS/BACKLOG v0.47 (12.18 B-30; 12.16 note grows).

---

## Round 17.7 — 2026-08-26 · The three missing create flows

**17.6 verification first:** applied — the Idiomes Active toggles and drag-reorder are live, «Afegeix un idioma» carries the honest engineering explainer, «(AQ-02)» is gone from the tooltip, the wizard note lost «B-29» (its only remaining mention sits in the SPEC block, where it belongs), and the Catàlegs SPEC notes the `tenant = null` write narrowing.

**The user's finding: «Nou grup», «Categoria global» and «Convida un admin» have no drawn destination** — the same class as Botiga's undrawn pickup-point editor (round 15 #3). Rulings, by the established surface rules:

1. **Nou grup / Edita el grup** (AGLB-01) → **dialog** (Cicle-puntual precedent: tiny form). `category_groups.name` is i18n JSON → CA base required + per-platform-language tabs, empty ones fall back to CA. The same dialog, prefilled, serves the pencil.
2. **Nova categoria global** (AGLB-02) → **no dialog**: reuse the ACAT-02 form frozen at 9.1 (name i18n, required description i18n, group, closed dataviz-safe palette, curated icon) as a **route inside the Superadmin shell** — §3.13 rules forms as pages, and same entity = same form. Declared differences: `normalizedName` unique platform-wide, and the group pre-selected when launched from a group header. The category chips become buttons opening the same form in edit mode (DS §04 identity rule).
3. **Convida un admin** (ATNT-06) → **dialog reusing exactly the wizard's step 2** (nom + adreça electrònica + invitation note); CTA «Envia la invitació»; on send the account appears as «invitació pendent» (a state the fixture already has).

### Change package — Superadmin 17.7 touch (authorized on the frozen view)

```text
Superadmin — ronda 17.7 (retoc autoritzat: els tres fluxos de creació que faltaven).

1. NOU GRUP / EDITA EL GRUP (AGLB-01): diàleg petit (precedent «Cicle puntual») —
   nom i18n amb pestanyes per idioma de plataforma (CA base obligatori; les
   buides cauen al català). El mateix diàleg, preomplert, per al llapis
   d'editar. Kit §3.14 complet.
2. NOVA CATEGORIA GLOBAL (AGLB-02): CAP diàleg — reutilitza el formulari
   d'ACAT-02 congelat a 9.1 (nom i18n, descripció i18n obligatòria, grup,
   color de la paleta tancada dataviz-safe, icona curada) com a RUTA dins del
   shell de Superadmin. Diferències que el SPEC declara: normalizedName únic a
   TOTA la plataforma (no per tenant) i el grup preseleccionat quan s'obre des
   de la capçalera d'un grup. Els xips de categoria del panell són botons que
   obren aquest mateix formulari en mode edició (DS §04: identitat = enllaç).
3. CONVIDA UN ADMIN (ATNT-06): diàleg que reutilitza EXACTAMENT el pas 2 del
   wizard (nom + adreça electrònica + la nota d'invitació); CTA «Envia la
   invitació»; en enviar, el compte apareix a la llista com a «invitació
   pendent». Kit §3.14.
4. En tots tres: validació inline en català i CTA amb aria-disabled mentre
   falten camps obligatoris (patró del wizard).
```

**Doc fallout:** TASKS 0.1.41 (D.17 note). No REQUIREMENTS change — AGLB-01/02 and ATNT-06 already cover the flows; the platform-unique `normalizedName` was already in the Catàlegs SPEC.

---

## Round 18 — 2026-08-26 · i18n fields: the content is the state (DS-level)

**Trigger:** the user ruled the tabbed multilanguage editors unusable — you must click every language tab to learn whether content exists and whether it is valid. The state must be visible at a glance.

**The enabling fact: the platform caps languages at 3** (`tenants.languages` maxSelect 3; today ca+es in production). Stacking is cheap. The round-5 fix (per-tab completeness glyphs, finding E1) treated the symptom; the user's critique kills the disease for most fields.

**Rule (amends DS §09):**

1. **Short i18n fields (single-line inputs — names, slogans, labels): STACKED, never tabbed.** One labelled row per active language, CA (base) always first, a language chip as the row prefix, inline validation per row. Zero clicks: **the content is the state.**
2. **Long i18n fields (textareas, rich editors — descriptions, aboutUs): tabs remain**, but every tab carries **textual** state, never color alone: «CA ✓» · «ES — buit» · «EN — error», plus a summary line under the editor («Traduccions: CA ✓ · ES ✓ · EN buida — caurà al català»). On save with an invalid language, the first invalid tab opens and focuses.
3. The fallback rule (empty → català) stays visible in both forms.

**Rollout (12.1-style authorized touches):** DS §09 redrawn with both variants · the 17.7 «Nou grup» dialog (a short field — loses its tabs, gains the stack) · Botiga «Descripció» (long → tabs-with-state + summary) · Categories and Producte forms (short names stacked; long descriptions tabs-with-state) · the ACAT-02 reuse note inherits automatically.

### Change package — i18n fields (paste into Claude design)

```text
Eco Admin — ronda 18 (regla de sistema + desplegament autoritzat a vistes
congelades). Els camps multiidioma deixen d'amagar l'estat: amb un màxim de 3
idiomes de plataforma, apilar és barat.

1. Eco Admin DS §09 — el patró es desdobla:
   · CAMP CURT i18n (input d'una línia: noms, eslògans, etiquetes): APILAT,
     mai pestanyes — una fila per idioma actiu, CA (base) sempre primer, xip
     d'idioma com a prefix de fila, validació inline per fila. El contingut ÉS
     l'estat.
   · CAMP LLARG i18n (textarea, editor ric: descripcions): pestanyes, però
     cada pestanya porta estat TEXTUAL (mai només color): «CA ✓» · «ES — buit»
     · «EN — error», i una línia de resum sota l'editor («Traduccions: CA ✓ ·
     ES ✓ · EN buida — caurà al català»). En desar amb un idioma invàlid, la
     primera pestanya invàlida s'obre i rep el focus.
   · La regla de reserva (buit → català) es queda visible en tots dos.
2. Superadmin — el diàleg «Nou grup / Edita el grup» perd les pestanyes: el nom
   és camp curt → tres files apilades (CA · ES · EN dels idiomes de
   plataforma).
3. Botiga — «Descripció» (camp llarg): pestanyes amb estat textual + línia de
   resum. Res més de la vista es toca.
4. Categories i Producte (formularis congelats — retoc autoritzat): els noms
   i18n passen a apilats; les descripcions (llargues) a pestanyes amb estat.
   Res més.
Entrega: DS §09 en clar i fosc + els retocs.
```

**Doc fallout:** DESIGN-BRIEF 0.2.16 (new §3.15 «i18n fields» — the stacked/tabbed split + textual state + fallback visibility) · TASKS 0.1.42 (new D.18).

---

## Amendment 18.1 — 2026-08-26 · One grammar: the language-row stack

**Trigger:** the user questioned round 18's split — stacked name fields next to tabbed description fields is two UI treatments for one concept inside one form. **The critique wins.** Round 18 picked the wrong axis (short vs long); the right axis is a single grammar.

**Rule (replaces the 18 split in DS §09):** the i18n unit is **always the language row** — a stack of labelled rows, CA first, language-chip prefix, per-row inline validation, fallback note visible.

- Short fields: the row is the input (as shipped).
- **Long fields: the same rows with auto-height textareas — no tabs.** With a 3-language cap (2 active in production), stacking two or three 3–4-line textareas is trivial; the summary line becomes unnecessary because the state is visible.
- The only collapse case: **rich editors** (the future aboutUs, ACFG-05) — same row grammar, but the collapsed row shows a one-line preview + textual state («ES — buit») and expands in place. Still no tabs.

**Tabs leave the i18n system entirely.** The round-18 tabs-with-state spec survives only as the collapsed-row state treatment.

### Change package — 18.1 (paste into Claude design)

```text
Eco Admin — esmena 18.1 (guanya la consistència: UNA sola gramàtica i18n).

1. Eco Admin DS §09: el patró és sempre la PILA DE FILES D'IDIOMA — CA primer,
   xip d'idioma com a prefix, validació inline per fila, nota de reserva
   visible. Camp curt: la fila és l'input. CAMP LLARG: les mateixes files amb
   textarea d'alçada automàtica — FORA les pestanyes (amb màxim 3 idiomes,
   apilar és trivial; la línia de resum sobra perquè l'estat es veu). L'únic
   cas amb plegat: l'editor RIC (futur aboutUs) — mateixa gramàtica, fila
   plegada amb vista prèvia d'una línia + estat textual («ES — buit»), s'expandeix
   in situ. Cap pestanya enlloc del sistema i18n.
2. Botiga «Descripció», Categories i Producte (descripcions): passen de
   pestanyes a files apilades amb textarea. Res més es toca.
3. El diàleg «Nou grup» ja compleix (files apilades) — cap canvi.
```

**Doc fallout:** DESIGN-BRIEF 0.2.17 (§3.15 rewritten to the single grammar) · TASKS 0.1.43 (D.18 scope amended).

---

## Round 19 — 2026-08-26 · The save bar: one anatomy, two modes

**18/18.1 verification first:** the single i18n grammar is applied — DS §09 declares «cap pestanya enlloc del sistema i18n», Botiga's Descripció is stacked per-language textareas (zero `role="tab"`), and the Categories/Producte forms carry no tabs. One stale line: **Botiga's SPEC still says «tabs per active language»** — markup updated, prose not.

**The user's question — static submit (global category form) vs dirty-appearing sticky bar (elsewhere): should they be consistent?** The audit inverts the finding: **the canonical pattern already exists and is exactly right** — the tenant Categories form ships a **mode-aware sticky bar**: `create → always visible` («Encara no s'ha creat», or the invalid hint «Camps obligatoris: nom, descripció i grup») and `edit → appears on dirty` («Canvis sense desar» + Descarta), with «Crea la categoria»/«Desa els canvis» CTAs and `aria-disabled`. The two divergents are:

1. **The L2 global category form** — a static submit under the form, diverging from its own declared ACAT-02 reuse (17.7).
2. **The Producte form** — its fixed bar has edit-only semantics (no mode, no create language): used to create, it would say «Canvis sense desar» about a thing that does not exist.

**Rule (goes to DS §10):** route forms have **one save anatomy — the sticky bottom bar — with two modes**: create = always visible (create-language status text + primary CTA, `aria-disabled` while invalid, the invalid hint names the missing fields); edit = appears on dirty (dirty text + Descarta-revert + Desa). Dialogs keep their footer buttons (a different surface). **Reference implementation: the tenant Categories form.** Botiga (settings, edit-only) already complies.

### Change package — save bar (paste into Claude design)

```text
Eco Admin — ronda 19 (la barra de desar: UNA anatomia, DOS modes).

1. Eco Admin DS §10 guanya la «Barra de desar» dels formularis en ruta: barra
   pegajosa inferior, mateixa anatomia sempre; MODE CREAR = sempre visible
   (text d'estat «Encara no s'ha creat» o, si falta res, «Camps obligatoris: …»
   amb els noms; CTA «Crea …» amb aria-disabled mentre és invàlid); MODE EDITAR
   = apareix amb canvis («Canvis sense desar» + Descarta + «Desa els canvis»).
   Implementació de referència: el formulari de Categories del tenant. Els
   diàlegs mantenen els seus botons de peu (superfície diferent).
2. Superadmin — el formulari de NOVA CATEGORIA GLOBAL perd el submit estàtic i
   adopta la barra (és la reutilització d'ACAT-02 que la 17.7 ja declarava:
   mateix formulari, mateixa barra).
3. Vista Producte (formulari, congelat — retoc autoritzat): la barra esdevé
   conscient del mode — «Crea el producte» / «Encara no s'ha creat» en crear;
   el comportament d'editar es queda tal qual.
4. Botiga — una frase rància al SPEC: «tabs per active language» passa a
   «files apilades per idioma» (la maqueta ja ho fa; només és la prosa).
```

**Doc fallout:** DESIGN-BRIEF 0.2.18 (§3.16 «Save bar» — the two-mode rule + the Categories reference) · TASKS 0.1.44 (new D.19).

---

## Round 19.1 — 2026-08-26 · Save bar verified (4/4) — Superadmin fully closed

1. ✅ DS §10 «Barra de desar»: one anatomy (sticky bottom pill), two modes, with both status texts demoed («Encara no s'ha creat» · «Camps obligatoris: …» · «Canvis sense desar»).
2. ✅ The L2 global-category form dropped its static submit for the mode-aware bar — true ACAT-02 reuse at last.
3. ✅ The Producte form is mode-aware («Crea el producte» / «Encara no s'ha creat»); edit behaviour untouched.
4. ✅ Botiga's SPEC now reads «files apilades per idioma — DS §09, les buides cauen al català».

**With this, every outstanding Superadmin item is verified** (17.7 flows, 18/18.1 i18n grammar, 19 save bar) — **Superadmin's freeze at 17.5 stands with zero pending touches**, and the whole desktop surface is closed with the three form-system rules (i18n grammar §09, save bar §10, row actions §04) unified across every view. Remaining design surface: the mobile files.

---

## Round 20 — 2026-08-26 · The mobile surface (full review)

**Scope:** the brief's mobile contract is exactly three things — **Tauler · Sol·licituds · obrir/tancar botiga**. Existing: `Vista Sol·licituds (mòbil)` and `Vista Socis (mòbil)` (an extra, out of v1 scope per round-5 C4). Missing: Tauler mòbil and any interactive store open/close.

**Verdict: Sol·licituds mòbil is remarkably current** (derived RGPD states incl. ready/overdue/blocked, deferred-send snackbar with Desfés, mailto path, date-interpolating reply prefill, spam «×») **and Socis mòbil has the best degradation spec in the project** (drawer, avatar-tap selection, docked bulk bar, «Carrega'n més»). But the shared shell misses the brief's third requirement, and both drifted past later system rounds:

| #   | Finding                                                                                                                                                                                                                                             | Severity |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | **The store chip in the mobile top bar is decorative in both files** — no interaction. It is the brief's third mobile requirement (obrir/tancar botiga); the Socis mòbil SPEC even claims «still interactive» and the markup contradicts it         | critical |
| 2   | **Tauler mòbil does not exist** — the first mobile requirement                                                                                                                                                                                      | critical |
| 3   | **Socis mòbil writes state transitions directly** (inline estat row applies on tap) — frozen 8.2/AMBR-03 rule: transitions never write without the mandatory-reason dialog                                                                          | critical |
| 4   | Socis mòbil fixture vs frozen: 47 comptes (42+3+2) vs 50 (42+5+2+1); no Suspesos chip; «alta 03/2016» renders seniority the schema cannot provide (B-13 — no `memberSince`)                                                                         | major    |
| 5   | Sol·licituds mòbil confirms defer required fields to desktop («el motiu obligatori s'introdueix al diàleg complet (escriptori)») — a mock annotation reading as a product limitation; mobile cannot send an operator to a desk for a required field | major    |
| 6   | Operator-copy leaks: «••••••@•••••• — AQ-10» (spec ID); «Baixa de sòcia», «Estat: Activa» (single-form rule)                                                                                                                                        | major    |
| 7   | No 12.1 reset on either mobile filter bar, and the empty states don't distinguish filtered-empty from true-empty («Tot al dia!» would show for a fruitless search)                                                                                  | major    |
| 8   | §3.14 mobile gaps: bottom sheets without `role="dialog"`/`aria-modal`/name/trap; tray tabs without tab semantics; unlabelled search inputs and sheet-close buttons; snackbar without `role="status"`; unnamed download icon in the bulk bar         | major    |
| 9   | **DS §15 is stale**: it anchors mobile degradation on a line chart killed in round 6 and never absorbed the (excellent) D.3 spec that lives in Socis mòbil's SPEC block                                                                             | minor    |

### Change package — mobile surface (paste into Claude design)

```text
Eco Admin — ronda 20 (superfície mòbil). L'abast del brief: Tauler · Sol·licituds
· obrir/tancar botiga. Socis mòbil és extra (es manté, fora d'abast v1).

1. NOVA: TAULER (mòbil) — la degradació del Tauler congelat (7.1) en 1 columna:
   [banner de botiga tancada si escau] → targeta del cicle (OPEN/PROCESSING/cap
   cicle; només el mesurador de progrés — cap altre gràfic) → comandes per estat
   (barra apilada) → Sol·licituds (èmfasi error-container) → Proves que caduquen
   → Estoc baix → targeta Socis. Nav = calaix modal (hamburguesa), com Socis
   mòbil. Fosc inclòs.
2. XIP DE BOTIGA INTERACTIU a la barra superior de TOTES les pantalles mòbils
   (el tercer requisit del brief): en tocar-lo, full inferior amb l'estat i
   l'acció — «Tanca la botiga» obre el diàleg compactat de Botiga (motiu amb
   presets + avís de salt de cicle; sense temporitzador — B-25). Ara el xip és
   decoratiu a les dues maquetes.
3. Sol·licituds (mòbil):
   · els confirms es completen: el motiu OBLIGATORI s'escriu AQUÍ (textarea al
     confirm) — fora els parèntesis «(escriptori)»: el mòbil no envia ningú a
     l'escriptori per un camp requerit.
   · «••••••@•••••• — AQ-10» perd l'ID: «••••••@•••••• (anonimitzat)».
   · «Baixa de sòcia» → «Baixa de soci»; «Estat: Activa» → «Actiu» (forma única).
   · 12.1: «Neteja els filtres» al final de la fila de xips quan hi ha cerca o
     xip actiu, i l'estat buit FILTRAT es distingeix del real («Cap resultat amb
     aquests filtres» + reset — mai «Tot al dia!» amb cerca activa).
   · Kit §3.14 mòbil: fulls inferiors amb role="dialog" + aria-modal + nom +
     trap; pestanyes amb semàntica de tab; cerca amb aria-label; tancar amb nom;
     snackbar amb role="status".
4. Socis (mòbil) — extra fora d'abast v1, però el contracte es corregeix:
   · les transicions d'estat NO escriuen mai directament: la fila inline obre el
     diàleg amb motiu obligatori (AMBR-03, com l'escriptori).
   · fixture congelat: 50 comptes (42+5+2+1) + xip Suspesos; «alta 03/2016»
     desapareix (B-13: no hi ha memberSince) — la meta usa compte creat i darrer
     cicle.
   · mateix kit §3.14 (calaix amb semàntica, botons amb nom, aria-pressed).
5. Eco Admin DS §15 es reescriu: fora la frase del gràfic de línies (mort a la
   ronda 6); entra la degradació completa — calaix modal, taules→targetes,
   barra bulk ancorada (safe-area), files ≥48 i objectius ≥44, «Carrega'n més»,
   fulls inferiors com a render mòbil del side sheet (§16), xip de botiga
   interactiu a totes les pantalles, fluxos només-escriptori (CSV) amagats.
Entrega: Tauler (mòbil) nou + retocs a les dues maquetes + §15, en clar i fosc.
```

**Doc fallout:** TASKS 0.1.46 (new D.20). No REQUIREMENTS change — AMBR-03 and B-13 already say what the mobile mock violated.

---

## Round 20.1 — 2026-08-26 · Mobile verified (5/5) — two inherited-drift residuals

1. ✅ **Tauler (mòbil)** — excellent: 1-column in the ruled order, only the progress meter + stacked bar as graphics, cycle states via an `escenari` prop (obert / en preparació / sense cicle) and store state via another, closed banner with `role="status"`, per-row 44px links, the payment row with the outlined-€ chip, drawer and sheets with the full dialog kit.
2. ✅ **Interactive store chip on all three mobile screens** — `aria-haspopup="dialog"`, the «Estat de la botiga» bottom sheet, and the compact close dialog: presets as `aria-pressed` radios, custom reason with the CA-fallback note, the skip-cycle warning and «La reobertura és sempre manual» (B-25 honoured), `aria-disabled` CTA, trap/Esc.
3. ✅ **Sol·licituds (mòbil)**: the mandatory reason is written in the confirms (×4), the «(escriptori)» parentheticals are gone (the two remaining mentions live in SPEC), «AQ-10» → «anonimitzat», single form restored, 12.1 reset + «Cap resultat amb aquests filtres», six `role="dialog"` surfaces.
4. ✅ **Socis (mòbil)**: transitions (row AND bulk) open the mandatory-reason dialog with danger styling for Suspèn — AMBR-03 restored; fixture 50 = 42+5+2+1 with a Suspesos chip and a suspended row; «compte creat» replaces the impossible seniority (B-13); reset with focus return; named download; per-filter «Carrega'n més».
5. ✅ **DS §15 rewritten** — the full D.3/D.20 degradation contract, linking the three mobile mocks; the dead line-chart sentence is gone from §15.

**Two residuals — inherited drift, one line each:**

1. **The S33 money on both Taulers**: the mobile card says «1.842,50 € total del cicle» + «80,11 € mitjana» — inherited from the desktop Tauler frozen at 7.1, _before_ the facturable rule. The frozen Comandes/Cicles/Estadístiques establish S33 = 1.044,13 € gross / **990,52 € facturable**. Both Taulers align (authorized touch on the frozen desktop): «facturable del cicle» + the mitjana derived from it.
2. **DS §13's Card Socis prose still describes the dashboard line chart round 6 killed** («rail esquerre + gràfic de línies altes/baixes» — baixes are underivable, B-12). The §15 rewrite missed its §13 sibling.

### Change package — 20.1 (paste into Claude design)

```text
Eco Admin — ronda 20.1 (dues línies de deriva heretada).

1. TAULERS (escriptori — retoc autoritzat sobre el congelat 7.1 — i mòbil): els
   diners de S33 s'alineen amb les vistes congelades — «990,52 € · facturable
   del cicle» (la regla de la ronda 16: exclou Cancel·lades i Caducades) i la
   mitjana per comanda derivada d'aquest total i de les comandes facturables.
   Fora 1.842,50 i 80,11.
2. Eco Admin DS §13 — la prosa de la Card Socis perd «rail esquerre + gràfic de
   línies altes/baixes» (mort a la ronda 6; les baixes no es poden derivar —
   B-12): la card és el resum d'estats amb enllaços, com el Tauler congelat.
```

**Doc fallout:** TASKS 0.1.47 (D.20 verified; mobile freeze gated on 20.1).

---

## Round 20.2 — 2026-08-26 · Sheet unification question: position held, unification made explicit

**The user asked:** could the Sol·licituds detail unify on a bottom sheet everywhere — full-width mobile, fixed-width desktop?

**Position held (round-5 §G re-examined and confirmed):** a desktop bottom sheet loses on four fronts — (1) **occlusion geometry**: the side sheet occludes horizontally and keeps the queue visible; a bottom sheet tall enough to avoid internal scrolling kills the list context the pattern exists to preserve, and a height-capped one condemns the operator to scrolling a wide, short panel; (2) **reading geometry**: the detail is a narrow column — natural as a tall right-hand panel, awkward anchored to the bottom edge; (3) **Material vocabulary** (brief §1 hard constraint): M3 scopes bottom sheets to compact windows and prescribes side sheets/dialogs on expanded ones; (4) **prev/next chaining** over a visible queue is the core desktop triage gesture.

**The correct half of the proposal:** the unification that matters is content + behaviour, not the container — and it is already law (§15: «Bottom sheet = render mòbil del side sheet (§16): mateix contingut i accions»). What was implicit becomes explicit for the build: **one component, two thin shells** (`mat-sidenav position="end"` ≥720 · `mat-bottom-sheet` <720) — one line added to §16 via the pending 20.1 paste.

---

## Round 20.3 — 2026-08-29 · Mobile verified — surface frozen, design project complete

**Scope:** point-by-point verification of the combined 20.1+20.2 three-line paste against fetched source (`Shell Tauler A.dc.html`, `Tauler (mòbil).dc.html`, `Eco Admin DS.dc.html`). Result: **3/3 applied. The mobile surface is frozen and the design project is complete.**

| #   | Check                           | Result                                                                                                                                                                                                                                                                                                                                   |
| --- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | S33 money on both Taulers       | ✓ Desktop and mobile both show «990,52 €» captioned «facturable del cicle» and «47,17 €» captioned «mitjana per comanda facturable» (990,52 / 21 facturables). No trace of `1.842,50`, `1842` or `80,11` in either file — the round-16 facturable rule now holds on every surface that quotes S33                                        |
| 2   | DS §13 Card Socis prose         | ✓ The line-chart language is gone. Replacement is better than asked: «resum d'estats amb enllaços (En prova · Inactius · Llista blanca), com el Tauler congelat — cap gràfic al Tauler (les baixes no es poden derivar, B-12; la tendència de socis viu a Estadístiques)» — it records the _reason_ the chart died, not just its absence |
| 3   | DS §16 one-component-two-shells | ✓ Verbatim: «El side sheet (≥720) i el bottom sheet (<720) són un sol component de contingut amb dos embolcalls fins (mat-sidenav position="end" · mat-bottom-sheet) — mateix contingut, mateixes accions, mateixos diàlegs; només canvia el contenidor»                                                                                 |

**Freeze declaration:** `Tauler (mòbil)`, `Vista Sol·licituds (mòbil)` and `Vista Socis (mòbil)` are frozen at this round. Build against REQUIREMENTS + DS §15/§16, not the mocks' SPEC blocks. Further changes only via registered rounds.

**Project status:** all surfaces frozen — 10 desktop views (Tauler 7.1 · Sol·licituds 4.1g · Socis 8.2 · Categories 9.1/10.2 · Productes 10.2 · Comandes 11.2 · Cicles 14.2 · Botiga 15.1 · Estadístiques 16.1 · Superadmin 17.5/19.1) + 3 mobile views (20.3) + the DS sheet (§01–§18). The design phase of eco-admin is **closed**. What remains is not design: the B-registry (B-08..B-30, with **B-28 privacy** and **B-23 UNIQUE fuse** urgent), the AQ decision queue (AQ-02/07/13..19), and construction (D.2 token deltas → `libs/eco-admin`).

---

## Round 21 — 2026-08-29 · Responsive band contract for the Tauler card grid + reflow demo

**Trigger:** the user asked whether the design views could be made responsive — one view instead of the desktop/mobile pair — specifically to see how the Tauler cards re-place themselves at intermediate widths, and whether each card can carry its own behaviour.

**Position: no conversion, but the gap is real.** The desktop/mobile pairs are not one layout at two widths — they are two designs (modal drawer vs rail, bottom sheet vs side sheet, cards vs tables, compact dialogs), and §15 exists precisely because degradation is a set of deliberate transformations, not fluid reflow. Mechanically, the mocks are built with inline styles, which media/container queries cannot target — making a view truly fluid means rewriting its layout layer, reopening 13 frozen files so that a _specification artifact_ emulates what the Angular build does natively. **However**, the current contract is binary (≥720 desktop · <720 mobile) and nobody has specified the intermediate band (tablet, half-screen window) nor per-card placement rules. That is a genuine spec hole: at a 900px pane the frozen desktop layout (`2fr 1fr` + a four-column attention row) would compress all six cards into unusable slivers.

## Findings

| #    | Finding                                                                                                                                                                                                            | Sev |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| 21-1 | The band between the two frozen surfaces (720 ≤ w < 1200) has no layout contract: the desktop Tauler grids (`2fr 1fr` and `1.15fr 1fr 1fr 1fr`) have no ruled degradation before the <720 single column takes over | 🟡  |
| 21-2 | No per-card grid behaviour is specified anywhere (span, priority, minimum width, orphan handling) — each build decision would be improvised                                                                        | 🟡  |
| 21-3 | The build-level mechanism is unstated: viewport media queries would ignore that the expanded rail (256px) subtracts content width — the same viewport can host two different available widths                      | 🟢  |

## Ruling — three bands, one new threshold, one pinned measurement basis

The system's mobile boundary stays **720** (frozen law: §15 header «breakpoint ≤720px», §16 side/bottom sheet switch). The contract adds exactly one new threshold — **1200** — creating three bands. **Measurement basis (pinned):** bands are measured on the **content pane's full (border-box) width** — the area right of the rail — _not_ the viewport. In build, `container-type: inline-size` goes on the pane **wrapper** and the pane's 2rem padding moves to a child, so the container query sees exactly this width (container queries resolve against the content box; leaving the padding on the container would silently shift every threshold by 60px).

| Band         | Pane width     | Tauler card grid                                                                                                                                                                                                                                                                       |
| ------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ampla**    | ≥1200          | The frozen 7.1 layout: Cicle `2fr` + Comandes per estat `1fr`; «Requereix atenció» `1.15fr 1fr 1fr 1fr` (Sol·licituds · Proves · Estoc · Socis). Container caps at 1600                                                                                                                |
| **Mitjana**  | ≥720 and <1200 | 2 columns (`1fr 1fr`, gap 1.25rem), preserving the desktop's operativa/atenció zoning: Cicle full row (hero) → Comandes per estat full row → «Requereix atenció» as a clean 2×2 (Sol·licituds + Proves / Estoc + Socis — no orphans, heading intact). Columns ≈ 320px at the 720 floor |
| **Compacta** | <720           | The frozen 20.3 mobile: 1 column in the mobile order (cicle → comandes → sol·licituds → proves → estoc → socis); §15 applies wholesale (modal drawer, store chip, sheets)                                                                                                              |

Band edges are open on the upper side (<720, <1200) — pane widths are continuous (zoom, sub-pixel layout), so integer ranges like «720–1199» would leave (1199, 1200) unmatched.

Per-card rules (the «own behaviour» the user asked for):

- **Cicle** is the hero: first in every band. Ampla: shares the top row with Comandes per estat (`2fr`/`1fr`). Mitjana: full row. Compacta: first card of the stack.
- **Sol·licituds pendents** keeps its emphasis _variant_ everywhere — error-container when the RGPD clock is critical, plain surface otherwise (the frozen conditional: `!noReq && rgpdMain.crit`); in the bands that render the «Requereix atenció» block (Ampla, Mitjana) it takes the block's **first slot**. In Compacta the frozen mobile order already places it directly after the two operative cards.
- **Orphan rule (general, for any card band in the system):** a card left alone on the last multi-column row keeps its column width — it is never stretched to fill the row (a stretched low-density card reads as a mistake; a ragged edge reads as a grid). The Mitjana Tauler produces none.
- **Banner «botiga tancada»** always spans the full content width, above the grid, in every band.
- Each card declares **`min-inline-size: 300px`** (not 320 — the 720 floor yields ≈320.6px columns, and a 320px minimum would sit on a 0.6px knife edge against any border or classic scrollbar); internal layouts (the cycle card's 4-stat grid, the stacked orders bar) respond to their _own_ container, not the viewport.
- **Why container queries, concretely:** at a 1280 viewport, expanding the rail (72 → 256px) drops the pane from 1208px to 1024px — Ampla to Mitjana with no viewport change. Viewport media queries would get this wrong; the band follows the space the cards actually have.

**Generalisation note (not in the paste):** the orphan/no-stretch and min-width rules apply to any card band in the system (e.g. the Estadístiques KPI row, which already wraps) — §13 states them for the Tauler; builders extend by analogy, and any conflict comes back as a round.

## The demo artifact — geometry, not data

One **new** file, «Tauler — reflow», shows the recolocation without touching any frozen view. Two hard constraints:

1. **Skeleton only.** Plates with the card name and a behaviour badge («Cicle — fila sencera a Mitjana», «Sol·licituds — èmfasi condicional, primer lloc del bloc») — **zero fixture data**. The 1.842,50 residual this project just spent a round killing was caused by live numbers duplicated across surfaces; a fourth copy of the S33 fixture would recreate that exposure.
2. **Prop-driven pane widths.** The mocks cannot run real container queries (inline styles); the demo emulates the bands with an `amplada` prop constraining the simulated **content pane** — values chosen as pane widths that sit safely inside their bands (`1300 — Ampla` · `1000 — Mitjana` · `740 — Mitjana estreta` · `390 — Compacta`), deliberately _not_ iconic device viewport widths (a real 768px tablet yields a ~696px pane after the rail — Compacta — so labelling 768 as Mitjana would demonstrate a band that device never sees).

**Verification note:** this round's draft went through an adversarial 3-agent pass against the frozen sources before registration. It confirmed the desktop anchors (grids, order, max-width 1600, gap, banner position) and that no intermediate contract pre-exists in §13/§15 — and it caught four real defects that this final text repairs: the container-query content-box trap (basis now pinned to the pane border-box with the wrapper rule), the 320px knife edge (min is now 300), the integer band gap (edges now open bounds), and the demo's viewport-width enum (now pane widths). It also corrected a nuance: the Sol·licituds emphasis in the frozen Tauler is conditional on the critical RGPD clock, not unconditional — the contract now says so.

### Change package — paste into Claude design (Catalan)

1. **Eco Admin DS §13 — afegir el «Contracte de graella del Tauler»** al final de la prosa de la secció: «La graella de cards té tres bandes, mesurades sobre l'amplada **total (border-box) del panell de contingut** — l'àrea a la dreta del rail — mai sobre el viewport: **Ampla ≥1200** = la disposició congelada (Cicle 2fr + Comandes per estat 1fr; "Requereix atenció" 1.15fr · 1fr · 1fr · 1fr; contenidor màx. 1600); **Mitjana ≥720 i <1200** = 2 columnes (1fr 1fr, gap 1.25rem), conservant la zonificació operativa/atenció: Cicle fila sencera → Comandes per estat fila sencera → "Requereix atenció" en 2×2 (Sol·licituds + Proves / Estoc + Socis); **Compacta <720** = 1 columna en l'ordre del Tauler (mòbil) congelat (s'aplica §15). Regles per card: Sol·licituds pendents conserva la seva variant d'èmfasi (error-container només amb rellotge RGPD crític) i pren el primer lloc del bloc "Requereix atenció" a Ampla i Mitjana; una card òrfena en una fila multicolumna conserva l'amplada de columna, mai s'estira (regla general de qualsevol banda de cards del sistema — la Mitjana del Tauler no en produeix cap); el banner de botiga tancada sempre ocupa tot l'ample, per sobre de la graella; cada card declara min-inline-size: 300px i el seu layout intern respon al seu propi contenidor. Construcció: container queries — container-type: inline-size a l'**embolcall** del panell, amb el padding de 2rem en un fill (les consultes es resolen contra el content-box; deixar el padding al contenidor desplaçaria tots els llindars 60px). Exemple: a 1280 de viewport, expandir el rail (72 → 256) baixa el panell de 1208 a 1024 — d'Ampla a Mitjana sense canviar el viewport.»
2. **Eco Admin DS §15 — una línia nova** a la columna esquerra: «Les bandes d'amplada del Tauler (Ampla ≥1200 · Mitjana ≥720 i <1200 · Compacta <720, mesurades sobre el panell de contingut) es defineixen a §13; el llindar mòbil del sistema continua sent 720, com al §16.»
3. **Nou artefacte `Tauler — reflow.dc.html`** (demostració, no vista): esquelet geomètric de la graella del Tauler amb una prop `amplada` (enum: `1300 — Ampla` · `1000 — Mitjana` · `740 — Mitjana estreta` · `390 — Compacta`) que constreny l'amplada del **panell de contingut** simulat (valors triats com a amplades de panell segures dins de cada banda — expressament no són amplades de viewport de dispositius: una tauleta de 768 dona ~696 de panell després del rail, que és Compacta). Cada card és una placa amb el nom + insígnia de comportament (p. ex. «Cicle — fila sencera a Mitjana», «Sol·licituds — èmfasi condicional, primer lloc del bloc»); el banner de botiga tancada apareix com a placa condicional a tot l'ample. **Sense cap dada de fixture** — geometria i etiquetes, res més (el residual 1.842,50 va néixer de xifres vives duplicades entre superfícies; aquest artefacte no n'ha de portar cap). Bloc SPEC remetent al contracte de §13. Cap vista congelada no es toca.

**Doc fallout:** DESIGN-BRIEF gains the «Responsive bands & the Tauler card grid» block in §3 (0.2.19); TASKS gains D.21 (0.1.50); REQUIREMENTS untouched (presentation-only rule).

---

## Round 21.1 — 2026-08-29 · Round-21 package verified (4/4) — one broken href

**Scope:** point-by-point verification of the round-21 paste against fetched source (`Eco Admin DS.dc.html`, `Tauler - reflow.dc.html`), plus a byte-level integrity check of the frozen desktop Tauler.

| #   | Check                                    | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | DS §13 «Contracte de graella del Tauler» | ✓ Verbatim: pinned border-box basis, three bands with open upper bounds (≥1200 · ≥720 i <1200 · <720), the full per-card rule set (conditional Sol·licituds emphasis, orphan no-stretch as a general rule, full-width banner, `min-inline-size: 300px`), and the build note including the 60px content-box trap and the 1208 → 1024 rail example                                                                                                                                                                       |
| 2   | DS §15 band line                         | ✓ Verbatim, referencing §13 and reaffirming 720 as the system's mobile threshold per §16                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 3   | New artifact `Tauler - reflow.dc.html`   | ✓ Geometry-only skeleton: `amplada` enum (`1300 — Ampla` · `1000 — Mitjana` · `740 — Mitjana estreta` · `390 — Compacta`), band derived by the same open-bound rule as the contract, dimension ruler labelled «panell de contingut · N px (border-box, a la dreta del rail)», conditional banner plate, behaviour badges (incl. «èmfasi condicional» on Sol·licituds and «mai s'estira» on the 2×2), **zero fixture data**, SPEC pointing back to §13 with the no-viewport warning (768 tablet → ~696 pane → Compacta) |
| 4   | Frozen views untouched                   | ✓ `Shell Tauler A.dc.html` fetched again and hash-compared against the pre-round-21 copy: **byte-identical** (sha256 match)                                                                                                                                                                                                                                                                                                                                                                                            |

**One residual (1 character):** DS §13 links the demo as `href="Tauler — reflow.dc.html"` (em dash) but the file on disk is `Tauler - reflow.dc.html` (hyphen — the project's filename convention, cf. `Ronda 13.1 - …`, `Sol·licituds - estats …`). The link 404s. Fix the href, not the filename.

### Change package 21.1 — paste into Claude design (Catalan)

1. **Eco Admin DS §13** — l'enllaç de la capçalera del «Contracte de graella» apunta a `Tauler — reflow.dc.html` (ratlla llarga), però el fitxer es diu `Tauler - reflow.dc.html` (guionet, la convenció de noms del projecte). Corregiu **només l'href** perquè l'enllaç no doni 404; el nom del fitxer no es toca.

---

## Round 22 — 2026-08-29 · The continuous (24/7) tenant — the mode the system half-supports

**Trigger:** how does a tenant use cycles or not, and which views need a different UI for a cycle-less (24/7) tenant?

**The premise needed correcting first.** The frozen desktop Tauler already carries a full `24/7` scenario, four `(24-7)` mocks exist, and ADSH-01/ADSH-06 already rule on it. The vocabulary does not need inventing — it needs propagating. Two modes are also PRD-level in eco-store (`TASKS.md §4.6`: «ClickUp has both cycle and 24/7 mode tasks», PST-01a cycle mode / PST-01b 24/7 mode).

### How a tenant becomes continuous — by omission

`cycle_cron.pb.js:97` — `if (!orderWindow || !orderWindow.enabled) { skip }`, logging «24/7 access configured». Read-only probe of the local `pb_data/data.db`:

| Tenant               | `orderWindow.enabled`          | cycles | orders | cycle-less |
| -------------------- | ------------------------------ | ------ | ------ | ---------- |
| Associació El Llevat | `true` (thu 12:00 → mon 12:00) | 22     | 49     | 4          |
| Acme                 | **key absent**                 | 0      | 33     | **33**     |
| plastikaweb          | **key absent**                 | 0      | 0      | 0          |

### Findings 22

| #    | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                             | Sev |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 22-1 | **No explicit 24/7 state** — continuous is the _absence_ of a nested JSON key, not a decision; «continuous by design» and «`logisticsConfig` half-configured» are indistinguishable to both the admin and the cron. B-29's birth defaults make every new tenant born continuous, so the onboarding TA's first Tauler is the 24/7 render → new **B-31**                                                                                              | 🔴  |
| 22-2 | **The nav still offers «Cicles» in the 24/7 scenario** — verified in the frozen Shell's source: `navItems` is an unconditional array (`['autorenew', 'Cicles', 'Vista Cicles.dc.html']`) with no scenario gate. No DS rule anywhere for hiding or disabling module nav items; nothing defines the `/cicles` deep-link behaviour                                                                                                                     | 🔴  |
| 22-3 | **Mobile has no 24/7 render.** `Tauler (mòbil)` (frozen 20.3) offers `obert / en preparació / sense cicle` — three scenarios against the desktop's eight — and its `sense cicle` is the _transient_ state, not continuous: «la finestra setmanal encara no s'ha obert», «Proper cicle · dl. 17, 08:00», «La botiga obrirà automàticament segons la finestra de comandes». A continuous tenant would be promised a weekly window that does not exist | 🟡  |
| 22-4 | **Estadístiques is ruled but not drawn** — DS already says «Tenants 24/7: sense zona de cicles — només dates», yet no `Estadístiques (24-7)` mock exists. The only view with a rule and no drawing, and the one where the cycle is structural (per-cycle series, «cicle actual · anterior» picker)                                                                                                                                                  | 🟡  |
| 22-5 | **The one-order-per-member rule disappears in continuous mode.** `on_create_order.pb.js:42` gates the duplicate check on `orderWindow.enabled === true && currentCycleId`, so a continuous tenant's member holds unlimited concurrent orders: member↔order flips from 1:1-per-cycle to 1:N unbounded. No view accounts for it («socis han comprat» counts, repeated rows in Comandes, Socis participation)                                          | 🟡  |
| 22-6 | **No fulfilment batch without a cycle.** `orders` has `deliveryMethod`/`day`/`time` but no date; `day` is a weekday with no week anchor once the cycle is gone (populated on 4 of 82 local orders) → new **B-32**; AORD-06 «Llista de preparació» is undefined for continuous tenants until it ships                                                                                                                                                | 🟡  |
| 22-7 | Two defects found in passing, independent of the mode: the duplicate check has **no status filter** (`findAllRecords` counts CANCELLED), so a member who cancels is locked out of the cycle entirely; and the cycle lookup filter includes `status = 'ACTIVE'`, which is not in the enum (dead branch)                                                                                                                                              | 🟡  |

### What already works — inherit, do not reinvent

The frozen Tauler's `24/7` branch: store chip «Oberta» with no closing time and window-derived states collapsing to open (ADSH-06 exactly); cycle zone replaced by chip «Venda contínua», title «Comandes obertes», range «venda contínua · sense finestra setmanal», body «Aquesta cooperativa accepta comandes sempre i les prepara a mesura que arriben. La finestra setmanal de comandes està desactivada a Botiga › Logística», KPIs «6 comandes obertes» + «482,30 € aquests 7 dies», and `ordScope: 'obertes ara'`. **The replacement axis is therefore already invented: «obertes ara» + a rolling 7-day money window.**

It also keeps three no-cycle states distinct — «Cap cicle actiu» (transient) · «Venda contínua» (structural) · «Sense cicles / Crea el primer» (tenant nou) — a distinction worth protecting.

Not affected, no work needed: Categories, Productes, Sol·licituds.

### Verification gap (honest)

DesignSync lost authorization mid-session (`/design-login` needs an interactive terminal). Everything above about `Shell Tauler A`, `Tauler (mòbil)`, `Eco Admin DS`, the schema, the hooks and the local data is first-hand. The contents of **`Botiga (24-7)`, `Cicles (botiga 24-7)` and `Comandes (botiga 24-7)` could not be read** — their existence is confirmed by the file listing, their contents are not assessed in this round.

### Change package 22 — paste into Claude design (Catalan)

1. **Eco Admin DS §12 (anatomia de la nav) — nova regla «Nav condicional per mòdul»:** «La llista d'ítems de nav depèn dels mòduls actius del tenant, no és fixa. En **mode continu (24/7)** — `logisticsConfig.orderWindow.enabled` fals — el mòdul **Cicles no té domini i no apareix a la nav**; un enllaç directe a `/cicles` resol a un estat explicatiu («Aquesta cooperativa ven en continu: no hi ha cicles. La finestra setmanal es configura a Botiga › Logística»), mai a una taula buida. Cap altre mòdul canvia.»
2. **Eco Admin DS §13 — afegir al contracte del Tauler:** «Els tres estats sense cicle no s'han de confondre mai: «Cap cicle actiu» (tenant amb finestra, entre cicles — transitori) · «Venda contínua» (tenant continu, els cicles no existeixen — estructural) · «Sense cicles / Crea el primer» (tenant nou amb finestra). El vocabulari del mode continu és el de l'escenari `24/7` del Tauler congelat: xip «Venda contínua», títol de zona «Comandes obertes», rang «venda contínua · sense finestra setmanal», KPI «N comandes obertes» + «N € aquests 7 dies», abast de comandes «obertes ara», xip de botiga «Oberta» sense hora de tancament.»
3. **Nou artefacte `Estadístiques (24-7).dc.html`:** la vista Estadístiques per a un tenant continu. El selector d'abast **perd la zona de cicles** i conserva només «Per dates» (ja és regla a la DS); les sèries per cicle passen a períodes rodants (7/30/90 dies); cap referència a «cicle actual · anterior» ni al picker de cicles tancats. La resta de cards i el gating EST-06 no canvien. Reutilitza el vocabulari del punt 2.
4. **`Tauler (mòbil).dc.html` — afegir l'escenari `24/7`** a la prop `cicle` (que ara té `obert · en preparació · sense cicle`). Important: `sense cicle` **no** és aquest cas — és el tenant amb finestra entre cicles, i el seu copy («la finestra setmanal encara no s'ha obert», «Proper cicle dl. 17, 08:00») seria fals per a un tenant continu. El nou escenari hereta literalment el render del Tauler d'escriptori: xip «Venda contínua», targeta «Comandes obertes» amb els dos KPI i «Veure comandes →», sense mesurador de progrés ni compte enrere.
5. **`Vista Socis.dc.html` — mode continu:** en un tenant continu un soci pot tenir **diverses comandes obertes alhora** (la regla d'una comanda per cicle només s'aplica amb finestra activa). La participació no es pot expressar per cicle: on hi hagi «ha comprat aquest cicle» o equivalent, el mode continu mostra «última comanda · `<data>`». Cap recompte pot assumir 1 comanda = 1 soci.
6. **`Vista Comanda (detall).dc.html`:** quan `orderCycle` és buit (legítim: el camp és opcional i el hook desa la comanda sense cicle), la fila de cicle **no es pinta com un camp buit** — o desapareix, o diu «sense cicle (venda contínua)».

**No es toca:** Categories, Productes, Sol·licituds. **Pendent de decisió (no de disseny):** B-31 (mode explícit) i B-32 (data d'entrega resolta — sense ella, «Llista de preparació» no té lot en mode continu i no s'ha de dibuixar).

---

## Round 23 — 2026-08-29 · Carlos's review: la Fitxa de soci (first pass)

**Scope:** the member detail view (filename inferred — `Vista Soci (detall).dc.html`; DesignSync is unauthorized this session, so this round reads the **rendered screenshot**, not the source). Cross-checked against AMBR-02/03/07, the `users` / `user_addresses` / `user_fiscal_profiles` / `orders` schemas in `pb_schema.json`, all 7 files in `pb_hooks/`, the DS chip families (DESIGN-BRIEF §06), and the **frozen** Comandes and Cicles fixtures (rounds 11.1 / 11.2 / 14.2).

**This is the first round ever to touch this view** — AMBR-02's notes column is empty, the only MUST row in §4.6 with no design ruling on it.

**Verdict: the layout is right and the data model underneath it is not.** The two-column zoning is correct, the status helper text fixes exactly what round 8 flagged (one-click suspend with no reason), and the fiscal card is the only card in the project that reasons about a tenant module gate before drawing. But the view **inverts the trial rule TRL-07 makes a MUST**, ships an edit button that **AMBR-02 explicitly forbids**, promotes third-party personal data from a minimisation-capped free-text field into the permanent identity line, draws a history card with **no data source and an open decision behind it (AQ-03)**, and rebuilt its order fixture from the **pre-11.1 numbers that rounds 11/11.1 already caught and froze**. Six blockers, nine majors. None of them are aesthetic.

### Findings 23

| #     | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Sev |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 23-1  | **The trial rule is inverted.** The banner says «passarà a Activa **automàticament** si no s'actua abans» and the helper repeats «Prova → Activa és automàtic en vèncer el termini». TRL-07 (MUST) is literally _«Admin-approved conversion (eco-admin)»_ and AMBR-03 spells it `TRIAL → ACTIVE` (admin-approved). The design **removes the decision the requirement exists to create**. It is also unbuildable: **B-15** (nothing writes `trialEndsAt`) plus a fresh grep — `trialEndsAt\|membershipStatus\|TRIAL` returns **zero hits across all 7 `pb_hooks/` files**, and `cycle_cron.pb.js` is the only cron. Nothing sets the deadline and nothing would act on it                                                                                                                                                                                                                                                                 | 🔴  |
| 23-2  | **«Edita les dades» contradicts AMBR-02.** The MUST reads: profile, avatar, language, addresses **(read-only)**, fiscal profile **(read-only — RGPD minimization; edits stay member-side)**. Same law round 17.3 established one level up: _duplicated edit surfaces drift, every field gets one owner_. The member owns identity, addresses and fiscal data (eco-store self-service, PRV-04d shipped); the TA owns **membership**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 🔴  |
| 23-3  | **`aval: Marta Puig` is third-party personal data in the identity line, sourced from a collection that does not exist.** No `aval` field exists anywhere, and the only place that string could ever live is `member_allowlist.notes` — a collection **absent from `pb_schema.json`** (19 collections, no migration references it; it ships later with eco-store PRV-05b). So the header renders data no query can return today, and when the collection does ship, §5.7's contract caps that field at 140 chars, attaches a helper telling the operator **not** to write family/health/financial details about anyone, and purges it on erasure — its own worked examples are literally «veïna de Marta Puig», «aval: Núria Solé». Promoting a minimisation-flagged free-text field to a permanent identity line is the exact inverse of the rule it will ship under, and it names a person who never consented to appear on this screen | 🔴  |
| 23-4  | **«Historial d'estats» has no source — and drawing it silently decides AQ-03.** **B-12**: `users` carries `membershipStatus`, `trialEndsAt`, `created`, `updated` and nothing else. §5.5/AQ-03 is an **open** decision whose recommendation is «(a) minimal `admin_audit`, scoped to AMBR-03/07 and ACFG-07». The card draws (a) **and more than (a)**: actor name, a linked request ID, and system-authored events. Worse, `membershipStatus` **stays self-writable** (TRL-03) — a real history contains member-originated transitions, which this card's grammar has no row for                                                                                                                                                                                                                                                                                                                                                        | 🔴  |
| 23-5  | **Fixture regression — the fitxa was built from the pre-11.1 numbers.** `C33-014` here is **29,01 €** and «cicle 33 · **dl. 8 des.**». Round 11.1 verified and round 11.2 froze: `C33-014` = Núria Solé · 5 productes · **35,41 €** · nopagada · preparació, **cycle 33 = 10–16 d'agost**. Those two wrong values are precisely what round 11 finding #6 raised. Third: `C32-041` implies ≥41 orders in cycle 32 against the frozen Cicles' **8 C32 rows**. Fourth, independent of any freeze: «29,01 € de mitjana» over 29,01 + 31,25 is **30,13 €** — the "average" is just the first row's total                                                                                                                                                                                                                                                                                                                                      | 🔴  |
| 23-6  | **AMBR-07 is absent from the surface that names it.** The MUST says _«delete `users` record **from the member detail** or from an AREQ request»_, with the in-flight-order query run **proactively on open**, the 409 as safety net, and the §3.6 confirm dialog. The fitxa offers no deletion path at all — and it is one of the two flows §7 marks for Cypress coverage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 🔴  |
| 23-7  | **Four invented or unreadable fields.** `Rol: MEMBER` — the enum is `PARTNER \| TENANT_ADMIN \| GLOBAL_ADMIN`; `MEMBER` does not exist, and a raw enum token in operator copy is banned anyway. `Última connexió · avui, 9:41` — **no TA-readable source**: the only timestamped auth data is `_authOrigins`, whose list/view rule is `recordRef = @request.auth.id` (own records only), and it records origins, not sessions. `… 08012 Barcelona · Barcelona` — the **second locality token has no field behind it**: `user_addresses` carries `name/address/city/zip/phone/default/active` and nothing else (`tenants` does have a `province`; a member's address does not). `Sòcia #124` — no member-number field exists                                                                                                                                                                                                              | 🟡  |
| 23-8  | **Chip tone drift on the trial.** DESIGN-BRIEF §06 pins Membership as `TRIAL` (**info**) · `ACTIVE` (success) · `INACTIVE` (neutral) · `SUSPENDED` (error). The chip and the banner render warning amber. At **30 days remaining** it is not even inside ADSH-04's expiring-soon set (≤14 days), so neither the state tone nor the escalation tone justifies amber. Round 8: one state, one colour                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 🟡  |
| 23-9  | **Spec IDs and record IDs in operator copy** — `(PRV-05a)`, `sol·licitud #212`, `Sòcia #124`. Banned by ACYC-03 (round 14), reaffirmed in 17.7 and caught again as a copy leak in round 20                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 🟡  |
| 23-10 | **The four-pill control contradicts the text under it.** It renders four peer, equally-reachable states; the helper says Baixa is **terminal** («només es reactiva des d'una sol·licitud nova») and that Prova → Activa is not a manual pick. A guarded state machine cannot be drawn as a radio group — the affordance promises reachability the rules deny                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 🟡  |
| 23-11 | **`user_addresses.active` is ignored.** The schema carries an `active` bool (with its own index) — a member's deactivated address renders identically to a live one. The collection is also **unbounded**: no cap anywhere, and the card draws exactly two rows with no overflow rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 🟡  |
| 23-12 | **The fiscal card draws one of its two empty states.** `tenants.fiscalDataEnabled` exists, so «el mòdul del tenant és actiu» is schema-true and well reasoned — but only for the **enabled** branch. When the module is off, the copy tells the operator the member can activate something they cannot reach                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 🟡  |
| 23-13 | **Gendered copy inferred from a first name.** `users` has no gender field. «Sòcia», «Estat de la sòcia», «Període de prova… si no s'actua» can only be gendered by guessing «Núria». Round 1 #6 and round 20 both flagged socis/sòcies inconsistency; this view makes the guess structural                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 🟡  |
| 23-14 | **B-11 re-opens, harder.** The header leads with `nuria.sole@gmail.com`, and `users.emailVisibility` is never set — PocketBase hides `email` from anyone but the owner. Round 8 flagged this for a table column; here it is the identity line of the whole screen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 🟡  |
| 23-15 | **B-13 re-opens.** «alta el 5 d'ag. 2026» can only be `created` (autodate). A cooperative migrating existing members would show every member's alta as the import date. Round 20 flagged the identical rendering in Socis mòbil                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 🟡  |

### What already works — keep it

- **The status helper text closes round 8's finding.** «qualsevol altre canvi és manual i **demana motiu**» is the AMBR-03 reason dialog stated in the UI, not just in the spec. Right instinct; only the control shape (23-10) is wrong.
- **The fiscal card reasons about a tenant module before drawing** — the only card in the project that does, and `fiscalDataEnabled` proves the instinct is schema-true. It needs a second branch, not a rewrite.
- **`per defecte` on exactly one address** matches the invariant `single_default_address.pb.js` enforces in a transaction. The design and the hook agree.
- **The initials avatar** is the correct default render (see ruling R8), and `language` / `Correu verificat` are schema-true fields shown plainly.
- **The two-column zoning holds** — operational decision on the left, context on the right. Ruling R4 only reorders inside it.

### Rulings

**R1 · Card de comandes at 30 orders — split the list from the aggregate.** They have opposite constraints. The **list** is cheap and correctly indexed (`idx_orders_user_created (user, created DESC)`): show the **3 most recent**, then one footer link «Veure les 30 comandes →» deep-linked to Comandes pre-filtered by member. The **aggregate line** («2 en total · 29,01 € de mitjana») has no query at all — **B-14** — and its current value is arithmetically wrong (23-5). Kill it in v1. `total` count alone can survive as the card header count if the fitxa's own query returns it; the money average waits for B-14's `member_stats`.

**R2 · Adreces at 30 — default first, cap two, count the rest.** `default` is hook-guaranteed unique, so the ordering rule is free: default row first, then most recent, cap at **2**, footer «Veure'n totes (5) →». Same footer grammar as R1. Add the `active` distinction (23-11): inactive addresses either don't render or carry a neutral «desactivada» chip — never silently.

**R3 · Fiscal — no scale problem, two states.** `idx_user_fiscal_profiles_user` is **UNIQUE**: exactly 0 or 1 per member, forever. So the card is binary and needs no overflow rule; it needs the missing branch (23-12). Filled example, schema-exact (`fiscalName`, `nif`, `address`, `city`, `zip` — no country, no email, no phone):

> **Núria Solé Ferrer** · NIF **46812093D**
> C/ Gran de Gràcia 141, 3r 2a · 08012 Barcelona

The NIF must be checksum-valid in the mock (`validate_fiscal_profile.pb.js` rejects invalid ones server-side; `46812093D` passes). It is the most sensitive field on the screen — it earns its place because invoicing needs it, and it earns **read-only** for the same reason.

**R4 · Card order — by distance to the decision the TA came here to make.** The only actions on this screen are AMBR-03 transitions and AMBR-07 deletion. Everything else is evidence for them. Order: **Estat + historial** (the decision) → **Comandes** (the evidence that most often justifies it) → **Adreces** → **Perfil fiscal** (fulfilment/invoicing context) → **Compte** (diagnostics, lowest weight, correct where it already is, last). Identity moves out of the header into a proper card (R7).

**R5 · Merge «Estat de la sòcia» + «Historial d'estats» — yes, and the merge makes the dependency visible.** One card, «Estat», with the current state and its guarded actions as the header and the timeline as a secondary section below a divider. That is honest information architecture: the timeline is _the history of the thing the header shows_, and splitting them made two half-cards out of one subject. The sharper point: the merge is **only possible if the timeline has a source**, and it does not (23-4). So ship it as one card, **timeline gated on AQ-03(a)** — if AQ-03 defers, the card ships with state + actions and no timeline section at all, which is a clean degradation. Do not ship a timeline of invented events.

**R6 · The edit button — no.** AMBR-02 already answers it in the requirement text, with the reason attached: RGPD minimisation, edits stay member-side. A tenant admin managing a consumer cooperative needs to _see_ a member's address to prepare their basket and _see_ their NIF to invoice; they do not need to rewrite either, and if they can, the member's own copy and the admin's copy drift — round 17.3's law. What the TA needs instead is on the same screen and missing: **transitions** (AMBR-03, with reason) and **deletion** (AMBR-07). Replace «Edita les dades» with those two, weighted correctly — the destructive one is not a peer of the primary.

**R7 · The header line is doing four jobs; give it one.** «Sòcia #124 · email · telèfon · alta el 5 d'ag. 2026 (llista blanca · aval: Marta Puig)» packs an invented member number, a field the TA cannot read (B-11), contact data, a date that isn't the date it claims (B-13), a provenance and **someone else's personal data** (23-3) into one grey line nobody can scan. Ruling: the header keeps **name + membership chip** and nothing else. Email, phone and language move into a **Contacte** card (they are the answer to «how do I reach this person», which is a real operator need the current design leaves homeless). Provenance («alta des de llista blanca», with its date) becomes the **first event of the timeline**, where it belongs. The `aval` note does not render on this screen in any form.

**R8 · Avatar — build it; two honest constraints.** `users.avatar` is schema-backed (file, maxSelect 1, ≤2.5 MB) and **named in AMBR-02**, so this is an unimplemented MUST clause, not a new idea. It is **member-uploaded and optional** → the initials chip already drawn is the _default_ render, not the fallback exception; design it that way. Click-to-enlarge: a plain dialog with the image at natural size, `Esc`/backdrop to close, focus returned to the trigger — **no gallery, no zoom, no download**, so it never implies an identity-verification workflow nobody specified. The trigger must be a real `<button>` with an accessible name.

**R9 · Order rows — take four fields from the eco-store card, leave two.** `orders.items` is a **json** column: it arrives with the record, so the product count is **free in the fitxa** (and _not_ sortable in a list query — that asymmetry is why it can live here and not in Comandes' columns). Per row: **code · date · status chip · total · «N productes» · delivery icon** (pickup/lliurament, from `deliveryMethod`). Leave out the **product names** (bloat, and it duplicates the frozen Comanda detail) and the raw `orderNumber` (**B-24**: it is client-generated `TENANT-timestamp-random` today — the eco-store card's `#EL-LLEVAT-1782649247247…` is the _real_ format and the fitxa's `C33-014` is the _target_ one; the fitxa must render the same target as the frozen Comandes module, and B-24 remains the gate for both). The whole row deep-links to the frozen Comanda detail — one target, no nested interactives (round 3 / round 13 grammar).

**R10 · Other improvements worth the space.**

- **The empty states nobody drew**: a member with **zero orders** (the most common state for a new member, and the fitxa's first impression right after approval), zero addresses, and the `SUSPENDED`/`INACTIVE` renders — a member in Baixa should not show live-looking order actions.
- **Neutral copy** (23-13): «Soci/sòcia» is unresolvable from the schema — use the neutral construction the project already needs («Estat de la persona sòcia», or drop the noun: «Estat»).
- **The trial banner earns its page-level weight only when it is urgent.** At 30 days it is a fact, not an alert: it belongs as a line inside the Estat card. Promote it to a page-level banner **only inside ADSH-04's ≤14-day window**, in warning tone, where the escalation grammar the RGPD clock already established applies.

### Verification gap 22 (honest)

DesignSync lost authorization (`/design-login` needs an interactive terminal; this session is non-interactive). **This round read the rendered screenshot, not the source** — unlike rounds 8–22, no template/logic line numbers, no file listing, and the filename `Vista Soci (detall).dc.html` is **inferred**. Everything asserted here about the **schema** (`pb_schema.json`), the **hooks** (all 7 files), the **API rules**, the **requirements** and the **frozen fixtures** is first-hand and re-verified this session. Anything the screenshot does not show — hover states, dark theme, responsive bands, the transition dialogs, whether the view carries scenario props — **is not assessed**. The round therefore ends at the written change package, for Carlos to paste; **nobody patches the `.dc.html`**.

### Change package 23 — paste into Claude design (Catalan)

```text
Revisió de la Fitxa de soci — 15 punts. Els 6 primers són bloquejants.

1. LA REGLA DE LA PROVA ESTÀ INVERTIDA. Treu «passarà a Activa automàticament» del
   bàner i «Prova → Activa és automàtic en vèncer el termini» del text d'ajuda. La
   conversió de Prova a Activa és una DECISIÓ DE L'ADMINISTRADORA (TRL-07: «admin-approved
   conversion»), no un automatisme: en vèncer el termini la sòcia queda en prova caducada
   i la fitxa demana una acció explícita. El text correcte: «Període de prova fins al
   <data>. En vèncer, cal aprovar el pas a Activa.»

2. TREU EL BOTÓ «Edita les dades». AMBR-02 és explícit: adreces i perfil fiscal són de
   NOMÉS LECTURA i «edits stay member-side» (minimització RGPD). La sòcia és propietària
   de la seva identitat, adreces i dades fiscals (les edita a la botiga); l'administradora
   és propietària de la CONDICIÓ DE SÒCIA. Al seu lloc, dues accions: «Canvia l'estat»
   (diàleg amb motiu, AMBR-03) i, separada i amb pes destructiu, «Suprimeix el compte».

3. AFEGEIX LA SUPRESSIÓ DE COMPTE (AMBR-07, MUST, i aquesta pantalla és la que la
   requereix). En obrir la fitxa, consulta proactivament si té comandes en curs (estat
   diferent de LLIURADA/CANCEL·LADA/CADUCADA; PAGADA compta com en curs). Si en té, l'acció
   surt bloquejada amb la llista d'aquestes comandes; si no, diàleg de confirmació amb
   conseqüències + casella (§3.6), sense termes d'implementació al text.

4. TREU «aval: Marta Puig» de la capçalera i de tota la vista. És una dada personal d'una
   TERCERA PERSONA i, a més, avui no té origen: l'únic lloc on podria viure és el camp
   lliure de notes de la llista blanca, una col·lecció que ENCARA NO EXISTEIX a l'esquema.
   Quan existeixi, aquest camp neix amb minimització aplicada (màx. 140 car., amb avís de
   no escriure-hi dades familiars) i s'esborra amb la fila. No pot viure a la línia
   d'identitat permanent d'una altra persona.

5. LA CAPÇALERA ES REDUEIX a: avatar + nom + xip d'estat. Res més. Mou el correu, el
   telèfon i l'idioma a una card nova «Contacte». Mou la procedència («Alta des de la
   llista blanca», amb la data) al primer esdeveniment de la línia de temps. Treu
   «Sòcia #124» (no existeix cap número de sòcia), «(PRV-05a)» i «sol·licitud #212»: els
   identificadors tècnics no van mai al text d'operadora.

6. LES DADES DE LES COMANDES CONTRADIUEN EL MÒDUL COMANDES CONGELAT. Corregeix:
   C33-014 = 35,41 € (no 29,01 €) i cicle 33 = 10–16 d'AGOST (no «dl. 8 des.»). C32-041
   no pot existir: el cicle 32 té 8 comandes a la vista Cicles congelada — fes servir un
   codi dins de rang (p. ex. C32-004). I la «mitjana» de 29,01 i 31,25 és 30,13, no 29,01.

7. FUSIONA «Estat de la sòcia» i «Historial d'estats» en UNA card, «Estat»: a dalt l'estat
   actual + les accions; a sota, separada per un filet, la línia de temps. La línia de
   temps queda CONDICIONADA a la decisió AQ-03 (avui no hi ha cap font: `users` només té
   membershipStatus, trialEndsAt, created i updated — no hi ha ni autoria, ni data de
   transició, ni enllaç a sol·licitud). Si AQ-03 no es resol, la card s'envia sense línia
   de temps. Cap esdeveniment inventat. Nota per quan existeixi: la sòcia pot canviar-se
   l'estat ella mateixa, així que la línia ha de poder atribuir esdeveniments a la sòcia,
   no només a l'administradora.

8. EL CONTROL DE 4 PASTILLES NO POT SER UN SELECTOR. Contradiu el seu propi text: Baixa és
   terminal i Prova→Activa no és una tria manual lliure. Substitueix-lo per l'estat actual
   com a xip + un botó «Canvia l'estat» que obre el diàleg amb NOMÉS les transicions
   legals des de l'estat actual, cadascuna amb el seu motiu obligatori.

9. TO DEL XIP DE PROVA: la família Membership de la DS diu TRIAL = info (blau), no warning.
   Amb 30 dies restants tampoc no entra a la finestra «caduca aviat» (≤14 dies). El bàner
   de pàgina desapareix: la data de fi de prova és una línia dins la card Estat, i només
   puja a bàner de pàgina (to warning) dins dels 14 dies previs.

10. CARD COMANDES — regla de desbordament i files més riques. Mostra les 3 últimes i un
    peu «Veure les 30 comandes →» que obre Comandes filtrat per aquesta sòcia. Cada fila:
    codi · data · xip d'estat · import · «N productes» · icona de lliurament/recollida. Res
    de noms de producte (això és el detall de la comanda). Tota la fila enllaça al detall
    de comanda congelat; cap acció imbricada. TREU la línia «N en total · X € de mitjana»:
    no hi ha cap consulta que la pugui produir (B-14) i el valor actual és incorrecte.

11. CARD ADRECES — mateixa gramàtica: la predeterminada primer, després la més recent,
    màxim 2, i peu «Veure'n totes (5) →». Les adreces desactivades (camp `active`) no poden
    semblar actives: o no es pinten, o porten un xip neutre «desactivada». I treu el segon
    topònim: `user_addresses` té nom, adreça, ciutat, codi postal i telèfon — res més.
    La línia correcta és «C/ Gran de Gràcia 141, 3r 2a · 08012 Barcelona».

12. CARD PERFIL FISCAL — hi falta un estat i sobra una suposició. Hi ha exactament 0 o 1
    perfil per sòcia (índex únic), així que la card és binària. Dibuixa els DOS estats
    buits: (a) el mòdul fiscal del tenant està actiu i la sòcia no n'ha desat cap —el text
    actual, correcte—; (b) el mòdul està desactivat (`fiscalDataEnabled` fals) — llavors la
    sòcia NO el pot activar i el text actual és fals: digues que el mòdul està desactivat a
    Botiga. Estat ple, amb els camps exactes de l'esquema i cap més:
        Núria Solé Ferrer · NIF 46812093D
        C/ Gran de Gràcia 141, 3r 2a · 08012 Barcelona

13. CARD COMPTE — treu «Rol: MEMBER» (l'enum és PARTNER / TENANT_ADMIN / GLOBAL_ADMIN;
    MEMBER no existeix, i un valor d'enum en brut no va mai al text d'operadora: si el rol
    ha de sortir, escriu «Sòcia»). Treu «Última connexió»: no hi ha cap font llegible per
    l'administradora (l'única dada d'accés amb marca de temps és `_authOrigins`, i la seva
    regla només permet llegir els propis registres). «Alta el 5 d'ag. 2026» és la data de
    creació del compte, no una data d'alta històrica (B-13): etiqueta-la «Compte creat el».

14. AVATAR — implementa'l (ja és a AMBR-02 i el camp existeix: fitxer, màx. 2,5 MB). El
    puja la sòcia i és opcional, així que l'estat PER DEFECTE és el cercle amb inicials, no
    l'excepció. Amb foto, el cercle és un botó real que obre un diàleg amb la imatge a mida
    natural (Esc i clic al fons tanquen, el focus torna al botó). Sense galeria, sense zoom,
    sense descàrrega.

15. ESTATS QUE FALTEN, i copy neutre. Dibuixa: sòcia sense cap comanda (és el primer que
    veurà l'administradora just després d'aprovar-la), sense adreces, i les fitxes en estat
    Suspesa i Baixa (una sòcia de baixa no pot mostrar accions de comanda actives). I fes el
    copy neutre de gènere: l'esquema no desa el gènere, «Sòcia» surt d'endevinar el nom de
    pila. Fes servir «Estat» a la card i «la persona sòcia» quan calgui el nom.
```

### Doc fallout (pending — not applied in this pass)

- **REQUIREMENTS §4.6**: AMBR-02's notes column is empty and should carry rulings R1–R10 (the read-only law restated with its two exceptions, the overflow grammar, the header reduction, the AQ-03 gate on the timeline, avatar as an AMBR-02 clause). AMBR-03 should absorb R5/23-10 (transitions are a guarded dialog, never a selector) and AMBR-07 should note that the member detail is a MUST surface for it.
- **B-11 · B-12 · B-13 · B-14 · B-15 · B-24** all re-open on this single view — worth recording that the fitxa is the densest concentration of open schema blockers in the project.
- **AQ-03** moves from "pending" to **gating a drawn card**; the recommendation (a) should be decided before this view is built.

---

## Round 24 — 2026-08-29 · Three critiques of the round-22 build: the data view, the preparation surface, and a screen that cannot exist

**Scope:** screenshots of the applied build (the Estadístiques «Socis» card with its Taula toggle · `Vista Comanda (detall)` C-0142 in continuous mode · the new `Cicles` 24/7 screen). DesignSync was still unauthorized, so the `.dc.html` sources could **not** be re-read — findings come from the screenshots plus the local DS copy, REQUIREMENTS, the PocketBase schema and the hooks. Registered as 24 because a concurrent session took 23 (Fitxa de soci).

### 24-1 🔴 The Cicles 24/7 screen cannot exist — and round 22 asked for it

The mock renders a full view whose own empty state reads «Per als tenants 24/7 aquest apartat no apareix al menú». A screen that explains it is unreachable refutes itself: if the nav item is hidden and the route guarded, no continuous tenant can ever navigate to it. **The cause is this log's own wording** — round 22's package point 1 said a deep link «resol a un estat explicatiu», which reads as an instruction to draw a state. A guarded route does not render; it redirects.

The correction is also a better rule than the one it replaces. Nav visibility must follow the module's **domain**, not the mode flag: a window tenant that switches to continuous keeps its historical cycles, and hiding the module would bury data the cooperative still needs. So — **Cicles appears when the tenant is in window mode _or_ holds ≥1 cycle** (historical: read-only, with a banner); it disappears only when continuous _and_ cycle-less, and then the route redirects to Comandes with a one-time explanation. The screen is deleted, not redesigned.

### 24-2 🟡 The chart data view is a transcription, not a table

The bars are already labelled with their values, and «Taula» renders those same twelve numbers as a full-width twelve-row list **below the still-visible chart**. Duplicated data, ~350 px of vertical space, no header, no units, no total, no comparison — which is exactly why it reads as valueless.

It should not be dropped: DESIGN-BRIEF §3.11 requires «an accessible data-table toggle and keyboard-reachable values», and the list already does one thing the chart cannot — it makes the zero months (mar, jun) legible, invisible as bars. The fix is the form, in three rules now in the brief: the toggle **swaps** the view instead of appending it; the data view is a real `table` (caption, `th scope="col"`, right-aligned tabular figures, total row); and it must carry at least one column the chart lacks — Δ against the previous period, share of the total, or the running total. For this card: `Mes · Altes · Δ · % del total`, `tfoot` = 14 · 100 %.

### 24-3 🔴 The order detail is a form with no save bar — and the write it promises has no server path

`Vista Comanda (detall)` is the preparation surface: «quantitats finals editables», an editable weight input, a per-line unavailable action. It is therefore a route form and DS §10 applies — but there is **no save bar anywhere**. The only actions are «Anul·la la comanda» and «Passa a "A punt"», both in the top-right corner, far from the work.

Worse, the write has no writer. **New B-33:** `subtotal`/`tax`/`total` are computed and price-verified only in `onRecordCreateRequest` (`on_create_order.pb.js:179-182`, against `products.priceWithIva`); **no hook reacts to an order update**. Adjusting a final quantity therefore either leaves the stored money stale — poisoning invoicing, the facturable rule and every Tauler/Estadístiques total — or requires the client to PATCH money values, which is precisely what the create-path verification exists to prevent. Same family as B-19/B-21/B-22/B-25: UI promising a write nothing performs.

Other findings on the same surface:

- **One primary at a time** (now a §3.16 extension): while dirty the sticky bar saves; only when clean does it become «Passa a "A punt"». Advancing state with unsaved quantity edits must be impossible — and the transition then sits next to the work, leaving the header only the destructive action.
- **The Cicle card duplicates the header.** The header meta already reads «Sense cicle · venda contínua»; the card repeats it. Round 17's one-owner-per-field law applies — the header keeps it (linking to the cycle when one exists) and the card is deleted, in both modes. Round 22's point 6 offered «o desapareix, o diu…»; the build did both. The ambiguity was mine.
- **The member's own note is missing.** `orders.notes` exists in the schema and is invisible here; the quoted «Truqueu al timbre del local…» is the _delivery-instructions_ snapshot, a different field. At picking time the member's note is operational content.
- **Right-rail order should follow the task**: Lliurament (where and when — it drives the label and the batch) → Soci → Pagament (irrelevant while picking) → and no Cicle card.
- **Totals must recompute from Final, not Demanat**, and show the delta against the ordered total: the member will be charged a different amount, and that must be visible before the transition.

### Change package 24 — paste into Claude design (Catalan)

1. **Esborra `Cicles (botiga 24-7).dc.html`.** Va ser un error meu demanar-la: si l'ítem de nav s'amaga i la ruta està protegida, cap tenant continu podrà veure mai aquesta pantalla — i el seu propi estat buit diu que l'apartat no apareix al menú. No s'ha de redissenyar, s'ha d'eliminar.
2. **Eco Admin DS §12 — corregeix la regla de nav condicional:** la visibilitat segueix el **domini** del mòdul, no el flag de mode. «Cicles» apareix quan el tenant és en mode finestra **o** té ≥1 cicle — els cicles històrics sobreviuen a un canvi de mode i han de continuar consultables en **només lectura**, amb un bàner «Aquesta cooperativa ara ven en continu: aquests cicles són històrics». Només desapareix quan el tenant és continu **i** no té cap cicle; llavors la ruta redirigeix a Comandes amb una explicació d'un sol ús (snackbar). Cap pantalla dedicada.
3. **Eco Admin DS §14 (dataviz) — nova regla «Vista de dades d'un gràfic»:** el commutador **intercanvia** la vista, mai afegeix una taula sota un gràfic que ja etiqueta les barres; la vista de dades és una **taula real** (`caption`, `th scope="col"`, xifres alineades a la dreta amb `tabular-nums`, fila de total), no una llista; i ha d'aportar com a mínim una columna que el gràfic no té — Δ respecte del període anterior, % del total o acumulat. Els períodes amb valor zero, invisibles com a barra, sempre hi surten («0 altes»).
4. **`Vista Estadístiques.dc.html` — aplica el punt 3 a la card «Socis»:** en prémer «Taula» el gràfic se substitueix (no conviuen); la taula és `Mes · Altes · Δ · % del total` amb `tfoot` = `14 · 100 %`, i manté els mesos a zero. Mateix patró per a la resta de cards amb gràfic.
5. **`Vista Comanda (detall).dc.html` — reconverteix-la en superfície de preparació:**
   a. **Barra de desar §10 enganxada a baix**, mode editar: apareix quan hi ha canvis («Canvis sense desar» + Descarta + «Desa els canvis»). **Un sol primari alhora**: mentre hi hagi canvis sense desar, el botó de transició no és accessible; quan tot està desat, la barra passa a mostrar «Passa a "A punt"». La capçalera conserva només «Anul·la la comanda».
   b. **Amplia la Cistella** (és la superfície de treball) i **reordena el rail dret segons la tasca**: Lliurament → Soci → Pagament. **Elimina la card «Cicle»** — la capçalera ja ho diu («Sense cicle · venda contínua», o el nom del cicle enllaçat quan n'hi ha); una dada, un propietari.
   c. **Afegeix la nota del soci** (`orders.notes`) com a bloc propi dins de la Cistella, visualment distingit de la instrucció de lliurament (que és una instantània del checkout, un altre camp). Si és buida, no es pinta.
   d. **Els totals es recalculen des de «Final», no des de «Demanat»**, i mostren la diferència respecte de l'import demanat («35,41 € · −2,10 € respecte del demanat»).
   e. Marca que tot el bloc d'ajustos de preparació depèn de **B-33** (avui cap hook recalcula els totals en actualitzar una comanda) i de **AQ-16**: es pot dibuixar, no es pot construir fins que existeixi l'escriptor.

---

## Round 25 — 2026-08-29 · Round 24 verified on the order detail · status parity · the line review model · the delivery run

**Round 24 verification (from the rebuilt `Vista Comanda (detall)` C33-014):** point 5 applied **5/5** — the §10 bar is at the foot («Tot desat · La cistella és la que es cobrarà. Quan estigui llesta, avança d'estat.») with «Passa a "A punt"» as its single primary and the header reduced to «Anul·la la comanda»; the right rail is reordered Lliurament → Soci → Pagament; the Cicle card is gone and the header carries «Cicle 33 · 10–16 d'agost … · detall del cicle →»; the member's note appears as its own block inside the Cistella, visually distinct from the delivery instruction, which is now explicitly labelled «instantània del checkout»; and the SPEC carries the B-33 warning. **Points 1–4 (deleting the Cicles 24/7 screen, the DS §12 nav rule, the §14 data-view rule, the Estadístiques table) could not be verified — DesignSync is still unauthorized.** Round 23 (Fitxa de soci, concurrent session) is likewise unverified here.

### 25-1 🔴 The same state has two names across the two apps

| DB enum     | eco-admin           | eco-store (`ca.json`) | Ruling                                  |
| ----------- | ------------------- | --------------------- | --------------------------------------- |
| `PENDING`   | Pendent             | PENDENT               | —                                       |
| `CONFIRMED` | Confirmada          | CONFIRMADA            | —                                       |
| `PREPARING` | En preparació       | EN PREPARACIÓ         | —                                       |
| `READY`     | **A punt**          | **PREPARADA**         | → «A punt» in both                      |
| `DELIVERED` | **Lliurada**        | **REBUDA**            | → «Lliurada» in both                    |
| `CANCELLED` | Anul·la / Anul·lada | CANCEL·LADA           | → «Cancel·la» / «Cancel·lada» in both   |
| `EXPIRED`   | Caducada            | **absent**            | storefront type is narrower — see below |
| `PAID`      | absent              | absent                | legacy, AQ-07: drop from the enum       |

«Preparada» must lose, not «A punt»: it sits one letter away from `PREPARING`'s «En preparació», and two near-identical words for two adjacent states is a legibility defect in a list. «Rebuda» is the more defensible divergence — it is the member's perspective — but a member phoning to say «diu Rebuda» while the admin reads «Lliurada» is one fact with two names; perspective belongs in a sentence on the member's card («la vas rebre el dc. 19»), never in a different chip.

Verified in code: `libs/eco-store/core/entities/src/order.ts:12-19` declares **six** statuses while `pb_schema.json` declares **eight**. An order carrying `EXPIRED` or `PAID` falls through `ORDER_STATUS_CONFIG` and renders a blank chip in the member app. Latent today (B-21: nothing writes `EXPIRED`), but it is a real hole the moment either value is written — an eco-store-side fix, not a design one.

### 25-2 🟡 The basket has no per-line review model

The build lets the admin edit a final quantity and strike a line, but nothing records that a line was _looked at_. Advancing the order is therefore a judgement call about a basket nobody can see the state of. The model, now in AORD-02: each line resolves to exactly one of **accepted as ordered** (one tap) · **adjusted** (editing the quantity marks it reviewed implicitly — no second gesture) · **cancelled as unavailable** (struck, out of the total, offering a reason). The reason stays **optional** per Carlos's ruling, but is _pre-offered_ with preset chips («Esgotat», «Qualitat insuficient», «No ha arribat del proveïdor») plus free text — the same preset pattern as the Botiga close dialog — so giving one costs a tap and most lines will carry one. A header action «Accepta-ho tot tal com està» resolves every untouched line at once: a basket with nothing wrong must cost one tap, not five.

The transition is then **gated on completeness**, which answers where the CTA belongs: the bar reads «N de M productes revisats» and «Passa a "A punt"» stays disabled until N = M. That is stronger than moving the button closer to the basket — it makes the button _impossible to press_ on an unreviewed basket, and the progress text ties it to the work without duplicating the control.

### 25-3 🟡 Nobody designed what the view becomes after the transition

Once the order leaves `PREPARING` the review controls disappear, the basket becomes a **read-only summary of what will be charged** — cancelled lines still visible, struck, with their reason; the delta against the ordered amount pinned — and the bar's primary becomes the next transition («Marca com a lliurada»). After `DELIVERED` the bar shows a terminal line and no primary. Payment is orthogonal throughout: «Marca com a pagada» lives in the Pagament card and never gates or is gated by the delivery state.

### 25-4 🔴 The delivery moment has no surface at all (new AORD-09)

Distribution volunteers work from a phone, at a door or a pickup point, and the order detail is the wrong tool: they need the **day's run**, not one order. New AORD-09: deliveries grouped by `deliveryMethod`, each row carrying only member · address or pickup point · slot · total · payment chip · the member's note, with **two independent primary actions** — «Lliurada» and «Pagada» — because payment may happen before, during or after handover and neither may gate the other. Bulk «marca tot el torn com a lliurat» for a pickup slot. Targets ≥48 px, thumb-zone actions, no horizontal scroll.

**This gives B-32 a second dependent.** A run cannot be grouped by day without a resolved delivery date: `orders.day` is a weekday with no week anchor and is populated on 4 of 82 local orders. B-32 now blocks both the continuous-tenant preparation batch (round 22) and the delivery run.

**And it exposes a role gap — new AQ-20.** The only tenant-side role is Tenant Admin, which also grants price and product editing. Either a limited «distribució» role exists, or the volunteer marking a doorstep delivery can also change prices. A v1 answer of «they are TAs» is acceptable, but must be explicit.

### Change package 25 — paste into Claude design (Catalan)

1. **Paritat de noms d'estat entre eco-admin i eco-store** (un estat, un nom): `READY` = **«A punt»** a les dues apps (avui la botiga diu «PREPARADA», que xoca amb «En preparació» de `PREPARING`); `DELIVERED` = **«Lliurada»** a les dues (la botiga diu «REBUDA» — la perspectiva del soci va en una frase de la seva targeta, «la vas rebre el dc. 19», mai en un xip diferent); `CANCELLED` = acció «Cancel·la la comanda» / estat «Cancel·lada» a les dues. Actualitza els xips i el stepper de totes les vistes d'admin que els mostrin.
2. **`Vista Comanda (detall).dc.html` — model de revisió per línia.** Cada línia es resol en **una** de tres sortides, visible a la fila: **acceptada tal com és** (un sol toc, botó de check), **ajustada** (editar la quantitat final ja la marca com a revisada — cap segon gest) i **anul·lada per no disponible** (ratlla la línia, la treu del total). En anul·lar, obre a la mateixa fila un bloc de motiu **opcional però ja ofert**: xips de preset «Esgotat» · «Qualitat insuficient» · «No ha arribat del proveïdor» + text lliure (mateix patró que el diàleg de tancament de Botiga). Les files no revisades es distingeixen visualment de les revisades. Afegeix una acció de capçalera **«Accepta-ho tot tal com està»** que resol d'un cop totes les línies intactes. Anul·lar una línia és reversible abans de desar («Restaura»).
3. **La barra §10 mostra el progrés i bloqueja la transició:** «N de 5 productes revisats» a l'esquerra; «Passa a "A punt"» **deshabilitat** (amb `aria-disabled` i motiu) fins que N = 5. Així el botó no cal acostar-lo més a la cistella: no es pot prémer amb la cistella a mitges, i el text del progrés ja el lliga a la feina.
4. **Estat posterior a la transició** (avui no dibuixat): en sortir d'«En preparació» desapareixen els controls de revisió, la Cistella passa a **resum de només lectura del que es cobrarà** — les línies anul·lades s'hi queden ratllades amb el seu motiu i la diferència respecte del demanat queda fixada — i el primari de la barra passa a ser «Marca com a lliurada». Després de «Lliurada», la barra mostra una línia terminal i cap primari. El pagament és independent sempre: «Marca com a pagada» viu a la card Pagament i no bloqueja ni el bloqueja la transició d'entrega.
5. **Nova vista `Lliuraments` — escriptori i mòbil, amb el mòbil com a cas principal.** És el torn del dia, no una comanda: files agrupades per mètode (Recollida / Domicili) amb només el que necessita qui reparteix — soci · adreça o punt de recollida · franja · total · xip de pagament · nota del soci — i **dues accions primàries independents** per fila: «Lliurada» i «Pagada» (el cobrament pot ser abans, durant o després del lliurament; cap de les dues condiciona l'altra). Acció massiva «Marca tot el torn com a lliurat» per a una franja de recollida. Objectius ≥48 px, accions a la zona del polze, sense scroll horitzontal, i telèfon i adreça accionables (trucar / mapes). Marca al SPEC que la vista depèn de **B-32** (sense data d'entrega resolta no es pot agrupar un torn) i de **AQ-20** (quin rol pot marcar lliurada/pagada).

---

## Round 25.1 — 2026-08-30 · Rounds 22, 24 and 25 verified in source — three nav/scope residuals

**DesignSync re-authorized.** Everything pending verification was re-read from source. Result: **round 24 closes 4/4** (point 5 closed last round) **and round 25 closes 5/5**, plus the round-22 backlog.

| #     | Check                                      | Result                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 24.1  | `Cicles (botiga 24-7).dc.html` deleted     | ✓ Gone from the project listing                                                                                                                                                                                                                                                                                                                                                                            |
| 24.2  | DS §12 domain-based nav rule               | ✓ Verbatim — window mode **or** ≥1 cycle, historical read-only with banner, guarded redirect + one-time snackbar, and the build even kept the reasoning: «una pantalla que explica que no és accessible es refuta a si mateixa»                                                                                                                                                                            |
| 24.3  | DS §14 «Vista de dades d'un gràfic»        | ✓ Swap-never-append, real table, added-column requirement, zero-periods rule                                                                                                                                                                                                                                                                                                                               |
| 24.4  | Estadístiques table                        | ✓ `cChartShow: !S.cTab` on **all three** chart cards (toggle relabels Taula↔Gràfic, `aria-pressed`), `caption` + `th scope="col"` + `tfoot`, columns `Δ` + `% del total`, zero months present in the data (mar/jun 2026)                                                                                                                                                                                   |
| 25.1  | Label parity                               | ✓ `Vista Comanda (detall)`: «A punt» ×1 · «Lliurada» ×1 · «Cancel·la la comanda» ×2, zero «Preparada/Rebuda/Anul·lada». `Vista Comandes`: same — «A punt» ×3 · «Lliurada» ×3 · «Cancel·lada», zero legacy labels                                                                                                                                                                                           |
| 25.2  | Line review model                          | ✓ Three presets + free text, «Accepta-ho tot tal com està», «Restaura» (reversible), implicit review on quantity edit                                                                                                                                                                                                                                                                                      |
| 25.3  | Completeness gate                          | ✓ `barTitle: … nRev + ' de ' + LINES.length + ' productes revisats'` with `aria-disabled` on the CTA                                                                                                                                                                                                                                                                                                       |
| 25.4  | Terminal state                             | ✓ `terminal` branch: read-only basket, «es cobrarà», bar primary → «Marca com a lliurada», then terminal line                                                                                                                                                                                                                                                                                              |
| 25.5  | `Vista Lliuraments`                        | ✓ Mobile-first (`dispositiu` prop, one component two shells per §16), grouped Recollida/Domicili, rows = member · where · slot · total · payment chip · note, **two independent primaries** ≥48px with `aria-pressed` + snackbar-undo, bulk per slot (only offered while undelivered remain), `tel:` + maps links, header progress «N de M lliurades · N de M pagades», SPEC carries B-32 + AQ-20 + parity |
| 22-bk | `Botiga (24-7)` / `Comandes (botiga 24-7)` | ✓ Thin `dc-import` wrappers over the canonical views with `escenari="24/7"` — the de-forked pattern; Comandes' 24/7 branch swaps the cycle selector for retrieval periods and has its own dataset. `Estadístiques (24-7)` ✓ — cycle zone gone from the scope selector, rolling 7/30/90-day windows, cycle references only in the SPEC prose explaining the removal                                         |

### Residuals (findings 25.1-R)

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                              | Sev |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| R1  | **Nav drift: «Lliuraments» exists only in its own view.** The new module sits in `Vista Lliuraments`' desktop rail (after Comandes) but the DS §12 nav anatomy still ends «… Botiga · Estadístiques», and every other view's nav lacks the item. A module that appears and disappears depending on which screen you are on is the exact defect §12 exists to prevent                 | 🟡  |
| R2  | **The Lliuraments mobile drawer omits Cicles, Categories and Estadístiques** — frozen §15 law says «calaix modal (hamburguesa), mateix ordre i badges que l'escriptori». Seven items against the rail's ten                                                                                                                                                                          | 🟡  |
| R3  | **The Comandes 24/7 scope selector has no work scope.** Options are «Totes les comandes · Última setmana · Últim mes» (default `setm`), but AORD-01 (round 22) rules the continuous default scope as **«obertes ara»** — the operator's work queue. Retrieval periods are the secondary axis, not the default. Position held: an operator list defaults to the work, not the archive | 🟢  |

### Change package 25.1 — paste into Claude design (Catalan)

1. **Eco Admin DS §12 — afegeix «Lliuraments» a l'anatomia de la nav**, entre Comandes i Cicles (glif `local_shipping`), i actualitza la nav de **totes** les vistes que en dibuixen una perquè el portin — un mòdul no pot aparèixer i desaparèixer segons la pantalla on ets.
2. **`Vista Lliuraments` — calaix mòbil complet:** el calaix ha de dur els mateixos ítems i ordre que el rail d'escriptori (§15: «mateix ordre i badges que l'escriptori») — hi falten Cicles, Categories i Estadístiques.
3. **`Vista Comandes`, escenari 24/7 — el selector d'abast guanya «Obertes ara» com a opció per defecte** (la cua de treball de l'operador), amb «Última setmana · Últim mes · Totes» com a recuperació. Una llista d'operació obre per la feina, no per l'arxiu (AORD-01, ronda 22).

---

## Round 25.2 — 2026-08-30 · Package 25.1 verified 3/3 — the order's two work surfaces are design-complete

**Exhaustive verification** (every nav-bearing surface fetched and grepped, not sampled):

| #   | Check                                              | Result                                                                                                                                                                                                                                                                                                                          |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | «Lliuraments» in DS §12 anatomy + every view's nav | ✓ **12/12 surfaces**: the §12 anatomy sample and Shell Tauler A (frozen), Tauler (mòbil) drawer (frozen), Vista Lliuraments (rail + drawer), Comandes, Socis, Cicles, Productes, Categories, Botiga, Sol·licituds, Estadístiques — all carry `local_shipping · Lliuraments` in the ruled slot, after Comandes and before Cicles |
| 2   | Lliuraments mobile drawer complete                 | ✓ Ten items in rail order — Cicles, Categories and Estadístiques restored                                                                                                                                                                                                                                                       |
| 3   | Comandes 24/7 work scope                           | ✓ `{ key: 'ober', label: 'Obertes ara', icon: 'schedule' }` heads the selector and is the scenario default (`'24/7' ? 'ober'`), with Última setmana · Últim mes · Totes · Interval as retrieval                                                                                                                                 |

**Closes rounds 24, 25 and 25.1 entirely.** The two work surfaces of an order (preparation with the three-outcome line review; the mobile-first delivery run) are design-complete. What remains is not design: **B-33** (recompute-on-update writer — gates building the editable basket), **B-32** (resolved delivery date — gates grouping any real run), **AQ-16** (adjustment scope) and **AQ-20** (who may mark delivered/paid).

---

## Round 26 — 2026-08-30 · Lliuraments UI hardening: state vs action, and the run's retrieval kit

**Trigger:** Carlos's exhaustive review of the applied run view — the delivered state has no chip while payment does; asks for filters, sort, pagination, and anything else.

### Findings 26

| #    | Finding                                                                                                                                                                                                                                                                                                                                                    | Sev |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 26-1 | **State and action are fused.** Payment renders as chip (state) + button (action); delivery renders only as a button whose label mutates («Marca lliurada» → «Lliurada») — the button doubles as the indicator, which is why delivered rows cannot be scanned. Verified in source: `delTxt: dn ? 'Lliurada' : 'Marca lliurada'`, no delivery chip anywhere | 🔴  |
| 26-2 | **The delivered card's only mark is `opacity: .72`** — a subtle cue that also degrades text contrast (WCAG 1.4.3). State must be explicit, not translucent                                                                                                                                                                                                 | 🟡  |
| 26-3 | **The order code links nowhere.** `C33-014` is a plain span; the member name links to the _member_ detail. §04 law: the identity cell is the canonical link — and this row's identity is the order («did my tomatoes make it in?» at the door is answered by the order detail)                                                                             | 🟡  |
| 26-4 | **No retrieval kit**: no search, no state/method filters, no order control, no load boundary — fine at 9 rows, dead at a 40-order run. §05 (filter bar + 12.1 reset) and §15 (load-more with counts) already legislate the shapes                                                                                                                          | 🟡  |
| 26-5 | Group headers state totals but not progress; nobody can see «queden 2 per pagar» without reading every card                                                                                                                                                                                                                                                | 🟢  |
| 26-6 | The bulk button doesn't say how many it will touch                                                                                                                                                                                                                                                                                                         | 🟢  |

### Rulings 26

**State lives in chips, actions in buttons — never both in one control.** Every card carries the chip pair _always_: delivery `Pendent` (schedule, warning) / `Lliurada` (task_alt, success) as a filled chip, payment `€ No pagada` / `€ Pagada` outlined (payment-family law, §3.4). Buttons stop encoding state.

**Pending rows loud, done rows quiet.** A delivered card compacts — chips carry the state, actions collapse to a small «Desfés» — takes a success-tinted surface (replacing the opacity hack) and **sinks to the bottom of its group**. The remaining work stays big, on top, with big thumb-zone buttons. This answers «saber en què està» better than any filter: the eye finds the work because the finished rows stopped shouting.

**Filters via §05, with the counters doing double duty.** Search (nom/codi — typing three letters is the fastest «qui ets?» tool at a pickup table), chips `Pendents · Lliurades · No pagades · Recollida · Domicili`, and the header's existing «5 de 9 lliurades · 6 de 9 pagades» become tappable, applying the same filters. 12.1: conditional reset + distinguishable filtered-empty state.

**Sort: within-group, two options only.** `Ruta` (default — slot/route order, the operational sequence) · `Nom` (laying out pickup baskets alphabetically). No amount sort, no global sort — the grouping _is_ the primary order.

**Pagination: «Carrega'n més» on both shells, never a classic paginator.** §15 already rules it for mobile; the desktop matches because splitting a shift across pages hides pending work — the same reason «obertes ara» defaults the 24/7 Comandes scope. Visible/total counts per filter, threshold ~20 per group.

**Plus:** group headers gain progress («4 de 6 lliurades») and the pending-payment sum («queden 2 per pagar · 76,50 €»), sticky on scroll; the code links to the Comanda detail; bulk labels the remaining count («Marca les 2 restants com a lliurades»).

### Change package 26 — paste into Claude design (Catalan)

1. **Estat i acció se separen.** Cada card porta **sempre** el parell de xips a la capçalera: lliurament `Pendent` (schedule, warning) / `Lliurada` (task_alt, success) com a xip ple, i pagament `€ No pagada` / `€ Pagada` amb la família outlined de sempre. Els botons deixen de fer d'indicador: mai canvien d'etiqueta per dir un estat.
2. **Files pendents cridaneres, files fetes silencioses.** Una card lliurada es **compacta** (els xips diuen l'estat; les accions es redueixen a un «Desfés» petit), pren una superfície tenyida de success amb vora success (fora l'`opacity: .72` — degrada el contrast) i **baixa al final del seu grup**. La feina que queda es queda a dalt, gran, amb els botons a la zona del polze. Respecta `prefers-reduced-motion` en el moviment.
3. **Barra de filtres §05:** cerca a tot l'ample (nom o codi) + xips `Pendents · Lliurades · No pagades · Recollida · Domicili`; els comptadors de la capçalera («5 de 9 lliurades · 6 de 9 pagades») passen a ser **premibles** i apliquen el mateix filtre. Regla 12.1: «Neteja els filtres» condicional, retorn de focus a la cerca, estat buit filtrat distingible amb el mateix reset.
4. **Ordena dins del grup, dues opcions:** `Ruta` (per defecte — franja i ordre operatiu) · `Nom` (per estendre cistelles per ordre alfabètic al punt de recollida). Cap ordre global ni per import: l'agrupació és l'ordre primari.
5. **Paginació = «Carrega'n més»** amb recompte visible/total per filtre, a **totes dues** carcasses (§15) — mai un paginador clàssic: una cua de treball no amaga feina pendent darrere d'una pàgina. Llindar ~20 per grup.
6. **Capçaleres de grup amb progrés i suma pendent:** «Recollida · 4 de 6 lliurades · queden 2 per pagar (76,50 €)», enganxoses en fer scroll.
7. **El codi de la comanda enllaça al detall** (`C33-014` → Vista Comanda (detall), llei §04: la identitat és l'enllaç); el nom del soci continua enllaçant al soci.
8. **El botó massiu diu quantes en toca:** «Marca les 2 restants com a lliurades» (i desapareix quan no en queda cap, com ara).

---

## Round 26.1 — 2026-08-30 · Package 26 verified 8/8 — Lliuraments closed

Point-by-point against the fetched source:

| #   | Check                              | Result                                                                                                                                                                                                                                                                                                                                  |
| --- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Chip pair always, buttons as verbs | ✓ Every card renders the filled delivery chip (`schedule · Pendent` warning / `task_alt · Lliurada` success-fill) + the outlined `€` payment chip + the slot chip; every button is a verb that never mutates into a state label («Marca com a lliurada» · «Marca com a pagada» · «Desfés» · «Desfés el pagament»)                       |
| 2   | Quiet done rows                    | ✓ Delivered card: success-tinted surface + success border (`opacity` gone entirely), reduced padding, contact/note/where hidden (`showWhere/showContact/hasNote: !dn`), actions collapse to «Desfés» — and the group comparator sinks delivered rows first: `(delivered(a)?1:0)-(delivered(b)?1:0)`. Reduced-motion media query present |
| 3   | §05 filter bar + tappable counters | ✓ Full-width search (aria-label, ref), five chips with `aria-pressed` + check glyph, header counters are `<button aria-pressed>` wired to the same filters, conditional «Neteja els filtres», filtered-empty state with the same reset, and `resetF` returns focus to the search (12.1 complete). Search even strips accents (NFD)      |
| 4   | Within-group sort                  | ✓ ORDENA `Ruta` / `Nom` segmented with `aria-pressed`; `Nom` uses `localeCompare(…, 'ca')`; delivered-sink always wins first; no global or amount sort                                                                                                                                                                                  |
| 5   | Load-more                          | ✓ Per group, threshold 20, «Carrega'n més · es mostren N de M» where M is the _filtered_ count; no classic paginator                                                                                                                                                                                                                    |
| 6   | Group headers                      | ✓ Sticky (`position:sticky`), progress «N de M lliurades · queden X per pagar (74,65 €)» with ca-formatted sums, «tot pagat» when clear; empty groups hidden                                                                                                                                                                            |
| 7   | Identity links                     | ✓ The code is now a link with an accessible name («Obre el detall de la comanda C33-014») → Comanda detail; the member name keeps linking to the member                                                                                                                                                                                 |
| 8   | Bulk remaining count               | ✓ «Marca les N restants com a lliurades» with a proper singular form, hidden at zero, plural-aware snackbar                                                                                                                                                                                                                             |

**One accepted tradeoff, recorded:** on a delivered card the payment-undo control is hidden (`canUndoPay: pd && !dn`) — undoing a mistaken payment there takes two steps (undo delivery first) or the snackbar's immediate «Desfés». That is the cost of the quiet-done compactness and it is the right trade; noted so the builder doesn't "fix" it into a third button.

**Lliuraments is design-complete.** Construction gates unchanged: B-32, B-33, AQ-16, AQ-20.

---

## Round 27 — 2026-08-30 · Sol·licituds IA: one entity, three jobs — sections over filters, and where the future communication modules live

**Trigger:** Carlos's unease with the safata — _"mezcla items de diferentes entidades y lo veo algo confuso"_ — plus the question whether product reviews/ratings are the tenant admin's to manage.

### Findings 27

| #    | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Sev |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 27-1 | **The pending tray shows a paginator the spec forbids.** AREQ-01: pending trays are **not** paginated (a work queue hides urgency behind page 2); only Missatges and Resolts paginate. The mock renders `mat-paginator` («Elements per pàgina 10 · 1–8 de 8») under the pending tray, and its own SPEC footer says «mat-paginator (10/25/50) **a totes les safates**» — the mock contradicts the requirement it quotes                                                                                                                                                                                                      | 🔴  |
| 27-2 | **Round 4.1's diagnosis was fixed at row level, not list level.** 4.1 named the root cause — _"four different jobs forced into one row template"_ — and normalized the row; but the tray still interleaves a statutory-clock queue (5 `ACCOUNT_DELETION`: deadline/state chips) with a membership funnel (2 `SIGNUP` + 1 `MEMBERSHIP_TERMINATION`: age + inline verb). The right column alternates three grammars — deadline chip, bare age, action button — so the operator re-parses every row. This is exactly Carlos's "mixes different entities" instinct: the data model is one collection; the mixing is of **jobs** | 🟡  |
| 27-3 | **Type chips make the operator choose a lens instead of giving an order of work.** `Totes · Altes · Baixes · Supressió RGPD` is retrieval machinery on an 8-row unpaginated queue whose whole job is priority. (Fixture arithmetic is honest: 2 + 1 + 5 = 8 ✓; chip states match AREQ-02 — Josep 27 elapsed ⇒ critical, Núria 9 elapsed ⇒ neutral ✓)                                                                                                                                                                                                                                                                        | 🟡  |
| 27-4 | **The two recorded 4.1g deviations come due** — both filed as "corrected when the view is next touched": the search sits right (§05 law: left, 300px), and the card rows are div-rows without keyboard access (D.13 residual)                                                                                                                                                                                                                                                                                                                                                                                               | 🟡  |
| 27-5 | **Three Layer-3 modules have no ruled destination** (AREV reviews · ACOM comunicats · AMSG messaging). The safata is the obvious dumping ground, and without a ruling it becomes a junk drawer the day the first one unblocks. Carlos's question — does the TA manage product reviews? — is AREV, and REQUIREMENTS already answers "yes, specced, zero tasks" without ever saying **where**                                                                                                                                                                                                                                 | 🟡  |

### Rulings 27

**The mixed inbox stays; the mixed list goes.** One collection, three jobs — 4.1's tab split (CONTACT out) was the entity-level answer; round 27 finishes it at list level. The pending tray renders as **two fixed sections** — «Supressions RGPD · N» and «Altes i baixes · N» (the frozen chip vocabulary, reused) — replacing the type chips. Sections are self-prioritizing where chips demand a decision, and each section's right column becomes homogeneous: the round-26 state/action grammar applied to a list. Headers sticky with live counts (Lliuraments precedent); an empty section disappears; both empty = the AREQ-10 success state («Tot al dia!»).

**Each section keeps its own clock.** Supressions RGPD sorts by **the date that governs the chip** — the art. 12.3 deadline, or `plannedExecutionAt` once a reply exists — ascending, so a «Data prevista superada» floats up on its own. Altes i baixes stays oldest-first (AREQ-01). No global sort control.

**Filters are retrieval, sections are priority.** Type + date filters live where retrieval is the job: Resolts (AREQ-10) and the paginated Missatges volume. Search (name/email) stays on every tray — moved **left** per §05, closing the 4.1g deviation. The two rules compose: Lliuraments correctly runs chips _inside_ job-sections, because there the chips filter homogeneous rows.

**AREV answered: the TA moderates reviews — in Productes, never here.** A review reply is **public content anchored to a product**; an AREQ-07 reply is **private correspondence with a legal trace** (immutable `repliedAt`, platform-From / coop-Reply-To). Different object, different lifecycle, different blast radius — they must not share a compose surface. Home when Q-13/VAL-01 unblock: a «Valoracions» moderation queue under **Productes** plus a Tauler attention card (the ADSH pattern: the Tauler aggregates, modules own the work).

**The end state has three lanes, and no renames today.** Sol·licituds = **casos** (lifecycle decisions with legal trace) · «Converses» = **fils** (AMSG absorbs the Missatges tab when Q-05 resolves — CONTACT messages are proto-conversations; the tab is correct as interim) · «Comunicats» = **sortida** (ACOM: compose · audience · history — campaign anatomy, its own nav module per the round-24 domain-based nav rule). Nothing joins the safata that is not a `tenant_requests` row.

### Change package 27 — paste into Claude design (Catalan)

1. **Fora el paginador de la safata pendent.** AREQ-01: les cues pendents no es paginen — la feina no s'amaga a la pàgina 2. El `mat-paginator` queda només a Missatges i Resolts. Corregeix també la línia SPEC del peu: «a totes les safates» → «només a Missatges i Resolts».
2. **Seccions en lloc de xips de tipus.** La safata pendent es parteix en dues seccions fixes amb capçalera enganxosa i recompte viu: «Supressions RGPD · 5» i «Altes i baixes · 3» (reutilitza el vocabulari dels xips — no n'inventis). Fora els xips `Totes / Altes / Baixes / Supressió RGPD`. Una secció buida desapareix; les dues buides = l'estat d'èxit «Tot al dia!» sense insígnia.
3. **Cada secció amb el seu ordre, cap control global.** Supressions RGPD: per la data que governa el xip — el termini de l'art. 12.3 o, quan hi ha resposta, la `plannedExecutionAt` — ascendent (una «Data prevista superada» puja sola). Altes i baixes: la més antiga primer.
4. **La cerca passa a l'esquerra (§05, 300px)** — tanca la desviació registrada 4.1g. «Neteja els filtres» (12.1) condicional, ara només per a la cerca; retorn de focus a la cerca; estat buit de cerca distingible amb el mateix reset.
5. **Files amb teclat.** Les files-carta són `div` sense accés per teclat (residual D.13): cada fila esdevé focusable amb nom accessible, Enter obre el side sheet (ruta filla `/sol-licituds/:id`, §3.13), chevron passiu — el contracte §3.14 sencer.
6. **Gramàtica homogènia per secció:** a Supressions RGPD tota fila porta el xip de termini/estat (AREQ-02/09) i cap botó inline; a Altes i baixes tota fila porta edat i només `SIGNUP` el verb inline («Aprova l'alta» / «Reactiva…»). Xips = estat, botons = acció (llei de la ronda 26).
7. **Línia SPEC nova al peu:** «AREV (valoracions de producte) NO entra a la safata — cua de moderació a Productes + targeta al Tauler quan Q-13/VAL-01 es desbloquegin. AMSG absorbirà la pestanya Missatges com a "Converses" (Q-05); ACOM (comunicats) és un mòdul propi de nav. A la safata només hi viuen files de `tenant_requests`.»

---

## Round 27.1 — 2026-08-30 · Package 27 verified 7/7 on desktop — two residuals: row-link ARIA and mobile parity

Point-by-point against the fetched source (`Vista Sol·licituds.dc.html`, 680 lines / 88 KB):

| #   | Check                       | Result                                                                                                                                                                                                                                                                                                                                                                            |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Paginator out of pending    | ✓ `paged = S.tab !== 'sol'`, `vPag: paged && total > 0` — the `mat-paginator` block renders only on Missatges/Resolts; SPEC line corrected to «mat-paginator (10/25/50) només a Missatges i Resolts — la cua pendent no es pagina (AREQ-01)»                                                                                                                                      |
| 2   | Sections replace type chips | ✓ `[['Supressions RGPD', rgpd], ['Altes i baixes', ab]].filter(len)` — sticky counted headers (`position:sticky;top:0` + «· N»), empty section disappears, empty tray = «Tot al dia!» success state, search-empty distinguishable with the same reset. Chips render **only** on Resolts (`showChips: S.tab === 'hist'`), where the CHIPSET correctly adds «Missatges» per AREQ-10 |
| 3   | Per-section sort            | ✓ `govKey`: live rows → `30 − days` (remaining), replied rows → `plannedExecutionAt − today` — ascending, so «Data prevista superada» (negative) floats up on its own; Altes i baixes → `b.days − a.days` (oldest first). No global sort control                                                                                                                                  |
| 4   | Search left + 12.1          | ✓ First element in the bar, 300px, `aria-label="Cerca per nom o correu"`; «Neteja els filtres» conditional on `anyF = !!q.trim()`, clears and returns focus to the search input                                                                                                                                                                                                   |
| 5   | Keyboard rows               | ✓ `tabIndex="0"` + `aria-label` (title · meta · «Obre el detall») + Enter opens the child-route side sheet; chevron `aria-hidden` — but the chosen role creates R1 below                                                                                                                                                                                                          |
| 6   | Per-section grammar         | ✓ `showAge: type !== 'rgpd'` (an RGPD row never shows a bare age), `deadline: live` + `ackChip` (every RGPD row carries its clock/state chip), `hasInline: (signup \|\| react)` only («Aprova l'alta» / «Reactiva…»), inline «×» only on message rows (`hasX: msg`, AREQ-08)                                                                                                      |
| 7   | SPEC destinations line      | ✓ Verbatim as its own SPEC block: AREV → Productes + Tauler card; AMSG absorbs Missatges as «Converses»; ACOM own module; only `tenant_requests` rows live in the safata                                                                                                                                                                                                          |

Fixture arithmetic holds: mock `today = 16 d'ag.` is internally consistent (Miquel superada el 14 ✓, Glòria bloquejada fins el 22 ✓, Josep queden 3 = creada el 20/07 ✓) and matches the frozen Tauler's «dg. 16»; the known 16-vs-17/08 tension with Socis predates this round (recorded at round 8) and is not widened.

### Residuals 27.1

| #      | Finding                                                                                                                                                                                                                                                                                                                                                                                           | Sev |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 27.1-1 | **The keyboard fix creates a nested-interactive defect.** The row is `role="link"` + `tabIndex="0"` and contains real `<button>`s («Aprova l'alta» / «Reactiva…» on SIGNUP rows, «×» on message rows). Focusable controls inside a link widget fail axe `nested-interactive`; AT users get one announced link with unreachable/ambiguous inner actions. RGPD and baixa rows (chip-only) are clean | 🟡  |
| 27.1-2 | **Mobile parity missing.** `Vista Sol·licituds (mòbil)` is untouched: the pending tray keeps the type chips (`showChips: S.tab !== 'msg'`), no sections, its own sort — desktop and mobile now render two different IAs for the same AREQ-01. Infinite scroll may stay (§15)                                                                                                                      | 🟡  |
| 27.1-3 | Dead code: `CHIPSET`'s non-hist branch (`Totes/Altes/Baixes/Supressió RGPD`) still computes `typeChips` for 'sol'/'msg' where nothing renders them — remove it so the next editor doesn't resurrect the chips                                                                                                                                                                                     | 🟢  |

### Change package 27.1 — paste into Claude design (Catalan)

1. **Fila accessible sense controls dins d'un enllaç.** Treu `role="link"` i `tabIndex` del contenidor de fila: el títol esdevé l'enllaç real (nom accessible «{títol} — {meta}. Obre el detall»), estès sobre la fila amb pseudo-element deixant fora la zona d'accions; els botons inline i el «×» queden germans de l'enllaç, mai descendents (axe `nested-interactive`, contracte §3.14). El clic de fila sencera es manté per a ratolí; el chevron continua `aria-hidden`.
2. **Paritat mòbil.** `Vista Sol·licituds (mòbil)`: mateixes dues seccions amb capçalera enganxosa i recompte («Supressions RGPD · 5» / «Altes i baixes · 3»), fora els xips de tipus de la safata pendent (queden a Resolts), mateix ordre per secció (data que governa el xip / antiguitat), i la línia SPEC de destins AREV/AMSG/ACOM també al peu. El desplaçament infinit es manté (§15).
3. **Higiene:** elimina la branca no-hist de `CHIPSET` (codi mort a 'sol'/'msg').

---

## Round 27.2 — 2026-08-30 · Package 27.1 verified 3/3 — and the type column caught borrowing verb glyphs

**Trigger:** Carlos reads the row's leading `delete` marker as a delete action and the chevron as an edit — and asks for one consistent item-action design. The misreading is the finding.

### Package 27.1 verified

| #   | Check          | Result                                                                                                                                                                                                                                                                                                                                                                   |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Row title-link | ✓ Container back to a plain `div` **with `position:relative`** (the stretched link anchors to its own row, not the card); the title is the real `<a>` with `aria-label`, focus ring, and a `::before` stretched over the row; inline buttons and «×» are siblings lifted with `z-index:1`; chevron stays `aria-hidden`. No `role="link"`, no `tabIndex` on the container |
| 2   | Mobile parity  | ✓ Same two sections with sticky counted headers, `govKey`/oldest-first per-section sort, `showChips: S.tab === 'hist'` (chips off the pending tray), destinations SPEC block present, infinite scroll kept (§15)                                                                                                                                                         |
| 3   | Dead CHIPSET   | ✓ Single CHIPSET remains (Resolts, 5 entries incl. «Missatges»)                                                                                                                                                                                                                                                                                                          |

### Findings 27.2

| #      | Finding                                                                                                                                                                                                                                                                                                                                                             | Sev |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 27.2-1 | **`delete` as the type marker on every `ACCOUNT_DELETION` row.** It is the project's destructive-action glyph — the row icon pairs across Productes/Categories, the panel's own «Executa la supressió» — rendered here as a passive lead marker. The product owner read it as a row action: the misreading **is** the defect. Round-13.1 law: one glyph per meaning | 🟡  |
| 27.2-2 | **`undo` as the type marker on the reactivation row** — same class: `undo` is the Desfés verb glyph (round 26, snackbars). The row is titled «Sol·licitud d'alta»; it is a SIGNUP with a different primary, not a fifth type                                                                                                                                        | 🟢  |
| 27.2-3 | Recorded as a non-finding: the right side carries **no** edit affordance — it is the §04 passive chevron, legal on card-queues and now backed by the stretched title-link. And the app has exactly **two** row grammars by law (table ladder · card-queue), one per job — the "third design" impression dissolves once the markers stop borrowing verbs             | —   |

### Rulings 27.2

**Type markers draw from the domain family, never the verb family.** A row-leading icon states _what the row is_; verbs live in labelled buttons. `delete`, `undo`, `stylus` (and their variants) are action-only glyphs anywhere in the admin — a passive marker may never reuse them, because a marker that looks like a verb turns a triage queue back into a button bar. Graduates into DS §04 (extends the 13.1 one-glyph rule).

**The safata keeps its actionless card-queue grammar.** No `stylus`/`delete` pairs, no ⋮ menus here — "the list triages, the detail acts" (4.1) stands; the only inline verb remains SIGNUP's.

### Change package 27.2 — paste into Claude design (Catalan)

1. **El glif del tipus no pot ser un verb.** Les files `ACCOUNT_DELETION` (safata i Resolts, escriptori i mòbil) canvien el marcador `delete` per `person_off` — afegeix `person_off` a l'`icon_names` dels dos helmets. `delete` queda reservat a les accions destructives (el parell d'icones de fila, «Executa la supressió»).
2. **La fila de reactivació és una alta.** Marcador `how_to_reg` com la resta de SIGNUP; `undo` queda només dins del botó etiquetat «Reactiva…» (i als Desfés). Cap cinquè tipus.
3. **Res més no canvia.** El chevron passiu i la cua de cartes són llei §04: no introdueixis parells `stylus`/`delete` ni menús ⋮ a la safata.

---

## Round 27.3 — 2026-08-30 · Package 27.2 verified 3/3 — Sol·licituds re-frozen

Point-by-point against both fetched sources:

| #   | Check                    | Result                                                                                                                                                                                                                                                                    |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | RGPD marker `person_off` | ✓ All six `ACCOUNT_DELETION` rows (pending + Resolts) on **both shells** carry `icon: 'person_off'`; `person_off` added to both helmets' `icon_names`. `delete` survives only inside labelled actions — the desktop panel's and the mobile sheet's «Executa la supressió» |
| 2   | Reactivation = alta      | ✓ The Robert Duran row is marked `how_to_reg` on both shells; `undo` lives only in the labelled «Reactiva…» / «Reactiva el soci…» buttons and the Desfés family                                                                                                           |
| 3   | Nothing else moved       | ✓ Zero `stylus`, zero `more_vert` in either file; chevron and card-queue grammar untouched                                                                                                                                                                                |

**Sol·licituds is design-complete and re-frozen** — the round-27 arc (27 → 27.1 → 27.2 → 27.3) closes with all three 4.1g debts settled (right-hand search, keyboard rows, and the marker glyphs that had made the queue read as a button bar). Construction gates unchanged: G-02 (`tenant_requests` per §5.6), B-07, AQ-10, AQ-12.

---

## 📝 Changelog

| Version | Date       | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.2.67  | 2026-08-30 | Round 27.3: package 27.2 verified 3/3 on both shells (`person_off` markers + helmets, reactivation re-marked `how_to_reg`, `delete`/`undo` only inside labelled actions, no stylus/⋮ introduced). **Sol·licituds design-complete and re-frozen** — the round-27 arc closes with all three 4.1g debts settled                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 0.2.66  | 2026-08-30 | Round 27.2: package 27.1 verified 3/3 (title-link with `position:relative` + z-index siblings, full mobile parity, single CHIPSET). New finding from Carlos's own misreading: the type column borrows verb glyphs — `delete` as the marker on every RGPD row, `undo` on the reactivation row (13.1 one-glyph law); ruled that type markers draw from the domain family, never the verb family (graduates to DS §04) — `person_off` replaces `delete`, reactivation re-marked `how_to_reg`. Non-finding recorded: no edit affordance exists on the right (passive §04 chevron), and the app has exactly two row grammars by law. 3-point package                                                                                                                                                                                                                                                 |
| 0.2.65  | 2026-08-30 | Round 27.1: package 27 verified 7/7 on desktop against source (sections + sticky counted headers, per-section govKey/oldest-first sort, paginator gated off pending, search left with 12.1 focus return, chip/verb grammar per section, SPEC destinations block verbatim; fixture arithmetic holds at today = 16 d'ag.). Two residuals: row `role="link"` with focusable inner buttons fails axe nested-interactive (title-link fix packaged), and `Vista Sol·licituds (mòbil)` untouched — chips still on the mobile pending tray, no sections. 3-point package                                                                                                                                                                                                                                                                                                                                |
| 0.2.64  | 2026-08-30 | Round 27 (Sol·licituds IA, user-driven): pending-tray paginator contradicts AREQ-01 (the mock's own SPEC says «a totes les safates»); the 4.1 "four jobs, one row template" diagnosis finished at list level — two fixed sections «Supressions RGPD» (chip-governing-date sort) · «Altes i baixes» (oldest-first) replace the type chips; 4.1g deviations closed (search left §05, keyboard rows); AREV answered (TA moderates reviews — in Productes + Tauler card, never the safata) and the three-lane end state pinned (casos · Converses ← Missatges via AMSG · Comunicats = ACOM). 7-point package                                                                                                                                                                                                                                                                                        |
| 0.2.63  | 2026-08-30 | Round 26.1: package 26 verified 8/8 (chip-pair grammar, quiet-done rows with sink, §05 bar with tappable counters and 12.1 focus return, Ruta·Nom sort, load-more with filtered counts, sticky group progress + sums, identity links, counted bulk). One recorded tradeoff: payment-undo hidden on delivered-compact cards. Lliuraments design-complete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 0.2.62  | 2026-08-30 | Round 26 (Lliuraments hardening, user-driven): state/action fusion diagnosed (the delivery button doubles as indicator; opacity as done-mark), chip-pair grammar ruled, loud-pending/quiet-done rows with group-bottom sink, §05 filter bar with tappable counters, within-group Ruta·Nom sort, §15 load-more on both shells (no classic paginator on a work queue), group progress + pending-payment sums, order-code identity link, bulk remaining count. 8-point package                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 0.2.61  | 2026-08-30 | Round 25.2: package 25.1 verified 3/3 exhaustively (12/12 nav surfaces carry «Lliuraments» in the ruled slot; drawer parity restored; «Obertes ara» defaults the 24/7 Comandes scope). Rounds 24/25/25.1 fully closed — the order's two work surfaces are design-complete; B-32/B-33/AQ-16/AQ-20 gate construction                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 0.2.60  | 2026-08-30 | Round 25.1: DesignSync re-authorized — round 24 closes 4/4, round 25 closes 5/5, round-22 backlog verified (thin 24/7 wrappers, Estadístiques 24-7 correct). Three residuals: «Lliuraments» missing from DS §12 anatomy and every other view's nav (R1), the Lliuraments mobile drawer drops three items against §15 law (R2), the Comandes 24/7 scope selector lacks the «obertes ara» work default (R3). 3-point package                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 0.2.59  | 2026-08-29 | Round 25: round 24 verified 5/5 on the order detail (points 1–4 blocked on DesignSync auth); **status-label parity** ruled across both apps (`READY` = «A punt», `DELIVERED` = «Lliurada», `CANCELLED` = «Cancel·lada») plus the narrower storefront type (6 vs 8 values → blank chip); the **three-outcome line review model** with a completeness-gated transition and the previously undrawn terminal state; new **AORD-09** mobile-first delivery run (gives B-32 a second dependent) and **AQ-20** on the distribution role                                                                                                                                                                                                                                                                                                                                                                |
| 0.2.58  | 2026-08-29 | Round 24 (three critiques of the round-22 build): the Cicles 24/7 screen is unreachable by construction and is deleted — round 22's own wording caused it, and the nav rule is corrected to domain-based (historical cycles survive a mode switch); the chart data view is a transcription (the toggle must swap, be a real table, add a column the chart lacks); the order detail is an editable form with no §10 save bar, and its promised write has no server path → new **B-33** (no recompute-on-update writer for order totals). Also corrected: rounds 20.3–22 were misdated 2026-08-26                                                                                                                                                                                                                                                                                                 |
| 0.2.57  | 2026-08-29 | **Round 23 (Fitxa de soci, first pass — user-driven):** the trial rule is inverted (design promises automatic TRIAL→ACTIVE; TRL-07 makes it an admin decision, and no hook writes `trialEndsAt` — B-15 confirmed by grep over all 7 hooks); «Edita les dades» contradicts AMBR-02's read-only law (round 17.3 one level down); `aval:` renders third-party PII from `member_allowlist`, a collection absent from the schema; «Historial d'estats» has no source (B-12) and silently decides **AQ-03**; the order fixture regressed to the pre-11.1 numbers (29,01 € vs frozen 35,41 €, «des.» vs cycle 33 = 10–16 d'agost, C32-041 vs 8 C32 rows, mitjana ≠ 30,13); **AMBR-07 missing from the surface that names it**. 15-point package + 10 rulings (overflow grammar, card order, Estat+Historial merge gated on AQ-03, avatar per AMBR-02). Screenshot-only round — DesignSync unauthorized |
| 0.2.56  | 2026-08-29 | Round 22 (the continuous / 24-7 tenant): the mode is the absence of a JSON key (**B-31**) and B-29 makes it the birth state; the frozen Tauler already solves the vocabulary but the nav still offers «Cicles» (unconditional `navItems`), mobile has no 24/7 scenario, Estadístiques is ruled-but-undrawn, the one-order-per-member rule vanishes, and there is no fulfilment batch (**B-32**). 6-point package                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 0.2.55  | 2026-08-29 | Round 21.1 residual verified fixed in source: the §13 demo href now reads `Tauler - reflow.dc.html` (hyphen), zero em-dash references left. **Round 21 fully closed** — the responsive band contract and the reflow demo are law                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 0.2.54  | 2026-08-29 | Round 21.1: round-21 package verified 4/4 (§13 contract verbatim, §15 line, geometry-only reflow demo with correct band logic, frozen desktop Tauler byte-identical by hash). One 1-char residual: the §13 href to the demo uses an em dash where the filename uses a hyphen — 404                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 0.2.53  | 2026-08-29 | Round 21: responsive band contract for the Tauler card grid — Ampla ≥1200 · Mitjana ≥720 i <1200 (2 col, zoning preserved, no orphans) · Compacta <720, measured on the content pane (border-box, container queries on the pane wrapper); per-card rules (hero span, conditional Sol·licituds emphasis, orphan no-stretch, min-inline-size 300); new geometry-only demo artifact «Tauler — reflow». Adversarially verified pre-registration (4 defects caught and repaired). Frozen views untouched                                                                                                                                                                                                                                                                                                                                                                                             |
| 0.2.52  | 2026-08-29 | Round 20.3: 20.1+20.2 paste verified 3/3 (facturable money on both Taulers, §13 Card Socis prose, §16 one-component-two-shells contract). Mobile surface frozen. **Design project complete** — 10 desktop + 3 mobile views + DS sheet all frozen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 0.2.51  | 2026-08-26 | Round 20.2: the bottom-sheet-everywhere question ruled — position held (occlusion geometry, reading column, M3 window-class vocabulary, prev/next over a visible queue); the correct half codified: §16 gains the explicit one-component-two-shells build contract, folded into the pending 20.1 paste                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 0.2.50  | 2026-08-26 | Round 20.1: mobile verified 5/5 (Tauler mòbil with scenario props and the full kit, interactive store chip everywhere with the B-25-honest close dialog, both existing mocks fixed incl. AMBR-03 dialogs and the 12.1 reset, §15 rewritten). Two inherited-drift residuals: the S33 money on both Taulers predates the facturable rule (1.842,50 → 990,52 facturable), and DS §13's Card Socis prose still describes the line chart round 6 killed. Mobile freeze gated on the 2-line 20.1 fix                                                                                                                                                                                                                                                                                                                                                                                                  |
| 0.2.49  | 2026-08-26 | Round 20 (mobile surface): Sol·licituds mòbil remarkably current and Socis mòbil carries the project's best degradation spec — but the store chip is decorative in both (the brief's third mobile requirement), Tauler mòbil doesn't exist, Socis mòbil writes transitions without the AMBR-03 reason dialog and renders B-13 seniority, confirms defer required fields to desktop, copy leaks (AQ-10 ID, «sòcia»), no 12.1 reset, §3.14 mobile gaps, and DS §15 still cites the chart round 6 killed. Mobile package: new Tauler mòbil + interactive store chip everywhere + fixes + §15 rewrite                                                                                                                                                                                                                                                                                               |
| 0.2.48  | 2026-08-26 | Round 19.1: save bar verified 4/4 (DS §10 two-mode spec, L2 form adopts it, Producte mode-aware, Botiga SPEC prose fixed). Superadmin fully closed — the desktop surface is complete with the three form-system rules unified. Remaining: mobile files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 0.2.47  | 2026-08-26 | Round 19 (save bar, user-triggered): the canonical pattern already existed — the tenant Categories form's mode-aware sticky bar (create = always visible with create-language; edit = dirty-appearing with Descarta) — and the divergents are the L2 global form (static submit) and the Producte form (edit-only semantics). DS §10 gains the two-mode rule with Categories as reference; Botiga SPEC's stale «tabs» sentence out. 18/18.1 verified in passing (single i18n grammar applied everywhere)                                                                                                                                                                                                                                                                                                                                                                                        |
| 0.2.46  | 2026-08-26 | Amendment 18.1 (user critique accepted): the short/long split was the wrong axis — one i18n grammar, the language-row stack; long fields stack auto-height textareas (no tabs, no summary line), only rich editors may collapse rows (preview + textual state, expand in place). Tabs leave the i18n system entirely                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 0.2.45  | 2026-08-26 | Round 18 (i18n fields, user-triggered): tabbed language editors hide state — with a 3-language platform cap, short i18n fields become STACKED (the content is the state) and long fields keep tabs with textual per-tab state + a summary line + first-invalid-opens-on-save. DS §09 redrawn; rollout to Nou grup (stack), Botiga Descripció, Categories/Producte forms as authorized touches. 17.7 verified in passing (three flows drawn; category form correctly declared as ACAT-02 reuse)                                                                                                                                                                                                                                                                                                                                                                                                  |
| 0.2.44  | 2026-08-26 | Round 17.7: 17.6 verified (live language toggles + reorder, honest add-explainer, IDs out of copy, tenant=null note); the user's finding — «Nou grup», «Categoria global» and «Convida un admin» have no drawn destination. Rulings: group = small dialog (Cicle-puntual precedent, i18n tabs); global category = the frozen ACAT-02 form as a route in the L2 shell (same entity, same form; chips open it in edit mode); invite = the wizard's step 2 as a standalone dialog. Authorized touch                                                                                                                                                                                                                                                                                                                                                                                                |
| 0.2.43  | 2026-08-26 | Round 17.6: global-catalog CRUD confirmed schema-backed but the GA write branch on `product_categories` is unrestricted (B-28 amended: narrow to `tenant = null`); languages — **B-30**: `tenants.languages` is a hardcoded select and translations are code, so add/remove is an engineering event; AQ-02 proposed-resolved (GA writes for Active/order — the Idiomes toggles go live, add stays honestly disabled); post-creation edit question: position held (Onboarding-only window is the only safe slug-fix moment; post-handover everything is TA-side). Authorized touch on frozen Superadmin incl. the two 17.5 deviations                                                                                                                                                                                                                                                            |
| 0.2.42  | 2026-08-26 | Round 17.5: Superadmin v5 verified 4/4 (2-step minimal wizard, trio-only onboarding edit, honest pending states in the fitxa, AQ-19 in SPEC). Two 2-word copy deviations recorded (B-29/AQ-02 IDs) — authorized next-touch fixes. **Superadmin frozen; the entire desktop surface is now frozen** — remaining: mobile files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 0.2.41  | 2026-08-26 | Round 17.4 (Carlos's 3rd pass): v4 verified clean (read-only fitxa, onboarding-gated edit, never-delete note). Rulings: minimal birth (name+slug+email + TA account; **B-29** birth defaults incl. born-closed; the handover moment finally pins B-27) and modules leave the wizard (**AQ-19**: v1 = tenant settings, TA-owned in the frozen Botiga; platform-gated capabilities would be a future GA field). Superadmin v5 package: 2-step wizard, trio-only onboarding edit, module chips read-only                                                                                                                                                                                                                                                                                                                                                                                           |
| 0.2.40  | 2026-08-26 | Round 17.3 (Carlos's 2nd pass): v3 verified (17.2 fully applied) but the fitxa carried editable identity/presentation/modules — root cause is ATNT-04's own 2026-08-10 over-scope, and the «PNG o SVG» regression proves the law: duplicated edit surfaces drift, every field gets one owner. Fitxa → read-only summary + Suspèn/Reactiva + TA-account recovery; «Edita les dades bàsiques» only during Onboarding; modules TA-owned post-wizard; new **AQ-18** (TA self-service co-admins, post-v1 proposal; GA keeps recovery only; Desactiva never delete). Superadmin v4 package                                                                                                                                                                                                                                                                                                            |
| 0.2.39  | 2026-08-25 | Round 17.2 (Carlos's review): §2.2 was already the law and both the mock and round 17's own package broke it — context entry and member counts leave (the reviewer corrects the reviewer); schema audit finds the boundary unenforced API-side: GA can read users/orders/carts/addresses/**fiscal profiles** → **B-28** (strip GA from operational rules). New views: tenant fitxa (record-only, TA accounts inside) and read-only Idiomes (AQ-02-gated). Global-config audit closes: with Idiomes the surface is complete. Superadmin v3 package                                                                                                                                                                                                                                                                                                                                               |
| 0.2.38  | 2026-08-25 | Round 17.1: Superadmin v2 verified 8/8 (state-aware Suspèn/Reactiva, computed cascade totals, reconciling header, honest tenant-own cascade nuance, dark wrapper). Two one-line residuals: the B-08 gate sentence sits in operator copy, and «Slug (normalizedName)» raises the L2 carve-out question for brief §1. **Freeze held** pending the user's own review comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 0.2.37  | 2026-08-25 | Round 17 (Superadmin): strong L2 craft (dark rail, slug-collision wizard, typed-name cascade delete, cron-true suspension) — but «Comptes» re-litigates round-5 C6, the SPEC invents «ASUP» IDs, «Onboarding» has no schema source (**B-27**), the wizard omits schema-required fields and the invented domain scheme, tenant-context entry (the core GA flow) is an unnamed icon, and the fixture contradicts frozen Socis/Categories (124 vs 50; global Higiene; Fresc = 44 vs 86). New **AQ-17** (GA-account management — console-only v1 proposal). Superadmin v2 package                                                                                                                                                                                                                                                                                                                   |
| 0.2.36  | 2026-08-25 | Round 16.1: Estadístiques v2 verified 5/5 (frozen totals, visible facturable rule, Socis = 50, 11 aria-pressed, EST-06 gating + future scope). **Estadístiques frozen** — remaining surface: Superadmin + mobile files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 0.2.35  | 2026-08-25 | Round 16 (Estadístiques): the project's most sophisticated SPEC (schema-backed per-category colors, ΔE + CVD fallback, nice() ladder, B-12 honesty, focusable bars) — but it aged past two freezes: S32/S33 carry pre-round-14 totals, the facturable rule is absent, EST-06 is uncited (every aggregate needs it), the Socis zone says 49 where frozen Socis says 50, and no toggle exposes aria-pressed. Surgical Estadístiques v2 package                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 0.2.34  | 2026-08-25 | Round 15.1: Botiga v2 verified 8/8 (timer out with B-25 target note, Visualització with hidden-globals chips, create+edit pickup dialog with full kit + §08 delete confirm, named icon pairs, zero «sòcies», dv. slots, SPEC gating, 3 scenarios + dark). **Botiga frozen** — remaining surface: Estadístiques, Superadmin + mobile files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 0.2.33  | 2026-08-25 | Round 15 (Botiga): strongest first draft since Comandes (real field shapes in SPEC, tiers model exact, honest cadence + skip-cycle warning) — but «Reobertura automàtica» is invented end to end (no `reopenAt` field, no writer → **B-25**), ACFG-10 «Visualització» never drawn, the ACFG-08 pickup-point editor missing, a11y stops at the switches, «les sòcies» throughout, dv. day incoherent with frozen Comandes. The mock rightly refuses `accessModel` — REQUIREMENTS invented it (**B-26**). Botiga v2 package                                                                                                                                                                                                                                                                                                                                                                       |
| 0.2.32  | 2026-08-25 | Round 14.2: amendment 14.1 verified 4/4 (conditional year axis with live counts, 12.1 reset with ref-based focus return, filtered-empty state, 2025 fixture, §18 nuance, SPEC). **Cicles frozen** — remaining surface: Botiga, Estadístiques, Superadmin + mobile files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 0.2.31  | 2026-08-25 | Round 14.1: Cicles v2 verified 9/9 in source (over-deliveries: state-aware override warns matching the fixture, cleaned icon subset, scenario wrappers with the 24/7 nav-hiding explainer). Amendment: retrieval filters accepted — minimal §05 bar (search nom/codi + conditional year axis + 12.1 reset), still no state filter; §18 anti-example nuanced, not reopened. Cicles freeze gated on 14.1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 0.2.30  | 2026-08-25 | Round 14 (Cicles): the view draws the right target model and that is the finding — **B-22** (cycles born OPEN Sunday night; DRAFT/COMPLETED/CLOSED have no writer), **B-23** (global UNIQUE(code) × identical per-tenant weekly codes = live multi-tenant bug; the mock's «únic per cooperativa» is the correct target), **B-24** (`orderNumber` is client-side `TENANT-timestamp-random`; the C33-014 format exists nowhere). View: Cicle column can't render puntual names (critical), §18 candidacy **overturned** (anti-example: near-singleton states, no aggregate, unscoped page), fixture incoherent with frozen Comandes, NOT-IDs + «Sòcies» in copy, §3.14 dialog/pagination gaps. Cicles v2 package folds in the authorized 13/13.1 touches                                                                                                                                          |
| 0.2.29  | 2026-08-25 | Schema note: Pagament-vs-Estat suspicion settled — `paymentStatus` is a real field and the two-axis render is faithful; the legacy `PAID` in the status enum is dead weight (frontend type excludes it, no writer) → AQ-07 resolution path recorded; new **B-21**: nothing writes `EXPIRED` (cycle_cron only touches cycles) — the Caducada UI renders a state production cannot produce yet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 0.2.28  | 2026-08-25 | Round 13.2: the DS half of rounds 13 + 13.1 verified in source (21-line surgical diff) — §04 «Accions de fila» complete with the 4-rung ladder demo, all five rule blocks, frozen-deviation note, §06 Esborrany chip on `draft`. Hygiene: `draft` missing from the icon subset, unused `edit` still listed, header badge stuck at v0.2. View applications pending verification                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 0.2.27  | 2026-08-25 | Round 13.1 (menu contents): new principle — menu items are verb-named tasks that earn their place; single-item menus only for guarded escape hatches; destructive last. Comandes gains row + bulk «Marca com a pagada/-des»; Socis swaps «Copia l'adreça» for «Escriu-li un correu»; Sol·licituds sheet position held (SPEC gains the URL-addressable child-route note); Cicles ⋮ becomes a real menu (Obre les comandes · Llista de preparació · Edita el cicle on puntual drafts · override last) with no dedicated detail route; Productes flips to a 4-item ⋮ (Edita/Duplica/Amaga/Elimina) by the ladder; Categories stays the pair until B-16; Etiquetes' zero actions confirmed correct (B-18/Q-06); one pencil project-wide (`stylus` — `edit` leaves, Esborrany chip → `draft`)                                                                                                        |
| 0.2.26  | 2026-08-25 | Round 11.2: the combined 11.1 + 12.2 fix batch verified 5/5 in source — detail `caducada` state with a new expired scenario and full terminal gating (over-delivery: two caducada rows in the past cycle make the 7th KPI demonstrable), clean Activitat copy, phone digits, Sol·licituds `anyF` covers Resolts, sr-only KPI heading. One hygiene residual (detail icon subset misses `history_toggle_off`). **Comandes frozen** — list + detail + 10 scenarios; round-13 touches remain authorized-pending; remaining surface: Cicles, Botiga, Estadístiques, Superadmin + mobile files                                                                                                                                                                                                                                                                                                        |
| 0.2.25  | 2026-08-25 | Round 13: row-action grammar — source inventory of the six lists finds five paths to the detail, four action affordances and three chevron meanings; ruled as a ladder in DS §04 «Accions de fila» (identity cell = canonical link; operational verbs visible + labelled; edit/delete = direct `stylus`+`delete` pair; 3+/rare → ⋮ with the Socis kit; chevron never a bare icon-link). Four view touches: Cicles (identity link, kill the naked chevron, a11y kit on the override ⋮), Comandes (Codi link + menu keyboard), Productes and Categories (authorized frozen-view touch: name becomes the link). Socis/Llista blanca protected as reference; Sol·licituds div-row recorded as frozen deviation                                                                                                                                                                                      |
| 0.2.24  | 2026-08-25 | Round 11.1: Comandes v2 verified against source — **14/14 applied**, the strongest application round yet (one chip family in the detail, honest stock/activity copy, AQ-16 preparation adjustments gated to «En preparació», one confirm everywhere with bulk breakdown, coherent fixture incl. all scenarios, conditional Caducada KPI + legacy-PAID rule, outlined € payment family, derived VAT, full §3.14 a11y, 9 scenario states). One accepted deviation (paginator keeps the filtered-set convention + explicit «facturable del cicle»). Three fixes gate the freeze: detail `ST()` misses `caducada` (EXPIRED unrenderable in the detail), Activitat note leaks `updated`/B-20 into operator copy, fixture phone typo                                                                                                                                                                  |
| 0.2.23  | 2026-08-25 | Round 12.2: DS v0.3 verified against source — §05 + §18 pass the full checklist in light and dark (wrapper, not fork), two designer additions accepted (KPI second-click deselect, conditional «Caducades» card). Reset rollout verified in the four views: Productes surgical (4 hunks vs frozen 10.1), Socis best-in-class (two bars, sr-only live region), Comandes all five axes, Sol·licituds within authorized scope. Two fixes: Sol·licituds `anyF` misses chips active in the Resolts tray; Comandes KPI group lacks the §18 hidden heading. D.12 done                                                                                                                                                                                                                                                                                                                                  |
| 0.2.22  | 2026-08-25 | Amendment 12.1 (reset de filtres): the designer's «wherever plausible» criterion replaced by a rule in DS §05 — the reset button renders only when filter state differs from the default, clears search + chips + second axis + KPI selection + pagination (never sort/density/columns, never the Sol·licituds tray tabs), returns focus to the search input, and the filtered-empty state offers the same reset as its primary action. Sol·licituds gets the reset as an authorized touch to a frozen view                                                                                                                                                                                                                                                                                                                                                                                     |
| 0.2.21  | 2026-08-23 | Round 12: filter-system harmonisation — the three patterns (tabs+chips, chip bar, KPI-cards-as-filters) stay because they are three jobs, but the KPI-card pattern gets promoted into the DS as §18 with its usage rule (bounded pipeline + meaningful aggregate + single container) and §05 gains the single chip anatomy (selected = filled + check, search always left, second axis after a separator, aria-pressed). Sol·licituds stays frozen with its right-hand search recorded as a deviation; Cicles inherits KPI-cards by rule                                                                                                                                                                                                                                                                                                                                                        |
| 0.2.20  | 2026-08-23 | Round 11: Comandes list + detail — strong post-round-3 list (orphan rows answer B5, KPI-cards-as-filters, read-only past cycles) but the detail invents a third chip family for the same states; «stock returns» is doubly invented (nothing ever decrements it); the activity timeline has no data source (**B-20**); the preparation workflow the items snapshot was built for (`requestedQuantity`/`finalQuantity`/`isAvailable`) has no UI (**AQ-16**); list advances silently while the detail confirms; C33-014 is two different orders in list vs detail; EXPIRED and legacy PAID unrenderable; payment family ignores the frozen outlined-€ treatment; new **B-19** (stock lifecycle). Comandes v2 change package                                                                                                                                                                       |
| 0.2.19  | 2026-08-23 | 10.2: 10.1 additions verified 5/5 in source (tag pills at 48px, IVA 0 %, bulk hide/show + undo, tag shortcut, Etiquetes tab with visible operator explanation); three builder residuals noted (aria-disabled, tab semantics vs Socis v4, SPEC missing the B-18 citation). **Productes and Categories frozen** — catalogue module at the Tauler/Socis bar; remaining design surface: Comandes, Cicles, Botiga, Estadístiques, Superadmin                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 0.2.18  | 2026-08-23 | 10.1 Productes v2 verification — **12/12 applied** (plus two unasked improvements: storefront unit preview, no-images callout). Five user additions adjudicated: tag pills on the name line (yes), IVA 0 % (yes), bulk hide/show (yes), inline tag creation (no — Q-06 open and a tag is one row per language with no linking field → **B-18**), global tags/features section (tags yes as ACAT-04 read-only tab in Categories; features needs **AQ-15** — per-product JSON vs per-tenant catalogue, a migration). Productes 10.1 package                                                                                                                                                                                                                                                                                                                                                       |
| 0.2.17  | 2026-08-23 | Round 10: Productes list + form — the list keeps the round-3 rulings, the form is the best in the project, and it models `unitType` (wrong six values, missing the four `unitWith*` the storefront labels distinctly), `unitBase`/`min`/`max` (text instead of number), `features` (three fixed toggles instead of a free i18n list), `tags` (free text instead of per-tenant per-language rows) and `provider`/`origin` (selects over free text) in shapes the schema does not have; «Destacat» drawn in both views on a field that does not exist (APRD-05: hide until it ships); IVA closed to three rates; no `hidden` yet (B-16 landed yesterday); jargon in copy; zero ARIA in the list. New B-17 (`provider` catalogue). Productes v2 change package                                                                                                                                     |
| 0.2.16  | 2026-08-23 | 9.1 Categories v2 verification — **10/10 applied** (real count + honest confirm with checkbox and typed mode >50, full ACAT-02 form as a page, edit with group-change warning, derived «No es veu a la botiga», delete-on-snackbar-close undo, 4 scenarios, §3.14 a11y); **Categories frozen**. Out-of-stock follow-up resolved as a store display policy (B-16 rewritten, AQ-14 widened, new ACFG-10) — not a per-row toggle                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 0.2.15  | 2026-08-23 | Round 9: Categories — schema-true SPEC but the least finished view (nothing writes, no edit, three MUST fields missing, zero scenarios, zero ARIA). The "deactivate categories" question exposed an accidental mechanism: the storefront already hides categories by stock through `product_categories_stats` → new **B-16** (explicit hide: `hidden` for own rows, per-tenant relation for globals) and **AQ-14**; delete confirm counts in-stock products only (B7 unresolved) and promises a cart scope no hook delivers; `normalizedName` global UNIQUE turned into a leaking feature (B-02); stats view public (B-03 extended). Categories v2 change package                                                                                                                                                                                                                               |
| 0.2.14  | 2026-08-23 | 8.2 Socis v4 verification — **all seventeen 8.1 points applied in source** (three literal-grep misses were false negatives, documented); **Socis frozen**. Remaining items are construction blockers already on record: B-15 (`trialEndsAt` writer), B-14 hardened (`member_stats`), §5.7 → PRV-05b spec with `name` and AQ-10(c). Series note: the extra iteration was self-inflicted — round 8 asked for rich dialogs without restating the no-false-promises rule; AMBR-03 now carries it                                                                                                                                                                                                                                                                                                                                                                                                    |
| 0.2.13  | 2026-08-22 | 8.1 Socis v3 verification (4-lens pass, every critical re-verified by hand): all ten round-8 points applied — but the new dialogs promise what the backend cannot do (trial auto-expiry, an authorship record, "loses store access", an emailed export) and re-admit schema jargon in operator copy; filter chips ignore the search, bulk action on mixed selections mislabels its operation, the mandatory reason field has no accessible name and focus drops to `<body>`, CSV step 3 announces the import before it commits, the page-size selector hides itself at ps=50; `trialEndsAt` has no writer (B-15), `member_stats` becomes a condition (B-14 hardened). Socis 8.1 change package                                                                                                                                                                                                  |
| 0.2.12  | 2026-08-22 | Round 8: Socis (members + allowlist) — the allowlist tab diagnoses B-11 unprompted and proposes derived-not-stored states (best technical reasoning of the series); the members tab paginates 8 rows under a chip claiming 47, contradicts the frozen Tauler on the trial count, and lets an operator suspend a member in one click against AMBR-03. Also: `Alta` has no schema field and impossible dates, Núria joined 2021 yet consumed a 2026 invitation, trial-expiry column folded into the chip, SUSPENDED unfilterable, header actions belong to the other tab, aggregates without a source, a third CSV contract. **Zero ARIA in the view — and Sol·licituds measures zero too, so a11y exists only where a round demanded it** → table a11y contract graduates to DESIGN-BRIEF §3.14. New B-13/B-14; Socis v2 change package                                                          |
| 0.2.11  | 2026-08-22 | 7.1 Tauler verification — **all nine round-7 points applied**, de-fork included (one canonical file + 5 scenario wrappers, dark render restored); overlap, derived chip, scenario-linked RGPD clock, labelled unpaid, 4-card attention row, `cua saturada` scenario, largest-remainder shares and primary tone all verified in source; the tool also dropped in-bar numerals, a better fix than the one asked for. 5 residual findings — **AQ-13 was decided by the tool and its argument beats our recorded proposal (flipped in §9)**, «Aquesta setmana» heading a last-week cycle, two close-time formats, incoherent prop pairs, stretched attention row. **Tauler frozen**                                                                                                                                                                                                                 |
| 0.2.10  | 2026-08-22 | Round 7: Tauler v3 verification — **10/10 of the round-6 package applied** (chart and machinery gone, three-row order, five cycle renders, real part-to-whole with DS §06 icons, requests hero/badge at 4 + hollow dot, no scheduled reopen + i18n reason, zero off-scale values) and cross-scenario arithmetic verified; 9 residual findings led by **two cycles coexisting Mon→Wed with only one modelled** (spec gap → AQ-13), fixed store-chip/banner copy, RGPD clock not tracking the scenario date, unlabelled unpaid row; project fork flagged — both Tauler wrappers still import the superseded file, so there is no dark render of v3; Tauler v3.1 change package                                                                                                                                                                                                                    |
| 0.2.9   | 2026-08-22 | Round 6: Tauler post-split audit — an analytics chart back inside an "operational only" dashboard (no schema source for «baixes», degenerate demo data, no axis or table toggle, inverted outline pair at 2.92:1), both MUST cards behind two SHOULDs, cycle designed only in OPEN, invented and never-rendered auto-reopen, CONTACT counted in hero/badge against AREQ-08, orders-by-status scaled to max instead of total, DS §06 icons still unapplied from Round 3; chart verdict (one out, one re-formed, none added), target order, and the Tauler v3 change package                                                                                                                                                                                                                                                                                                                      |
| 0.2.8   | 2026-08-22 | Round 5: `Eco Admin DS.dc.html` audit — tokens verified right (hex, state layers, contrasts, cascade copy) but sheet stale vs 4.1a–g: side sheet undefined, RGPD derived/post-reply chips missing, logo + CSV copy false vs schema, dead 44px field token, wrong form-field density levels, ~40 off-scale type/radius values, focus/snackbar/tabs/error states missing; detail-surface decision rule (side sheet = triage queues, route = entities, dialog = decisions, inline = read-only tier, bottom sheet = mobile render); DS v0.2 change package                                                                                                                                                                                                                                                                                                                                          |
| 0.2.7   | 2026-08-18 | 4.1g reference-state sheet: 7 states + mobile delivered; 8 residual findings (SIGNUP still mailto, dev-speak graduated to a brief rule, honest undo, mobile destructive placement); PB notes (guard failure = 404, idempotent approve). Same day: **4.1g package verified applied in the live mock (desktop + mobile) — Sol·licituds closed, mock frozen**; 3 build-time notes; further changes via REQUIREMENTS.md v0.4.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 0.2.6   | 2026-08-18 | 4.1f: destructive dialog with implementation jargon + "cap correu automàtic" contradiction + mailto-after-execute vs mask-on-execute; reply guard vs re-reply contradiction; termination note + AMBR-03 bridge; "Data superada" two causes; executability in the list; PB deltas (`repliedAt` immutable, hook triggers, masking in hook, templates hardcoded)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 0.2.5   | 2026-08-18 | 4.1e: reply dialog promises a confirmation nobody sends and keeps the planned date from the member; no post-reply lifecycle → RGPD state machine specified; Missatges discard hierarchy; PB deltas (`plannedExecutionAt`, updateRule guards, hook guards)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 0.2.4   | 2026-08-18 | 4.1d: design tool introduced in-app reply via a PocketBase hook (contradicting §5.4) for CONTACT only; identity shown after erasure (AQ-10 pre-empted); neutral RGPD rows without deadline chip; first draft of the `tenant_requests` PB contract → REQUIREMENTS §5.6                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 0.2.3   | 2026-08-18 | 4.1c: no non-destructive reply path on ACCOUNT_DELETION (art. 12.3 is a reply clock); DS §6 confirm violated + emails promised that no hook sends; happy path missing; Historial without CONTACT; tabs vs chips; search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 0.2.2   | 2026-08-16 | 4.1b Sol·licituds second pass: 8/8 applied; 12 new findings incl. wrong unblock logic, inverted action hierarchy, no dismiss for spam, requester notification gap (AREQ-07), and the cross-screen `emailVisibility` backend finding (B-11); AQ-11                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 0.2.1   | 2026-08-13 | Round 4 (screen-by-screen) opened: 4.1 Sol·licituds — mixed-inbox verdict, density rationalisation, data-realism table (one-order-per-cycle verified in hook), SPEC errors, AQ-10                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 0.2.0   | 2026-08-13 | Round 3: full 15-file audit, 4-lens verification (traceability · schema · refutation · completeness), 9 blockers, 11 undesigned MUST views, 6 own-doc fixes, and the v4 change package                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 0.1.0   | 2026-08-12 | Created with rounds 1–2 (Tauler v1/v2, Estadístiques) and the v3 change package                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
