import React from 'react';
import { connect } from 'react-redux';
import { isObject } from 'util';
import _ from 'lodash';


class BestPractices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bestPractices: getBestPracticesValues(props.bestPractices.audits, props.bestPractices.categories['best-practices'].auditRefs)
    };
  }
  render(){
    return (
      <div className="ui segment" style={{ margin: '2rem 0', backgroundColor: '#352ADF' }}>
        <div className="ui header" style={{ fontSize: '3rem', color: '#fff' }}>
          Best Practices
          <div className="sub header" style={{ color: '#fff' }}>
            The displayed information indicates elements of the web page that are not following the best-practices of web development and need further attention. 
          </div>
        </div>
        
        {loopSegments(this.state)}
      </div>
    );
  }
}

const getBestPracticesValues = (audits, auditRefs) => {
  let bpArray = [];
  auditRefs.forEach(audit => {
    let auditId = audit.id;
    bpArray.push(audits[auditId]);
  })
  let bestPracticesArray = separateEmptyValues(bpArray);
  return bestPracticesArray;
}

const separateEmptyValues = array => {
  let arr = array.filter(ref => (ref.score === 0));
  return arr;
}

const loopSegments = state => {
  const segments = [];
  if (state.bestPractices.length === 0) {
    segments.push(<h4 key="allGood" className="ui header" style={{ color: '#fff'}}>Everything seems to be great here!</h4>);
  } else {
    state.bestPractices.forEach(opp => {
      segments.push(renderBpSegment(opp));
    });
  }
  return segments;
}

const renderBpSegment = bp => {
  return (
    <div className="ui segment" key={bp.id}>
      <div className="item">
        <div className="middle aligned content">
          <div className="ui medium header">
            {bp.title}
            <div className="sub header">{bp.description.split('.', 1)[0]}.</div>
          </div>
          <div className="">{bp.displayValue}</div>
        </div>
      </div>
      {segmentTable(bp)}
    </div>
  )
}

const segmentTable = bp => {
  let details = bp;
  if (details.details) {
    let headingRender = [];
    let headingKey = [];
    let itemsArr = [];
    let itemsRender = [];
    details.details.headings.forEach(h => {
      if(!headingKey.includes(h.key) && h.text !== ""){
        headingKey.push(h.key);
        headingRender.push(<th key={h.key}>{h.text}</th>);
      }
    })
    if (details.details.items.length > 25) {
      details.details.items = details.details.items.slice(0, 25);
    }
    details.details.items.forEach((item, index) => {
      itemsArr.push({item, index})
    });
    itemsArr.forEach(item => {
      let td = [];
      headingKey.forEach(h => {
        let value = item.item[h];
        let style = {};
        if (h === 'url' || h === 'href') {
          style = { wordBreak: 'break-all' }
        }
        if (value){
          if (Number.isFinite(value)){
            value = _.round(value);
          }
          if (isObject(value)) {
            value = value.text;
            td.push(<td key={value} style={style}>{value}</td>)
          } else {
            td.push(<td key={value} style={style}>{value}</td>)
          }

        } else {
          td.push(<td key="empty" style={style}></td>)
        }
      })
      itemsRender.push(<tr key={item.index}>{td}</tr>)
    })
    return (
      <table className="ui striped tablet stackable red table">
        <thead>
          <tr style={{ wordBreak: 'break-all' }}>
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
    bestPractices: state.audit.auditData
  }
};

export default connect(mapStateToProps)(BestPractices);