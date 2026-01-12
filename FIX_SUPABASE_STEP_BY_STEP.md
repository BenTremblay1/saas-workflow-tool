# Fix Supabase Connection - Step by Step

## 🎯 Goal
Get Supabase database connection working so you can:
- ✅ Sign in with Google
- ✅ Save ideas to Supabase
- ✅ See your data persist

## Step 1: Check Supabase Project Status

### 1.1 Go to Your Supabase Dashboard
Open: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf

### 1.2 Check Project Status
- Look at the top of the page
- Does it say **"Active"** or **"Paused"**?

**If PAUSED:**
- Click the **"Restore"** button
- Wait 1-2 minutes for it to wake up
- This is the #1 cause of connection issues!

**If ACTIVE:**
- Continue to Step 2

## Step 2: Get the Correct Database Connection String

### 2.1 Navigate to Database Settings
1. In Supabase dashboard, click **"Settings"** (gear icon, bottom left)
2. Click **"Database"** in the left sidebar
3. Scroll down to **"Connection string"** section

### 2.2 Get Connection Pooling URL (Recommended)
1. Click the **"Connection pooling"** tab
2. Select **"Session"** mode (not Transaction)
3. You'll see a URI that looks like:
   ```
   postgresql://postgres.gtxlwrrxejaotkjjlasf:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
4. **Copy this entire string**

### 2.3 Alternative: Direct Connection
If pooling doesn't work, try the direct connection:
1. Click **"URI"** tab (not Connection pooling)
2. Copy the connection string
3. It should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
   ```

## Step 3: Update Your .env File

### 3.1 Open .env File
Open: `/Users/bentremblay/Desktop/npi_expanded/.env`

### 3.2 Update DATABASE_URL
Replace the `DATABASE_URL` line with the connection string you copied.

**Important:**
- Replace `[YOUR-PASSWORD]` with your actual database password
- Make sure it starts with `postgresql://` (not `https://`)
- No extra spaces or quotes

**Example:**
```bash
DATABASE_URL=postgresql://postgres.gtxlwrrxejaotkjjlasf:your-actual-password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### 3.3 Verify All Variables
Your `.env` should have:
```bash
SUPABASE_URL=https://gtxlwrrxejaotkjjlasf.supabase.co
SUPABASE_KEY=sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4
SUPABASE_SERVICE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@host:port/postgres
SECRET_KEY=any-random-string
```

## Step 4: Test Database Connection

### 4.1 Restart Your Server
```bash
# Stop current server (Ctrl+C if running)
# Then start fresh:
cd /Users/bentremblay/Desktop/npi_expanded
python3 app.py
```

### 4.2 Check Connection Status
Open in browser: http://localhost:5001/api/database/status

You should see:
```json
{
  "database_type": "Supabase (PostgreSQL)",
  "connection_ok": true,
  "using_supabase": true
}
```

**If `connection_ok: false`:**
- Check the error message
- Verify DATABASE_URL format
- Make sure Supabase project is active

## Step 5: Initialize Database Tables

### 5.1 Create Tables in Supabase
Visit: http://localhost:5001/migrate

Or run in terminal:
```bash
python3 -c "from app import app, db; app.app_context().push(); db.create_all(); print('✅ Tables created!')"
```

You should see: `{"status": "success", "message": "Database tables created successfully"}`

## Step 6: Test Google Sign-In

### 6.1 Open Your App
Go to: http://localhost:5001

### 6.2 Sign In
1. Click **"Sign in with Google"** (top right)
2. Complete Google OAuth flow
3. You should see your email in the nav bar

**If sign-in doesn't work:**
- Check browser console (F12) for errors
- Verify Google OAuth is enabled in Supabase
- See `FIX_GOOGLE_OAUTH.md` for details

## Step 7: Test Saving Data

### 7.1 Create a Test Idea
1. Click **"Idea Funnel"** tab
2. Click **"Add New Idea"**
3. Fill in:
   - Name: "Test Idea"
   - Any other fields
4. Click **"Save"**

### 7.2 Verify It Saved
- The idea should appear in your list
- Check browser console (F12) - no errors
- Check server terminal - no errors

### 7.3 Verify in Supabase
1. Go to Supabase dashboard
2. Click **"Table Editor"** (left sidebar)
3. Find **"app_idea"** table
4. You should see your test idea!

## ✅ Success Checklist

- [ ] Supabase project is **Active** (not paused)
- [ ] DATABASE_URL is correct format (starts with `postgresql://`)
- [ ] `/api/database/status` shows `connection_ok: true`
- [ ] Database tables created (`/migrate` endpoint works)
- [ ] Google sign-in works
- [ ] Can save ideas successfully
- [ ] Data appears in Supabase Table Editor

## 🔧 Troubleshooting

### "could not translate host name"
- **Fix**: Use Connection Pooling URL instead of direct connection
- Or check if Supabase project is paused

### "Authentication failed"
- **Fix**: Check DATABASE_URL password is correct
- Reset password in Supabase if needed

### "relation does not exist"
- **Fix**: Run `/migrate` endpoint to create tables

### Google sign-in not working
- **Fix**: See `FIX_GOOGLE_OAUTH.md`

## 🎯 Next Steps After Fixing

Once connection works:
1. **Migrate your old data** (see `MIGRATE_YOUR_DATA.md`)
2. **Test saving ideas** - should work now!
3. **Verify data in Supabase** - check Table Editor

Let's start with Step 1 - check if your Supabase project is active!
