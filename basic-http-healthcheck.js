#!/usr/bin/env node

// npm install fastify@3.2 ioredis@4.17 pg@8.3
const server = require('fastify')();
const HOST = '0.0.0.0';
const PORT = 3300;
const redis = new (require("ioredis"))({enableOfflineQueue: false});
const pg = new (require('pg').Client)();
pg.connect(); // Note: Postgres will not reconnect on failure

server.get('/health', async (req, reply) => {
  try {
    const res = await pg.query('SELECT $1::text as status', ['ACK']);
    if (res.rows[0].status !== 'ACK') reply.code(500).send('DOWN');
  } catch(e) {
    reply.code(500).send('DOWN');
  }
  // ... other down checks ...
  let status = 'OK';
  try {
    if (await redis.ping() !== 'PONG') status = 'DEGRADED';
  } catch(e) {
    status = 'DEGRADED';
  }
  // ... other degraded checks ...
  reply.code(200).send(status);
});

server.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}/`));
