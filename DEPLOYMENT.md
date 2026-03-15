# Deployment Guide

This guide covers deploying StreamPick to production for your MVP/POC demo.

## Recommended Architecture

**Frontend:** Vercel (Free tier)
**Backend + Database:** Render (Free tier includes PostgreSQL, Redis available as add-on)

## Option 1: Quick Deploy (Frontend Only - Demo Mode)

Deploy just the frontend with mock data for a quick demo:

### Deploy to Vercel

```bash
cd client
vercel --prod
```

Follow the prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? streaming-recommendations
- Directory? `./` (current directory)
- Override settings? No

Your frontend will be live at: `https://streaming-recommendations-xxx.vercel.app`

**Note:** Without the backend deployed, the app won't have live data. You'll need to deploy the backend (Option 2) for full functionality.

## Option 2: Full Stack Deploy (Recommended)

### Part A: Deploy Backend to Render

1. **Sign up at [Render.com](https://render.com)**

2. **Create PostgreSQL Database:**
   - Dashboard → New → PostgreSQL
   - Name: `streaming-rec-db`
   - Database: `streaming_rec`
   - User: auto-generated
   - Region: Choose closest to your users
   - Instance Type: Free
   - Click "Create Database"
   - Copy the "Internal Database URL" (starts with `postgresql://`)

3. **Create Redis Instance:**
   - Dashboard → New → Redis
   - Name: `streaming-rec-redis`
   - Region: Same as database
   - Plan: Free (only available via add-on after creating web service)
   - **Note:** Render's free tier Redis is limited. Alternative: Use [Upstash](https://upstash.com) (generous free tier)

4. **Deploy Backend Web Service:**
   - Dashboard → New → Web Service
   - Connect your GitHub repository: `JimRome102/streaming-recommendations`
   - Name: `streaming-rec-api`
   - Region: Same as database
   - Branch: `main`
   - Root Directory: `server`
   - Runtime: Node
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
   - Instance Type: Free

5. **Set Environment Variables:**
   In the Render dashboard for your web service, add these environment variables:

   ```
   DATABASE_URL=<your-render-postgresql-internal-url>
   REDIS_URL=<your-redis-url>
   TMDB_API_KEY=38ccb9e77d957b35f0a8ad173f0810ba
   WATCHMODE_API_KEY=k1OAUtsk1OSry3YiYwf64P7mz3jVki5CIErB9RfE
   OMDB_API_KEY=<your-omdb-key>
   REDDIT_CLIENT_ID=<your-reddit-client-id>
   REDDIT_CLIENT_SECRET=<your-reddit-secret>
   REDDIT_USER_AGENT=streaming-rec-bot/1.0
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://streaming-recommendations.vercel.app
   ```

6. **Deploy:** Click "Create Web Service" - Render will automatically deploy

7. **Copy your backend URL:** It will be something like `https://streaming-rec-api.onrender.com`

### Part B: Deploy Frontend to Vercel

1. **Update Frontend API URL:**

   Create `client/.env.production`:
   ```env
   VITE_API_URL=https://streaming-rec-api.onrender.com
   ```

2. **Commit and push:**
   ```bash
   git add client/.env.production
   git commit -m "Add production API URL"
   git push
   ```

3. **Deploy to Vercel:**
   ```bash
   cd client
   vercel --prod
   ```

   Or connect GitHub to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import Project → GitHub → streaming-recommendations
   - Root Directory: `client`
   - Framework Preset: Vite
   - Environment Variables: Add `VITE_API_URL` (your Render backend URL)
   - Deploy

4. **Your app is live!** 🎉
   - Frontend: `https://streaming-recommendations.vercel.app`
   - Backend: `https://streaming-rec-api.onrender.com`

## Option 3: Alternative - Railway

Railway offers a simpler setup with PostgreSQL + Redis + Web Service in one platform.

1. **Sign up at [Railway.app](https://railway.app)**

2. **Deploy from GitHub:**
   - New Project → Deploy from GitHub
   - Select `streaming-recommendations`
   - Railway will detect monorepo structure

3. **Add Services:**
   - Add PostgreSQL database
   - Add Redis database
   - Configure backend service to use `server` directory

4. **Set Environment Variables:** (similar to Render setup above)

5. **Deploy Frontend to Vercel** (same as Option 2, Part B)

## Option 4: Full Self-Hosted (DigitalOcean, AWS, etc.)

For a completely self-hosted solution:

1. Spin up a VPS (Ubuntu 22.04 recommended)
2. Install Node.js, PostgreSQL, Redis, Nginx
3. Clone repository and set up services
4. Configure Nginx as reverse proxy
5. Set up SSL with Let's Encrypt
6. Use PM2 to keep backend running

This is more complex but gives you full control. See `SELF_HOSTING.md` for detailed steps.

## Free Tier Limitations

### Render Free Tier:
- 750 hours/month (enough for one service 24/7)
- Spins down after 15 minutes of inactivity
- Takes ~30 seconds to wake up on first request
- 512 MB RAM
- PostgreSQL: 1 GB storage (90 days data retention)

### Vercel Free Tier:
- 100 GB bandwidth/month
- No limits on number of deployments
- Automatic HTTPS
- Global CDN

### Upstash (Redis alternative):
- 10,000 commands/day
- 256 MB storage
- Better than Render's free Redis offering

## Post-Deployment Checklist

- [ ] Test user registration/rating flow
- [ ] Verify recommendations are loading
- [ ] Check streaming platform filtering
- [ ] Test on mobile devices
- [ ] Verify API rate limits aren't being exceeded
- [ ] Set up error monitoring (Optional: Sentry)
- [ ] Add Google Analytics (Optional)

## Monitoring Your MVP

Free monitoring tools:
- **Uptime:** [UptimeRobot](https://uptimerobot.com) - Free pings every 5 minutes
- **Errors:** [Sentry](https://sentry.io) - 5,000 errors/month free
- **Analytics:** [Google Analytics](https://analytics.google.com) or [Plausible](https://plausible.io)

## Custom Domain (Optional)

### Vercel:
1. Buy domain (Namecheap, Google Domains, etc.)
2. Vercel Dashboard → Project → Settings → Domains
3. Add your domain
4. Update DNS records as instructed

### Render:
1. Render Dashboard → Web Service → Settings → Custom Domains
2. Add your domain
3. Update DNS records

## Troubleshooting

### Backend won't start on Render:
- Check build logs for Prisma migration errors
- Ensure DATABASE_URL is set correctly
- Verify all environment variables are present

### Frontend can't connect to backend:
- Check CORS settings in backend (should allow your Vercel domain)
- Verify VITE_API_URL is set correctly
- Check browser console for errors

### Database connection errors:
- Render PostgreSQL: Use "Internal Database URL" not "External"
- Check if Prisma migrations ran during build
- Try manual migration: `npx prisma migrate deploy` in Render shell

### "Cold start" delays:
- Render free tier spins down after 15 min
- First request takes ~30s to wake up
- Upgrade to paid tier ($7/mo) for always-on
- Or use Railway (doesn't spin down as aggressively)

## Cost Estimation (If Scaling Beyond Free Tier)

**Hobby/MVP (100-1000 users):**
- Render Web Service: $7/mo
- Render PostgreSQL: $7/mo
- Upstash Redis: Free
- Vercel: Free
- **Total: ~$14/mo**

**Small Scale (1000-10000 users):**
- Render Web Service: $25/mo
- Render PostgreSQL: $20/mo
- Upstash Redis: $10/mo
- Vercel Pro: $20/mo
- **Total: ~$75/mo**

## Support

For deployment help:
- Render: [docs.render.com](https://docs.render.com)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)

---

**Quick Start Command (Deploy Everything Now):**

```bash
# 1. Create .env.production for client
echo "VITE_API_URL=https://streaming-rec-api.onrender.com" > client/.env.production

# 2. Commit changes
git add .
git commit -m "Add production config"
git push

# 3. Deploy backend to Render (manual via dashboard)
# Visit render.com and follow steps in "Option 2" above

# 4. Deploy frontend to Vercel
cd client
vercel --prod
```

Your MVP is now live! 🚀
