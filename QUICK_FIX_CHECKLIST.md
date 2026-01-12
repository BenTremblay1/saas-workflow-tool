# ✅ Quick Fix Checklist - Get Supabase Working

Follow these steps in order. Check each box as you complete it.

## Step 1: Check Supabase Project Status
- [ ] Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf
- [ ] Check if project says **"Active"** (not "Paused")
- [ ] If **Paused**: Click **"Restore"** button and wait 1-2 minutes
- [ ] Project should now say **"Active"**

## Step 2: Get Your Database Password
- [ ] Do you remember your Supabase database password?
  - [ ] **Yes** → Write it down, continue to Step 3
  - [ ] **No** → Go to Supabase → Settings → Database → Reset database password → Set new password → Write it down

## Step 3: Get Connection String
- [ ] Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
- [ ] Scroll to **"Connection string"** section
- [ ] Click **"URI"** tab (NOT "Connection pooling" - that causes errors!)
- [ ] Copy the entire connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres`)
- [ ] **Important**: Use the Direct Connection (port 5432), not Pooling (port 6543)

## Step 4: Update .env File
- [ ] Open: `/Users/bentremblay/Desktop/npi_expanded/.env`
- [ ] Find the line: `DATABASE_URL=...`
- [ ] Replace `[YOUR-PASSWORD]` with your actual password (no brackets!)
- [ ] Example: `DATABASE_URL=postgresql://postgres:MyPassword123@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres`
- [ ] **Note**: Use Direct Connection (port 5432), not Pooling (port 6543)
- [ ] Save the file

## Step 5: Test Connection
- [ ] Run: `python3 test_connection.py`
- [ ] Should see: `✅ Connection successful!`
- [ ] If error: Check the error message and fix (see troubleshooting below)

## Step 6: Start Server
- [ ] Stop any running server (Ctrl+C if running)
- [ ] Run: `python3 app.py`
- [ ] Should see: `Running on http://0.0.0.0:5001`
- [ ] No database errors in terminal

## Step 7: Check Connection Status
- [ ] Open browser: http://localhost:5001/api/database/status
- [ ] Should see: `"connection_ok": true`
- [ ] If false: Check error message

## Step 8: Create Database Tables
- [ ] Open browser: http://localhost:5001/migrate
- [ ] Should see: `"status": "success"`
- [ ] Tables are now created in Supabase

## Step 9: Test Google Sign-In
- [ ] Open: http://localhost:5001
- [ ] Click **"Sign in with Google"** (top right)
- [ ] Complete Google OAuth
- [ ] Should see your email in nav bar

## Step 10: Test Saving Data
- [ ] Click **"Idea Funnel"** tab
- [ ] Click **"Add New Idea"**
- [ ] Fill in name: "Test Connection"
- [ ] Click **"Save"**
- [ ] Idea should appear in list
- [ ] No errors in browser console (F12)

## Step 11: Verify in Supabase
- [ ] Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf
- [ ] Click **"Table Editor"** (left sidebar)
- [ ] Click **"app_idea"** table
- [ ] Should see your test idea!

## 🎉 Success!
If you see your idea in Supabase, everything is working!

---

## 🔧 Troubleshooting

### Connection test fails with "password" or "authentication"
- Check password is correct (no typos)
- Try resetting password in Supabase

### Connection test fails with "could not translate host name"
- Supabase project might be paused → Check Step 1
- Make sure you're using Direct Connection URL (port 5432), not Pooling

### Connection test fails with "password authentication failed"
- Check password is correct (no typos)
- Try resetting password in Supabase: Settings → Database → Reset database password
- Make sure you're using Direct Connection URL (URI tab), not Pooling

### Connection test fails with "pgbouncer" or "invalid connection option"
- Use Direct Connection URL (URI tab, port 5432) instead of Pooling
- The code now auto-fixes this, but Direct Connection is more reliable

### Google sign-in doesn't work
- See `FIX_GOOGLE_OAUTH.md`

### Ideas not saving
- Check you're signed in (email shows in nav)
- Check browser console (F12) for errors
- Check server terminal for errors

---

**Start with Step 1!** Let me know when you've checked if Supabase is active.
