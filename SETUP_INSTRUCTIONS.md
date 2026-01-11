# Quick Setup Instructions

## ✅ What's Done
- ✅ Supabase integration code added
- ✅ Google OAuth configured in Supabase
- ✅ .env file created (in backups folder)

## 🔧 What You Need to Do Now

### 1. Move .env File to Project Root

**Option A: Using Terminal**
```bash
cd /Users/bentremblay/Desktop/npi_expanded
mv backups/.env .env
```

**Option B: Using Finder**
- Open Finder
- Navigate to `/Users/bentremblay/Desktop/npi_expanded/backups/`
- Drag `.env` file to `/Users/bentremblay/Desktop/npi_expanded/` (project root)

### 2. Install Supabase Package

Run this command in your terminal:
```bash
pip3 install supabase==2.3.4
```

If you get permission errors, try:
```bash
pip3 install --user supabase==2.3.4
```

Or use a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Verify .env File Location

Make sure `.env` is in the project root (same folder as `app.py`):
```
/Users/bentremblay/Desktop/npi_expanded/
  ├── .env          ← Should be here
  ├── app.py
  ├── requirements.txt
  └── ...
```

### 4. Start the Server

```bash
python3 app.py
```

Then visit: http://localhost:5001

## 🎯 Expected Result

Once everything is set up:
- ✅ Server starts without errors
- ✅ You see "Sign in with Google" button in the top right
- ✅ Clicking it redirects to Google OAuth
- ✅ After signing in, you see your email in the nav bar

## ❌ If You See Errors

**"ModuleNotFoundError: No module named 'supabase'"**
→ Run: `pip3 install supabase==2.3.4`

**"Supabase not configured"**
→ Check that `.env` file is in project root and has all required variables

**"Permission denied" when moving .env**
→ Use Finder to drag the file, or run: `sudo mv backups/.env .env`

## 📝 Your .env Should Have

```bash
SUPABASE_URL=https://gtxlwrrxejaotkjjlasf.supabase.co
SUPABASE_KEY=sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4
SUPABASE_SERVICE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres
SECRET_KEY=any-random-string
```
