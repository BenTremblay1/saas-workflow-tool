# Troubleshooting Guide

## Blank Screen Issues

If you're seeing a blank screen when accessing `localhost:5000`, follow these steps:

### Step 1: Check Flask is Running
1. Look at your terminal where you ran `python app.py`
2. You should see output like:
   ```
   * Running on http://127.0.0.1:5000
   * Running on http://0.0.0.0:5000
   ```
3. If you see errors, note them down

### Step 2: Test Flask Endpoint
1. Open a new browser tab
2. Go to: `http://localhost:5000/test`
3. You should see: `{"status":"ok","message":"Flask is working!"}`
4. If this doesn't work, Flask isn't running properly

### Step 3: Check Browser Console
1. Open your browser's Developer Tools:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - **Safari**: Press `Cmd+Option+I` (enable Developer menu first)
2. Go to the **Console** tab
3. Look for any red error messages
4. Common errors:
   - `React is not defined` - React library didn't load
   - `Babel is not defined` - Babel library didn't load
   - `Failed to fetch` - Network/CORS issue
   - `SyntaxError` - JavaScript syntax error

### Step 4: Check Network Tab
1. In Developer Tools, go to the **Network** tab
2. Refresh the page (`F5` or `Cmd+R`)
3. Look for failed requests (red entries)
4. Check if these files load:
   - `app.js` (should be 200 OK)
   - React library (from CDN)
   - Babel library (from CDN)

### Step 5: Verify Dependencies
Run these commands in your terminal:

```bash
# Check if Flask is installed
python -c "import flask; print('Flask:', flask.__version__)"

# Check if all dependencies are installed
pip list | grep -i flask
```

### Step 6: Check Database
If you see database-related errors:

```bash
# Delete old database and let it recreate
rm workflow.db

# Or run migration
python migrate_db.py
```

### Step 7: Common Fixes

**Issue: "Module not found" errors**
```bash
pip install -r requirements.txt
```

**Issue: Port 5000 already in use**
```bash
# Find what's using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change port in app.py
# Change: app.run(debug=True, host='0.0.0.0', port=5000)
# To: app.run(debug=True, host='0.0.0.0', port=5001)
```

**Issue: CORS errors**
- CORS is already enabled in the app
- If you still see CORS errors, check browser console for details

**Issue: JavaScript not loading**
- Check internet connection (CDN libraries need internet)
- Try hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
- Check if your firewall/antivirus is blocking CDN requests

### Step 8: Still Not Working?

1. **Check the terminal output** when you start the app:
   ```bash
   python app.py
   ```
   Look for any error messages

2. **Try accessing the static file directly**:
   - Go to: `http://localhost:5000/static/js/app.js`
   - You should see the JavaScript code
   - If you get 404, check the file exists at `static/js/app.js`

3. **Check file permissions**:
   ```bash
   ls -la static/js/app.js
   ```

4. **Try a different browser** to rule out browser-specific issues

5. **Check if JavaScript is enabled** in your browser settings

## Getting Help

If none of these steps work, please provide:
1. Browser console errors (screenshot or copy/paste)
2. Terminal output when running `python app.py`
3. Browser and version you're using
4. Operating system

