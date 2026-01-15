# 🔧 Fix Vercel Serverless Function Crash

## ❌ Error
```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

## ✅ Solution: Update Handler Format

The Vercel Python runtime needs a specific handler format. I've updated `api/index.py` to fix this.

## Step 1: Check Vercel Logs

1. Go to your Vercel project dashboard
2. Click **"Deployments"** → Click on the failed deployment
3. Click **"Functions"** tab
4. Check the error logs to see the exact error

Common errors:
- **Import errors**: Missing dependencies
- **Database connection**: Wrong DATABASE_URL
- **Environment variables**: Missing variables

## Step 2: Verify Environment Variables

Make sure all these are set in Vercel:

1. **SUPABASE_URL**
2. **SUPABASE_KEY**
3. **SUPABASE_SERVICE_KEY**
4. **DATABASE_URL** (with correct password!)
5. **SECRET_KEY**

## Step 3: Check Requirements.txt

Make sure `requirements.txt` has all dependencies:

```
Flask==2.3.3
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.0.5
python-dotenv==1.0.0
psycopg2-binary==2.9.9
supabase==2.3.4
```

## Step 4: Alternative Handler Format

If the current handler doesn't work, try this in `api/index.py`:

```python
from app import app

# Simple handler for Vercel
handler = app
```

Or try WSGI format:

```python
from app import app

def handler(request):
    return app(request.environ, request.start_response)
```

## Step 5: Test Locally with Vercel CLI

Install Vercel CLI and test locally:

```bash
npm i -g vercel
vercel dev
```

This will simulate Vercel's environment locally.

## Step 6: Common Fixes

### Fix 1: Database Connection Error
- Verify DATABASE_URL is correct
- Make sure Supabase project is **Active** (not paused)
- Check password is correct

### Fix 2: Import Error
- Check `requirements.txt` has all packages
- Make sure `supabase_config.py` exists

### Fix 3: Missing Environment Variables
- Add all 5 environment variables in Vercel
- Make sure they're added for **all environments**

## Step 7: Redeploy

After fixing:
1. Push changes to GitHub (if you updated code)
2. Vercel will auto-deploy
3. Or manually trigger redeploy in Vercel dashboard

## 🔍 Debug Steps

1. **Check Vercel logs** - Most important!
2. **Verify environment variables** - All 5 must be set
3. **Check DATABASE_URL format** - Must be correct PostgreSQL URL
4. **Test locally** - Use `vercel dev` to test

---

**First step: Check the Vercel function logs to see the exact error!**
