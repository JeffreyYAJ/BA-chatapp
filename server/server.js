const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});


const users = {};

io.on('connection', (socket) => {
  socket.on('join', (pseudo) => {
    users[socket.id] = pseudo;
    console.log(`[SERVEUR] ${pseudo} a rejoint le salon.`);
    io.emit('system_message', `[Entry] ${pseudo} a rejoint le salon.`);
  });

  socket.on('chat_message', (data) => {
    io.emit('chat_message', data);
  });

  socket.on('leave', () => {
    if (users[socket.id]) {
      io.emit('system_message', `[Exit] ${users[socket.id]} a quitté le salon.`);
      delete users[socket.id];
    }
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      io.emit('system_message', `[Exit] ${users[socket.id]} a quitté le salon (déconnexion).`);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
