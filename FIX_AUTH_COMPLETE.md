# Complete Fix for Git Authentication

## 🔍 The Problem
Git is using cached/old credentials that don't work anymore.

## ✅ Solution: Clear Credentials & Use Token

### Step 1: Clear All Cached Credentials

Run these commands to clear any stored credentials:

```bash
# Clear macOS keychain credentials for GitHub
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https
EOF

# Also clear Git's credential cache
git config --global --unset credential.helper
git config --global credential.helper osxkeychain
```

### Step 2: Create Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. **Token name**: `saas-workflow-tool`
3. **Expiration**: 90 days (or No expiration)
4. **Select scopes**: ✅ **`repo`** (Full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** - it starts with `ghp_...`

### Step 3: Push with Token

```bash
git push origin v1.0
```

When prompted:
- **Username**: `BenTremblay1`
- **Password**: **Paste your token** (the `ghp_...` string)

**Important**: 
- Use the **token**, not your GitHub password
- Copy the entire token (it's long)
- Make sure there are no extra spaces

### Step 4: If Still Failing - Use Token in URL

If the above doesn't work, you can embed the token in the URL temporarily:

```bash
# Replace YOUR_TOKEN with your actual token
git push https://YOUR_TOKEN@github.com/BenTremblay1/saas-workflow-tool.git v1.0
```

**⚠️ Warning**: This exposes your token in command history. Use only if needed, then clear history.

## 🔄 Alternative: Switch to SSH (Recommended)

SSH is more secure and easier long-term:

### Step 1: Check for SSH Key

```bash
ls -la ~/.ssh
```

If you see `id_rsa.pub` or `id_ed25519.pub`, you have a key. Skip to Step 3.

### Step 2: Generate SSH Key (if needed)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter 3 times (accept defaults, no passphrase)
```

### Step 3: Add SSH Key to GitHub

1. **Copy your public key**:
```bash
cat ~/.ssh/id_ed25519.pub
# Or if you have id_rsa:
cat ~/.ssh/id_rsa.pub
```

2. **Go to GitHub**: https://github.com/settings/keys
3. Click **"New SSH key"**
4. **Title**: `MacBook Air` (or any name)
5. **Key**: Paste the public key you copied
6. Click **"Add SSH key"**

### Step 4: Change Remote to SSH

```bash
# Change remote URL to SSH
git remote set-url origin git@github.com:BenTremblay1/saas-workflow-tool.git

# Test SSH connection
ssh -T git@github.com
# Should say: "Hi BenTremblay1! You've successfully authenticated..."

# Push (no password needed!)
git push origin v1.0
```

## 🎯 Quickest Fix Right Now

**Try this sequence:**

```bash
# 1. Clear credentials
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https
EOF

# 2. Make sure you have a token (create at https://github.com/settings/tokens/new)

# 3. Push and enter token when prompted
git push origin v1.0
# Username: BenTremblay1
# Password: [paste your ghp_... token]
```

## ❓ Still Not Working?

**Check these:**

1. **Token has `repo` scope?** - Must have `repo` checked
2. **Token not expired?** - Check expiration date
3. **Copied entire token?** - It's long, make sure you got it all
4. **No extra spaces?** - When pasting, make sure no spaces

**Try this diagnostic:**
```bash
# Test if token works
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
# Should return your user info if token is valid
```
