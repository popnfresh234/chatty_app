import React, { Component } from 'react';

class ChatBar extends Component {

  constructor(props) {
    super(props);
    this.state = { user: props.currentUser.name }    
    this.handleUser = this.handleUser.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
  }

  handleUser(event) {
    this.setState({ user: event.target.value });    
  }

  updateUsername(event){
    if(event.key === 'Enter'){
      this.props.setUser(event.target.value);
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" value={this.state.user} onChange={this.handleUser} onKeyDown={this.updateUsername} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={this.props.handleMessage('test')} />
      </footer>
    );
  }
}
export default ChatBar;
