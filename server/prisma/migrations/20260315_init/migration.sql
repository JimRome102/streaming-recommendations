-- CreateTable
CREATE TABLE "user_ratings" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "watched" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredGenres" INTEGER[],
    "preferredPlatforms" TEXT[],
    "minRating" DOUBLE PRECISION NOT NULL DEFAULT 6.0,
    "excludeGenres" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cached_content" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "posterPath" TEXT,
    "backdropPath" TEXT,
    "mediaType" TEXT NOT NULL,
    "genres" INTEGER[],
    "releaseDate" TEXT,
    "imdbRating" DOUBLE PRECISION,
    "tmdbRating" DOUBLE PRECISION,
    "rtScore" DOUBLE PRECISION,
    "socialScore" DOUBLE PRECISION,
    "streamingPlatforms" JSONB,
    "popularity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cached_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_history" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "recommendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recommendation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_trends" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "mentions" INTEGER NOT NULL DEFAULT 0,
    "sentimentScore" DOUBLE PRECISION,
    "trendingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_trends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_ratings_userId_idx" ON "user_ratings"("userId");

-- CreateIndex
CREATE INDEX "user_ratings_tmdbId_idx" ON "user_ratings"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "user_ratings_userId_tmdbId_key" ON "user_ratings"("userId", "tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cached_content_tmdbId_key" ON "cached_content"("tmdbId");

-- CreateIndex
CREATE INDEX "cached_content_mediaType_idx" ON "cached_content"("mediaType");

-- CreateIndex
CREATE INDEX "recommendation_history_userId_idx" ON "recommendation_history"("userId");

-- CreateIndex
CREATE INDEX "recommendation_history_tmdbId_idx" ON "recommendation_history"("tmdbId");

-- CreateIndex
CREATE INDEX "social_trends_tmdbId_idx" ON "social_trends"("tmdbId");

-- CreateIndex
CREATE INDEX "social_trends_trendingDate_idx" ON "social_trends"("trendingDate");
