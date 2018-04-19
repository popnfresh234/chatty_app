import React, {
  Component
} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import { Menu } from 'semantic-ui-react'
import { Container } from 'semantic-ui-react'
const uuid = require('uuid/v1');

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
        name: 'Anonymous',
        userId: uuid(),
      }, 
      messages: [],
      notifications: [],
      userCount: 0,
      room: 0,
    }
    //Bind functions
    this.handleMessage = this.handleMessage.bind(this);
    this.setUser = this.setUser.bind(this);
    this.handleRoomClick = this.handleRoomClick.bind(this);
  }


  setUser(username) {
    let oldUsername = this.state.currentUser.name;
    let userId = this.state.currentUser.userId;
    this.setState({
      currentUser: {
        name: username,
        userId
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

  handleRoomClick(e, ref) {
    let room = Number.parseInt(ref.name);
    this.setState({room});
  }

  handleMessage(event) {
    if (event.key === 'Enter') {
      let username = this.state.currentUser.name;
      let userId = this.state.currentUser.userId;
      let newMessage = {
        type: 'postMessage',
        username,
        userId,
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
        <Menu color='blue' inverted size='massive'>

          <Menu.Item header>Chatty</Menu.Item>
          <Menu.Item name='0' active={this.state.room===0 } onClick={this.handleRoomClick}>
            Room 1
          </Menu.Item>

          <Menu.Item name='1' active={this.state.room===1 } onClick={this.handleRoomClick}>
            Room 2
          </Menu.Item>
          <Menu.Item header position='right'>{this.state.userCount} users online</Menu.Item>
        </Menu>
        <Container>
        <MessageList messages={this.state.messages} notifications={this.state.notifications} color={this.state.color} room={this.state.room} currentUserId={this.state.currentUser.userId}/>
        </Container>
        <ChatBar currentUser={this.state.currentUser} handleMessage={()=> this.handleMessage} setUser={this.setUser} />
      </div>
    );
  }
}
export default App;
