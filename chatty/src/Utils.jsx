class Utils {


    constructor(context) {
        this.TYPE_POST_NOTIFICATION = 'postNotification';  
        this.TYPE_POST_MESSAGE = 'postMessage';
        this.TYPE_INCOMING_DISCONNECT = 'incomingDisconnect';
        this.TYPE_INCOMING_CONNECT = 'incomingConnect';
        this.TYPE_INCOMING_MESSAGE = 'incomingMessage';
        this.TYPE_INCOMING_NOTIFICATION = 'incomingNotification'
        //Bind functions
        this.context = context;
        this.handleMessage = this.handleMessage.bind(this);
        this.setUser = this.setUser.bind(this);
        this.handleRoomClick = this.handleRoomClick.bind(this);
    }

    setUser(username) {
        let oldUsername = this.context.state.currentUser.name;
        let userId = this.context.state.currentUser.userId;
        this.context.setState({
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
        this.context.setState({ room });
    }

    handleMessage(event) {
        if (event.key === 'Enter') {
            let username = this.context.state.currentUser.name;
            let userId = this.context.state.currentUser.userId;
            let newMessage = {
                type: this.TYPE_POST_MESSAGE,
                username,
                userId,
                content: event.target.value,
                room: this.context.state.room,
            }
            event.target.value = '';
            this.context.socket.send(JSON.stringify(newMessage));
        }
    }

    postNotification(message) {
        this.context.socket.send(JSON.stringify(message));
    }

    concatNewMessages(message) {
        return this.context.state.messages.concat(message);
    }

    concatNewNotification(notification) {
        return this.context.state.notifications.concat(notification);
    }

}

module.exports = Utils;