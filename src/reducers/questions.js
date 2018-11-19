const questions = (state = [], action) => {
  let tmpState = null;
  switch (action.type) {
    case 'ADD_QUESTION':
      action.question.id = action.id;
      return [action.question, ...state];
    case 'MOVE_QUESTION_UPWARDS':
      tmpState = state.slice();
      tmpState.move(action.index, action.index-1);
      return tmpState;
    case 'MOVE_QUESTION_DOWNWARDS':
      tmpState = state.slice();
      tmpState.move(action.index, action.index+1);
      return tmpState;
    case 'DELETE_QUESTION':
      return [...state].filter(question =>
        question.id !== action.id
      );
    case 'UPDATE_QUESTION':
      return [...state].map(question => {
        if ( question.id === action.question.id ) {
          return action.question;
        }
        return question;
      });
    case 'ADD_ANSWER':
      action.answer.id = action.id;
      return [...state].map(question => {
        if ( question.id === action.questionId ) {
          action.answer.questionId = question.id;
          question.answers.unshift(action.answer);
        }
        return question;
      });
    case 'UPDATE_ANSWER':
      return [...state].map(question => {
        if ( question.id === action.awnser.questionId ) {
          return action.question;
        }
        return question;
      });
    case 'DELETE_ANSWER':
      return [...state].map(question => {
        if ( question.id === action.answer.questionId ) {
          question.answers = [...question.answers].filter(answer => 
            answer.id !== action.answer.id
          )
        }
        return question;
      });
    case 'MOVE_ANSWER_UPWARDS':
      [...state].map(question => {
        if ( question.id === action.answer.questionId ) {
          question.answers.move(action.index, action.index-1);
        }
        return question;
      })
      return state;
    case 'MOVE_ANSWER_DOWNWARDS':
      [...state].map(question => {
        if ( question.id === action.answer.questionId ) {
          question.answers.move(action.index, action.index+1);
        }
        return question;
      })
      return state;
     case 'SET_ANSWER_VISIBILITY':
      return [...state].map(question => {
        if ( question.id === action.question.id ) {
          question.answers.map((answer,index) => {
            if ( question.limitAnswers.enabled && index+1 > question.limitAnswers.atLeast && index+1 > question.limitAnswers.noMoreThan ) {
              answer.visible = false;
            }
            else {
              answer.visible = true;
            }
            return answer;
          })
        }
        return question;
      })
    default:
      return state;
  }
}

export default questions