// server.js
const TYPE_POST_NOTIFICATION = 'postNotification';
const TYPE_INCOMING_NOTIFICATION = 'incomingNotification'
const TYPE_POST_MESSAGE = 'postMessage';
const TYPE_INCOMING_MESSAGE = 'incomingMessage';
const TYPE_POST_CONNECT = 'postConnect';
const TYPE_INCOMING_CONNECT = 'incomingConnect';
const TYPE_POST_DISCONNECT = 'postDisconnect';
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
const wss = new SocketServer({ server });

function getRandomColor(){
  const COLOR_ARRAY = ['Red', 'Lime', 'Yellow', "Blue"];
  return COLOR_ARRAY[Math.floor(Math.random()*COLOR_ARRAY.length)];
}

function sendBroacast(msg) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  });
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  ws.color = getRandomColor();
  let connectionMessage = {
    type: TYPE_INCOMING_CONNECT,
    content: "A user connected!",
    id: uuid(),
    userCount: wss.clients.size,
  }

  wss.clients.forEach((client) => {
      console.log(connectionMessage);
      client.send(JSON.stringify(connectionMessage));   
  });

  ws.on('message', function incoming(data) {
    let message = JSON.parse(data);
    message.id = uuid();
    message.color = ws.color;
    switch (message.type) {
      case TYPE_POST_NOTIFICATION:
        message.type = TYPE_INCOMING_NOTIFICATION;
        break;
      case TYPE_POST_MESSAGE:
        message.type = TYPE_INCOMING_MESSAGE;
        break;
    }
    sendBroacast(message);
  });

  ws.on('close', () => {
    let disconnectMessage = {
      type: TYPE_INCOMING_DISCONNECT,
      content: "A user disconnected!",
      id: uuid(),
      userCount: wss.clients.size
    }
    sendBroacast(disconnectMessage);
  });
});

