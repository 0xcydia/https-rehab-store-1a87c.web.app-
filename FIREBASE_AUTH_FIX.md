# 🔥 Firebase Authentication Fix Guide

## 🚨 Problem: "Firebase: The supplied auth credential is incorrect, malformed or has expired"

This error occurs when trying to log in to the admin panel because:
1. The admin user doesn't exist in Firebase Authentication
2. The password is incorrect
3. Email authentication is not enabled in Firebase
4. The Firebase project configuration is wrong

---

## ✅ Solution 1: Create Admin User in Firebase Console (RECOMMENDED)

### Step 1: Go to Firebase Console
1. Open: https://console.firebase.google.com/
2. Select your project: **rehab-store-1a87c**

### Step 2: Enable Email/Password Authentication
1. Click **Authentication** in the left menu
2. Click **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

### Step 3: Create Admin User
1. Click **Users** tab in Authentication
2. Click **Add user**
3. Enter:
   - **Email**: `admin@rehabstore.com`
   - **Password**: `ARCklRIdXhOxlfwZ` (or your preferred password)
4. Click **Add user**

### Step 4: Test Admin Login
1. Go to: http://localhost:3001
2. Click **Admin** link in the navigation
3. Enter credentials:
   - Email: `admin@rehabstore.com`
   - Password: `ARCklRIdXhOxlfwZ`
4. Click **Log In**

---

## ✅ Solution 2: Use the UID You Already Created

From the session history, you mentioned getting UID: `Qm3ZJNrhH4WaROVouOhkgElwzsh2`

This means you already created a user! Try logging in with:
- **Email**: The email you used to create this user
- **Password**: The password you used

If you don't remember the email/password, you can:
1. Go to Firebase Console → Authentication → Users
2. Find the user with UID: `Qm3ZJNrhH4WaROVouOhkgElwzsh2`
3. Check the email address
4. Click the 3-dot menu and select **Change password** to set a new one

---

## ✅ Solution 3: Add Local Admin Bypass (Temporary)

If you want to test the admin panel without Firebase authentication, you can enable a **local admin bypass**.

### This will allow you to:
- Access admin panel without Firebase login
- Add products, view orders, manage subscribers
- Test all functionality locally

**✅ LOCAL BYPASS IS NOW ENABLED IN THE CODE!**

See: [LOCAL_ADMIN_BYPASS.md](LOCAL_ADMIN_BYPASS.md) for complete setup instructions.

### Quick Setup:
1. Edit index.html and change: `const LOCAL_ADMIN_BYPASS = false;` to `true`
2. Refresh browser
3. Login with: Email: `admin@local.test`, Password: `admin123`

**⚠️ WARNING**: This is for development only. Remove before production!

---

## 📋 Firebase Project Configuration

Your current configuration in index.html:
```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyATT99dFcVNvAHPn3JjXvjxI3-kWZia7yA',
  authDomain: 'rehab-store-1a87c.firebaseapp.com',
  projectId: 'rehab-store-1a87c',
  storageBucket: 'rehab-store-1a87c.firebasestorage.app',
  messagingSenderId: '754241724145',
  appId: '1:754241724145:web:32b3506799243d1a8d9350'
}
```

### Verify Your Configuration:
1. Go to Firebase Console
2. Click ⚙️ (settings) → **Project settings**
3. Scroll down to **Your apps**
4. Check that the configuration matches exactly

### If Configuration is Wrong:
1. Click **Add app** → **Web**
2. Register your app with any name (e.g., "Rehab Store Web")
3. Copy the new configuration
4. Update the `firebaseConfig` in index.html

---

## 🔧 Firestore Security Rules

Make sure your Firestore security rules allow read access for products:

### firestore.rules (should contain):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Admin-only for orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // Public write for orders (so customers can place orders)
    match /orders/{orderId} {
      allow create: if true;  // Allow anyone to create orders
      allow read, update, delete: if request.auth != null;
    }
    
    // Public write for subscribers
    match /subscribers/{subscriberId} {
      allow create: if true;  // Allow anyone to subscribe
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

---

## 🎯 Quick Test Checklist

### Test Firebase Connection:
1. Open browser console (F12)
2. Look for message: `✅ Firebase backend is working 100%!`
3. If you see errors, Firebase is not connected properly

### Test Authentication:
1. Click **Admin** link
2. Try logging in with:
   - Email: `admin@rehabstore.com`
   - Password: `ARCklRIdXhOxlfwZ`
3. If it works → ✅ Authentication is working
4. If it fails → ❌ Use solutions above

---

## 🆘 Still Having Issues?

### Common Problems and Fixes:

**Problem**: "Project not found"
- **Fix**: Make sure project ID is exactly `rehab-store-1a87c`

**Problem**: "API key not valid"
- **Fix**: Check that your Firebase project exists and the API key is correct

**Problem**: "Email/password accounts are disabled"
- **Fix**: Enable Email/Password in Authentication → Sign-in methods

**Problem**: "User not found"
- **Fix**: Create the admin user in Firebase Console

**Problem**: "Permission denied"
- **Fix**: Check Firestore security rules (see above)

---

## 📞 Need Help?

If you're still stuck, tell me:
1. What exact error message you're seeing
2. What email/password you're trying to use
3. Whether you see any errors in the browser console (F12)

I can then provide specific guidance for your situation!

---

**Remember**: The Firebase project `rehab-store-1a87c` needs to exist and have Authentication enabled with Email/Password provider for admin login to work.