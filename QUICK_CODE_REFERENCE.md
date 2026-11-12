# Seller Login - Quick Reference & Correct Code

## What You Need (TL;DR)

**Backend credentials** (`server/.env`):
```
SELLER_EMAIL="admin@example.com"
SELLER_PASSWORD="admin123"
```

**Login with these credentials in the form**

**Frontend URL** (`client/.env`):
```
VITE_BACKEND_URL="http://localhost:5000"
```

---

## ✅ Correct Axios Login Code (React)

```javascript
// File: client/src/pages/SellerLogin.jsx

import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { axios } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Sending login request to backend...');
      
      // CORRECT: Use axios instance from context
      const { data } = await axios.post(
        '/api/seller/login',  // Relative URL (baseURL is set in context)
        { email, password }   // Request body
      );

      if (data.success && data.token) {
        // Save token to localStorage
        localStorage.setItem('sellerToken', data.token);
        localStorage.setItem('sellerEmail', email);
        
        // Show success message
        toast.success('Login successful!');
        
        // Redirect to dashboard
        navigate('/seller');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error(error.response?.data?.message || 'Network Error');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@example.com"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="admin123"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## ✅ Correct Express Route (Node.js Backend)

```javascript
// File: server/routes/sellerRoute.js

import express from 'express';
import { loginSeller } from '../controllers/sellerController.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', loginSeller);

export default sellerRouter;
```

---

## ✅ Correct Login Controller (Node.js)

```javascript
// File: server/controllers/sellerController.js

import jwt from 'jsonwebtoken';

export const loginSeller = async (req, res) => {
  try {
    // Get email and password from request
    const { email, password } = req.body;

    console.log('Login Request:', { email });

    // Check if credentials match
    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      // Generate JWT token
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set secure cookie
      res.cookie('sellerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send response with token
      return res.json({
        success: true,
        message: 'Seller logged in successfully',
        token,
        seller: { email },
      });
    } else {
      // Wrong credentials
      return res.json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};
```

---

## ✅ Correct Express Setup (server.js)

```javascript
// File: server/server.js

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import sellerRouter from './routes/sellerRoute.js';

const app = express();
const port = process.env.PORT || 5000;

// IMPORTANT: Middleware order matters!

// 1. JSON parser
app.use(express.json());

// 2. Cookie parser
app.use(cookieParser());

// 3. CORS middleware (MUST be before routes)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS origin denied'));
    }
  },
  credentials: true,
}));

// Handle preflight requests
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

// 4. Routes
app.use('/api/seller', sellerRouter);

// 5. Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
```

---

## ✅ Axios Setup in React Context

```javascript
// File: client/src/context/AppContext.jsx

import axios from 'axios';

// Configure axios globally
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const AppContextProvider = ({ children }) => {
  // Use axios in components
  return (
    <AppContext.Provider value={{ axios, ... }}>
      {children}
    </AppContext.Provider>
  );
};
```

---

## ❌ COMMON MISTAKES TO AVOID

### ❌ Wrong: Using full URL
```javascript
// DON'T DO THIS
axios.post('http://localhost:5000/api/seller/login', data)

// DO THIS INSTEAD (baseURL already set)
axios.post('/api/seller/login', data)
```

### ❌ Wrong: Missing credentials
```javascript
// DON'T DO THIS
const { data } = await axios.post('/api/seller/login', { email, password })

// DO THIS INSTEAD
const { data } = await axios.post(
  '/api/seller/login',
  { email, password },
  { withCredentials: true }  // IMPORTANT for cookies
)
```

### ❌ Wrong: Middleware order
```javascript
// DON'T DO THIS
app.use(sellerRouter);  // Routes FIRST
app.use(cors());         // CORS AFTER (too late!)

// DO THIS INSTEAD
app.use(cors());         // CORS FIRST
app.use(sellerRouter);   // Routes AFTER
```

### ❌ Wrong: Wrong environment variables
```javascript
// server/.env

// DON'T USE THESE
SELLER_EMAIL=admin@example.com    (no quotes)
SELLER_PASSWORD=admin123           (no quotes)

// USE THESE INSTEAD
SELLER_EMAIL="admin@example.com"  (with quotes)
SELLER_PASSWORD="admin123"         (with quotes)
```

---

## 🧪 Test in Browser Console

After opening `http://localhost:5174/seller-login`:

```javascript
// Test if backend is reachable
fetch('http://localhost:5000/').then(r => r.text()).then(console.log)
// Should show: "API is Working"

// Test login endpoint directly
fetch('http://localhost:5000/api/seller/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log)
// Should show: { success: true, token: "...", message: "..." }
```

---

## 🚀 Start Both Servers

**Terminal 1:**
```bash
cd server
node server.js
# Wait for: ✅ Server is running on http://localhost:5000
```

**Terminal 2:**
```bash
cd client
npm run dev
# Wait for: ➜ Local: http://localhost:5174
```

**Browser:** `http://localhost:5174/seller-login`

**Login:** 
- Email: `admin@example.com`
- Password: `admin123`

---

## 📝 Expected Console Output

**Frontend (Browser DevTools Console):**
```
=== SELLER LOGIN ATTEMPT ===
Email: admin@example.com
Backend URL: http://localhost:5000
Login Response: { success: true, token: "eyJhbGci...", message: "Seller logged in successfully" }
```

**Backend (Terminal):**
```
=== SELLER LOGIN REQUEST ===
Request Body: { email: 'admin@example.com', password: 'admin123' }
Email Match: true
Password Match: true
Token generated successfully
Login successful for: admin@example.com
```

---

## ✨ After Successful Login

1. ✅ Token saved in localStorage
2. ✅ Redirected to `/seller` dashboard
3. ✅ Navbar shows seller is logged in
4. ✅ Page refresh keeps login active (token read from localStorage)
5. ✅ Logout clears token from localStorage

---

## 🎯 If Still Getting Network Error

**Check in order:**

1. **Backend running?**
   ```bash
   cd server && node server.js
   ```

2. **Check credentials in `server/.env`:**
   ```
   SELLER_EMAIL="admin@example.com"
   SELLER_PASSWORD="admin123"
   ```

3. **Check frontend URL in `client/.env`:**
   ```
   VITE_BACKEND_URL="http://localhost:5000"
   ```

4. **Browser console (F12):**
   - Should see login logs
   - Check for CORS errors

5. **Network tab (F12 → Network):**
   - Click login request
   - Check Status: should be 200
   - Check Response: should have `success: true`
