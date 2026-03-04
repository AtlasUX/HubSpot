# Fix 404 - Publish to GitHub Enterprise

The 404 on `github.hubspot.com/singram_hubspot/HubSpot` usually means the repo doesn't exist yet or the remote is wrong.

## Step 1: Create the repo on GitHub Enterprise

1. Go to **https://github.hubspot.com**
2. Click the **+** menu → **New repository**
3. Name: `HubSpot`
4. Choose **Private**
5. **Do NOT** add README, .gitignore, or license
6. Click **Create repository**

## Step 2: Connect and push from terminal

After creating the repo, GitHub shows the URL. Use it in these commands:

```bash
cd /Users/singram/Projects/HubSpot

# Remove wrong remote if it exists
git remote remove origin 2>/dev/null

# Add your repo (replace with the URL GitHub gave you)
git remote add origin https://github.hubspot.com/singram_hubspot/HubSpot.git

# Push
git push -u origin main
```

## Step 3: Verify

- **Repo page:** https://github.hubspot.com/singram_hubspot/HubSpot (code, files, commits)
- **GitHub Pages** (if enabled): May use a different URL – check Settings → Pages

## If you get "repository not found"

- Confirm the repo exists at the URL you used
- Check your username/org: `singram_hubspot` vs `singram` vs an org name
- Ensure you're logged in: `gh auth status` (with `GH_HOST=github.hubspot.com`)
