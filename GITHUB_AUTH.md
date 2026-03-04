# Fix GitHub Authentication

GitHub no longer accepts account passwords for `git push`. Use one of these:

## Option 1: Personal Access Token (easiest)

1. **Create a token** on GitHub:
   - Go to https://github.com/settings/tokens (or your Enterprise: github.hubspot.com/settings/tokens)
   - Click **Generate new token** → **Generate new token (classic)**
   - Name it (e.g. "HubSpot push")
   - Check the **repo** scope
   - Click **Generate token**
   - **Copy the token** (you won't see it again)

2. **Push using the token:**
   ```bash
   cd /Users/singram/Projects/HubSpot
   git push -u origin main
   ```
   - Username: `singram_hubspot`
   - Password: **paste your token** (not your GitHub password)

## Option 2: GitHub CLI

```bash
gh auth login -h github.com -p https -w
```

Follow the prompts, then run:
```bash
cd /Users/singram/Projects/HubSpot
git push -u origin main
```

## Option 3: SSH (if you already have SSH keys set up)

1. Change remote to SSH:
   ```bash
   git remote set-url origin git@github.com:singram_hubspot/HubSpot.git
   git push -u origin main
   ```
