import React from 'react';
// import Chatkit from '@pusher/chatkit'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/messageList'

import  { tokenUrl, instanceLocator } from './config'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      messages: []
    }
  }

  componentDidMount(){
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: 'LemonICT',
      tokenProvider: new Chatkit.TokenProvider({
      url: tokenUrl
    })
    })

    chatManager.connect()
    .then(currentUser => {
      currentUser.subscribeToRoomMultipart({
        roomId: currentUser.rooms[0].id,
        hooks: {
          onMessage: message => 
          {
            console.log("Received message:", message.parts[0].payload.content, message.createdAt);
            this.setState({
              messages: [...this.state.messages, message]
            })
          }
        }
      });
    })
    .catch(error =>{
      console.error("error", error);
    })
  }

  render() {
    console.log('this.state.messages:', this.state.messages);
    return (
      <div className="app">
        <MessageList />
      </div>
    )
  }
}

export default App;
