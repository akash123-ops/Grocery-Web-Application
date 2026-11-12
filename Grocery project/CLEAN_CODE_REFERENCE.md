# Seller Login - Clean Working Code Reference

## Backend Setup

### 1. Environment Variables (`server/.env`)
```env
JWT_SECRET="groceryweb#123"
NODE_ENV="development"

# Admin credentials
SELLER_EMAIL="admin@example.com"
SELLER_PASSWORD="admin123"

# MongoDB connection URL
MONGODB_URL="mongodb+srv://groceryweb:groceryweb123@cluster0.ufljeql.mongodb.net"

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME='djpf4yarm'
CLOUDINARY_API_KEY='162273787344374'
CLOUDINARY_API_SECRET='EG6yPyn-hD8xwDU8IbxqktpoIvo'
```

### 2. Server Setup (`server/server.js`)
```javascript
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';

const app = express();
const port = process.env.PORT || 5000;

await connectDB();

// Allow development frontends
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173', 
  'http://localhost:3000', 
  'http://127.0.0.1:3000'
];

// Middleware
app.use(express.json());
app.use(cookieParser());
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
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/seller', sellerRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

### 3. Seller Routes (`server/routes/sellerRoute.js`)
```javascript
import express from 'express';
import { loginSeller, isSellerAuth, sellerlogout } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', loginSeller);
sellerRouter.get('/is-auth', authSeller, isSellerAuth);
sellerRouter.get('/logout', sellerlogout);

export default sellerRouter;
```

### 4. Seller Controller (`server/controllers/sellerController.js`)
```javascript
import jwt from 'jsonwebtoken';

// Login Seller : /api/seller/login
export const loginSeller = async (req, res) => {
  try {
    console.log('\n=== SELLER LOGIN REQUEST ===');
    console.log('Request Body:', req.body);
    
    const { email, password } = req.body;
    
    console.log('Email Match:', email === process.env.SELLER_EMAIL);
    console.log('Password Match:', password === process.env.SELLER_PASSWORD);
    
    if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      console.log('Token generated successfully');

      res.cookie('sellerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      console.log('Login successful for:', email);
      return res.json({
        success: true,
        message: 'Seller logged in successfully',
        token,
        seller: { email },
      });
    } else {
      console.log('Login failed - invalid credentials');
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('LOGIN ERROR:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout seller : /api/seller/logout
export const sellerlogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
```

### 5. Auth Middleware (`server/middlewares/authSeller.js`)
```javascript
import jwt from 'jsonwebtoken';

const authSeller = (req, res, next) => {
  const tokenFromCookie = req.cookies?.sellerToken;
  const authHeader = req.headers.authorization || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.json({ success: false, message: 'Unauthorized' });
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecoded.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.json({ success: false, message: 'Unauthorized' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authSeller;
```

---

## Frontend Setup

### 1. Environment Variables (`client/.env`)
```env
VITE_APP_CURRENCY=₹
VITE_BACKEND_URL="http://localhost:5000"
```

### 2. Axios Configuration (`client/src/context/AppContext.jsx`)
```javascript
import axios from "axios";

// Configure axios globally
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);
```

### 3. Auth Context Functions (`client/src/context/AppContext.jsx`)
```javascript
// Inside AppContextProvider component
const setSellerAuth = (token, sellerData = null) => {
  if (token) {
    localStorage.setItem('sellerToken', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    setIsSeller(true);
  }
  if (sellerData) {
    localStorage.setItem('sellerUser', JSON.stringify(sellerData));
    setUser(sellerData);
  }
};

const clearSellerAuth = () => {
  localStorage.removeItem('sellerToken');
  localStorage.removeItem('sellerUser');
  delete axios.defaults.headers.common.Authorization;
  setIsSeller(false);
  setUser(null);
};

const fetchSellerStatus = async () => {
  try {
    const token = localStorage.getItem('sellerToken');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    const { data } = await axios.get('/api/seller/is-auth');
    if (data.success) {
      setIsSeller(true);
      const savedUser = localStorage.getItem('sellerUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      clearSellerAuth();
    }
  } catch (error) {
    clearSellerAuth();
  } finally {
    setIsCheckingSellerAuth(false);
  }
};

// On app mount
useEffect(() => {
  fetchSellerStatus();
}, []);
```

### 4. Seller Login Component (`client/src/pages/SellerLogin.jsx`)
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { isSeller, setSellerAuth, axios } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (isSeller) {
      navigate('/seller');
    }
  }, [isSeller, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      console.log('=== SELLER LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
      
      const { data } = await axios.post(
        '/api/seller/login', 
        { email, password }, 
        { withCredentials: true }
      );

      console.log('Login Response:', data);

      if (data.success && data.token) {
        const sellerData = {
          name: 'Seller ' + email.split('@')[0],
          email,
          role: 'seller',
        };
        setSellerAuth(data.token, sellerData);
        toast.success(data.message || 'Seller login successful');
        navigate('/seller');
      } else {
        toast.error(data.message || 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      console.error('Error Response:', error.response);
      
      const errorMsg = error.response?.data?.message || 
                       error.response?.statusText || 
                       error.message || 
                       'Network error. Please check if backend is running on http://localhost:5000';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Seller Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin123"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Demo: admin@example.com / admin123
        </p>
      </form>
    </div>
  );
};

export default SellerLogin;
```

### 5. Protected Route (`client/src/components/ProtectedRoute.jsx`)
```javascript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isSeller, isCheckingSellerAuth } = useAppContext();
  const location = useLocation();

  if (isCheckingSellerAuth) {
    return <div className='min-h-screen flex items-center justify-center'>Loading...</div>;
  }

  if (!isSeller) {
    return <Navigate to='/seller-login' replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
```

### 6. App Routes (`client/src/App.jsx`)
```javascript
import { Routes, Route, Navigate } from 'react-router-dom';
import SellerLogin from './pages/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import SellerDashboard from './pages/SellerDashboard';
import SellerProductList from './pages/seller/SellerProductList';
import SellerOrders from './pages/seller/SellerOrders';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path='/seller-login' element={<SellerLogin />} />
      
      <Route path='/seller' element={<ProtectedRoute><SellerLayout /></ProtectedRoute>}>
        <Route index element={<SellerDashboard />} />
        <Route path='overview' element={<SellerDashboard />} />
        <Route path='product-list' element={<SellerProductList />} />
        <Route path='orders' element={<SellerOrders />} />
      </Route>
      
      <Route path='/seller-dashboard' element={<ProtectedRoute><Navigate to='/seller' replace /></ProtectedRoute>} />
    </Routes>
  );
}
```

---

## Logout Implementation

### Backend Logout (`server/controllers/sellerController.js`)
```javascript
export const sellerlogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
```

### Frontend Logout (`client/src/pages/seller/SellerLayout.jsx`)
```javascript
const handleLogout = async () => {
  try {
    const { data } = await axios.get('/api/seller/logout', { withCredentials: true });
    if (data.success) {
      clearSellerAuth();
      toast.success(data.message);
      navigate('/');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    clearSellerAuth();
    toast.error(error.message || 'Logout failed');
    navigate('/');
  }
};
```

---

## Testing the Login Flow

1. **Start backend:**
   ```bash
   cd server && node server.js
   ```

2. **Start frontend:**
   ```bash
   cd client && npm run dev
   ```

3. **Open browser to:** `http://localhost:5173/seller-login`

4. **Login with:**
   - Email: `admin@example.com`
   - Password: `admin123`

5. **Check localStorage:**
   - F12 → Application → Local Storage
   - Look for `sellerToken` and `sellerUser`

6. **Verify redirect:** You should be redirected to seller dashboard

7. **Check persistence:** Refresh page - you should remain logged in

8. **Test logout:** Click logout button, should redirect to home page and clear localStorage
