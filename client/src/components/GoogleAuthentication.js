import React from 'react';
import { connect } from 'react-redux';

import { signIn, signOut, pastAudits, clearPast } from '../actions';
import Confirmation from './Confirmation';
import lighthouseapi from '../api/lighthouseapi';

//Client ID - 450289664170-obrc6itlhtqo7fratvg67duu9bd2vc0v.apps.googleusercontent.com
//Client Secret - NcStmMDA7FiF0poetIE3ICTp

class GoogleAuthentication extends React.Component {
  componentDidMount() {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: '450289664170-obrc6itlhtqo7fratvg67duu9bd2vc0v.apps.googleusercontent.com',
        scope: 'email profile'
      }).then(() => {
        this.auth = window.gapi.auth2.getAuthInstance();
        this.onAuthChange(this.auth.isSignedIn.get());
        this.auth.isSignedIn.listen(this.onAuthChange);
      });
    });
  };

  onAuthChange = isSignedIn => {
    if (isSignedIn){
      this.props.signIn(this.auth.currentUser.get().getId());
      getAudits(this.auth.currentUser.get().getId())
        .then(res => {
          this.props.pastAudits(res);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      this.props.signOut();
    }
  };
  onSignInClick = () => {
    this.auth.signIn();
  };
  onSignOutClick = () => {
    this.auth.signOut();
    this.props.clearPast();
  };

  renderButton() {
    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <Confirmation text="Sign Out" styling="ui small button" onConfirmClick={this.onSignOutClick} />
      );
    } else {
      return (
        <div>
          <button className="ui small inverted green button" onClick={this.onSignInClick}>
            Sign In
          </button>
        </div>
      );
    }
  };

  render() {
    return this.renderButton()
  };
};

const getAudits = async id => {
  let response = [];
  await lighthouseapi.post('/find', { id: id })
    .then(res => {
      response = res.data;
    })
    .catch(err => {
      response = err;
    })
    return response;
}

const mapStateToProps = state => {
  return { 
    isSignedIn: state.auth.isSignedIn,
    audit: state.audit
  };
};

export default connect(mapStateToProps, { signIn, signOut, pastAudits, clearPast })(GoogleAuthentication);