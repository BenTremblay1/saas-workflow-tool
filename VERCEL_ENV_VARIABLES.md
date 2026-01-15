# 🔑 Vercel Environment Variables - Quick Reference

Copy these values from your `.env` file to Vercel:

## Required Environment Variables

### 1. SUPABASE_URL
```
https://gtxlwrrxejaotkjjlasf.supabase.co
```

### 2. SUPABASE_KEY
```
sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4
```

### 3. SUPABASE_SERVICE_KEY
**Get from Supabase:**
1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/api
2. Find **"service_role"** key (under "Project API keys")
3. Copy the entire key (starts with `eyJ...`)

### 4. DATABASE_URL
**Get from Supabase:**
1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
2. Click **"Connection String"** tab
3. Set:
   - **Type**: URI
   - **Source**: Primary Database
   - **Method**: Session pooler
4. Copy the connection string
5. **Replace `[YOUR-PASSWORD]` with your actual password**

Should look like:
```
postgresql://postgres.gtxlwrrxejaotkjjlasf:YourPassword@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

### 5. SECRET_KEY
Any random string (for Flask sessions):
```
your-secret-key-change-in-production-12345
```

## How to Add in Vercel

1. Go to your project in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. For each variable:
   - Enter the **Name** (e.g., `SUPABASE_URL`)
   - Enter the **Value** (copy from above)
   - Select **all environments** (Production, Preview, Development)
   - Click **"Save"**

## ⚠️ Important Notes

- **DATABASE_URL password**: Make sure you use your actual password (not `[YOUR-PASSWORD]`)
- **All environments**: Add variables for Production, Preview, AND Development
- **No quotes**: Don't add quotes around the values
- **Case sensitive**: Variable names are case-sensitive

---

**Copy these values to Vercel before deploying!**
