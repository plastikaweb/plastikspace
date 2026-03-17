#!/bin/bash

###############################################################################
#
# i18n Validation Test Suite
#
# Tests the i18n validation script with various scenarios.
#
# WHEN TO RUN:
#   - Before committing changes to translation files
#   - In CI/CD pipeline to verify validation system works
#   - After modifying the validate-i18n-keys.js script
#
# HOW TO RUN:
#   yarn i18n:test
#   or
#   ./tools/scripts/test-i18n-validation.sh
#
# WHAT IT TESTS:
#   ✓ Single app with valid translation keys
#   ✓ TypeScript pattern detection (translateService.instant)
#   ✓ Missing keys detection
#   ✓ Multiple apps with different language combinations
#   ✓ Alternative directory structures (src/assets/i18n, i18n/)
#   ✓ Graceful handling when no apps with i18n found
#   ✓ Keys with parameters in templates
#   ✓ Keys in HTML attributes and directives
#   ✓ Source language selection (prefers en.json)
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

# Temporary test directory
TEST_DIR=$(mktemp -d)
ORIGINAL_DIR=$(pwd)

# Cleanup on exit
cleanup() {
  cd "$ORIGINAL_DIR"
  rm -rf "$TEST_DIR"
}
trap cleanup EXIT

###############################################################################
# Test Utilities
###############################################################################

print_header() {
  echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

print_test() {
  ((TESTS_RUN++))
  echo -ne "${YELLOW}Test $TESTS_RUN: $1${NC} ... "
}

test_pass() {
  ((TESTS_PASSED++))
  echo -e "${GREEN}✓ PASS${NC}"
}

test_fail() {
  ((TESTS_FAILED++))
  echo -e "${RED}✗ FAIL${NC}"
  echo -e "${RED}  Error: $1${NC}\n"
}

###############################################################################
# Test Setup Helpers
###############################################################################

setup_test_app() {
  local app_name=$1
  local app_dir="$TEST_DIR/apps/$app_name/public/i18n"
  mkdir -p "$app_dir"
  echo "$app_dir"
}

setup_simple_en_json() {
  local app_dir=$1
  cat > "$app_dir/en.json" << 'EOF'
{
  "app": {
    "title": "Test App",
    "description": "A test application"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred"
  }
}
EOF
}

setup_simple_ca_json() {
  local app_dir=$1
  cat > "$app_dir/ca.json" << 'EOF'
{
  "app": {
    "title": "App de prova",
    "description": "Una aplicació de prova"
  },
  "common": {
    "loading": "Carregant...",
    "error": "Ha ocorregut un error"
  }
}
EOF
}

setup_simple_es_json() {
  local app_dir=$1
  cat > "$app_dir/es.json" << 'EOF'
{
  "app": {
    "title": "Aplicación de prueba",
    "description": "Una aplicación de prueba"
  },
  "common": {
    "loading": "Cargando...",
    "error": "Ha ocurrido un error"
  }
}
EOF
}

setup_template_html() {
  local app_dir=$1
  local filename=$2
  local content=$3
  mkdir -p "$(dirname "$app_dir/$filename")"
  echo "$content" > "$app_dir/$filename"
}

setup_typescript_file() {
  local app_dir=$1
  local filename=$2
  local content=$3
  mkdir -p "$(dirname "$app_dir/$filename")"
  echo "$content" > "$app_dir/$filename"
}

###############################################################################
# Test Cases
###############################################################################

print_header "i18n Validation Test Suite"

# Test 1: Basic structure validation
print_test "Single app with valid keys in template"
{
  APP_DIR=$(setup_test_app "test-app-1")
  setup_simple_en_json "$APP_DIR"
  setup_simple_ca_json "$APP_DIR"
  setup_simple_es_json "$APP_DIR"
  setup_template_html "$(dirname $APP_DIR)" "src/app.component.html" "
    <h1>{{ 'app.title' | translate }}</h1>
    <p>{{ 'app.description' | translate }}</p>
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "All translation keys are valid"; then
  test_pass
else
  test_fail "Validation failed for valid keys"
fi

# Test 2: TypeScript pattern detection
print_test "TypeScript pattern detection with translateService"
{
  APP_DIR=$(setup_test_app "test-app-2")
  setup_simple_en_json "$APP_DIR"
  setup_simple_ca_json "$APP_DIR"
  setup_simple_es_json "$APP_DIR"
  setup_typescript_file "$(dirname $APP_DIR)" "src/service.ts" "
    export class MyService {
      getMessage() {
        return this.translate.instant('common.loading');
      }
    }
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "All translation keys are valid"; then
  test_pass
else
  test_fail "TypeScript pattern not detected"
fi

# Test 3: Missing keys detection
print_test "Missing keys detection"
{
  APP_DIR=$(setup_test_app "test-app-3")
  setup_simple_en_json "$APP_DIR"
  setup_simple_ca_json "$APP_DIR"
  setup_simple_es_json "$APP_DIR"
  setup_template_html "$(dirname $APP_DIR)" "src/app.component.html" "
    <h1>{{ 'app.title' | translate }}</h1>
    <p>{{ 'missing.key' | translate }}</p>
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "missing.key"; then
  test_pass
else
  test_fail "Missing key was not detected"
fi

# Test 4: Multiple apps with different languages
print_test "Multiple apps with different language combinations"
{
  # App 1 with 3 languages
  APP1_DIR=$(setup_test_app "multi-app-1")
  setup_simple_en_json "$APP1_DIR"
  setup_simple_ca_json "$APP1_DIR"
  setup_simple_es_json "$APP1_DIR"
  setup_template_html "$(dirname $APP1_DIR)" "src/app.component.html" "
    {{ 'app.title' | translate }}
  "
  # App 2 with 2 languages
  APP2_DIR=$(setup_test_app "multi-app-2")
  cat > "$APP2_DIR/en.json" << 'EOF'
{
  "feature": {
    "name": "Feature"
  }
}
EOF
  cat > "$APP2_DIR/fr.json" << 'EOF'
{
  "feature": {
    "name": "Fonctionnalité"
  }
}
EOF
  setup_template_html "$(dirname $APP2_DIR)" "src/feature.component.html" "
    {{ 'feature.name' | translate }}
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "multi-app-1" && echo "$OUTPUT" | grep -q "multi-app-2"; then
  test_pass
else
  test_fail "Multiple apps not properly detected"
fi

# Test 5: Directory structure variations
print_test "Alternative directory structure (src/assets/i18n)"
{
  APP_DIR="$TEST_DIR/apps/test-app-5/src/assets/i18n"
  mkdir -p "$APP_DIR"
  setup_simple_en_json "$APP_DIR"
  setup_simple_ca_json "$APP_DIR"
  setup_template_html "$TEST_DIR/apps/test-app-5" "src/app.component.html" "
    {{ 'app.title' | translate }}
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "All translation keys are valid"; then
  test_pass
else
  test_fail "Alternative directory structure not recognized"
fi

# Test 6: Minimal directory structure
print_test "Minimal directory structure (i18n at root)"
{
  APP_DIR="$TEST_DIR/apps/test-app-6/i18n"
  mkdir -p "$APP_DIR"
  setup_simple_en_json "$APP_DIR"
  setup_template_html "$TEST_DIR/apps/test-app-6" "src/app.component.html" "
    {{ 'app.title' | translate }}
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "All translation keys are valid"; then
  test_pass
else
  test_fail "Minimal directory structure not recognized"
fi

# Test 7: No apps scenario
print_test "Graceful handling when no apps with i18n found"
{
  cd "$TEST_DIR"
  mkdir -p apps/no-i18n-app/src
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "No apps with translations found"; then
  test_pass
else
  test_fail "Should handle no apps gracefully"
fi

# Test 8: Key with parameters
print_test "Keys with parameters in templates"
{
  APP_DIR=$(setup_test_app "test-app-8")
  cat > "$APP_DIR/en.json" << 'EOF'
{
  "messages": {
    "greeting": "Hello {{name}}!"
  }
}
EOF
  setup_template_html "$(dirname $APP_DIR)" "src/app.component.html" "
    {{ 'messages.greeting' | translate: { name: userName } }}
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "All translation keys are valid"; then
  test_pass
else
  test_fail "Parameterized keys not detected"
fi

# Test 9: Keys in attributes
print_test "Keys in HTML attributes (directives)"
{
  APP_DIR=$(setup_test_app "test-app-9")
  setup_simple_en_json "$APP_DIR"
  setup_template_html "$(dirname $APP_DIR)" "src/app.component.html" "
    <button [title]=\"'common.loading' | translate\">Click me</button>
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "All translation keys are valid"; then
  test_pass
else
  test_fail "Keys in attributes not detected"
fi

# Test 10: Source language selection
print_test "Source language selection (prefers en.json)"
{
  APP_DIR=$(setup_test_app "test-app-10")
  # Create es.json first (should not be selected as source)
  cat > "$APP_DIR/es.json" << 'EOF'
{
  "app": {
    "title": "Aplicación"
  }
}
EOF
  # Create en.json (should be selected as source)
  cat > "$APP_DIR/en.json" << 'EOF'
{
  "app": {
    "title": "Application"
  }
}
EOF
  setup_template_html "$(dirname $APP_DIR)" "src/app.component.html" "
    {{ 'app.title' | translate }}
  "
  cd "$TEST_DIR"
  OUTPUT=$(node "$ORIGINAL_DIR/tools/scripts/validate-i18n-keys.js" 2>&1 || true)
  cd "$ORIGINAL_DIR"
}
if echo "$OUTPUT" | grep -q "All translation keys are valid"; then
  test_pass
else
  test_fail "Source language selection not working"
fi

###############################################################################
# Summary
###############################################################################

print_header "Test Summary"

echo -e "Total Tests:  ${YELLOW}$TESTS_RUN${NC}"
echo -e "Passed:       ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed:       ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "\n${GREEN}All tests passed! ✓${NC}\n"
  exit 0
else
  echo -e "\n${RED}Some tests failed! ✗${NC}\n"
  exit 1
fi
