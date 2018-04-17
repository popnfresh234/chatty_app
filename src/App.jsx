import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {

  constructor(){
    super();
    this.state =
    {
        currentUser: {name: 'Bob'}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: []
      }
      //Bind functions
      this.handleMessage = this.handleMessage.bind(this);
    }

    handleMessage(event){
      if(event.key === 'Enter'){
        let userName = this.state.currentUser.name;
        let newMessage = {username: userName, content: event.target.value}
        event.target.value = '';
        this.socket.send(JSON.stringify(newMessage));
      }
    }

    componentDidMount() {
      this.socket = new WebSocket('ws://localhost:3001', 'protocolOne');
      this.socket.onmessage = (event) => {
        let message = JSON.parse(event.data);
        let oldMessages = this.state.messages;
        let newMessages = [...oldMessages, message];
        this.setState({messages: newMessages});
      }
    }

    render() {
      return (
        <div>
        <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages}/>
        <ChatBar currentUser={this.state.currentUser} handleMessage={() => this.handleMessage}/>
        </div>
        );
    }
  }
  export default App;
