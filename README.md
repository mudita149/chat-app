<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</div>

<h1 align="center" style="color: #61DAFB;">🌟 Real-Time Chat Application 🌟</h1>

<p align="center">
  A full-stack, real-time messaging platform built with the MERN stack and Socket.IO.
</p>

<p align="center">
  <strong>🔴 Live Demo:</strong> <a href="https://testing-hwtk.onrender.com/">https://testing-hwtk.onrender.com/</a>
</p>

## ✨ Features

- **🛡️ Authentication**: Secure sign-up and login with JWT and bcrypt.
- **💬 Real-time Messaging**: Instant communication powered by Socket.IO.
- **🖼️ Media Sharing**: Upload and share images effortlessly, integrated with Cloudinary.
- **🎨 Responsive UI**: Beautifully styled with TailwindCSS for seamless use on any device.
- **🟢 Online Status**: See who's online right now.

## 🛠️ Technology Stack

### Frontend (Client)
- **⚛️ React 19** with **Vite** for blazing fast performance
- **💅 TailwindCSS** for styling
- **🔌 Socket.IO Client** for WebSocket communication
- **🚦 React Router DOM** for navigation
- **🍞 React Hot Toast** for elegant notifications

### Backend (Server)
- **🟢 Node.js & Express** for the REST API
- **🗄️ MongoDB & Mongoose** for database management
- **🔐 JWT & Bcryptjs** for secure authentication
- **☁️ Cloudinary** for seamless image hosting
- **🔌 Socket.IO** for handling real-time events

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1️⃣ Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with a [MongoDB](https://www.mongodb.com/) instance and a [Cloudinary](https://cloudinary.com/) account.

### 2️⃣ Clone the Repository
```bash
git clone <repository-url>
cd "chat app"
```

### 3️⃣ Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the server:
```bash
npm run dev
```

### 4️⃣ Frontend Setup
Open a new terminal and navigate to the client folder:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory (if needed):
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend application:
```bash
npm run dev
```

## 🎯 Usage
Once both the server and the client are running, simply open your browser and navigate to the frontend URL (usually `http://localhost:5173`). Sign up, connect with friends, and start chatting!

<hr />
<p align="center">
  Made with ❤️ by Mudita Shukla
</p>
