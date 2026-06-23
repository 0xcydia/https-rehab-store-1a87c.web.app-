# 🔍 Firebase Authentication Troubleshooting Guide

## 🚨 Current Error: "The supplied auth credential is incorrect, malformed or has expired"

This error persists even after setting up user auth email + password. Let's solve this systematically.

---

## 🎯 Step-by-Step Diagnosis

### Step 1: Verify Firebase Project Configuration

**Check if your Firebase project exists and has the correct configuration:**

```javascript
// Your current configuration in index.html:
const firebaseConfig = {
  apiKey: 'AIzaSyATT99dFcVNvAHPn3JjXvjxI3-kWZia7yA',
  authDomain: 'rehab-store-1a87c.firebaseapp.com',
  projectId: 'rehab-store-1a87c',
  storageBucket: 'rehab-store-1a87c.firebasestorage.app',
  messagingSenderId: '754241724145',
  appId: '1:754241724145:web:32b3506799243d1a8d9350'
}
```

#### 🔍 Verify in Firebase Console:
1. Go to: https://console.firebase.google.com/
2. Select project: **rehab-store-1a87c**
3. Click ⚙️ (settings) → **Project settings**
4. Scroll down to **Your apps**
5. **Check if API key matches**: `AIzaSyATT99dFcVNvAHPn3JjXvjxI3-kWZia7yA`

#### ❌ If API key doesn't match:
- Your project might have a different API key
- Click **Add app** → **Web** → copy new config
- Update `firebaseConfig` in index.html

#### ❌ If project doesn't exist:
- You need to create the Firebase project first
- Go to: https://console.firebase.google.com/
- Click **Add project** → **rehab-store-1a87c**
- Create the project
- Then add a web app and copy the configuration

---

### Step 2: Verify Email/Password Authentication is Enabled

1. In Firebase Console, go to **Authentication**
2. Click **Sign-in method** tab
3. **Check if Email/Password is enabled**
4. If not enabled:
   - Click **Email/Password** → **Enable** → **Save**

---

### Step 3: Verify Admin User Exists

1. In Firebase Console, go to **Authentication** → **Users**
2. **Check if your admin user exists**
3. Click on the user to see details
4. Verify:
   - Email is correct
   - User is not disabled
   - Email is verified (if required)

#### ❌ If user doesn't exist:
- Click **Add user**
- Enter: `admin@rehabstore.com` and password `ARCklRIdXhOxlfwZ`
- Click **Add user**

#### ❌ If user is disabled:
- Click 3-dot menu → **Enable user**

---

### Step 4: Test Firebase Connection Directly

**Add this test to your browser console (F12):**

```javascript
// Test Firebase initialization
firebase.auth().signInWithEmailAndPassword('admin@rehabstore.com', 'ARCklRIdXhOxlfwZ')
  .then(userCredential => {
    console.log('✅ Firebase auth SUCCESS! User:', userCredential.user.email);
  })
  .catch(error => {
    console.error('❌ Firebase auth ERROR:', error.code, error.message);
  });
```

#### Possible Error Codes and Meanings:

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/invalid-email` | Email format invalid | Check email format |
| `auth/user-disabled` | User account disabled | Enable user in Firebase Console |
| `auth/user-not-found` | User doesn't exist | Create user in Firebase Console |
| `auth/wrong-password` | Wrong password | Reset password in Firebase Console |
| `auth/invalid-credential` | Auth not enabled | Enable Email/Password in Sign-in methods |
| `auth/network-request-failed` | Network error | Check internet connection |
| `auth/app-not-authorized` | API key wrong | Verify project configuration |

---

### Step 5: Check Browser Console for Errors

1. Open browser console: **F12** or **Ctrl+Shift+I**
2. Click **Console** tab
3. Refresh the page
4. **Look for Firebase errors**

#### Common Console Errors:

**Error: "Firebase App not initialized"**
- Solution: Check Firebase config in index.html

**Error: "No Firebase App found"**
- Solution: Check if firebase.initializeApp() is called

**Error: "API key not valid"**
- Solution: Verify project exists and API key is correct

**Error: "Project not found"**
- Solution: Create Firebase project or check project ID

---

## 🔧 Common Fixes

### Fix 1: Project Doesn't Exist

**Symptoms:**
- Error: "Project not found"
- Firebase Console doesn't show your project

**Solution:**
```bash
# 1. Create new Firebase project
# 2. Go to: https://console.firebase.google.com/
# 3. Click "Add project"
# 4. Name it: rehab-store-1a87c
# 5. Click "Continue" and create
# 6. Add web app and copy configuration
# 7. Update firebaseConfig in index.html
```

---

### Fix 2: Email/Password Not Enabled

**Symptoms:**
- Error: "auth/invalid-credential" or "auth/operation-not-allowed"
- Authentication → Sign-in methods doesn't show Email/Password as enabled

**Solution:**
1. Firebase Console → Authentication → Sign-in method
2. Find **Email/Password** 
3. Click **Enable**
4. Click **Save**

---

### Fix 3: Wrong Project Configuration

**Symptoms:**
- Error: "auth/app-not-authorized" or "API key not valid"
- Firebase Console shows different API key

**Solution:**
1. Firebase Console → Project settings → Your apps
2. Copy the **correct configuration**
3. Update `firebaseConfig` in index.html:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_CORRECT_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.storage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

---

### Fix 4: User Email/Password Incorrect

**Symptoms:**
- Error: "auth/wrong-password" or "auth/user-not-found"
- You created a user but can't login

**Solution:**
1. Firebase Console → Authentication → Users
2. Find your user
3. Click 3-dot menu → **Change password**
4. Set new password: `ARCklRIdXhOxlfwZ`
5. Or check the exact email you used

---

## 🎯 Quick Checklist

### ✅ Do This First:

1. **[ ]** Open Firebase Console: https://console.firebase.google.com/
2. **[ ]** Project **rehab-store-1a87c** exists
3. **[ ]** Authentication → Sign-in method → **Email/Password is ENABLED**
4. **[ ]** Authentication → Users → **admin@rehabstore.com exists**
5. **[ ]** User is **not disabled**
6. **[ ]** Password is **ARCklRIdXhOxlfwZ** (or what you set)

### ✅ Test Connection:

1. Open browser console (F12)
2. Run this test:
```javascript
firebase.auth().signInWithEmailAndPassword('admin@rehabstore.com', 'ARCklRIdXhOxlfwZ')
  .then(() => console.log('✅ Login SUCCESS!'))
  .catch(e => console.error('❌ Login FAILED:', e.code, e.message));
```

### ✅ If Still Failing:

1. **Use Local Bypass** (for testing):
   - Edit index.html: `const LOCAL_ADMIN_BYPASS = true;`
   - Login: `admin@local.test` / `admin123`
   - See: LOCAL_ADMIN_BYPASS.md

2. **Check Exact Error Code** in console and match to table above

---

## 📞 Still Stuck?

**Tell me exactly:**
1. What error code do you see in the browser console?
2. Does project `rehab-store-1a87c` exist in Firebase Console?
3. Is Email/Password enabled in Authentication → Sign-in method?
4. Does user `admin@rehabstore.com` exist in Authentication → Users?

**With this info, I can give you the exact fix!**

---

## 🔥 Most Likely Solutions

Based on your error persisting after setting user auth:

### 90% Likely: Email/Password Not Enabled
Even if you created a user, if Email/Password sign-in method is disabled, authentication will fail.

**Fix:** Firebase Console → Authentication → Sign-in method → Enable Email/Password → Save

### 80% Likely: Wrong Project Configuration
The API key might be from a different project.

**Fix:** Compare API key in index.html with Firebase Console → Project settings → Your apps

### 70% Likely: User Credentials Wrong
You might have created the user with different email/password.

**Fix:** Firebase Console → Authentication → Users → Check user details → Reset password if needed

---

**💡 Pro Tip:** Use the **Local Admin Bypass** to test all features immediately, then fix Firebase authentication later for production!