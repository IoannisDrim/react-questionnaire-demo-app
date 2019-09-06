import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionComponent from '../question/QuestionComponent.js';
import './QuestionsContainer.css';

class QuestionsContainer extends Component {
  /*Renders questions available or shows a 'Question Container is empty' message*/
  render() {
    return (
      <section className="questions-container">
        {this.props.questions.length > 0 ? (
          this.props.questions.map((question, index) => (
            <QuestionComponent
              key={question.id}
              isLast={index + 1 === this.props.questions.length ? true : false}
              index={index}
              data={question}
            />
          ))
        ) : (
          <div className="no-questions-display-msg">
            <p>
              Create a new question by clicking the 'Add New Question' button!
            </p>
          </div>
        )}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions
});

export default connect(mapStateToProps)(QuestionsContainer);
