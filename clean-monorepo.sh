#!/bin/bash

echo "🚀 Starting deep monorepo cleanup for AI optimization..."

# 1. Delete tool caches and compilation
rm -rf .angular/cache
rm -rf .nx/cache
rm -rf .nx/workspace-data

# 2. Delete all logs that we detected at the root
rm -f *.log
rm -f firestore-debug.log
rm -f pglite-debug.log
rm -f ui-debug.log

# 3. Delete distribution and coverage folders
rm -rf dist/
rm -rf coverage/
rm -rf tmp/

# 4. (Optional) Delete configuration folders of other IAs if you don't use them anymore
# rm -rf .trae/
# rm -rf .windsurf/

echo "✅ Monorepo cleaned! Now Cursor will index only the source code."