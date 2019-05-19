import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { AnimatedSwitch } from 'react-router-transition';

import './App.scss';
import NavBar from './NavBar';
import Main from './views/Main';
import Contact from './views/Contact';
import PastAudits from './views/PastAudits';
import Results from './views/Results';
import PrivacyPolicy from './PrivacyPolicy';
import lighthouseapi from '../api/lighthouseapi';
import MessageBlock from './MessageBlock';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      connection: true,
      connectionError: ''
    }
    
    lighthouseapi.post('/check-connection')
    .then(res => {
      this.setState({ connection: true })
    })
    .catch(err => {
      this.setState({ 
        connection: false,
        connectionError: 'Problems with connecting to the server. Please contact the website manager or check console log for error specifications.'
      })
    })
  }

  style = { 
    position: 'absolute',
    top: '0',
    right: '8px',
    boxShadow: '2px 4px 6px 0px rgba(176,176,176,1)',
    zIndex: '99999'
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          {this.props.view.currentView !== '/results' ? <NavBar /> :backMenu(this.props)}
          {this.state.connection === false ? <MessageBlock header="Connection to server refused!" content={this.state.connectionError} style={this.style} color="red" /> : null}
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            <Route path="/" exact component={Main} />
            <Route path="/results" exact component={Results} />
            <Route path="/contact" exact component={Contact} />
            <Route path="/audit-history" exact component={PastAudits} />
            <Route path="/privacy-policy" exact component={PrivacyPolicy} />
          </AnimatedSwitch>
        </div>
      </BrowserRouter>
    )
  }
};

const backMenu = props => {
  let style = {
    backgroundColor: '#352ADF',
    padding: '1rem'
  }
  return (
    <div style={style}>
      <div className="ui container" style={{ padding: '0.5rem' }}>
        <Link to={props.view.previousView === null ? '/' : props.view.previousView} style={{textDecorations: 'none', color: '#fff'}}> 
            <i className="chevron left icon" style={{fontSize: '2em', padding: '1rem'}}></i>
        </Link>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    audit: state.audit,
    view: state.view
  }
}

export default connect(mapStateToProps)(App);