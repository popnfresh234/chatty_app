// server.js
const TYPE_POST_NOTIFICATION = 'postNotification';
const TYPE_INCOMING_NOTIFICATION = 'incomingNotification'
const TYPE_POST_MESSAGE = 'postMessage';
const TYPE_INCOMING_MESSAGE = 'incomingMessage';

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

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.


  ws.on('message', function incoming(data) {
    let message = JSON.parse(data);
    message.id = uuid();
    switch (message.type) {
      case TYPE_POST_NOTIFICATION:
        message.type = TYPE_INCOMING_NOTIFICATION;
        break;
      case TYPE_POST_MESSAGE:
        message.type = TYPE_INCOMING_MESSAGE;
        break;
    }
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(message));
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});

