# Seller Login Network Error - Debugging Guide

## Quick Start - Test Connection

1. **Start Backend Server**
   ```bash
   cd server
   node server.js
   ```
   You should see:
   ```
   === SERVER STARTUP ===
   Node Env: development
   Port: 5000
   Allowed CORS Origins: ['http://localhost:5173', 'http://127.0.0.1:5173', ...]
   Server is running on http://localhost:5000
   ```

2. **Start Frontend**
   ```bash
   cd client
   npm run dev
   ```
   You should see:
   ```
   VITE v7.3.1  ready in 123 ms
   ➜  Local: http://localhost:5173
   ```

3. **Test API Connection**
   Open browser DevTools (F12) → Console tab, then run:
   ```javascript
   fetch('http://localhost:5000/').then(r => r.text()).then(console.log)
   ```
   Expected output: `API is Working`

---

## Test Seller Credentials

Before logging in, verify the backend credentials in `server/.env`:

```env
SELLER_EMAIL="admin@example.com"
SELLER_PASSWORD="admin123"
```

**Use these exact credentials to login:**
- Email: `admin@example.com`
- Password: `admin123`

---

## Debug Frontend Login Request

When you click Login, check **Browser Console (F12)**:

### Successful Request should show:
```
=== SELLER LOGIN ATTEMPT ===
Email: admin@example.com
Backend URL: http://localhost:5000
Login Response: {success: true, message: "Seller logged in successfully", token: "eyJhbGciOiJIUzI1NiIsInR5cCI...", seller: {email: "admin@example.com"}}
```

### Network Error should show details like:
```
Login Error: Error: Network Error
Error Response: undefined
Error Message: "Network Error"
```

---

## Debug Backend Login Request

When you submit login from frontend, check **Backend Console**:

### Successful login shows:
```
=== SELLER LOGIN REQUEST ===
Request Body: { email: 'admin@example.com', password: 'admin123' }
Request Headers: { ... }
Email from body: admin@example.com
Expected Email: admin@example.com
Email Match: true
Password Match: true
Token generated: eyJhbGciOiJIUzI1NiIsInR5cCI...
Login successful for: admin@example.com
```

### Failed credentials show:
```
=== SELLER LOGIN REQUEST ===
Request Body: { email: 'wrong@email.com', password: 'wrongpass' }
Email Match: false
Password Match: false
Login failed - invalid credentials
```

---

## Common Network Issues & Solutions

### Issue 1: "Cannot POST /api/seller/login"
**Problem:** Backend server is not running.
**Solution:**
```bash
cd server
node server.js
```
Check if you see `Server is running on http://localhost:5000`

### Issue 2: "CORS policy: Response to preflight request"
**Problem:** CORS origin not whitelisted.
**Solution:** The app is already configured to allow:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

If you're using a different port, add it to `server/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'YOUR_NEW_PORT_HERE'
];
```

### Issue 3: "Network error. Please check if backend is running"
**Problem:** Request times out or backend unreachable.
**Solution:**
1. Verify backend is running on port 5000
2. Check firewall isn't blocking port 5000
3. Verify `VITE_BACKEND_URL` in `client/.env` is correct
4. Test manually in browser console:
```javascript
fetch('http://localhost:5000/', {credentials: 'include'})
  .then(r => r.json())
  .then(console.log)
  .catch(e => console.error('Connection failed:', e))
```

### Issue 4: "Invalid credentials" when using correct email/password
**Problem:** Environment variables not loaded.
**Solution:**
1. Verify `server/.env` has:
   ```env
   SELLER_EMAIL="admin@example.com"
   SELLER_PASSWORD="admin123"
   JWT_SECRET="groceryweb#123"
   ```
2. Restart backend server after changing `.env`
3. Check backend console shows correct values:
   ```
   Expected Email: admin@example.com
   Expected Password: admin123
   ```

---

## Step-by-Step Manual Test

1. **Terminal 1 - Start Backend:**
   ```bash
   cd server
   node server.js
   ```
   Wait for: `Server is running on http://localhost:5000`

2. **Terminal 2 - Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   Wait for: `Local: http://localhost:5173`

3. **Browser - Open DevTools (F12)**
   - Click Console tab
   - Navigate to `http://localhost:5173/seller-login`

4. **Fill Login Form:**
   - Email: `admin@example.com`
   - Password: `admin123`

5. **Click Login Button**
   - Check Frontend Console for `=== SELLER LOGIN ATTEMPT ===` log
   - Check Backend Console for `=== SELLER LOGIN REQUEST ===` log
   - Wait for redirect to seller dashboard

6. **Check Browser Storage:**
   - F12 → Application tab → Local Storage
   - Should see: `sellerToken` and `sellerUser` keys

---

## Axios Configuration Reference

**Frontend Axios Setup** (`client/src/context/AppContext.jsx`):
```javascript
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
```

**Login Request:**
```javascript
const { data } = await axios.post('/api/seller/login', 
  { email, password }, 
  { withCredentials: true }
);
```

---

## Backend Route Reference

**Route Definition** (`server/routes/sellerRoute.js`):
```javascript
sellerRouter.post('/login', loginSeller);      // POST /api/seller/login
sellerRouter.get('/is-auth', authSeller, isSellerAuth); // GET /api/seller/is-auth
sellerRouter.get('/logout', sellerlogout);    // GET /api/seller/logout
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Seller logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "seller": {
    "email": "admin@example.com"
  }
}
```

---

## Environment Variables Checklist

**Backend** (`server/.env`):
- ✅ `SELLER_EMAIL="admin@example.com"`
- ✅ `SELLER_PASSWORD="admin123"`
- ✅ `JWT_SECRET="groceryweb#123"`
- ✅ `MONGODB_URL` (database connection)
- ✅ `CLOUDINARY_CLOUD_NAME` (if using media)

**Frontend** (`client/.env`):
- ✅ `VITE_BACKEND_URL="http://localhost:5000"`
- ✅ `VITE_APP_CURRENCY="₹"`

---

## Quick Fix Checklist

- [ ] Backend server running on port 5000?
- [ ] Frontend running on port 5173?
- [ ] Correct credentials: `admin@example.com` / `admin123`?
- [ ] `.env` files have correct values?
- [ ] Browser console shows "=== SELLER LOGIN ATTEMPT ===" log?
- [ ] Backend console shows "=== SELLER LOGIN REQUEST ===" log?
- [ ] Token visible in localStorage?
- [ ] Redirected to seller dashboard after login?

---

## Still Having Issues?

1. **Clear Browser Cache:**
   - F12 → Application → Storage → Clear Site Data
   - Refresh page (Ctrl+F5)

2. **Restart Everything:**
   ```bash
   # Terminal 1 - Kill backend (Ctrl+C), restart
   cd server
   node server.js
   
   # Terminal 2 - Kill frontend (Ctrl+C), restart
   cd client
   npm run dev
   ```

3. **Check File Syntax:**
   ```bash
   # Validate backend
   node -c server/server.js
   
   # Validate frontend
   npm run lint --prefix client
   ```

4. **View Full Error Details:**
   - Open DevTools Network tab (F12 → Network)
   - Click Login
   - Click the `login` request
   - Check Response tab for error message
   - Check Console tab for JavaScript errors
