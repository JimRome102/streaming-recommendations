# LinkedIn Post for StreamPick Project

## Version 1: Shorter Post (Recommended - LinkedIn Character Limit)

**I built a movie and TV show recommendation engine to see if I could do better than "because you watched X..."**

You know that feeling when you've scrolled through Netflix for 20 minutes and still can't find anything? I wanted to see if combining multiple data sources could surface better options.

**How it works:**
The algorithm scores every movie/show based on:
• 25% critic reviews (Rotten Tomatoes, Metacritic)
• 25% user ratings (IMDb, TMDb)
• 20% social trends (Reddit buzz)
• 30% your personal taste

The interesting part: Instead of asking users to pick genres upfront, the system looks at what you rated 4-5 stars, extracts the genres, and weights your recommendations accordingly. Two people rating different content get completely different results.

**Tech Stack:**
React + Node.js + PostgreSQL + Redis + external APIs (TMDb, Watchmode, OMDb, Reddit)

**What I learned:**
✅ Designing scoring algorithms that balance objective vs subjective data
✅ Building a personalization engine that extracts preferences from behavior
✅ Managing multiple API rate limits and caching strategies

**Biggest challenge:**
Preventing filter bubbles—limiting results per genre so you get diversity instead of just "here's 20 more dramas."

This is a learning project, not a real product. The streaming data is spotty, but the point was figuring out how recommendation systems actually work.

Try it: https://streampick-recommendations.vercel.app/

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

Try it: https://streampick-recommendations.vercel.app/

What data sources work best for recommendations?

#WebDevelopment #FullStack #React #NodeJS

---

## Tips for Posting:

1. **Best time to post:** Tuesday-Thursday, 8-10am or 12-1pm (your local timezone)
2. **Engagement strategy:** Respond to comments within the first 2 hours to boost visibility
3. **Visual:** Consider adding a screenshot of the app or the algorithm breakdown
4. **Ask questions:** The ending questions encourage comments and engagement
5. **Tags:** Don't overdo hashtags - 3-5 relevant ones are better than 10+
