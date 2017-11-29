import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { createStore } from './mini-redux/mini-redux'
import { Provider } from './mini-redux/mini-react-redux'
import { counter } from './index.redux'

const store = createStore(counter)

ReactDOM.render(
	(<Provider store={store}><App/></Provider>), 
	document.getElementById('root')
)

// function render() {
// 	ReactDOM.render(<App store={store} />, document.getElementById('root'));
// }
// render()

// store.subscribe(render)
