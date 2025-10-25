const { createClient } = require('redis');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const getRedisUrl = () => {
  if (process.env.REDIS_URL && process.env.REDIS_PASSWORD) {
    const [host, port] = process.env.REDIS_URL.split(':');
    return `redis://:${process.env.REDIS_PASSWORD}@${host}:${port}`;
  }
  return process.env.REDIS_URL || 'redis://localhost:6379';
};

async function resetRateLimits() {
  const client = createClient({ url: getRedisUrl() });

  try {
    await client.connect();
    console.log('Connected to Redis\n');
    
    // Find all keys
    console.log('Searching for keys...\n');
    const rlKeys = await client.keys('rl:*');
    const botKeys = await client.keys('badbot:*');
    const attemptKeys = await client.keys('bot_attempts:*');
    
    console.log(`Found ${rlKeys.length} rate limit keys`);
    console.log(`Found ${botKeys.length} ban keys`);
    console.log(`Found ${attemptKeys.length} attempt keys\n`);
    
    // Show sample keys
    if (rlKeys.length > 0) {
      console.log('Sample rate limit keys:');
      rlKeys.slice(0, 5).forEach(key => console.log(`  - ${key}`));
      if (rlKeys.length > 5) console.log(`  ... and ${rlKeys.length - 5} more`);
      console.log();
    }
    
    // Delete all keys
    const allKeys = [...rlKeys, ...botKeys, ...attemptKeys];
    
    if (allKeys.length === 0) {
      console.log('No keys to clear. All clean!');
      await client.quit();
      return;
    }
    
    console.log(`Deleting ${allKeys.length} keys...`);
    
    // Delete in batches to avoid overwhelming Redis
    const batchSize = 100;
    let deleted = 0;
    
    for (let i = 0; i < allKeys.length; i += batchSize) {
      const batch = allKeys.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(key => client.del(key)));
      deleted += results.reduce((sum, result) => sum + result, 0);
    }
    
    console.log(`Deleted ${deleted} keys\n`);
    
    // Verify deletion
    console.log('Verifying deletion...');
    const remainingRL = await client.keys('rl:*');
    const remainingBot = await client.keys('badbot:*');
    const remainingAttempt = await client.keys('bot_attempts:*');
    
    const totalRemaining = remainingRL.length + remainingBot.length + remainingAttempt.length;
    
    if (totalRemaining === 0) {
      console.log('All keys successfully deleted!\n');
    } else {
      console.log(`${totalRemaining} keys still remain:`);
      console.log(`   - rl:* = ${remainingRL.length}`);
      console.log(`   - badbot:* = ${remainingBot.length}`);
      console.log(`   - bot_attempts:* = ${remainingAttempt.length}\n`);
    }
    
    await client.quit();
    console.log('Done!');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (client.isOpen) {
      await client.quit();
    }
    process.exit(1);
  }
}

resetRateLimits();