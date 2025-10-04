#!/bin/bash

# Automatically stage (add) ALL files and all folders/changes
git add -A

# Prevent node_modules and other ignored files from being included unless really needed
# (Remove next line if you actually want to include hidden data/.env etc)
git reset node_modules/ .env .DS_Store 2>/dev/null

# Commit with timestamp
msg="Update website files $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$msg" || echo "No changes to commit."

# Push to main branch
git push origin master

echo "All folders and files pushed to your GitHub repo (and Render/Netlify will auto-update)!"
