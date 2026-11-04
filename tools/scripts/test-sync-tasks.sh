#!/bin/bash

###############################################################################
# TASKS.md ↔ ClickUp Sync Test Suite
#
# Tests tools/scripts/sync-eco-store-tasks.cjs against small fixture docs in a
# temp directory: the task-ID grammar, the five subject shapes (table rows, ID
# headings, bullets, status lists, pair lines), skipped sections, merging,
# referrals, cross-home checks, --ref, fixture-backed ClickUp matching and the
# CLI exit codes. It also checks that every doc in tools/scripts/task-homes.json
# is registered in .prettierrc, .markdownlint-cli2.yaml and the TASK_DOCS regex
# in .husky/pre-commit.
#
# Never calls the ClickUp API: every run uses --offline or --clickup-fixture.
#
# WHEN TO RUN:
#   - After changing sync-eco-store-tasks.cjs or task-homes.json
#   - After adding a task home or a new doc shape
#   - CI runs it on every push to develop
#
# HOW TO RUN:
#   yarn tasks:test
#   OR
#   ./tools/scripts/test-sync-tasks.sh
#
# WHAT IT TESTS:
#   ✓ ID grammar: slash lists, ranges, suffixes, noise
#   ✓ Table rows, headings, bullets, status lists and pair lines
#   ✓ Skipped sections, blockquotes and BACKLOG companions yield no subjects
#   ✓ Status from Status cells, emojis and inherited headings
#   ✓ Merging, conflicting and cross-home duplicates
#   ✓ Referrals: valid, dangling, CU mismatch, missing target
#   ✓ --ref, missing docs, fixture-backed ClickUp matching
#   ✓ Exit codes for a missing token and bad arguments
#   ✓ Registrations of every configured doc
#
# EXIT CODES:
#   0 = All tests passed
#   1 = One or more tests failed
#
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Temp directory for test files
TEST_DIR=$(mktemp -d "${TMPDIR:-/tmp}/sync-tasks.XXXXXX")
ORIGINAL_DIR=$(pwd)
REPO_ROOT=$(cd "$(dirname "$0")/../.." && pwd)
SYNC="$REPO_ROOT/tools/scripts/sync-eco-store-tasks.cjs"
EXIT=0

# Cleanup function
cleanup() {
  cd "$ORIGINAL_DIR"
  rm -rf "$TEST_DIR"
}

trap cleanup EXIT

###############################################################################
# Test Utilities
###############################################################################

print_header() {
  echo ""
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_test() {
  TESTS_RUN=$((TESTS_RUN + 1))
  echo -ne "${YELLOW}Test $TESTS_RUN: $1${NC} ... "
}

test_pass() {
  TESTS_PASSED=$((TESTS_PASSED + 1))
  echo -e "${GREEN}✓ PASS${NC}"
}

test_fail() {
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}✗ FAIL${NC}"
  echo -e "${RED}  Error: $1${NC}"
}

###############################################################################
# Test Setup Helpers
###############################################################################

# Writes stdin to $TEST_DIR/<path>.
put() {
  mkdir -p "$(dirname "$TEST_DIR/$1")"
  cat > "$TEST_DIR/$1"
}

reset_docs() {
  rm -rf "$TEST_DIR/apps" "$TEST_DIR/libs" "$TEST_DIR/TASKS.md" "$TEST_DIR/out.json" "$TEST_DIR/err.txt"
}

# Runs the sync against $TEST_DIR; JSON report in out.json, exit code in $EXIT.
run_sync() {
  EXIT=0
  node "$SYNC" --root "$TEST_DIR" --config "$TEST_DIR/task-homes.json" "$@" \
    > "$TEST_DIR/out.json" 2> "$TEST_DIR/err.txt" || EXIT=$?
}

# Evaluates a JS expression against the last report; prints it when false.
check() {
  node "$TEST_DIR/check.cjs" "$TEST_DIR/out.json" "$1"
}

setup_fixtures() {
  # Same homes as the real config, with fake list IDs.
  node -e '
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const ids = { "eco-store": "100", "eco-admin": "200", "eco-shared": "300", plastikspace: null };
    for (const home of config.homes) home.listId = ids[home.key];
    fs.writeFileSync(process.argv[2], JSON.stringify(config, null, 2));
  ' "$REPO_ROOT/tools/scripts/task-homes.json" "$TEST_DIR/task-homes.json"

  cat > "$TEST_DIR/check.cjs" << 'EOF'
const fs = require('fs');
const [file, expr] = process.argv.slice(2);
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
const home = key => r.homes.find(h => h.key === key);
const subjects = key => home(key).subjects;
const subj = (key, id) => subjects(key).find(s => s.taskIds.includes(id));
const ids = key => subjects(key).flatMap(s => s.taskIds).sort();
const cons = type => r.consistency.filter(c => c.type === type);
const notice = type => r.notices.filter(n => n.type === type);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const config = JSON.parse(fs.readFileSync(require('path').join(require('path').dirname(file), 'task-homes.json'), 'utf8'));
const configuredDocs = config.homes.flatMap(h => [h.tasks, ...h.companions]).sort();
let ok = false;
try {
  ok = eval(expr);
} catch (err) {
  console.error(`  ${err.message}`);
}
if (!ok) {
  console.error(`  expected: ${expr}`);
  process.exit(1);
}
EOF
}

###############################################################################
# Tests
###############################################################################

print_header "TASKS.md ↔ ClickUp Sync Test Suite"
setup_fixtures

# ─── 1. Grammar ──────────────────────────────────────────────────────────────
print_test "ID grammar: slash lists, ranges, suffixes and noise"
if node -e '
  const { extractPrdIds } = require(process.argv[1]);
  const cases = [
    ["B-02/03", ["B-02", "B-03"]],
    ["BOT-06a/b/c", ["BOT-06a", "BOT-06b", "BOT-06c"]],
    ["SRC-01..03", ["SRC-01", "SRC-02", "SRC-03"]],
    ["B-20…B-22", ["B-20", "B-21", "B-22"]],
    ["B-30/AQ-02", ["B-30", "AQ-02"]],
    ["PRV-05b-A/B", ["PRV-05b-A", "PRV-05b-B"]],
    ["NOT-02-Bug", ["NOT-02"]],
    ["UTF-8 WK33-2026 AUTH-01 C33-014", []],
    ["OPS-03/2026", ["OPS-03"]],
  ];
  const bad = cases.filter(([text, want]) => JSON.stringify(extractPrdIds(text)) !== JSON.stringify(want));
  bad.forEach(([text, want]) => console.error(`  ${text}: got ${JSON.stringify(extractPrdIds(text))}, want ${JSON.stringify(want)}`));
  process.exit(bad.length ? 1 : 0);
' "$SYNC"; then
  test_pass
else
  test_fail "extractPrdIds returned unexpected IDs"
fi

# ─── 2. Both ClickUp ID formats, two in one row ──────────────────────────────
print_test "Both ClickUp ID formats, two tickets in one row"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 1

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| BOT-01 | Old format | High | 📋 | `86c8cjggk` |
| BOT-02 | New format | High | 📋 | `123kjkdp1wa` |
| BOT-03 | Split ticket | High | 📋 | `86c8aaaaa` + `123kjkdpbbb` |
EOF
run_sync --all --offline --json
if check 'same(subj("eco-store","BOT-01").cuIds, ["86c8cjggk"])' \
  && check 'same(subj("eco-store","BOT-02").cuIds, ["123kjkdp1wa"])' \
  && check 'same(subj("eco-store","BOT-03").cuIds, ["86c8aaaaa","123kjkdpbbb"])'; then
  test_pass
else
  test_fail "ClickUp IDs not read from the ClickUp column"
fi

# ─── 3. Admin AP table with segment rows ─────────────────────────────────────
print_test "Admin phase table: # label, segments, CU-only rows"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## AP-0 — Foundation

| # | Task | MoSCoW | Est. | CU | Notes |
| --- | --- | --- | --- | --- | --- |
| 0.1 ✅ | Scaffold the app (deploy deferred) | MUST | 1d | `123kjkdp4kk` | — |
| 1.1 | AREQ-01/02/03 request inbox | MUST | 2d | `123kjkdp4a1` | — |
| 4.1 | ACFG-01 settings shell · ADSH-06 banner | MUST | 1d | `123kjkdp4a2` | Needs (APRD-04) |
EOF
run_sync --all --offline --json
if check 'subjects("eco-admin").length === 3' \
  && check 'subjects("eco-admin")[0].bucket === "closed" && subjects("eco-admin")[0].taskIds.length === 0' \
  && check 'same(subj("eco-admin","AREQ-02").taskIds, ["AREQ-01","AREQ-02","AREQ-03"])' \
  && check 'subj("eco-admin","AREQ-01").bucket === "open" && subj("eco-admin","AREQ-01").label === "1.1"' \
  && check 'same(subj("eco-admin","ACFG-01").taskIds, ["ACFG-01","ADSH-06"])' \
  && check '!ids("eco-admin").includes("APRD-04")'; then
  test_pass
else
  test_fail "admin phase rows parsed wrong"
fi

# ─── 4. Gate table ───────────────────────────────────────────────────────────
print_test "Gate table yields no subjects"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## Gates

| Gate | What | Status |
| --- | --- | --- |
| G-01 | PRV-05b-A lands first | ✅ |
| G-02 | tenant_requests collection | 📋 |
EOF
run_sync --all --offline --json
if check 'subjects("eco-admin").length === 0' && check 'cons("unrecognized-family").length === 0'; then
  test_pass
else
  test_fail "gate rows became subjects"
fi

# ─── 5. AQ pair line ─────────────────────────────────────────────────────────
print_test "Pair line: two or more ID + ticket pairs"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## Open questions 📋

Tickets: AQ-01 `123kjkdp4q1`, AQ-02 `123kjkdp4q2`.
EOF
run_sync --all --offline --json
if check 'subj("eco-admin","AQ-01").cuIds[0] === "123kjkdp4q1"' \
  && check 'subj("eco-admin","AQ-02").cuIds[0] === "123kjkdp4q2"' \
  && check 'subj("eco-admin","AQ-02").bucket === "open"'; then
  test_pass
else
  test_fail "pair line not split into subjects"
fi

# ─── 6. Skipped sections, Module column ──────────────────────────────────────
print_test "Skipped Schema/Hooks sections; Module is not a key next to ID"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Schema changes pending

| Collection | Field / Change | Type | For task | Notes |
| --- | --- | --- | --- | --- |
| orders | tax max | number | BUG-010 | `86c9aaaab` |

## Current focus

| Task | Module | Priority | Status | One-line summary |
| --- | --- | --- | --- | --- |
| **PRV-05b-A** | PRV | **Urgent** | ✅ | Rules |
EOF
run_sync --all --offline --json
if check 'same(ids("eco-store"), ["PRV-05b-A"])' && check 'subj("eco-store","PRV-05b-A").bucket === "closed"'; then
  test_pass
else
  test_fail "skipped section or Task/Module key handled wrong"
fi

# ─── 7. Heading + row merged ─────────────────────────────────────────────────
print_test "ID heading and table row with the same ID merge; inline ✅ wins"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 2

| ID | Description | Priority | Status |
| --- | --- | --- | --- |
| SRC-04 | Filters | High | ✅ |

### SRC-04 Filters `86c9srcf4`

Details live here.
EOF
run_sync --all --offline --json
if check 'subjects("eco-store").length === 1' \
  && check 'subj("eco-store","SRC-04").bucket === "closed"' \
  && check 'same(subj("eco-store","SRC-04").cuIds, ["86c9srcf4"])' \
  && check 'cons("conflicting-duplicate").length === 0'; then
  test_pass
else
  test_fail "heading and row did not merge"
fi

# ─── 8. Status-list prose ────────────────────────────────────────────────────
print_test "Status-list prose under a status heading"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Done ✅

BOT-01, BOT-02 (partial) and BOT-03.

This sentence mentions BOT-09 in passing.
EOF
run_sync --all --offline --json
if check 'same(ids("eco-store"), ["BOT-01","BOT-02","BOT-03"])' \
  && check 'subjects("eco-store").every(s => s.bucket === "closed" && s.source === "section")'; then
  test_pass
else
  test_fail "status list parsed wrong"
fi

# ─── 9. Done table, tickets in Where ─────────────────────────────────────────
print_test "Done table with two tickets in the Where cell"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Done ✅

| ID | Description | Where |
| --- | --- | --- |
| OPS-02 | Staging deploy | PR #1200, CU `86c9ops2a` + `86c9ops2b` |
EOF
run_sync --all --offline --json
if check 'subj("eco-store","OPS-02").bucket === "closed"' \
  && check 'same(subj("eco-store","OPS-02").cuIds, ["86c9ops2a","86c9ops2b"])'; then
  test_pass
else
  test_fail "Done table row parsed wrong"
fi

# ─── 10. Bullet variants ─────────────────────────────────────────────────────
print_test "Bullets: emoji after ID, trailing [status], earliest emoji"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Backlog

- **MKT-01** ✅ Promotions `86c9mkt01`
- **MKT-02** _(new)_ 🔄 Coupons
- **MKT-03** Loyalty points [⏸ deferred]
- **MKT-04** Referrals, see ✅ MKT-01
- **AUTH-01** is not a task
EOF
run_sync --all --offline --json
if check 'subj("eco-store","MKT-01").bucket === "closed" && subj("eco-store","MKT-01").cuIds[0] === "86c9mkt01"' \
  && check 'subj("eco-store","MKT-02").bucket === "open" && subj("eco-store","MKT-02").source === "inline"' \
  && check 'subj("eco-store","MKT-03").bucket === "open" && subj("eco-store","MKT-03").source === "inline"' \
  && check 'subj("eco-store","MKT-04").bucket === "closed"' \
  && check 'same(ids("eco-store"), ["MKT-01","MKT-02","MKT-03","MKT-04"])'; then
  test_pass
else
  test_fail "bullet status parsed wrong"
fi

# ─── 11. Blockquote ──────────────────────────────────────────────────────────
print_test "Blockquote with ✅ and a range yields no subjects"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 3

> ✅ SRC-01..09 shipped together `86c9blk01`.

- **SRC-10** 📋 Saved searches
EOF
run_sync --all --offline --json
if check 'same(ids("eco-store"), ["SRC-10"])' \
  && check 'notice("cu-only-in-mentions").some(n => n.ids === "86c9blk01")'; then
  test_pass
else
  test_fail "blockquote leaked subjects"
fi

# ─── 12. Escaped pipe ────────────────────────────────────────────────────────
print_test "Escaped \\| inside a cell does not shift columns"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 4

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| TRL-01 | Type `string \| LocalizedField` | High | ✅ | `86c9trl01` |
EOF
run_sync --all --offline --json
if check 'subj("eco-store","TRL-01").bucket === "closed"' \
  && check 'same(subj("eco-store","TRL-01").cuIds, ["86c9trl01"])'; then
  test_pass
else
  test_fail "escaped pipe split the row"
fi

# ─── 13. Referrals ───────────────────────────────────────────────────────────
print_test "Referrals: valid, dangling, CU mismatch, missing target, wrong doc, unknown home"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## Moved

→ **B-07** · `123kjkdp4mu` · Eco Shared (libs/eco/TASKS.md)
→ **B-08** · `123kjkdp4mv` · Eco Shared (libs/eco/TASKS.md)
→ **B-02/03** · `123kjkdp9zz` · Eco Shared (libs/eco/TASKS.md)
→ **BUG-010** · `123kjkdp1wa` · Plastikspace (TASKS.md)
→ **B-11** · `123kjkdp4m1` · Eco Shared (apps/eco-store/TASKS.md)
→ **B-12** · `123kjkdp4m2` · Nowhere (TASKS.md)
EOF
put libs/eco/TASKS.md << 'EOF'
## Shared

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| B-07 | Rules | High | 📋 | `123kjkdp4mu` |
| B-02/03 | Days | High | 📋 | `123kjkdp4mw` |
EOF
run_sync --all --offline --json
if check 'subjects("eco-admin").length === 0' \
  && check '!r.consistency.some(c => c.ids === "B-07")' \
  && check 'cons("dangling-referral").some(c => c.ids === "B-08")' \
  && check 'cons("referral-cu-mismatch").some(c => c.ids === "B-02/03" && c.detail.includes("123kjkdp4mw"))' \
  && check 'cons("referral-missing-doc").some(c => c.ids === "BUG-010")' \
  && check 'cons("referral-wrong-doc").some(c => c.ids === "B-11")' \
  && check 'cons("referral-unknown-home").some(c => c.ids === "B-12")' \
  && check 'r.drift === true && '"$EXIT"' === 1'; then
  test_pass
else
  test_fail "referral checks wrong"
fi

# ─── 14. Conflicting duplicate ───────────────────────────────────────────────
print_test "Same ID closed in one row and open in another is a conflict"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Current focus

| Task | Module | Priority | Status | One-line summary |
| --- | --- | --- | --- | --- |
| **PRV-05b-B** | PRV | High | 🔄 | Rules |

## Phase 5

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| PRV-05b-B | Rules | High | ✅ | `123kjkdp22r` |
EOF
run_sync --all --offline --json
if check 'cons("conflicting-duplicate").some(c => c.ids === "PRV-05b-B")' \
  && check 'subjects("eco-store").length === 1' \
  && check "$EXIT === 1"; then
  test_pass
else
  test_fail "conflict not reported"
fi

# ─── 15. Cross-home duplicate ────────────────────────────────────────────────
print_test "Same ID in two homes is a cross-home duplicate"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Bugs

| ID | Title | Priority | Status | ClickUp | Notes |
| --- | --- | --- | --- | --- | --- |
| BUG-010 | orders.tax max | Urgent | 📋 | `123kjkdp1wa` | — |
EOF
put libs/eco/TASKS.md << 'EOF'
## Shared

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| BUG-010 | orders.tax max | Urgent | 📋 | `123kjkdp1wa` |
EOF
run_sync --all --offline --json
if check 'cons("cross-home-duplicate").some(c => same([...c.homes].sort(), ["eco-shared","eco-store"]))'; then
  test_pass
else
  test_fail "cross-home duplicate not reported"
fi

# ─── 16. Missing doc tolerated ───────────────────────────────────────────────
print_test "Missing docs are notices, not drift"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 1

- **BOT-01** ✅ Catalogue
EOF
run_sync --all --offline --json
if check 'same(notice("missing-doc").map(n => n.ids).sort(), configuredDocs.filter(d => d !== "apps/eco-store/TASKS.md"))' \
  && check 'home("eco-shared").docFound === false' \
  && check 'r.drift === false' \
  && check "$EXIT === 0"; then
  test_pass
else
  test_fail "missing doc not tolerated"
fi

# ─── 17. --ref ───────────────────────────────────────────────────────────────
print_test "--ref reads committed docs, not the working tree"
reset_docs
rm -rf "$TEST_DIR/.git"
put apps/eco-store/TASKS.md << 'EOF'
## Phase 1

- **BOT-01** ✅ Catalogue
EOF
git -C "$TEST_DIR" init -q
git -C "$TEST_DIR" -c core.hooksPath=/dev/null -c commit.gpgsign=false -c user.name=test -c user.email=test@example.com \
  add apps/eco-store/TASKS.md
git -C "$TEST_DIR" -c core.hooksPath=/dev/null -c commit.gpgsign=false -c user.name=test -c user.email=test@example.com \
  commit -q -m fixture
put apps/eco-store/TASKS.md << 'EOF'
## Phase 1

- **BOT-02** 📋 Uncommitted
EOF
run_sync --all --offline --json --ref HEAD
REF_OK=0
if check 'same(ids("eco-store"), ["BOT-01"])' && check 'r.source === "git ref HEAD"'; then
  REF_OK=1
fi
run_sync --all --offline --json --ref no-such-ref
if [ "$REF_OK" = 1 ] && [ "$EXIT" = 2 ]; then
  test_pass
else
  test_fail "--ref read the wrong content or accepted an unknown ref (exit $EXIT)"
fi
rm -rf "$TEST_DIR/.git"

# ─── 18. Fixture run ─────────────────────────────────────────────────────────
print_test "Fixture run: only-in-TASKS, only-in-ClickUp, mismatch, wrong list, name match"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 1

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| BOT-01 | Catalogue | High | 📋 | `86c9bot01` |
| BOT-02 | Search | High | ✅ | `86c9bot02` |
| BOT-03 | Filters | High | 📋 | `123kjkdp4a9` |
| BOT-04 | Sorting | High | 📋 | — |
| BOT-05 | Paging | High | 📋 | — |

The carrier decision is tracked in `86c9qst15`.
EOF
put apps/eco-admin/TASKS.md << 'EOF'
## AP-0

| # | Task | MoSCoW | Est. | CU | Notes |
| --- | --- | --- | --- | --- | --- |
| 0.2 | AREF-01 move | MUST | 1d | `123kjkdp4a9` | — |
EOF
put clickup.json << 'EOF'
{
  "100": [
    { "id": "86c9bot01", "name": "BOT-01 Catalogue", "status": { "status": "to do", "type": "open" } },
    { "id": "86c9bot02", "name": "BOT-02 Search", "status": { "status": "in progress", "type": "custom" } },
    { "id": "86c9bot04", "name": "BOT-04 Sorting", "status": { "status": "to do", "type": "open" } },
    { "id": "86c9orph1", "name": "Orphan ticket", "status": { "status": "to do", "type": "open" } },
    { "id": "86c9qst15", "name": "Q-15 Pick a carrier", "status": { "status": "to do", "type": "open" } }
  ],
  "200": [{ "id": "123kjkdp4a9", "name": "AREF-01 move", "status": { "status": "to do", "type": "open" } }],
  "300": []
}
EOF
run_sync --all --json --clickup-fixture "$TEST_DIR/clickup.json"
if check 'home("eco-store").statusMismatches.some(m => m.ids === "BOT-02" && m.tasks === "closed" && m.clickup === "open")' \
  && check 'home("eco-store").linkProblems.some(p => p.ids === "BOT-03")' \
  && check 'home("eco-store").onlyInTasks.some(t => t.ids === "BOT-05")' \
  && check '!home("eco-store").onlyInTasks.some(t => t.ids === "BOT-04")' \
  && check 'same(home("eco-store").onlyInClickUp.map(t => t.id), ["86c9orph1"])' \
  && check 'notice("cu-only-in-mentions").some(n => n.ids === "86c9qst15")' \
  && check 'notice("no-list").some(n => n.homes[0] === "plastikspace")' \
  && check "$EXIT === 1"; then
  test_pass
else
  test_fail "fixture matching wrong"
fi

# ─── 19. Registrations ───────────────────────────────────────────────────────
print_test "Every configured doc is registered in .prettierrc, markdownlint and the hook"
if node -e '
  const fs = require("fs");
  const path = require("path");
  const root = process.argv[1];
  const prettier = require(require.resolve("prettier", { paths: [root] }));
  const minimatchModule = require(require.resolve("minimatch", { paths: [root] }));
  const minimatch = minimatchModule.minimatch ?? minimatchModule;
  const yaml = fs.readFileSync(path.join(root, ".markdownlint-cli2.yaml"), "utf8");
  // The entries of the top-level "ignores:" list, unquoted.
  const ignores = [];
  let inIgnores = false;
  for (const line of yaml.split("\n")) {
    if (/^\S/.test(line)) inIgnores = /^ignores:/.test(line);
    else if (inIgnores && /^\s+- /.test(line)) ignores.push(line.replace(/^\s+- /, "").trim().replace(/^["\x27]|["\x27]$/g, ""));
  }
  const config = JSON.parse(fs.readFileSync(path.join(root, "tools/scripts/task-homes.json"), "utf8"));
  const docs = config.homes.flatMap(home => [home.tasks, ...home.companions]);
  (async () => {
    const bad = [];
    for (const doc of docs) {
      const options = await prettier.resolveConfig(path.join(root, doc));
      if (options?.proseWrap !== "never") bad.push(`${doc}: .prettierrc proseWrap is ${options?.proseWrap}`);
      if (!ignores.some(glob => minimatch(doc, glob, { dot: true }))) {
        bad.push(`${doc}: not ignored in .markdownlint-cli2.yaml`);
      }
    }
    for (const doc of ["docs/TASKS.md", "libs/eco-store/TASKS.md"]) {
      const options = await prettier.resolveConfig(path.join(root, doc));
      if (options?.proseWrap === "never") bad.push(`${doc}: should not match the proseWrap override`);
    }
    bad.forEach(line => console.error(`  ${line}`));
    process.exit(bad.length ? 1 : 0);
  })();
' "$REPO_ROOT"; then
  HOOK_RE=$(sed -nE "s/^ *TASK_DOCS=.*grep -E '([^']+)'.*/\1/p" "$REPO_ROOT/.husky/pre-commit")
  DOCS=$(node -e '
    const config = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    console.log(config.homes.flatMap(home => [home.tasks, ...home.companions]).join("\n"));
  ' "$REPO_ROOT/tools/scripts/task-homes.json")
  UNMATCHED=$(printf '%s\n' "$DOCS" | /usr/bin/grep -vE "${HOOK_RE:-^$}" || true)
  NEGATIVE=$(printf '%s\n' docs/TASKS.md apps/eco-admin/REQUIREMENTS.md | /usr/bin/grep -cE "${HOOK_RE:-^$}" || true)
  if [ -n "$HOOK_RE" ] && [ -n "$DOCS" ] && [ -z "$UNMATCHED" ] && [ "$NEGATIVE" = 0 ]; then
    test_pass
  else
    test_fail "TASK_DOCS regex in .husky/pre-commit is '${HOOK_RE}' (unmatched: $(echo $UNMATCHED); negatives $NEGATIVE)"
  fi
else
  test_fail "a configured doc is not registered"
fi

# ─── 20. Exit codes ──────────────────────────────────────────────────────────
print_test "Exit 2 for a missing token, bad arguments and a directory as --tasks-path"
reset_docs
CODES=""
EXIT=0
env -u CLICKUP_API_TOKEN node "$SYNC" --root "$TEST_DIR" --config "$TEST_DIR/task-homes.json" --all \
  > /dev/null 2>&1 || EXIT=$?
CODES="$CODES$EXIT "
run_sync --all --home eco-store --offline
CODES="$CODES$EXIT "
run_sync --bogus --offline
CODES="$CODES$EXIT "
run_sync --home nowhere --offline
CODES="$CODES$EXIT "
run_sync --offline --clickup-fixture "$TEST_DIR/clickup.json"
CODES="$CODES$EXIT "
run_sync --offline --tasks-path "$TEST_DIR"
CODES="$CODES$EXIT"
if [ "$CODES" = "2 2 2 2 2 2" ]; then
  test_pass
else
  test_fail "exit codes were '$CODES', want '2 2 2 2 2 2'"
fi

# ─── 21. Design row ──────────────────────────────────────────────────────────
print_test "Design row naming ACAT-02 in prose does not merge with the open row"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## AP-3

| # | Task | MoSCoW | Est. | CU | Notes |
| --- | --- | --- | --- | --- | --- |
| 3.1 | ACAT-01/02 catalogue list | MUST | 2d | `123kjkdp4c1` | — |
| D.8 ✅ | ADES-08 design for ACAT-02 and ACAT-03 filters | SHOULD | 1d | `123kjkdp4d8` | — |
EOF
run_sync --all --offline --json
if check 'subjects("eco-admin").length === 2' \
  && check 'subj("eco-admin","ACAT-02").bucket === "open"' \
  && check 'same(subj("eco-admin","ADES-08").taskIds, ["ADES-08"]) && subj("eco-admin","ADES-08").bucket === "closed"' \
  && check 'cons("conflicting-duplicate").length === 0'; then
  test_pass
else
  test_fail "design row merged with the open row"
fi

# ─── 22. Deferred table ──────────────────────────────────────────────────────
print_test "Deferred table: Module key with only a CU is a subject"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## Deferred ⏸

| Module | Blocked on | CU |
| --- | --- | --- |
| AMKT promotions | eco-store MKT-01/02 schema, Q-11 | `123kjkdp4q0` |
EOF
run_sync --all --offline --json
if check 'subjects("eco-admin").length === 1' \
  && check 'same(subjects("eco-admin")[0].cuIds, ["123kjkdp4q0"]) && subjects("eco-admin")[0].taskIds.length === 0' \
  && check 'subjects("eco-admin")[0].bucket === "open"'; then
  test_pass
else
  test_fail "deferred row parsed wrong"
fi

# ─── 23. Q table ─────────────────────────────────────────────────────────────
print_test "Open-questions table with excluded Q IDs yields no subjects"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Open questions

| ID | Question | Status |
| --- | --- | --- |
| Q-13 | Who pays shipping? | ❓ |
| Q-15 | Tax rounding `86c8cjgj6` | ✅ |
EOF
run_sync --all --offline --json
if check 'subjects("eco-store").length === 0' \
  && check 'cons("unrecognized-family").length === 0' \
  && check 'notice("cu-only-in-mentions").some(n => n.ids === "86c8cjgj6")'; then
  test_pass
else
  test_fail "Q rows became subjects or warnings"
fi

# ─── 24. Research table ──────────────────────────────────────────────────────
print_test "Table without a ClickUp column reads the ticket from Notes"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Research

| ID | Description | Priority | Notes |
| --- | --- | --- | --- |
| MKT-research-01 | Competitor scan | Low | ClickUp `86c90qt5e` |
EOF
run_sync --all --offline --json
if check 'same(subj("eco-store","MKT-research-01").cuIds, ["86c90qt5e"])'; then
  test_pass
else
  test_fail "ticket in Notes not picked up"
fi

# ─── 25. Sub-table without a key column ──────────────────────────────────────
print_test "Sub-table without a key column under an ID heading adds nothing"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 6

### PST-04 Draft cycles 📋

| File | Purpose | Status |
| --- | --- | --- |
| on_cycle_draft.pb.js | Draft transitions, see VAL-01 | ✅ |
EOF
run_sync --all --offline --json
if check 'same(ids("eco-store"), ["PST-04"])' && check 'subj("eco-store","PST-04").bucket === "open"'; then
  test_pass
else
  test_fail "sub-table leaked subjects or status"
fi

# ─── 26. Status cells ────────────────────────────────────────────────────────
print_test "Status cells with a dash note, parentheses and leading words"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 7

| ID | Description | Priority | Status |
| --- | --- | --- | --- |
| VAL-01 | Validation | High | 🔄 — needs ✅ Q-13 |
| VAL-02 | Fiscal profile | High | Done (was 🔄) |
| VAL-03 | Addresses | High | Pending — Done soon |
| VAL-04 | Emails | High | — |
EOF
run_sync --all --offline --json
if check 'subj("eco-store","VAL-01").bucket === "open"' \
  && check 'subj("eco-store","VAL-02").bucket === "closed"' \
  && check 'subj("eco-store","VAL-03").bucket === "open"' \
  && check 'subj("eco-store","VAL-04").bucket === "open" && subj("eco-store","VAL-04").source === "default"'; then
  test_pass
else
  test_fail "status cell parsed wrong"
fi

# ─── 27. BACKLOG companion ───────────────────────────────────────────────────
print_test "BACKLOG companion: no subjects, referrals still validated"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 2

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| BOT-02b | Text search | High | 📋 | `86c8cjggk` |
EOF
put apps/eco-store/BACKLOG.md << 'EOF'
## Phase 2 — Search

| # | Task | Priority | Est | Depends on | Notes |
| --- | --- | --- | --- | --- | --- |
| 2.1 | **BOT-02b** Text search input | MUST | 1.5d | — | CU `86c8cjggk` |
| 2.2 | **BOT-07** Facets | MUST | 1d | — | CU `86c9bot07` |

## Phase 12 — eco-admin needs

→ **B-16** · `123kjkdp4b6` · Eco Shared (libs/eco/TASKS.md)
EOF
put libs/eco/TASKS.md << 'EOF'
## Shared

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| B-16 | Hidden categories | High | 📋 | `123kjkdp4b6` |
EOF
run_sync --all --offline --json
if check 'same(ids("eco-store"), ["BOT-02b"])' \
  && check 'r.consistency.length === 0' \
  && check 'notice("cu-only-in-mentions").some(n => n.ids === "86c9bot07")'; then
  test_pass
else
  test_fail "companion doc handled wrong"
fi

# ─── 28. "PRD ID" key column ─────────────────────────────────────────────────
print_test "\"PRD ID\" key column wins over Task"
reset_docs
put apps/eco-store/TASKS.md << 'EOF'
## Phase 8

| Task | PRD ID | Reason |
| --- | --- | --- |
| Loyalty programme | EST-03 | Out of scope until phase 9 |
EOF
run_sync --all --offline --json
if check 'same(ids("eco-store"), ["EST-03"])'; then
  test_pass
else
  test_fail "PRD ID column not used as key"
fi

# ─── 29. Task-key status ─────────────────────────────────────────────────────
print_test "Task key column: an emoji after the first segment does not set the status"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## Phase AP-1 — Requests

| # | Task | MoSCoW | Est. | CU | Notes |
| --- | --- | --- | --- | --- | --- |
| 1.1 | AREQ-01 inbox — blocked until ✅ G-01 lands | MUST | 1 | `123kjkdp4a1` | |
| 1.2 | AREQ-02 ✅ reply — sent | MUST | 1 | `123kjkdp4a2` | |
EOF
run_sync --all --offline --json
if check 'subj("eco-admin", "AREQ-01").bucket === "open"' \
  && check 'subj("eco-admin", "AREQ-02").bucket === "closed"'; then
  test_pass
else
  test_fail "status read from Task prose"
fi

# ─── 30. ClickUp ID lengths ──────────────────────────────────────────────────
print_test "Git SHAs that start like a ClickUp ID are not ClickUp IDs"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## Notes

Fixed in `123d67c8ed10` and `86c8cjggk1`; the ticket is `86c8cjggk`.
EOF
run_sync --all --offline --json
if check 'same(notice("cu-only-in-mentions").map(n => n.ids), ["86c8cjggk"])'; then
  test_pass
else
  test_fail "SHA-shaped token read as a ClickUp ID"
fi

# ─── 31. Referral to an ID list ──────────────────────────────────────────────
print_test "A referral to B-02/03 needs a row for each ID"
reset_docs
put apps/eco-admin/TASKS.md << 'EOF'
## Moved

→ **B-02/03** · `123kjkdp4n0` · Eco Shared (libs/eco/TASKS.md)
EOF
put libs/eco/TASKS.md << 'EOF'
## Shared

| ID | Description | Priority | Status | ClickUp |
| --- | --- | --- | --- | --- |
| B-02 | Days | High | 📋 | `123kjkdp4n0` |
EOF
run_sync --all --offline --json
if check 'cons("dangling-referral").length === 1' \
  && check 'cons("dangling-referral")[0].detail.startsWith("no B-03 row")' \
  && check "$EXIT === 1"; then
  test_pass
else
  test_fail "half-matched referral accepted"
fi

###############################################################################
# Summary
###############################################################################

print_header "Test Summary"
echo -e "Total tests: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed! ✓${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed! ✗${NC}"
  exit 1
fi
