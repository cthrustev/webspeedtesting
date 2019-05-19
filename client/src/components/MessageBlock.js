import React from 'react';
import { Message } from 'semantic-ui-react';

class MessageBlock extends React.Component {
  state = { visible: true }

  handleDismiss = () => {
    this.setState({ visible: false })
  }

  render() {
    setTimeout(() => {
      this.setState({ visible: false })
    }, 4000)
    if(this.state.visible){
      return (
        <Message
          
          color={this.props.color}
          onDismiss={this.handleDismiss}
          header={this.props.header}
          content={this.props.content}
          style={this.props.style}
        />
      )
    } else {
      return null;
    }
  }
}

export default MessageBlock;
