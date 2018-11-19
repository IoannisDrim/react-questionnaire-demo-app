import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import QuestionsContainer from './components/questionsContainer/QuestionsContainer.js'
import QuestionsAdder from './components/questionsAdder/QuestionsAdder.js'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <header>
          <h1><img src='./assets/questionMark.svg' alt='questionMarkLogo'/> Questionnair</h1>
        </header>
        <main>
          <Container>
            <div className='questions-dashboard'>
              <QuestionsAdder/>
              <QuestionsContainer/>
            </div>
          </Container>
        </main>
        <footer></footer>
      </div>
    );
  }
}

export default App;
