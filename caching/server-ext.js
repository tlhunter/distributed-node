#!/usr/bin/env node

// npm install fastify@3.2 memjs@1.2 node-fetch@2.6
const fetch = require('node-fetch');
const server = require('fastify')();
const memcache = require('memjs')
  .Client.create('localhost:11211');
const PORT = process.env.PORT || 3000;

server.get('/account/:account', async (req, reply) => {
  return getAccount(req.params.account);
});
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));

async function getAccount(account) {
  const { value: cached } = await memcache.get(account);
  if (cached) { console.log('cache hit'); return JSON.parse(cached); }
  console.log('cache miss');
  const result = await fetch(`https://api.github.com/users/${account}`);
  const body = await result.text();
  await memcache.set(account, body, {});
  return JSON.parse(body);
}
