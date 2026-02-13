# 🚀 Backend Setup & Troubleshooting Guide

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Create `.env` File
```bash
cp .env.example .env
```

Then edit `backend/.env` with your Gmail credentials:
```
GMAIL_EMAIL=your_email@gmail.com
GMAIL_PASSWORD=your_app_password_or_gmail_password
PORT=5000
```

### Step 3: Start the Server
```bash
npm run dev
```

You should see:
```
🚀 Backend Server Started
📍 Server: http://localhost:5000
🏥 Health Check: http://localhost:5000/api/health
📧 Contact Endpoint: POST http://localhost:5000/api/contact

📋 Configuration Status:
✓ Gmail email configured
✓ Gmail password configured

💡 Tip: Make sure your React app is running on port 3000 or 5173
```

---

## Complete Gmail Setup Instructions

### Option 1: Gmail with 2FA Enabled (RECOMMENDED)

1. **Go to App Passwords:**
   - Visit: https://myaccount.google.com/apppasswords
   - You may need to log in and complete security verification

2. **Generate App Password:**
   - Select "Mail" under "Select app"
   - Select "Windows Computer" (or your device type)
   - Click "Generate"

3. **Copy the Password:**
   - Google will show a 16-character password
   - **Copy it WITHOUT spaces**
   - Example: `abcdefghijklmnop`

4. **Add to .env:**
   ```
   GMAIL_EMAIL=your_email@gmail.com
   GMAIL_PASSWORD=abcdefghijklmnop
   ```

### Option 2: Gmail WITHOUT 2FA

1. **Enable Less Secure Apps:**
   - Go to: https://myaccount.google.com/u/0/lesssecureapps
   - Turn ON "Allow less secure apps"

2. **Add to .env:**
   ```
   GMAIL_EMAIL=your_email@gmail.com
   GMAIL_PASSWORD=your_actual_gmail_password
   ```

---

## Testing the Setup

### Test 1: Check if Backend is Running
```bash
# From any terminal
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Backend server is running",
  "gmailConfigured": true,
  "timestamp": "2024-02-11T10:30:45.123Z"
}
```

### Test 2: Send a Test Emailcd
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Message sent successfully! I will get back to you soon."
}
```

---

## Troubleshooting Common Errors

### ❌ "Failed to connect to server. Please make sure the backend is running on port 5000."

**Solution:**
1. Make sure you're in the correct directory:
   ```bash
   cd backend
   ```

2. Check if Node.js is installed:
   ```bash
   node --version
   npm --version
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Verify it's running:
   ```bash
   q
   ```

---

### ❌ "Email service not configured. Backend is running but Gmail credentials are missing."

**Solution:**
1. Check if `.env` file exists in backend folder:
   ```bash
   ls -la backend/.env
   ```

2. If it doesn't exist, create it:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. Edit the file and add your Gmail credentials:
   ```
   GMAIL_EMAIL=your_email@gmail.com
   GMAIL_PASSWORD=your_app_password
   ```

4. Stop the server (Ctrl+C) and restart:
   ```bash
   npm run dev
   ```

---

### ❌ "Failed to send email. Please try again later."

**Possible Solutions:**

**1. Gmail Password Incorrect** 
- If using 2FA: Use the 16-character App Password from https://myaccount.google.com/apppasswords
- If not using 2FA: Make sure you enabled "Less secure app access"

**2. Gmail Account Restrictions**
- Go to: https://myaccount.google.com/security
- Scroll down to "Less secure app access" and turn it ON
- OR use an App Password (Option 1 above)

**3. Check Server Logs**
- Look at the terminal where you started the backend server
- Look for error messages starting with `❌`

**4. Test Gmail Configuration**
- Run this command to test your SMTP connection:
  ```bash
  npm test
  ```
  (if a test script is available)

---

## File Structure

```
portfolio-React/newportfolio/
├── backend/
│   ├── server.js          (Main server file)
│   ├── .env              (Your credentials - KEEP PRIVATE)
│   ├── .env.example      (Template)
│   ├── .gitignore        (Prevents .env from being committed)
│   ├── package.json      (Dependencies)
│   ├── README.md         (Original docs)
│   └── SETUP.md          (This file)
├── src/
│   ├── components/
│   │   └── Contact.tsx   (Frontend form)
│   └── ...
└── ...
```

---

## Running Both Frontend and Backend Together

### Terminal 1: Frontend
```bash
cd portfolio-React/newportfolio
npm run dev
```

Runs on: `http://localhost:5173` (or `http://localhost:3000`)

### Terminal 2: Backend
```bash
cd portfolio-React/newportfolio/backend
npm run dev
```

Runs on: `http://localhost:5000`

---

## Production Deployment

When deploying:

1. **Use Environment Variables:**
   - Never commit `.env` file
   - Set environment variables on your hosting platform
   - Use strong, unique credentials

2. **Update CORS Origins:**
   - Edit `server.js` and add your production domain
   - Example: `'https://yourportfolio.com'`

3. **Use Secure Connection:**
   - Deploy backend on HTTPS
   - Keep Gmail App Password secure

---

## Need Help?

### Debug Mode
Check the server console/logs for detailed error messages.

### Common Logger Outputs:

✓ = Success
⚠ = Warning (but might still work)
❌ = Error (something is wrong)
📨 = Contact form submission
📅 = Email timestamp

### Still Having Issues?

1. Check all steps in "Complete Gmail Setup Instructions"
2. Verify `.env` file exists and has correct values
3. Look at server logs for error messages
4. Try restarting both frontend and backend servers
5. Clear browser cache and try again

