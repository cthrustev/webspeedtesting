import './Loader.scss';
import React from 'react';

class Loader extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showLongerTime: false
    }
  }

  timeout = setTimeout(() => {
    this.setState({ showLongerTime: true })
    this.timeout = null;
  }, 30000);

  componentWillUnmount() {
    if(this.timeout) {
      clearTimeout(this.timeout)
    }
  }
  render() {
    return (
      <div>
        <div className="loader-ring"></div>
        {this.state.showLongerTime ? <h2 className="ui header">The loading is taking longer than usual. Please wait...</h2> : ''}
      </div>
    )
  }
};

export default Loader;

//Source of the loader animation
//https://loading.io/css/