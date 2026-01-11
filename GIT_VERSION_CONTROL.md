# Git Version Control Best Practices

## 🎯 Your Situation
- **Version 1**: Working app with local SQLite database (stable)
- **Version 2**: New version with Supabase + Google Auth (in progress, has kinks)

## ✅ Best Practice: Use Git Tags (Recommended)

**Don't create separate repos or branches for versions.** Instead, use **tags** to mark stable versions.

### Step 1: Tag Version 1 (Current Stable)

First, let's save your current working state as v1.0:

```bash
# Make sure all v1 changes are committed
git add .
git commit -m "Save v1.0 state: Local SQLite database version"

# Create a tag for v1.0
git tag -a v1.0 -m "Version 1.0: Stable version with local SQLite database"

# Push the tag to GitHub
git push origin v1.0
```

### Step 2: Continue Working on Version 2

You're already on `main` branch with v2 changes. Continue working here:

```bash
# Your current work is already here
# Just keep committing as you fix issues:
git add .
git commit -m "Add Supabase integration and Google Auth"
```

### Step 3: When v2 is Stable, Tag It

Once v2 is working well:

```bash
git tag -a v2.0 -m "Version 2.0: Supabase + Google Auth"
git push origin v2.0
```

## 📋 Complete Workflow

### Current State
```bash
# Check what you have
git status
git log --oneline -5
```

### Save v1.0 (Do This First)
```bash
# Option A: If you want to save current state as v1.0
# (But you've already made v2 changes, so this won't work)

# Option B: Better - create v1.0 from the last stable commit
git tag -a v1.0 a518380 -m "Version 1.0: Stable SQLite version"
git push origin v1.0
```

### Continue v2 Development
```bash
# You're already here - just keep working
git add .
git commit -m "Description of changes"
git push origin main
```

### Switch Between Versions (If Needed)
```bash
# View v1.0 code (read-only)
git checkout v1.0

# Go back to v2 development
git checkout main
```

## 🎯 Recommended Approach for You

Since you've already made v2 changes, here's what I recommend:

### Option 1: Tag the Last Stable Commit as v1.0
```bash
# Tag the commit before Supabase changes
git tag -a v1.0 a518380 -m "Version 1.0: Stable SQLite version"
git push origin v1.0

# Continue on main with v2
# (You're already here)
```

### Option 2: Create a Release Branch (Alternative)
```bash
# Create a branch from the stable commit
git checkout -b release/v1.0 a518380
git push origin release/v1.0

# Go back to main for v2
git checkout main
```

## 📝 What to Commit Now

Your current changes (v2):
```bash
git add app.py requirements.txt static/js/app.js templates/index.html
git add *.md migrate_data_to_user.py migrate_to_supabase.py supabase_config.py
git commit -m "Add Supabase integration with Google OAuth authentication

- Add Supabase database connection
- Implement Google OAuth sign-in
- Add user-based data filtering
- Create migration scripts for data migration
- Add comprehensive setup documentation"
git push origin main
```

## 🔒 Important: Don't Commit These

Add to `.gitignore`:
```bash
.env              # Contains secrets!
*.db              # Local database files
__pycache__/      # Python cache
*.pyc
instance/         # Flask instance folder
```

## 📚 Git Commands Cheat Sheet

```bash
# View all tags
git tag

# View a specific version
git show v1.0

# Create a new tag
git tag -a v2.0 -m "Version 2.0 description"

# Push tags to GitHub
git push origin --tags

# Switch to a tag (read-only)
git checkout v1.0

# Go back to latest
git checkout main
```

## ✅ Summary

1. **Tag v1.0** from your last stable commit (before Supabase changes)
2. **Continue on main** for v2 development
3. **Tag v2.0** when it's stable
4. **Never commit** `.env` file (it has secrets!)

This way:
- ✅ v1.0 is safely saved and tagged
- ✅ You can always go back to v1.0 if needed
- ✅ v2 development continues on main
- ✅ Both versions are in the same repo (cleaner)
