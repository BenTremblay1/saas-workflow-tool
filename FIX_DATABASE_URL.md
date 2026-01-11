# 🔧 Fix Your DATABASE_URL

## ❌ Problem
Your `DATABASE_URL` in `.env` starts with `https://` which is wrong. That's your Supabase project URL, not the database connection string.

## ✅ Solution

### Step 1: Get the Correct Database URL

1. Go to your Supabase dashboard: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf
2. Click **Settings** (gear icon) → **Database**
3. Scroll down to **"Connection string"** section
4. Select the **"URI"** tab (not "Session mode" or "Transaction mode")
5. You should see something like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
   ```

### Step 2: Update Your .env File

Open your `.env` file and replace the `DATABASE_URL` line with the correct connection string.

**Current (WRONG):**
```bash
DATABASE_URL=https://gtxlwrrxejaotkjjlasf.supabase.co/...
```

**Should be (CORRECT):**
```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
```

**Important:** Replace `YOUR_PASSWORD` with your actual database password (the one you set when creating the Supabase project).

### Step 3: Don't Forget the Password

If you don't remember your database password:
1. Go to Supabase: Settings → Database
2. Click **"Reset database password"**
3. Set a new password
4. Update your `.env` file with the new password

### Step 4: Restart Server

After fixing the `.env` file:
```bash
python3 app.py
```

## 📝 Your .env Should Look Like:

```bash
SUPABASE_URL=https://gtxlwrrxejaotkjjlasf.supabase.co
SUPABASE_KEY=sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4
SUPABASE_SERVICE_KEY=your-service-role-key-here
DATABASE_URL=postgresql://postgres:your-actual-password@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
SECRET_KEY=any-random-string
```

## 🎯 Quick Checklist

- [ ] DATABASE_URL starts with `postgresql://` (not `https://`)
- [ ] DATABASE_URL includes your actual password
- [ ] DATABASE_URL includes `@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres`
- [ ] Restart server after updating `.env`
