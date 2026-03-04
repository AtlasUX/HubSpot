# Setup Guide: Split into Separate Repos

## Step 1: Create repos on GitHub (you do this)

Create these two empty repos on **github.com** (log in as singram_hubspot):

1. **Design-System** – https://github.com/new?name=Design-System  
2. **HSP-Onboarding** – https://github.com/new?name=HSP-Onboarding  

- Leave "Add a README" **unchecked**
- Click **Create repository** for each

## Step 2: Run the setup commands (after creating repos)

Open a terminal and run these commands from `/Users/singram/Projects/HubSpot`:

```bash
# design-system (if publishing as separate repo)
cd design-system
git init
git add .
git commit -m "Initial design system"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/Design-System.git
git push -u origin main
cd ..

# HSP-Onboarding repo
cd HSP-Onboarding
git init
git add .
git commit -m "Initial HSP onboarding"
git branch -M main
git remote add origin git@github.com:singram_hubspot/HSP-Onboarding.git
git push -u origin main
cd ..
```

## Step 3: Install dependencies

After pushing, run `npm install` in HSP-Onboarding (design-system is installed from GitHub).

## Ongoing: Adding the design system to new projects

Add to your project's `package.json`:
```json
"design-system": "github:singram_hubspot/Design-System"
```

For local development (current monorepo), HSP-Onboarding and hs-designsystem use `"design-system": "file:../design-system"`.
