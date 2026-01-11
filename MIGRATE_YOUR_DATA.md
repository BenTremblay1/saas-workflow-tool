# Migrate Your Historical Data to Your Account

## 🎯 Goal
Move all your existing ideas, projects, and notes to your authenticated Supabase account so they appear when you're signed in.

## ✅ Quick Method (Recommended)

### Step 1: Sign In
1. Go to http://localhost:5001
2. Click "Sign in with Google"
3. Complete the sign-in process

### Step 2: Migrate Data
Once signed in, open your browser console (F12) and run:

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
    console.log('Migration result:', data);
    if (data.success) {
        alert(`✅ Migrated ${data.migrated.ideas} ideas, ${data.migrated.projects} projects! Refresh the page to see your data.`);
        window.location.reload();
    } else {
        alert('Error: ' + data.error);
    }
});
```

### Step 3: Refresh
Refresh your browser page - you should now see all your historical data!

## 🔧 Alternative Method (Using Script)

If the above doesn't work, you can use the migration script:

### Step 1: Get Your User ID
1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/auth/users
2. Find your user (by email)
3. Copy the **User UID** (it's a long UUID string)

### Step 2: Run Migration Script
```bash
python3 migrate_data_to_user.py YOUR_USER_ID_HERE
```

Replace `YOUR_USER_ID_HERE` with the UUID you copied.

## 📊 What Gets Migrated

- ✅ All app ideas (without user_id)
- ✅ All projects (without user_id)
- ✅ All tasks (linked to migrated projects)
- ✅ All game plan steps (linked to migrated projects)
- ✅ All step data (linked to migrated steps)

## 🎯 Expected Result

After migration:
- ✅ Your dashboard shows all your historical data
- ✅ All new data you create is automatically linked to your account
- ✅ Other users won't see your data (and you won't see theirs)
- ✅ Your data is safely stored in Supabase cloud database

## ❓ Troubleshooting

**"Authentication required" error:**
- Make sure you're signed in first
- Try signing out and back in

**"No data to migrate":**
- Your data might already be migrated
- Or your data might still be in SQLite (not Supabase)
- Check if you ran `migrate_to_supabase.py` first

**Data still not showing:**
- Refresh the page after migration
- Check browser console for errors
- Verify you're signed in with the same account
