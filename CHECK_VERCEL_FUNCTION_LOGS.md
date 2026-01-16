# 🔍 Check Vercel Function Logs - Find the Exact Error

## ✅ Build Completed Successfully

Your build logs show the deployment built fine. The error is happening **at runtime** when the function is invoked.

## Step 1: Check Function Logs (Most Important!)

1. Go to your **Vercel Dashboard**
2. Click on your project
3. Click **"Deployments"** tab
4. Click on the **latest deployment** (the one that's failing)
5. Click **"Functions"** tab
6. Click on **"api/index.py"** (or the function that's failing)
7. **Read the error logs** - this will show you the exact error!

The logs will show something like:
- `ModuleNotFoundError: No module named 'xyz'`
- `Database connection failed`
- `Environment variable not found`
- `Import error: ...`

## Step 2: Common Runtime Errors

### Error 1: Missing Environment Variables

**Look for:**
```
KeyError: 'SUPABASE_URL'
ValueError: Supabase credentials not found
```

**Fix:**
- Go to Vercel → Settings → Environment Variables
- Add all 5 variables for **all environments**

### Error 2: Database Connection Error

**Look for:**
```
psycopg2.OperationalError
could not translate host name
password authentication failed
```

**Fix:**
- Check `DATABASE_URL` is correct
- Verify password is correct (no typos)
- Make sure Supabase project is **Active**

### Error 3: Import Error

**Look for:**
```
ModuleNotFoundError: No module named 'supabase'
ImportError: cannot import name 'app'
```

**Fix:**
- Check `requirements.txt` has all packages
- Make sure `supabase_config.py` exists

## Step 3: Add Debug Endpoint

I'll add a simple test endpoint to help debug. Check the function logs first, then we can add debugging if needed.

## Step 4: Verify Environment Variables

**Double-check in Vercel:**
1. Settings → Environment Variables
2. Make sure these are set:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_KEY`
   - ✅ `SUPABASE_SERVICE_KEY`
   - ✅ `DATABASE_URL` (with password!)
   - ✅ `SECRET_KEY`
3. Make sure they're added for **Production, Preview, AND Development**

## Step 5: Test Simple Endpoint

Try visiting:
- `https://your-app.vercel.app/test`

This should return: `{"status": "ok", "message": "Flask is working!"}`

If this works, Flask is running. If it fails, check the function logs.

---

**First step: Check the Function logs in Vercel dashboard to see the exact error message!**
