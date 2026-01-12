# Quick Fix: Database Connection Issue

## ❌ Problem

Your app can't connect to Supabase database:
```
could not translate host name "db.gtxlwrrxejaotkjjlasf.supabase.co"
```

## 🔍 Check These First

### 1. Is Your Supabase Project Active?

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf
2. Check if it says **"Active"** or **"Paused"**
3. **If paused**: Click "Restore" to wake it up (free tier projects pause after inactivity)

### 2. Check Database Connection String

The hostname might be wrong. Try using **Connection Pooling** instead:

1. Go to Supabase: **Settings → Database → Connection string**
2. Click **"Connection pooling"** tab
3. Select **"Session"** mode
4. Copy the **URI** (it will have a different hostname like `aws-0-us-west-1.pooler.supabase.com`)
5. Update your `.env` file with that URL

### 3. Test Connection

After updating, restart your server and test:
```bash
# Restart server
python3 app.py

# In browser, go to:
http://localhost:5001/api/database/status
```

## 🎯 Quick Solution: Use Connection Pooling URL

**This is usually more reliable:**

1. Supabase Dashboard → Settings → Database
2. **Connection string** → **Connection pooling** tab
3. Mode: **Session**
4. Copy the URI (looks like):
   ```
   postgresql://postgres.gtxlwrrxejaotkjjlasf:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
5. Update `.env`:
   ```bash
   DATABASE_URL=postgresql://postgres.gtxlwrrxejaotkjjlasf:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
6. Restart server

## 📊 Current Status

- ✅ App is running
- ✅ Google Auth works  
- ❌ Can't connect to Supabase database
- ⚠️ Data saves are failing

**The app is configured to use Supabase, but can't reach it right now.**

## 🔄 Temporary Workaround

If you need to test immediately, you can temporarily use SQLite:

1. **Comment out** `DATABASE_URL` in `.env`:
   ```bash
   # DATABASE_URL=postgresql://...
   ```

2. **Restart server** - it will use SQLite

3. **Later**, fix Supabase connection and migrate data

## ✅ After Fixing

Once Supabase connection works:
1. Your data will save to Supabase
2. You can migrate your old SQLite data
3. Everything will be in the cloud
