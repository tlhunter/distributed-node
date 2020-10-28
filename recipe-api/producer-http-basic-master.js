#!/usr/bin/env node
const cluster = require('cluster');
console.log(`master pid=${process.pid}`);
cluster.setupMaster({
  exec: __dirname+'/producer-http-basic.js'
});
cluster.fork();
cluster.fork();

cluster
  .on('disconnect', (worker) => {
    console.log('disconnect', worker.id);
  })
  .on('exit', (worker, code, signal) => {
    console.log('exit', worker.id, code, signal);
    // cluster.fork();
  })
  .on('listening', (worker, {address, port}) => {
    console.log('listening', worker.id, `${address}:${port}`);
  });
