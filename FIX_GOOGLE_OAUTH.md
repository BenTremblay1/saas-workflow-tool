# Fix Google OAuth Error

## ❌ Error
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: missing OAuth secret"}
```

This means Google OAuth is enabled but the credentials are missing or incorrect.

## ✅ Solution

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create or Select a Project**:
   - Click the project dropdown at the top
   - Create a new project (or use existing)
   - Name it something like "Supabase Auth"

3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - Choose "External" (unless you have a Google Workspace)
     - Fill in app name, support email
     - Add your email as a test user
   - Application type: **"Web application"**
   - Name: "Supabase Auth" (or any name)
   - **Authorized redirect URIs**: Add this EXACT URL:
     ```
     https://gtxlwrrxejaotkjjlasf.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **Copy the Client ID and Client Secret** (you'll need these!)

### Step 2: Configure in Supabase

1. **Go to Supabase Dashboard**: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf

2. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Providers"
   - Find "Google" in the list

3. **Configure Google Provider**:
   - Toggle "Google" to **ON** (enable it)
   - Paste your **Client ID** from Google Cloud Console
   - Paste your **Client Secret** from Google Cloud Console
   - **Important**: Make sure the redirect URI matches:
     ```
     https://gtxlwrrxejaotkjjlasf.supabase.co/auth/v1/callback
     ```
   - Click "Save"

### Step 3: Verify Configuration

1. Make sure all fields are filled:
   - ✅ Enabled: ON
   - ✅ Client ID: (your Google Client ID)
   - ✅ Client Secret: (your Google Client Secret)

2. The redirect URI should be automatically set by Supabase, but verify it matches:
   ```
   https://gtxlwrrxejaotkjjlasf.supabase.co/auth/v1/callback
   ```

### Step 4: Test Again

1. Go back to your app: http://localhost:5001
2. Click "Sign in with Google"
3. You should be redirected to Google's sign-in page
4. After signing in, you'll be redirected back to your app

## 🔍 Common Issues

**"Invalid client" error:**
- Double-check Client ID and Secret are correct
- Make sure you copied the entire strings (no extra spaces)

**"Redirect URI mismatch" error:**
- Verify the redirect URI in Google Cloud Console matches exactly:
  ```
  https://gtxlwrrxejaotkjjlasf.supabase.co/auth/v1/callback
  ```
- No trailing slashes, exact match required

**Still getting "missing OAuth secret":**
- Make sure you clicked "Save" in Supabase after entering credentials
- Try disabling and re-enabling the Google provider
- Wait a minute for changes to propagate

## 📝 Quick Checklist

- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created (Web application type)
- [ ] Redirect URI added: `https://gtxlwrrxejaotkjjlasf.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret copied
- [ ] Credentials pasted into Supabase Google provider settings
- [ ] Google provider enabled and saved in Supabase
- [ ] Tested sign-in flow

## 🎯 Expected Flow

1. User clicks "Sign in with Google"
2. Redirected to Google sign-in page
3. User authorizes the app
4. Redirected back to your app at `http://localhost:5001`
5. User is signed in, email appears in nav bar
