# 🔐 Local Admin Bypass - Quick Setup

## 🚀 Use This if Firebase Authentication is Not Working

If you're getting Firebase authentication errors, you can enable a **local admin bypass** to test the Rehab Store admin panel without Firebase.

---

## ✅ Enable Local Admin Bypass

### Step 1: Edit index.html
Find this line (around line 1668):
```javascript
const LOCAL_ADMIN_BYPASS = false;
```

Change it to:
```javascript
const LOCAL_ADMIN_BYPASS = true;
```

### Step 2: Note the Credentials
The local admin credentials are hardcoded:
- **Email**: `admin@local.test`
- **Password**: `admin123`

### Step 3: Save and Refresh
1. Save the file
2. Refresh your browser (http://localhost:3001)
3. Click **Admin** link
4. Use the local credentials to login

---

## ✅ What Works with Local Bypass

✅ **Admin Panel Access** - Login without Firebase
✅ **Product Management** - Add, edit, delete products
✅ **Order Management** - View, delete orders
✅ **Subscriber Management** - View, delete subscribers
✅ **All Admin Functions** - Full CRUD operations
✅ **Product Display** - Products will show on the store
✅ **Order Processing** - Customers can place orders (stored locally)

---

## ⚠️ Important Notes

### Development Only
- **This is for testing only**
- **Remove before production deployment**
- **Anyone with the credentials can access admin panel**
- **No real authentication - just a simple check**

### Limitations
- Orders and subscribers are stored in Firestore (if available)
- If Firestore is not connected, some features may not save
- Firebase authentication is bypassed entirely

### Security Warning
This bypass allows anyone who knows the credentials to access your admin panel. **NEVER use this in production** with real customer data.

---

## 🔧 How to Switch Back to Firebase

When you're ready to use real Firebase authentication:

### Step 1: Set Up Firebase (see FIREBASE_AUTH_FIX.md)
1. Enable Email/Password authentication in Firebase Console
2. Create admin user with your preferred credentials

### Step 2: Disable Local Bypass
Change this line back to:
```javascript
const LOCAL_ADMIN_BYPASS = false;
```

### Step 3: Use Firebase Credentials
Login with your Firebase admin credentials:
- Email: The one you created in Firebase Console
- Password: The one you set for that user

---

## 🎯 Quick Test

1. **Enable bypass**: Set `LOCAL_ADMIN_BYPASS = true`
2. **Refresh page**: http://localhost:3001
3. **Click Admin** link in navigation
4. **Login with**:
   - Email: `admin@local.test`
   - Password: `admin123`
5. **Test features**:
   - Add a product
   - View products on store page
   - Place a test order
   - Check admin dashboard

---

## 📝 Configuration Options

You can customize the local admin credentials by editing these lines:

```javascript
const LOCAL_ADMIN_EMAIL = 'admin@local.test';    // Change this
const LOCAL_ADMIN_PASS = 'admin123';             // Change this
```

---

## 🔥 Troubleshooting

**Problem**: Bypass not working
- **Fix**: Make sure `LOCAL_ADMIN_BYPASS = true`
- **Fix**: Check for typos in email/password
- **Fix**: Refresh the browser after changing the code

**Problem**: Admin panel not showing
- **Fix**: Check browser console (F12) for errors
- **Fix**: Make sure you clicked the Admin link, not a different button

**Problem**: Products not saving
- **Fix**: If Firestore is not connected, products won't save permanently
- **Fix**: Check Firebase connection in browser console

---

**For Production**: Always disable local bypass and use proper Firebase authentication!