import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
 
import { changeView, oldAudit, pastAudits } from '../../actions';
import lighthouseapi from '../../api/lighthouseapi';
import Confirmation from '../Confirmation';
import MessageBlock from '../MessageBlock';
import Footer from '../Footer';
import Loader from '../Loader';


class PastAudits extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      renderMessage: 'null'
    }
  }

  componentDidMount() {
    this.props.changeView(this.props.match.url);
  }
  
  tableRender() {
    if (this.props.auth.isSignedIn) {
      if (this.props.audit.pastAudits !== null) {
        if (this.props.audit.pastAudits.length === 0) {
          return (
            <div className="ui container" style={{textAlign: 'center'}}>
              <Loader style={{margin: '0 auto'}} />
            </div>
          )
        }
        if (this.props.audit.pastAudits[0] === 'empty') {
          return (
            <div className="ui segment">
              <h4 className="ui header">Nothing to show. Run some tests before accessing them from here.</h4>
            </div>
          )
        }
        if (this.props.audit.pastAudits[0] !== 'empty') {
          return (
            <table className="ui striped celled compact fixed table">
              <thead>
                <tr>
                  <th className="three wide">Date</th>
                  <th className="two wide">Time</th>
                  <th className="five wide">URL</th>
                  <th className="three wide">Device</th>
                  <th className="three wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                <HistoryList history={this.props.audit.pastAudits} props={this.props} />
              </tbody>
            </table>
          )
        }
      }
    } else {
      return (
        <div className="ui segment">
          <h4 className="ui header">Please sign in to access this area of content.</h4>
        </div>
      )
    }
  }
  
  style = {
    minHeight: 'calc(100vh - 94px)'
  }

  footerStyle = {
    position: 'relative',
    backgroundColor: '#352ADF',
    width: '100%',
    padding: '2rem',
    bottom: '0',
    marginTop: '2rem'
  };

  render() {
    return (
      <div style={this.style}>
        <div className="ui container" style={{ marginTop: '7rem' }}>
          <h1 className="ui header">Past Audits</h1>
        </div>
        <div className="ui container" style={{height: 'calc(100vh - 384px)', overflowY: 'auto', marginTop: '1rem'}}>
          {this.tableRender()}
          {showMessage(this.state)}
        </div>
        <Footer style={this.footerStyle} />
      </div>
    )
  }
}

const HistoryList = (props) => {
  let history = props.history;
  let arr = history.filter(obj => Object.keys(obj).includes("auditData"));
  const table = arr.map((row) =>
    <tr key={row._id}>
      <td><Moment format="DD/MM/YYYY" date={row.auditData.fetchTime} /></td>
      <td><Moment format="HH:mm" date={row.auditData.fetchTime} /></td>
      <td>{row.auditData.finalUrl}</td>
      <td style={{ textTransform: 'capitalize'}}>{row.auditData.configSettings.emulatedFormFactor}</td>
      <td>
        <div className="ui icon buttons">
          <button className="tiny blue ui button" onClick={openAudit.bind(this, props.props, row.auditData)}><i className="search icon"></i></button>
          <Confirmation text={<i className="trash alternate icon"></i>} styling="tiny red ui button" onConfirmClick={deleteAudit.bind(this, row._id, props)} trash={true} />
        </div>
      </td>
    </tr>
  );
  return table;
}

const openAudit = (props, auditData) => {
  props.oldAudit(auditData);
  props.history.push('/results');
}

const deleteAudit = async (auditID, props) => {
  let isDeleted = (item) => {
    if (item._id !== auditID) {
      return item
    }
  }
  await lighthouseapi.post('/delete', { id: auditID })
    .then(res => {
      let array = props.history.filter(isDeleted);
      props.props.pastAudits(array);
    })
    .catch(err => {
      console.log(err);
    })
}

const showMessage = state => {
  let style = { 
    position: 'absolute',
    top: '-25px',
    right: '8px',
    boxShadow: '2px 4px 6px 0px rgba(176,176,176,1)'
  }
  if(state.renderMessage === 'success') {
    return (
      <MessageBlock
        header="Success!"
        content="Audit has been successfully deleted from the database." 
        color="green"
        style={style}
      />
    )
  } else if (state.renderMessage === 'error') {
    return (
      <MessageBlock
        header="Error!"
        content="There was a problem with deleting process. Please try again!" 
        color="red"
        style={style}
      />
    )
  } else {
    return null;
  }
}

const mapStateToProps = state => {
  return {
    view: state.view.currentView,
    auth: state.auth,
    audit: state.audit
  }
}

export default connect(mapStateToProps, { changeView, oldAudit, pastAudits })(PastAudits);