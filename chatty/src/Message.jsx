import React, { Component } from 'react';
import { Segment, List, Image, Divider } from 'semantic-ui-react'

class Message extends Component {
  render() {
    const colorStyle = {
      color: this.props.message.color
    }

    const user = this.props.user;
    const content = this.props.message.content;
    //Check for image URLs, pull out strings before and after
    const matched = content.match(/(https?:\/\/.*\.(jpg|jpeg|png|gif))/i);
    let before = '';
    let after = '';
    if (matched) {
      before = content.substring(0, matched.index);
      after = content.substring(before.length + matched[0].length, content.length)
    }

    return (
      <List.Item>
        <Segment color={this.props.message.color} floated={user === 'currentUser' ? 'left' : 'right'}>
          {matched ?
            <div>
              <span className="message-username" style={{'color': this.props.message.color}}>{this.props.message.username}</span>
              {before && <span>{before}</span>}
              {<Divider/>}
              <Image src={matched[0]} fluid style={{'maxWidth': '60vw'}} />
              {after && <Divider/>}
              {after && <span>{after}</span>}
            </div>
            :
            <div>
              <span className="message-username" style={colorStyle}>{this.props.message.username}</span>
              <span className="message-content">{this.props.message.content}</span>
            </div>
          }
        </Segment>
      </List.Item>
    );
  }
}
export default Message;
