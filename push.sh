#!/bin/bash

# Commit message with timestamp
commit_msg="Auto commit at $(date +'%Y-%m-%d %H:%M:%S')"

# Initialize git repository if not exists
if [ ! -d .git ]; then
  git init
fi

# Add all changes
git add .

# Commit changes (ignore error if no changes to commit)
git commit -m "$commit_msg" || echo "No changes to commit"

# Push changes using gh CLI (assumes gh is logged in already)
BRANCH="main"
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE_URL" ]; then
  # Set remote to repo on your GitHub account
  USERNAME=$(gh api user --jq .login)
  REPO_NAME=$(basename `pwd`)
  gh repo create $REPO_NAME --source=. --remote=origin --push --public --confirm
else
  git push origin $BRANCH --force
fi

echo "Pushed changes to GitHub repo."
