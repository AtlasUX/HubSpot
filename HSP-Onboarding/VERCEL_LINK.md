# Link AtlasUX/HubSpot to Vercel

## Option A: Import as a new project (recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Choose **GitHub** and authorize Vercel if needed
4. Select **AtlasUX/HubSpot**
5. Vercel will detect:
   - **Build Command**: `npm run build:client` (or leave default and override)
   - **Output Directory**: `dist/spa`
7. Click **Deploy**

## Option B: Connect an existing project

If you already have `hsp-onboarding` in Vercel:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open the **hsp-onboarding** project
3. Go to **Settings** → **Git**
4. Click **Connect Git Repository**
5. Select **AtlasUX/HubSpot**
6. Save

## Repo structure

The AtlasUX/HubSpot repo root is the app — Vercel should detect:
- **Build Command**: `npm run build:client`
- **Output Directory**: `dist/spa`
