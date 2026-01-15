# 🔑 Fix Token Authentication

## ❌ Error
```
Invalid username or token
```

This means either:
- Token is wrong/expired
- Token doesn't have `repo` scope
- Credentials aren't being saved

## ✅ Solution: Use Token in URL (Easiest)

Instead of entering credentials each time, embed the token in the URL:

### Step 1: Get Your Personal Access Token

1. Go to: https://github.com/settings/tokens
2. If you don't have one, create it:
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Name: `saas-workflow-tool`
   - Scope: ✅ **`repo`** (full control)
   - Generate and **COPY THE TOKEN**

### Step 2: Update Remote URL with Token

Replace `YOUR_TOKEN` with your actual token:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/BenTremblay1/saas-workflow-tool.git
```

**Example:**
```bash
git remote set-url origin https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/BenTremblay1/saas-workflow-tool.git
```

### Step 3: Verify

```bash
git remote -v
```

Should show your token in the URL (it's safe - only you can see it locally)

### Step 4: Push

```bash
git push origin main
```

No password prompt needed!

### Step 5: Push Tag

```bash
git push origin v2.1
```

## 🔒 Security Note

The token is stored in `.git/config` which is local to your machine. It's safe as long as you don't commit this file (it's already in `.gitignore`).

## 🔄 Alternative: Use Credential Helper

If you prefer not to embed the token:

```bash
# Store credentials
git config --global credential.helper osxkeychain

# Then push (will prompt once, then save)
git push origin main
```

When prompted:
- **Username**: `BenTremblay1`
- **Password**: Your Personal Access Token

---

**Easiest: Use the token in the URL method above!**
