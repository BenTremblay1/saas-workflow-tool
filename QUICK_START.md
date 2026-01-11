# Quick Start: Supabase Integration

## ✅ What's Been Set Up

1. **Supabase Configuration** - Added `supabase_config.py` for easy Supabase connection
2. **Database Models Updated** - Added `user_id` fields to `AppIdea` and `Project` models
3. **Authentication Endpoints** - Added `/api/auth/user` and `/api/auth/config` endpoints
4. **Frontend Auth UI** - Added "Sign in with Google" button in navigation
5. **Data Filtering** - All API endpoints now filter data by user when authenticated
6. **Migration Script** - Created `migrate_to_supabase.py` to sync your SQLite data to Supabase

## 🚀 Quick Setup (5 minutes)

### 1. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to **Settings** → **API**
3. Copy:
   - Project URL
   - anon/public key
   - service_role key (keep secret!)
4. Go to **Settings** → **Database** → **Connection string**
5. Copy the URI connection string

### 2. Create `.env` File

Create a `.env` file in your project root:

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
SECRET_KEY=any-random-string-here
```

### 3. Enable Google OAuth

1. In Supabase: **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Add your Google OAuth credentials (see SUPABASE_SETUP.md for details)

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Migrate Your Data (Optional)

If you have existing data:

```bash
python migrate_to_supabase.py
```

### 6. Run the App

```bash
python app.py
```

Visit `http://localhost:5001` and click "Sign in with Google"!

## 📝 How It Works

- **Without Sign In**: App works normally, shows legacy data (items without user_id)
- **With Sign In**: App filters all data by your user_id, so you only see your own data
- **Data Isolation**: Each user has their own isolated workspace
- **Cloud Database**: All data is stored in Supabase PostgreSQL (accessible from anywhere)

## 🔧 Troubleshooting

**"Supabase not configured"**
- Check your `.env` file has `SUPABASE_URL` and `SUPABASE_KEY`
- Restart Flask after adding environment variables

**"Authentication required" errors**
- Make sure you're signed in (check top right corner)
- Try signing out and back in

**Google sign-in not working**
- Verify Google OAuth is enabled in Supabase
- Check redirect URI matches: `https://your-project.supabase.co/auth/v1/callback`

## 📚 More Details

See `SUPABASE_SETUP.md` for detailed setup instructions.
