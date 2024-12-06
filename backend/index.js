const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Asegúrate de que esta URL coincida con tu cliente
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Unirse a una sala
  socket.on("join_room", (room) => {
    socket.join(room);  // Unirse a la sala
    console.log(`Usuario con id: ${socket.id} se unió a la sala: ${room}`);
  });

  // Recibir mensaje y reenviarlo a la sala
  socket.on("send_message", (data) => {
    console.log(`Mensaje de ${data.author}: ${data.message}`);
    socket.to(data.room).emit("receive_message", data);  // Emitir el mensaje a la sala
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log("Usuario desconectado", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server is running http://localhost:3001/");
});
