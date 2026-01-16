# 🔧 Most Likely Fix: Environment Variables

Based on the build completing successfully, the issue is almost certainly **missing environment variables**.

## ✅ Quick Fix: Add Environment Variables

### Step 1: Go to Vercel Settings

1. Vercel Dashboard → Your Project
2. Click **"Settings"** (gear icon)
3. Click **"Environment Variables"** (left sidebar)

### Step 2: Add These 5 Variables

Add each one for **all environments** (Production, Preview, Development):

#### 1. SUPABASE_URL
```
https://gtxlwrrxejaotkjjlasf.supabase.co
```

#### 2. SUPABASE_KEY
```
sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4
```

#### 3. SUPABASE_SERVICE_KEY
- Get from: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/api
- Copy the **"service_role"** key (starts with `eyJ...`)

#### 4. DATABASE_URL
- Get from: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/settings/database
- Click **"Connection String"** tab
- Set: Type=URI, Source=Primary Database, Method=Session pooler
- Copy the connection string
- **Replace `[YOUR-PASSWORD]` with your actual password**

Should look like:
```
postgresql://postgres.gtxlwrrxejaotkjjlasf:YourPassword@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

#### 5. SECRET_KEY
Any random string:
```
your-secret-key-change-in-production-12345
```

### Step 3: Important Settings

For each variable:
- ✅ Check **Production**
- ✅ Check **Preview**  
- ✅ Check **Development**
- Click **"Save"**

### Step 4: Redeploy

After adding variables:
1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger redeploy

## ✅ Test After Redeploy

1. Visit: `https://your-app.vercel.app/test`
2. Should return: `{"status": "ok", "message": "Flask is working!"}`

If this works, your environment variables are set correctly!

---

**This fixes 90% of Vercel deployment errors. Add the environment variables and redeploy!**
