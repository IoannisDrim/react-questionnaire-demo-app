import React, {Component} from 'react';
import {connect} from 'react-redux';
import Answer from '../../models/Answer.js';
import {InputGroup, FormControl, Button} from 'react-bootstrap';
import {
  updateAnswer,
  deleteAnswer,
  moveAnswerUpwards,
  moveAnswerDownwards,
} from '../../actions/reduxActions';
import './AnswerComponent.css';

class AnswerComponent extends Component {
  // input: ?HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {answer: new Answer()};

    this.cancelAnswerIfNotInserted = this.cancelAnswerIfNotInserted.bind(this);
    this.updateAnswerMsg = this.updateAnswerMsg.bind(this);
    this.insertAnswer = this.insertAnswer.bind(this);
    this.checkIfEnterPressed = this.checkIfEnterPressed.bind(this);
    this.deleteAnswer = this.deleteAnswer.bind(this);
    this.moveAnswerUpwards = this.moveAnswerUpwards.bind(this);
    this.moveAnswerDownwards = this.moveAnswerDownwards.bind(this);
  }

  componentDidMount() {
    this.setState({answer: this.props.data});
    this.input.focus();
  }

  updateAnswerMsg(event) {
    this.props.data.message = event.target.value;
    this.setState({answer: this.props.data});
  }

  deleteAnswer(answerId) {
    this.props.dispatch(deleteAnswer(this.state.answer));
    this.props.setAnswerVisibility();
    this.props.checkIfAnswersAreEmpty();
  }

  moveAnswerUpwards(answerIndex) {
    this.props.dispatch(moveAnswerUpwards(answerIndex, this.state.answer));
    this.props.setAnswerVisibility();
  }

  moveAnswerDownwards(answerIndex) {
    this.props.dispatch(moveAnswerDownwards(answerIndex, this.state.answer));
    this.props.setAnswerVisibility();
  }

  /* Checks if 'Enter' pressed in order to insert new Answer*/
  checkIfEnterPressed(event) {
    if (event.key === 'Enter' && !this.state.answer.isInserted) {
      this.insertAnswer();
      event.target.blur();
    }
  }

  insertAnswer(event) {
    this.props.data.isInserted = true;
    this.setState({answer: this.props.data});
    this.props.dispatch(updateAnswer(this.props.data));
    this.props.enableAddAnswerBtn();
  }

  /* Checks if answer has been inserted after hitting 'enter' key*/
  cancelAnswerIfNotInserted() {
    if (!this.state.answer.isInserted) {
      this.props.dispatch(deleteAnswer(this.state.answer));
      this.props.enableAddAnswerBtn();
    }
  }

  render() {
    return (
      <div className={'answer-container ' + this.props.class}>
        <InputGroup>
          <FormControl
            placeholder={'Answer ' + parseInt(this.props.index + 1) + '...'}
            ref={(inputElm) => (this.input = inputElm)}
            value={this.state.answer.message}
            onBlur={this.cancelAnswerIfNotInserted}
            onKeyPress={this.checkIfEnterPressed}
            onChange={this.updateAnswerMsg}
            disabled={this.props.presentationMode}
            data-isvisible={
              this.props.index + 1 <= this.props.countVisible ? true : false
            }
          />
          <InputGroup.Append
            className={
              'answer-controls ' +
              (!this.state.answer.isInserted ? 'hidden' : '')
            }
          >
            <Button
              variant="outline-secondary"
              onClick={() => this.moveAnswerUpwards(this.props.index)}
              disabled={this.props.index + 1 === 1 ? true : false}
            >
              <i className="fas fa-arrow-up"></i>
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => this.moveAnswerDownwards(this.props.index)}
              disabled={this.props.isLast}
            >
              <i className="fas fa-arrow-down"></i>
            </Button>
            <Button
              className={this.props.presentationMode ? 'hidden' : ''}
              variant="outline-secondary"
              onClick={() => this.deleteAnswer(this.state.answer.id)}
            >
              <i className="far fa-trash-alt"></i>
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  questions: state.questions,
});

export default connect(mapStateToProps)(AnswerComponent);
