# Quick Start Guide

Your portfolio project has been reorganized into a clean monorepo structure with separate Frontend and Backend folders.

## 📁 Project Structure

```
portfolio/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── styles/          # CSS files
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/              # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                 # Node.js + Express
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── related files
│
├── README.md               # Project overview
├── DEPLOYMENT.md           # Deployment guide
└── .gitignore             # Git configuration
```

## 🚀 Running Locally

### Starting Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Starting Backend

```bash
cd backend
npm install
npm start
```

Backend runs at: `http://localhost:3000` (or your configured port)

### Run Both Simultaneously

**Terminal 1:**
```bash
cd frontend
npm run dev
```

**Terminal 2:**
```bash
cd backend
npm start
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

### Backend Deployment
Backend runs directly from `npm start`

## 🌐 Deploying to GitHub

### Option 1: Separate Repositories (Recommended)

**Frontend Repo:**
- Push only the `frontend` folder contents to a new repo
- Deploy frontend to Vercel/Netlify

**Backend Repo:**
- Push only the `backend` folder contents to a new repo
- Deploy backend to Railway/Render

### Option 2: Monorepo on GitHub

- Push the entire folder containing both `frontend` and `backend`
- Configure deployments with path settings (baseline directory)

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
PORT=3000
NODE_ENV=development
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:3000
```

## 📚 Useful Commands

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run dev` | frontend | Development server |
| `npm run build` | frontend | Production build |
| `npm start` | backend | Start server |
| `npm run build` | backend | Build backend (if applicable) |

## 🚢 Deployment Checklist

- [ ] Set up GitHub repository
- [ ] Configure frontend .env variables
- [ ] Configure backend .env variables
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Railway/Render
- [ ] Test API connections between frontend and backend
- [ ] Set up custom domain (if applicable)
- [ ] Configure CORS in backend for frontend URL

## 📖 For More Details

- Read `DEPLOYMENT.md` for detailed deployment instructions
- Check `frontend/README.md` for frontend-specific info
- Check `backend/README.md` for backend-specific info

---

**Ready to deploy?** Start with the [DEPLOYMENT.md](DEPLOYMENT.md) guide!
