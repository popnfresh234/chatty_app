import React, { Component} from 'react';
import Utils from './Utils.jsx';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import { Menu } from 'semantic-ui-react'
import { Container } from 'semantic-ui-react'
const uuid = require('uuid/v1');
class App extends Component {

  constructor() {
    super();
    this.utils = new Utils(this);
    this.TYPE_INCOMING_DISCONNECT = 'incomingDisconnect';
    this.TYPE_INCOMING_CONNECT = 'incomingConnect';
    this.TYPE_INCOMING_MESSAGE = 'incomingMessage';
    this.TYPE_INCOMING_NOTIFICATION = 'incomingNotification'
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
  }



  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onmessage = (event) => {
      let message = JSON.parse(event.data);
      switch (message.type) {
        case this.TYPE_INCOMING_MESSAGE:
          {
            let newMessages = this.utils.concatNewMessages(message);
            this.setState({
              messages: newMessages
            });
            break;
          }
        case this.TYPE_INCOMING_NOTIFICATION:
          {
            let newNotifications = this.utils.concatNewNotification(message);
            this.setState({
              notifications: newNotifications
            });
            break;
          }

        case this.TYPE_INCOMING_CONNECT:
        case this.TYPE_INCOMING_DISCONNECT:
          {
            let newNotifications = this.utils.concatNewNotification(message);
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
          <Menu.Item name='0' active={this.state.room === 0} onClick={this.utils.handleRoomClick}>
            Room 1
          </Menu.Item>

          <Menu.Item name='1' active={this.state.room === 1} onClick={this.utils.handleRoomClick}>
            Room 2
          </Menu.Item>
          <Menu.Item header position='right'>{this.state.userCount} users online</Menu.Item>
        </Menu>
        <Container style={{ 'marginBottom': '7rem' }}>
          <MessageList messages={this.state.messages} notifications={this.state.notifications} color={this.state.color} room={this.state.room} currentUserId={this.state.currentUser.userId} />
          <div ref={(scrollDummy) => { this.endOfMessages = scrollDummy; }} />
        </Container>
        <ChatBar currentUser={this.state.currentUser} handleMessage={() => this.utils.handleMessage} setUser={this.utils.setUser} />
      </div>
    );
  }

  componentDidUpdate() {
    this.endOfMessages.scrollIntoView({ behavior: 'smooth' });
  }
}

export default App;
