/*Question Interface*/
class Question {
	id = '';
	prompt = '';
	limitAnswers = {
		enabled: false,
		atLeast: '0',
		noMoreThan: '5'
	}
	answers = [];
}

export default Question;