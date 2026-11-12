# Seller Login Fix - TODO

## Steps:
- [ ] 1. **Seed test seller account**: Update `server/configs/db.js` to create hardcoded test seller (email: `seller@test.com`, password: `seller123`, role: 'seller') on DB connect if not exists.
- [ ] 2. **Fix backend login**: Edit `server/controllers/sellerController.js` loginSeller:
  - Remove env var fallback creation (risky).
  - Unify 401 errors to `{success: false, message: 'Login failed'}`.
  - Keep logs, status codes.
- [ ] 3. **Fix frontend login**: Edit `client/src/components/seller/SellerLogin.jsx`:
  - Remove `localStorage.setItem('sellerToken', ...)` - rely on cookie.
- [ ] 4. **Fix auth context**: Edit `client/src/context/AppContext.jsx`:
  - Remove localStorage 'sellerToken' check in useEffect.
  - Change is-auth axios to use withCredentials=true (cookie) without Authorization header.
- [ ] 5. **Test**:
  - Restart server (`cd server && npm start`).
  - Run client (`cd client && npm run dev`).
  - Login seller@test.com / seller123 → success, navigate to dashboard.

**Test Credentials**: 
- Email: `seller@test.com`
- Password: `seller123`

**Expected**: DB has seller, login returns 200/token/cookie, frontend toasts success, dashboard accessible.

Progress will be updated after each step.

