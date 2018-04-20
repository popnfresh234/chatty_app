Chatty App
=====================

This project consits of a simple [Express](https://www.npmjs.com/package/express) and [WebSocket](https://www.npmjs.com/package/websocket) based chat server and a client that makes use of [React](https://reactjs.org/).


### Usage

1.  Clone this repository to a directory on your machine

2.  In the `chatty_server` subdirectory run

```
npm install
npm run local
```

3.  In the `chatty` subdirectory run
```
npm install
npm start
```

4.  Visit `localhost:3000` in your web browser.

5.  Enter messages to send to all connected clients.  If an image URL is entered as a message in the form `http://<path_to_image>.[jpg][jpeg][png][gif]` the image will be displayed to all clients.


### Dependencies Client

- babel-core
- babel-loader
- babel-preset-es2015
- babel-preset-react
- babel-preset-stage-0
- css-loader
- eslint
- eslint-plugin-react
- node-sass
- sass-loader
- sockjs-client
- style-loader
- webpack
- webpack-dev-serverreact
- react-dom
- semantic-ui-react1
- uuid

### Dependencies Server

- express
- uuid
- ws

### Screenshots:

!["Screen 1"](https://github.com/popnfresh234/chatty_app/blob/master/docs/screen1.png)
!["Screen 2"](https://github.com/popnfresh234/chatty_app/blob/master/docs/screen2.png)