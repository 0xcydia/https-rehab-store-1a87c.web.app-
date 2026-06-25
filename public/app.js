// 🔥 Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyAgjzGQnUWF03le_18D-dwsugTa_ytgKn8',
  authDomain: 'rehab-store-1a87c.firebaseapp.com',
  projectId: 'rehab-store-1a87c',
  storageBucket: 'rehab-store-1a87c.firebasestorage.app',
  messagingSenderId: '517362979382',
  appId: '1:517362979382:web:e9b004eb68bfbca9cffe97',
  measurementId: 'G-RL6PJK3DNY'
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const auth = firebase.auth()

// ============ REHAB STORE CONFIG ============
const WHATSAPP_NUMBER = '+201555121132'
const STORE_NAME = 'Rehab Store'
const STORE_NAME_AR = 'متجر ريحاب'

// ============ CURRENCY SETTINGS ============
const CURRENCY_SYMBOLS = {
  USD: '$',
  EGP: 'ج.م',
  AED: 'د.إ',
  SAR: 'ر.س'
}

const CURRENCY_NAMES = {
  USD: 'USD',
  EGP: 'EGP',
  AED: 'AED',
  SAR: 'SAR'
}

const EXCHANGE_RATES = {
  USD: 1,
  EGP: 48,    // 1 USD = 48 Egyptian Pounds
  AED: 3.67,  // 1 USD = 3.67 Emirati Dirhams
  SAR: 3.75   // 1 USD = 3.75 Saudi Riyals
}

// Default currency for the store (EGP for Middle East market)
let selectedCurrency = 'EGP'

const CATEGORY_MAP_EN_TO_AR = {
  Fashion: 'موضة',
  Accessories: 'إكسسوارات',
  Jewelry: 'مجوهرات',
  Beauty: 'جمال',
  Shoes: 'أحذية',
  Home: 'منزل'
}

const CATEGORY_MAP_AR_TO_EN = {
  'موضة': 'Fashion',
  'إكسسوارات': 'Accessories',
  'مجوهرات': 'Jewelry',
  'جمال': 'Beauty',
  'أحذية': 'Shoes',
  'منزل': 'Home'
}

// --- Rate limiting ---
const RATE_LIMIT_MS = 30000
let lastActionTime = 0
function checkRateLimit() {
  const now = Date.now()
  if (now - lastActionTime < RATE_LIMIT_MS) {
    const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastActionTime)) / 1000)
    showToast(`Please wait ${remaining}s before the next action / الرجاء الانتظار ${remaining} ثانية`, 'err')
    return false
  }
  lastActionTime = now
  return true
}

function setLoading(btnId, loading, label) {
  const btn = document.getElementById(btnId)
  if (!btn) return
  if (loading) {
    btn.disabled = true
    btn.innerHTML = `<span class="btn-spinner"></span>${label || '...'}`
    btn.classList.add('btn-loading')
  } else {
    btn.disabled = false
    btn.innerHTML = label || btn.dataset.originalLabel || ''
    btn.classList.remove('btn-loading')
  }
}

function syncCategoryEnToAr() {
  const en = document.getElementById('pfCat').value
  const ar = CATEGORY_MAP_EN_TO_AR[en] || ''
  document.getElementById('pfCatAr').value = ar
}

function syncCategoryArToEn() {
  const ar = document.getElementById('pfCatAr').value
  const en = CATEGORY_MAP_AR_TO_EN[ar] || ''
  document.getElementById('pfCat').value = en
}

let editingProductId = null

function escapeHtml(str) {
  if (!str) return ''
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}



// ============ CURRENCY FUNCTIONS ============
function formatPrice(price, currency) {
  if (price === undefined || price === null || isNaN(price)) {
    return ''
  }
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  // Round to appropriate decimal places
  // EGP typically uses 0 decimals, USD and AED use 2
  const decimals = 2
  const formattedPrice = parseFloat(price).toFixed(decimals)
  return symbol + ' ' + formattedPrice
}

function convertPrice(usdPrice, toCurrency) {
  if (usdPrice === undefined || usdPrice === null || isNaN(usdPrice)) {
    return 0
  }
  const rate = EXCHANGE_RATES[toCurrency] || 1
  return parseFloat(usdPrice) * rate
}

function getProductPrice(p, currency) {
  if (!p) return 0
  // If product has price in specific currency, use it
  if (p[`price_${currency}`]) {
    return p[`price_${currency}`]
  }
  // If product has base price, convert it
  if (p.price) {
    return convertPrice(p.price, currency)
  }
  return 0
}

function getProductOrigPrice(p, currency) {
  if (!p || !p.orig) return null
  // If product has original price in specific currency, use it
  if (p[`orig_${currency}`]) {
    return p[`orig_${currency}`]
  }
  // Convert from base original price
  return convertPrice(p.orig, currency)
}

function updateCurrency() {
  const selectElement = document.getElementById('currencySelect')
  if (!selectElement) return
  selectedCurrency = selectElement.value
  // Update all price displays
  if (Object.keys(productsMap).length > 0) {
    renderProducts(Object.values(productsMap))
  }
  renderCartDrawer()
  // If product modal is open, update it
  const modal = document.getElementById('prodModal')
  if (modal && modal.classList.contains('show')) {
    const activeProduct = modal.dataset.activeProduct
    if (activeProduct && productsMap[activeProduct]) {
      renderProductDetail(productsMap[activeProduct])
    }
  }
  // Update admin tables if visible
  const adminDashboard = document.getElementById('adminDashboard')
  if (adminDashboard && adminDashboard.classList.contains('show')) {
    loadAdminProducts()
  }
  // Save preference to localStorage
  localStorage.setItem('rehab_currency', selectedCurrency)
  showToast(`Currency changed to ${selectedCurrency}`, 'info')
}

function loadCurrencyPreference() {
  const saved = localStorage.getItem('rehab_currency')
  if (saved && ['USD', 'EGP', 'AED'].includes(saved)) {
    selectedCurrency = saved
    const selectElement = document.getElementById('currencySelect')
    if (selectElement) {
      selectElement.value = saved
    }
  }
}

function showToast(msg, type) {
  const old = document.querySelector('.toast')
  if (old) old.remove()
  const t = document.createElement('div')
  t.className = 'toast ' + type
  t.textContent = msg
  document.body.appendChild(t)
  requestAnimationFrame(() => t.classList.add('show'))
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400) }, 3000)
}

function renderProductCard(p) {
  const wished = wishlist.includes(p.id)
  const wishLabel = wished ? 'Remove from wishlist' : 'Add to wishlist'
  const price = getProductPrice(p, selectedCurrency)
  const origPrice = getProductOrigPrice(p, selectedCurrency)
  const safeId = p.id.replace(/]/g, '\\]').replace(/[']/g, "\\'")
const safeName = (p.nameEn || p.name || p.nameAr || '').replace(/[']/g, "\\'")
const safeCat = (p.cat || '').replace(/[']/g, "\\'")
const nameDisplay = p.nameEn || p.name || p.nameAr
      const nameDisplayAr = p.nameAr
      return `<div class="product-card" data-id="${p.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(nameDisplay)}">
        <div class="product-card-img">
          ${p.badge ? `<span class="prod-badge${p.badge === 'Sale' ? ' sale' : ''}">${p.badge}</span>` : ''}
          <button class="wish-heart${wished ? ' liked' : ''}" aria-label="${wishLabel}" onclick="event.stopPropagation();toggleWish('${safeId}')">${wished ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}</button>
          <button class="whatsapp-btn" onclick="event.stopPropagation();openWhatsAppWithProduct(productsMap['${safeId}'])" aria-label="Order via WhatsApp"><i class="fab fa-whatsapp"></i></button>
          <img src="${p.img || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop'}" alt="${escapeHtml(nameDisplay)}" loading="lazy">
        </div>
        <div class="product-body">
          <p class="product-cat">${escapeHtml(p.cat)} ${p.cat && p.catAr ? `<span class="arabic">- ${escapeHtml(p.catAr)}</span>` : ''}</p>
          <h3 class="product-name">${escapeHtml(nameDisplay)}${nameDisplayAr && nameDisplayAr !== nameDisplay ? `<span class="arabic" style="display:block;font-size:0.85rem;color:#888;margin-top:4px">${escapeHtml(nameDisplayAr)}</span>` : ''}</h3>
      <div class="product-colors">${(p.colors || []).map(c => `<span class="color-dot" style="background:${c}"></span>`).join('')}</div>
      <div class="product-price">${origPrice ? `<span class="orig">${formatPrice(origPrice, selectedCurrency)}</span>` : ''}${formatPrice(price, selectedCurrency)}</div>
      <button class="add-to-cart-btn" onclick="addToCart('${safeId}','${safeName}','${p.img}',${price},'${safeCat}')"><i class="fas fa-shopping-bag"></i> Add to Bag</button>
    </div>
  </div>`
}

// --- Pagination ---
const PAGE_SIZE = 12
let currentPage = 1
let allFilteredProducts = []

function renderProducts(products) {
  allFilteredProducts = products
  currentPage = 1
  renderPage()
}

function renderPage() {
  const grid = document.getElementById('productsGrid')
  const loadMoreWrap = document.getElementById('loadMoreWrap')
  if (!allFilteredProducts.length) {
    grid.innerHTML = '<p class="empty">Nothing here yet... ✿</p>'
    if (loadMoreWrap) loadMoreWrap.style.display = 'none'
    return
  }
  const pageItems = allFilteredProducts.slice(0, currentPage * PAGE_SIZE)
  grid.innerHTML = pageItems.map(renderProductCard).join('')
  grid.querySelectorAll('.product-card').forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), i * 100)
  })
  if (loadMoreWrap) {
    loadMoreWrap.style.display = allFilteredProducts.length > currentPage * PAGE_SIZE ? 'block' : 'none'
  }
}

function loadMore() {
  currentPage++
  renderPage()
}

let productsMap = {}

async function loadProducts() {
  let firestoreProducts = []
  try {
    const snap = await firestoreWithTimeout(db.collection('products').get(), 10000)
    firestoreProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    firestoreProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  } catch { /* Firestore unavailable */ }
  let localProducts = []
  try { localProducts = JSON.parse(localStorage.getItem('rehab_products') || '[]') } catch { /* ignore */ }
  let merged = {}
  localProducts.forEach(p => { merged[p.id] = p })
  firestoreProducts.forEach(p => { merged[p.id] = p })
  const allProducts = Object.values(merged)
  if (allProducts.length) {
    productsMap = merged
    renderProducts(allProducts)
    return allProducts
  }
  renderProducts([])
  return []
}

let searchTerm = ''

function filterProducts() {
  const term = searchTerm.toLowerCase().trim()
  const all = Object.values(productsMap)
  if (!term) {
    renderProducts(all)
    return
  }
  const filtered = all.filter(p =>
    (p.name && p.name.toLowerCase().includes(term)) ||
    (p.nameAr && p.nameAr.toLowerCase().includes(term)) ||
    (p.cat && p.cat.toLowerCase().includes(term)) ||
    (p.catAr && p.catAr.toLowerCase().includes(term)) ||
    (p.desc && p.desc.toLowerCase().includes(term)) ||
    (p.descAr && p.descAr.toLowerCase().includes(term))
  )
  renderProducts(filtered)
}

// --- Product detail modal ---
let selectedQty = 1

function openProductModal(id) {
  const p = productsMap[id]
  if (!p) return
  selectedQty = 1
  renderProductDetail(p)
  document.getElementById('prodModal').classList.add('show')
  document.body.style.overflow = 'hidden'
}

function closeProductModal() {
  document.getElementById('prodModal').classList.remove('show')
  document.body.style.overflow = ''
}

let modalImageIndex = 0

function renderProductDetail(p) {
  const safeDesc = p.descAr ? escapeHtml(p.descAr) : (p.desc ? escapeHtml(p.desc) : '')
  const price = getProductPrice(p, selectedCurrency)
  const origPrice = getProductOrigPrice(p, selectedCurrency)
  const imgContainer = document.getElementById('prodModalImg')
  const infoContainer = document.getElementById('prodModalInfo')
  const allImages = [p.img, ...(p.images || [])].filter(Boolean)
  modalImageIndex = 0
  
  const galleryDots = allImages.length > 1 ? `
    <div class="gallery-nav">
      ${allImages.map((_, i) => `<span class="gallery-dot${i === 0 ? ' active' : ''}" onclick="galleryGoTo(${i})"></span>`).join('')}
    </div>
  ` : ''
  
  const galleryArrows = allImages.length > 1 ? `
    <button class="gallery-arrow gallery-prev" onclick="galleryPrev()"><i class="fas fa-chevron-left"></i></button>
    <button class="gallery-arrow gallery-next" onclick="galleryNext()"><i class="fas fa-chevron-right"></i></button>
  ` : ''
  
  imgContainer.innerHTML = `
    ${p.badge ? `<span class="prod-modal-badge${p.badge === 'Sale' ? ' sale' : ''}">${p.badge}</span>` : ''}
    ${galleryArrows}
    <img id="modalMainImg" src="${allImages[0]}" alt="${escapeHtml(p.name)}" loading="lazy">
    ${galleryDots}
  `
  
  window.galleryGoTo = function(i) {
    modalImageIndex = i
    document.getElementById('modalMainImg').src = allImages[i]
    document.querySelectorAll('.gallery-dot').forEach((d, j) => d.classList.toggle('active', j === i))
  }
  
  window.galleryPrev = function() {
    const i = (modalImageIndex - 1 + allImages.length) % allImages.length
    window.galleryGoTo(i)
  }
  
  window.galleryNext = function() {
    const i = (modalImageIndex + 1) % allImages.length
    window.galleryGoTo(i)
  }
  
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
    <p class="prod-modal-cat">${escapeHtml(p.cat)} ${p.cat && p.catAr ? `<span class="arabic">- ${escapeHtml(p.catAr)}</span>` : ''}</p>
    <h2 class="prod-modal-name arabic">${escapeHtml(p.name || p.nameAr)}</h2>
    <p class="prod-modal-price">${origPrice ? `<span class="orig">${formatPrice(origPrice, selectedCurrency)}</span>` : ''}${formatPrice(price, selectedCurrency)}</p>
    ${safeDesc ? `<p class="prod-modal-desc arabic">${safeDesc}</p>` : ''}
    ${colorsHtml}
    <p class="prod-modal-label">Quantity</p>
    <div class="prod-modal-qty">
      <div class="qty-group">
        <button class="qty-btn" onclick="changeModalQty(-1)">−</button>
        <span class="qty-num" id="modalQtyNum">1</span>
        <button class="qty-btn" onclick="changeModalQty(1)">+</button>
      </div>
    </div>
    <button class="prod-modal-add" onclick="addFromModal('${p.id}')"><i class="fas fa-shopping-bag"></i> Add to Bag — ${formatPrice(price, selectedCurrency)}</button>
    <button class="prod-modal-whatsapp" onclick="openWhatsAppWithProduct(productsMap['${p.id}'])"><i class="fab fa-whatsapp"></i> Order via WhatsApp</button>
  `
}

function selectModalColor(el) {
  document.querySelectorAll('.prod-modal-color').forEach(c => c.classList.remove('selected'))
  el.classList.add('selected')
}

function changeModalQty(delta) {
  selectedQty = Math.max(1, selectedQty + delta)
  document.getElementById('modalQtyNum').textContent = selectedQty
}

function addFromModal(id) {
  const p = productsMap[id]
  if (!p) return
  const price = getProductPrice(p, selectedCurrency)
  const existing = cart.find(i => i.id === id)
  if (existing) {
    existing.qty += selectedQty
  } else {
    cart.push({ id: p.id, name: p.name, nameAr: p.nameAr, img: p.img, price: price, cat: p.cat, catAr: p.catAr, currency: selectedCurrency, qty: selectedQty })
  }
  saveCart()
  animateCartIcon()
  closeProductModal()
  showToast(`Added ${selectedQty} × ${escapeHtml(p.name || p.nameAr)} to your bag! 🩷`, 'ok')
}



// ============ WHATSAPP FUNCTIONS ============
function openWhatsAppWithProduct(product) {
  if (!product) return
  // Build message with product details
  let message = `${STORE_NAME}

`
  message += `👤 New Order Request
`
  message += `${'─'.repeat(30)}
`
  message += `🛍️ ${product.nameAr || product.name || 'N/A'}
`
  message += `🏷️ ${product.catAr || product.cat || 'N/A'}
`
  const price = getProductPrice(product, selectedCurrency)
  message += `💰 ${formatPrice(price, selectedCurrency)}
`
  if (product.descAr) {
    message += `📝 ${product.descAr}
`
  }
  if (product.img) {
    message += `
${product.img}
`
  }
  const productUrl = window.location.origin + window.location.pathname + '#shop'
  message += `
🔗 ${productUrl}

`
  message += `I would like to order this product.
`
  message += `Please contact me to confirm availability and payment.
`
  message += `
للطلب: أرغب في طلب هذا المنتج.
`
  message += `يرجى التواصل معي لتأكيد التوافر ودفع الثمن.`
  const cleanNumber = WHATSAPP_NUMBER.replace(/\+/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
  showToast('Opening WhatsApp...', 'info')
}

function openWhatsAppWithCart() {
  if (!cart || !cart.length) {
    showToast('Your cart is empty!', 'err')
    return
  }
  let message = `${STORE_NAME} - Cart Order
`
  message += `${'='.repeat(40)}

`
  message += `👤 Customer: [Please provide your name]
`
  message += `📱 Phone: [Please provide your phone]
`
  message += `📍 Location: [Please provide your address]

`
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  let subtotal = 0
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty
    subtotal += itemTotal
    message += `📌 ${index + 1}:
`
    message += `   🛍️ ${item.nameAr || item.name}
`
    message += `   💰 ${formatPrice(item.price, item.currency || selectedCurrency)} × ${item.qty} = ${formatPrice(itemTotal, item.currency || selectedCurrency)}
`
    message += `   🏷️ ${item.catAr || item.cat}
`
    if (item.img) {
      message += `
${item.img}
`
    }
    message += `
`
  })
  message += `${'='.repeat(40)}
`
  message += `💵 Subtotal: ${formatPrice(subtotal, cart[0]?.currency || selectedCurrency)}
`
  message += `📦 Shipping: Free (Egypt & UAE)
`
  message += `💰 Total: ${formatPrice(subtotal, cart[0]?.currency || selectedCurrency)}

`
  message += `I would like to place this order.
`
  message += `Please contact me to confirm and arrange payment.

`
  message += `للطلب: أرغب في إجراء هذا الطلب.
`
  message += `يرجى التواصل معي لتأكيد الطلب وترتيب الدفع.`
  const cleanNumber = WHATSAPP_NUMBER.replace(/\+/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
  showToast('Opening WhatsApp with cart details...', 'info')
}

async function openWhatsAppWithOrder(orderId) {
  try {
    const snap = await firestoreWithTimeout(db.collection('orders').doc(orderId).get())
    if (!snap.exists) {
      showToast('Order not found', 'err')
      return
    }
    const order = snap.data()
    const currency = order.currency || 'USD'
    let message = `${STORE_NAME} - Order #${orderId}
`
    message += `${'='.repeat(40)}

`
    // Customer information
    message += `👤 Customer: ${order.shipping?.name || order.name || 'N/A'}
`
    if (order.phone) {
      message += `📱 Phone: ${order.phone}
`
    }
    message += `📧 Email: ${order.email || 'N/A'}
`
    // Shipping address
    if (order.shipping) {
      const { address, city, zip, country } = order.shipping
      if (address || city || country) {
        message += `📍 Address: ${[address, city, zip, country].filter(Boolean).join(', ')}
`
      }
    }
    message += `
`
    // Order items
    message += `📦 ORDER ITEMS (${order.items?.length || 0})
`
    message += `${'-'.repeat(40)}

`
    let itemsTotal = 0
    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        const itemTotal = (item.price || 0) * (item.qty || 1)
        itemsTotal += itemTotal
        message += `📌 ${index + 1}. ${item.nameAr || item.name}
`
        message += `   ${CURRENCY_SYMBOLS[currency] || currency} ${parseFloat(item.price || 0).toFixed(currency === 'EGP' ? 0 : 2)} × ${item.qty || 1} = ${formatPrice(itemTotal, currency)}
`
        if (item.catAr || item.cat) {
          message += `   🏷️ ${item.catAr || item.cat}
`
        }
        message += `
`
      })
    }
    // Order totals
    message += `${'='.repeat(40)}
`
    message += `💵 Subtotal: ${formatPrice(itemsTotal, currency)}
`
    message += `💰 Total: ${formatPrice(order.total || itemsTotal, currency)}
`
    message += `💳 Currency: ${currency}
`
    message += `📅 Date: ${new Date(order.createdAt).toLocaleDateString()}
`
    message += `🏷️ Status: ${order.status || 'Pending'}

`
    // Call to action
    message += `Please contact the customer to confirm and fulfill this order.`
    // Create WhatsApp URL
    const cleanNumber = WHATSAPP_NUMBER.replace(/\+/g, '')
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
    // Open in new tab
    window.open(whatsappUrl, '_blank')
  } catch (e) {
    console.error('Error loading order for WhatsApp:', e)
    showToast('Error loading order details', 'err')
  }
}

// ============ BACKEND TESTING ============
async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection...')
    // Test products collection
    try {
      const testDoc = await firestoreWithTimeout(db.collection('products').limit(1).get())
      if (testDoc.empty) {
        console.log('✅ Firebase connected but no products yet')
        console.log('📝 Backend is ready - you can add products via admin panel')
      } else {
        console.log('✅ Firebase backend is working 100%!')
        console.log(`📊 Loaded ${testDoc.docs.length} product(s) successfully`)
      }
    } catch { console.warn('⚠️ Firestore products collection unavailable (blocked or not configured)') }
    return true
  } catch (e) {
    console.error('❌ Firebase connection error:', e)
    console.error('❌ Backend may not be working correctly')
    showToast('Could not connect to backend. Some features may not work.', 'err')
    return false
  }
}

function testImageLoading() {
  const testImg = new Image()
  testImg.onload = () => {
    console.log('✅ Product images can be loaded successfully')
    console.log('📷 Image loading is working')
  }
  testImg.onerror = () => {
    console.warn('⚠️ Some product images may fail to load')
    console.warn('📷 Check your image URLs')
  }
  testImg.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}

function showArabicToast(msg, type) {
  const old = document.querySelector('.toast')
  if (old) old.remove()
  const t = document.createElement('div')
  t.className = 'toast ' + type + ' arabic'
  t.textContent = msg
  document.body.appendChild(t)
  requestAnimationFrame(() => t.classList.add('show'))
  setTimeout(() => { 
    t.classList.remove('show'); 
    setTimeout(() => t.remove(), 400); 
  }, 3000)
}

// --- Wishlist state ---
let wishlist = loadWishlist()

function loadWishlist() {
  try { return JSON.parse(localStorage.getItem('rehab_wish') || '[]') } catch { return [] }
}

function saveWishlist() {
  localStorage.setItem('rehab_wish', JSON.stringify(wishlist))
  updateWishBadge()
}

function updateWishBadge() {
  const badges = document.querySelectorAll('.icon-btn[aria-label="Wishlist"] .badge')
  badges.forEach(b => { b.textContent = wishlist.length })
}

function toggleWish(id) {
  const idx = wishlist.indexOf(id)
  if (idx > -1) {
    wishlist.splice(idx, 1)
  } else {
    wishlist.push(id)
  }
  saveWishlist()
  // Update the heart icon in-place so the .show class is preserved
  const card = document.querySelector(`.product-card[data-id="${id}"]`)
  if (card) {
    const heart = card.querySelector('.wish-heart')
    if (heart) {
      const isLiked = wishlist.includes(id)
      heart.classList.toggle('liked', isLiked)
      heart.innerHTML = isLiked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'
    }
  }
  animateWishIcon()
}

function animateWishIcon() {
  const btn = document.querySelector('.icon-btn[aria-label="Wishlist"]')
  if (!btn) return
  btn.style.transform = 'scale(1.3)'
  setTimeout(() => { btn.style.transform = '' }, 300)
}

function openWishlistDrawer() {
  document.getElementById('wishOverlay').classList.add('show')
  renderWishlistDrawer()
  document.body.style.overflow = 'hidden'
}

function closeWishlistDrawer() {
  document.getElementById('wishOverlay').classList.remove('show')
  document.body.style.overflow = ''
}

function renderWishlistDrawer() {
  const container = document.getElementById('wishItems')
  const empty = document.getElementById('wishEmpty')
  
  if (!wishlist.length) {
    container.innerHTML = ''
    empty.style.display = 'block'
    return
  }
  
  empty.style.display = 'none'
  
  container.innerHTML = wishlist.map(id => {
    const p = productsMap[id]
    if (!p) return ''
    return `
      <div class="wish-item">
        <img class="wish-item-img" src="${p.img}" alt="${p.name || p.nameAr}" loading="lazy">
        <div class="wish-item-info">
          <p class="wish-item-cat">${escapeHtml(p.cat)} ${p.catAr ? `- ${escapeHtml(p.catAr)}` : ''}</p>
          <p class="wish-item-name arabic">${escapeHtml(p.name || p.nameAr)}</p>
          <p class="wish-item-price">${formatPrice(getProductPrice(p, selectedCurrency), selectedCurrency)}</p>
          <div class="wish-item-actions">
            <button class="wish-add-cart" onclick="wishToCart('${id}')"><i class="fas fa-shopping-bag"></i> Add to Bag</button>
            <button class="wish-remove" onclick="toggleWish('${id}')"><i class="fas fa-times"></i></button>
          </div>
        </div>
      </div>
    `
  }).join('')
}

function wishToCart(id) {
  const p = productsMap[id]
  if (!p) return
  addToCart(p.id, p.name, p.img, p.price, p.cat)
  // Remove from wishlist after adding to cart
  toggleWish(id)
  renderWishlistDrawer()
}

let heartsInterval = null

function spawnHearts() {
  const container = document.getElementById('hearts')
  heartsInterval = setInterval(() => {
    const h = document.createElement('span')
    h.className = 'heart'
    h.innerHTML = ['♡','🩷','✿','♡','✦'][Math.floor(Math.random() * 5)]
    h.style.left = Math.random() * 100 + '%'
    h.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem'
    h.style.animationDuration = (6 + Math.random() * 8) + 's'
    container.appendChild(h)
    setTimeout(() => h.remove(), 14000)
  }, 800)
}

window.addEventListener('beforeunload', () => {
  if (heartsInterval) clearInterval(heartsInterval)
})

// --- Cart state ---
let cart = loadCart()

function loadCart() {
  try { return JSON.parse(localStorage.getItem('rehab_cart') || '[]') } catch { return [] }
}

function saveCart() {
  localStorage.setItem('rehab_cart', JSON.stringify(cart))
  updateCartBadge()
}

function updateCartBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0)
  const badges = document.querySelectorAll('.icon-btn[aria-label="Cart"] .badge')
  badges.forEach(b => { b.textContent = count })
}

function addToCart(id, name, img, price, cat) {
  const p = productsMap[id]
  const existing = cart.find(i => i.id === id)
  const itemPrice = getProductPrice(p, selectedCurrency)
  if (existing) {
    existing.qty++
  } else {
    cart.push({ 
      id, 
      name,
      nameAr: p?.nameAr || name, 
      img, 
      price: itemPrice, 
      cat, 
      catAr: p?.catAr || '', 
      currency: selectedCurrency, 
      qty: 1 
    })
  }
  saveCart()
  showToast(`Added ${escapeHtml(name)} to your bag! 🩷`, 'ok')
  animateCartIcon()
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id)
  saveCart()
  renderCartDrawer()
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id)
  if (!item) return
  item.qty += delta
  if (item.qty <= 0) {
    removeFromCart(id)
    return
  }
  saveCart()
  renderCartDrawer()
}

function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0)
}

function animateCartIcon() {
  const btn = document.querySelector('.icon-btn[aria-label="Cart"]')
  if (!btn) return
  btn.style.transform = 'scale(1.3)'
  setTimeout(() => { btn.style.transform = '' }, 300)
}

function renderCartDrawer() {
  const container = document.getElementById('cartItems')
  const empty = document.getElementById('cartEmpty')
  const footer = document.getElementById('cartFooter')
  
  if (!cart.length) {
    container.innerHTML = ''
    empty.style.display = 'block'
    footer.style.display = 'none'
    return
  }
  
  empty.style.display = 'none'
  footer.style.display = 'block'
  
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${escapeHtml(item.img || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')}" alt="${escapeHtml(item.name)}" loading="lazy">
      <div class="cart-item-info">
        <p class="cart-item-cat">${escapeHtml(item.cat)} ${item.catAr ? `- ${escapeHtml(item.catAr)}` : ''}</p>
        <p class="cart-item-name arabic">${escapeHtml(item.nameAr || item.name)}</p>
        <p class="cart-item-price">${formatPrice(item.price * item.qty, item.currency || selectedCurrency)}</p>
        <div class="cart-item-actions">
          <div class="qty-group">
            <button class="qty-btn" onclick="updateQty('${item.id}',-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}',1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    </div>
  `).join('')
  
  document.getElementById('cartTotal').textContent = formatPrice(cart.reduce((s, i) => s + (i.price * i.qty), 0), cart[0]?.currency || selectedCurrency)
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkoutSummaryItems')
  container.innerHTML = cart.map(item => `
    <div class="checkout-summary-item">
      <span class="cs-name arabic">${escapeHtml(item.nameAr || item.name)} × ${item.qty}</span>
      <span class="cs-price">${formatPrice(item.price * item.qty, item.currency || selectedCurrency)}</span>
    </div>
  `).join('')
  document.getElementById('checkoutTotal').textContent = formatPrice(getCartTotal(), cart[0]?.currency || selectedCurrency)
}

function openCartDrawer() {
  document.getElementById('cartOverlay').classList.add('show')
  document.getElementById('checkoutSection').classList.remove('show')
  document.getElementById('cartBody').style.display = 'block'
  document.getElementById('cartFooter').style.display = cart.length ? 'block' : 'none'
  renderCartDrawer()
  document.body.style.overflow = 'hidden'
}

function closeCartDrawer() {
  document.getElementById('cartOverlay').classList.remove('show')
  document.getElementById('checkoutSection').classList.remove('show')
  document.getElementById('cartBody').style.display = 'block'
  document.getElementById('checkoutForm').style.display = 'block'
  document.getElementById('checkoutConfirm').style.display = 'none'
  document.body.style.overflow = ''
}

function showCheckout() {
  document.getElementById('cartBody').style.display = 'none'
  document.getElementById('cartFooter').style.display = 'none'
  document.getElementById('checkoutSection').classList.add('show')
  document.getElementById('checkoutForm').style.display = 'block'
  document.getElementById('checkoutConfirm').style.display = 'none'
  document.getElementById('cs1').className = 'checkout-step done'
  document.getElementById('cs2').className = 'checkout-step active'
  document.getElementById('cs3').className = 'checkout-step'
  renderCheckoutSummary()
}

async function placeOrder() {
  const email = document.getElementById('chkEmail').value.trim()
  const name = document.getElementById('chkName').value.trim()
  const phone = document.getElementById('chkPhone').value.trim()
  const address = document.getElementById('chkAddress').value.trim()
  const city = document.getElementById('chkCity').value.trim()
  const country = document.getElementById('chkCountry').value
  const orderCurrency = document.getElementById('chkCurrency').value
  
  if (!email || !name || !phone || !address || !city) {
    showToast('Please fill in all fields / يرجى ملء جميع الحقول', 'err')
    return
  }
  if (!cart.length) {
    showToast('Your bag is empty / سلتك فارغة', 'err')
    return
  }
  if (!checkRateLimit()) return
  
  setLoading('chkPlaceBtn', true, 'Placing... / جاري الطلب')
  try {
    try {
      await firestoreWithTimeout(db.collection('orders').add({
        items: cart.map(i => ({ name: i.name, nameAr: i.nameAr || '', price: i.price, qty: i.qty, cat: i.cat, catAr: i.catAr || '' })),
        total: getCartTotal(),
        currency: orderCurrency,
        email,
        phone,
        shipping: { name, address, city, country },
        uid: currentCustomer?.uid || null,
        status: 'Pending',
        createdAt: Date.now()
      }))
      console.log('✅ Order saved to Firestore')
    } catch (e) {
      // Firestore not available — save order locally for demo
      console.log('📦 Firestore unavailable, saving order locally')
      const localOrders = JSON.parse(localStorage.getItem('rehab_orders') || '[]')
      localOrders.push({
        id: 'local-' + Date.now(),
        items: cart.map(i => ({ name: i.name, nameAr: i.nameAr || '', price: i.price, qty: i.qty, cat: i.cat, catAr: i.catAr || '' })),
        total: getCartTotal(),
        currency: orderCurrency,
        email,
        phone,
        shipping: { name, address, city, country },
        uid: currentCustomer?.uid || null,
        status: 'Pending',
        createdAt: Date.now()
      })
      localStorage.setItem('rehab_orders', JSON.stringify(localOrders))
    }
    
    document.getElementById('cs2').className = 'checkout-step done'
    document.getElementById('cs3').className = 'checkout-step done'
    document.getElementById('checkoutForm').style.display = 'none'
    document.getElementById('checkoutConfirm').style.display = 'block'
    
    const orderSummary = cart.map(i => `🛍️ ${i.nameAr || i.name} × ${i.qty} = ${formatPrice(i.price * i.qty, orderCurrency)}`).join('\n')
    const notifyMsg = `${STORE_NAME} - New Order 🎉

👤 ${name}
📱 ${phone}
📧 ${email}
📍 ${address}, ${city}

${orderSummary}

💰 Total: ${formatPrice(getCartTotal(), orderCurrency)}
📦 Shipping: Free (Egypt & UAE)`
    const cleanNum = WHATSAPP_NUMBER.replace(/\+/g, '')
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(notifyMsg)}`, '_blank')
    
    cart = []
    saveCart()
    
    showToast('Order placed! 🩷', 'ok')
  } catch (e) {
    showToast('Something went wrong. Please try again.', 'err')
  }
  setLoading('chkPlaceBtn', false, 'Place Order 🩷')
}

// --- Customer Accounts ---
let currentCustomer = null

function switchAccountTab(tabId) {
  document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'))
  document.querySelector(`.account-tab[data-form="${tabId}"]`)?.classList.add('active')
  document.querySelectorAll('#accountForms .account-form').forEach(f => f.style.display = 'none')
  document.getElementById(tabId).style.display = 'block'
}

function openAccountModal() {
  if (currentCustomer) {
    showCustomerDashboard()
  }
  document.getElementById('accountModal').classList.add('show')
}

function closeAccountModal() {
  document.getElementById('accountModal').classList.remove('show')
}

function showCustomerDashboard() {
  document.getElementById('accountForms').style.display = 'none'
  document.getElementById('accountDashboard').style.display = 'block'
  document.getElementById('accountTabs').style.display = 'none'
  document.getElementById('accountName').textContent = currentCustomer?.displayName || currentCustomer?.email || 'Customer'
  loadCustomerOrders()
}

async function loadCustomerOrders() {
  const list = document.getElementById('orderHistoryList')
  if (!currentCustomer) { list.innerHTML = '<p style="color:#999;text-align:center">Please log in to see orders.</p>'; return }
  try {
    const snap = await firestoreWithTimeout(db.collection('orders').where('uid', '==', currentCustomer.uid).orderBy('createdAt', 'desc').get(), 10000)
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    if (!orders.length) {
      list.innerHTML = '<p style="color:#999;text-align:center">No orders yet. Start shopping! 🩷</p>'
      return
    }
    list.innerHTML = orders.map(o => {
      const itemSummary = (o.items || []).map(i => `${i.nameAr || i.name} ×${i.qty || 1}`).join(', ')
      return `<div class="order-history-item">
        <div class="order-history-header">
          <span class="order-history-id">#${(o.id || '').slice(0, 8)}</span>
          <span class="order-history-total">${formatPrice(o.total || 0, o.currency || 'USD')}</span>
        </div>
        <div class="order-history-detail">${escapeHtml(itemSummary)}</div>
        <div class="order-history-detail"><span class="status-badge status-${o.status || 'Pending'}">${o.status || 'Pending'}</span> — ${new Date(o.createdAt).toLocaleDateString()}</div>
      </div>`
    }).join('')
  } catch {
    list.innerHTML = '<p style="color:#999;text-align:center">Could not load orders. Try again later.</p>'
  }
}

function updateAccountNav() {
  const navItem = document.getElementById('accountNavItem')
  if (currentCustomer) {
    navItem.innerHTML = `<div class="account-dropdown">
      <span class="account-greeting" onclick="toggleAccountDropdown()">${currentCustomer.displayName || currentCustomer.email} ▾</span>
      <div class="account-dropdown-menu" id="accountDropdown">
        <a onclick="closeAccountDropdown();openAccountModal()">📦 My Orders</a>
        <div class="divider"></div>
        <a onclick="customerLogout()">🚪 Log Out</a>
      </div>
    </div>`
  } else {
    navItem.innerHTML = '<a href="#" id="accountNavBtn" class="account-btn" onclick="openAccountModal()">Account</a>'
  }
}

function toggleAccountDropdown() {
  document.getElementById('accountDropdown').classList.toggle('show')
}

function closeAccountDropdown() {
  document.getElementById('accountDropdown')?.classList.remove('show')
}

async function customerRegister() {
  const name = document.getElementById('regName').value.trim()
  const email = document.getElementById('regEmail').value.trim()
  const pass = document.getElementById('regPass').value
  if (!name || !email || !pass) { showToast('Please fill all fields', 'err'); return }
  if (pass.length < 6) { showToast('Password must be at least 6 characters', 'err'); return }
  setLoading('registerBtn', true, 'Registering...')
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass)
    await cred.user.updateProfile({ displayName: name })
    currentCustomer = cred.user
    showToast(`Welcome, ${name}! 🩷`, 'ok')
    closeAccountModal()
    updateAccountNav()
  } catch (e) {
    showToast(e.code === 'auth/email-already-in-use' ? 'Email already registered. Log in instead.' : 'Registration failed: ' + e.message, 'err')
  }
  setLoading('registerBtn', false, 'Register 🩷')
}

async function customerLogin() {
  const email = document.getElementById('loginEmail').value.trim()
  const pass = document.getElementById('loginPass').value
  if (!email || !pass) { showToast('Please fill all fields', 'err'); return }
  setLoading('loginBtn', true, 'Logging in...')
  try {
    const cred = await auth.signInWithEmailAndPassword(email, pass)
    currentCustomer = cred.user
    showToast(`Welcome back! 🩷`, 'ok')
    closeAccountModal()
    updateAccountNav()
  } catch (e) {
    showToast(e.code === 'auth/user-not-found' ? 'No account found. Register instead.' : 'Login failed: ' + e.message, 'err')
  }
  setLoading('loginBtn', false, 'Log In 🩷')
}

function customerLogout() {
  currentCustomer = null
  updateAccountNav()
  showToast('Logged out', 'info')
}

// --- Admin panel ---
function showAdminModal() { document.getElementById('adminModal').classList.add('show') }
function hideAdminModal() { document.getElementById('adminModal').classList.remove('show') }

function cancelProductForm() {
  editingProductId = null
  document.getElementById('productForm').style.display = 'none'
}

function firestoreWithTimeout(promise, ms = 4000) {
  return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))])
}

async function loadAdminProducts() {
  const wrap = document.getElementById('productsTableWrap')
  let products = []
  try {
    const snap = await firestoreWithTimeout(db.collection('products').get(), 10000)
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  } catch { /* Firestore unavailable */ }
  // Also load local products from localStorage
  try {
    const localProducts = JSON.parse(localStorage.getItem('rehab_products') || '[]')
    products = [...localProducts, ...products]
  } catch { /* ignore */ }
  if (!products.length) {
    // no products yet
  }
  let html = '<table class="admin-table"><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Currency</th><th>Actions</th></tr></thead><tbody>'
  products.forEach(p => {
    const price = formatPrice(getProductPrice(p, selectedCurrency), selectedCurrency)
    const isLocal = p.id && p.id.startsWith('local-')
    html += `
      <tr>
        <td style="font-size:0.75rem">${isLocal ? '📦 ' : ''}${(p.id || '').slice(0, 8)}...</td>
        <td><span class="arabic">${escapeHtml(p.name || p.nameAr)}</span></td>
        <td>${escapeHtml(p.cat)} ${p.catAr ? `<span class="arabic">- ${escapeHtml(p.catAr)}</span>` : ''}</td>
        <td>${price}</td>
        <td>${p.currency || 'USD'}</td>
        <td class="admin-actions">
          <button class="edit" onclick="editProduct('${p.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="del" onclick="deleteProduct('${p.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `
  })
  html += '</tbody></table>'
  wrap.innerHTML = html
}

async function loadAdminOrders() {
  const wrap = document.getElementById('ordersTableWrap')
  let orders = []
  // Try Firestore first
  try {
    const snap = await firestoreWithTimeout(db.collection('orders').orderBy('createdAt', 'desc').get())
    orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch { /* Firestore unavailable */ }
  // Also load local orders from localStorage (placed during demo mode)
  try {
    const localOrders = JSON.parse(localStorage.getItem('rehab_orders') || '[]')
    orders = [...localOrders, ...orders]
  } catch { /* ignore */ }
  if (!orders.length) {
    wrap.innerHTML = '<p class="empty">No orders yet. ✿</p>'
    window.__allOrders = []
    return
  }
  window.__allOrders = orders
  let html = '<table class="admin-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>'
  orders.forEach(o => {
    const itemCount = o.items?.length || 0
    const total = formatPrice(o.total || 0, o.currency || selectedCurrency)
    const date = new Date(o.createdAt).toLocaleDateString()
    const isLocal = o.id && o.id.startsWith('local-')
    const status = o.status || 'Pending'
    const statusClass = 'status-badge status-' + status
    html += `
      <tr>
        <td style="font-size:0.75rem">${isLocal ? '📦 ' : ''}${(o.id || '').slice(0, 8)}...</td>
        <td>${escapeHtml(o.shipping?.name || o.name || 'N/A')}<br><small style="color:#999">${o.email || ''}</small></td>
        <td>${itemCount}</td>
        <td>${total}</td>
        <td><span class="${statusClass}">${status}</span><br><small>${date}</small></td>
        <td class="admin-actions">
          <button class="edit" onclick="viewOrder('${o.id}')" title="View"><i class="fas fa-eye"></i></button>
          ${isLocal ? '' : `<button class="btn-whatsapp-small" onclick="openWhatsAppWithOrder('${o.id}')" title="Contact via WhatsApp"><i class="fab fa-whatsapp"></i></button>`}
          <button class="del" onclick="deleteOrder('${o.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `
  })
  html += '</tbody></table>'
  wrap.innerHTML = html
}

async function loadAdminSubscribers() {
  const wrap = document.getElementById('subscribersTableWrap')
  try {
    const snap = await firestoreWithTimeout(db.collection('subscribers').orderBy('createdAt', 'desc').get())
    const subs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    if (!subs.length) {
      wrap.innerHTML = '<p class="empty">No subscribers yet. ✿</p>'
      return
    }
    let html = '<table class="admin-table"><thead><tr><th>Email</th><th>Date</th><th>Actions</th></tr></thead><tbody>'
    subs.forEach(s => {
      const date = new Date(s.createdAt).toLocaleDateString()
      html += `
        <tr>
          <td>${escapeHtml(s.email)}</td>
          <td>${date}</td>
          <td class="admin-actions">
            <button class="del" onclick="deleteSubscriber('${s.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `
    })
    html += '</tbody></table>'
    wrap.innerHTML = html
  } catch (e) {
    wrap.innerHTML = '<p class="err">Error loading subscribers: ' + e.message + '</p>'
  }
}

function editProduct(id) {
  let p = productsMap[id]
  // If not in productsMap (e.g. local-only product), try localStorage
  if (!p) {
    try {
      const local = JSON.parse(localStorage.getItem('rehab_products') || '[]')
      p = local.find(x => x.id === id)
    } catch { /* ignore */ }
  }
  if (!p) return
  editingProductId = id
  document.getElementById('pfId').value = id
  document.getElementById('pfName').value = p.name || p.nameAr || ''
  document.getElementById('pfCat').value = p.cat || ''
  document.getElementById('pfCatAr').value = p.catAr || ''
  document.getElementById('pfPrice').value = p.price || p.price_USD || ''
  document.getElementById('pfOrig').value = p.orig || ''
  document.getElementById('pfBadge').value = p.badge || ''
  document.getElementById('pfImg').value = p.img || ''
  document.getElementById('pfImages').value = (p.images || []).join(', ')
  document.getElementById('pfColors').value = (p.colors || []).join(', ')
  document.getElementById('pfDesc').value = p.desc || ''
  document.getElementById('pfDescAr').value = p.descAr || ''
  document.getElementById('pfCurrency').value = p.currency || 'USD'
  document.getElementById('productForm').style.display = 'block'
  document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' })
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return
  // Handle locally-stored products or test products
  if (id.startsWith('local-') || id.startsWith('test-')) {
    const localProducts = JSON.parse(localStorage.getItem('rehab_products') || '[]')
    localStorage.setItem('rehab_products', JSON.stringify(localProducts.filter(p => p.id !== id)))
    // Also remove from productsMap so it disappears from store immediately
    delete productsMap[id]
    showToast('Product deleted!', 'ok')
    loadAdminProducts()
    loadProducts()
    return
  }
  try {
    await firestoreWithTimeout(db.collection('products').doc(id).delete())
    showToast('Product deleted!', 'ok')
    loadAdminProducts()
    loadProducts()
  } catch { showToast('Error deleting product', 'err') }
}

async function deleteOrder(id) {
  if (!confirm('Delete this order?')) return
  // Handle locally-stored orders
  if (id && (id.startsWith('local-') || id.startsWith('local-demo-'))) {
    const localOrders = JSON.parse(localStorage.getItem('rehab_orders') || '[]')
    localStorage.setItem('rehab_orders', JSON.stringify(localOrders.filter(o => o.id !== id)))
    showToast('Order deleted!', 'ok')
    loadAdminOrders()
    return
  }
  try {
    await firestoreWithTimeout(db.collection('orders').doc(id).delete())
    showToast('Order deleted!', 'ok')
    loadAdminOrders()
  } catch { showToast('Error deleting order', 'err') }
}

async function deleteSubscriber(id) {
  if (!confirm('Delete this subscriber?')) return
  try {
    await firestoreWithTimeout(db.collection('subscribers').doc(id).delete())
    showToast('Subscriber deleted!', 'ok')
    loadAdminSubscribers()
  } catch { showToast('Error deleting subscriber', 'err') }
}

function viewOrder(id) {
  const order = window.__allOrders?.find(o => o.id === id)
  if (!order) { showToast('Order not found', 'err'); return }
  document.getElementById('orderDetailTitle').textContent = `Order #${id.slice(0, 8)}`
  document.getElementById('orderDetailDate').textContent = new Date(order.createdAt).toLocaleString()
  
  const itemsHtml = (order.items || []).map(i => `
    <div class="order-item-row">
      <span class="order-item-name">${escapeHtml(i.nameAr || i.name)}</span>
      <span class="order-item-qty">×${i.qty || 1}</span>
      <span class="order-item-price">${formatPrice(i.price * (i.qty || 1), order.currency || selectedCurrency)}</span>
    </div>
  `).join('')
  document.getElementById('orderDetailItems').innerHTML = itemsHtml
  document.getElementById('orderDetailTotal').textContent = formatPrice(order.total || 0, order.currency || selectedCurrency)
  document.getElementById('orderDetailCustomer').textContent = order.shipping?.name || order.name || 'N/A'
  document.getElementById('orderDetailEmail').textContent = order.email || ''
  
  const sel = document.getElementById('orderStatusSelect')
  sel.value = order.status || 'Pending'
  sel.dataset.orderId = id
  const tracking = document.getElementById('orderTrackingInput')
  tracking.value = order.tracking || ''
  tracking.dataset.orderId = id
  
  document.getElementById('orderDetailModal').classList.add('show')
}

function closeOrderDetail() {
  document.getElementById('orderDetailModal').classList.remove('show')
}

async function updateOrderStatus(id, status) {
  try {
    await firestoreWithTimeout(db.collection('orders').doc(id).update({ status: status }), 10000)
    showToast(`Status updated to ${status}`, 'ok')
    loadAdminOrders()
  } catch (e) {
    showToast('Failed to update status', 'err')
  }
}

async function updateOrderTracking(id, tracking) {
  if (!tracking.trim()) return
  try {
    await firestoreWithTimeout(db.collection('orders').doc(id).update({ tracking: tracking.trim() }), 10000)
    showToast('Tracking number saved', 'ok')
  } catch (e) {
    showToast('Failed to save tracking', 'err')
  }
}

// ============ FLOATING WHATSAPP BUTTON ============
function toggleWhatsappFloat() {
  const popup = document.getElementById('whatsappPopup')
  if (popup) popup.classList.toggle('show')
}
function openWhatsappFloatOrder() {
  const msg = `Hi! I'd like to browse your collection and place an order. 🛍️

Can you help me?`
  window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  const popup = document.getElementById('whatsappPopup')
  if (popup) popup.classList.remove('show')
}
function openWhatsappFloatSupport() {
  const msg = `Hi! I need help with an order or have a question. 🩷

Can you assist me?`
  window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  const popup = document.getElementById('whatsappPopup')
  if (popup) popup.classList.remove('show')
}
function openWhatsappFloatShare() {
  const msg = `Check out ${STORE_NAME}! 🩷

${window.location.origin}`
  window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  const popup = document.getElementById('whatsappPopup')
  if (popup) popup.classList.remove('show')
}
// Close popup when clicking outside
document.addEventListener('click', function(e) {
  const float = document.getElementById('whatsappFloat')
  const popup = document.getElementById('whatsappPopup')
  if (float && popup && !float.contains(e.target) && popup.classList.contains('show')) {
    popup.classList.remove('show')
  }
  const odModal = document.getElementById('orderDetailModal')
  if (odModal && odModal.classList.contains('show') && e.target === odModal) {
    odModal.classList.remove('show')
  }
})

// ============ LANGUAGE TOGGLE ============
let currentLang = 'en'

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en'
  applyLanguage(currentLang)
  localStorage.setItem('rehab_lang', currentLang)
}

function applyLanguage(lang) {
  const html = document.documentElement
  const body = document.body
  const enActive = document.querySelector('.lang-en-active')
  const arActive = document.querySelector('.lang-ar-active')
  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl')
    body.classList.add('rtl')
    if (enActive) enActive.style.display = 'none'
    if (arActive) arActive.style.display = 'inline'
  } else {
    html.setAttribute('dir', 'ltr')
    body.classList.remove('rtl')
    if (enActive) enActive.style.display = 'inline'
    if (arActive) arActive.style.display = 'none'
  }
}

function loadLanguagePreference() {
  const saved = localStorage.getItem('rehab_lang')
  if (saved === 'ar') {
    currentLang = 'ar'
    applyLanguage('ar')
  }
}

// Seed a demo order in localStorage for immediate admin preview
function seedDemoOrder() {
  const existing = JSON.parse(localStorage.getItem('rehab_orders') || '[]')
  if (existing.length > 0) return
  const demoOrder = {
    id: 'local-demo-' + Date.now(),
    items: [
      { name: 'Elegant Handbag', nameAr: 'حقيبة يد أنيقة', price: 89.99, qty: 1, cat: 'Accessories', catAr: 'إكسسوارات' },
      { name: 'Arabian Oud Perfume Set', nameAr: 'طقم عود وعطور شرقية', price: 59.99, qty: 2, cat: 'Beauty', catAr: 'جمال' }
    ],
    total: 209.97,
    currency: 'USD',
    email: 'nour@example.com',
    phone: '+201001234567',
    shipping: { name: 'Nour Hassan', address: '12 Nile Street, Garden City', city: 'Cairo', country: 'EG' },
    status: 'Pending',
    createdAt: Date.now() - 3600000
  }
  localStorage.setItem('rehab_orders', JSON.stringify([demoOrder]))
  console.log('📦 Demo order seeded for admin preview')
}

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
  loadProducts()
  spawnHearts()
  updateCartBadge()
  updateWishBadge()
  testFirebaseConnection()
  loadCurrencyPreference()
  loadLanguagePreference()
  seedDemoOrder()
  // Test image loading after a short delay
  setTimeout(testImageLoading, 2000)
  // Add currency change listener
  const currencySelect = document.getElementById('currencySelect')
  if (currencySelect) {
    currencySelect.addEventListener('change', updateCurrency)
  }
  // Search listener
  const searchInput = document.getElementById('searchInput')
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchTerm = this.value
      filterProducts()
    })
  }
  // Language toggle listener
  document.getElementById('langToggle')?.addEventListener('click', toggleLanguage)

  // Customer account listeners
  document.getElementById('registerBtn')?.addEventListener('click', customerRegister)
  document.getElementById('loginBtn')?.addEventListener('click', customerLogin)
  document.querySelectorAll('.account-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAccountTab(tab.dataset.form))
  })
  document.getElementById('accountModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('accountModal')) closeAccountModal()
  })
  // Close account dropdown on outside click
  document.addEventListener('click', e => {
    const dd = document.getElementById('accountDropdown')
    if (dd && !e.target.closest('.account-dropdown') && dd.classList.contains('show')) {
      dd.classList.remove('show')
    }
  })
  // Check for existing customer auth on load
  auth.onAuthStateChanged(user => {
    if (user && !user.isAnonymous) {
      currentCustomer = user
      updateAccountNav()
    }
  })
  
  // Admin event listeners
  document.getElementById('adminNavBtn')?.addEventListener('click', e => { e.preventDefault(); showAdminModal() })
  document.getElementById('adminModalBg')?.addEventListener('click', hideAdminModal)
  document.getElementById('adminModalClose')?.addEventListener('click', hideAdminModal)
  document.getElementById('adminLoginBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('adminEmail').value.trim()
    const pass = document.getElementById('adminPass').value
    const errEl = document.getElementById('adminError')
    errEl.style.display = 'none'
    setLoading('adminLoginBtn', true, 'Logging in...')
    try {
      await auth.signInWithEmailAndPassword(email, pass)
    } catch (e) {
      let errorMsg = e.message || 'Login failed';
      if (e.code === 'auth/user-not-found') {
        errorMsg = '❌ User not found. Check the email or create the user in Firebase Console.';
      } else if (e.code === 'auth/wrong-password') {
        errorMsg = '❌ Wrong password.';
      } else if (e.code === 'auth/user-disabled') {
        errorMsg = '❌ User account disabled.';
      } else if (e.code === 'auth/invalid-credential' || e.code === 'auth/operation-not-allowed') {
        errorMsg = '❌ Email/Password auth not enabled. Enable it in Firebase Console → Authentication → Sign-in method.';
      } else if (e.code === 'auth/invalid-email') {
        errorMsg = '❌ Invalid email format.';
      } else if (e.code === 'auth/network-request-failed') {
        errorMsg = '❌ Network error. Check your connection.';
      }
      errEl.textContent = errorMsg;
      errEl.style.display = 'block';
      showToast('Login failed: ' + errorMsg, 'err');
    }
    setLoading('adminLoginBtn', false, 'Log In')
  })
  document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    auth.signOut()
  })
  auth.onAuthStateChanged(async user => {
    document.getElementById('adminLoginForm').classList.toggle('show', !user)
    document.getElementById('adminDashboard').classList.toggle('show', !!user)
    if (user) {
      document.getElementById('adminEmailDisplay').textContent = user.email
      document.getElementById('adminEmail').value = ''
      document.getElementById('adminPass').value = ''
      document.getElementById('adminError').style.display = 'none'
      if (!user.isAnonymous) {
        loadAdminProducts()
        loadAdminOrders()
        loadAdminSubscribers()
      }
    }
  })
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      const t = tab.dataset.tab
      document.getElementById('adminProducts').style.display = t === 'products' ? 'block' : 'none'
      document.getElementById('adminOrders').style.display = t === 'orders' ? 'block' : 'none'
      document.getElementById('adminSubscribers').style.display = t === 'subscribers' ? 'block' : 'none'
      if (t === 'orders') loadAdminOrders()
      if (t === 'subscribers') loadAdminSubscribers()
    })
  })
  document.getElementById('addProductBtn')?.addEventListener('click', () => {
    editingProductId = null
    document.getElementById('pfId').value = ''
    document.getElementById('pfName').value = ''
    document.getElementById('pfCat').value = ''
    document.getElementById('pfCatAr').value = ''
    document.getElementById('pfPrice').value = ''
    document.getElementById('pfOrig').value = ''
    document.getElementById('pfBadge').value = ''
    document.getElementById('pfImg').value = ''
    document.getElementById('pfColors').value = ''
    document.getElementById('pfImages').value = ''
    document.getElementById('pfDesc').value = ''
    document.getElementById('pfDescAr').value = ''
    document.getElementById('productForm').style.display = 'block'
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' })
  })
  document.getElementById('pfSaveBtn')?.addEventListener('click', async () => {
    const currency = document.getElementById('pfCurrency').value
    const arabicName = document.getElementById('pfName').value.trim()
    const body = {
      name: arabicName,
      nameAr: arabicName,
      cat: document.getElementById('pfCat').value.trim(),
      catAr: document.getElementById('pfCatAr').value.trim(),
      price: parseFloat(document.getElementById('pfPrice').value),
      price_USD: parseFloat(document.getElementById('pfPrice').value),
      price_EGP: parseFloat(document.getElementById('pfPrice').value) * 48,
      price_AED: parseFloat(document.getElementById('pfPrice').value) * 3.67,
      price_SAR: parseFloat(document.getElementById('pfPrice').value) * 3.75,
      orig: document.getElementById('pfOrig').value ? parseFloat(document.getElementById('pfOrig').value) : null,
      badge: document.getElementById('pfBadge').value.trim() || null,
      img: document.getElementById('pfImg').value.trim(),
      colors: document.getElementById('pfColors').value.split(',').map(c => c.trim()).filter(Boolean),
      images: document.getElementById('pfImages').value.split(',').map(u => u.trim()).filter(Boolean),
      desc: document.getElementById('pfDesc').value.trim(),
      descAr: document.getElementById('pfDescAr').value.trim(),
      currency: currency,
      createdAt: Date.now()
    }
    if (!body.name || !body.cat || !body.price || !body.img) { showToast('Please fill required fields (name, category, price, and image URL)', 'err'); return }
    setLoading('pfSaveBtn', true, 'Saving...')
    let saved = false
    let savedId = null
    try {
      if (editingProductId && !editingProductId.startsWith('local-')) {
        await firestoreWithTimeout(db.collection('products').doc(editingProductId).update(body), 10000)
        savedId = editingProductId
        saved = true
      } else {
        const ref = await firestoreWithTimeout(db.collection('products').add(body), 10000)
        savedId = ref.id
        saved = true
        if (editingProductId && editingProductId.startsWith('local-')) {
          const localProducts = JSON.parse(localStorage.getItem('rehab_products') || '[]')
          localStorage.setItem('rehab_products', JSON.stringify(localProducts.filter(p => p.id !== editingProductId)))
        }
      }
      showToast(editingProductId ? 'Product updated! ✿' : 'Product added! 🩷', 'ok')
    } catch { /* Firestore unavailable */ }
    if (!saved) {
      const localProducts = JSON.parse(localStorage.getItem('rehab_products') || '[]')
      if (editingProductId) {
        const idx = localProducts.findIndex(p => p.id === editingProductId)
        if (idx >= 0) localProducts[idx] = { ...body, id: editingProductId }
        savedId = editingProductId
      } else {
        savedId = 'local-' + Date.now()
        localProducts.push({ ...body, id: savedId })
      }
      localStorage.setItem('rehab_products', JSON.stringify(localProducts))
      showToast(editingProductId ? 'Product saved offline ✿' : 'Product saved offline 🩷', 'ok')
      productsMap[savedId] = { ...body, id: savedId }
      if (!Object.values(productsMap).some(p => p.id.startsWith('test-'))) {
        renderProducts(Object.values(productsMap))
      } else {
        loadProducts()
      }
    } else {
      loadProducts()
    }
    setLoading('pfSaveBtn', false, 'Save')
    cancelProductForm()
    loadAdminProducts()
  })
  document.getElementById('nlForm')?.addEventListener('submit', async function(e) {
    e.preventDefault()
    const v = this.querySelector('input').value.trim()
    if (!v) { showToast('Please enter your email address.', 'err'); return }
    if (!checkRateLimit()) return
    const btn = this.querySelector('button[type="submit"]')
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span>Subscribing...' }
    try {
      await firestoreWithTimeout(db.collection('subscribers').add({ email: v, createdAt: Date.now() }))
      showToast('Welcome to the club! Check your inbox for 15% off. 🩷', 'ok')
      this.querySelector('input').value = ''
    } catch { showToast('Something went wrong. Try again!', 'err') }
    if (btn) { btn.disabled = false; btn.innerHTML = 'Subscribe 🩷' }
  })

  // Migrate local products to Firestore
  document.getElementById('migrateLocalBtn')?.addEventListener('click', async function() {
    const localProducts = JSON.parse(localStorage.getItem('rehab_products') || '[]')
    const localOnly = localProducts.filter(p => p.id && p.id.startsWith('local-'))
    if (!localOnly.length) { showToast('No local products to migrate!', 'ok'); return }
    this.disabled = true
    this.textContent = `Migrating ${localOnly.length} products...`
    let migrated = 0
    for (const p of localOnly) {
      try {
        const { id, ...data } = p
        data.createdAt = Date.now()
        await firestoreWithTimeout(db.collection('products').add(data), 10000)
        migrated++
      } catch (e) { console.error('Migration error', p.id, e) }
    }
    const remaining = localProducts.filter(p => !p.id.startsWith('local-'))
    localStorage.setItem('rehab_products', JSON.stringify(remaining))
    this.disabled = false
    this.textContent = '📦 Migrate Local Products'
    showToast(`Migrated ${migrated}/${localOnly.length} products to Firestore!`, 'ok')
    loadAdminProducts()
  })
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function(e) {
    e.preventDefault()
    const t = document.querySelector(this.getAttribute('href'))
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' })
  }))

  // Header scroll
  let lastScroll = 0
  window.addEventListener('scroll', () => {
    const h = document.querySelector('.header')
    const cur = window.pageYOffset
    h.classList.toggle('scrolled', cur > 50)
    h.style.transform = cur > lastScroll && cur > 200 ? 'translateY(-100%)' : 'translateY(0)'
    lastScroll = cur
  }, { passive: true })

  // Mobile menu
  document.querySelector('.menu-toggle').addEventListener('click', function() {
    const nav = document.querySelector('.nav-links')
    nav.classList.toggle('open')
    if (nav.classList.contains('open')) {
      Object.assign(nav.style, { display:'flex', flexDirection:'column', position:'absolute', top:'72px', left:'0', right:'0', background:'rgba(255,255,255,0.98)', backdropFilter:'blur(20px)', padding:'24px', gap:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', zIndex:'999' })
    } else { nav.style.display = '' }
  })
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.remove('open')
    document.querySelector('.nav-links').style.display = ''
  }))

  // Product modal controls
  document.getElementById('prodModalClose').addEventListener('click', closeProductModal)
  document.getElementById('prodModalBg').addEventListener('click', closeProductModal)
  document.getElementById('productsGrid').addEventListener('click', function(e) {
    const card = e.target.closest('.product-card')
    if (!card) return
    if (e.target.closest('.add-to-cart-btn') || e.target.closest('.wish-heart') || e.target.closest('.whatsapp-btn')) return
    openProductModal(card.dataset.id)
  })
  document.getElementById('productsGrid').addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const card = e.target.closest('.product-card')
    if (!card) return
    e.preventDefault()
    openProductModal(card.dataset.id)
  })

  // Cart drawer controls
  document.getElementById('cartClose').addEventListener('click', closeCartDrawer)
  document.getElementById('cartOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeCartDrawer()
  })
  document.querySelectorAll('.icon-btn').forEach(btn => btn.addEventListener('click', () => {
    const label = btn.getAttribute('aria-label')
    if (label === 'Cart') openCartDrawer()
    else if (label === 'Wishlist') openWishlistDrawer()
  }))
  document.getElementById('cartCheckoutBtn').addEventListener('click', showCheckout)
  document.getElementById('chkBackBtn').addEventListener('click', () => {
    document.getElementById('checkoutSection').classList.remove('show')
    document.getElementById('cartBody').style.display = 'block'
    document.getElementById('cartFooter').style.display = cart.length ? 'block' : 'none'
    renderCartDrawer()
  })
  document.getElementById('chkPlaceBtn').addEventListener('click', placeOrder)
  document.getElementById('chkContinueBtn').addEventListener('click', closeCartDrawer)

  // Load More button
  document.getElementById('loadMoreBtn')?.addEventListener('click', loadMore)

  // Wishlist drawer controls
  document.getElementById('wishClose').addEventListener('click', closeWishlistDrawer)
  document.getElementById('wishOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeWishlistDrawer()
  })

  // Unified Escape key handler
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return
    if (document.getElementById('prodModal').classList.contains('show')) closeProductModal()
    else if (document.getElementById('wishOverlay').classList.contains('show')) closeWishlistDrawer()
    else if (document.getElementById('cartOverlay').classList.contains('show')) closeCartDrawer()
  })

})
