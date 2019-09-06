import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Question from '../../models/Question';
import MsgModal from '../msgModal/MsgModal.js';
import { addQuestion } from '../../actions/reduxActions';
import './QuestionsAdder.css';

class QuestionsAdder extends Component {
  constructor(props) {
    super(props);
    this.state = { modalShow: false };
    this.addQuestionFunc = this.addQuestionFunc.bind(this);
    this.checkIfMaximumLimitReached = this.checkIfMaximumLimitReached.bind(
      this
    );
  }

  /*Adds questions*/
  addQuestionFunc() {
    if (this.checkIfMaximumLimitReached()) {
      return false;
    }

    this.props.dispatch(addQuestion(new Question()));
  }

  /*If maximum limit of questions is reached, then it displays a modal with a relative message*/
  checkIfMaximumLimitReached() {
    if (this.props.questions.length === 10) {
      this.setState({ modalShow: true });
      return true;
    }
    return false;
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let limitError = {
      header: 'Maximum limit reached',
      body: 'You can not add more than 10 questions.'
    };
    let bodyTemplate = <p>{limitError.body}</p>;

    return (
      <section className="questions-adder clearfix">
        <Row>
          <Col sm={6}>
            <h3>Create your Questionnaire</h3>
          </Col>
          <Col sm={6}>
            <button className="btn add-btn" onClick={this.addQuestionFunc}>
              <i className="fas fa-plus"></i> Add New Question
            </button>
          </Col>
        </Row>
        <MsgModal
          size="sm"
          show={this.state.modalShow}
          onHide={modalClose}
          header={limitError.header}
          bodyTemplate={bodyTemplate}
        />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions
});

export default connect(mapStateToProps)(QuestionsAdder);
