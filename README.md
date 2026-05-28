# Swing Trading Platform - Deployment Guide

## Files Included

- `public/index.html` — Dashboard (all 5 tabs)
- `api/proxy.js` — Backend proxy (bypasses CORS)
- `vercel.json` — Vercel config (includes OpenRouter key)
- `package.json` — Dependencies

## Deployment Steps (Copy-Paste Only)

### Step 1: Create GitHub Repo

1. Go to **github.com** and sign in
2. Click **+** (top right) → **New repository**
3. Name: `swing-trading-platform`
4. Click **Create repository**
5. You'll see code to push. Copy the commands (we'll use them next)

### Step 2: Push Files to GitHub

1. Open **Terminal** on your Mac/PC
2. Run these commands one-by-one (copy-paste):

```bash
cd ~/Downloads  # Or wherever you save files
git clone https://github.com/YOUR_USERNAME/swing-trading-platform.git
cd swing-trading-platform
```

3. **Download all files** from this link (I'll provide after deployment setup)
4. **Extract them** into the `swing-trading-platform` folder
5. Run:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 3: Connect to Vercel

1. Go to **vercel.com** and sign in (use GitHub login)
2. Click **Add New...** → **Project**
3. Select **Import Git Repository**
4. Find and click **swing-trading-platform**
5. Click **Import**
6. Vercel auto-deploys. Wait 2-3 minutes.
7. You get a URL like: `https://swing-trading-platform.vercel.app`

### Step 4: Use It

- Open that URL
- Go to **Research + AI** tab
- Ask questions in the chat panel
- Works perfectly now (no CORS issues)

---

## What Happens Behind the Scenes

- Dashboard runs in browser (fast, responsive)
- Chat requests → Vercel proxy function → OpenRouter API
- Responses come back instantly
- Your OpenRouter key is safe (only on Vercel backend)

---

## If You Get Stuck

Common issues:

**"Command not found: git"**
- Install Git: https://git-scm.com/

**"Repository not found"**
- Make sure you pushed to GitHub first
- Check the repo name matches

**"Vercel deployment failed"**
- Check files are in correct folders (see Step 2)
- Redeploy: Go to Vercel dashboard → Project → Redeploy

---

## Future Updates

When I update the dashboard:
1. Download new files
2. Replace in your `swing-trading-platform` folder
3. Run: `git add . && git commit -m "Update" && git push origin main`
4. Vercel auto-redeploys (1-2 mins)

---

**You're all set!** Once deployed, bookmark the URL and use daily.
