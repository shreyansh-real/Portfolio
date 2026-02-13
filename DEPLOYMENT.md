# Deployment Guide

This monorepo contains two independently deployable applications: Frontend and Backend.

## Frontend Deployment

### Option 1: Vercel (Recommended)
1. Push your `frontend` folder to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and select your repository
4. Set the root directory to `frontend`
5. Deploy automatically on every push

### Option 2: Netlify
1. Push your `frontend` folder to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Set base directory: `frontend`

### Option 3: GitHub Pages
1. Add to `frontend/package.json`:
   ```json
   "homepage": "https://yourusername.github.io/portfolio"
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add deploy scripts to `package.json`:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
4. Run: `npm run deploy`

## Backend Deployment

### Option 1: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select your repository
4. In settings, set Root Directory to `backend`
5. Set start command: `npm start`
6. Add environment variables (.env)

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect to your GitHub repository
4. Set Root Directory to `backend`
5. Set Build Command: `npm install`
6. Set Start Command: `npm start`

### Option 3: Heroku (Legacy)
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Set buildpack: `heroku buildpacks:set heroku/nodejs`
4. Configure `Procfile`:
   ```
   web: npm start
   ```
5. Deploy: `git push heroku main`

### Option 4: Azure App Service
1. Go to [azure.microsoft.com](https://azure.microsoft.com)
2. Create new App Service
3. Set Runtime to Node.js
4. Configure deployment from GitHub
5. Set App Settings for environment variables

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=production
DATABASE_URL=your_database_url
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
```

## CI/CD Pipeline with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install && npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: frontend-dist
          path: frontend/dist

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: npm test # if you have tests
```

## Connecting Frontend to Backend

In your frontend `.env`:
```
VITE_API_URL=https://your-backend-deployed-url.com
```

Then in your API calls:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const response = await fetch(`${apiUrl}/api/endpoint`);
```

## Monitoring & Logs

- **Vercel**: Dashboard → Analytics & Logs
- **Railway**: Dashboard → Logs
- **Render**: Services → Web Service → Logs
- **Heroku**: `heroku logs --tail`

---

For questions or issues, refer to the individual service documentation or the README files in each folder.
