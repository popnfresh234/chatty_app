import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import { Grid} from 'semantic-ui-react';
import { Segment } from 'semantic-ui-react';

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
      this.props.setUser(event.target.value);
  }

  render() {
    return (
      <div className='chatbar'>
        <Segment color='blue' attached='bottom'>
          <Grid>
            <Grid.Column  color='blue' width={3}>
              <Input fluid placeholder="Your Name (Optional)" value={this.state.user} onChange={this.handleUser} onBlur={this.updateUsername}/>
            </Grid.Column>
            <Grid.Column  color='blue' width={13}>
              <Input fluid placeholder="Type a message and hit ENTER" onKeyDown={this.props.handleMessage( 'test')} />
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    );
  }
}
export default ChatBar;
