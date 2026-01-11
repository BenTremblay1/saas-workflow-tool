# Vercel Deployment Guide

## ⚠️ Critical: Database Configuration

**SQLite will NOT work on Vercel** because:
- Vercel serverless functions have a read-only filesystem
- Each function invocation is stateless
- SQLite requires persistent file storage

## Solution: Use a Cloud Database

You have several options:

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to "Storage" → "Create Database" → "Postgres"
3. Copy the `POSTGRES_URL` connection string
4. In Vercel project settings → Environment Variables, add:
   - Key: `DATABASE_URL`
   - Value: Your Postgres connection string

### Option 2: Supabase (Free tier available)
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string (use "Connection pooling" mode)
5. Add to Vercel environment variables as `DATABASE_URL`

### Option 3: Railway, Neon, or PlanetScale
- Similar process: get connection string, add as `DATABASE_URL` environment variable

## Deployment Steps

1. **Push your code to GitHub** (already done ✅)

2. **Connect Vercel to GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the Python configuration

3. **Add Environment Variable**:
   - In Vercel project settings → Environment Variables
   - Add `DATABASE_URL` with your database connection string
   - **Important**: Make sure to add it for all environments (Production, Preview, Development)

4. **Deploy**:
   - Vercel will automatically deploy on push to main
   - Or click "Deploy" in the dashboard

## Database Migration

After deploying, you'll need to run migrations to create tables:

### Option A: Run migration script locally pointing to cloud DB
```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="your-postgres-connection-string"
python setup_database.py
```

### Option B: Use Vercel CLI to run migration
```bash
vercel env pull .env.local
python setup_database.py
```

### Option C: Add a migration endpoint (temporary)
You can temporarily add a `/migrate` endpoint in `app.py`:
```python
@app.route('/migrate', methods=['POST'])
def migrate():
    db.create_all()
    return jsonify({'message': 'Database tables created'})
```
Then visit `https://your-app.vercel.app/migrate` once, then remove the endpoint.

## Troubleshooting

### Error: "FUNCTION_INVOCATION_FAILED"
- Check Vercel function logs in dashboard
- Common causes:
  - Missing `DATABASE_URL` environment variable
  - Database connection string format incorrect
  - Database not accessible from Vercel IPs

### Error: "Module not found"
- Ensure `requirements.txt` includes all dependencies
- Vercel will install packages automatically

### Database connection issues
- Verify your database allows connections from Vercel's IP ranges
- Check connection string format (should start with `postgresql://` or `postgres://`)

## Local Development

For local development, you can still use SQLite:
- Don't set `DATABASE_URL` environment variable locally
- The app will automatically use SQLite (`workflow.db`)

## Files Changed for Vercel

- `vercel.json` - Vercel configuration
- `api/index.py` - Serverless function entry point
- `app.py` - Updated to handle cloud databases
- `requirements.txt` - Added `psycopg2-binary` for PostgreSQL support

