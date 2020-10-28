#!/usr/bin/env node

// npm install fastify@3.2 lru-cache@6.0 node-fetch@2.6
const fetch = require('node-fetch');
const server = require('fastify')();
const lru = new (require('lru-cache'))({
  max: 4096,
  length: (payload, key) => payload.length + key.length,
  maxAge: 10 * 60 * 1_000
});
const PORT = process.env.PORT || 3000;

server.get('/account/:account', async (req, reply) => {
  return getAccount(req.params.account);
});
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));

async function getAccount(account) {
  const cached = lru.get(account);
  if (cached) { console.log('cache hit'); return JSON.parse(cached); }
  console.log('cache miss');
  const result = await fetch(`https://api.github.com/users/${account}`);
  const body = await result.text();
  lru.set(account, body);
  return JSON.parse(body);
}
