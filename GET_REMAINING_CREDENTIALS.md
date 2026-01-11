# Get Your Remaining Supabase Credentials

You've provided:
- ✅ Project URL: `https://gtxlwrrxejaotkjjlasf.supabase.co`
- ✅ Publishable/Anon Key: `sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4`

## Still Need:

### 1. Service Role Key (for backend operations)

1. Go to your Supabase dashboard: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf
2. Click **Settings** (gear icon) → **API**
3. Find the **service_role** key (it's different from the anon key)
4. Copy it and update your `.env` file:
   ```
   SUPABASE_SERVICE_KEY=paste-service-role-key-here
   ```

⚠️ **Important**: The service_role key has admin privileges. Keep it secret and never expose it in frontend code!

### 2. Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Select **URI** format
4. Copy the connection string (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the database password you set when creating the project
6. Update your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:your-actual-password@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
   ```

**Don't remember your database password?**
- You can reset it in Supabase: Settings → Database → Reset database password
- Or check your project creation email

### 3. Enable Google OAuth (for sign-in)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Click to enable it
4. You'll need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project (or use existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://gtxlwrrxejaotkjjlasf.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
   - Paste into Supabase Google provider settings

## Quick Checklist

- [ ] Service role key added to `.env`
- [ ] Database connection string added to `.env` (with actual password)
- [ ] Google OAuth enabled in Supabase
- [ ] Google OAuth credentials configured

Once you have all three, restart your Flask app and test the sign-in!
