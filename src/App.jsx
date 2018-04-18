import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {


  constructor() {
    super();
    this.TYPE_POST_NOTIFICATION = 'postNotification';
    this.TYPE_INCOMING_NOTIFICATION = 'incomingNotification'
    this.TYPE_POST_MESSAGE = 'postMessage';
    this.TYPE_INCOMING_MESSAGE = 'incomingMessage';
    this.TYPE_POST_CONNECT = 'postConnect';
    this.TYPE_INCOMING_CONNECT = 'incomingConnect';
    this.TYPE_POST_DISCONNECT = 'postDisconnect';
    this.TYPE_INCOMING_DISCONNECT = 'incomingDisconnect';

    this.state =
      {
        currentUser: { name: 'Bob' }, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: [],
        notifications: [],
        userCount: 0
      }
    //Bind functions
    this.handleMessage = this.handleMessage.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setUser(username) {
    let oldUsername = this.state.currentUser.name;
    this.setState({ currentUser: { name: username } });
    let msgString = oldUsername + ' has changed their name to ' + username;
    let message = { type: this.TYPE_POST_NOTIFICATION, content: msgString };
    this.postNotification(message);
  }

  handleMessage(event) {
    if (event.key === 'Enter') {
      let userName = this.state.currentUser.name;
      let newMessage = { type: 'postMessage', username: userName, content: event.target.value }
      event.target.value = '';
      this.socket.send(JSON.stringify(newMessage));
    }
  }

  postNotification(message) {
    this.socket.send(JSON.stringify(message));
  }

  buildConnectionStatusMessage(connectionType){
    let message = {};
    message.type = connectionType;
    message.username = this.state.currentUser.name;
    return message;
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001', 'protocolOne');

    this.socket.onmessage = (event) => {
      let message = JSON.parse(event.data);
      switch (message.type) {
        case this.TYPE_INCOMING_MESSAGE: {
          let oldMessages = this.state.messages;
          let newMessages = [...oldMessages, message];
          this.setState({ messages: newMessages });
          break;
        }
        case this.TYPE_INCOMING_NOTIFICATION: {
          let oldNotificaitons = this.state.notifications;
          let newNotifications = [...oldNotificaitons, message];
          this.setState({ notifications: newNotifications });
          break;
        }

        case this.TYPE_INCOMING_CONNECT: {
          let oldNotificaitons = this.state.notifications;
          let newNotifications = [...oldNotificaitons, message];
          this.setState({ notifications: newNotifications, userCount: message.userCount });
          break;
        }
        case this.TYPE_INCOMING_DISCONNECT: {
          let oldNotificaitons = this.state.notifications;
          let newNotifications = [...oldNotificaitons, message];
          this.setState({ notifications: newNotifications, userCount: message.userCount});
          break;
        }
      }
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a><p className="navbar-usercount">{this.state.userCount} users online</p>
        </nav>
        <MessageList messages={this.state.messages} notifications={this.state.notifications} />
        <ChatBar currentUser={this.state.currentUser} handleMessage={() => this.handleMessage} setUser={this.setUser} />
      </div>
    );
  }
}
export default App;
