# LinkedIn Post for StreamPick Project

## Version 1: Full Post (Recommended)

**I built a movie recommendation engine to see if I could do better than "because you watched X..."**

Instead of just collaborative filtering, I wanted to combine multiple data sources and see what happens when you weight them differently.

**How it works:**
The algorithm scores every movie/show based on:
• 25% critic reviews (Rotten Tomatoes, Metacritic)
• 25% user ratings (IMDb, TMDb)
• 20% social trends (Reddit buzz)
• 30% your personal taste

The interesting part was the personalization. Instead of asking users to pick genres upfront, the system looks at what you actually rated 4-5 stars, extracts the genres from those, and weights your recommendations accordingly. Two people rating different movies get completely different results.

**Tech Stack:**
• Frontend: React + Vite, TailwindCSS, React Query
• Backend: Node.js/Express, PostgreSQL, Redis caching
• APIs: TMDb, Watchmode, OMDb, Reddit
• Deployed on Vercel + Render

**What I learned building this:**
✅ Designing scoring algorithms that balance objective vs subjective data
✅ Building a personalization engine that extracts preferences from behavior
✅ Caching strategies to handle multiple API rate limits
✅ Full-stack architecture from database design to deployment

**Challenges:**
The hardest part was preventing filter bubbles—limiting results per genre so you get diversity instead of just "here's 20 more dramas because you like dramas." Also, managing 4 different external APIs with different rate limits and response formats was... fun.

This is a learning project, not a real product. The streaming platform data is spotty and the recommendations aren't perfect, but the point was figuring out how this stuff actually works.

Try it: https://client-ruddy-five.vercel.app/

Question for people who work on recommendation systems: What data sources do you find most valuable? How do you balance personalization with discovery?

#WebDevelopment #FullStack #React #NodeJS #PostgreSQL

---

## Version 2: Concise Post

**Built a movie recommendation engine that weighs multiple data sources**

Combined 4 signals into one score:
• 25% critics (RT/Metacritic)
• 25% user ratings (IMDb/TMDb)
• 20% social trends (Reddit)
• 30% your taste (genre extraction from your actual ratings)

The personalization works by analyzing what you rated highly, extracting the genres, and weighting those in your results. Different users get different recommendations.

**Stack:** React + Node.js + PostgreSQL + Redis

Taught me scoring algorithm design, API integration with rate limits, caching strategies, and full-stack deployment.

Try it: https://client-ruddy-five.vercel.app/

What data sources work best for recommendations?

#WebDevelopment #FullStack #React #NodeJS

---

## Tips for Posting:

1. **Best time to post:** Tuesday-Thursday, 8-10am or 12-1pm (your local timezone)
2. **Engagement strategy:** Respond to comments within the first 2 hours to boost visibility
3. **Visual:** Consider adding a screenshot of the app or the algorithm breakdown
4. **Ask questions:** The ending questions encourage comments and engagement
5. **Tags:** Don't overdo hashtags - 3-5 relevant ones are better than 10+
