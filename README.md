# 🚀 Shreyansh Patel - Portfolio

A modern, interactive full-stack portfolio built with React, TypeScript, and Node.js. Deployed on Vercel with a fully functional contact form and email notifications.

## 🌐 Live Portfolio

**👉 [Visit My Portfolio](https://shreyansh-intro.vercel.app)**

## ✨ Features

- 🎨 **Modern UI** - Responsive, animated design with Tailwind CSS
- 📧 **Contact Form** - Send messages directly to my inbox
- ✨ **Smooth Animations** - Parallax effects and scroll animations
- 📱 **Fully Responsive** - Works beautifully on all devices
- 🔄 **Auto-Deployed** - Push to GitHub → Auto-deploy via Vercel
- ⚡ **Production Ready** - Both frontend and backend on Vercel

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Lightning-fast build tool)
- Tailwind CSS (Utility-first styling)
- Lucide Icons

### Backend
- Node.js + Express
- Nodemailer (Gmail integration)
- CORS enabled for production

## 📂 Project Structure

```
newportfolio/
├── frontend/          # React Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── styles/
│   └── vercel.json
├── backend/          # Node.js Express server
│   ├── server.js
│   ├── api/
│   └── vercel.json
└── VERCEL_DEPLOYMENT.md
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev      # Local development
npm run build    # Production build
```

### Backend
```bash
cd backend
npm install
cp .env.example .env    # Configure with your Gmail
npm run dev             # Start with nodemon
```

## 📧 Contact Form

The contact form works end-to-end:
1. User submits form on portfolio
2. Request sent to backend API
3. Email notification to your Gmail inbox
4. User gets instant feedback

## 🌍 Deployment

Both frontend and backend are deployed on **Vercel**:
- **Frontend**: https://shreyansh-intro.vercel.app
- **Backend API**: https://shreyansh-portfolio-one.vercel.app/api/contact

Every push to `main` automatically deploys both apps!

## 💻 Environment Variables

### Backend (`backend/.env`)
```
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://shreyansh-intro.vercel.app
PORT=5000
NODE_ENV=production
```

### Frontend (Set in Vercel)
```
VITE_API_BASE_URL=https://shreyansh-portfolio-one.vercel.app
```

## 📞 Get In Touch

- 📧 Email: shreyanshmpatel1408@gmail.com
- 💼 LinkedIn: [@shreyansh-patel](https://www.linkedin.com/in/shreyansh-patel-581b41371/)
- 🐙 GitHub: [@shreyansh-real](https://github.com/shreyansh-real)
- 📸 Instagram: [@not.real_shreyansh](https://www.instagram.com/not.real_shreyansh/)

## 📝 License

This project is open source and available under the MIT License.

---

**Made with ❤️ by Shreyansh Patel** | [Visit Portfolio](https://shreyansh-intro.vercel.app)
