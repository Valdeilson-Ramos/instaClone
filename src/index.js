const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

const server = require("http").Server(app); //defeine o suporte ao protocolo http

const io = require("socket.io")(server); //configura acesso via websocket

mongoose.connect(
  "mongodb+srv://coloque aqui o seu path para o banco de dados",
  {
    useNewUrlParser: true
  }
);
app.use((req, res, next) => {
  //garante que a requisição seja executada e haja a sincronização
  req.io = io;

  next();
});

app.use(cors()); // permite o acesso a nossa api
app.use(
  //define o caminho onde será realocado as imagens
  "/files",
  express.static(path.resolve(__dirname, "..", "uploads", "resized"))
);
app.use(require("./routes"));
server.listen(3333);
