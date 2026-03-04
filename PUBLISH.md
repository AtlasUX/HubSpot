# Publishing to GitHub Enterprise

Your local repository is ready to publish. Follow these steps:

## 1. Create the repository on GitHub Enterprise

1. Go to your GitHub Enterprise (e.g. `github.hubspot.com` or your org's GitHub URL)
2. Click **New repository**
3. Name it `HubSpot`
4. Leave it **empty** (no README, no .gitignore, no license)
5. Click **Create repository**

## 2. Publish from your terminal

After creating the repo, GitHub will show you the repository URL. Then run:

```bash
cd /Users/singram/Projects/HubSpot
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

**Example** (replace with your actual URL):
```bash
git remote add origin https://github.hubspot.com/singram_hubspot/HubSpot.git
git push -u origin main
```

## What's included

- **HSP-Onboarding** – Payments onboarding app
- **design-system** – Shared component library + gallery app (`design-system/app`)
- **HubSpot.code-workspace** – Cursor workspace
