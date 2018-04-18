import React, {
  Component
} from 'react';
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

    this.state = {
      currentUser: {
        name: 'Anonymous'
      }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      notifications: [],
      userCount: 0,
      room: 0,
    }
    //Bind functions
    this.handleMessage = this.handleMessage.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setUser(username) {
    let oldUsername = this.state.currentUser.name;
    this.setState({
      currentUser: {
        name: username
      }
    });
    let msgString = oldUsername + ' has changed their name to ' + username;
    let message = {
      type: this.TYPE_POST_NOTIFICATION,
      content: msgString,
      room: -1,
    };
    this.postNotification(message);
  }

  setRoom(event, room){
    event.preventDefault();
    this.setState({room})
  }

  handleMessage(event) {
    if (event.key === 'Enter') {
      let userName = this.state.currentUser.name;
      let newMessage = {
        type: 'postMessage',
        username: userName,
        content: event.target.value,
        room: this.state.room,
      }
      event.target.value = '';
      this.socket.send(JSON.stringify(newMessage));
    }
  }

  postNotification(message) {
    this.socket.send(JSON.stringify(message));
  }

  concatNewMessages(message) {
    return this.state.messages.concat(message);
  }

  concatNewNotification(notification) {
    return this.state.notifications.concat(notification);
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onmessage = (event) => {
      let message = JSON.parse(event.data);
      switch (message.type) {
        case this.TYPE_INCOMING_MESSAGE:
          {
            let newMessages = this.concatNewMessages(message);
            this.setState({
              messages: newMessages
            });
            break;
          }
        case this.TYPE_INCOMING_NOTIFICATION:
          {
            let newNotifications = this.concatNewNotification(message);
            this.setState({
              notifications: newNotifications
            });
            break;
          }

        case this.TYPE_INCOMING_CONNECT:
        case this.TYPE_INCOMING_DISCONNECT:
          {
            let newNotifications = this.concatNewNotification(message);
            this.setState({
              notifications: newNotifications,
              userCount: message.userCount
            });
            break;
          }
      }
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <ul>
            <li className={this.state.room === 0 ? 'selected' : ''}><a href="" onClick={(e) => {this.setRoom(e, 0)}}>Room 1</a></li>
            <li className={this.state.room === 1 ? 'selected' : ''}><a href="" onClick={(e) => {this.setRoom(e, 1)}}>Room 2</a></li>
          </ul>
          <p className="navbar-usercount">{this.state.userCount} users online</p>
        </nav>
        <MessageList messages={this.state.messages} notifications={this.state.notifications} color={this.state.color} room={this.state.room} />
        <ChatBar currentUser={this.state.currentUser} handleMessage={() => this.handleMessage} setUser={this.setUser} />
      </div>
    );
  }
}
export default App;
