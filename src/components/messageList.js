import React from 'react'

class MessageList extends React.Component {
    render() {
        return (
            <div className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <div key={index} className="message">
                            <div className="message-username">{message.senderId}</div>
                            <div className="message-text">{message.parts[0].payload.content}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default MessageList