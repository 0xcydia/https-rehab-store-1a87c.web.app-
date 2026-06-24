# Critical Fixes Plan for Rehab Store

## Priority 1: Security Fixes (CRITICAL)

### 1.1 Remove Hardcoded Firebase API Key
- **Problem**: API key `AIzaSyAgjzGQnUWF03le_18D-dwsugTa_ytgKn8` is exposed in client code
- **Solution**: 
  - Move Firebase config to environment variables
  - Use Firebase Hosting's `functions.config()` or `.env` with build step
  - Consider using Firebase App Check to restrict API usage

### 1.2 Disable/Remove Local Admin Bypass
- **Problem**: `LOCAL_ADMIN_BYPASS = true` with hardcoded credentials allows unauthorized admin access
- **Solution**:
  - Set `LOCAL_ADMIN_BYPASS = false` 
  - Remove `checkLocalAdmin()` function or gate behind environment check
  - Add warning if bypass is enabled in production

### 1.3 Fix Firestore Security Rules
- **Problem**: Orders can be created anonymously without validation; delete permissions too restrictive
- **Solution**:
  - Add validation rules for orders (required fields, rate limiting)
  - Allow admin users to delete orders
  - Consider adding reCAPTCHA for order creation to prevent spam

## Priority 2: Product Display Fixes (HIGH)

### 2.1 Fix Bilingual Product Name Display
- **Problem**: Line 1101 shows Arabic product names with `.arabic` class but rule at line 424 hides them in English mode
- **Current code**:
  ```javascript
  <h3 class="product-name arabic">${escapeHtml(p.name || p.nameAr)}</h3>
  ```
- **Solution**: Show English name by default, Arabic only in RTL mode

### 2.2 Add Product Clicks Navigation
- **Problem**: Product cards open modal on click but Add to Cart button on line 1104 references `productsMap['${safeId}']` with unescaped ID
- **Solution**: Verify product ID escaping in template literals

### 2.3 Fix Sticky Header Scroll Behavior
- **Problem**: Line 2328-2329 hides header on downward scroll but doesn't account for mobile menu

## Priority 3: Mobile Responsiveness (MEDIUM)

### 3.1 Features Grid on Mobile
- **Problem**: On mobile (768px), features collapse to 1 column which may be too cramped
- **Solution**: Consider 2-column grid for features on tablet

### 3.2 Currency Selector Styling
- **Problem**: Line 397 has invalid CSS `option{color:var(--text)}` - `--text` is not defined

## Priority 4: Code Quality (MEDIUM)

### 4.1 Extract Configuration
- Move hardcoded values (WhatsApp number, exchange rates, test products) to config section
- Create separate JS file for constants

### 4.2 Add Input Validation
- Validate product form fields before saving
- Add email validation for newsletter and checkout forms

### 4.3 Fix Animation Cleanup
- **Problem**: Floating hearts interval in `spawnHearts()` (line 1593-1605) never cleared
- **Solution**: Clear interval on page unload

## Implementation Order

1. **Immediate**: Security fixes (P1) - prevent unauthorized access
2. **Next**: Product display bugs (P2) - core functionality
3. **Then**: Mobile improvements (P3) - user experience
4. **Later**: Code organization (P4) - maintainability

## Files to Modify

- `index.html` - Main application file (all fixes)
- `public/index.html` - Copy of main file (sync changes)
- `firestore.rules` - Security rules updates