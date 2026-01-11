# Quick Steps: Save v1 & Continue v2

## 🎯 Goal
- Save v1.0 (stable SQLite version) as a tag
- Continue v2 (Supabase) development on main
- Fix migration script issue

## Step 1: Fix Migration Script

The script has a permission issue. Try the web method instead:

1. **Sign in** to http://localhost:5001
2. **Open browser console** (F12)
3. **Run this**:
```javascript
fetch('/api/auth/migrate-data', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + (await window.supabase.auth.getSession()).data.session.access_token,
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    console.log('Migration:', data);
    if (data.success) {
        alert(`✅ Migrated ${data.migrated.ideas} ideas, ${data.migrated.projects} projects!`);
        window.location.reload();
    } else {
        alert('Error: ' + data.error);
    }
});
```

## Step 2: Save v1.0 to GitHub

```bash
# Tag the last stable commit (before Supabase changes)
git tag -a v1.0 a518380 -m "Version 1.0: Stable SQLite database version"

# Push the tag to GitHub
git push origin v1.0
```

## Step 3: Commit v2 Changes

```bash
# Add all v2 files
git add app.py requirements.txt static/js/app.js templates/index.html
git add *.md migrate_data_to_user.py migrate_to_supabase.py supabase_config.py
git add .gitignore

# Commit
git commit -m "Version 2.0: Add Supabase integration with Google OAuth

- Supabase PostgreSQL database connection
- Google OAuth authentication
- User-based data filtering
- Migration scripts and documentation"

# Push to GitHub
git push origin main
```

## Step 4: Verify

```bash
# Check tags
git tag

# View v1.0 (if you want to see it)
git show v1.0 --stat

# You're on main (v2)
git branch
```

## ✅ Result

- ✅ v1.0 is safely tagged and on GitHub
- ✅ v2 is on main branch
- ✅ You can switch between versions anytime
- ✅ `.env` file is ignored (won't be committed)

## 🔄 If You Need to Go Back to v1.0

```bash
# View v1.0 code (read-only)
git checkout v1.0

# Go back to v2
git checkout main
```
