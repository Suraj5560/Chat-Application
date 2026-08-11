# 💬 Chat Application

A full-stack real-time chat application built with the **MERN stack** and **Socket.IO**

![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io&logoColor=white)

---

## ✨ Features

### Core
- **Real-time messaging** — Instant message delivery powered by Socket.IO
- **Image sharing** — Send images in chat with Cloudinary storage
- **Online status** — Live green/grey dot indicators for user presence
- **Unseen message badges** — Unread count badges that clear on click

### Chat Management
- **Pin conversations** — Pin important chats to the top of the sidebar
- **Delete conversations** — Remove chats from your view (user-specific, safe deletion)
- **Context menu** — WhatsApp-style dropdown with pin/delete options on hover

### User Experience
- **Profile management** — Update display name, bio, and profile picture
- **Contact info panel** — View user details with full-screen profile image viewer
- **Resizable sidebar** — Drag to adjust sidebar width
- **Responsive design** — Mobile-friendly layout with adaptive components
- **Smooth animations** — Framer Motion transitions throughout the UI
- **Toast notifications** — Non-intrusive success/error feedback

### Auth & Security
- **JWT authentication** — Secure token-based login/signup
- **Password hashing** — bcrypt-encrypted passwords
- **Protected routes** — Middleware-guarded API endpoints

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Framer Motion** | Animations & transitions |
| **Axios** | HTTP client |
| **Socket.IO Client** | Real-time WebSocket connection |

### Backend
| Technology | Purpose |
|---|---|
| **Express 5** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **Socket.IO** | Real-time bidirectional events |
| **Cloudinary** | Image upload & storage |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |

---

## 📁 Project Structure

```
chat-app/
├── backend/
│   ├── controller/          # Route handlers
│   │   ├── auth.controller.js
│   │   ├── message.controller.js
│   │   └── profile.controller.js
│   ├── db/                  # Database connection
│   ├── lib/                 # Cloudinary config
│   ├── middleware/           # Auth middleware (JWT verification)
│   ├── model/               # Mongoose schemas
│   │   ├── user.model.js
│   │   └── message.model.js
│   ├── routes/              # API route definitions
│   ├── app.js               # Server entry point + Socket.IO setup
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── UserAvatar.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/         # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── pages/           # Page-level components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── styles/          # CSS files
│   │   │   ├── index.css    # Design tokens & CSS variables
│   │   │   ├── chat.css     # Chat layout styles
│   │   │   ├── auth.css     # Login/signup styles
│   │   │   ├── profile.css  # Profile page styles
│   │   │   └── components.css
│   │   ├── lib/             # Axios instance
│   │   └── App.jsx          # Root component with routing
│   └── .env                 # Frontend env (API base URL)
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
CLOUD_NAME = "your_cloudinary_cloud_name"
CLOUDINARY_API_KEY = "your_api_key"
CLOUDINARY_SECRET_KEY = "your_api_secret"
JWT_SECRET_KEY = your_jwt_secret_key
```

> 💡 Generate a JWT secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Update the MongoDB connection string in `backend/db/db.js` with your own MongoDB Atlas URI.

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Run the application

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 3000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.


