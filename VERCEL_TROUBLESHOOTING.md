# 🔧 Vercel Troubleshooting Guide

## ❌ Common Error: FUNCTION_INVOCATION_FAILED

This usually means one of these issues:

### 1. Missing Environment Variables ⚠️ MOST COMMON

**Check in Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. Make sure ALL 5 variables are set:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_KEY`
   - ✅ `SUPABASE_SERVICE_KEY`
   - ✅ `DATABASE_URL` (with correct password!)
   - ✅ `SECRET_KEY`

**Important:**
- Add for **all environments** (Production, Preview, Development)
- Double-check `DATABASE_URL` password is correct
- No quotes around values

### 2. Database Connection Error

**Symptoms:**
- Error mentions "database" or "connection"
- Error mentions "psycopg2"

**Fix:**
1. Verify `DATABASE_URL` format:
   ```
   postgresql://postgres.gtxlwrrxejaotkjjlasf:Password@aws-1-us-east-2.pooler.supabase.com:5432/postgres
   ```
2. Make sure Supabase project is **Active** (not paused)
3. Check password is correct (no typos)

### 3. Import Errors

**Symptoms:**
- Error mentions "ModuleNotFoundError"
- Error mentions "No module named"

**Fix:**
1. Check `requirements.txt` has all packages:
   ```
   Flask==2.3.3
   Flask-CORS==4.0.0
   Flask-SQLAlchemy==3.0.5
   python-dotenv==1.0.0
   psycopg2-binary==2.9.9
   supabase==2.3.4
   ```
2. Make sure `supabase_config.py` exists in your repo

### 4. Handler Format Error

**Symptoms:**
- Error mentions "handler" or "WSGI"

**Fix:**
- The handler in `api/index.py` should be: `handler = app`
- This is already set correctly

## 🔍 How to Debug

### Step 1: Check Vercel Logs

1. Go to Vercel dashboard
2. Click **"Deployments"**
3. Click on the failed deployment
4. Click **"Functions"** tab
5. Click on the function that failed
6. **Read the error message** - this tells you exactly what's wrong!

### Step 2: Check Build Logs

1. In the deployment page, click **"Build Logs"**
2. Look for errors during build
3. Common issues:
   - Missing dependencies
   - Import errors
   - Syntax errors

### Step 3: Test Environment Variables

Create a test endpoint to check variables:

```python
@app.route('/api/test-env')
def test_env():
    return jsonify({
        'has_supabase_url': bool(os.environ.get('SUPABASE_URL')),
        'has_database_url': bool(os.environ.get('DATABASE_URL')),
        'vercel_env': os.environ.get('VERCEL')
    })
```

## ✅ Quick Fixes

### Fix 1: Redeploy After Adding Variables

After adding environment variables:
1. Go to **Deployments**
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger redeploy

### Fix 2: Verify DATABASE_URL

The most common issue is wrong `DATABASE_URL`:

1. Get fresh connection string from Supabase
2. Make sure password is correct
3. No `[YOUR-PASSWORD]` placeholder
4. Format: `postgresql://postgres.gtxlwrrxejaotkjjlasf:Password@host:port/db`

### Fix 3: Initialize Database

After successful deployment:
1. Visit: `https://your-app.vercel.app/migrate`
2. Should see: `{"status": "success"}`
3. This creates the database tables

## 🎯 Step-by-Step Debug Process

1. **Check Vercel function logs** ← Start here!
2. **Verify all 5 environment variables are set**
3. **Check DATABASE_URL format and password**
4. **Verify requirements.txt has all packages**
5. **Redeploy after fixing issues**
6. **Initialize database** (`/migrate` endpoint)

## 📋 Checklist

- [ ] All 5 environment variables set in Vercel
- [ ] DATABASE_URL has correct password (no placeholder)
- [ ] Supabase project is Active (not paused)
- [ ] requirements.txt has all packages
- [ ] Checked Vercel function logs for exact error
- [ ] Redeployed after fixing issues
- [ ] Initialized database (`/migrate`)

---

**First step: Check the Vercel function logs to see the exact error message!**
