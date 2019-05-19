import '../circle.css';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Moment from 'react-moment';
import domtoimage from 'dom-to-image';
// eslint-disable-next-line
import { saveAs } from 'file-saver';

import Loader from '../Loader';
import { newAudit, resetAudit, pastAudits, changeView } from '../../actions';
import SeoAccordion from '../SeoAccordion';
import Opportunities from '../Opportunities';
import BestPractices from '../BestPractices';
import lighthouseapi from '../../api/lighthouseapi';

class Results extends React.Component {
  constructor(props) {
    super(props);
    props.changeView(props.match.url);

    if (!_.isEmpty(props.form)){
      runAudit(props).then((response) => {
        props.newAudit(response);
        if (!response.auditResults.hasOwnProperty('code')) {
          if(props.auth.isSignedIn){
            addAuditToDatabase(props.auth.userId, response.auditResults)
              .then(res => {
                getAudits(this.props.auth.userId)
                  .then(res => {
                    this.props.pastAudits(res)
                  })
                  .catch(err => {
                    console.log(err);
                  })
              })
          }
        } 
      });
    } else if (!_.isEmpty(props.auditData)) {

    } else {
      this.props.history.push('/');
    }
    this.state = {
      windowSize: 0
    }
    this.updateWindowSize = this.updateWindowSize.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateWindowSize)
    this.updateWindowSize();
  }

  updateWindowSize() {
    this.setState({ windowSize: window.innerWidth})
  }
  
  render() {
    return (
      <div className="ui container" style={{marginBottom: '3rem', backgroundColor: '#fff'}} >
        {renderContent(this.props, this.state)}
      </div>
    )
  }
  componentWillUnmount(){
    this.props.resetAudit();
    window.removeEventListener('resize', this.updateWindowSize)
  }
};

const runAudit = async props => {
  let obj = {};
  let url = props.form.searchBox.values.url;
  let device = props.form.searchBox.values.device;
  let onlyCategories = [];
  if(!_.isUndefined(props.form.searchBox.values.performance)) {
    if (props.form.searchBox.values.performance) {
      onlyCategories.push('performance')
    }
  }
  if(!_.isUndefined(props.form.searchBox.values.seo)) {
    if (props.form.searchBox.values.seo) {
      onlyCategories.push('seo')
    }
  }
  if(!_.isUndefined(props.form.searchBox.values['best-practices'])) {
    if (props.form.searchBox.values['best-practices']) {
      onlyCategories.push('best-practices')
    }
  }
  await lighthouseapi.post('/runtest', { url, device, onlyCategories })
    .then((response) => {
      delete response.data.timing;
      delete response.data.i18n;
      delete response.data.runWarnings;
      delete response.data.categoryGroups;
      obj = {
        auditResults: response.data,
        isAuditSuccess: true,
        isAuditReady: true
      }
    })
    .catch((error) => {
      obj = {
        auditResults: error,
        isAuditSuccess: false,
        isAuditReady: true
      }
    });
  return obj;
}

const addAuditToDatabase = async (userId, auditData) => {
  let obj = {
    auditUser: userId,
    auditData: {
      audits: auditData.audits,
      categories: auditData.categories,
      configSettings: auditData.configSettings,
      environment: auditData.environment,
      fetchTime: auditData.fetchTime,
      finalUrl: auditData.finalUrl,
      requestedUrl: auditData.requestedUrl,
    }
  }
  await lighthouseapi.post('/add-audit', obj)
    .then(res => {
    })
    .catch(err => {
      console.log(err)
    })
};

const renderContent = (props, state) => {
  if (!props.isAuditReady){
    return (
      <div className="ui container" style={{textAlign: 'center'}}>
        <Loader style={{margin: '0 auto'}} />     
      </div>
    )
  } 
  if (!props.auditData.hasOwnProperty('code')) {
    let audits = [];
    if (!_.isUndefined(props.auditData.categories.performance)) {
      audits.push('performance')
    }
    if (!_.isUndefined(props.auditData.categories.seo)) {
      audits.push('seo')
    }
    if (!_.isUndefined(props.auditData.categories['best-practices'])) {
      audits.push('best-practices')
    }

    let tableClass = '';
    if (audits.length === 1) {
      tableClass = 'ui doubling stackable two column grid'
    } else if (audits.length === 2) {
      tableClass = 'ui doubling stackable three column grid'
    } else if (audits.length === 3) {
      tableClass = 'ui doubling stackable four column grid'
    }

    let sectionClass = "ui doubling stackable two column grid";
    if (audits.includes('performance') && !audits.includes('seo')) {
      sectionClass = "ui doubling stackable one column grid"
    }
    if (audits.includes('seo') && !audits.includes('performance')) {
      sectionClass = "ui doubling stackable one column grid"
    }
    return (
      <div style={{marginTop: '3rem'}}> 
        <div className={tableClass}>
          <div className="column">
            <h2 className="ui header" style={{ fontSize: '4rem' }}>Results</h2>
            <h4 className="ui header" style={{ fontWeight: '400'}}><b>URL:</b> <a href={props.auditData.finalUrl}>{props.auditData.finalUrl}</a></h4>
            <h4 className="ui header" style={{ fontWeight: '400', textTransform: 'capitalize'}}> <b>Emulated Device:</b> {props.auditData.configSettings.emulatedFormFactor} </h4>
            <h4 className="ui header" style={{ fontWeight: '400'}}><b>Time:</b> <Moment format="DD/MM/YYYY HH:mm" date={props.auditData.fetchTime} /></h4>
          </div>
          {state.windowSize < 992 ? <div className="column"></div> : null}
          { props.auditData.categories.performance ? <div className="column">{topSegmentRender(props.auditData.categories.performance)}</div> : null }
          { props.auditData.categories.seo ? <div className="column">{topSegmentRender(props.auditData.categories.seo)}</div> : null }
          { props.auditData.categories['best-practices'] ? <div className="column">{topSegmentRender(props.auditData.categories['best-practices'])}</div> : null }
        </div>
        <div className="ui stackable two column grid">
          <div className="column">
            <div style={{display: 'flex'}}>
              Scale:
              <div style={{color: '#db2828', margin: '0 0.5rem'}}> 0-49 </div>
              <div style={{color: '#f2711c', margin: '0 0.5rem'}}> 50-89 </div>
              <div style={{color: '#21ba45', margin: '0 0.5rem'}}> 90-100 </div>
            </div>
          </div>
          <div className="right aligned column">
            <button className="ui teal button" onClick={() => {downloadResults(props.auditData.finalUrl)}}><i className="download icon" ></i>Download</button>
          </div>
        </div>
        <div className={sectionClass} style={{ marginBottom: '2rem' }}>
          { audits.includes('performance') ? ( 
            <div className="column">
              <div className="ui segment" style={{ backgroundColor: '#352ADF' }}>
                <div className="ui header" style={{ fontSize:' 2rem', color: '#fff' }}>Performance</div>
                <div className="ui middle aligned very relaxed divided list" style={{ padding: '0.75rem', backgroundColor: '#fff', borderRadius: '0.25rem' }}>
                  {performanceDetailRender(props.auditData.audits['first-contentful-paint'])}
                  {performanceDetailRender(props.auditData.audits['first-meaningful-paint'])}
                  {performanceDetailRender(props.auditData.audits['first-cpu-idle'])}
                  {performanceDetailRender(props.auditData.audits['speed-index'])}
                  {performanceDetailRender(props.auditData.audits['interactive'])}
                </div>
              </div>
            </div>) : null }
          { audits.includes('seo') ? (<div className="column">
            <div className="ui segment" style={{ backgroundColor: '#352ADF'}}>
              <div className="ui header" style={{ color: '#FFF', fontSize:' 2rem' }}>SEO</div>
              <SeoAccordion />
            </div>
          </div>) : null }
        </div>
        { audits.includes('best-practices') ? <BestPractices /> : null }
        { audits.includes('performance') ? <Opportunities /> : null } 
      </div>
    )
  } else {
    return (
      <div style={{ marginTop: '4rem' }}>
        <h1>An error has occured with the audit. Please check if you typed the correct address or try again later. </h1>
      </div>
    )
  }
};

const topSegmentRender = obj => {
  if (obj.score < 100){
    obj.score = _.round(obj.score * 100);
  } 
  if (obj.score > 100) {
    obj.score = obj.score / 100
  }
  let circleColor = (value) => {
    if (value <= 49) {
      return 'red';
    } else if (value > 49 && value <= 89) {
      return 'orange';
    } else {
      return 'green';
    }
  }
  return (
    <div className={`ui ${circleColor(obj.score)} segment alignCenter`}>
      <h4>{obj.title}</h4>
      <div className={`c100 small ${circleColor(obj.score)} p${obj.score} `}>
        <span>{obj.score}</span>
        <div className="slice">
          <div className="bar"></div>
          <div className="fill"></div>
        </div>
      </div>
    </div>
  )
}

const performanceDetailRender = obj => {
  let value = _.round(obj.rawValue);
  let bestPracticeText = '';
  let color = 'red';
  if (obj.id === 'first-contentful-paint'){
    bestPracticeText = 'Best practice: Under 2 seconds.'
    if (value < 2000){
      color = 'green';
    }
  }
  if (obj.id === 'first-meaningful-paint'){
    bestPracticeText = 'Best practice: Under 2 seconds.'
    if (value < 2000){
      color = 'green';
    }
  }
  if (obj.id === 'first-cpu-idle'){
    bestPracticeText = 'Best practice: Under 3 seconds.'
    if (value < 3000){
      color = 'green';
    }
  }
  if (obj.id === 'speed-index'){
    bestPracticeText = 'Best practice: Under 3 seconds.'
    if (value < 3000){
      color = 'green';
    }
  }
  if (obj.id === 'interactive'){
    bestPracticeText = 'Best practice: Under 3 seconds.'
    if (value < 3000){
      color = 'green';
    }
  }
  
  return (
    <div className="item">
      <div className="right floated content">
        <div className={'ui horizontal label ' + color} style={{float: 'right', fontColor: '#000'}}>{obj.displayValue}</div>
      </div>
      <div className="content">
        <div 
        className="header"
        data-tooltip={obj.description.split('.', 1)[0] + '.'}
        data-position="top left">
          {obj.title} 
          <div className="sub header" style={{ fontWeight: '400' }}>{bestPracticeText}</div>
          <a href={obj.description.substring(obj.description.indexOf('(') + 1, obj.description.indexOf(')'))}>Learn More</a>
        </div>
      </div>
    </div>
  )
}

const getAudits = async id => {
  let response = [];
  await lighthouseapi.post('/find', { id: id })
    .then(res => {
      response = res.data;
      })
    .catch(err => {
      console.log(err);
    })
    return response;
}

const downloadResults = (url) => {
  let pngName = url + '_results.png'
  domtoimage.toBlob(document.getElementById('root'), { bgcolor: '#fff'} )
    .then(blob => {
        window.saveAs(blob, pngName);
    })
    .catch(err => {
      alert('Problem with downloading. Please contact us! ' + err)
    })
}

const mapStateToProps = state => {
  return {
    form: state.form,
    auditData: state.audit.auditData,
    isAuditReady: state.audit.isAuditReady,
    isAuditSuccess: state.audit.isAuditSuccess,
    pastAudits: state.audit.pastAudits,
    auth: state.auth
  }
};

export default connect(mapStateToProps, { newAudit, resetAudit, pastAudits, changeView })(Results);
