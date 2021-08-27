const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const comitions = require('./utils/comitions');

const app = express();
const server = http.createServer(app);
//Socket io requires de HTTP server as parameter.
const io = socketio(server, 
  {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

const port = process.env.PORT || 3002;
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

// socket parameter is {} with the client information
io.on('connection', (socket) => {
  socket.on('sendMessage', (customId) => {
    if(comitions[customId].count >= 100) {
      comitions[customId].count = 0;
      if(comitions[customId].heartsAmount < 3) {
        comitions[customId].heartsAmount++
      }
    }
    comitions[customId].count+=10;
    io.emit('sumCounter', comitions);
  });

  // Must be inside callback of connection
  //socket.on('disconnect', () => {});
});

server.listen(port, () => {
  console.log(`Server Runing on PORT ${port}`);
});

/**
 * socket.emit() : Sends message to single client
 * socket.on(): Receives all messages
 * io.emit(): Send message to all clients
 * socket.broadcast.emit() : Send message to all clients EXCEPT the one that just connected.
 */