import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/reducersIndex'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const store = createStore(rootReducer);

/*Extents Array prototype in order to include 'move' function.
 No arrow function used, because it creates a new 'this' context.*/
Array.prototype.move = function(from, to) {
	this.splice(to, 0, this.splice(from, 1)[0])
}

ReactDOM.render(
<Provider store={store}>
	<App />
</Provider>
,document.getElementById('root'));

serviceWorker.unregister();
