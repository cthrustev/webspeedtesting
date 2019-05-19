import './SearchBox.scss';

import React from 'react';
import Validator from 'validator';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import MessageBlock from './MessageBlock';


class SearchBox extends React.Component {
  state = {
    auditError: false
  };

  renderError(input, meta) {
    if (!Validator.isURL(input, {require_protocol: true}) && meta.touched) {
      return (
        <div className="ui error message">
          <div className="header">Please enter a valid URL! Adding 'https://' is required!</div>
        </div>
      )
    }
  };

  renderInput = ({ input, meta }) => {
    return (
      <div> 
        <div className="ui fluid action input">
          <input 
            {...input}
            autoComplete="off"
            placeholder="https://www.example.com"
          />
          <button className="ui button positive" >Analyze URL</button>
        </div>
        {this.renderError(input.value, meta)}
      </div>
    )
  };

  onSubmit(formValues){
    let perf = formValues.performance;
    let seo = formValues.seo;
    let bp = formValues['best-practices'];

    if(_.isEmpty(formValues.url)){
      console.log('URL empty');
    } else if ((_.isUndefined(perf) && _.isUndefined(seo) && _.isUndefined(bp)) || (perf === false && _.isUndefined(seo) && _.isUndefined(bp)) ||(perf === false && seo === false  && _.isUndefined(bp)) || (perf === false && seo === false && bp === false) || (seo === false && _.isUndefined(perf) && _.isUndefined(bp)) || (bp === false && _.isUndefined(perf) && _.isUndefined(bp))) {
      this.setState({ auditError: true })
      setTimeout(() => {
        this.setState({ auditError: false })
      }, 4500)
    }
    
    else {
      if (Validator.isURL(formValues.url, {require_protocol: true})) {
        this.props.history.push('/results');
      }
    }
  };

  render() {
    return (
      <div className="searchbox-bg">
        <div className="searchinput">
          <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))} className="ui form error">
            <Field 
              name="url"
              component={this.renderInput} 
            />
            <div className="ui raised horizontal segments">
              <div className="ui segment grouped fields">
                <h3 className="ui header">
                  Device: 
                  <div className="sub header">The results will be displayed for the page <br/> performance on the selected device. </div>
                </h3>
                <label className="field">
                  <Field
                    name="device"
                    component="input"
                    type="radio"
                    value="desktop"
                  />{' '}
                  Desktop
                </label>
                <label className="field">
                  <Field
                    name="device"
                    component="input"
                    type="radio"
                    value="mobile"
                  />{' '}
                  Mobile
                </label>
              </div>
              <div className="ui segment grouped fields">
              <h3 className="ui header">
                Audits: 
                <div className="sub header">Select the types of audits to run. </div>
              </h3>
                <label className="field">
                  <Field
                    name="performance"
                    component="input"
                    type="checkbox"
                    value="performance"
                    style={{marginTop: '3px'}}
                  />{' '}
                  Performance/Improvement Opportunities
                </label>
                <label className="field">
                  <Field
                    name="seo"
                    component="input"
                    type="checkbox"
                    value="seo"
                    style={{marginTop: '3px'}}
                  />{' '}
                  SEO
                </label>
                <label className="field">
                  <Field
                    name="best-practices"
                    component="input"
                    type="checkbox"
                    value="best-practices"
                    style={{marginTop: '3px'}}
                  />{' '}
                  Best Practices
                </label>
              </div>
            </div>
          </form>
        </div>
        {this.state.auditError ? <MessageBlock color="red" header="Error!" content="Please select at least one audit to run." style={{position: 'absolute',top: '0', zIndex: '101', right: '15px'}} /> : null}
      </div>
    )  
  }
};

export default withRouter(
  reduxForm({
    form: 'searchBox',
    initialValues: {
      device: 'desktop'
    }
  })(SearchBox)
);