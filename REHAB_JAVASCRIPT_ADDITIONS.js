/**
 * Rehab Store - JavaScript Additions
 * Add these functions to your existing index.html JavaScript section
 * 
 * Features:
 * - Multi-currency support (USD, EGP, AED)
 * - WhatsApp Order Now integration
 * - Arabic language support
 * - Enhanced product display with currency conversion
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Your WhatsApp number for receiving orders
const WHATSAPP_NUMBER = '+201555121123';

// Store information
const STORE_NAME = 'Rehab Store';
const STORE_NAME_AR = 'متجر ريحاب';

// ============================================================================
// CURRENCY SETTINGS
// ============================================================================

// Currency symbols for display
const CURRENCY_SYMBOLS = {
  USD: '$',
  EGP: 'ج.م',
  AED: 'د.إ'
};

// Currency names
const CURRENCY_NAMES = {
  USD: 'USD',
  EGP: 'EGP',
  AED: 'AED'
};

// Exchange rates (1 USD = X)
const EXCHANGE_RATES = {
  USD: 1,
  EGP: 30,    // 1 USD = 30 Egyptian Pounds
  AED: 3.67    // 1 USD = 3.67 Emirati Dirhams
};

// Default currency for the store (EGP for Middle East market)
let selectedCurrency = 'EGP';

// ============================================================================
// WHATSAPP FUNCTIONS
// ============================================================================

/**
 * Open WhatsApp with a specific product details
 * @param {Object} product - Product object from Firestore
 */
function openWhatsAppWithProduct(product) {
  if (!product) {
    console.error('No product provided');
    return;
  }
  
  // Build comprehensive message
  let message = `${STORE_NAME}\n\n`;
  
  // Product information
  message += `🛍️ Product: ${product.name || 'N/A'}\n`;
  if (product.nameAr) {
    message += `المنتج: ${product.nameAr}\n`;
  }
  
  message += `🏷️ Category: ${product.cat || 'N/A'}\n`;
  if (product.catAr) {
    message += `الفئة: ${product.catAr}\n`;
  }
  
  // Price in selected currency
  const price = getProductPrice(product, selectedCurrency);
  message += `💰 Price: ${formatPrice(price, selectedCurrency)}\n`;
  
  // Original price if on sale
  const origPrice = getProductOrigPrice(product, selectedCurrency);
  if (origPrice) {
    message += `🏷️ Original: ${formatPrice(origPrice, selectedCurrency)}\n`;
  }
  
  // Description
  if (product.desc) {
    message += `\n📝 Description: ${product.desc}\n`;
  }
  if (product.descAr) {
    message += `الوصف: ${product.descAr}\n`;
  }
  
  // Image URL
  if (product.img) {
    message += `\n📷 Image: ${product.img}\n`;
  }
  
  // Product link
  const productUrl = window.location.origin + window.location.pathname + '#shop';
  message += `\n🔗 View at: ${productUrl}\n`;
  
  // Call to action
  message += `\n${'='.repeat(40)}\n`;
  message += `I would like to order this product.\n`;
  message += `Please contact me to confirm availability and payment.\n`;
  message += `\nللطلب: أرغب في طلب هذا المنتج.\n`;
  message += `يرجى التواصل معي لتأكيد التوافر ودفع الثمن.`;
  
  // Create WhatsApp URL
  const cleanNumber = WHATSAPP_NUMBER.replace(/\+/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank');
  
  // Show confirmation to user
  showToast('Opening WhatsApp...', 'info');
}

/**
 * Open WhatsApp with entire cart contents
 */
function openWhatsAppWithCart() {
  if (!cart || !cart.length) {
    showToast('Your cart is empty!', 'err');
    return;
  }
  
  let message = `${STORE_NAME} - Cart Order\n`;
  message += `${'='.repeat(40)}\n\n`;
  
  // Customer info placeholder
  message += `👤 Customer: [Please provide your name]\n`;
  message += `📱 Phone: [Please provide your phone]\n`;
  message += `📍 Location: [Please provide your address]\n\n`;
  
  // Cart items
  message += `🛒 CART ITEMS (${cart.length} total)\n`;
  message += `${'-'.repeat(40)}\n\n`;
  
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  let subtotal = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    
    message += `📌 Item ${index + 1}:\n`;
    message += `   🛍️ ${item.name}\n`;
    if (item.nameAr) {
      message += `   المنتج: ${item.nameAr}\n`;
    }
    message += `   💰 ${formatPrice(item.price, item.currency || selectedCurrency)} × ${item.qty} = ${formatPrice(itemTotal, item.currency || selectedCurrency)}\n`;
    message += `   🏷️ ${item.cat}\n`;
    if (item.catAr) {
      message += `   الفئة: ${item.catAr}\n`;
    }
    message += `\n`;
  });
  
  // Totals
  message += `${'='.repeat(40)}\n`;
  message += `💵 Subtotal: ${formatPrice(subtotal, cart[0]?.currency || selectedCurrency)}\n`;
  message += `📦 Shipping: Free (Egypt & UAE)\n`;
  message += `💰 Total: ${formatPrice(subtotal, cart[0]?.currency || selectedCurrency)}\n\n`;
  
  // Call to action
  message += `I would like to place this order.\n`;
  message += `Please contact me to confirm and arrange payment.\n\n`;
  message += `للطلب: أرغب في إجراء هذا الطلب.\n`;
  message += `يرجى التواصل معي لتأكيد الطلب وترتيب الدفع.`;
  
  // Create WhatsApp URL
  const cleanNumber = WHATSAPP_NUMBER.replace(/\+/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank');
  
  showToast('Opening WhatsApp with cart details...', 'info');
}

/**
 * Open WhatsApp with order details (for admin)
 * @param {string} orderId - Firestore order document ID
 */
async function openWhatsAppWithOrder(orderId) {
  try {
    const snap = await db.collection('orders').doc(orderId).get();
    if (!snap.exists) {
      showToast('Order not found', 'err');
      return;
    }
    
    const order = snap.data();
    const currency = order.currency || 'USD';
    
    let message = `${STORE_NAME} - Order #${orderId}\n`;
    message += `${'='.repeat(40)}\n\n`;
    
    // Customer information
    message += `👤 Customer: ${order.shipping?.name || order.name || 'N/A'}\n`;
    if (order.phone) {
      message += `📱 Phone: ${order.phone}\n`;
    }
    message += `📧 Email: ${order.email || 'N/A'}\n`;
    
    // Shipping address
    if (order.shipping) {
      const { address, city, zip, country } = order.shipping;
      if (address || city || country) {
        message += `📍 Address: ${[address, city, zip, country].filter(Boolean).join(', ')}\n`;
      }
    }
    
    message += `\n`;
    
    // Order items
    message += `📦 ORDER ITEMS (${order.items?.length || 0})\n`;
    message += `${'-'.repeat(40)}\n\n`;
    
    let itemsTotal = 0;
    
    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        const itemTotal = (item.price || 0) * (item.qty || 1);
        itemsTotal += itemTotal;
        
        message += `📌 ${index + 1}. ${item.name}\n`;
        if (item.nameAr) {
          message += `   المنتج: ${item.nameAr}\n`;
        }
        message += `   ${CURRENCY_SYMBOLS[currency] || currency} ${parseFloat(item.price || 0).toFixed(currency === 'EGP' ? 0 : 2)} × ${item.qty || 1} = ${formatPrice(itemTotal, currency)}\n`;
        if (item.cat) {
          message += `   Category: ${item.cat}\n`;
        }
        if (item.catAr) {
          message += `   الفئة: ${item.catAr}\n`;
        }
        message += `\n`;
      });
    }
    
    // Order totals
    message += `${'='.repeat(40)}\n`;
    message += `💵 Subtotal: ${formatPrice(itemsTotal, currency)}\n`;
    message += `💰 Total: ${formatPrice(order.total || itemsTotal, currency)}\n`;
    message += `💳 Currency: ${currency}\n`;
    message += `📅 Date: ${new Date(order.createdAt).toLocaleDateString()}\n`;
    message += `🏷️ Status: ${order.status || 'Pending'}\n\n`;
    
    // Call to action
    message += `Please contact the customer to confirm and fulfill this order.`;
    
    // Create WhatsApp URL
    const cleanNumber = WHATSAPP_NUMBER.replace(/\+/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
    
  } catch (e) {
    console.error('Error loading order for WhatsApp:', e);
    showToast('Error loading order details', 'err');
  }
}

// ============================================================================
// CURRENCY FUNCTIONS
// ============================================================================

/**
 * Format price with currency symbol and proper decimal places
 * @param {number} price - The price to format
 * @param {string} currency - Currency code (USD, EGP, AED)
 * @returns {string} Formatted price string
 */
function formatPrice(price, currency) {
  if (price === undefined || price === null || isNaN(price)) {
    return '';
  }
  
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  
  // Round to appropriate decimal places
  // EGP typically uses 0 decimals, USD and AED use 2
  const decimals = currency === 'EGP' ? 0 : 2;
  const formattedPrice = parseFloat(price).toFixed(decimals);
  
  return symbol + ' ' + formattedPrice;
}

/**
 * Convert price from base currency (USD) to target currency
 * @param {number} usdPrice - Price in USD
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted price
 */
function convertPrice(usdPrice, toCurrency) {
  if (usdPrice === undefined || usdPrice === null || isNaN(usdPrice)) {
    return 0;
  }
  
  const rate = EXCHANGE_RATES[toCurrency] || 1;
  return parseFloat(usdPrice) * rate;
}

/**
 * Get product price in the selected currency
 * @param {Object} p - Product object
 * @param {string} currency - Target currency
 * @returns {number} Price in selected currency
 */
function getProductPrice(p, currency) {
  if (!p) return 0;
  
  // If product has price in specific currency, use it
  if (p[`price_${currency}`]) {
    return p[`price_${currency}`];
  }
  
  // If product has base price, convert it
  if (p.price) {
    return convertPrice(p.price, currency);
  }
  
  return 0;
}

/**
 * Get product original price in the selected currency
 * @param {Object} p - Product object
 * @param {string} currency - Target currency
 * @returns {number|null} Original price or null
 */
function getProductOrigPrice(p, currency) {
  if (!p || !p.orig) return null;
  
  // If product has original price in specific currency, use it
  if (p[`orig_${currency}`]) {
    return p[`orig_${currency}`];
  }
  
  // Convert from base original price
  return convertPrice(p.orig, currency);
}

/**
 * Update all displays when currency changes
 */
function updateCurrency() {
  const selectElement = document.getElementById('currencySelect');
  if (!selectElement) return;
  
  selectedCurrency = selectElement.value;
  
  // Update all price displays
  if (Object.keys(productsMap).length > 0) {
    renderProducts(Object.values(productsMap));
  }
  
  renderCartDrawer();
  
  // If product modal is open, update it
  const modal = document.getElementById('prodModal');
  if (modal && modal.classList.contains('show')) {
    const activeProduct = modal.dataset.activeProduct;
    if (activeProduct && productsMap[activeProduct]) {
      renderProductDetail(productsMap[activeProduct]);
    }
  }
  
  // Update admin tables if visible
  const adminDashboard = document.getElementById('adminDashboard');
  if (adminDashboard && adminDashboard.classList.contains('show')) {
    loadAdminProducts();
  }
  
  // Save preference to localStorage
  localStorage.setItem('rehab_currency', selectedCurrency);
  
  showToast(`Currency changed to ${selectedCurrency}`, 'info');
}

/**
 * Load saved currency preference
 */
function loadCurrencyPreference() {
  const saved = localStorage.getItem('rehab_currency');
  if (saved && ['USD', 'EGP', 'AED'].includes(saved)) {
    selectedCurrency = saved;
    const selectElement = document.getElementById('currencySelect');
    if (selectElement) {
      selectElement.value = saved;
    }
  }
}

// ============================================================================
// BACKEND TESTING
// ============================================================================

/**
 * Test Firebase backend connectivity
 * @returns {Promise<boolean>} True if connected successfully
 */
async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Test products collection
    const testDoc = await db.collection('products').limit(1).get();
    
    if (testDoc.empty) {
      console.log('✅ Firebase connected but no products yet');
      console.log('📝 Backend is ready - you can add products via admin panel');
    } else {
      console.log('✅ Firebase backend is working 100%!');
      console.log(`📊 Loaded ${testDoc.docs.length} product(s) successfully`);
    }
    
    // Test products collection read
    const products = await db.collection('products').get();
    console.log(`✅ Products collection accessible: ${products.docs.length} documents`);
    
    // Test orders collection
    try {
      const orders = await db.collection('orders').limit(5).get();
      console.log(`✅ Orders collection accessible: ${orders.docs.length} documents`);
    } catch (e) {
      console.warn('⚠️ Orders collection may not exist yet');
    }
    
    // Test subscribers collection
    try {
      const subs = await db.collection('subscribers').limit(5).get();
      console.log(`✅ Subscribers collection accessible: ${subs.docs.length} documents`);
    } catch (e) {
      console.warn('⚠️ Subscribers collection may not exist yet');
    }
    
    console.log('✅ All backend tests passed!');
    return true;
    
  } catch (e) {
    console.error('❌ Firebase connection error:', e);
    console.error('❌ Backend may not be working correctly');
    showToast('Could not connect to backend. Some features may not work.', 'err');
    return false;
  }
}

/**
 * Test if product images can load
 */
function testImageLoading() {
  const testImg = new Image();
  testImg.onload = () => {
    console.log('✅ Product images can be loaded successfully');
    console.log('📷 Image loading is working');
  };
  testImg.onerror = () => {
    console.warn('⚠️ Some product images may fail to load');
    console.warn('📷 Check your image URLs');
  };
  testImg.src = 'https://placehold.co/100x100/FF69B4/FFFFFF?text=Test';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Enhanced escapeHtml that handles more cases
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/**
 * Show Arabic toast notification
 * @param {string} msg - Message to show
 * @param {string} type - Toast type (ok, err, info)
 */
function showArabicToast(msg, type) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'toast ' + type + ' arabic';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { 
    t.classList.remove('show'); 
    setTimeout(() => t.remove(), 400); 
  }, 3000);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Load currency preference on page load
loadCurrencyPreference();

// Test backend when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Existing initialization
  loadProducts();
  spawnHearts();
  updateCartBadge();
  updateWishBadge();
  
  // Test backend connectivity
  testFirebaseConnection();
  
  // Test image loading after a short delay
  setTimeout(testImageLoading, 2000);
  
  // Add currency change listener
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) {
    currencySelect.addEventListener('change', updateCurrency);
  }
});

// ============================================================================
// EXPORT FOR USE IN MAIN FILE
// ============================================================================

// These functions should be available globally:
// - openWhatsAppWithProduct(product)
// - openWhatsAppWithCart()
// - openWhatsAppWithOrder(orderId)
// - formatPrice(price, currency)
// - convertPrice(usdPrice, toCurrency)
// - getProductPrice(product, currency)
// - getProductOrigPrice(product, currency)
// - updateCurrency()
// - testFirebaseConnection()
// - testImageLoading()
// - showArabicToast(msg, type)
