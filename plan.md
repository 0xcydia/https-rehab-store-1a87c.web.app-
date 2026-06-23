# Rehab Store — Firebase Deployment (no Cloud Functions)

## Stack
- **Hosting**: Firebase Hosting (free tier, 10GB/mo)
- **Database**: Firestore (free tier, 1GB/mo)
- **Storage**: Firebase Storage (free tier, 5GB/mo) — product images
- **Auth**: Firebase Auth (free tier) — email/password for admin only
- **Frontend**: Single `index.html` (inline CSS/JS, ~2400 lines)

No Cloud Functions needed — Firestore security rules handle all access control.

## Project Setup
- **Firebase Project**: `rehab-store-1a87c`
- **Firebase Config**: in `index.html:906-913` (apiKey, authDomain, projectId, etc.)
- **Live URL**: https://rehab-store-1a87c.web.app

## Data Model (3 collections)
```
/products/{id} — name, nameAr, cat, catAr, price, price_USD, price_EGP, price_AED, orig, badge, img, colors[], desc, descAr, currency, createdAt
/orders/{id}   — items[{name,nameAr,price,qty,cat,catAr}], total, currency, email, phone, shipping{name,address,city,country}, status, createdAt
/subscribers/{id} — email, createdAt
```

### Product Fields
- `name` / `nameAr` — English and Arabic names
- `cat` / `catAr` — English and Arabic categories
- `price` — base price in USD (also stored as `price_USD`, `price_EGP`, `price_AED`)
- `orig` — original/compare-at price (optional)
- `badge` — "Sale", "New", or null
- `img` — image URL
- `colors` — array of hex color strings
- `desc` / `descAr` — English and Arabic descriptions
- `currency` — default currency for the product

## Security Rules
- **Firestore** (`firestore.rules`): Products public read, admin write (requires auth); orders public create, admin read; subscribers public create, admin read
- **Storage** (`storage.rules`): Public read, admin-only write (requires auth)

## Admin Panel
- **Access**: Click "Admin" nav link → login modal
- **Auth Methods**:
  1. **Firebase Auth** (production): Email/password with user created in Firebase Console
  2. **Local Bypass** (development): `admin@local.test` / `admin123` — enabled via `LOCAL_ADMIN_BYPASS = true` (line 1841)
- **Tabs**: Products (CRUD), Orders (list), Subscribers (list)
- **Fallback**: If Firestore is unavailable (ad-blocker, network), all data saves to `localStorage` under keys `rehab_products`, `rehab_orders`

## Features
- **Multi-Currency**: USD, EGP (ج.م), AED (د.إ) — exchange rates in JS config
- **Bilingual**: English/Arabic toggle with RTL support (Cairo font)
- **WhatsApp Ordering**: +201555121123 — integrated in product cards, modal, cart, admin orders, floating button
- **Cart & Checkout**: localStorage-backed, bilingual checkout form, order placement
- **Wishlist**: localStorage-backed (`rehab_wish`)
- **Product Modal**: Quick-view with color selection and quantity
- **Newsletter**: Email subscription form
- **Admin CRUD**: Add/edit/delete products (with image upload to Firebase Storage), view/delete orders & subscribers
- **Floating Hearts**: Decorative animation

## Error Handling
- **Ad-blocker Protection**: All Firestore calls wrapped with `firestoreWithTimeout()` (4-second timeout)
  - If Firestore hangs (blocked by uBlock/Privacy Badger), falls back gracefully to localStorage
  - Used in: product saves, product loads, order placement, admin panel, newsletter, WhatsApp order lookup

## Deployment
```bash
firebase deploy
```

## Key Files
```
index.html              ← Frontend (inline CSS/JS, Firebase compat SDK via CDN)
firestore.rules         ← Security rules
firebase.json           ← Hosting config
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
