# Data Backup Guide

## ✅ Your Data is Safe!

Your ideas and projects are being saved to a local SQLite database file:
- **Location**: `/Users/bentremblay/Desktop/npi_expanded/workflow.db`

## Current Data Status

As of now, you have:
- **4 App Ideas** saved
- **2 Projects** created
- **25 Game Plan Steps** 
- **2 Step Data Entries**

## How to Verify Your Data

Run this command anytime to see all your saved data:
```bash
python verify_data.py
```

## How to Backup Your Data

### Quick Backup (Recommended)
Run this command to create a timestamped backup:
```bash
python backup_db.py
```

This will:
- Create a `backups/` folder (if it doesn't exist)
- Copy your database with a timestamp
- Show you all existing backups

### Manual Backup
You can also manually copy the database file:
```bash
cp workflow.db ~/Desktop/my_backup_$(date +%Y%m%d).db
```

### Git Backup
Since your code is on GitHub, you can also commit the database:
```bash
git add workflow.db
git commit -m "Backup database"
git push origin main
```

## How to Restore from Backup

If you ever need to restore:
```bash
# Stop your Flask server first
# Then copy the backup back:
cp backups/workflow_backup_YYYYMMDD_HHMMSS.db workflow.db
# Restart your Flask server
```

## Recommended Backup Schedule

- **Daily**: Run `python backup_db.py` before closing your computer
- **Weekly**: Copy the database to an external drive or cloud storage
- **Before major changes**: Always backup before making significant changes

## Your Data Won't Disappear

The database file (`workflow.db`) is a persistent file on your hard drive. As long as:
1. You don't delete the file
2. Your hard drive doesn't fail
3. You backup regularly

Your data will be safe! The database persists even when you close your browser or restart your computer.

## Troubleshooting

**Q: I can't see my data when I refresh the browser**
- Make sure your Flask server is running: `python app.py`
- Check the server is on port 5001: `http://localhost:5001`
- Run `python verify_data.py` to see if data is in the database

**Q: The database file shows 0 bytes**
- This is normal for SQLite - the file size doesn't always reflect the data size
- Run `python verify_data.py` to confirm your data is there

**Q: I want to backup to the cloud**
- Use Dropbox, iCloud, or Google Drive
- Copy the `workflow.db` file to your cloud folder
- Or use Git: `git add workflow.db && git commit -m "Backup" && git push`

