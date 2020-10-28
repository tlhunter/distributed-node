#!/usr/bin/env node
// npm install ioredis@4.17
const Redis = require('ioredis');
const redis = new Redis('localhost:6379');

(async () => {
  const [res_srem, res_hdel] = await redis.multi()
    .srem("employees", "42") // Remove from Set
    .hdel("employee-42", "company-id") // Delete from Hash
    .exec();
  console.log('srem?', !!res_srem[1], 'hdel?', !!res_hdel[1]);
  redis.quit();
})();
