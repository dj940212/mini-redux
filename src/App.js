import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from './mini-redux/mini-react-redux'
import {add, remove, addAsync} from './index.redux'


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
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Mini Redux</h1>
                </header>
                <p>初始值为{this.props.num}</p>
                <button onClick={this.props.add}>Add</button>
                <button onClick={this.props.remove}>Remove</button>
                <button onClick={this.props.addAsync}>AddAsync</button>
            </div>
        );
    }
}

App = connect(state => ({num: state}), {add, remove, addAsync})(App)

export default App;
