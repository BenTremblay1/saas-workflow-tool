# Fix: "invalid connection option 'pgbouncer'" Error

## ❌ Problem
You're getting this error:
```
invalid connection option "pgbouncer"
```

This happens because Supabase's **Connection Pooling** URL includes query parameters (`?pgbouncer=true`) that `psycopg2` doesn't understand.

## ✅ Solution: Use Direct Connection URL

Instead of the Connection Pooling URL, use the **Direct Connection** URL.

### Step 1: Get Direct Connection URL

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
2. Scroll to **"Connection string"** section
3. Click **"URI"** tab (NOT "Connection pooling")
4. You'll see a URL like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
   ```
5. **Copy this entire string**

**Key difference:**
- ❌ Pooling URL: Port `6543` (causes pgbouncer error)
- ✅ Direct URL: Port `5432` (works perfectly)

### Step 2: Update Your .env File

1. Open: `/Users/bentremblay/Desktop/npi_expanded/.env`
2. Find the `DATABASE_URL` line
3. Replace it with the Direct Connection URL (from Step 1)
4. Make sure to replace `[YOUR-PASSWORD]` with your actual password
5. Save the file

**Example:**
```bash
DATABASE_URL=postgresql://postgres:YourActualPassword@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
```

### Step 3: Test Connection

```bash
python3 test_connection.py
```

Should now show: `✅ Connection successful!`

### Step 4: Start Server

```bash
python3 app.py
```

## 🔧 Alternative: Code Fix (Already Applied)

I've also updated the code to automatically strip query parameters, so if you want to keep using the pooling URL, it should work now. But the **Direct Connection URL is more reliable**.

## 📊 Connection Pooling vs Direct Connection

| Feature | Pooling (Port 6543) | Direct (Port 5432) |
|---------|---------------------|-------------------|
| **Connection limit** | Higher (better for many users) | Lower (fine for single user) |
| **Compatibility** | Can have issues with psycopg2 | Works perfectly |
| **Best for** | Production (many users) | Development/testing |
| **Your use case** | ✅ Direct connection is better |

## ✅ Quick Fix

**Just use the Direct Connection URL (port 5432) instead of Pooling (port 6543).**

The code will now also automatically strip query parameters, so either should work, but Direct is more reliable.
