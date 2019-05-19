import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Accordion, Icon } from 'semantic-ui-react'

 class SeoAccordion extends Component {
  state = { activeIndex: null }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state;
    let refs = this.props.auditData;
    return (
      <Accordion styled style={{ width: '100%' }}>
      <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {refs.audits['viewport'].title}
          {returnIcon(refs.audits['viewport'].score)}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>{refs.audits['viewport'].description.split('.', 1)[0]}.</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {refs.audits['document-title'].title}
          {returnIcon(refs.audits['document-title'].score)}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <p>{refs.audits['document-title'].description.split('.', 1)[0]}.</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {refs.audits['meta-description'].title}
          {returnIcon(refs.audits['meta-description'].score)}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>{refs.audits['meta-description'].description.split('.', 1)[0]}.</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {refs.audits['http-status-code'].title}
          {returnIcon(refs.audits['http-status-code'].score)}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <p>{refs.audits['http-status-code'].description.split('.', 1)[0]}.</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 4} index={4} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {refs.audits['link-text'].title}
          {returnIcon(refs.audits['link-text'].score)}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 4}>
          <p>{refs.audits['link-text'].description.split('.', 1)[0]}.</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 5} index={5} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {refs.audits['is-crawlable'].title}
          {returnIcon(refs.audits['is-crawlable'].score)}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 5}>
          <p>{refs.audits['is-crawlable'].description.split('.', 1)[0]}.</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 6} index={6} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {refs.audits.hreflang.title}
          {returnIcon(refs.audits.hreflang.score)}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 6}>
          <p>{refs.audits.hreflang.description.split('.', 1)[0]}.</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 7} index={7} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {refs.audits['font-size'].title}
          {returnIcon(refs.audits['font-size'].score)}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 7}>
          <p>{refs.audits['font-size'].description.split('.', 1)[0]}.</p>
        </Accordion.Content>
      </Accordion>
    )
  }
}

const returnIcon = (value) => {
  if (value === 1){
    return <Icon name="check circle" color="green" style={{float: 'right'}} />
  } else {
    return <Icon name="exclamation circle" color="red" style={{float: 'right'}} />
  }
}

const mapStateToProps = state => {
  return{
    auditData: state.audit.auditData
  }
}

export default connect(mapStateToProps)(SeoAccordion);