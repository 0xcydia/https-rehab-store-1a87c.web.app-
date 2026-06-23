# Firebase Setup Guide - Rehab Store

## ⚠️ IMPORTANT
**I cannot create Firebase projects or users for you.** You must do this yourself in your browser.

**Time required**: 5-10 minutes  
**Difficulty**: Easy (just follow the steps)  

---

## 🎯 Step-by-Step Setup

### Step 1: Open Firebase Console
🔗 **Go to**: https://console.firebase.google.com/

---

### Step 2: Create Project
1. Click **"Add project"** button
2. Enter **Project name**: `rehab-store-1a87c` (exactly this)
3. Click **"Continue"** 
4. Enable **Google Analytics** (optional) - Click **"Continue"**
5. Click **"Create project"**
6. **Wait** 30-60 seconds for project to be ready

✅ **Result**: Project `rehab-store-1a87c` created

---

### Step 3: Enable Authentication
1. In the left menu, click **Authentication**
2. Click **"Sign-in method"** tab
3. Find **Email/Password** in the list
4. Click the **pencil icon** ⚙️
5. Toggle **Email/Password** to **Enabled**
6. Click **"Save"**

✅ **Result**: Email/Password authentication enabled

---

### Step 4: Add Admin User
1. Click **Authentication** → **"Users"** tab
2. Click **"Add user"** button
3. Fill in the form:
   - **Email**: `admin@rehabstore.com`
   - **Password**: `ARCklRIdXhOxlfwZ`
   - **Confirm password**: `ARCklRIdXhOxlfwZ`
   - ✅ Check **"Email verified"**
4. Click **"Add user"**

✅ **Result**: Admin user created

---

### Step 5: Setup Firestore Database
1. In the left menu, click **Firestore Database**
2. Click **"Create database"**
3. Select **"Test mode"** (for development)
4. Click **"Next"**
5. Select your location (any is fine)
6. Click **"Enable"**

✅ **Result**: Firestore database ready

---

### Step 6: Verify Configuration

Your `index.html` should have this Firebase config:

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

✅ **Check**: This matches your project

---

## 🧪 Test Your Setup

1. **Open your store**: http://localhost:3001
2. **Click "Admin"** link in the top navigation
3. **Login modal appears** ✅
4. **Enter credentials**:
   - Email: `admin@rehabstore.com`
   - Password: `ARCklRIdXhOxlfwZ`
5. **Click "Log In"**
6. **Admin dashboard appears** ✅

---

## 🔗 Direct Links

After creating the project, bookmark these:

| Purpose | URL |
|---------|-----|
| Firebase Console | https://console.firebase.google.com/project/rehab-store-1a87c |
| Authentication | https://console.firebase.google.com/project/rehab-store-1a87c/authentication |
| Users | https://console.firebase.google.com/project/rehab-store-1a87c/authentication/users |
| Firestore | https://console.firebase.google.com/project/rehab-store-1a87c/firestore |
| Project Settings | https://console.firebase.google.com/project/rehab-store-1a87c/settings |

---

## 📝 Troubleshooting

### "Project already exists"
→ The project `rehab-store-1a87c` was already created. Just use it.

### "Project name already used"
→ Change to `rehab-store-1a87c-2` or similar, then update `index.html` projectId.

### "Email already exists"
→ The admin user already exists. Just login with it.

### "Invalid credentials"
→ Make sure you created the user with EXACTLY:
- Email: `admin@rehabstore.com`
- Password: `ARCklRIdXhOxlfwZ`

### "Firebase not initialized"
→ Check browser console (F12) for errors.

---

## 🎯 Quick Checklist

- [ ] Firebase project `rehab-store-1a87c` exists
- [ ] Email/Password authentication enabled
- [ ] Admin user `admin@rehabstore.com` created
- [ ] Password set to `ARCklRIdXhOxlfwZ`
- [ ] Firestore database created
- [ ] `index.html` has correct projectId

---

## 💡 Pro Tips

1. **Use a real email**: Instead of `admin@rehabstore.com`, use your own email
2. **Use a stronger password**: Change from `ARCklRIdXhOxlfwZ` to something more secure
3. **Update index.html**: If you use different credentials, update the admin email in the code
4. **Deploy later**: When ready, run `firebase init` and `firebase deploy`

---

## ✅ Done!

After completing these steps, your Rehab Store admin panel will work perfectly!

**Test it now**: http://localhost:3001 → Admin → Login

---

*Need help? The Firebase Console has excellent documentation and tooltips.*
