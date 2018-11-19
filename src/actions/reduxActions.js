let nextQuestionId = 0;
let nextAnswerId = 0;
export const addQuestion = question => ({
  type: 'ADD_QUESTION',
  id: nextQuestionId++,
  question
})

export const deleteQuestion = questionId => ({
  type: 'DELETE_QUESTION',
  id: questionId
})

export const moveQuestionUpwards = questionIndex => ({
  type: 'MOVE_QUESTION_UPWARDS',
  index: questionIndex
})

export const moveQuestionDownwards = questionIndex => ({
  type: 'MOVE_QUESTION_DOWNWARDS',
  index: questionIndex
})

export const updateQuestion = question => ({
  type: 'UPDATE_QUESTION',
  question
})

export const addAnswer = (answer, questionId) => ({
  type: 'ADD_ANSWER',
  questionId: questionId,
  id: nextAnswerId++,
  answer
})

export const updateAnswer = answer => ({
  type: 'UPDDATE_ANSWER',
  answer
})

export const deleteAnswer = answer => ({
  type: 'DELETE_ANSWER',
  answer
})

export const moveAnswerUpwards = (answerIndex, answer) => ({
  type: 'MOVE_ANSWER_UPWARDS',
  index: answerIndex,
  answer: answer
})

export const moveAnswerDownwards = (answerIndex, answer) => ({
  type: 'MOVE_ANSWER_DOWNWARDS',
  index: answerIndex,
  answer: answer
})

export const setAnswerVisibility = (question) => ({
  type: 'SET_ANSWER_VISIBILITY',
  question: question
})