// server/tests/benchmark.js
const express = require("express");
const sequelize = require("../config/connection"); // Sequelize connection
const { performance } = require("perf_hooks");
const redis = require("redis");
const { Post } = require("../models"); // Import the Post model

const app = express();
const PORT = 3000;

// Redis Connection
const redisClient = redis.createClient();
redisClient.connect()
  .then(() => console.log("Redis connected"))
  .catch(console.error);

// Function to reset Redis cache
async function resetRedisCache() {
  try {
    await redisClient.flushAll();
    console.log("Redis cache cleared");
  } catch (err) {
    console.error("Error resetting Redis cache:", err);
    throw err;
  }
}

// Ensure Sequelize is connected and models are synced
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync();
    console.log("Database synced");

    // Now that the DB is connected and synced, reset Redis cache
    await resetRedisCache();
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1); // Exit if database connection fails
  }
}

// Fetch all posts from MySQL (No Cache)
async function fetchFromDatabase() {
  const start = performance.now();
  console.log("Fetching data from Database...");
  try {
    const data = await Post.findAll();  // Fetch all posts
    const end = performance.now();
    return { data, duration: end - start };
  } catch (err) {
    console.error("Error fetching from Database:", err);
    throw err;  // Re-throw error
  }
}

// Fetch all posts from Redis (With Cache)
async function fetchFromCache() {
  const cacheKey = "all_posts";  // Updated cache key for all posts
  const start = performance.now();
  let data;
  try {
    data = await redisClient.get(cacheKey);
    if (!data) {
      console.log("Cache miss - Fetching data from Database...");
      data = await Post.findAll();  // Fetch all posts if not in cache
      await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });
    } else {
      console.log("Cache hit - Fetching data from Redis...");
      data = JSON.parse(data);
    }
  } catch (err) {
    console.error("Error fetching from Redis:", err);
    // Fallback to database if Redis fails
    console.log("Redis failure - Fetching data from Database...");
    data = await Post.findAll();
  }
  const end = performance.now();
  return { data, duration: end - start };
}

// Compare Performance
app.get("/compare-performance", async (req, res) => {
  try {
    const dbResult = await fetchFromDatabase();
    const cacheResult = await fetchFromCache();

    const improvement = ((dbResult.duration - cacheResult.duration) / dbResult.duration) * 100;

    res.json({
      dbTime: `${dbResult.duration.toFixed(2)}ms`,
      cacheTime: `${cacheResult.duration.toFixed(2)}ms`,
      improvement: `Redis is ${improvement.toFixed(2)}% faster`,
      dbVsCacheTimeDifference: `${(dbResult.duration - cacheResult.duration).toFixed(2)}ms`
    });
  } catch (error) {
    console.error("Error in compare-performance endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Automated Benchmark Test
async function runBenchmark() {
  console.log("\nStarting automated benchmark...\n");
  const dbTimes = [];
  const cacheTimes = [];

  for (let i = 0; i < 10; i++) {
    try {
      const dbRes = await fetchFromDatabase();
      const cacheRes = await fetchFromCache();

      dbTimes.push(dbRes.duration);
      cacheTimes.push(cacheRes.duration);

      console.log(`Benchmark #${i + 1}: DB Time: ${dbRes.duration.toFixed(2)}ms, Cache Time: ${cacheRes.duration.toFixed(2)}ms`);
    } catch (error) {
      console.error(`Error during benchmark #${i + 1}:`, error);
    }
  }

  const avgDbTime = dbTimes.reduce((a, b) => a + b, 0) / dbTimes.length;
  const avgCacheTime = cacheTimes.reduce((a, b) => a + b, 0) / cacheTimes.length;
  const improvement = ((avgDbTime - avgCacheTime) / avgDbTime) * 100;

  console.log("\n--- Benchmark Results ---");
  console.log(`Average DB Time: ${avgDbTime.toFixed(2)}ms`);
  console.log(`Average Redis Time: ${avgCacheTime.toFixed(2)}ms`);
  console.log(`Redis is ${improvement.toFixed(2)}% faster\n`);
  return { avgDbTime, avgCacheTime, improvement };
}

// Run multiple benchmark tests and calculate averages
async function runMultipleBenchmarks() {
  const allDbTimes = [];
  const allCacheTimes = [];
  const allImprovements = [];

  // Run 50 benchmarks and collect results
  for (let i = 0; i < 50; i++) {
    console.log(`Running benchmark #${i + 1}`);
    const { avgDbTime, avgCacheTime, improvement } = await runBenchmark();
    allDbTimes.push(avgDbTime);
    allCacheTimes.push(avgCacheTime);
    allImprovements.push(improvement);
  }

  const overallAvgDbTime = allDbTimes.reduce((a, b) => a + b, 0) / allDbTimes.length;
  const overallAvgCacheTime = allCacheTimes.reduce((a, b) => a + b, 0) / allCacheTimes.length;
  const overallImprovement = (allImprovements.reduce((a, b) => a + b, 0) / allImprovements.length);

  console.log("\n--- Overall Benchmark Results ---");
  console.log(`Overall Average DB Time: ${overallAvgDbTime.toFixed(2)}ms`);
  console.log(`Overall Average Redis Time: ${overallAvgCacheTime.toFixed(2)}ms`);
  console.log(`Overall Improvement: Redis is ${overallImprovement.toFixed(2)}% faster`);

  // Gracefully shut down the server
  console.log("Shutting down server...");
  await redisClient.quit();
  await sequelize.close();
  process.exit(0);
}

// Gracefully shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log("Gracefully shutting down...");
  await redisClient.quit();
  await sequelize.close();
  process.exit(0);
});

// Start Server after DB is initialized
initializeDatabase().then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Run multiple benchmarks and exit after completion
    setTimeout(async () => {
      await runMultipleBenchmarks();
    }, 1000);
  });
});