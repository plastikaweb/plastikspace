#!/usr/bin/env bash
# META-12 — fixture tests for tools/scripts/check-pb-schema-change.cjs.
# Each rule debuts failing on the case it targets, next to a case that must pass.
# Run: bash tools/scripts/test-pb-schema-check.sh   (CI: .github/workflows/pb-schema-guard.yml)

set -u
# The checker prints GitHub annotations when GITHUB_ACTIONS=true; in CI they would
# attach to the pull request from these fixtures. Only the annotation cases set it.
unset GITHUB_ACTIONS
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

# base: two collections and a view, ids as PocketBase exports them (view fields get
# random `_clone_` ids, regenerated each time the view is saved).
cat > "$WORK/base.json" << 'EOF'
[
  { "id": "c_users", "name": "users", "type": "auth",
    "fields": [ { "id": "f_email", "name": "email", "type": "email" },
                { "id": "f_name", "name": "name", "type": "text" },
                { "id": "f_fav", "name": "favourite", "type": "relation", "collectionId": "c_products" } ],
    "indexes": [], "listRule": "id = @request.auth.id", "viewRule": "id = @request.auth.id" },
  { "id": "c_products", "name": "products", "type": "base",
    "fields": [ { "id": "f_title", "name": "title", "type": "json" } ],
    "indexes": [], "listRule": "" },
  { "id": "c_stats", "name": "product_stats", "type": "view",
    "fields": [ { "id": "text3208210256", "name": "id", "type": "text" },
                { "id": "_clone_AAAA", "name": "title", "type": "json" },
                { "id": "_clone_BBBB", "name": "icon", "type": "text" } ],
    "indexes": [], "listRule": "", "viewQuery": "SELECT id, title, icon FROM products" }
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
s = clone(); s[2].fields[1].id = "_clone_ZZZZ"; s[2].fields[2].id = "_clone_YYYY"; write("view-ids-regenerated", s);
// The sync finds a collection by id, else by name: a new id under the same name is updated
// in place, and relations to it are remapped by name. A field with a new id is dropped.
s = clone(); s[1].id = "c_products_new"; s[0].fields[2].collectionId = "c_products_new"; write("collection-id-flipped", s);
s = clone(); s[1].id = "c_products_new"; s[1].fields[0].id = "f_title_json"; write("collection-id-flipped-field-id", s);
s = clone(); s[2].fields.pop(); s[2].fields[1].id = "_clone_ZZZZ"; s[2].viewQuery = "SELECT id, title FROM products"; write("view-field-removed", s);
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
    # Indented and prefixed, so a captured annotation is not read as a workflow command.
    printf '%s\n' "$out" | sed 's/^/    > /'
  fi
}

B="--base $WORK/base.json"
expect "identical schemas pass" 0 'no schema change' -- $B --head "$WORK/base.json" --changed "$WORK/changed-schema-only.txt"
expect "added field with eco code passes (no false positive)" 0 'fields added: phone' -- $B --head "$WORK/field-added.json" --changed "$WORK/changed-eco.txt"
expect "schema change without other eco files fails" 1 'schema-only-change' -- $B --head "$WORK/field-added.json" --changed "$WORK/changed-schema-only.txt"
expect "the pb-schema label acknowledges it" 0 'Acknowledged' -- $B --head "$WORK/field-added.json" --changed "$WORK/changed-schema-only.txt" --labels "chore,pb-schema"
expect "a removed field fails even with eco code" 1 'schema-removal: users' -- $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt"
expect "a removed collection fails" 1 'schema-removal: products removed' -- $B --head "$WORK/collection-removed.json" --changed "$WORK/changed-eco.txt"
expect "a removed collection is said to stay on staging" 1 'never deletes a collection' -- $B --head "$WORK/collection-removed.json" --changed "$WORK/changed-eco.txt"
expect "a removed field is said to lose its data" 1 'drops a field the file no longer has, data included' -- $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt"
expect "a removal with the label passes but is listed" 0 'collection removed' -- $B --head "$WORK/collection-removed.json" --changed "$WORK/changed-eco.txt" --labels "pb-schema"
expect "a renamed field is not a removal" 0 'name → fullName' -- $B --head "$WORK/field-renamed.json" --changed "$WORK/changed-eco.txt"
expect "a rule change is summarised" 0 'rules changed: listRule' -- $B --head "$WORK/rule-changed.json" --changed "$WORK/changed-eco.txt"
expect "regenerated view field ids are no change" 0 'no schema change' -- $B --head "$WORK/view-ids-regenerated.json" --changed "$WORK/changed-schema-only.txt"
expect "a removed view field is listed, not a removal" 0 'view fields removed: icon' -- $B --head "$WORK/view-field-removed.json" --changed "$WORK/changed-eco.txt"
expect "a collection id change under the same name is not a removal" 0 'id changed from c_products' -- $B --head "$WORK/collection-id-flipped.json" --changed "$WORK/changed-eco.txt"
RUN=$((RUN + 1))
if node "$CHECK" $B --head "$WORK/collection-id-flipped.json" --changed "$WORK/changed-eco.txt" | grep -q '^| users |'; then
  FAILED=$((FAILED + 1)); echo "✗ a relation to the renumbered collection shows as a change"
else
  PASSED=$((PASSED + 1)); echo "✓ a relation to the renumbered collection is no change"
fi
expect "a field whose id changes in that collection is a removal" 1 'schema-removal: products lose fields' -- $B --head "$WORK/collection-id-flipped-field-id.json" --changed "$WORK/changed-eco.txt"
expect "--compare-only: identical schemas" 0 'same schema' -- --compare-only $B --head "$WORK/base.json"
expect "--compare-only: regenerated view ids are the same schema" 0 'same schema' -- --compare-only $B --head "$WORK/view-ids-regenerated.json"
expect "--compare-only: an id change under the same name is a change" 1 'schema changed: products' -- --compare-only $B --head "$WORK/collection-id-flipped.json"
expect "--compare-only: an added field is a change" 1 'schema changed: users' -- --compare-only $B --head "$WORK/field-added.json"
expect "a stale label no longer acknowledges" 1 'no longer counts' -- $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt" --labels "pb-schema" --label-stale
expect "a stale flag without the label asks for the label" 1 'add the "pb-schema" label' -- $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt" --label-stale
expect "a stale flag on a clean change passes" 0 'No removals' -- $B --head "$WORK/field-added.json" --changed "$WORK/changed-eco.txt" --labels "pb-schema" --label-stale
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

# Annotations: errors in GitHub Actions, warnings once acknowledged, nothing elsewhere.
ANNOTATION='file=apps/eco-store/pocketbase/pb_schema.json,title=schema-removal'
annotation_case() {
  local name=$1 env_value=$2 pattern=$3 want_match=$4
  shift 4
  RUN=$((RUN + 1))
  local out found=no
  out=$(GITHUB_ACTIONS=$env_value node "$CHECK" "$@" 2>&1)
  printf '%s\n' "$out" | grep -qE "$pattern" && found=yes
  if [ "$found" = "$want_match" ]; then
    PASSED=$((PASSED + 1))
    echo "✓ $name"
  else
    FAILED=$((FAILED + 1))
    echo "✗ $name: /$pattern/ found=$found, wanted $want_match"
    printf '%s\n' "$out" | sed 's/^/    > /'
  fi
}
annotation_case "a failure is an error annotation in GitHub Actions" true "^::error $ANNOTATION::schema-removal: users lose fields" yes \
  $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt"
annotation_case "an acknowledged problem is a warning annotation" true "^::warning $ANNOTATION \\(acknowledged\\)::schema-removal" yes \
  $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt" --labels "pb-schema"
annotation_case "no annotation outside GitHub Actions" "" '^::' no \
  $B --head "$WORK/field-removed.json" --changed "$WORK/changed-eco.txt"

echo ""
echo "Total: $RUN · passed: $PASSED · failed: $FAILED"
[ "$FAILED" -eq 0 ]
