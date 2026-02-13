# Portfolio - Full Stack Application

A modern full-stack portfolio website built with React, TypeScript, and Node.js/Express.

## Project Structure

```
portfolio/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── backend/           # Node.js/Express backend server
│   ├── server.js
│   ├── package.json
│   └── README.md
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:3000` (or configured port)

### Full Stack Development

To run both frontend and backend simultaneously:

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm start
```

## Deployment

### Frontend Deployment (Vercel, Netlify, GitHub Pages)
- Deploy the `frontend` folder independently
- Set build command: `npm run build`
- Set output directory: `dist`

### Backend Deployment (Heroku, Railway, Render)
- Deploy the `backend` folder independently
- Set start command: `npm start` (or as configured in package.json)

## GitHub Setup

This monorepo can be deployed in two ways:

### Option 1: Separate Repositories
1. Create two separate repositories on GitHub
2. Push frontend to one repository
3. Push backend to another repository

### Option 2: Single Monorepo
1. Keep this structure and push the entire folder
2. Services like Vercel, Netlify, and Railway support monorepos with path configuration

## Features

- Modern React UI with Framer Motion animations
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Smooth scrolling navigation
- Mobile-optimized interface
- Backend API integration

## License

© 2026 Shreyansh Patel - All Rights Reserved
