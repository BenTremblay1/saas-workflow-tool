# Run These Commands One at a Time

## ⚠️ Important: Run Each Command Separately

Don't paste them all at once. Run them **one line at a time**.

## Step 1: Commit (First Command)

```bash
git commit -m "Version 2.0: Add Supabase integration with Google OAuth"
```

**Wait for it to finish**, then run Step 2.

## Step 2: Push (Second Command)

```bash
git push https://YOUR_TOKEN@github.com/BenTremblay1/saas-workflow-tool.git main
```

## ✅ What You Should See

**After Step 1 (commit):**
```
[main abc1234] Version 2.0: Add Supabase integration with Google OAuth
 30 files changed, 1500 insertions(+), 200 deletions(-)
```

**After Step 2 (push):**
```
Enumerating objects: 30, done.
Counting objects: 100% (30/30), done.
Delta compression using up to 8 threads
Compressing objects: 100% (25/25), done.
Writing objects: 100% (30/30), 50.2 KiB | 5.02 MiB/s, done.
Total 30 (delta 10), reused 0 (delta 0), pack-reused 0
To https://github.com/BenTremblay1/saas-workflow-tool.git
   a518380..abc1234  main -> main
```

## 🔍 If You Get Errors

**"nothing to commit":**
- Files might already be committed
- Run: `git log --oneline -1` to check

**"Authentication failed":**
- Make sure you copied the entire token
- No extra spaces before/after the token

**"pathspez did not match":**
- You pasted multiple commands together
- Run them **one at a time**
