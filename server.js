const jsonServer = require("json-server");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(cookieParser());
server.use(middlewares);

// Middleware para gerenciar cookies e arquivos
server.use((req, res, next) => {
  let userId = req.cookies.userId;

  // Se o cliente não tiver um userId, gera um novo
  if (!userId) {
    userId = Math.random().toString(36).substring(2); // Gera um ID único
    res.cookie("userId", userId, { httpOnly: true }); // Salva no cookie
  }

  const dbFile = `db-${userId}.json`;

  // Verifica se o arquivo existe, senão cria um arquivo vazio
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({}), "utf-8");
  }

  req.dbFile = dbFile;
  next();
});

// Middleware para carregar o arquivo correto
server.use((req, res, next) => {
  const router = jsonServer.router(req.dbFile); // Carrega o arquivo correspondente
  router(req, res, next);
});

server.listen(3000, () => {
  console.log("JSON Server is running");
});
