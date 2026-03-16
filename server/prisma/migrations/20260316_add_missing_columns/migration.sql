-- Add missing columns to cached_content table
ALTER TABLE "cached_content" ADD COLUMN "tmdbVoteCount" INTEGER;
ALTER TABLE "cached_content" ADD COLUMN "imdbId" TEXT;
ALTER TABLE "cached_content" ADD COLUMN "runtime" INTEGER;

-- Add missing columns to social_trends table
ALTER TABLE "social_trends" ADD COLUMN "postUrl" TEXT;
ALTER TABLE "social_trends" ADD COLUMN "upvotes" INTEGER;

-- Update social_trends to make tmdbId nullable
ALTER TABLE "social_trends" ALTER COLUMN "tmdbId" DROP NOT NULL;
