# 🔑 Fix Password Authentication - One Time Setup

## ✅ Good News
Your connection is **reaching Supabase** (project is active!), but the password is wrong.

## 🎯 Simple Fix: Reset Password & Update .env

### Step 1: Reset Database Password in Supabase

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
2. Scroll down to **"Database password"** section
3. Click **"Reset database password"** button
4. **Set a simple password** (write it down!):
   - Example: `MyPassword123!`
   - Or use a password manager to generate one
5. Click **"Save"** or **"Update"**

### Step 2: Get Fresh Connection String

1. Still on the same page (Settings → Database)
2. Scroll to **"Connection string"** section
3. Click **"Connection String"** tab
4. Set:
   - **Type**: URI
   - **Source**: Primary Database  
   - **Method**: Session pooler
5. Copy the connection string
6. **Replace `[YOUR-PASSWORD]` with the NEW password you just set**

### Step 3: Update .env File

1. Open: `/Users/bentremblay/Desktop/npi_expanded/.env`
2. Find `DATABASE_URL=`
3. Replace the entire line with:
   ```bash
   DATABASE_URL=postgresql://postgres.gtxlwrrxejaotkjjlasf:YOUR_NEW_PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres
   ```
4. Replace `YOUR_NEW_PASSWORD` with the password from Step 1
5. **Save the file**

### Step 4: Test

```bash
python3 test_connection.py
```

Should show: `✅ Connection successful!`

## 🎉 Done!

Once the connection test passes, you're ready to:
1. Start server: `python3 app.py`
2. Sign in with Google
3. Save ideas to Supabase

---

**This is a one-time setup. After this, everything should work!**
