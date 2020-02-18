import React from 'react';
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/messageList'
import SendMessageForm from './components/sendMessageForm'
import RoomList from './components/roomList'
// import NewRoomForm from './components/NewRoomForm'

import  { tokenUrl, instanceLocator } from './config'


class App extends React.Component {

  constructor() {
    super()
    this.state = {
      messages: [],
      joinableRooms: [],
      joinedRooms: [],
    }
    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount(){
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: 'LemonICT',
      tokenProvider: new Chatkit.TokenProvider({
      url: tokenUrl
    })
    })

    chatManager.connect()
    .then(currentUser => {
      this.currentUser = currentUser

      this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        })
      })
      .catch(err => console.log('error on joinableRooms: ', err))

      this.currentUser.subscribeToRoomMultipart({
        roomId: currentUser.rooms[0].id,
        hooks: {
          onMessage: message => 
          {
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

  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: this.currentUser.rooms[0].id
    })
  }

  render() {
    return (
      <div className="app">
        <RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
        <MessageList messages={this.state.messages}/>
        <SendMessageForm sendMessage={this.sendMessage}/>
      </div>
    )
  }
}

export default App;
