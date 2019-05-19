import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import GoogleAuthentication from './GoogleAuthentication';

class NavBar extends React.Component {
  navStyles = {
    borderBottom: '0',
    backgroundColor: '#352ADF',
    padding: '1rem'
  };

  render() {
    return (
      <div className="ui large fixed inverted secondary pointing menu" style={this.navStyles}>
        <div className="ui container">
          <Link
            to="/"
            className={'item ' + (this.props.currentView === '/' ? 'active' : '')}
          >
          Home
          </Link> 
          <Link
            to="/audit-history"
            className={'item ' + (this.props.currentView === '/audit-history' ? 'active' : '')}
          >
          Past Audits
          </Link>
          <Link 
            to="/contact"
            className={'item ' + (this.props.currentView === '/contact' ? 'active' : '')}
          >
          Contact
          </Link>
          <div className="right item" style={{ padding: '0.5rem' }}> 
            <GoogleAuthentication />
          </div>
        </div>
      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    isSignedIn: state.auth.isSignedIn,
    currentView: state.view.currentView
  }
};

export default connect(mapStateToProps)(NavBar);

