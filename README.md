# KageChat 💬

Real-time chat application built with MERN stack.

## 🚀 Features
- ✅ User authentication with JWT & Refresh Token
- ✅ Secure password hashing with bcrypt
- ✅ Session management with MongoDB
- ✅ Protected routes with middleware
- ✅ httpOnly cookies for security
- ✅ RESTful API architecture
- 🔄 Real-time messaging (Coming soon)
- 🔄 User profiles with avatars (Coming soon)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, httpOnly cookies, CORS
- **Dev Tools**: nodemon

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
│   │   │   └── Session.js           # Refresh token storage
│   │   ├── routes/
│   │   │   ├── authRoute.js         # Auth endpoints
│   │   │   └── userRoute.js         # User endpoints
│   │   └── server.js                # Entry point
│   ├── .env
│   └── package.json
└── README.md
```

## 🔧 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

### Environment Variables
Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kagechat
ACCESS_TOKEN_SECRET=your_secret_key_here_min_32_characters
REFRESH_TOKEN_SECRET=your_refresh_secret_key_here_min_32_characters
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Run Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

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

### 1. Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Sign In
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword"
}

Response:
{
  "message": "Đăng nhập thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
+ Set-Cookie: refreshToken=...; HttpOnly
```

### 3. Access Protected Routes
```bash
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

### 4. Sign Out
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