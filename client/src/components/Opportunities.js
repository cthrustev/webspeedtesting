import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class Opportunities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opportunities: getOpportunityValues(props.opportunities.audits, props.opportunities.categories.performance.auditRefs)
    };
  }
  render() {
    return (
      <div className="ui segment" style={{ backgroundColor: '#352ADF', marginTop: '4rem' }}>
        <div className="ui header" style={{ fontSize: '3rem', color: '#fff' }}>
          Improvement Opportunities
          <div className="sub header" style={{ color: '#fff' }}>
            The displayed information indicates elements of the web page that need further attention and could be optimized for better performance. 
          </div>
        </div>
        {loopSegments(this.state)}
      </div>
    )
  }
}

const getOpportunityValues = (audits, auditRefs) => {
  let arr = auditRefs.filter(ref => (ref.group === 'load-opportunities'));
  let oppArray = [];
  arr.forEach(e => {
    let eid = e.id;
    oppArray.push(audits[eid]);
  })
  let opportunityArray = separateEmptyValues(oppArray);
  return opportunityArray;
}

const separateEmptyValues = array => {
  let arr = array.filter(ref => (ref.rawValue !== 0));
  return arr;
}

const loopSegments = state => {
  const segments = [];
  state.opportunities.forEach(opp => {
    segments.push(renderOppSegment(opp));
  });
  return segments;
}

const renderOppSegment = opp => {
  return (
    <div className="ui segment" key={opp.id}>
      <div className="item">
        <div className="middle aligned content">
          <div className="ui medium header">
            {opp.title}
            <div className="sub header">{opp.description.split('.', 1)[0]}. <a href={opp.description.substring(opp.description.indexOf('(') + 1, opp.description.indexOf(')'))}>Learn More</a></div>
          </div>
          <div className="">{opp.displayValue}</div>
        </div>
      </div>
      {segmentTable(opp)}
    </div>
  )
}

const segmentTable = opp => {
  let details = opp.details;
  if (opp.scoreDisplayMode === "numeric") {
    let headingRender = [];
    let headingKey = [];
    let itemsArr = [];
    let itemsRender = [];

    details.headings.forEach(h => {
      if(!headingKey.includes(h.key) && h.label !== ""){
        headingKey.push(h.key);
        headingRender.push(<th key={h.key}>{h.label}</th>);
      }
    })

    details.items.forEach(i => {
      itemsArr.push(i)
    });
    itemsArr.forEach(item => {
      let td = [];
      headingKey.forEach(h => {
        let value = item[h];
        let style = {};
        if (Number.isFinite(value)){
          value = _.round(value);
        }
        if (h === 'url') {
          style = { wordBreak: 'break-all' }
        }
        td.push(<td key={h} style={style}>{value}</td>)
      })
      itemsRender.push(<tr key={item.url}>{td}</tr>)
    })
    return (
      <table className="ui striped tablet stackable red table">
        <thead>
          <tr>
            {headingRender}
          </tr>
        </thead>
        <tbody>
          {itemsRender}
        </tbody>
      </table>
    )
  }
}

const mapStateToProps = state => {
  return {
    opportunities: state.audit.auditData
  }
}

export default connect(mapStateToProps)(Opportunities);