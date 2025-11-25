# KageChat 💬

Real-time chat application built with MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### Authentication & Security
- ✅ User registration with form validation (Zod)
- ✅ User login with JWT & Refresh Token
- ✅ Auto refresh token on 401 errors
- ✅ Secure password hashing with bcrypt
- ✅ Session management with MongoDB TTL
- ✅ Protected routes with auto redirect
- ✅ httpOnly cookies for security
- ✅ Request queue to prevent duplicate refresh calls

### Frontend
- ✅ Modern UI with TailwindCSS v4
- ✅ Form validation with React Hook Form + Zod
- ✅ State management with Zustand
- ✅ Toast notifications with Sonner
- ✅ Loading states and error handling
- ✅ Responsive design

### Coming Soon
- 🔄 Real-time messaging with Socket.io
- 🔄 User profiles with avatars (Cloudinary)
- 🔄 Friend system
- 🔄 Group chat
- 🔄 Message history
- 🔄 Online/offline status

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, httpOnly cookies, CORS
- **Dev Tools**: nodemon

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 4.1.17
- **State Management**: Zustand 5.0.2
- **Routing**: React Router v7
- **Forms**: React Hook Form 7.54.2 + Zod 3.24.1
- **HTTP Client**: Axios 1.7.9
- **UI Components**: Lucide React (icons), Sonner (toast)
- **Linting**: ESLint 9.17.0

## 📁 Project Structure

```
kagechat/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   └── userController.js    # User management
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js    # JWT verification
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Session.js           # Refresh token storage with TTL
│   │   ├── routes/
│   │   │   ├── authRoute.js         # Auth endpoints
│   │   │   └── userRoute.js         # User endpoints
│   │   └── server.js                # Entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx  # Protected route wrapper
│   │   │   ├── ui/                     # Reusable UI components
│   │   │   ├── signin-form.tsx         # Sign in form
│   │   │   └── signup-form.tsx         # Sign up form
│   │   ├── lib/
│   │   │   ├── axios.ts                # Axios config with interceptors
│   │   │   └── utils.ts                # Utility functions
│   │   ├── pages/
│   │   │   ├── ChatAppPage.tsx         # Main chat page
│   │   │   ├── SignInPage.tsx          # Sign in page
│   │   │   └── SignUpPage.tsx          # Sign up page
│   │   ├── services/
│   │   │   └── authService.ts          # Auth API calls
│   │   ├── stores/
│   │   │   └── useAuthStore.ts         # Zustand auth store
│   │   ├── types/
│   │   │   └── store.ts                # TypeScript types
│   │   ├── App.tsx                     # Root component with routes
│   │   └── main.tsx                    # Entry point
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## 🔧 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file:**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/kagechat
ACCESS_TOKEN_SECRET=your_secret_key_here_min_32_characters
REFRESH_TOKEN_SECRET=your_refresh_secret_key_here_min_32_characters
CLIENT_URL=http://localhost:5173
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Run development server:**
```bash
npm run dev
```

Server will run on `http://localhost:5001`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Run development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/signin` | Login user | ❌ |
| POST | `/api/auth/signout` | Logout user | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ (cookie) |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user profile | ✅ |

## 🔐 Authentication Flow

### 1. Sign Up (Frontend)
```typescript
// User fills form with validation
const schema = z.object({
  firstname: z.string().min(1, 'Vui lòng nhập tên'),
  lastname: z.string().min(1, 'Vui lòng nhập họ'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(7, 'Mật khẩu phải có ít nhất 7 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword']
});

// API call
POST /api/auth/signup
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Sign In (Frontend)
```typescript
POST /api/auth/signin
{
  "username": "johndoe",
  "password": "securepassword"
}

Response:
{
  "message": "Đăng nhập thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "displayName": "John Doe"
  }
}
+ Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Lax
```

### 3. Access Protected Routes
```typescript
// Frontend axios automatically attaches token
GET /api/users/me
Authorization: Bearer <accessToken>

Response:
{
  "message": "Lấy thông tin thành công",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe"
  }
}
```

### 4. Auto Refresh Token (On 401 Error)
```typescript
// Frontend axios interceptor
axios.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      // Attempt to refresh token
      const { data } = await axios.post('/api/auth/refresh', null, { withCredentials: true });
      const { accessToken } = data;
      // Save new access token
      setAccessToken(accessToken);
      // Retry original request with new token
      originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
      return axios(originalRequest);
    } catch (refreshError) {
      // Handle refresh token error (e.g., redirect to login)
      console.error('Refresh token failed:', refreshError);
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});
```

### 5. Sign Out
```bash
POST /api/auth/signout

Response: 204 No Content
+ Clear refreshToken cookie
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds = 10
- **Access Token**: JWT, expires in 30 minutes
- **Refresh Token**: Crypto random, expires in 14 days
- **httpOnly Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS only in production
- **SameSite**: CSRF protection
- **Session Storage**: MongoDB for refresh token management

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  displayName: String (required),
  email: String (unique, required),
  phone: String (optional, unique),
  dob: Date,
  passwordHash: String (required),
  avatarUrl: String,
  avatarId: String,
  bio: String (max 500 chars),
  createdAt: Date,
  updatedAt: Date
}
```

### Session Model
```javascript
{
  userId: ObjectId (ref: User),
  refreshToken: String (unique, required),
  expiresAt: Date (required),
  createdAt: Date
}
```

## 🚧 Roadmap

- [x] User authentication system
- [x] JWT with refresh token
- [x] Protected routes
- [ ] Refresh token endpoint
- [ ] User profile update
- [ ] Avatar upload (Cloudinary)
- [ ] Real-time messaging (Socket.io)
- [ ] Friend system
- [ ] Group chat
- [ ] Message history
- [ ] Online/offline status

## 👨‍💻 Author
**Syntax Ngo**

## 📝 License
MIT

---

**Note**: This is a learning project. Not recommended for production use without additional security measures.