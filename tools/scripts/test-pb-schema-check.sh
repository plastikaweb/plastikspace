#!/usr/bin/env bash
# META-12 — fixture tests for tools/scripts/check-pb-schema-change.cjs.
# Each rule debuts failing on the case it targets, next to a case that must pass.
# Run: bash tools/scripts/test-pb-schema-check.sh   (CI: .github/workflows/pb-schema-guard.yml)

set -u
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK="$SCRIPT_DIR/check-pb-schema-change.cjs"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/pb-schema-check.XXXXXX")" || {
  echo "cannot create a temp dir under ${TMPDIR:-/tmp}"
  exit 2
}
trap 'rm -rf "$WORK"' EXIT

RUN=0
PASSED=0
FAILED=0

# base: two collections, ids as PocketBase exports them.
cat > "$WORK/base.json" << 'EOF'
[
  { "id": "c_users", "name": "users", "type": "auth",
    "fields": [ { "id": "f_email", "name": "email", "type": "email" },
                { "id": "f_name", "name": "name", "type": "text" } ],
    "indexes": [], "listRule": "id = @request.auth.id", "viewRule": "id = @request.auth.id" },
  { "id": "c_products", "name": "products", "type": "base",
    "fields": [ { "id": "f_title", "name": "title", "type": "json" } ],
    "indexes": [], "listRule": "" }
]
EOF

# Variants of the head schema.
node -e '
const fs = require("fs");
const dir = process.argv[1];
const base = JSON.parse(fs.readFileSync(dir + "/base.json", "utf8"));
const clone = () => JSON.parse(JSON.stringify(base));
const write = (name, data) => fs.writeFileSync(dir + "/" + name + ".json", JSON.stringify(data, null, 2));
let s;
s = clone(); s[0].fields.push({ id: "f_phone", name: "phone", type: "text" }); write("field-added", s);
s = clone(); s[0].fields = s[0].fields.filter(f => f.id !== "f_name"); write("field-removed", s);
s = clone(); s.splice(1, 1); write("collection-removed", s);
s = clone(); s[0].fields[1].name = "fullName"; write("field-renamed", s);
s = clone(); s[1].listRule = "@request.auth.id != \"\""; write("rule-changed", s);
' "$WORK"

printf '%s\n' apps/eco-store/pocketbase/pb_schema.json libs/eco-store/profile/basic/src/index.ts > "$WORK/changed-eco.txt"
printf '%s\n' apps/eco-store/pocketbase/pb_schema.json .husky/pre-commit > "$WORK/changed-schema-only.txt"

# expect <name> <expected exit> <grep pattern or ""> -- <args...>
expect() {
  local name=$1 want=$2 pattern=$3
  shift 4
  RUN=$((RUN + 1))
  local out rc
  out=$(node "$CHECK" "$@" 2>&1)
  rc=$?
  if [ "$rc" -eq "$want" ] && { [ -z "$pattern" ] || printf '%s' "$out" | grep -qE "$pattern"; }; then
    PASSED=$((PASSED + 1))
    echo "✓ $name (exit $rc)"
  else
    FAILED=$((FAILED + 1))
    echo "✗ $name: exit $rc, wanted $want${pattern:+ and /$pattern/}"
    printf '%s\n' "$out" | sed 's/^/    /'
  fi
}

B="--base $WORK/base.json"
expect "identical schemas pass" 0 'no schema change' -- $B --head "$WORK/base.json" --changed "$WORK/changed-schema-only.txt"
expect "added field with eco code passes (no false positive)" 0 'fields added: phone' -- $B --head "$WORK/field-added.json" --changed "$WORK/changed-eco.txt"
expect "schema change without other eco files fails" 1 'schema-only-change' -- $B --head "$WORK/field-added.json" --changed "$WORK/changed-schema-only.txt"
expect "the pb-schema label acknowledges it" 0 'Acknowledged' -- $B --head "$WORK/field-added.json" --changed "$WORK/changed-schema-only.txt" --labels "chore,pb-schema"
expect "a removed field fails even with eco code" 1 'schema-removal: users' -- $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt"
expect "a removed collection fails" 1 'schema-removal: products' -- $B --head "$WORK/collection-removed.json" --changed "$WORK/changed-eco.txt"
expect "a removal with the label passes but is listed" 0 'collection removed' -- $B --head "$WORK/collection-removed.json" --changed "$WORK/changed-eco.txt" --labels "pb-schema"
expect "a renamed field is not a removal" 0 'name → fullName' -- $B --head "$WORK/field-renamed.json" --changed "$WORK/changed-eco.txt"
expect "a rule change is summarised" 0 'rules changed: listRule' -- $B --head "$WORK/rule-changed.json" --changed "$WORK/changed-eco.txt"
expect "without --changed only removals are judged" 0 'fields added' -- $B --head "$WORK/field-added.json"
expect "missing --head is a usage error" 2 'required' -- $B
expect "an unreadable file is an IO error" 2 'nope.json' -- $B --head "$WORK/nope.json"
SUMMARY="$WORK/summary.md"
expect "the summary file gets the table" 1 '' -- $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt" --summary "$SUMMARY"
RUN=$((RUN + 1))
if grep -q '| users | fields removed | fields removed: name |' "$SUMMARY"; then
  PASSED=$((PASSED + 1)); echo "✓ summary row written"
else
  FAILED=$((FAILED + 1)); echo "✗ summary row missing"; sed 's/^/    /' "$SUMMARY"
fi

echo ""
echo "Total: $RUN · passed: $PASSED · failed: $FAILED"
[ "$FAILED" -eq 0 ]
