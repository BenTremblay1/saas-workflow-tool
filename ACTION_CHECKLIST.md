# ✅ Action Checklist: Connect to Supabase

## Current Status
- ✅ Supabase project created: `gtxlwrrxejaotkjjlasf`
- ✅ Project URL saved: `https://gtxlwrrxejaotkjjlasf.supabase.co`
- ✅ Publishable key saved: `sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4`
- ⏳ Still need: Service role key, Database URL, Google OAuth setup

## 📋 What You Need to Do

### Step 1: Create `.env` File (2 minutes)

Create a file named `.env` in your project root with:

```bash
SUPABASE_URL=https://gtxlwrrxejaotkjjlasf.supabase.co
SUPABASE_KEY=sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4
SUPABASE_SERVICE_KEY=GET_THIS_FROM_SUPABASE
DATABASE_URL=GET_THIS_FROM_SUPABASE
SECRET_KEY=any-random-string-here
```

### Step 2: Get Service Role Key (1 minute)

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/api
2. Find the **`service_role`** key (scroll down, it's separate from the anon key)
3. Copy it and paste into `.env` file as `SUPABASE_SERVICE_KEY`

### Step 3: Get Database Connection String (2 minutes)

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
2. Scroll to **"Connection string"** section
3. Select **"URI"** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Paste into `.env` file as `DATABASE_URL`

**Don't remember password?** Reset it in the same database settings page.

### Step 4: Enable Google OAuth (5-10 minutes)

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/auth/providers
2. Click **"Google"** provider
3. Toggle it **ON**
4. You'll need Google Cloud Console credentials:
   - Go to https://console.cloud.google.com/
   - Create a project (or use existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://gtxlwrrxejaotkjjlasf.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

### Step 5: Install Dependencies (if not done)

```bash
pip install -r requirements.txt
```

### Step 6: (Optional) Migrate Existing Data

If you have data in your SQLite database:

```bash
python migrate_to_supabase.py
```

### Step 7: Restart the App

```bash
python app.py
```

Then visit http://localhost:5001 and you should see a "Sign in with Google" button!

## 🎯 Quick Priority

**Minimum to get it working:**
1. ✅ Create `.env` file
2. ✅ Add service role key
3. ✅ Add database URL

**For full sign-in functionality:**
4. ✅ Enable Google OAuth

## ❓ Need Help?

- See `GET_REMAINING_CREDENTIALS.md` for detailed instructions
- See `SUPABASE_SETUP.md` for comprehensive guide
- See `SUPABASE_BENEFITS.md` for why you're doing this
