# Vercel Deployment Guide - Full Stack

This guide will help you deploy both frontend and backend on Vercel.

## Project Structure

```
newportfolio/
├── backend/
│   ├── api/
│   │   └── index.js
│   ├── server.js
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
├── vercel.json (root)
```

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. Deploy Backend

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. **Important**: Set Root Directory to `backend`
5. Configure environment variables (see section below)
6. Click "Deploy"

**Backend Environment Variables to Add:**
- `NODE_ENV`: `production`
- `GMAIL_EMAIL`: Your Gmail address
- `GMAIL_PASSWORD`: Your Gmail app password (NOT your regular password)
- (Optional) `FRONTEND_URL`: https://your-frontend-domain.vercel.app

> **Note**: To get Gmail app password:
> 1. Enable 2-Factor Authentication on your Gmail
> 2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
> 3. Generate an app password for Mail

### 3. Deploy Frontend

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository again
4. **Important**: Set Root Directory to `frontend`
5. Configure environment variables:
   - `VITE_API_URL`: `https://your-backend-domain.vercel.app` (get this from backend deployment)
6. Click "Deploy"

### 4. Update Backend CORS

After frontend is deployed, go back to your backend project in Vercel:
1. Go to Settings → Environment Variables
2. Add/Update `FRONTEND_URL` with your frontend domain: `https://your-frontend-domain.vercel.app`
3. Go to Deployments → click the latest deployment → click "Redeploy"

### 5. Update Frontend API URL

If you need to change the API URL in frontend:
1. Go to your frontend project in Vercel
2. Settings → Environment Variables
3. Update `VITE_API_URL` if needed
4. Go to Deployments → Redeploy latest

## Testing Your Deployment

### Test Backend Health Check
```bash
curl https://your-backend-domain.vercel.app/api/health
```

### Test Contact Form
```bash
curl -X POST https://your-backend-domain.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### Test Frontend
Visit `https://your-frontend-domain.vercel.app` and verify:
- [ ] Page loads correctly
- [ ] All styles and animations work
- [ ] Contact form submits without errors
- [ ] You receive email when form is submitted

## Troubleshooting

### Backend Shows 500 Error
- Check Environment Variables are set correctly
- Check Vercel Logs: Dashboard → Project → Deployments → Logs
- Ensure Gmail credentials are valid

### Contact Form Not Sending Emails
1. Verify Gmail credentials in Environment Variables
2. Make sure you're using Gmail App Password, not regular password
3. Check backend logs for specific error
4. Verify FRONTEND_URL is added to CORS origins

### Frontend Can't Reach Backend
1. Check `VITE_API_URL` environment variable
2. Ensure backend deployment is successful
3. Verify CORS headers are correct in backend
4. Check browser console for CORS errors

### Static Assets Not Loading
1. Check that `dist` folder is generated correctly
2. Verify `outputDirectory` in frontend `vercel.json`
3. Check build logs in Vercel dashboard

## Environment Variables Reference

### Backend (.env locally / Vercel Settings)
```
PORT=3000
NODE_ENV=production
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-specific-password
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env.local locally / Vercel Settings)
```
VITE_API_URL=https://your-backend-domain.vercel.app
```

## Important Notes

⚠️ **Do NOT**:
- Commit `.env` files to GitHub
- Use regular Gmail password (use App Password)
- Expose sensitive keys in frontend code

✅ **DO**:
- Set environment variables in Vercel dashboard
- Use `.env.local` for local development
- Keep `.env.local` in `.gitignore`

## Domain Names

Once deployed, you'll get these URLs:
- **Backend**: `https://portfolio-backend.vercel.app`
- **Frontend**: `https://portfolio-frontend.vercel.app`

You can later connect custom domains through Vercel dashboard.

## Continuous Deployment

✅ Automatic deployment is enabled!
- Any push to `main` branch will automatically deploy both apps
- Check Deployment History in Vercel dashboard
- Rollback any deployment if needed

## Next Steps

After successful deployment:
1. [ ] Test all functionality
2. [ ] Add custom domain
3. [ ] Set up custom email domain for contact form (optional)
4. [ ] Monitor performance in Vercel Analytics
5. [ ] Set up error tracking/monitoring

---

For issues or questions, check Vercel documentation at [vercel.com/docs](https://vercel.com/docs)
