#!/usr/bin/env node

// This is added retroactively in CH3/cluster
const cluster = require('cluster');

cluster.setupMaster({
  exec: 'producer-grpc.js'
});
cluster.fork();
cluster.fork();

cluster
  .on('disconnect', (worker) => {
    console.log('disconnect', worker.id);
  })
  .on('exit', (worker, code, signal) => {
    console.log('exit', worker.id, code, signal);
  })
  .on('listening', (worker, {address, port}) => {
    console.log('listening', worker.id, `${address}:${port}`);
  });
