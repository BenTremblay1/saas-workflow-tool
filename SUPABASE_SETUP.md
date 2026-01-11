# Supabase Setup Guide

This guide will help you set up Supabase authentication and database sync for your SaaS Workflow Tool.

## Step 1: Create a Supabase Account and Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: Your project name (e.g., "saas-workflow")
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to you
4. Click "Create new project" (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is created:

1. Go to **Settings** → **API** in your Supabase dashboard
2. You'll find:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`
   - **service_role key**: Another long string (keep this secret!)

3. Go to **Settings** → **Database** → **Connection string**
   - Select **URI** format
   - Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
   - Replace `[YOUR-PASSWORD]` with the database password you set in Step 1

## Step 3: Enable Google OAuth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to enable it
3. You'll need to:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or use existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**
4. Paste these into Supabase Google provider settings
5. Save

## Step 4: Set Up Environment Variables

Create a `.env` file in your project root (or add to your existing one):

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Database connection string
DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres

# Flask secret key (generate a random string)
SECRET_KEY=your-random-secret-key-here
```

**Important**: 
- Never commit your `.env` file to git!
- The `.env` file is already in `.gitignore`

## Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install the Supabase Python client.

## Step 6: Migrate Your Data to Supabase

If you have existing data in your SQLite database:

```bash
python migrate_to_supabase.py
```

This will:
- Create all tables in Supabase
- Copy all your data from SQLite to Supabase
- Preserve all your existing data

**Note**: After migration, your app will use Supabase. Your local SQLite database will remain as a backup.

## Step 7: Run Your Application

```bash
python app.py
```

The app will:
- Use Supabase database if `DATABASE_URL` is set
- Fall back to SQLite if not set (for local development)
- Show a "Sign in with Google" button if Supabase auth is configured

## Step 8: Test Authentication

1. Open your app in the browser: `http://localhost:5001`
2. Click "Sign in with Google"
3. Complete the Google sign-in flow
4. You should see your email in the top right corner

## Troubleshooting

### "Supabase not configured" message
- Check that `SUPABASE_URL` and `SUPABASE_KEY` are set in your `.env` file
- Restart your Flask app after adding environment variables

### "Authentication required" errors
- Make sure you're signed in (check top right corner)
- Try signing out and signing back in

### Database connection errors
- Verify your `DATABASE_URL` is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check that your Supabase project is active (not paused)

### Google OAuth not working
- Verify Google OAuth is enabled in Supabase
- Check that redirect URI matches exactly: `https://your-project.supabase.co/auth/v1/callback`
- Make sure Google Cloud Console credentials are correct

## How It Works

### Authentication Flow
1. User clicks "Sign in with Google"
2. Supabase redirects to Google OAuth
3. User authorizes with Google
4. Google redirects back to Supabase
5. Supabase creates/updates user session
6. Frontend stores session token
7. All API requests include the token in `Authorization` header
8. Backend validates token and filters data by user

### Data Isolation
- Each user only sees their own data
- All database queries are filtered by `user_id`
- Legacy data (without `user_id`) is only visible when not signed in

### Database Sync
- Your data is stored in Supabase PostgreSQL
- Accessible from anywhere (not just local machine)
- Automatically backed up by Supabase
- Can be accessed via Supabase dashboard

## Next Steps

- **Multi-user support**: Each user now has their own isolated data
- **Cloud deployment**: Your app is ready to deploy to Vercel, Heroku, etc.
- **Real-time features**: You can add Supabase real-time subscriptions
- **Row Level Security**: Enable RLS in Supabase for additional security

## Support

If you run into issues:
1. Check the browser console (F12) for errors
2. Check Flask server logs for backend errors
3. Verify all environment variables are set correctly
4. Make sure Supabase project is active and not paused
