import React from 'react';
import { connect } from 'react-redux';

import SearchBox from '../SearchBox';
import { changeView } from '../../actions';
import Footer from '../Footer';

class Main extends React.Component {
  componentDidMount() {
    this.props.changeView(this.props.match.url);
  }

  stylesOutside = {
    minHeight: '100vh'
  };

  stylesInside = {
    minHeight: 'calc(100vh - 212px)',
    overflowY: 'auto'
  };

  footerStyles = {
    position: 'relative',
    backgroundColor: '#352ADF',
    width: '100%',
    padding: '2rem',
  };

  render() {
    return (
      <div style={this.stylesOutside}>
        <div style={this.stylesInside}>
          <div className="ui text container middle aligned content" style={{marginTop: '9rem', marginBottom: '3rem'}}>
            <div className="content">
              <h1 className="ui header" style={{fontWeight: 'normal'}}>Audit any website from the web</h1>
              <h3 style={{fontWeight: 'normal'}}>Enter an URL to analyze and gain insight about performance metrics, SEO, best practices used and improvement opportunities. </h3>
            </div>
          </div>
          <SearchBox />
        </div>
        <Footer style={this.footerStyles} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentView: state.view.currentView
  }
}

export default connect(mapStateToProps, { changeView })(Main);