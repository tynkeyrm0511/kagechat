# KageChat 💬

Real-time chat application built with MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### Authentication & Security
- ✅ User registration with form validation (Zod)
- ✅ User login with JWT & Refresh Token
- ✅ Auto refresh token on 401 errors with request queue
- ✅ Secure password hashing with bcrypt
- ✅ Session management with MongoDB TTL index
- ✅ Protected routes with auto redirect
- ✅ httpOnly cookies for security
- ✅ CORS configuration for cross-origin requests

### User Management
- ✅ User profile management (display name, bio, avatar)
- ✅ Change password functionality
- ✅ Search users by username or display name

### Friend System
- ✅ Send friend requests with optional message
- ✅ Accept/decline friend requests
- ✅ List all friends
- ✅ List pending friend requests
- ✅ Friend validation middleware for messaging

### Messaging
- ✅ Direct messaging (1-1) - requires friendship
- ✅ Group chat creation and management
- ✅ Send text messages
- ✅ Image message support (URL)
- ✅ Message history retrieval
- ✅ Unread message counter
- ✅ Last message tracking per conversation

### Frontend
- ✅ Modern UI with TailwindCSS v4
- ✅ Form validation with React Hook Form + Zod
- ✅ State management with Zustand
- ✅ Toast notifications with Sonner
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Auto token refresh with axios interceptors

### Coming Soon
- 🔄 Real-time messaging with Socket.io
- 🔄 Image upload to Cloudinary
- 🔄 Typing indicators
- 🔄 Message reactions
- 🔄 Online/offline status
- 🔄 Message read receipts
- 🔄 File sharing
- 🔄 Voice/video calls

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
│   │   ├── config/
│   │   │   └── db.js                    # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js        # Authentication logic
│   │   │   ├── userController.js        # User management
│   │   │   ├── friendController.js      # Friend system
│   │   │   ├── conversationController.js # Conversation management
│   │   │   └── messageController.js     # Message handling
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js        # JWT verification
│   │   │   ├── protectedRoute.js        # Protected route wrapper
│   │   │   └── friendMiddleware.js      # Friend validation
│   │   ├── models/
│   │   │   ├── User.js                  # User schema
│   │   │   ├── Session.js               # Refresh token with TTL
│   │   │   ├── Friend.js                # Friendship schema
│   │   │   ├── FriendRequest.js         # Friend request schema
│   │   │   ├── Conversation.js          # Conversation schema
│   │   │   └── Message.js               # Message schema
│   │   ├── routes/
│   │   │   ├── authRoute.js             # Auth endpoints
│   │   │   ├── userRoute.js             # User endpoints
│   │   │   ├── friendRoute.js           # Friend endpoints
│   │   │   ├── conversationRoute.js     # Conversation endpoints
│   │   │   └── messageRoute.js          # Message endpoints
│   │   └── server.js                    # Entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx   # Protected route wrapper
│   │   │   ├── ui/                      # Reusable UI components
│   │   │   ├── signin-form.tsx          # Sign in form
│   │   │   └── signup-form.tsx          # Sign up form
│   │   ├── lib/
│   │   │   ├── axios.ts                 # Axios with interceptors
│   │   │   └── utils.ts                 # Utility functions
│   │   ├── pages/
│   │   │   ├── ChatAppPage.tsx          # Main chat page
│   │   │   ├── SignInPage.tsx           # Sign in page
│   │   │   └── SignUpPage.tsx           # Sign up page
│   │   ├── services/
│   │   │   ├── authService.ts           # Auth API calls
│   │   │   ├── userService.ts           # User API calls
│   │   │   ├── friendService.ts         # Friend API calls
│   │   │   ├── conversationService.ts   # Conversation API calls
│   │   │   └── messageService.ts        # Message API calls
│   │   ├── stores/
│   │   │   └── useAuthStore.ts          # Zustand auth store
│   │   ├── types/
│   │   │   └── store.ts                 # TypeScript types
│   │   ├── App.tsx                      # Root component with routes
│   │   └── main.tsx                     # Entry point
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
MONGODB_CONNECTIONSTRING=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=Cluster0
CLIENT_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_secret_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_secret_min_32_chars
NODE_ENV=development
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
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/signin` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ❌ (cookie) |
| POST | `/api/auth/refresh` | Refresh access token | ❌ (cookie) |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user profile | ✅ |
| PUT | `/api/users/profile` | Update user profile | ✅ |
| POST | `/api/users/change-password` | Change password | ✅ |
| GET | `/api/users/search?q=keyword` | Search users | ✅ |

### Friends
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/friends/requests` | Send friend request | ✅ |
| POST | `/api/friends/request/:id/accept` | Accept friend request | ✅ |
| POST | `/api/friends/request/:id/decline` | Decline friend request | ✅ |
| GET | `/api/friends` | Get friends list | ✅ |
| GET | `/api/friends/requests` | Get pending requests | ✅ |

### Conversations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/conversations` | Get all conversations | ✅ |
| POST | `/api/conversations/direct` | Create direct chat | ✅ (requires friendship) |
| POST | `/api/conversations/group` | Create group chat | ✅ (requires friendship with members) |
| GET | `/api/conversations/:id` | Get conversation details | ✅ |

### Messages
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/messages/direct` | Send direct message | ✅ (requires friendship) |
| POST | `/api/messages/group` | Send group message | ✅ (requires membership) |
| GET | `/api/messages/:conversationId` | Get messages | ✅ |

## 🔐 Authentication Flow

### 1. Registration
```typescript
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "displayName": "John Doe"
}

Response: 201 Created
{
  "message": "Nguoi dung John Doe da duoc tao thanh cong!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
+ Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=None
```

### 2. Login
```typescript
POST /api/auth/signin
{
  "username": "johndoe",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "message": "Nguoi dung John Doe da dang nhap!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
+ Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=None
```

### 3. Access Protected Routes
```typescript
GET /api/users/me
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "message": "Lay thong tin thanh cong",
  "user": {
    "_id": "673abc123...",
    "username": "johndoe",
    "displayName": "John Doe",
    "email": "john@example.com",
    "avatarUrl": null,
    "bio": null
  }
}
```

### 4. Auto Refresh Token (Frontend Axios Interceptor)
```typescript
// When access token expires (401 error)
// Frontend automatically:
1. Detects 401 error
2. Calls POST /api/auth/refresh (with httpOnly cookie)
3. Gets new accessToken
4. Retries original request with new token
5. Uses queue to prevent duplicate refresh calls

// If refresh fails → logout user
```

### 5. Logout
```typescript
POST /api/auth/logout

Response: 200 OK
{
  "message": "Dang xuat thanh cong"
}
+ Clear refreshToken cookie
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **Access Token**: JWT, expires in 15 minutes (30s in dev)
- **Refresh Token**: Crypto random, expires in 14 days
- **httpOnly Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS only (production)
- **SameSite=None**: For cross-origin requests
- **CORS**: Configured for frontend origin
- **Session Storage**: MongoDB with TTL index
- **Protected Routes**: JWT middleware validation
- **Friend Validation**: Can only message friends (direct chat)

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required, min: 3, max: 20),
  displayName: String (required),
  email: String (unique, required),
  passwordHash: String (required),
  avatarUrl: String (optional),
  avatarId: String (optional),
  bio: String (optional, max: 500),
  createdAt: Date,
  updatedAt: Date
}
```

### Session Model
```javascript
{
  userId: ObjectId (ref: User, required),
  refreshToken: String (unique, required),
  deviceInfo: String (optional),
  expiresAt: Date (required, TTL index),
  createdAt: Date
}
```

### Friend Model
```javascript
{
  userA: ObjectId (ref: User, required),
  userB: ObjectId (ref: User, required),
  createdAt: Date,
  // Indexes: { userA: 1, userB: 1 }, { userA: 1 }, { userB: 1 }
  // Pre-save hook: ensures userA < userB for consistency
}
```

### FriendRequest Model
```javascript
{
  from: ObjectId (ref: User, required),
  to: ObjectId (ref: User, required),
  message: String (optional),
  status: String (enum: ['pending', 'accepted', 'declined'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date,
  // Indexes: { from: 1, to: 1 }, { to: 1, status: 1 }
}
```

### Conversation Model
```javascript
{
  type: String (enum: ['direct', 'group'], required),
  participants: [{
    userId: ObjectId (ref: User),
    joinedAt: Date
  }],
  group: {
    name: String,
    avatar: String,
    createdBy: ObjectId (ref: User),
    admins: [ObjectId]
  },
  lastMessage: {
    _id: String,
    content: String,
    senderId: ObjectId,
    messageType: String,
    createdAt: Date
  },
  lastMessageAt: Date,
  unreadCounts: Map<String, Number>,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  conversationId: ObjectId (ref: Conversation, required),
  senderId: ObjectId (ref: User, required),
  content: String (required),
  messageType: String (enum: ['text', 'image'], default: 'text'),
  imgUrl: String (optional),
  imgId: String (optional),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚧 Friend System Logic

### Direct Messages (1-1)
```
User A wants to message User B:
1. Check if A and B are friends (Friend.findOne({ userA, userB }))
2. If NOT friends → 403 Forbidden
3. If friends:
   - Find or create Conversation (type: 'direct')
   - Create Message
   - Update lastMessage & unreadCounts
```

### Group Messages
```
User A wants to create group with [B, C, D]:
1. Check if A is friends with ALL [B, C, D]
2. If NOT friends with any → 403 Forbidden with list
3. If all friends:
   - Create Conversation (type: 'group')
   - Add all as participants
   - Set A as creator & admin
```

### Message Sending
```
Direct: POST /api/messages/direct
{
  "recipientId": "user_id",      // For first message
  "conversationId": "conv_id",   // For subsequent messages
  "content": "Hello!"
}

Group: POST /api/messages/group
{
  "conversationId": "group_id",  // Required
  "content": "Hello team!"
}
```

## 📊 Key Features Explanation

### Pre-save Hook in Friend Model
```javascript
// Ensures userA < userB alphabetically
// This prevents duplicate friendships:
// Instead of: {A, B} and {B, A}
// We only have: {A, B}
friendSchema.pre("save", async function () {
  const a = this.userA.toString();
  const b = this.userB.toString();
  if (a > b) {
    [this.userA, this.userB] = [this.userB, this.userA];
  }
});
```

### Request Queue in Axios Interceptor
```typescript
// Prevents duplicate refresh token calls
let isRefreshing = false;
let failedQueue: any[] = [];

// When multiple requests fail with 401:
// 1. First request triggers refresh
// 2. Other requests wait in queue
// 3. After refresh, all queued requests retry
```

### Unread Count System
```typescript
// Conversation.unreadCounts: Map<userId, count>
// When user sends message:
conversation.unreadCounts.set(senderId, 0);  // Reset sender's count
otherParticipants.forEach(p => {
  const current = conversation.unreadCounts.get(p.userId) || 0;
  conversation.unreadCounts.set(p.userId, current + 1);  // Increment others
});

// When user reads messages:
conversation.unreadCounts.set(userId, 0);  // Reset on GET /messages/:id
```

## 🚧 Roadmap

### Completed ✅
- [x] User authentication system (register, login, logout)
- [x] JWT with refresh token and auto-refresh
- [x] Protected routes with middleware
- [x] User profile management
- [x] Friend request system (send, accept, decline)
- [x] Friend list and pending requests
- [x] Direct messaging (1-1)
- [x] Group chat creation
- [x] Message history retrieval
- [x] Unread message counter
- [x] Friend validation middleware

### In Progress 🔄
- [ ] Swagger/OpenAPI documentation
- [ ] Real-time messaging with Socket.io
- [ ] Online/offline status

### Planned 📝
- [ ] Avatar upload to Cloudinary
- [ ] Image upload for messages
- [ ] Typing indicators
- [ ] Message reactions
- [ ] Message read receipts
- [ ] Group admin features (add/remove members)
- [ ] File sharing
- [ ] Voice/video calls
- [ ] Push notifications
- [ ] Message search
- [ ] Archive conversations

## 🧪 Testing

### Manual Testing with Thunder Client / Postman

**1. Register:**
```bash
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!",
  "displayName": "Test User"
}
```

**2. Login:**
```bash
POST http://localhost:5001/api/auth/signin
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123!"
}
```

**3. Get Profile:**
```bash
GET http://localhost:5001/api/users/me
Authorization: Bearer <accessToken>
```

**4. Send Friend Request:**
```bash
POST http://localhost:5001/api/friends/requests
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "to": "other_user_id",
  "message": "Let's be friends!"
}
```

**5. Accept Friend Request:**
```bash
POST http://localhost:5001/api/friends/request/{requestId}/accept
Authorization: Bearer <accessToken>
```

**6. Send Message:**
```bash
POST http://localhost:5001/api/messages/direct
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "recipientId": "friend_user_id",
  "content": "Hello friend!"
}
```

## 📝 Environment Variables

### Backend `.env`
```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_CONNECTIONSTRING=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ACCESS_TOKEN_SECRET=your_64_char_hex_string_here
REFRESH_TOKEN_SECRET=your_64_char_hex_string_here

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend `.env` (optional)
```env
VITE_API_URL=http://localhost:5001/api
```

## 👨‍💻 Author
**Hoang Nguyen (Syntax Ngo)**
- GitHub: [@syntaxSolution]
- Email: hoangnguyen150603@gmail.com

## 📝 License
MIT License - feel free to use this project for learning purposes.

## 🙏 Acknowledgments
- MERN Stack Community
- React Router v7
- TailwindCSS v4
- Zustand for simple state management
- Mongoose for elegant MongoDB object modeling

---

**Note**: This is a learning project built for educational purposes. Additional security measures and optimizations should be implemented before production deployment.

## 🐛 Known Issues
- Socket.io not yet implemented (real-time features pending)
- Image upload to Cloudinary pending
- No message pagination yet (loads all messages)
- No rate limiting on API endpoints

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Complete authentication system
- ✅ User management
- ✅ Friend system
- ✅ Direct & group messaging
- ✅ Message history

### Coming in v1.1.0
- 🔄 Real-time messaging
- 🔄 Swagger documentation
- 🔄 Image uploads

---

**Last Updated**: December 2024