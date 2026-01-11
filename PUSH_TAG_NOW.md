# Push v1.0 Tag - Step by Step

## 🎯 What You Need

A **Personal Access Token** from GitHub (takes 2 minutes to create).

## Step 1: Create Token (2 minutes)

1. **Go to**: https://github.com/settings/tokens/new
2. **Name**: `saas-workflow-tool` (or any name)
3. **Expiration**: Choose 90 days (or No expiration if you want)
4. **Scopes**: Check ✅ **`repo`** (this gives full repository access)
5. **Click**: "Generate token" (green button at bottom)
6. **IMPORTANT**: Copy the token immediately! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Push the Tag

Run this command:
```bash
git push origin v1.0
```

When it asks for credentials:
- **Username**: `BenTremblay1`
- **Password**: **Paste your token** (the `ghp_...` string you just copied)

**Note**: It will say "Password:" but paste your **token**, not your GitHub password.

## ✅ That's It!

The tag should push successfully. You'll see:
```
Total 0 (delta 0), reused 0 (delta 0)
To https://github.com/BenTremblay1/saas-workflow-tool.git
 * [new tag]         v1.0 -> v1.0
```

## 🔄 Save Token for Future (Optional)

If you don't want to enter it every time:

### macOS Keychain (Recommended)
```bash
# Store credentials in macOS keychain
git config --global credential.helper osxkeychain

# Then push (will ask once, then remember)
git push origin v1.0
```

### Or Store in Git Config (Less Secure)
```bash
# Store token in Git config (not recommended for shared computers)
git config --global credential.helper store

# Then push (will ask once, then remember)
git push origin v1.0
```

## 🚀 After Tag is Pushed

Then you can commit and push your v2 changes:
```bash
git add .
git commit -m "Version 2.0: Add Supabase integration with Google OAuth"
git push origin main
```
