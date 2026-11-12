# 🔧 Seller Login Network Error - Complete Fix Guide

## ✅ Your Current Status
- Frontend: Running on `http://localhost:5174` (or 5173)
- Backend: Should run on `http://localhost:5000`
- API: `POST /api/seller/login`

---

## 🚀 Step-by-Step Fix

### STEP 1: Verify Backend Server is Running

**In a NEW terminal (Terminal 2):**

```bash
cd server
node server.js
```

**Expected Output:**
```
=== SERVER STARTUP ===
Node Env: development
Port: 5000
Allowed CORS Origins: [ 'http://localhost:5173', 'http://localhost:5174', ... ]
Server is running on http://localhost:5000
```

✅ If you see this, backend is working. If not, check Node.js is installed.

---

### STEP 2: Check Seller Credentials in Backend

**File: `server/.env`**

Must have these exact credentials:
```env
SELLER_EMAIL="admin@example.com"
SELLER_PASSWORD="admin123"
```

**If you changed them, the login will fail!**

---

### STEP 3: Check Frontend URL Configuration

**File: `client/.env`**

Must have:
```env
VITE_BACKEND_URL="http://localhost:5000"
```

✅ **Restart frontend** if you changed this:
```bash
# In Terminal 1 (frontend)
# Press Ctrl+C to stop
# Then run again:
npm run dev
```

---

### STEP 4: Open Browser Console & Test Login

**1. Open your browser to:** `http://localhost:5174` (or 5173)

**2. Press `F12` to open Developer Tools**

**3. Go to Console tab** (should be empty)

**4. Navigate to Seller Login:** 
   - Click on seller login link in navbar, or
   - Go directly to: `http://localhost:5174/seller-login`

**5. Fill in the login form:**
   - Email: `admin@example.com`
   - Password: `admin123`

**6. Click Login Button**

**7. Watch the Console** - You should see:
```
=== SELLER LOGIN ATTEMPT ===
Email: admin@example.com
Backend URL: http://localhost:5000
```

Then after a second:
```
Login Response: {
  success: true,
  message: "Seller logged in successfully",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  seller: { email: "admin@example.com" }
}
```

---

## 🐛 Troubleshooting Network Error

### Problem: "Network Error" Message in App

**Check Backend Console for:**
```
=== SELLER LOGIN REQUEST ===
Request Body: { email: 'admin@example.com', password: 'admin123' }
```

If you see this, backend received the request. Check credentials next.

---

### Problem: No Log in Backend Console

**Check:**
1. Backend is running? (Run `node server.js` again)
2. Port 5000 is correct? (Check `server/.env` for PORT)
3. CORS error? (Check browser DevTools Network tab)

**In Browser DevTools (F12) → Network tab:**
- Click the login request
- Check Response tab for error

---

### Problem: "Cannot POST /api/seller/login"

**Solution:** Backend is NOT running.

```bash
cd server
node server.js
```

Wait for: `Server is running on http://localhost:5000`

---

### Problem: "Invalid credentials"

**Backend shows but says invalid:**

Check your `.env` file exactly matches:
```env
SELLER_EMAIL="admin@example.com"
SELLER_PASSWORD="admin123"
```

**Troubleshooting:**
- Spaces? No spaces allowed
- Quotes? Use double quotes exactly as shown
- Typos? Copy-paste from this guide

---

### Problem: CORS Origin Denied Error

**Check backend console for:**
```
CORS Request from origin: http://localhost:XXXX
```

If origin not in allowed list, add it to `server/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  // Add your port here if different
];
```

---

## ✨ What Should Happen on Successful Login

**Frontend Console Shows:**
```
Login Response: { success: true, token: "...", ... }
```

**App Behavior:**
1. Green "Seller login successful" toast appears
2. Page redirects to seller dashboard
3. Navbar shows seller is logged in

**Check localStorage (F12 → Application → Local Storage):**
- `sellerToken` - contains JWT token
- `sellerUser` - contains seller data

---

## 🔄 Test Complete Flow

### LOGIN TEST
1. ✅ Start backend: `node server.js`
2. ✅ Frontend running on 5174 (check address bar)
3. ✅ Go to `/seller-login`
4. ✅ Enter: `admin@example.com` / `admin123`
5. ✅ See "Seller login successful" toast
6. ✅ Redirected to dashboard
7. ✅ Check localStorage for token

### PAGE REFRESH TEST
1. ✅ Seller dashboard showing
2. ✅ Press F5 to refresh page
3. ✅ You should stay logged in (not redirected to login)
4. ✅ Seller data still visible

### LOGOUT TEST
1. ✅ Click logout button
2. ✅ See "Logged Out" toast
3. ✅ Redirected to home page
4. ✅ localStorage cleared (check Application tab)

---

## 📋 Complete Checklist

Before reporting issues, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running (5173, 5174, or 5175)
- [ ] `server/.env` has correct credentials
- [ ] `client/.env` has `VITE_BACKEND_URL="http://localhost:5000"`
- [ ] Browser console shows "=== SELLER LOGIN ATTEMPT ===" log
- [ ] Backend console shows "=== SELLER LOGIN REQUEST ===" log
- [ ] No CORS errors in browser console
- [ ] Token appears in localStorage after login
- [ ] You're redirected to seller dashboard

---

## 🆘 Still Not Working?

**Collect This Info:**

1. **Frontend Console Error:**
   - Screenshot or copy the red error message

2. **Backend Console Output:**
   - Show what appears when you click Login

3. **Browser Network Tab:**
   - Right-click login request → Copy as cURL
   - Share the status code and response

4. **Environment Variables:**
   - Verify `SELLER_EMAIL` and `SELLER_PASSWORD` in `server/.env`

---

## ⚡ Quick Restart Everything

If stuck, do a clean restart:

**Terminal 1 (Backend):**
```bash
cd server
node server.js
# Wait for "Server is running on http://localhost:5000"
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Wait for "Local: http://localhost:5174"
```

**Browser:**
- Clear cache: `Ctrl+Shift+Delete` → Clear all
- Go to: `http://localhost:5174/seller-login`
- Login with: `admin@example.com` / `admin123`

---

## 📚 Code Reference

### Correct Axios Login Request

```javascript
// In React component
try {
  const { data } = await axios.post(
    '/api/seller/login',
    { email, password },
    { withCredentials: true }
  );
  
  if (data.success && data.token) {
    // Save token
    localStorage.setItem('sellerToken', data.token);
    // Redirect
    navigate('/seller');
  }
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Correct Express Route

```javascript
// In server/routes/sellerRoute.js
sellerRouter.post('/login', loginSeller);

// In server/controllers/sellerController.js
export const loginSeller = async (req, res) => {
  const { email, password } = req.body;
  
  if (email === process.env.SELLER_EMAIL && 
      password === process.env.SELLER_PASSWORD) {
    // Generate token and send response
    res.json({ success: true, token: jwtToken });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
};
```

---

## 🎉 Success Indicators

✅ **You'll know it's fixed when:**
1. No more "Network Error" toast
2. Login works with correct credentials
3. Page redirects to seller dashboard
4. Token stored in localStorage
5. Page refresh keeps you logged in
