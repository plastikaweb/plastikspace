#!/bin/bash
# Get all projects
projects=$(npx nx show projects)

# Create a log file
echo "Linting started..." > lint_errors.log

# Loop through each project
for project in $projects; do
  echo "Linting $project..."
  echo "--------------------------------------------------" >> lint_errors.log
  echo "Project: $project" >> lint_errors.log
  npx nx lint $project --fix >> lint_errors.log 2>&1
  if [ $? -ne 0 ]; then
    echo "FAILED: $project"
  else
    echo "PASSED: $project"
  fi
done

echo "Linting finished. Check lint_errors.log for details."
