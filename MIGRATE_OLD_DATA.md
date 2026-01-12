# 🔄 Migrate Your Old Data to Supabase

## ✅ Safe Migration Process

This migration will:
- ✅ Find all your old ideas and projects (from SQLite)
- ✅ Assign them to your current Supabase user
- ✅ **Not delete anything** - just adds user_id
- ✅ **Won't break anything** - your site keeps working

## Step 1: Get Your User ID

### Option A: From Supabase Dashboard (Easiest)

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/auth/users
2. Find your user (by email)
3. Copy the **User UID** (looks like: `8fdad002-7916-4f7b-bb1c-fda9216e68bd`)

### Option B: From Browser Console

1. Sign in to your app at http://localhost:5001
2. Open browser console (F12)
3. Run:
   ```javascript
   JSON.parse(localStorage.getItem('sb-gtxlwrrxejaotkjjlasf-auth-token')).user.id
   ```
4. Copy the ID that appears

## Step 2: Run Migration Script

1. Make sure your server is running (or stop it temporarily)
2. Run the migration:
   ```bash
   python3 migrate_data_to_user.py 8fdad002-7916-4f7b-bb1c-fda9216e68bd
   ```
   
   Replace `YOUR_USER_ID` with the ID from Step 1

**Example:**
```bash
python3 migrate_data_to_user.py 8fdad002-7916-4f7b-bb1c-fda9216e68bd
```

## Step 3: Verify Migration

The script will show:
- ✅ How many ideas were migrated
- ✅ How many projects were migrated
- ✅ How many tasks/steps are now accessible

## Step 4: Refresh Your App

1. Go to: http://localhost:5001
2. Refresh the page (F5)
3. You should now see all your old ideas and projects!

## 🔒 Safety Guarantees

- ✅ **Read-only operation** - Only adds user_id, doesn't delete anything
- ✅ **Rollback safe** - If something goes wrong, data is still in SQLite
- ✅ **Non-destructive** - Your existing Supabase data is untouched
- ✅ **Idempotent** - Can run multiple times safely (only migrates data without user_id)

## 📊 What Gets Migrated

- ✅ **App Ideas** - All ideas without user_id
- ✅ **Projects** - All projects without user_id
- ✅ **Tasks** - Automatically accessible through migrated projects
- ✅ **Game Plan Steps** - Automatically accessible through migrated projects
- ✅ **Step Data** - Automatically accessible through migrated steps

## ⚠️ If Something Goes Wrong

The script uses database transactions, so if it fails:
- Nothing is changed (rollback happens automatically)
- Your data is safe
- Check the error message and try again

## 🎯 After Migration

Once migration is complete:
1. All your old data will appear in your app
2. New data you create will also be associated with your user
3. Everything is now in Supabase (not SQLite)

---

**Ready to migrate? Get your User ID and run the script!**
