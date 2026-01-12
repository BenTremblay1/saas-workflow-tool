# ✅ Use Session Pooler Connection (IPv4 Compatible)

## 🎯 Why Session Pooler?

For free-tier Supabase projects, **Session pooler** is recommended because:
- ✅ **IPv4 compatible** (green checkmark)
- ✅ Works with free tier
- ✅ Uses standard port 5432
- ✅ Better connection management

## Step 1: Get Session Pooler Connection String

From your Supabase dashboard:

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
2. Click **"Connection String"** tab
3. Set:
   - **Type**: URI
   - **Source**: Primary Database
   - **Method**: Session pooler
4. Copy the connection string - it should look like:
   ```
   postgresql://postgres.gtxlwrrxejaotkjjlasf:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
   ```

## Step 2: Update Your .env File

1. Open: `/Users/bentremblay/Desktop/npi_expanded/.env`
2. Find the `DATABASE_URL` line
3. Replace it with the Session pooler connection string
4. **Important**: Replace `[YOUR-PASSWORD]` with your actual database password
5. Save the file

**Example:**
```bash
DATABASE_URL=postgresql://postgres.gtxlwrrxejaotkjjlasf:YourActualPassword@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**Key points:**
- Username includes project ref: `postgres.gtxlwrrxejaotkjjlasf`
- Hostname is pooler: `aws-1-us-east-2.pooler.supabase.com`
- Port is 5432 (standard PostgreSQL)
- No query parameters needed

## Step 3: Make Sure Project is Active

**Before testing**, make sure your Supabase project is **Active** (not paused):

1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf
2. Check if it says **"Active"** at the top
3. If **"Paused"**: Click **"Restore"** and wait 1-2 minutes

## Step 4: Test Connection

```bash
python3 test_connection.py
```

Should show: `✅ Connection successful!`

## Step 5: Start Server

```bash
python3 app.py
```

## ✅ Why This Works

- **Port 5432**: Standard PostgreSQL port (works with psycopg2)
- **IPv4 Compatible**: Works on free tier
- **No query parameters**: Clean connection string
- **Pooler hostname**: Better connection management

The code already handles this format correctly!

---

**Update your `.env` with the Session pooler connection string (replacing [YOUR-PASSWORD] with your actual password), then test!**
