# Portfolio Backend - Email Notification System

This backend server handles contact form submissions and sends email notifications to your Gmail inbox.

## Setup Instructions

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Gmail

#### Option A: If you DON'T have 2FA enabled on your Gmail account:
1. Enable "Less secure app access" in your Google Account settings:
   - Go to https://myaccount.google.com/security
   - Find "Less secure app access" and enable it
   - Use your Gmail password directly in the `.env` file

#### Option B: If you HAVE 2FA enabled (Recommended):
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google will generate a 16-character App Password
4. Copy this password (without spaces)
5. Use this as your `GMAIL_PASSWORD` in the `.env` file

### Step 4: Create `.env` File
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Gmail credentials:
   ```
   GMAIL_EMAIL=your_email@gmail.com
   GMAIL_PASSWORD=your_16_char_app_password
   PORT=5000
   ```

### Step 5: Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## Testing the Connection

Check if the backend is running:
```bash
curl http://localhost:5000/api/health
```

You should see: `{"status":"Backend server is running"}`

## Frontend Integration

The Contact component in your React app will automatically send form submissions to:
```
POST http://localhost:5000/api/contact
```

The form expects:
- `name`: string
- `email`: string  
- `message`: string

## Troubleshooting

### "Failed to connect to server" Error
- Make sure the backend server is running (`npm run dev`)
- Verify the server is on port 5000
- Check that you're running from the `backend` directory

### "Failed to send email" Error
- Verify your Gmail credentials are correct in `.env`
- If using 2FA, use the App Password (not your regular Gmail password)
- Check GMAIL_EMAIL and GMAIL_PASSWORD values
- Ensure Gmail account allows "Less secure app access" OR you're using an App Password

### Email not received
- Check your Gmail spam/promotions folder
- Verify the reply-to email address matches the form submission email
- Check backend server logs for error messages

## How It Works

1. User submits the contact form on your portfolio
2. React component sends data to the backend API
3. Backend validates the form data
4. Nodemailer sends email notification to your Gmail
5. User receives success/error message

## Security Notes

- Never commit `.env` file to git
- Keep your Gmail credentials private
- Use App Passwords if 2FA is enabled (more secure)
- The backend validates all inputs before sending

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Google App Passwords](https://support.google.com/accounts/answer/185833)
- [Gmail Security Settings](https://myaccount.google.com/security)
