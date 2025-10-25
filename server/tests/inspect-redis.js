const { createClient } = require('redis');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const getRedisUrl = () => {
  if (process.env.REDIS_URL && process.env.REDIS_PASSWORD) {
    const [host, port] = process.env.REDIS_URL.split(':');
    return `redis://:${process.env.REDIS_PASSWORD}@${host}:${port}`;
  }
  return process.env.REDIS_URL || 'redis://localhost:6379';
};

async function inspectRedis() {
  const client = createClient({ url: getRedisUrl() });

  try {
    await client.connect();
    console.log('Connected to Redis\n');
    
    // Get all key patterns
    const patterns = [
      'rl:*',
      'sess:*',
      'badbot:*',
      'bot_attempts:*',
      'post:*',
      'user:*',
      'posts:*',
      'comments:*'
    ];
    
    console.log('Redis Key Summary:\n');
    console.log('='.repeat(50));
    
    for (const pattern of patterns) {
      const keys = await client.keys(pattern);
      console.log(`${pattern.padEnd(20)} : ${keys.length} keys`);
      
      // Show sample keys and their TTL
      if (keys.length > 0 && keys.length <= 3) {
        for (const key of keys) {
          const ttl = await client.ttl(key);
          const ttlStr = ttl === -1 ? 'no expiry' : `${ttl}s`;
          console.log(`  └─ ${key} (TTL: ${ttlStr})`);
        }
      }
    }
    
    console.log('='.repeat(50));
    
    // Get total count
    const allKeys = await client.keys('*');
    console.log(`\nTotal keys in Redis: ${allKeys.length}\n`);
    
    await client.quit();
    
  } catch (error) {
    console.error('Error:', error.message);
    if (client.isOpen) {
      await client.quit();
    }
    process.exit(1);
  }
}

inspectRedis();