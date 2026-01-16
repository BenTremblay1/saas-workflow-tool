# 🐛 Quick Debug Vercel Error

## Step 1: Check Function Logs

**This is the most important step!**

1. Vercel Dashboard → Your Project
2. **Deployments** → Latest deployment
3. **Functions** tab → Click on `api/index.py`
4. **Read the error message** - copy it here!

## Step 2: Test Simple Endpoints

Try these URLs on your live site:

1. **Basic test:**
   ```
   https://your-app.vercel.app/test
   ```
   Should return: `{"status": "ok", "message": "Flask is working!"}`

2. **Environment check:**
   ```
   https://your-app.vercel.app/api/test-env
   ```
   Should show which environment variables are set

## Step 3: Most Common Issues

### Issue 1: Missing Environment Variables (90% of cases)

**Check in Vercel:**
- Settings → Environment Variables
- All 5 variables must be set:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `DATABASE_URL` (with password!)
  - `SECRET_KEY`

**Important:** Add for **all environments** (Production, Preview, Development)

### Issue 2: Wrong DATABASE_URL Password

- Check password is correct (no typos)
- Make sure no `[YOUR-PASSWORD]` placeholder
- Format: `postgresql://postgres.gtxlwrrxejaotkjjlasf:Password@host:port/db`

### Issue 3: Supabase Project Paused

- Go to Supabase dashboard
- Check if project is **Active** (not paused)
- If paused, click **"Restore"**

## Step 4: Share the Error

Once you check the function logs, share:
1. The exact error message from function logs
2. What `/test` endpoint returns
3. What `/api/test-env` endpoint returns

This will help me pinpoint the exact issue!

---

**Start with Step 1 - check the function logs in Vercel dashboard!**
