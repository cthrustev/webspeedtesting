import React from 'react';
import { Link } from 'react-router-dom';

class Footer extends React.Component {
  render(){
    return (
      <div style={this.props.style}> 
        <div className="ui center aligned container">
          <div className="ui horizontal inverted small divided link list">
            <Link className="item" to="/">Home</Link>
            <Link className="item" to="/audit-history">Past Audits</Link>
            <Link className="item" to="/contact">Contact</Link>
            <Link className="item" to="/privacy-policy">Privacy Policy</Link>
          </div>
          <h5 className="ui header">
            <div className="sub header" style={{ color: 'rgba(230, 230, 230, 0.5)'}}><b>Email:</b> w1616792@my.westminster.ac.uk</div>
          </h5>
          <h5 className="ui header">
            <div className="sub header" style={{ color: 'rgba(230, 230, 230, 0.5)'}}>University of Westminster, 101 New Cavendish St, Fitzrovia, London W1W 6XH, UK</div>
          </h5>
          <h5 className="ui header">
            <div className="sub header" style={{ color: 'rgba(230, 230, 230, 0.5)'}}>Copyright {'\u00A9'} {(new Date().getFullYear())} Steven Siht W1616792</div>
          </h5>
        </div>
      </div>
    )
  }
};

export default Footer;