import React, { Component } from 'react';
import Message from './Message.jsx'
import Notification from './Notification.jsx'

class MessageList extends Component {
  
  
  render() {
    const notifications = this.props.notifications;
    const messages = this.props.messages;
    const combinedArray = notifications.concat(messages);
    const room = this.props.room;

    combinedArray.sort((a, b) => {
      if (a.id < b.id) return -1;
      if( a.id > b.id) return 1;
      return 0;
    })

    const filteredArray = combinedArray.filter( (message) => {
      return message.room === -1 || message.room === room;      
    });

    const sortedMessages = filteredArray.map((message) => {
      return message.type === 'incomingMessage' 
      ? <Message key={message.id} message={message} /> 
      : <Notification key={message.id} message={message} />;
    })

    return (
      <main className="messages">
        {sortedMessages}
      </main>
    );
  }
}

export default MessageList;


