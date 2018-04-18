import React, {Component} from 'react';

class Message extends Component {
  render() {
    const colorStyle = {
      color: this.props.message.color
    }
    return (
      <div className="message">
        <span className="message-username" style={colorStyle}>{this.props.message.username}</span>
        <span className="message-content">{this.props.message.content}</span>
      </div>
    );
  }
}
export default Message;
