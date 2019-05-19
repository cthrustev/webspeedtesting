import React, { Component } from 'react';
import { Button, Confirm } from 'semantic-ui-react';

class Confirmation extends Component {
  state = { 
    open: false,
    isHovered: false
  };

  handleHover() {
    this.setState({ isHovered: !this.state.isHovered })
  }

  open = () => {
    this.setState({ open: true })
  }
  close = () => {
    this.setState({ open: false })
  }
  onConfirm = () => {
    this.setState({ open: false })
    this.props.onConfirmClick();
  }

  render() {
    return (
      <div>
        <Button
          className={!this.props.trash ? (this.props.styling + (this.state.isHovered ? ' orange' : ' yellow')): this.props.styling}
          onClick={this.open}
          onMouseEnter={this.handleHover.bind(this)}
          onMouseLeave={this.handleHover.bind(this)}
        >
        {this.props.text}
        </Button>
        <Confirm open={this.state.open} onCancel={this.close} onConfirm={this.onConfirm} />
      </div>
    )
  }
}

export default Confirmation;