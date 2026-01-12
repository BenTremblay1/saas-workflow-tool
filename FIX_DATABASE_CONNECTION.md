# Fix Database Connection Error

## ❌ Error You're Seeing

```
could not translate host name "db.gtxlwrrxejaotkjjlasf.supabase.co" to address
```

This means your computer **cannot reach the Supabase database server**. This could be:

1. **Network/DNS issue** - Can't resolve the hostname
2. **Wrong DATABASE_URL** - The hostname might be incorrect
3. **Supabase project paused** - Free tier projects pause after inactivity

## ✅ Quick Fixes

### Option 1: Check Supabase Project Status

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf
2. Check if the project is **active** (not paused)
3. If paused, click "Restore" to wake it up

### Option 2: Verify DATABASE_URL

Your DATABASE_URL should be:
```
postgresql://postgres:YOUR_PASSWORD@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
```

**Check:**
1. Go to Supabase: Settings → Database → Connection string
2. Select **"URI"** tab
3. Make sure it matches the format above
4. Verify the hostname is exactly: `db.gtxlwrrxejaotkjjlasf.supabase.co`

### Option 3: Use Connection Pooling (More Reliable)

Supabase offers connection pooling which is more reliable:

1. Go to Supabase: Settings → Database → Connection string
2. Select **"Connection pooling"** tab
3. Select **"Session"** mode
4. Copy that connection string
5. Update your `.env` file with it

The pooled connection uses a different hostname (like `aws-0-us-west-1.pooler.supabase.com`) which might work better.

### Option 4: Temporarily Use SQLite (For Testing)

If Supabase is unreachable, the app should fall back to SQLite. But if it's trying Supabase first and failing, you can:

**Temporarily remove DATABASE_URL from .env:**
```bash
# Comment out or remove this line in .env:
# DATABASE_URL=postgresql://...
```

Then restart the server - it will use SQLite locally.

## 🔍 Diagnostic Steps

### Test 1: Check Internet Connection
```bash
ping google.com
```

### Test 2: Try Resolving Supabase Hostname
```bash
nslookup db.gtxlwrrxejaotkjjlasf.supabase.co
```

### Test 3: Check Supabase Project
- Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf
- Is it **active** or **paused**?
- If paused, restore it

## 🎯 Recommended Solution

**Use Connection Pooling URL** - It's more reliable:

1. Supabase Dashboard → Settings → Database
2. Connection string → **Connection pooling** tab
3. Mode: **Session**
4. Copy the URI (it will have a different hostname)
5. Update `.env` with that URL
6. Restart server

## 📝 Current Status

- ✅ App is running
- ✅ Google Auth works
- ❌ Database connection failing (DNS/network issue)
- ⚠️ Data is trying to save to Supabase but can't connect

**Quick test**: Try removing `DATABASE_URL` from `.env` temporarily to use SQLite, then we can fix Supabase connection.
