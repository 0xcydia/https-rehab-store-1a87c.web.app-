# Rehab Store — Firebase Deployment (no Cloud Functions)

## Stack
- **Hosting**: Firebase Hosting (free tier, 10GB/mo)
- **Database**: Firestore (free tier, 1GB/mo)
- **Auth**: Firebase Auth (free tier) — email/password for admin only
- **Frontend**: Single `index.html` (inline CSS/JS, ~2400 lines)

No Cloud Functions needed — Firestore security rules handle all access control.

## Project Setup
- **Firebase Project**: `rehab-store-1a87c`
- **Firebase Config**: in `index.html:906-913` (apiKey, authDomain, projectId, etc.)
- **Live URL**: https://rehab-store-1a87c.web.app

## Data Model (3 collections)
```
/products/{id} — name, nameAr, cat, catAr, price, price_USD, price_EGP, price_AED, price_SAR, orig, badge, img, colors[], desc, descAr, currency, createdAt
/orders/{id}   — items[{name,nameAr,price,qty,cat,catAr}], total, currency, email, phone, shipping{name,address,city,country}, status, createdAt
/subscribers/{id} — email, createdAt
```

### Product Fields
- `name` / `nameAr` — Arabic name (same value, `name` is primary)
- `cat` / `catAr` — English and Arabic categories (auto-synced in admin form)
- `price` — base price in USD (also stored as `price_USD`, `price_EGP`, `price_AED`, `price_SAR`)
- `orig` — original/compare-at price (optional)
- `badge` — "Sale", "New", or null
- `img` — image URL (or uploaded via URL field)
- `colors` — array of hex color strings
- `desc` / `descAr` — Arabic descriptions (Arabic is primary)
- `currency` — default currency for the product

## Security Rules (`firestore.rules`)
- **Products**: public read, admin write (requires auth)
- **Orders**: public create, admin read/update
- **Subscribers**: public create, admin read

## Admin Panel
- **Access**: Click "Admin" nav link → login modal
- **Auth Methods**:
  1. **Firebase Auth** (production): Email/password with user created in Firebase Console
  2. **Local Bypass** (development): `admin@local.test` / `admin123` — enabled via `LOCAL_ADMIN_BYPASS = true`
- **Tabs**: Products (CRUD), Orders (list), Subscribers (list)
- **Fallback**: If Firestore is unavailable (ad-blocker, network), all data saves to `localStorage` under keys `rehab_products`, `rehab_orders`
- **Category Sync**: English/Arabic categories auto-sync when you select either dropdown
- **Product Name**: Arabic-only (no separate English name field)

## Features
- **Multi-Currency**: USD, EGP (ج.م), AED (د.إ), SAR (ر.س) — exchange rates in JS config
  - 1 USD = 48 EGP, 1 USD = 3.67 AED, 1 USD = 3.75 SAR
- **Bilingual**: English/Arabic toggle with RTL support (Cairo font)
- **WhatsApp Ordering**: +201555121123 — integrated in product cards, modal, cart, admin orders, floating button
- **Cart & Checkout**: localStorage-backed, bilingual checkout form, order placement
- **Wishlist**: localStorage-backed (`rehab_wish`)
- **Product Modal**: Quick-view with color selection and quantity
- **Newsletter**: Email subscription form
- **Admin CRUD**: Add/edit/delete products (with image URL), view/delete orders & subscribers
- **Product Images**: Real product photos from Unsplash
- **Floating Hearts**: Decorative animation

## Error Handling
- **Ad-blocker Protection**: All Firestore calls wrapped with `firestoreWithTimeout()` (4-second timeout)
  - If Firestore hangs (blocked by uBlock/Privacy Badger), falls back gracefully to localStorage
  - Used in: product saves, product loads, order placement, admin panel, newsletter, WhatsApp order lookup

## Deployment
```bash
firebase deploy --only hosting
```
Note: `index.html` must be in `public/` directory (copy before deploy).

## Key Files
```
public/index.html       ← Frontend (inline CSS/JS, Firebase compat SDK via CDN)
firestore.rules         ← Security rules
firebase.json           ← Hosting config (public dir)
plan.md                 ← This file
```

## Local Development
```bash
python3 -m http.server 3001
# Open http://localhost:3001
```

## Firebase Console Links
- **Project**: https://console.firebase.google.com/project/rehab-store-1a87c
- **Authentication**: https://console.firebase.google.com/project/rehab-store-1a87c/authentication
- **Firestore**: https://console.firebase.google.com/project/rehab-store-1a87c/firestore
