# Fix Git Authentication Error

## ❌ Error
```
remote: Invalid username or token. Password authentication is not supported
```

GitHub no longer accepts passwords. You need a **Personal Access Token (PAT)**.

## ✅ Solution: Use Personal Access Token

### Step 1: Create a Personal Access Token

1. Go to GitHub: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `saas-workflow-tool`
4. Select scopes:
   - ✅ `repo` (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Use Token Instead of Password

When Git asks for password, **paste your token** instead.

### Step 3: Push the Tag

```bash
git push origin v1.0
```

When prompted:
- **Username**: Your GitHub username
- **Password**: Paste your Personal Access Token (not your GitHub password)

## 🔧 Alternative: Use SSH (Recommended for Long-term)

SSH is more secure and you won't need to enter credentials each time.

### Step 1: Check if you have SSH key
```bash
ls -la ~/.ssh
```

If you see `id_rsa` or `id_ed25519`, you have a key. Skip to Step 3.

### Step 2: Generate SSH Key (if needed)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Press Enter for no passphrase (or set one)
```

### Step 3: Add SSH Key to GitHub

1. Copy your public key:
```bash
cat ~/.ssh/id_ed25519.pub
# Or if you have id_rsa:
cat ~/.ssh/id_rsa.pub
```

2. Go to GitHub: https://github.com/settings/keys
3. Click **"New SSH key"**
4. Paste your public key
5. Click **"Add SSH key"**

### Step 4: Change Remote URL to SSH

```bash
# Check current remote
git remote -v

# Change to SSH (replace with your username)
git remote set-url origin git@github.com:BenTremblay1/saas-workflow-tool.git

# Test connection
ssh -T git@github.com
```

### Step 5: Push with SSH

```bash
git push origin v1.0
```

No password needed! 🎉

## 🎯 Quick Fix (Fastest)

**Just use a Personal Access Token for now:**

1. Create token: https://github.com/settings/tokens
2. Run: `git push origin v1.0`
3. When asked for password, paste the token

## 📝 For Future Pushes

Once you set up SSH, you won't need to enter credentials anymore. But for now, the token works fine.
