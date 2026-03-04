# HubSpot Design System

Reusable UI components and design tokens for Payments Acquisition and related products.

## Structure

- **`src/components/`** — Reusable components (Button, Modal, Select, etc.)
- **`src/tokens/`** — Design tokens (colors, typography, spacing)
- **`src/gallery/`** — Gallery component for browsing and testing
- **`app/`** — Gallery viewer app (run locally or deploy to Vercel)

## Clone and use

### 1. Run the gallery locally

```bash
cd design-system
npm install
cd app && npm install && cd ..
npm run gallery
```

Open http://localhost:5173 to view the component gallery.

### 2. Use in your project

Add to your `package.json`:
```json
"design-system": "file:../design-system"
```

Or from GitHub:
```json
"design-system": "github:AtlasUX/HubSpot#main:design-system"
```

### 3. Import components

```tsx
import { Button, OnboardingNav } from "design-system/components";
import type { NavItem } from "design-system/components";
import { Gallery } from "design-system/gallery";
import { colors } from "design-system/tokens";
```

### 4. Extend the design system

- Add new components to `src/components/`
- Register them in `src/gallery/Gallery.tsx` to see them in the gallery
- Update tokens in `src/tokens/` as needed

## Focus state (form elements)

All form elements use a universal focus color: `#00A4BD` (teal), defined as `--color-focus` in CSS and `hs.focus` in Tailwind.

## Deployment

See [DEPLOY.md](./DEPLOY.md) for Vercel deployment of the gallery app.
