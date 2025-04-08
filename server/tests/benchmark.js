const sequelize = require("../config/connection");
const { performance } = require("perf_hooks");
const { Post, User, Comment } = require("../models");
const redisService = require("../config/redis");

// Fetch from database
async function fetchFromDatabase() {
  const start = performance.now();
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          include: [{
            model: User,
            attributes: ['username']
          }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const posts = postData.map(post => post.get({ plain: true }));
    const end = performance.now();
    return { data: posts, duration: end - start };
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Error fetching from Database:', err);
    throw err;
  }
}

// Fetch from cache
async function fetchFromCache() {
  const start = performance.now();
  try {
    const data = await redisService.get('posts:all');
    const end = performance.now();
    if (!data) {
      return { data: null, duration: end - start, hit: false };
    }
    return { data, duration: end - start, hit: true };
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Error fetching from Redis:', err);
    throw err;
  }
}

async function runBenchmark(benchmarkNumber) {
  console.log(`\n=== Running Benchmark Set #${benchmarkNumber} ===\n`);

  // Clear homepage cache
  await redisService.clearHomePageCache();
  
  // 1. Test Database Query
  console.log('\x1b[33m%s\x1b[0m', "Testing Database Query...");
  const dbResults = [];
  for (let i = 0; i < 10; i++) {
    const result = await fetchFromDatabase();
    dbResults.push(result.duration);
    if (i === 0) {
      // Store first result in cache for next test
      await redisService.set('posts:all', result.data);
    }
  }

  // 2. Test Cache Hits
  console.log('\n\x1b[33m%s\x1b[0m', "Testing Cache Hits...");
  const cacheResults = [];
  for (let i = 0; i < 10; i++) {
    const result = await fetchFromCache();
    if (result.hit) {
      cacheResults.push(result.duration);
    }
  }

  const avgDbTime = dbResults.reduce((a, b) => a + b, 0) / dbResults.length;
  const avgCacheTime = cacheResults.reduce((a, b) => a + b, 0) / cacheResults.length;
  const improvement = ((avgDbTime - avgCacheTime) / avgDbTime) * 100;

  return { avgDbTime, avgCacheTime, improvement };
}

async function runMultipleBenchmarks() {
  const allDbTimes = [];
  const allCacheTimes = [];
  const allImprovements = [];

  // Run 20 benchmark sets
  for (let i = 0; i < 20; i++) {
    const results = await runBenchmark(i + 1);
    allDbTimes.push(results.avgDbTime);
    allCacheTimes.push(results.avgCacheTime);
    allImprovements.push(results.improvement);

    // Log progress
    console.log('\n\x1b[36m%s\x1b[0m', `Benchmark Set #${i + 1} Results:`);
    console.log(`  Average DB Time: ${results.avgDbTime.toFixed(2)}ms`);
    console.log(`  Average Cache Time: ${results.avgCacheTime.toFixed(2)}ms`);
    console.log(`  Performance Improvement: ${results.improvement.toFixed(2)}%`);
  }

  // Calculate overall averages
  const overallAvgDbTime = allDbTimes.reduce((a, b) => a + b, 0) / allDbTimes.length;
  const overallAvgCacheTime = allCacheTimes.reduce((a, b) => a + b, 0) / allCacheTimes.length;
  const overallImprovement = allImprovements.reduce((a, b) => a + b, 0) / allImprovements.length;

  // Calculate min/max times
  const dbMin = Math.min(...allDbTimes);
  const dbMax = Math.max(...allDbTimes);
  const cacheMin = Math.min(...allCacheTimes);
  const cacheMax = Math.max(...allCacheTimes);

  console.log("\n=== Overall Benchmark Results ===");
  console.log('\x1b[36m%s\x1b[0m', "Database Query Times:");
  console.log(`  Average: ${overallAvgDbTime.toFixed(2)}ms`);
  console.log(`  Min: ${dbMin.toFixed(2)}ms`);
  console.log(`  Max: ${dbMax.toFixed(2)}ms`);
  
  console.log('\n\x1b[36m%s\x1b[0m', "Redis Cache Times:");
  console.log(`  Average: ${overallAvgCacheTime.toFixed(2)}ms`);
  console.log(`  Min: ${cacheMin.toFixed(2)}ms`);
  console.log(`  Max: ${cacheMax.toFixed(2)}ms`);
  
  console.log('\n\x1b[32m%s\x1b[0m', `Overall Performance Improvement: ${overallImprovement.toFixed(2)}%`);
  console.log('\x1b[32m%s\x1b[0m', `Cache is ${Math.abs(overallAvgDbTime - overallAvgCacheTime).toFixed(2)}ms ${overallAvgDbTime > overallAvgCacheTime ? 'faster' : 'slower'} than database`);
}

// Start the benchmark
async function start() {
  try {
    await sequelize.authenticate();
    console.log('\x1b[32m%s\x1b[0m', "Database connected");
    
    await runMultipleBenchmarks();

    // Cleanup
    await redisService.disconnect();
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', "Error:", err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log("\nGracefully shutting down...");
  await redisService.disconnect();
  await sequelize.close();
  process.exit(0);
});

start();