# Commitizen workflow

Your job is to create a commit taking into account the present commitizen configuration in .cz-config.js and the git staging area.

For each question on the commitizen flow:

1. use the issue id that's used in the branch name. If we are in develop branch, ask me for the issue id and create the branch with the naming configuration reflected in branchNameLint.js.
2. if changes aren't in the staging area, add them to the staging area.
3. add a descriptive name for the changes included. Take into account the subjectLimit and other configuration.
4. add more description if needed in the extended description step.
5. add the closed issue number based on the branch name.
