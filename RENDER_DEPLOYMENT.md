# 🚀 Complete Deployment Guide: Backend to Render

## Step-by-Step Backend Deployment

### 1. 🌐 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub account
- Verify your email

### 2. 🔗 Connect Repository
- Click "New +" → "Web Service"
- Click "Connect a repository"
- Select "Connect GitHub" if not already connected
- Choose your `MuscleUp` repository

### 3. ⚙️ Configure Service Settings
```
Service Name: muscleup-backend
Environment: Node
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: muscleup-react/backend
Build Command: npm install
Start Command: npm start
```

### 4. 🔐 Set Environment Variables
In Render dashboard, add these environment variables:

**Required Variables:**
```bash
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://mwoods30.github.io/MuscleUp
CORS_ENABLED=true
HELMET_ENABLED=true
```

**Security Variables (Generate Secure Values):**
```bash
JWT_SECRET=your-64-character-random-string-here
SESSION_SECRET=your-64-character-random-string-here
```

**Rate Limiting:**
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

**Database (for now, local):**
```bash
MONGODB_URI=mongodb://localhost:27017/muscleup
```

### 5. 🔑 Generate Secure Secrets
Run this command to generate secure secrets:
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 6. 🚀 Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- You'll get a URL like: `https://muscleup-backend-xyz.onrender.com`

## Frontend Integration (Already Configured! ✅)

### Your frontend is already set up to work with Render:

1. **Production Environment**: `.env.production` points to Render backend
2. **GitHub Actions**: Automatically uses correct API URL during build
3. **CORS Configuration**: Backend allows your GitHub Pages domain

### How It Works:
- **Development**: `REACT_APP_API_URL=http://localhost:3001`
- **Production**: `REACT_APP_API_URL=https://muscleup-backend.onrender.com`

## Update After Deployment

### Once your Render backend is live:
1. **Copy your actual Render URL** (e.g., `https://muscleup-backend-abc123.onrender.com`)
2. **Update these files** with the real URL:
   - `muscleup-react/.env.production`
   - `.github/workflows/deploy-simple.yml`

### Example Update:
```bash
# Replace this:
REACT_APP_API_URL=https://muscleup-backend.onrender.com

# With your actual URL:
REACT_APP_API_URL=https://muscleup-backend-abc123.onrender.com
```

## Testing Your Deployment

### 1. Test Backend Directly:
```bash
curl https://your-render-url.onrender.com/api/health
# Should return: {"status":"ok","message":"MuscleUp API is running"}
```

### 2. Test Frontend Integration:
- Your GitHub Pages app will automatically use the Render backend
- Try signing up/logging in through your deployed app
- Check browser developer tools for API calls

## Database Upgrade (Optional)

### For production, consider upgrading to MongoDB Atlas:
1. **Create MongoDB Atlas account**
2. **Create free cluster**
3. **Update MONGODB_URI** in Render environment variables
4. **Example**: `mongodb+srv://username:password@cluster.mongodb.net/muscleup`

## Your Deployment URLs:
- **Frontend**: https://mwoods30.github.io/MuscleUp/
- **Backend**: https://your-render-url.onrender.com
- **API Health Check**: https://your-render-url.onrender.com/api/health

## Free Tier Limitations:
- **Render Free**: Service spins down after 15 minutes of inactivity
- **First request after sleep**: May take 30-60 seconds to wake up
- **MongoDB**: Local instance won't work on Render (use Atlas free tier)

Your MuscleUp app is ready for production! 🎉
