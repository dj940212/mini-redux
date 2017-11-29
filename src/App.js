import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from './mini-redux/mini-react-redux'
import {add, remove, addAsync, addTwice} from './index.redux'


// 装饰器模式
// @connect(
//     state=>({ num: state}), {add, remove} 
// )
class App extends Component {
    render() {
        // const store = this.props.store
        // const num = store.getState()
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Mini Redux</h1>
                    <p>从零开始, 实现了redux,react-redux,react-thunk中间件等基础功能</p>
                </header>
                <p className="num">now num is {this.props.num}</p>
                <button onClick={this.props.add}>Add</button>
                <button onClick={this.props.remove}>Remove</button>
                <button onClick={this.props.addAsync}>AddAsync</button>
                <button onClick={this.props.addTwice}>addTwice</button>

            </div>
        );
    }
}

App = connect(state => ({num: state}), {add, remove, addAsync, addTwice})(App)

export default App;
