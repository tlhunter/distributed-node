#!/usr/bin/env node

// npm install @grpc/grpc-js@1.1 @grpc/proto-loader@0.5
const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
const pkg_def = loader.loadSync(__dirname +
  '/../shared/grpc-recipe.proto');
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const server = new grpc.Server();
server.addService(recipe.RecipeService.service, {
  getMetaData: (_call, cb) => {
    cb(null, {
      pid: process.pid,
    });
  },
  getRecipe: (call, cb) => {
    if (call.request.id !== 42) {
      return cb(new Error(`unknown recipe ${call.request.id}`));
    }
    cb(null, {
      id: 42, name: "Chicken Tikka Masala",
      steps: "Throw it in a pot...",
      ingredients: [
        { id: 1, name: "Chicken", quantity: "1 lb", },
        { id: 2, name: "Sauce", quantity: "2 cups", }
      ]
    });
  },
});

server.bindAsync(`${HOST}:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    server.start();
    console.log(`Producer running at http://${HOST}:${port}/`);
  });
