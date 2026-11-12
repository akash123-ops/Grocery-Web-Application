# 🎯 Seller Login Network Error - Simple Fix (3 Steps)

## Your Current Situation

- ❌ You're getting "Network Error" when clicking login
- 📱 Frontend is running (http://localhost:5174)
- ⚙️ Backend may not be running

## 3-STEP FIX

### STEP 1: Start Backend Server

**Open a NEW terminal window (not the one with frontend)**

```bash
cd server
node server.js
```

**You should see:**
```
✅ Server is running on http://localhost:5000
```

**❌ If you see error:**
- Make sure you have Node.js installed
- Check `server` folder exists
- Run `npm install` in server folder first

---

### STEP 2: Verify Frontend is Running

**Check your frontend terminal (should already be running):**

```
➜ Local: http://localhost:5174
```

**❌ If it stopped:**
```bash
cd client
npm run dev
```

---

### STEP 3: Test Login

**1. Open browser:** `http://localhost:5174/seller-login`

**2. Enter login credentials:**
- Email: `admin@example.com`
- Password: `admin123`

**3. Click Login**

**✅ If working:**
- Green toast: "Seller login successful"
- Page shows seller dashboard
- You're logged in!

**❌ Still getting error?** → See Troubleshooting below

---

## 🧪 Troubleshooting

### Error: "Network error. Please check if backend is running..."

**Solution:**
1. Check Terminal 1 shows: `Server is running on http://localhost:5000`
2. If not, run: `cd server && node server.js`
3. Wait 5 seconds
4. Try login again

---

### Error: "Invalid credentials"

**Solution:**
1. Check you're using exact credentials:
   - Email: `admin@example.com` (not your email)
   - Password: `admin123`

2. If still fails, check `server/.env` file has:
   ```
   SELLER_EMAIL="admin@example.com"
   SELLER_PASSWORD="admin123"
   ```

3. Restart backend if you changed `.env`:
   ```bash
   cd server
   node server.js
   ```

---

### Error: "Cannot POST /api/seller/login"

**Solution:** Backend server crashed or not running.

```bash
cd server
node server.js
```

Wait for: `Server is running on http://localhost:5000`

---

### Error: CORS error in browser console

**Solution:** Add your port to `server/server.js`

Find this section:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',  // <- Frontend port
  'http://localhost:5175',
  // ...
];
```

Make sure your frontend port is in the list.

**Then restart backend:**
```bash
cd server
node server.js
```

---

## ✅ Success Checklist

- [ ] Terminal 1 shows: `Server is running on http://localhost:5000`
- [ ] Terminal 2 shows: `Local: http://localhost:5174` (frontend)
- [ ] Browser URL is: `http://localhost:5174/seller-login`
- [ ] Entered: `admin@example.com` and `admin123`
- [ ] Clicked Login button
- [ ] Saw: "Seller login successful" toast (green)
- [ ] Redirected to seller dashboard
- [ ] See seller in navbar

---

## 🔍 Debug: Check What's Happening

**Open browser DevTools (F12) → Console tab**

**You should see:**
```
=== SELLER LOGIN ATTEMPT ===
Email: admin@example.com
Backend URL: http://localhost:5000
Login Response: {success: true, token: "...", message: "..."}
```

**If you see network error instead:**
```
Login Error: AxiosError: Network Error
```

→ **Solution:** Backend is NOT running (go to Step 1)

---

## 🚀 Quick Restart (If Stuck)

**Kill everything and restart:**

Terminal 1:
```
Ctrl+C (to stop backend)

cd server
node server.js
# Wait: Server is running on http://localhost:5000
```

Terminal 2:
```
Ctrl+C (to stop frontend)

cd client
npm run dev
# Wait: Local: http://localhost:5174
```

Browser:
```
Go to: http://localhost:5174/seller-login
Login: admin@example.com / admin123
```

---

## ❓ Still Not Working?

**Tell me:**
1. What error you see?
2. Is backend running? (show screenshot of Terminal 1)
3. What does frontend terminal show? (screenshot of Terminal 2)
4. Any red errors in browser console? (F12 screenshot)

---

## 📚 Understanding the Flow

```
You → Browser
       ↓
       Frontend (http://localhost:5174)
       ↓
       [Network Request]
       ↓
       Backend (http://localhost:5000)
       ↓
       Check credentials in database
       ↓
       Send token back
       ↓
       Frontend saves token
       ↓
       You → Logged in! 🎉
```

If any step fails → Network Error

---

## 💡 Common Port Issues

Your frontend might be on a different port:

- `http://localhost:5173` ← Default
- `http://localhost:5174` ← If 5173 taken
- `http://localhost:5175` ← If 5174 taken

**Always check your browser address bar for the exact port!**

The important part is:
- Backend: `http://localhost:5000` (fixed)
- Frontend: Whatever port shows in browser
