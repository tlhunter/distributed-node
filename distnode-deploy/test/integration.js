#!/usr/bin/env node

// npm install --save-dev tape@5 node-fetch@2.6
const { spawn } = require('child_process');
const test = require('tape');
const fetch = require('node-fetch');

const serverStart = () => new Promise((resolve, _reject) => {
  const server = spawn('node', ['../server.js'],
    { env: Object.assign({}, process.env, { PORT: 0 }),
      cwd: __dirname });
  server.stdout.once('data', async (data) => {
    const message = data.toString().trim();
    const url = /Server running at (.+)$/.exec(message)[1];
    resolve({ server, url });
  });
});

test('GET /recipes/42', async (t) => {
  const { server, url } = await serverStart();
  const result = await fetch(`${url}/recipes/42`);
  const body = await result.json();
  t.equal(body.id, 42);
  server.kill();
});

test('GET /', async (t) => {
  const { server, url } = await serverStart();
  const result = await fetch(`${url}/`);
  const body = await result.text();
  t.equal(body, 'Hello from Distributed Node.js!');
  server.kill();
});
