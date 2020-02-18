import React from 'react';
// import Chatkit from '@pusher/chatkit'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/messageList'

import  { tokenUrl, instanceLocator } from './config'

class App extends React.Component {

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
        roomId: 'fe4ec7e3-5778-43f3-b164-7eac94aefb66',
        hooks: {
          onNewMessage: message => {
            console.log(currentUser.id, message.parts[0].payload.content, message.createdAt)
          }
        }
      });
    })
    .catch(error =>{
      console.error("error", error);
    })
  }

  render() {
    return (
      <div className="app">
        <MessageList />
      </div>
    )
  }
}

export default App;
