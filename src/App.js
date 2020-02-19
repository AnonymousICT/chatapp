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
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: [],
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.subscribeToRoom = this.subscribeToRoom.bind(this)
    this.getRooms = this.getRooms.bind(this)
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
      this.getRooms()
    })
    .catch(error =>{
      console.error("error", error);
    })
  }

  getRooms(){
    this.currentUser.getJoinableRooms()
    .then(joinableRooms => {
      this.setState({
        joinableRooms,
        joinedRooms: this.currentUser.rooms
      })
    })
    .catch(err => console.log('error on joinableRooms: ', err))
  }


  subscribeToRoom(roomId) {
    this.setState({ messages: [] })
    this.currentUser.subscribeToRoomMultipart({
      roomId,
      hooks: {
        onMessage: message => 
        {
          this.setState({
            messages: [...this.state.messages, message]
          })
        }
      }
    })
    .then(room => {
      this.setState({
        roomId: room.id
      })
      this.getRooms()
    })
    .catch(err => console.log('error on subscribing to room: ' , err))
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    })
  }

  render() {
    return (
      <div className="app">
        <RoomList 
          subscribeToRoom={this.subscribeToRoom}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
        <MessageList messages={this.state.messages}/>
        <SendMessageForm sendMessage={this.sendMessage}/>
      </div>
    )
  }
}

export default App;
