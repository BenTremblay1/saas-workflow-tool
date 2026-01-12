# ✅ Use Direct Connection URL (Easier Fix)

## 🎯 Quick Solution

The **Connection Pooling** URL is causing issues. Use the **Direct Connection** URL instead - it's simpler and more reliable.

## Step 1: Get Direct Connection URL

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
2. Scroll to **"Connection string"** section
3. Click **"URI"** tab (NOT "Connection pooling")
4. Copy the connection string - it should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
   ```
5. **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

## Step 2: Update .env File

1. Open: `/Users/bentremblay/Desktop/npi_expanded/.env`
2. Find `DATABASE_URL=`
3. Replace with the Direct Connection URL (from Step 1)
4. Make sure password is correct (no brackets)
5. Save file

**Example:**
```bash
DATABASE_URL=postgresql://postgres:YourActualPassword@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
```

## Step 3: Test

```bash
python3 test_connection.py
```

Should show: `✅ Connection successful!`

## Step 4: Start Server

```bash
python3 app.py
```

## 🔍 Key Differences

| Connection Type | Port | Username Format | Best For |
|----------------|------|----------------|----------|
| **Direct** ✅ | 5432 | `postgres` | Development, single user |
| Pooling | 6543 | `postgres.gtxlwrrxejaotkjjlasf` | Production, many users |

**For your use case, Direct Connection is perfect!**

## 🔑 If You Don't Know Your Password

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
2. Scroll to **"Database password"** section
3. Click **"Reset database password"**
4. Set a new password (write it down!)
5. Update your `.env` file with the new password

---

**Try the Direct Connection URL - it should work immediately!**
