# 🚀 One-Click Deploy to Render

## Super Simple Deployment (3 Minutes)

### Step 1: Click the Deploy Button

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/JimRome102/streaming-recommendations)

### Step 2: Sign in to Render
- If you don't have an account, sign up with GitHub (free)
- Authorize Render to access your repos

### Step 3: Render Will Auto-Configure
Render will automatically:
- ✅ Create a PostgreSQL database
- ✅ Deploy the backend API
- ✅ Set up environment variables
- ✅ Run database migrations

**Just click "Apply" when prompted!**

### Step 4: Wait for Build (2-3 minutes)
Watch the build logs. When you see:
```
╔═══════════════════════════════════════════════════════╗
║  Streaming Recommendations API                        ║
║  Environment: production                              ║
╚═══════════════════════════════════════════════════════╝
```

You're done! 🎉

### Step 5: Copy Your Backend URL
It will look like: `https://streaming-rec-api-xxxx.onrender.com`

### Step 6: Tell Me Your Backend URL
Paste the URL here so I can update the frontend to connect to it!

---

## Manual Deploy (If Button Doesn't Work)

If the deploy button doesn't work, follow the detailed instructions in `DEPLOYMENT.md`.

---

## What Gets Deployed

✅ **Backend API** - Node.js + Express
✅ **PostgreSQL Database** - Free 1GB
✅ **Auto-configured** - All environment variables set
✅ **Free tier** - No credit card required

## After Deployment

Once deployed, I'll:
1. Update the frontend to use your backend URL
2. Redeploy the frontend
3. Your app will be fully functional!

You'll be able to:
- ✅ Search for movies and TV shows
- ✅ Rate content
- ✅ Get personalized recommendations
- ✅ Filter by platform

---

## Troubleshooting

**Build fails?**
- Check the build logs for errors
- Most common: Prisma migration issues (usually auto-resolves on retry)

**Takes too long?**
- First deploy can take 3-5 minutes
- Be patient, Render's free tier can be slow

**Still having issues?**
- Check `DEPLOYMENT.md` for manual deployment steps
- The manual process gives you more control
