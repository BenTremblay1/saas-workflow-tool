# 🔧 Fix Git Push Authentication

## ❌ Current Error
```
Permission denied (publickey)
```

Your repo is using SSH (`git@github.com`) but you don't have SSH keys set up.

## ✅ Quick Fix: Switch to HTTPS with Personal Access Token

### Step 1: Change Remote to HTTPS

```bash
git remote set-url origin https://github.com/BenTremblay1/saas-workflow-tool.git
```

### Step 2: Verify Change

```bash
git remote -v
```

Should now show `https://github.com/...` instead of `git@github.com`

### Step 3: Get Personal Access Token

If you don't have one:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `saas-workflow-tool`
4. Select scope: ✅ **`repo`** (full control)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

### Step 4: Push

```bash
git push origin main
```

When prompted:
- **Username**: `BenTremblay1`
- **Password**: Paste your Personal Access Token (NOT your GitHub password)

### Step 5: Push Tag

```bash
git push origin v2.1
```

Use the same token when prompted.

## ✅ Done!

Your code is now pushed to GitHub!

## 🔧 Alternative: Set Up SSH (For Future)

If you want to use SSH instead (no password needed):

1. **Check if you have SSH key:**
   ```bash
   ls -la ~/.ssh
   ```

2. **If no key, generate one:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter for defaults
   ```

3. **Copy public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. **Add to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key
   - Save

5. **Test:**
   ```bash
   ssh -T git@github.com
   ```

6. **Change remote back to SSH:**
   ```bash
   git remote set-url origin git@github.com:BenTremblay1/saas-workflow-tool.git
   ```

But for now, **HTTPS with token is faster!**

---

**Run the commands above to switch to HTTPS and push!**
