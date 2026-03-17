# Commitizen workflow

Your job is to create a commit taking into account the present commitizen configuration in .cz-config.js.

For each question on the commitizen flow:

- use the issue id that's used in the branch name. If we are in develop branch, ask me for the issue id and create the branch with the naming configuration reflected in branchNameLint.js.
- add a descriptive name for the changes included. Take into account the subjectLimit and other configuration.
- add more description if needed in the extended description step.
- add the closed issue number based on the branch name.
