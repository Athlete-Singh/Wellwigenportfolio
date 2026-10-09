# Wellwigen - Deployment & Production Guide

This guide outlines how to build, test, and deploy the Wellwigen single-page web application.

---

## 1. Quick Start & Production Build

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Build Commands
```bash
# Navigate to the frontend directory
cd Frontend

# Install dependencies (if not already installed)
npm install

# Run local development server
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```

The compiled production bundle is generated in `Frontend/dist/`.

---

## 2. Environment Configuration (`.env`)

Ensure the following environment variables are configured in your production environment (`.env` or hosting provider settings):

```env
# URL of your Node/Express backend API (without trailing slash)
VITE_API_URL=https://api.wellwigen.com/api

# Base URL of the website
VITE_SITE_URL=https://wellwigen.com
```

> **Note on Lead Capture Fallback**:
> If the backend API endpoint (`/users/contact` or `/user/contact`) is unreachable or undergoing maintenance, `LeadModal` gracefully logs the lead submission and persists it in `localStorage` (`wellwigen_leads`) so zero potential leads are ever lost.

---

## 3. Verified Pricing & Plans

All pricing and plan tiers have been confirmed and locked to match exact specifications:

| Program | Plan Tier | Price | Details |
| :--- | :--- | :--- | :--- |
| **Personal Training** | Starter | ₹3,999 / mo | 8 sessions/mo, 2x/week, customized plan |
| **Personal Training** | Transformation (Most Popular) | ₹5,999 / mo | 12 sessions/mo, 3x/week, nutrition + habit tracking |
| **Personal Training** | Premium 1:1 | ₹8,999 / mo | Unlimited support, 20 sessions/mo, dedicated coach |
| **Group Classes** | Trial Class | ₹99 | 1 live interactive session, posture review |
| **Group Classes** | Monthly (Most Popular) | ₹1,999 / mo | Full live access, recordings, community |
| **Group Classes** | Quarterly | ₹4,999 / 3 mos | Save ₹1,000, 3 months unlimited live |
| **Group Classes** | Annual | ₹14,999 / yr | Best value (₹1,250/mo), 12 months unlimited |

---

## 4. Placeholders & Items Requiring Client Attention

Before launching to live traffic, please review the following placeholder items flagged with `// TODO:` in `src/features/landing/data/fitnessData.js`:

1. **Testimonials (`TESTIMONIALS`)**:
   - Location: `src/features/landing/data/fitnessData.js`
   - Action: Replace the sample quote cards with authentic member reviews and real avatar images.
2. **Success Stories & Transformation Photos**:
   - Location: `src/features/landing/data/fitnessData.js`
   - Action: Add verified before/after transformation metric photos if showcasing client results.
3. **Physical Address / Registered Office**:
   - Current value: `123 Fitness Street, Wellness City, India`
   - Action: Update to your exact registered commercial address or studio location.
4. **Social Media Profile Links**:
   - Location: `src/features/landing/data/fitnessData.js` (`CONTACT_INFO`)
   - Action: Update Instagram, Twitter, Facebook, and LinkedIn links to point directly to your verified brand channels.
5. **Image Rights & Assets**:
   - High-resolution local fitness images have been provisioned in `Frontend/public/images/` and documented in `Frontend/CREDITS.md`.
   - If you wish to swap any image for your own studio/trainer photos, simply replace the file with the same filename in `Frontend/public/images/`.

---

## 5. Web Server Configuration & Redirects

When deploying to Nginx, Apache, Netlify, or Vercel, ensure single-page application (SPA) routing redirects legacy marketing URLs to the single-scroll anchors:

### Nginx Example
```nginx
server {
    listen 80;
    server_name wellwigen.com www.wellwigen.com;
    root /var/www/wellwigen/dist;
    index index.html;

    # Anchor redirects for legacy routes
    rewrite ^/personal-training$ /#personal-training permanent;
    rewrite ^/group-classes$ /#group-classes permanent;
    rewrite ^/schedule$ /#group-classes permanent;
    rewrite ^/about$ /#home permanent;
    rewrite ^/contact$ /#home permanent;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Vercel / Netlify (`vercel.json` / `_redirects`)
Client-side redirects are already embedded in `src/App.jsx` via React Router, ensuring users hitting old routes automatically land directly on the correct section anchor.

---

## 6. Legacy Backup & Safety Notice

- **Backup Branch**: `backup-original-marketing`
- **Backup Directory**: `Frontend/legacy-backup/`
- All original multi-page code and administrative routes (`/admin`, `/provider/*`, `/vendor/*`, `/dashboard`) remain preserved and fully functional.
