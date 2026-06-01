# AgriLink — Project Handoff Document
**Last Updated:** Sprint 1 Complete → Sprint 2 Starting  
**Save this file to:** `C:\Users\USER\Desktop\agrilink\HANDOFF.md`

---

## 1. Project Goal

Build **AgriLink** — a web-based marketplace platform for Kenyan smallholder farmers that:
- Enables direct farmer-to-buyer transactions (no broker middlemen)
- Connects farmers to verified agricultural input suppliers (seeds, fertilizers, equipment)
- Enables real-time messaging between farmers and buyers for negotiation

**Academic context:** Final-year CS project at Multimedia University of Kenya (MMU), Faculty of Computing & IT. Solo developer. 7-week deadline. Must run on localhost AND be deployed live for final defense.

---

## 2. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Vite + Bootstrap or Tailwind CSS |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB Atlas (free tier) |
| Auth | JWT + bcrypt |
| Images | Cloudinary (free tier) |
| Deploy — Frontend | Vercel |
| Deploy — Backend | Render |
| Version Control | Git + GitHub |
| API Testing | Postman |
| OS | Windows + VS Code + Git Bash terminal |

**API versioning prefix:** All routes use `/api/v1/` (e.g. `http://localhost:5000/api/v1/health`)

---

## 3. Sprint Map & Status

| Sprint | Week | Focus | Status |
|--------|------|-------|--------|
| Sprint 1 | Week 1 | Environment Setup + Architecture + DB Design + Wireframes | ✅ COMPLETE |
| Sprint 2 | Week 2 | Authentication + Role Profiles + Dashboard Shells | 🟡 NEXT — START HERE |
| Sprint 3 | Week 3 | Produce Marketplace (Listings CRUD + Browse + Search) | ⬜ Not started |
| Sprint 4 | Week 4 | Orders Workflow (Place + Accept + Reject + Fulfill) | ⬜ Not started |
| Sprint 5 | Week 5 | Messaging (Farmer–Buyer) + Supplier Connect Module | ⬜ Not started |
| Sprint 6 | Week 6 | Integration + UI Polish + Admin Module + Deployment | ⬜ Not started |
| Sprint 7 | Week 7 | Testing + Bug Fixes + Documentation + Presentation Prep | ⬜ Not started |

---

## 4. Current State — What Is Done

### Backend (`agrilink-backend/`) ✅
- [x] Folder structure created (config, controllers, middleware, models, routes, utils, uploads)
- [x] `npm init -y` done
- [x] All packages installed (see Section 6)
- [x] `nodemon` installed as devDependency
- [x] `package.json` scripts set: `"dev": "nodemon server.js"`, `"start": "node server.js"`
- [x] `models/User.js` — complete with bcrypt pre-save hook, comparePassword(), toJSON()
- [x] `models/Product.js` — complete with text index, category enum, image array
- [x] `models/Order.js` — complete with productSnapshot, status state machine, workflow timestamps
- [x] `models/Message.js` — complete with conversationId logic, isRead, soft delete
- [x] `models/SupplierProduct.js` — complete with Map specifications, pending-approval default
- [x] `models/InputRequest.js` — complete with 6-stage status enum
- [x] `config/db.js` — complete with connectDB(), SIGINT graceful shutdown, error troubleshooting
- [x] `server.js` — complete with helmet, cors, morgan, rate limiting, mongoSanitize, 404 handler, global error handler
- [x] `.env` — filled in with real MongoDB URI, JWT secret, Cloudinary keys
- [x] `.gitignore` — `.env` and `node_modules/` excluded
- [x] Server tested: `npm run dev` shows green MongoDB connection + port 5000 banner
- [x] Health check tested: `GET http://localhost:5000/api/v1/health` returns 200 OK

### Frontend (`agrilink-frontend/`) ✅
- [x] Created with `npm create vite@latest agrilink-frontend -- --template react`
- [x] `npm install` done
- [x] Extra `src/` subfolders created: components, pages, context, services, utils, assets
- [x] `.env` created with `VITE_API_URL=http://localhost:5000/api`
- [x] `.gitignore` created

### Git / GitHub ✅
- [x] Repository initialized
- [x] At least 2 commits pushed
- [x] `.env` confirmed NOT visible on GitHub
- [x] `HANDOFF.md` committed

### Wireframes ✅ (designed, screenshots needed for report)
Six pages wireframed:
1. Login / Register (role selector: farmer / buyer / supplier / admin)
2. Farmer Dashboard (active listings count, pending orders, revenue, profile views)
3. Marketplace Browse (search bar, filters by category/county/price, product cards)
4. Product Detail + Order Form (quantity, delivery method, buyer note, total calculator)
5. Supplier Browse (amber theme, "Admin Verified" badge, filter by category/county)
6. Messaging Interface (conversation list, chat thread, embedded order/product cards)

---

## 5. File Directory (Full Tree)

```
C:\Users\USER\Desktop\agrilink\
│
├── HANDOFF.md                          ← THIS FILE
│
├── agrilink-backend\
│   ├── config\
│   │   ├── db.js                       ✅ Complete
│   │   └── cloudinary.js               ⬜ Empty — fill in Sprint 3
│   ├── controllers\
│   │   ├── authController.js           ⬜ Empty — Sprint 2 task
│   │   ├── productController.js        ⬜ Empty — Sprint 3 task
│   │   ├── orderController.js          ⬜ Empty — Sprint 4 task
│   │   ├── messageController.js        ⬜ Empty — Sprint 5 task
│   │   └── supplierController.js       ⬜ Empty — Sprint 5 task
│   ├── middleware\
│   │   ├── authMiddleware.js           ⬜ Empty — Sprint 2 task
│   │   └── roleMiddleware.js           ⬜ Empty — Sprint 2 task
│   ├── models\
│   │   ├── User.js                     ✅ Complete
│   │   ├── Product.js                  ✅ Complete
│   │   ├── Order.js                    ✅ Complete
│   │   ├── Message.js                  ✅ Complete
│   │   ├── SupplierProduct.js          ✅ Complete
│   │   └── InputRequest.js             ✅ Complete
│   ├── routes\
│   │   ├── authRoutes.js               ⬜ Empty — Sprint 2 task
│   │   ├── productRoutes.js            ⬜ Empty — Sprint 3 task
│   │   ├── orderRoutes.js              ⬜ Empty — Sprint 4 task
│   │   ├── messageRoutes.js            ⬜ Empty — Sprint 5 task
│   │   └── supplierRoutes.js           ⬜ Empty — Sprint 5 task
│   ├── utils\
│   │   └── generateToken.js            ⬜ Empty — Sprint 2 task
│   ├── uploads\                        ✅ Exists (git-ignored)
│   ├── .env                            ✅ Filled in (git-ignored)
│   ├── .gitignore                      ✅ Complete
│   ├── package.json                    ✅ Complete
│   └── server.js                       ✅ Complete
│
└── agrilink-frontend\
    ├── public\
    │   └── vite.svg
    ├── src\
    │   ├── assets\                     ⬜ Empty — add logo/CSS later
    │   ├── components\                 ⬜ Empty — Sprint 2 task
    │   ├── context\
    │   │   └── AuthContext.jsx         ⬜ Empty — Sprint 2 task
    │   ├── pages\
    │   │   ├── LoginPage.jsx           ⬜ Empty — Sprint 2 task
    │   │   ├── RegisterPage.jsx        ⬜ Empty — Sprint 2 task
    │   │   ├── FarmerDashboard.jsx     ⬜ Empty — Sprint 2 task
    │   │   ├── BuyerDashboard.jsx      ⬜ Empty — Sprint 2 task
    │   │   └── SupplierDashboard.jsx   ⬜ Empty — Sprint 2 task
    │   ├── services\
    │   │   └── authService.js          ⬜ Empty — Sprint 2 task
    │   ├── utils\                      ⬜ Empty
    │   ├── App.jsx                     🟡 Vite default — replace in Sprint 2
    │   └── main.jsx                    🟡 Vite default — update in Sprint 2
    ├── .env                            ✅ Complete
    ├── .gitignore                      ✅ Complete
    ├── index.html
    └── package.json                    ✅ Complete
```

---

## 6. Installed Packages

### Backend (`agrilink-backend/`)
```json
"dependencies": {
  "bcryptjs": "^2.4.3",
  "cloudinary": "^1.41.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-mongo-sanitize": "^2.2.0",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.0",
  "morgan": "^1.10.0",
  "multer": "^1.4.5-lts.1"
},
"devDependencies": {
  "nodemon": "^3.0.2"
}
```

If `node_modules` is missing (e.g. fresh clone), run: `npm install` inside `agrilink-backend\`

### Frontend (`agrilink-frontend/`)
Standard Vite + React. Run `npm install` if node_modules is missing.

---

## 7. Environment Variables

### `agrilink-backend\.env`
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/agrilink?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

### `agrilink-frontend\.env`
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=AgriLink
```

**Note:** If you changed the API path from `/api` to `/api/v1` in server.js, make sure `VITE_API_URL` ends in `/api/v1`.

---

## 8. Key Design Decisions Made (for report)

- **MongoDB over MySQL** — User profiles have variable structure (farmers have `farmDetails`, suppliers have `supplierDetails`). Document DB fits naturally.
- **conversationId in Message** — Generated by sorting both user IDs and joining with `_`. This groups all messages between two users regardless of direction.
- **productSnapshot in Order and InputRequest** — Preserves price/name at time of order. If farmer changes price later, historical orders still show the agreed price.
- **farmer field on Order** — Denormalized from Product for query performance. "All orders for farmer X" is one direct query, not a join.
- **status: 'pending-approval' default on SupplierProduct** — Admin must approve before listing goes live. Protects farmers from counterfeit/harmful inputs.
- **Soft delete on Product** — status: 'deleted' hides from marketplace but preserves data for order history integrity.
- **JWT_EXPIRES_IN: 7d** — 7-day sessions. After expiry, user must log in again.
- **authLimiter** — 20 login attempts per 15 min per IP. Blocks brute-force bots.
- **API versioned at `/api/v1/`** — Future-proofs the API. Breaking changes go to `/api/v2/` without breaking existing clients.

---

## 9. Failed Attempts / Gotchas (Windows-specific)

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| `'nodemon' is not recognized` | Not installed globally | `npm install -g nodemon` OR use `npx nodemon server.js` |
| `MongoServerError: bad auth` | Wrong password in URI | Re-check Atlas database user credentials (NOT your Atlas login) |
| `EADDRINUSE :5000` | Another process using port | Change `PORT=5001` in `.env` temporarily |
| `Cannot find module 'dotenv'` | npm install not run | `cd agrilink-backend && npm install` |
| `req.body is undefined` | `express.json()` not set | Already fixed in server.js — never remove `app.use(express.json())` |
| `.env` showing on GitHub | Not in .gitignore before first commit | `git rm --cached .env` then push |
| Vite port is 5173 not 3000 | Vite default ≠ Create React App | Always use `http://localhost:5173` for frontend, `FRONTEND_URL=http://localhost:5173` in backend `.env` |
| Atlas connection refused | IP not whitelisted | Atlas dashboard → Network Access → Add IP → `0.0.0.0/0` (Allow from anywhere) |

---

## 10. Live API Routes (Sprint 1)

| Method | Route | Status | Notes |
|--------|-------|--------|-------|
| GET | `/api/v1/health` | ✅ Working | Returns server status, uptime, env |
| ALL | `/api/v1/*` (unmatched) | ✅ Working | Returns 404 with helpful message |

All Sprint 2+ routes are commented out in `server.js`. Uncomment as you build each sprint.

---

## 11. Sprint 2 — Exact Steps to Continue From Here

**Sprint Goal:** Users can register, log in, and land on a role-specific dashboard. JWT tokens are issued on login and validated on protected routes.

### Step 1 — Create `utils/generateToken.js`
This utility creates the JWT token you send back after a successful login.

```javascript
// FILE: agrilink-backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

module.exports = generateToken;
```

**What this does:** `jwt.sign()` takes a payload (the data to embed in the token — user ID and role), a secret key, and options. It returns a signed string token. The token encodes the userId and role so your middleware can read them on every protected request without hitting the database again.

---

### Step 2 — Create `middleware/authMiddleware.js`
This runs before any protected route handler. It reads the JWT from the request header and verifies it.

```javascript
// FILE: agrilink-backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as: "Bearer eyJhbGci..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    // Split "Bearer TOKEN" on the space. Index [1] is the token itself.
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in. Please log in to access this resource.',
    });
  }

  try {
    // jwt.verify() checks the signature AND checks if the token has expired.
    // If valid, it returns the decoded payload: { id: '...', role: '...', iat: ..., exp: ... }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB to confirm the account still exists and is active.
    // We call select('-password') to explicitly exclude the password hash from the result.
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The account belonging to this token no longer exists.',
      });
    }

    if (!currentUser.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Attach the user to the request object.
    // Now any route handler that comes after this middleware can access req.user
    req.user = currentUser;
    next();

  } catch (err) {
    // jwt.verify() throws JsonWebTokenError or TokenExpiredError
    // These are handled by the global error handler in server.js
    next(err);
  }
};

module.exports = { protect };
```

---

### Step 3 — Create `middleware/roleMiddleware.js`
This runs after `protect` and restricts routes to specific roles.

```javascript
// FILE: agrilink-backend/middleware/roleMiddleware.js

// restrictTo returns a middleware function.
// Usage: router.post('/listings', protect, restrictTo('farmer'), createListing)
// This means: must be logged in AND must be a farmer.

const restrictTo = (...roles) => {
  // roles is an array: e.g. ['farmer', 'admin']
  return (req, res, next) => {
    // req.user was set by the protect middleware that runs before this
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. This action requires the role: ${roles.join(' or ')}. Your role is: ${req.user.role}.`,
      });
    }
    next();
  };
};

module.exports = { restrictTo };
```

**403 vs 401:** 401 = "Who are you? Not authenticated." 403 = "I know who you are, but you don't have permission."

---

### Step 4 — Create `controllers/authController.js`

```javascript
// FILE: agrilink-backend/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ── REGISTER ──────────────────────────────────────────────────────────────────
// POST /api/v1/auth/register
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role, location, farmDetails, supplierDetails } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'An account with this email already exists. Please log in instead.',
      });
    }

    // Create the user document.
    // The pre-save hook in User.js will hash the password automatically before saving.
    const newUser = await User.create({
      fullName,
      email,
      password,
      phone,
      role: role || 'buyer',
      location,
      farmDetails,
      supplierDetails,
    });

    // Generate a JWT token for the new user
    const token = generateToken(newUser._id, newUser.role);

    // Update lastLogin timestamp
    newUser.lastLogin = Date.now();
    await newUser.save({ validateBeforeSave: false });
    // validateBeforeSave: false skips re-running all validations
    // (password hashing hook only fires when password is modified — safe here)

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully.',
      token,
      data: { user: newUser },
      // newUser's toJSON() method (defined in User model) automatically
      // removes password, resetPasswordToken, resetPasswordExpires from the output
    });

  } catch (err) {
    next(err); // Passes to global error handler in server.js
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate that both fields were sent
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password.',
      });
    }

    // Find user by email. We must explicitly select password because
    // the User schema does not select it by default (it has select: false in some schemas).
    // In our schema we didn't set select: false, so this is just being explicit.
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password.',
        // SECURITY: Never say "email not found" — that tells attackers which emails are registered
      });
    }

    // Use the comparePassword instance method from User.js
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully.',
      token,
      data: { user },
    });

  } catch (err) {
    next(err);
  }
};

// ── GET CURRENT USER (protected route) ───────────────────────────────────────
// GET /api/v1/auth/me
exports.getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    // We already have the user from the middleware — no second DB call needed
    res.status(200).json({
      status: 'success',
      data: { user: req.user },
    });
  } catch (err) {
    next(err);
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
// PATCH /api/v1/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    // Only allow safe fields to be updated here (not password, not role)
    const allowedFields = ['fullName', 'phone', 'location', 'farmDetails', 'supplierDetails', 'profileImage'];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,            // return the UPDATED document, not the old one
        runValidators: true,  // run schema validators on the updated fields
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully.',
      data: { user: updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

// ── CHANGE PASSWORD ────────────────────────────────────────────────────────────
// PATCH /api/v1/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both current password and new password.',
      });
    }

    // Fetch user WITH password (it's excluded by default in our schema's toJSON)
    const user = await User.findById(req.user._id).select('+password');

    const isCorrect = await user.comparePassword(currentPassword);
    if (!isCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is incorrect.',
      });
    }

    // Assign new password — the pre-save hook will hash it automatically
    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully.',
      token,
      // Issue a new token because the old one should be invalidated conceptually
    });
  } catch (err) {
    next(err);
  }
};
```

---

### Step 5 — Create `routes/authRoutes.js`

```javascript
// FILE: agrilink-backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// app.set('authLimiter') was set in server.js — retrieve it here
// We apply the strict rate limiter to login and register only
const getAuthLimiter = (req) => req.app.get('authLimiter');

// Public routes (no token required)
router.post('/register', (req, res, next) => getAuthLimiter(req)(req, res, next), register);
router.post('/login',    (req, res, next) => getAuthLimiter(req)(req, res, next), login);

// Protected routes (token required — protect middleware runs first)
router.get('/me',                protect, getMe);
router.patch('/update-profile',  protect, updateProfile);
router.patch('/change-password', protect, changePassword);

module.exports = router;
```

---

### Step 6 — Uncomment auth routes in `server.js`

Open `agrilink-backend/server.js`. Find the commented routes section and uncomment:

```javascript
app.use('/api/v1/auth', require('./routes/authRoutes'));
```

---

### Step 7 — Test All Auth Endpoints in Postman

**Test 1: Register a farmer**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/auth/register`
- Body → raw → JSON:
```json
{
  "fullName": "John Kamau",
  "email": "john.kamau@gmail.com",
  "password": "password123",
  "phone": "0712345678",
  "role": "farmer",
  "location": { "county": "Nakuru", "town": "Naivasha" },
  "farmDetails": { "farmName": "Kamau Family Farm", "farmSize": "2 acres", "primaryCrops": ["Tomatoes", "Beans"] }
}
```
- Expected: `201 Created` with `token` and `data.user` (no password in response)

**Test 2: Register a buyer**
- Same URL, different body:
```json
{
  "fullName": "Mary Wanjiku",
  "email": "mary.wanjiku@gmail.com",
  "password": "password123",
  "role": "buyer",
  "location": { "county": "Nairobi", "town": "Westlands" }
}
```

**Test 3: Login**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/auth/login`
- Body:
```json
{ "email": "john.kamau@gmail.com", "password": "password123" }
```
- Expected: `200 OK` with `token`
- **Copy the token value — you need it for the next test**

**Test 4: Get current user (protected)**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/auth/me`
- Headers tab → Add: `Authorization` = `Bearer PASTE_YOUR_TOKEN_HERE`
- Expected: `200 OK` with the farmer's data

**Test 5: Try without token (should fail)**
- Same GET to `/api/v1/auth/me` but remove the Authorization header
- Expected: `401 Unauthorized`

**Test 6: Try wrong role test**
- Register a buyer, get their token
- In Sprint 3 when you add a farmer-only route, try accessing it with the buyer token
- Expected: `403 Forbidden`

**Verify in MongoDB Atlas:**
- Go to cloud.mongodb.com → your cluster → Browse Collections → agrilink database → users collection
- You should see your registered users there
- Confirm the `password` field shows a bcrypt hash like `$2a$12$...`, never plain text

---

### Step 8 — Frontend: Install React Router and Axios

```bash
cd C:\Users\USER\Desktop\agrilink\agrilink-frontend
npm install react-router-dom axios
```

- `react-router-dom` — handles navigation between pages (Login → Dashboard → Marketplace)
- `axios` — makes HTTP requests to your backend API (cleaner than fetch)

---

### Step 9 — Create `src/services/authService.js`

```javascript
// FILE: agrilink-frontend/src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
// In Vite, environment variables are accessed via import.meta.env
// NOT process.env (that's Create React App syntax)

// Axios instance with base URL pre-configured
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrilink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('agrilink_token', response.data.token);
      localStorage.setItem('agrilink_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('agrilink_user');
    return user ? JSON.parse(user) : null;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;
// Export the axios instance so other service files can import and reuse it
```

---

### Step 10 — Create `src/context/AuthContext.jsx`

```jsx
// FILE: agrilink-frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// 1. Create the context object
const AuthContext = createContext(null);

// 2. Create the Provider component — wraps your entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // loading: true while we check if a user is already logged in on page load

  useEffect(() => {
    // On app load: check if there's a stored user in localStorage
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.token) {
      localStorage.setItem('agrilink_token', data.token);
      localStorage.setItem('agrilink_user', JSON.stringify(data.data.user));
      setUser(data.data.user);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook — use this in any component to access auth state
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};

export default AuthContext;
```

---

### Step 11 — Update `src/main.jsx`

```jsx
// FILE: agrilink-frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

---

### Step 12 — Replace `src/App.jsx` with routing

```jsx
// FILE: agrilink-frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';

// ProtectedRoute: redirects to login if no user is logged in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// RoleRoute: redirects to the correct dashboard based on role
const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'farmer')   return <Navigate to="/farmer/dashboard" replace />;
  if (user.role === 'buyer')    return <Navigate to="/buyer/dashboard" replace />;
  if (user.role === 'supplier') return <Navigate to="/supplier/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Auto-redirect to correct dashboard */}
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/" element={<DashboardRouter />} />

        {/* Protected role-specific dashboards */}
        <Route path="/farmer/dashboard" element={
          <ProtectedRoute><FarmerDashboard /></ProtectedRoute>
        } />
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute><BuyerDashboard /></ProtectedRoute>
        } />
        <Route path="/supplier/dashboard" element={
          <ProtectedRoute><SupplierDashboard /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### Step 13 — Create Shell Dashboard Pages

Create these three files. They are minimal for now — just enough to confirm routing works. You will add real content in Sprint 3.

```jsx
// FILE: agrilink-frontend/src/pages/FarmerDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌱 Farmer Dashboard</h1>
      <p>Welcome back, <strong>{user?.fullName}</strong></p>
      <p>Role: <strong>{user?.role}</strong></p>
      <p>Farm: <strong>{user?.farmDetails?.farmName || 'Not set'}</strong></p>
      <hr />
      <p>Sprint 2 shell — full dashboard coming in Sprint 3.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default FarmerDashboard;
```

```jsx
// FILE: agrilink-frontend/src/pages/BuyerDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛒 Buyer Dashboard</h1>
      <p>Welcome back, <strong>{user?.fullName}</strong></p>
      <p>Role: <strong>{user?.role}</strong></p>
      <hr />
      <p>Sprint 2 shell — marketplace coming in Sprint 3.</p>
      <button onClick={() => { logout(); navigate('/login'); }}>Log Out</button>
    </div>
  );
};

export default BuyerDashboard;
```

```jsx
// FILE: agrilink-frontend/src/pages/SupplierDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SupplierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏪 Supplier Dashboard</h1>
      <p>Welcome back, <strong>{user?.fullName}</strong></p>
      <p>Role: <strong>{user?.role}</strong></p>
      <p>Verified: <strong>{user?.supplierDetails?.isVerified ? 'Yes ✅' : 'Pending admin approval'}</strong></p>
      <hr />
      <p>Sprint 2 shell — input listings coming in Sprint 5.</p>
      <button onClick={() => { logout(); navigate('/login'); }}>Log Out</button>
    </div>
  );
};

export default SupplierDashboard;
```

---

### Step 14 — Create Login and Register Pages

```jsx
// FILE: agrilink-frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard'); // App.jsx DashboardRouter will redirect to correct dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <h1>🌱 AgriLink</h1>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '1rem' }} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '1rem' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default LoginPage;
```

```jsx
// FILE: agrilink-frontend/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: '', role: 'buyer',
    county: '', town: '', farmName: '', farmSize: '', businessName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        location: { county: formData.county, town: formData.town },
        ...(formData.role === 'farmer' && {
          farmDetails: { farmName: formData.farmName, farmSize: formData.farmSize }
        }),
        ...(formData.role === 'supplier' && {
          supplierDetails: { businessName: formData.businessName }
        }),
      };

      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
      <h1>🌱 AgriLink</h1>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <input name="password" type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <input name="phone" placeholder="Phone (e.g. 0712345678)" value={formData.phone} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />

        <label>I am a:</label>
        <select name="role" value={formData.role} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}>
          <option value="buyer">Buyer</option>
          <option value="farmer">Farmer</option>
          <option value="supplier">Supplier</option>
        </select>

        <input name="county" placeholder="County" value={formData.county} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        <input name="town" placeholder="Town" value={formData.town} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />

        {formData.role === 'farmer' && (
          <>
            <input name="farmName" placeholder="Farm Name" value={formData.farmName} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
            <input name="farmSize" placeholder="Farm Size (e.g. 2 acres)" value={formData.farmSize} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
          </>
        )}

        {formData.role === 'supplier' && (
          <input name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
};

export default RegisterPage;
```

---

### Step 15 — Start Both Servers and Test End-to-End

**Terminal 1 (backend):**
```bash
cd C:\Users\USER\Desktop\agrilink\agrilink-backend
npm run dev
```

**Terminal 2 (frontend — open a second terminal with Ctrl+Shift+`):**
```bash
cd C:\Users\USER\Desktop\agrilink\agrilink-frontend
npm run dev
```

Open browser → `http://localhost:5173`

Flow to test:
1. You should be redirected to `/login`
2. Click "Register here" → fill in the form as a farmer → submit
3. You should land on the Farmer Dashboard showing your name and role
4. Click "Log Out"
5. Log back in with the same credentials
6. You should land on the Farmer Dashboard again
7. Register a second user as a buyer — they land on the Buyer Dashboard

---

## 12. Sprint 2 Completion Checklist

```
BACKEND
□ utils/generateToken.js — created and exports generateToken(userId, role)
□ middleware/authMiddleware.js — protect function reads + verifies JWT
□ middleware/roleMiddleware.js — restrictTo(...roles) factory function
□ controllers/authController.js — register, login, getMe, updateProfile, changePassword
□ routes/authRoutes.js — all 5 routes wired to controllers
□ server.js — auth route uncommented: app.use('/api/v1/auth', ...)

POSTMAN TESTS
□ POST /api/v1/auth/register — farmer → 201, token in response, no password visible
□ POST /api/v1/auth/register — buyer → 201
□ POST /api/v1/auth/login — 200, token returned
□ GET /api/v1/auth/me — with Bearer token → 200, user data
□ GET /api/v1/auth/me — without token → 401
□ POST /api/v1/auth/login — wrong password → 401
□ Verified in Atlas: users collection has documents, password is hashed

FRONTEND
□ npm install react-router-dom axios done
□ src/services/authService.js — created
□ src/context/AuthContext.jsx — created with AuthProvider and useAuth hook
□ src/main.jsx — wrapped with AuthProvider
□ src/App.jsx — replaced with BrowserRouter + Routes
□ src/pages/LoginPage.jsx — form with email + password, error display
□ src/pages/RegisterPage.jsx — full form with role selector, conditional fields
□ src/pages/FarmerDashboard.jsx — shell with name/role display + logout
□ src/pages/BuyerDashboard.jsx — shell with name/role display + logout
□ src/pages/SupplierDashboard.jsx — shell with name/role/verified display + logout

END-TO-END
□ Register farmer → lands on FarmerDashboard automatically
□ Register buyer → lands on BuyerDashboard automatically
□ Logout → redirected to /login
□ Login again → correct dashboard loads
□ Visit /farmer/dashboard without token → redirected to /login

GIT
□ git add . && git commit -m "feat: Sprint 2 authentication + dashboard shells"
□ git push origin main
```

---

## 13. Documentation — What to Write After Sprint 2

**Chapter 4 — System Analysis and Design (add to existing sections):**

Section 4.5 — Authentication Architecture: Describe the JWT-based stateless authentication. Explain that on login, the server signs a token containing userId and role. On every subsequent protected request, the client sends this token in the `Authorization: Bearer` header. The server verifies the signature without a database lookup (stateless). Only on the final step does it fetch the user to confirm the account is still active.

Section 4.6 — Role-Based Access Control (RBAC): Describe the three middleware layers: `protect` (authentication), `restrictTo` (authorization), and how they chain together. Give an example: `[protect, restrictTo('farmer')]` on a create-listing route means "you must be logged in AND you must be a farmer."

**Chapter 5 — Implementation (start this chapter):**

Section 5.1 — Backend Auth Implementation: Walk through the register and login flows. Include the key code decisions: why you use `validateBeforeSave: false` when saving lastLogin, why you never say "email not found" (security), why the bcrypt pre-save hook fires only when `isModified('password')`.

---

*End of HANDOFF.md — Sprint 2. Update this file at the end of each sprint.*
