# KageChat 💬

Real-time chat application built with MERN stack.

## 🚀 Features
- User authentication with JWT & Refresh Token
- Secure password hashing with bcrypt
- Session management with MongoDB
- RESTful API architecture

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt, crypto
- **Security**: httpOnly cookies, CORS

## 📁 Project Structure
```
kagechat/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   └── package.json
└── README.md
```

## 🔧 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB

### Backend Setup
```bash
cd backend
npm install
```

### Environment Variables
Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### Run Development Server
```bash
npm run dev
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login user |

## 👨‍💻 Author
Syntax Ngo

## 📝 License
MIT