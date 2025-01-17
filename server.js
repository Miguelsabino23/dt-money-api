const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const serverless = require("serverless-http");

server.use(middlewares);
server.use(router);

module.exports = serverless(server);
