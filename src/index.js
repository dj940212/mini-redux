import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { createStore, applyMiddleware } from './mini-redux/mini-redux'
import { Provider } from './mini-redux/mini-react-redux'
import { counter } from './index.redux'
import thunk from './mini-redux/mini-redux-thunk'
import arrThunk from './mini-redux/mini-redux-arrThunk'

const store = createStore(counter, applyMiddleware(thunk, arrThunk))

function listener(){
    const current = store.getState()
    console.log(`现在数值:${current}`)
}
// 订阅，每次state修改，都会执行listener
store.subscribe(listener)

ReactDOM.render(
	(<Provider store={store}><App/></Provider>), 
	document.getElementById('root')
)

// function render() {
// 	ReactDOM.render(<App store={store} />, document.getElementById('root'));
// }
// render()

// store.subscribe(render)
