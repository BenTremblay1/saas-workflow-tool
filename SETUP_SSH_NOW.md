# Set Up SSH for GitHub (Easiest Long-term Solution)

## ✅ You're Almost There!

The SSH connection test shows you need to add your SSH key to GitHub.

## Step 1: Generate SSH Key (if you don't have one)

```bash
# Generate a new SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Press Enter 3 times:
# 1. Accept default file location (~/.ssh/id_ed25519)
# 2. Press Enter for no passphrase (or set one if you want)
# 3. Confirm passphrase (or Enter again)
```

## Step 2: Copy Your Public Key

```bash
# Copy your public key to clipboard (macOS)
cat ~/.ssh/id_ed25519.pub | pbcopy

# Or if you have id_rsa instead:
cat ~/.ssh/id_rsa.pub | pbcopy

# Or just display it to copy manually:
cat ~/.ssh/id_ed25519.pub
```

## Step 3: Add Key to GitHub

1. **Go to**: https://github.com/settings/keys
2. Click **"New SSH key"** (green button)
3. **Title**: `MacBook Air` (or any name you want)
4. **Key type**: `Authentication Key`
5. **Key**: **Paste your public key** (the one you just copied)
6. Click **"Add SSH key"**

## Step 4: Test Connection

```bash
ssh -T git@github.com
```

You should see:
```
Hi BenTremblay1! You've successfully authenticated, but GitHub does not provide shell access.
```

## Step 5: Change Remote to SSH

```bash
# Change remote URL to SSH
git remote set-url origin git@github.com:BenTremblay1/saas-workflow-tool.git

# Verify it changed
git remote -v
```

## Step 6: Push the Tag!

```bash
git push origin v1.0
```

**No password needed!** 🎉

## 🔄 If You Already Have a Key

If you saw a `.pub` file when you ran `ls -la ~/.ssh/*.pub`, you already have a key. Just:

1. Copy it: `cat ~/.ssh/id_ed25519.pub | pbcopy`
2. Add to GitHub: https://github.com/settings/keys
3. Test: `ssh -T git@github.com`
4. Change remote: `git remote set-url origin git@github.com:BenTremblay1/saas-workflow-tool.git`
5. Push: `git push origin v1.0`
