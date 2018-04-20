// server.js
const TYPE_POST_NOTIFICATION = 'postNotification';
const TYPE_INCOMING_NOTIFICATION = 'incomingNotification'
const TYPE_POST_MESSAGE = 'postMessage';
const TYPE_INCOMING_MESSAGE = 'incomingMessage';
const TYPE_INCOMING_CONNECT = 'incomingConnect';
const TYPE_INCOMING_DISCONNECT = 'incomingDisconnect';


const express = require('express');
const uuid = require('uuid/v1');
const SocketServer = require('ws').Server;



// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({
  server
});

const getRandomColor = () => {
  const COLOR_ARRAY = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'violet', 'purple', 'pink'];
  return COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)];
}

const broadcast = (msg) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  });
}

const buildMessage = (content) => {
  let message = {
    id: uuid(),
    content,
  }
  return message
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (socket) => {
  socket.color = getRandomColor();
  let connectionMessage = buildMessage("A user connected!")
  connectionMessage.type = TYPE_INCOMING_CONNECT;
  connectionMessage.userCount = wss.clients.size;
  connectionMessage.room = -1;

  broadcast(connectionMessage);

  socket.on('message', function incoming(data) {
    //Get incoming mesage, build outgoing message
    let incomingMessage = JSON.parse(data);
    let outgoingMessage = buildMessage(incomingMessage.content);

    outgoingMessage.room = incomingMessage.room;

    //Set message type for client
    switch (incomingMessage.type) {
      case TYPE_POST_NOTIFICATION:
        outgoingMessage.type = TYPE_INCOMING_NOTIFICATION;
        break;
      case TYPE_POST_MESSAGE:
        outgoingMessage.username = incomingMessage.username;
        outgoingMessage.userId = incomingMessage.userId
        outgoingMessage.color = socket.color;
        outgoingMessage.type = TYPE_INCOMING_MESSAGE;
        break;
    }
    console.log(outgoingMessage);
    broadcast(outgoingMessage);
  });

  socket.on('close', () => {
    let disconnectMessage = buildMessage('A user disconnected!');
    disconnectMessage.type = TYPE_INCOMING_DISCONNECT
    disconnectMessage.userCount = wss.clients.size;
    disconnectMessage.room = -1;
    broadcast(disconnectMessage);
  });
});