import React, {Component} from 'react';
import { Segment } from 'semantic-ui-react';
import { List } from 'semantic-ui-react'

class Message extends Component {
  render() {
    const colorStyle = {
      color: this.props.message.color
    }

    const user = this.props.user;
    
    return (
      <List.Item>
        <Segment color={this.props.message.color} floated={user === 'currentUser'? 'left' : 'right'}>
          <span className="message-username" style={colorStyle}>{this.props.message.username}</span>
          <span className="message-content">{this.props.message.content}</span>
        </Segment>
        </List.Item>
    );
  }
}
export default Message;
