import React from 'react';
import { connect } from 'react-redux';

import { changeView } from '../../actions';
import Footer from '../Footer';
import lighthouseapi from '../../api/lighthouseapi';

class Analytics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      subject: 'General enquiry',
      message: '',
      nameError: false,
      emailError: false,
      messageError: false,
      formStatus: false,
      formLoading: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let name = target.name
    this.setState({ [name]: value })
    if (value === '') {
      this.setState({ [name+`Error`]: true})
    } else {
      this.setState({ [name+`Error`]: false})
    }
  }

  checkFormValues = () => {
    if(this.state.name === '') {
      this.setState({ nameError: true })
    } else {
      this.setState({ nameError: false })
    }
    if(this.state.email === '') {
      this.setState({ emailError: true })
    } else {
      this.setState({ emailError: false })
    }
    if(this.state.message === '') {
      this.setState({ messageError: true })
    } else {
      this.setState({ messageError: false })
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.checkFormValues();
    if (this.state.name === '' || this.state.email === '' || this.state.message === '') {
      alert('Please fill in all the necessary fields.')
    } else {
      this.setState({ formLoading: true });
      sendEmail(this.state)
        .then(res => {
          if(res.status === 'success') {
            this.setState({
              name: '',
              email: '',
              subject: 'General enquiry',
              message: '',
              nameError: false,
              emailError: false,
              messageError: false,
              formStatus: true,
              formLoading: false
            })
            setTimeout(() => {
              this.setState({ formStatus: false })
            }, 3500)
          }
        });
    }
  }

  componentDidMount() {
    this.props.changeView(this.props.match.url);
  }

  footerStyle = {
    position: 'relative',
    backgroundColor: '#352ADF',
    width: '100%',
    padding: '2rem',
    bottom: '0',
    marginTop: '2rem'
  }

  render() {
    return (
      <div style={{ height: 'calc(100vh - 94px)'}}>
        <div className="ui container" style={{ marginTop: '7rem', marginBottom: '2rem' }}>
          <h1 className="ui header">Contact us</h1>
        </div>
        <div className="ui container" style={{ height: 'calc(100vh - 398px)', overflowY: 'auto', overflowX: 'hidden'}}>
          <form className={"ui form " + (this.state.formStatus ? 'success ' : null) + (this.state.formLoading ? ' loading' : null)} id="contactForm" onSubmit={this.handleSubmit.bind(this)}>
            <div className="two fields">
              <div className={'required field ' + (this.state.nameError ? 'error' : null)}>
                <label>Name</label>
                <input type="text" name="name" placeholder="Name" onChange={this.handleChange} value={this.state.name} />
              </div>
              <div className={'required field ' + (this.state.emailError ? 'error' : null)}>
                <label >Your Email</label>
                <input type="email" name="email" placeholder="johndoe@gmail.com" onChange={this.handleChange} value={this.state.email} />
              </div>
            </div>
            <div className="field">
              <label>Subject</label>
              <select onChange={this.handleChange} value={this.state.subject} name="subject">
                <option value="General enquiry">General enquiry</option>
                <option value="Problem with the service">Problem with the service</option>
                <option value="Feedback on service">Feedback on service</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={'required field ' + (this.state.messageError ? 'error' : null)}>
              <label>Message</label>
              <textarea rows="2" name="message" onChange={this.handleChange} value={this.state.message} style={{marginTop: '0px', marginBottom: '0px'}}></textarea>
            </div>
            <div className="ui success message">
              <div className="header">Message Sent</div>
              <p>Thank you for contacting with us. We will be in touch with you soon.</p>
            </div>
            <button className="ui button" type="submit">Send Message</button>
          </form>
        </div>
        <Footer style={this.footerStyle} />
      </div>
    )
  }
}

const sendEmail = async (state) => {
  let response = {}
  await lighthouseapi.post('/send-email', { name: state.name, email: state.email, subject: state.subject, message: state.message })
    .then(res => {
      response = res.data;
    })
    .catch(err => {
      response = err.data
    })
  return response;
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    currentView: state.view.currentView
  }
}

export default connect(mapStateToProps, { changeView })(Analytics);