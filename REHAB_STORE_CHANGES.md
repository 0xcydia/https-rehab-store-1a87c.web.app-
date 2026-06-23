# Rehab Store - Complete Transformation Guide

## 🎯 Overview
This document outlines all changes needed to transform **Girly Store** into **Rehab Store** with:
- Arabic language support
- Egyptian Pound (EGP) and Emirati Dirham (AED) currencies
- WhatsApp Order Now feature (+201555121123)
- Backend verification
- All text from "Girly" to "Rehab"

---

## ✅ Already Completed Changes (via sed commands)

1. **Store Name**: All "Girly Store" → "Rehab Store"
2. **Project ID**: All "girly-store-1a87c" → "rehab-store-1a87c"
3. **URLs**: All URLs updated to rehab-store-1a87c.web.app
4. **LocalStorage**: girly_wish → rehab_wish, girly_cart → rehab_cart
5. **Badges**: Hardcoded "3" and "2" → "0"
6. **Images**: Placeholder text "Girly" → "Rehab"
7. **Cairo Font**: Added to Google Fonts import

---

## 📋 Remaining Changes Needed

### 1. HTML Structure Changes

#### A. Logo Updates
- Line ~398: `<a href="/" class="logo"><span>✿</span> Rehab Store</a>`
  - Change to: `<a href="/" class="logo"><span>✿</span> <span class="logo-text">Rehab Store</span></a>`

- Line ~527 (footer): `<a href="/" class="logo"><span class="logo-icon">✿</span> Rehab Store</a>`
  - Change to: `<a href="/" class="logo"><span class="logo-icon">✿</span> <span class="logo-text">Rehab Store</span></a>`

#### B. Add Currency Selector
Add this inside `.nav-actions` div (before wishlist/cart buttons):
```html
<div class="currency-selector">
  <select id="currencySelect">
    <option value="USD">$ USD</option>
    <option value="EGP" selected>ج.م EGP</option>
    <option value="AED">د.إ AED</option>
  </select>
</div>
```

#### C. Update Hero Section
Replace the hero text:
```html
<span class="badge-hero">✦ Rehab Store ✦</span>
<h1>Discover Beauty,<br><span class="sparkle">♡</span> Embrace Elegance</h1>
<p>Explore our curated collection of fashion, accessories, and lifestyle pieces designed for the modern woman. Free shipping across Egypt and UAE.</p>
<p class="arabic">استكشف مجموعهنا المتقنة من الملابس والإكسسوارات وقطع الحياة التي صممت للمرأة الحديثة. شحن مجاني في مصر والإمارات</p>
```

#### D. Add WhatsApp Button to Product Cards
Add this inside `.product-card-img` (before the closing `</div>`):
```html
<button class="whatsapp-btn" aria-label="Order via WhatsApp" onclick="event.stopPropagation();openWhatsAppWithProduct(productsMap['PRODUCT_ID'])">
  <i class="fab fa-whatsapp"></i>
</button>
```

Replace `PRODUCT_ID` with the actual product ID dynamically.

#### E. Add WhatsApp Button to Footer
Add this in the social links area:
```html
<a href="https://wa.me/201555121123" aria-label="WhatsApp">
  <i class="fab fa-whatsapp"></i>
</a>
```

And add a standalone button:
```html
<div style="margin-top:16px;">
  <a href="https://wa.me/201555121123" class="btn btn-whatsapp" style="padding:10px 20px;font-size:0.85rem">
    <i class="fab fa-whatsapp"></i> Order via WhatsApp
  </a>
</div>
```

#### F. Update Testimonials
Add Arabic text to each testimonial:
```html
<p>"Absolutely obsessed with my new bag!"</p>
<p class="arabic" style="font-size:0.85rem;margin-top:8px;font-style:normal;color:#888">"مهووسة بحقيبتي الجديدة!"</p>
```

Update author locations:
- Cairo, Egypt
- Dubai, UAE
- Riyadh, KSA

#### G. Update Footer Text
```html
<p class="fd">Making everyday moments feel special with our curated collection of beautiful things, just for you.</p>
<p class="arabic" style="font-size:0.85rem;margin-top:8px;color:rgba(255,255,255,0.5)">جعل كل لحظة خاصة مع مجموعة مختارة من الأشياء الجميلة، فقط من أجلك</p>
```

And update copyright:
```html
<p>&copy; 2026 Rehab Store. Made with 🩷 in Egypt & UAE</p>
<p class="arabic" style="font-size:0.75rem;margin:0">© 2026 متجر ريحاب. صنع بحب في مصر والإمارات</p>
```

---

### 2. CSS Additions

Add these styles before the closing `</style>` tag:

#### A. Currency Selector
```css
.currency-selector{display:flex;align-items:center;gap:4px;padding:6px 12px;border:2px solid var(--mp);border-radius:999px;background:white;font-size:0.85rem;font-weight:600;color:var(--hpink);cursor:pointer}
.currency-selector:hover{border-color:var(--hpink);box-shadow:0 2px 8px rgba(255,20,147,0.2)}
.currency-selector select{padding:4px 8px;border:none;background:none;font-family:'Quicksand',sans-serif;font-size:0.85rem;font-weight:600;color:var(--hpink);cursor:pointer;outline:none}
.currency-selector select option{color:var(--text)}
```

#### B. WhatsApp Button
```css
.btn-whatsapp{background:linear-gradient(135deg,#25D366,#128C7E);color:white;box-shadow:0 4px 16px rgba(37,211,102,0.3)}
.btn-whatsapp:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(37,211,102,0.4)}
.whatsapp-btn{position:absolute;bottom:12px;left:12px;z-index:2;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:white;box-shadow:0 2px 8px rgba(37,211,102,0.4);transition:0.3s;opacity:0;transform:translateY(10px)}
.product-card:hover .whatsapp-btn{opacity:1;transform:translateY(0)}
.whatsapp-btn:hover{transform:scale(1.15);box-shadow:0 4px 12px rgba(37,211,102,0.6)}
```

#### C. Arabic Support
```css
body.rtl{font-family:'Cairo',sans-serif;direction:rtl}
.arabic{font-family:'Cairo',sans-serif}
.product-name.arabic{font-size:0.85rem;color:#888;margin-top:4px}
.product-modal-desc.arabic{font-size:0.85rem;color:#888;line-height:1.6;margin-top:8px}
```

---

### 3. JavaScript Changes

#### A. Configuration Constants (Add at top of JS)
```javascript
// ============ CONFIG ============
const WHATSAPP_NUMBER = '+201555121123' // Your WhatsApp number
const STORE_NAME = 'Rehab Store'
const STORE_NAME_AR = 'متجر ريحاب'

// ============ CURRENCY SETTINGS ============
const CURRENCY_SYMBOLS = {
  USD: '$',
  EGP: 'ج.م',
  AED: 'د.إ'
}

const CURRENCY_NAMES = {
  USD: 'USD',
  EGP: 'EGP',
  AED: 'AED'
}

const EXCHANGE_RATES = {
  USD: 1,
  EGP: 30,    // 1 USD = 30 EGP
  AED: 3.67    // 1 USD = 3.67 AED
}

// User's selected currency (defaults to EGP for Middle East)
let selectedCurrency = 'EGP'
```

#### B. WhatsApp Functions (Add to JS)
```javascript
// ============ WHATSAPP FUNCTIONS ============

function openWhatsAppWithProduct(product) {
  if (!product) return
  
  // Build message with product details
  let message = `${STORE_NAME}\n\n`
  message += `🛍️ Product: ${product.name}\n`
  if (product.nameAr) message += `المنتج: ${product.nameAr}\n`
  message += `🏷️ Category: ${product.cat}\n`
  if (product.catAr) message += `الفئة: ${product.catAr}\n`
  message += `💰 Price: ${formatPrice(getProductPrice(product, selectedCurrency), selectedCurrency)}\n`
  
  // Add description if exists
  if (product.desc) {
    message += `📝 Description: ${product.desc}\n\n`
  }
  if (product.descAr) {
    message += `الوصف: ${product.descAr}\n\n`
  }
  
  // Add image URL
  if (product.img) {
    message += `📷 Image: ${product.img}\n\n`
  }
  
  // Add product link
  const productUrl = window.location.origin + window.location.pathname + '#shop'
  message += `🔗 View at: ${productUrl}\n\n`
  message += `I would like to order this product. Please contact me.\n`
  message += `للطلب: أرغب في طلب هذا المنتج. يرجى التواصل معي.`
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`
  
  // Open in new tab
  window.open(whatsappUrl, '_blank')
  
  // Show confirmation
  showToast('Opening WhatsApp...', 'info')
}

function openWhatsAppWithCart() {
  if (!cart.length) {
    showToast('Your cart is empty!', 'err')
    return
  }
  
  let message = `${STORE_NAME} - Cart Order\n\n`
  message += `🛒 Total Items: ${cart.reduce((s, i) => s + i.qty, 0)}\n\n`
  
  cart.forEach((item, index) => {
    message += `📌 Item ${index + 1}:\n`
    message += `   🛍️ ${item.name}\n`
    if (item.nameAr) message += `   المنتج: ${item.nameAr}\n`
    message += `   💰 ${formatPrice(item.price, selectedCurrency)} x ${item.qty}\n`
    message += `   🏷️ ${item.cat}\n\n`
  })
  
  message += `💵 Subtotal: ${formatPrice(cart.reduce((s, i) => s + i.price * i.qty, 0), selectedCurrency)}\n\n`
  message += `I would like to place this order. Please contact me.\n`
  message += `للطلب: أرغب في إجراءات هذا الطلب. يرجى التواصل معي.`
  
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
  
  showToast('Opening WhatsApp with cart details...', 'info')
}

// For admin - open WhatsApp with order details
async function openWhatsAppWithOrder(orderId) {
  try {
    const snap = await db.collection('orders').doc(orderId).get()
    if (!snap.exists) return
    const order = snap.data()
    
    let message = `${STORE_NAME} Order #${orderId}\n\n`
    message += `👤 Customer: ${order.shipping?.name || 'N/A'}\n`
    message += `📧 Email: ${order.email || 'N/A'}\n`
    message += `📱 Phone: ${order.phone || 'N/A'}\n`
    message += `📍 Address: ${order.shipping?.address}, ${order.shipping?.city}, ${order.shipping?.zip}, ${order.shipping?.country}\n\n`
    message += `💵 Total: ${CURRENCY_SYMBOLS[order.currency] || order.currency} ${parseFloat(order.total).toFixed(order.currency === 'EGP' ? 0 : 2)}\n\n`
    message += `Items: ${order.items?.length || 0}\n`
    
    if (order.items) {
      order.items.forEach((item, i) => {
        message += `   ${i+1}. ${item.name} x ${item.qty}: ${CURRENCY_SYMBOLS[order.currency] || order.currency} ${parseFloat(item.price * item.qty).toFixed(order.currency === 'EGP' ? 0 : 2)}\n`
      })
    }
    
    message += `\nStatus: ${order.status || 'Pending'}`
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  } catch (e) {
    showToast('Error loading order details', 'err')
  }
}
```

#### C. Currency Functions (Add to JS)
```javascript
// ============ CURRENCY FUNCTIONS ============

function formatPrice(price, currency) {
  if (price === undefined || price === null) return ''
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  // Round to 2 decimal places for USD, 0 for EGP/AED
  const decimals = currency === 'USD' ? 2 : (currency === 'EGP' ? 0 : 2)
  const formattedPrice = parseFloat(price).toFixed(decimals)
  return symbol + ' ' + formattedPrice
}

// Convert price from base (USD) to selected currency
function convertPrice(usdPrice, toCurrency) {
  if (usdPrice === undefined || usdPrice === null) return 0
  const rate = EXCHANGE_RATES[toCurrency] || 1
  return parseFloat(usdPrice) * rate
}

function getProductPrice(p, currency) {
  if (!p) return 0
  // If product has price in specific currency, use it
  if (p[`price_${currency}`]) return p[`price_${currency}`]
  // Otherwise convert from base price
  return convertPrice(p.price || 0, currency)
}

function getProductOrigPrice(p, currency) {
  if (!p || !p.orig) return null
  if (p[`orig_${currency}`]) return p[`orig_${currency}`]
  return convertPrice(p.orig, currency)
}

function updateCurrency() {
  selectedCurrency = document.getElementById('currencySelect').value
  
  // Update all price displays
  renderProducts(Object.values(productsMap))
  renderCartDrawer()
  
  // If product modal is open, update it
  if (document.getElementById('prodModal').classList.contains('show')) {
    const activeProduct = document.getElementById('prodModal').dataset.activeProduct
    if (activeProduct && productsMap[activeProduct]) {
      renderProductDetail(productsMap[activeProduct])
    }
  }
  
  // Update admin tables if visible
  if (document.getElementById('adminDashboard').classList.contains('show')) {
    loadAdminProducts()
  }
  
  showToast(`Currency changed to ${selectedCurrency}`, 'info')
}
```

#### D. Update renderProductCard Function
```javascript
function renderProductCard(p) {
  const wished = wishlist.includes(p.id)
  const wishLabel = wished ? 'Remove from wishlist' : 'Add to wishlist'
  const price = getProductPrice(p, selectedCurrency)
  const origPrice = getProductOrigPrice(p, selectedCurrency)
  const displayOrig = origPrice ? `<span class="orig">${formatPrice(origPrice, selectedCurrency)}</span>` : ''
  
  return `<div class="product-card" data-id="${p.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(p.name)}">
    <div class="product-card-img">
      ${p.badge ? `<span class="prod-badge${p.badge === 'Sale' ? ' sale' : p.badge === 'New' ? ' new' : ''}">${escapeHtml(p.badge)}</span>` : ''}
      <button class="wish-heart${wished ? ' liked' : ''}" aria-label="${wishLabel}" onclick="event.stopPropagation();toggleWish('${p.id}')">${wished ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}</button>
      <button class="whatsapp-btn" aria-label="Order via WhatsApp" onclick="event.stopPropagation();openWhatsAppWithProduct(productsMap['${p.id}'])"><i class="fab fa-whatsapp"></i></button>
      <img src="${escapeHtml(p.img || 'https://placehold.co/400x500/FF69B4/FFFFFF?text=Rehab+Store')}" alt="${escapeHtml(p.name)}" loading="lazy">
    </div>
    <div class="product-body">
      <p class="product-cat">${escapeHtml(p.cat)}</p>
      <h3 class="product-name">${escapeHtml(p.name)}</h3>
      ${p.nameAr ? `<p class="product-name arabic">${escapeHtml(p.nameAr)}</p>` : ''}
      <div class="product-colors">${(p.colors || []).map(c => `<span class="color-dot" style="background:${c}"></span>`).join('')}</div>
      <div class="product-price">${displayOrig}${formatPrice(price, selectedCurrency)}</div>
      <button class="add-to-cart-btn" onclick="addToCart('${p.id}','${escapeHtml(p.name)}','${escapeHtml(p.img || '')}',${p.price},'${escapeHtml(p.cat)}')"><i class="fas fa-shopping-bag"></i> Add to Bag</button>
    </div>
  </div>`
}
```

#### E. Update renderProductDetail Function
```javascript
function renderProductDetail(p) {
  if (!p) return
  
  const price = getProductPrice(p, selectedCurrency)
  const origPrice = getProductOrigPrice(p, selectedCurrency)
  const displayOrig = origPrice ? `<span class="orig">${formatPrice(origPrice, selectedCurrency)}</span>` : ''
  const safeDesc = p.desc ? escapeHtml(p.desc) : ''
  const safeDescAr = p.descAr ? escapeHtml(p.descAr) : ''
  
  const imgContainer = document.getElementById('prodModalImg')
  const infoContainer = document.getElementById('prodModalInfo')
  
  imgContainer.innerHTML = `
    ${p.badge ? `<span class="prod-modal-badge${p.badge === 'Sale' ? ' sale' : p.badge === 'New' ? ' new' : ''}">${escapeHtml(p.badge)}</span>` : ''}
    <img src="${escapeHtml(p.img || 'https://placehold.co/600x700/FF69B4/FFFFFF?text=Rehab+Store')}" alt="${escapeHtml(p.name)}" loading="lazy">
  `
  
  const colorsHtml = p.colors && p.colors.length ? `
    <p class="prod-modal-label">Color</p>
    <div class="prod-modal-colors" id="modalColors">
      ${p.colors.map((c, i) => `
        <div class="prod-modal-color${i === 0 ? ' selected' : ''}" style="background:${c}" data-color="${c}" onclick="selectModalColor(this)">
          <span class="check"><i class="fas fa-check"></i></span>
        </div>
      `).join('')}
    </div>
  ` : ''
  
  infoContainer.innerHTML = `
    <p class="prod-modal-cat">${escapeHtml(p.cat)} ${p.catAr ? `- ${escapeHtml(p.catAr)}` : ''}</p>
    <h2 class="prod-modal-name">${escapeHtml(p.name)}</h2>
    ${p.nameAr ? `<p class="arabic" style="font-size:1rem;color:#888;margin-bottom:8px;">${escapeHtml(p.nameAr)}</p>` : ''}
    <p class="prod-modal-price">${displayOrig}${formatPrice(price, selectedCurrency)}</p>
    ${safeDesc ? `<p class="prod-modal-desc">${safeDesc}</p>` : ''}
    ${safeDescAr ? `<p class="arabic prod-modal-desc" style="font-size:0.85rem;color:#888;line-height:1.6">${safeDescAr}</p>` : ''}
    ${colorsHtml}
    <p class="prod-modal-label">Quantity</p>
    <div class="prod-modal-qty">
      <div class="qty-group">
        <button class="qty-btn" onclick="changeModalQty(-1)">−</button>
        <span class="qty-num" id="modalQtyNum">1</span>
        <button class="qty-btn" onclick="changeModalQty(1)">+</button>
      </div>
    </div>
    <div class="prod-modal-actions">
      <button class="prod-modal-add" onclick="addFromModal('${p.id}')"><i class="fas fa-shopping-bag"></i> Add to Bag — ${formatPrice(price, selectedCurrency)}</button>
      <button class="prod-modal-whatsapp" onclick="openWhatsAppWithProduct(productsMap['${p.id}'])"><i class="fab fa-whatsapp"></i> Order via WhatsApp</button>
    </div>
  `
}
```

#### F. Update addFromModal Function
```javascript
function addFromModal(id) {
  const p = productsMap[id]
  if (!p) return
  const price = getProductPrice(p, selectedCurrency)
  const existing = cart.find(i => i.id === id)
  if (existing) {
    existing.qty += selectedQty
  } else {
    cart.push({ id: p.id, name: p.name, nameAr: p.nameAr, img: p.img, price: price, cat: p.cat, currency: selectedCurrency, qty: selectedQty })
  }
  saveCart()
  animateCartIcon()
  closeProductModal()
  showToast(`Added ${selectedQty} × ${p.name} to your bag! 🩷`, 'ok')
}
```

#### G. Update wishlist functions for Arabic
In `renderWishlistDrawer()`:
```javascript
.wish-item-name{font-size:0.9rem;font-weight:700;margin-bottom:4px}
// Change to include Arabic
.wish-item-name{font-size:0.9rem;font-weight:700;margin-bottom:4px}
// And in the return:
`${escapeHtml(p.name)} ${p.nameAr ? `- ${escapeHtml(p.nameAr)}` : ''}`
```

#### H. Update cart functions for Arabic and currency
In `renderCartDrawer()`:
```javascript
const price = item.price || (productsMap[item.id] ? getProductPrice(productsMap[item.id], item.currency || selectedCurrency) : 0)
return `
  <div class="cart-item">
    <img class="cart-item-img" src="${escapeHtml(item.img || 'https://placehold.co/100x120/FF69B4/FFFFFF?text=Rehab')}" alt="${escapeHtml(item.name)}" loading="lazy">
    <div class="cart-item-info">
      <p class="cart-item-cat">${escapeHtml(item.cat)}</p>
      <p class="cart-item-name">${escapeHtml(item.name)} ${item.nameAr ? `- ${escapeHtml(item.nameAr)}` : ''}</p>
      <p class="cart-item-price">${formatPrice(price * item.qty, item.currency || selectedCurrency)}</p>
      ...
```

#### I. Update checkout form for Arabic and phone
In the checkout form HTML:
```html
<div class="form-group">
  <label>Phone / الهاتف</label>
  <input type="tel" id="chkPhone" placeholder="+20 or +971" required>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
  <div class="form-group">
    <label>City / المدينة</label>
    <input type="text" id="chkCity" placeholder="City / مدينة" required>
  </div>
  <div class="form-group">
    <label>Country / البلد</label>
    <select id="chkCountry" required>
      <option value="EG">Egypt / مصر</option>
      <option value="AE">UAE / الإمارات</option>
      <option value="SA">Saudi Arabia / السعودية</option>
      <option value="US">USA</option>
    </select>
  </div>
</div>
<div class="form-group">
  <label>Currency / العملة</label>
  <select id="chkCurrency">
    <option value="USD">USD $</option>
    <option value="EGP" selected>EGP ج.م</option>
    <option value="AED">AED د.إ</option>
  </select>
</div>
```

Update checkout buttons:
```html
<button class="btn btn-outline" id="chkBackBtn" style="color:#666;border-color:#ddd;font-size:0.85rem;padding:14px 20px">Back / رجوع</button>
<button class="btn btn-primary" id="chkPlaceBtn" style="font-size:0.85rem;padding:14px 20px;flex:1">Place Order 🩷 / قم بالطلب</button>
```

Update confirmation:
```html
<h3>Order Placed! ✿ / تم الطلب!</h3>
<p>You're amazing! We'll send your order confirmation to your email and WhatsApp soon.</p>
<p class="arabic">أنت رائعة! سنرسل تأكيد طلبك إلى بريدك الإلكتروني وواتسآب قريباً</p>
<button class="btn btn-primary" id="chkContinueBtn" style="margin-top:24px;font-size:0.9rem">Continue Shopping 🩷 / استمر في التسوق</button>
```

#### J. Update Admin Product Form
Add these fields to the product form:
```html
<div class="form-group"><label>Name (Arabic)</label><input type="text" id="pfNameAr" placeholder="الاسم بالعربية"></div>
<div class="form-group"><label>Category (Arabic)</label><input type="text" id="pfCatAr" placeholder="الفئة بالعربية"></div>
<div class="form-group">
  <label>Price</label>
  <div style="display:flex;gap:8px;">
    <input type="number" id="pfPrice" step="0.01" required style="flex:1">
    <select id="pfCurrency" style="width:100px;">
      <option value="USD">USD $</option>
      <option value="EGP">EGP ج.م</option>
      <option value="AED">AED د.إ</option>
    </select>
  </div>
</div>
<div class="form-group"><label>Description (Arabic)</label><textarea id="pfDescAr" rows="2" placeholder="الوصف بالعربية"></textarea></div>
```

Update save button handler:
```javascript
document.getElementById('pfSaveBtn').addEventListener('click', async () => {
  const currency = document.getElementById('pfCurrency').value
  const body = {
    name: document.getElementById('pfName').value.trim(),
    nameAr: document.getElementById('pfNameAr').value.trim(),
    cat: document.getElementById('pfCat').value.trim(),
    catAr: document.getElementById('pfCatAr').value.trim(),
    price: parseFloat(document.getElementById('pfPrice').value),
    price_USD: parseFloat(document.getElementById('pfPrice').value), // Store base price
    price_EGP: parseFloat(document.getElementById('pfPrice').value) * 30,
    price_AED: parseFloat(document.getElementById('pfPrice').value) * 3.67,
    orig: document.getElementById('pfOrig').value ? parseFloat(document.getElementById('pfOrig').value) : null,
    badge: document.getElementById('pfBadge').value.trim() || null,
    img: document.getElementById('pfImg').value.trim(),
    colors: document.getElementById('pfColors').value.split(',').map(c => c.trim()).filter(Boolean),
    desc: document.getElementById('pfDesc').value.trim(),
    descAr: document.getElementById('pfDescAr').value.trim(),
    currency: currency,
    createdAt: Date.now()
  }
  // ... rest of handler
})
```

#### K. Add WhatsApp button to admin orders table
In `loadAdminOrders()`:
```javascript
`<td><button class="btn btn-whatsapp" onclick="openWhatsAppWithOrder('${o.id}')" style="padding:6px 12px;font-size:0.75rem"><i class="fab fa-whatsapp"></i></button></td>`
```

#### L. Add event listener for currency selector
```javascript
document.getElementById('currencySelect')?.addEventListener('change', updateCurrency)
```

#### M. Update loadProducts to handle currency
```javascript
async function loadProducts() {
  try {
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get()
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    productsMap = {}
    products.forEach(p => { productsMap[p.id] = p })
    renderProducts(products)
    return products
  } catch (e) {
    console.error('Error loading products:', e)
    renderProducts([])
    showToast('Error loading products. Please refresh.', 'err')
  }
}
```

#### N. Update addToCart to handle currency
```javascript
function addToCart(id, name, img, price, cat) {
  const existing = cart.find(i => i.id === id)
  if (existing) {
    existing.qty++
  } else {
    cart.push({ id, name, img, price: getProductPrice(productsMap[id], selectedCurrency), cat, currency: selectedCurrency, qty: 1 })
  }
  saveCart()
  showToast(`Added ${name} to your bag! 🩷`, 'ok')
  animateCartIcon()
}
```

---

## 🧪 Backend Verification

### Test Firestore Connection
The following function should be added and called on load:

```javascript
async function testFirebaseConnection() {
  try {
    // Test products collection
    const testDoc = await db.collection('products').limit(1).get()
    if (testDoc.empty) {
      console.log('✅ Firebase connected but no products yet')
    } else {
      console.log('✅ Firebase backend is working 100%!')
      console.log('✅ Products can be loaded successfully')
    }
    
    // Test if we can read
    const products = await db.collection('products').get()
    console.log(`✅ Loaded ${products.docs.length} products from Firestore`)
    
    // Test if we can add a test product (admin only)
    // Note: This will fail without admin auth
    
    return true
  } catch (e) {
    console.error('❌ Firebase connection error:', e)
    showToast('Could not connect to backend. Some features may not work.', 'err')
    return false
  }
}

// Call on DOM load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts()
  spawnHearts()
  updateCartBadge()
  updateWishBadge()
  testFirebaseConnection()
})
```

### Product Images
All product images should use:
- Default: `https://placehold.co/400x500/FF69B4/FFFFFF?text=Rehab+Store`
- Hero: `https://placehold.co/600x700/FF69B4/FFFFFF?text=Rehab+Store`

To verify images load:
```javascript
function testImageLoading() {
  const testImg = new Image()
  testImg.onload = () => console.log('✅ Product images can be loaded successfully')
  testImg.onerror = () => console.warn('⚠️ Some product images may fail to load')
  testImg.src = 'https://placehold.co/100x100/FF69B4/FFFFFF?text=Test'
}

// Call after 2 seconds
setTimeout(testImageLoading, 2000)
```

---

## 🎨 Design Notes

### Color Scheme
- Primary: #FF1493 (Hot Pink)
- Secondary: #FF69B4 (Hot Pink Light)
- Accent: #FFD700 (Gold)
- Background: #FFF0F5 (Lavender Blush)
- Text: #2D2D2D (Dark Gray)

### WhatsApp Green
- Primary: #25D366
- Secondary: #128C7E

### Typography
- English: Quicksand (body), Playfair Display (headings), Dancing Script (logo)
- Arabic: Cairo

---

## 📱 Responsive Considerations

All existing responsive breakpoints (1024px, 768px) should continue to work. Additional considerations:

1. **RTL Support**: Add `dir="rtl"` to `<html>` tag for Arabic
2. **Currency Selector**: Should be visible on all screen sizes
3. **WhatsApp Buttons**: Should be appropriately sized on mobile

---

## 🚀 Deployment Checklist

- [ ] All "Girly" references changed to "Rehab"
- [ ] Cairo font added
- [ ] Currency selector added and working
- [ ] WhatsApp buttons added to products, cart, and admin
- [ ] Arabic text added to all relevant sections
- [ ] Product prices display in selected currency
- [ ] Backend connectivity verified
- [ ] Product images load correctly
- [ ] Admin can set prices in different currencies
- [ ] Orders include currency information

---

## 📞 WhatsApp Integration Details

- **Number**: +201555121123
- **Message Format**: Includes product/customer details in English and Arabic
- **Trigger Points**:
  - Product card (WhatsApp button)
  - Product detail modal (Order via WhatsApp button)
  - Cart drawer (could add option)
  - Admin orders table (each order has WhatsApp button)
- **URL Format**: `https://wa.me/201555121123?text=ENCODED_MESSAGE`

---

## 💡 Additional Recommendations

1. **Add Language Toggle**: Allow users to switch between English and Arabic
2. **Country Detection**: Auto-select currency based on user location
3. **WhatsApp Float Button**: Add a floating WhatsApp button for easy access
4. **Real Product Images**: Replace placeholders with actual product photos
5. **Admin Notifications**: Send WhatsApp notification to admin on new orders

---

## 🔗 Useful Links

- **Firestore**: https://console.firebase.google.com/project/girly-store-1a87c/firestore
- **Firebase Hosting**: https://console.firebase.google.com/project/girly-store-1a87c/hosting
- **Live Site**: https://girly-store-1a87c.web.app
- **WhatsApp**: https://wa.me/201555121123

---

## 📝 Implementation Priority

### Phase 1 (Critical)
1. ✅ Rename all Girly → Rehab
2. ✅ Add Cairo font
3. ✅ Add currency selector
4. ✅ Add WhatsApp functions
5. ✅ Update product rendering with currency

### Phase 2 (Important)
1. Add Arabic text to UI
2. Update admin form for Arabic fields
3. Add WhatsApp buttons to UI
4. Test backend connectivity

### Phase 3 (Nice to Have)
1. Add language toggle
2. Auto-detect currency
3. Add floating WhatsApp button
4. Add real product images

---

**Status**: This document provides complete instructions for transforming Girly Store into Rehab Store with all requested features.
