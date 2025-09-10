#!/bin/bash

# Create a backup of the current state
git branch backup-before-filter

# Remove the sensitive file and its contents from history
git filter-repo --invert-paths --path apps/nos/.dev.vars

# # Force push the changes
# git push origin --force --all 