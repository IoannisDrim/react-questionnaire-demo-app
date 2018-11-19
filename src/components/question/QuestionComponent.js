import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import MsgModal from '../msgModal/MsgModal.js';
import Question from '../../models/Question.js'
import Answer from '../../models/Answer.js'
import AnswerComponent from '../answer/AnswerComponent.js';
import { deleteQuestion, moveQuestionUpwards, moveQuestionDownwards, updateQuestion, addAnswer, setAnswerVisibility } from '../../actions/reduxActions';
import './QuestionComponent.css';

class QuestionComponent extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      'question' : new Question(),
      'disableAddAnswerBtn' : false,
      'modalShow': false
    };

    /*Use initErrors in order to clear previous errors before every check*/
    this.initErrors = {
      'exist': false,
      'limitToggler': {},
      'limitAtLeast': {},
      'limitNoMoreThan': {}
    }
    /*The following command, copies by value the initErrors.
    the '...' operator or the Object.asign() will not work
    because this.errors will become a nested object.*/
    this.errors = JSON.parse(JSON.stringify(this.initErrors));

    this.updateQuestionPrompt = this.updateQuestionPrompt.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.moveQuestionUpwards = this.moveQuestionUpwards.bind(this);
    this.moveQuestionDownwards = this.moveQuestionDownwards.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.enableAddAnswerBtn = this.enableAddAnswerBtn.bind(this);
    this.updateAnswerLimitations = this.updateAnswerLimitations.bind(this);
    this.setAnswerVisibility = this.setAnswerVisibility.bind(this);
    this.checkInputValidity = this.checkInputValidity.bind(this);
    this.checkIfAnswersAreEmpty = this.checkIfAnswersAreEmpty.bind(this);
    this.initializeLimiterSection = this.initializeLimiterSection.bind(this);
  }
  
  componentDidMount() {
    this.setState( {'question' : this.props.data} );
  }

  componentWillReceiveProps() {
    this.setState( {'question' : this.props.data} );
  }

  deleteQuestion(questionId) {
    this.props.dispatch(deleteQuestion(questionId));
  }

  moveQuestionUpwards(questionIndex) {
    this.props.dispatch(moveQuestionUpwards(questionIndex));
  }

  moveQuestionDownwards(questionIndex) {
    this.props.dispatch(moveQuestionDownwards(questionIndex));
  }

  updateQuestionPrompt(event) {
    let tmpQuestion = this.state.question;
    tmpQuestion.prompt = event.target.value;
    this.setState( {'question' : tmpQuestion} )
    this.props.dispatch(updateQuestion(this.state.question));
  }
  
  /*Makes validation on limmiter inputs*/
  checkInputValidity(event) {
    /*Erases previous errors*/
    this.errors = JSON.parse(JSON.stringify(this.initErrors));
    if ( !event.target.validity.valid ) {
      this.errors.exist = true;
      for( let key in event.target.validity ) {
        this.errors[event.target.name][key] = event.target.validity[key];
      }
    }
  }
  
  /*Handles user's actions on limiter inputs*/
  updateAnswerLimitations(event, caller) {
    let tmpQuestion = this.state.question;
    switch (event.target.name) {
      case 'limitToggler':
        tmpQuestion.limitAnswers.enabled = event.target.checked;
        break;
      case 'limitAtLeast':
        tmpQuestion.limitAnswers.atLeast = event.target.value;
        break;
      case 'limitNoMoreThan':
        tmpQuestion.limitAnswers.noMoreThan = event.target.value;
        break;
      default:
        return false;
    }
    this.setState( {'question' : tmpQuestion} );
    this.checkInputValidity(event);
    if ( !this.errors.exist ) {
      this.props.dispatch(updateQuestion(tmpQuestion));
      this.setAnswerVisibility();
    }
  }

  addAnswer() {
    this.setState( {'disableAddAnswerBtn' : true} );
    this.props.dispatch(addAnswer(new Answer(),this.state.question.id));
    this.setAnswerVisibility();
  }

  setAnswerVisibility() {
    this.props.dispatch(setAnswerVisibility(this.state.question));
  }

  /*Add answer button is disabled till new answer is succesfully inserted. Then it is enabled again*/
  enableAddAnswerBtn() {
    this.setState( {'disableAddAnswerBtn' : false} );
  }

  initializeLimiterSection() {
    let tmpQuestion = this.state.question;
    tmpQuestion.limitAnswers.enabled = false;
    tmpQuestion.limitAnswers.atLeast = '0';
    tmpQuestion.limitAnswers.noMoreThan = '5';
    this.setState( {'question' : tmpQuestion} );
  }

  /*If answers are empty, then question's limitter section must be initialized*/
  checkIfAnswersAreEmpty() {
    if ( this.state.question.answers.length === 0 ) {
      this.initializeLimiterSection();
    }
  }

  render() {
    let modalClose = () => this.setState({ 'modalShow': false });
    let modalMsg = {
      header: 'Answers available'
    }
    /*Fixes the template that will be loaded in 'Show all Answers' modal*/
    let bodyTemplate = <div>
      <h5>Select visible answers</h5>
      {this.state.question.answers.length > 0 ? (
          this.state.question.answers.map((answer, index) => {
            return <AnswerComponent  
                      key={answer.id} 
                      isLast={index+1 === this.state.question.answers.length? true : false} 
                      index={index} 
                      data={answer}
                      enableAddAnswerBtn={this.enableAddAnswerBtn}
                      class='show-all-answers'
                      presentationMode={true}
                      countVisible={this.state.question.limitAnswers.noMoreThan}
                      setAnswerVisibility={this.setAnswerVisibility}
                      checkIfAnswersAreEmpty={this.checkIfAnswersAreEmpty}
                    />
          })           
        ):(
          <p>No answers available.</p>
        )}
    </div>
    let showAnswers = () => this.setState({ modalShow: true });

    return (
      <div>
        <fieldset className='question'>
          <legend>Question {this.state.question.id+1}</legend>
          <section className='question-settings'>
            <Row>
              <Col xs={12}>
                <InputGroup>
                  <FormControl className='question-prompt-input' placeholder='Enter your question prompt...' value={this.state.question.prompt} onChange={this.updateQuestionPrompt}/>
                  <InputGroup.Append className='question-controlls'>
                    <Button variant='outline-secondary' onClick={() => this.moveQuestionUpwards(this.props.index)} disabled={this.props.index+1 === 1 ? true : false}><i className='fas fa-arrow-up'></i></Button>
                    <Button variant='outline-secondary' onClick={() => this.moveQuestionDownwards(this.props.index)} disabled={this.props.isLast}><i className='fas fa-arrow-down'></i></Button>
                    <Button variant='outline-secondary' onClick={() => this.deleteQuestion(this.state.question.id)}><i className='far fa-trash-alt'></i></Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Row>
            <Row className={'question-settings-limit ' + (!this.state.question.answers.filter(answer => answer.isInserted).length > 0 ? 'hidden' : '')}>
              <Col md={2} className='limit-selector'>
                <div>
                  <label className='chck-container'>
                    Limit Awnsers
                    <input
                      name='limitToggler'
                      type='checkbox' 
                      checked={this.state.question.limitAnswers.enabled} 
                      onChange={this.updateAnswerLimitations}  
                    />
                    <span className='checkmark'></span>
                  </label>
                </div>
              </Col>
              <Col md={9} className={'p-0 ' + (!this.state.question.limitAnswers.enabled ? 'hidden' : '')}>
                <div className='limitter-section'>
                  <InputGroup className='inpt-number-groub'>
                    <InputGroup.Prepend>
                      <InputGroup.Text>At Least</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl  name='limitAtLeast' 
                                  type='number'
                                  min='0'
                                  max={this.state.question.limitAnswers.noMoreThan}
                                  value={this.state.question.limitAnswers.atLeast} 
                                  onChange={this.updateAnswerLimitations}/>
                  </InputGroup>
                  <InputGroup className='inpt-number-groub'>
                    <InputGroup.Prepend>
                      <InputGroup.Text>No more than</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl  name='limitNoMoreThan'
                                  type='number'
                                  min={this.state.question.limitAnswers.atLeast}
                                  value={this.state.question.limitAnswers.noMoreThan} 
                                  onChange={this.updateAnswerLimitations}/>
                  </InputGroup>
                  <div className={!this.state.question.answers.filter(answer => !answer.visible).length > 0 ? 'hidden' : ''}>
                    <button name='showAllAnsersBtn' className='btn btn-primary' onClick={showAnswers}>Show all answers</button>
                  </div>
                </div>
                <div className={'error-msg limit-answer-error ' + (this.errors.exist? '':'hidden')}>
                  <span className={this.errors.limitAtLeast.rangeOverflow? '':'hidden'}><i className='fas fa-exclamation-circle'></i> 'At Least' value can't be greater than 'No more than' value</span>
                  <span className={this.errors.limitAtLeast.rangeUnderflow? '':'hidden'}><i className='fas fa-exclamation-circle'></i> 'At Least' value can't be less than 0</span>
                  <span className={this.errors.limitAtLeast.badInput? '':'hidden'}><i className='fas fa-exclamation-circle'></i> Invalid 'At Least' value</span>
                  <span className={this.errors.limitNoMoreThan.rangeUnderflow? '':'hidden'}><i className='fas fa-exclamation-circle'></i> 'No more than' value can't be lesser than 'At Least' value</span>
                  <span className={this.errors.limitNoMoreThan.badInput? '':'hidden'}><i className='fas fa-exclamation-circle'></i> Invalid 'No more than' value</span>
                </div>
              </Col>
            </Row>
          </section>
          <section className='question-answers'>
            <Row>
              <Col sm={12}>
                <h6 className={this.state.question.answers.length === 0 ? 'hidden':''}>Answers</h6>
                {this.state.question.answers.length > 0 ? (
                  this.state.question.answers.map((answer, index) => {
                    let visibleLength = this.state.question.answers.filter(ans => ans.visible).length;
                    if ( answer.visible ) {
                      return <AnswerComponent  
                                key={answer.id} 
                                isLast={index+1 === visibleLength? true : false} 
                                index={index} 
                                data={answer}
                                enableAddAnswerBtn={this.enableAddAnswerBtn}
                                setAnswerVisibility={this.setAnswerVisibility}
                                class={null}
                                presentationMode={false}
                                countVisible={visibleLength}
                                checkIfAnswersAreEmpty={this.checkIfAnswersAreEmpty}
                              />
                    }
                    return null;
                  })           
                ):(
                  <p className='no-answers-disaply-msg'>Create a new answer by clicking the 'Add a pontential answer' button!</p>
                )}
              </Col>
            </Row>
          </section>
          <section className='question-footer'>
            <Row>
              <Col>
                <Button variant='outline-dark' disabled={this.state.disableAddAnswerBtn} onClick={this.addAnswer}><i className='fas fa-plus'></i> Add a pontential answer</Button>
              </Col>
            </Row>
          </section>
        </fieldset>
        <MsgModal
          size='sm'
          show={this.state.modalShow}
          onHide={modalClose}
          header={modalMsg.header}
          bodyTemplate={bodyTemplate}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions
});

export default connect(mapStateToProps)(QuestionComponent);