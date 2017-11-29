## 目录

- [前言](#%E5%89%8D%E8%A8%80)
- [初始化项目](#%E5%88%9D%E5%A7%8B%E5%8C%96%E9%A1%B9%E7%9B%AE)
    - [1.全局安装脚手架](#1%E5%85%A8%E5%B1%80%E5%AE%89%E8%A3%85%E8%84%9A%E6%89%8B%E6%9E%B6)
    - [2.创建项目](#2%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE)
    - [3.项目目录](#3%E9%A1%B9%E7%9B%AE%E7%9B%AE%E5%BD%95)
- [实现Redux基础功能](#%E5%AE%9E%E7%8E%B0redux%E5%9F%BA%E7%A1%80%E5%8A%9F%E8%83%BD)
    - [1.实现Redux](#1%E5%AE%9E%E7%8E%B0redux)
    - [2.结合React使用](#2%E7%BB%93%E5%90%88react%E4%BD%BF%E7%94%A8)
- [实现React-Redux](#%E5%AE%9E%E7%8E%B0react-redux)
    - [1.context](#1context)
    - [2.react-readux](#2react-readux)
      - [实现Provider](#%E5%AE%9E%E7%8E%B0provider)
      - [实现connect](#%E5%AE%9E%E7%8E%B0connect)
- [实现redux中间件机制](#%E5%AE%9E%E7%8E%B0redux%E4%B8%AD%E9%97%B4%E4%BB%B6%E6%9C%BA%E5%88%B6)
    - [实现applyMiddleware](#%E5%AE%9E%E7%8E%B0applymiddleware)
    - [实现redux中间件](#%E5%AE%9E%E7%8E%B0redux%E4%B8%AD%E9%97%B4%E4%BB%B6)
    - [添加多个中间件处理](#%E6%B7%BB%E5%8A%A0%E5%A4%9A%E4%B8%AA%E4%B8%AD%E9%97%B4%E4%BB%B6%E5%A4%84%E7%90%86)

## 前言

`Redux`作为`React`的状态管理工具, 在开发大型应用时已不可缺少, 为了更深入的了解`Redux`的整个实现机制, 决定从头开始, 实现实现一个具有基础功能的`Redux`

[项目地址](https://github.com/dj940212/mini-redux)

[预览](http://dj940212.github.io/mini-redux)

## 初始化项目

##### 1.全局安装脚手架

```
npm install -g create-react-app
```

##### 2.创建项目

```
create-react-app mini-redux
```

##### 3.项目目录

```
mini-react
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   └── favicon.ico
│   └── index.html
│   └── manifest.json
└── src
    └── App.css
    └── App.js
    └── App.test.js
    └── index.css
    └── index.js
    └── logo.svg
    └── registerServiceWorker.js
```
## 实现Redux基础功能

#### 1.实现Redux

新建`~/src/mini-redux/mini-redux.js`, `redux`会对外暴露一个`createStore`的方法,接受`reducer`作为参数

```js
export function createStore(reducer) {
  let currentState = {}
  let currentListeners = []

  function getState() {
    return currentState
  }
  function subscribe(listener) {
    currentListeners.push(listener)
  }
  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(v => v())
    return action
  }
  dispatch({type: '@REACT_FIRST_ACTION'})  //初始化state
  return { getState, subscribe, dispatch}
}
```

以上, 我们就已经实现了`redux`的基础功能, 下面来调用我们实现的`mini-redux`, 检验是否达到预期. 新建`~/src/index.redux.js`

```js
import { createStore } from './mini-redux/mini-redux'

const ADD = 'ADD'
const REMOVE = 'REMOVE'

// reducer
export function counter(state=0, action) {
  switch (action.type) {
    case ADD:
        return state + 1
    case REMOVE:
        return state - 1
    default:
        return 10
  }
}

export function add() {
  return {type: 'ADD'}
}
export function remove() {
  return {type: 'REMOVE'}
}

const store = createStore(counter)
const init = store.getState()
console.log(`开始数值:${init}`)

function listener(){
  const current = store.getState()
  console.log(`现在数值:${current}`)
}
// 订阅，每次state修改，都会执行listener
store.subscribe(listener)
// 提交状态变更的申请
store.dispatch({ type: 'ADD' })
store.dispatch({ type: 'ADD' })
store.dispatch({ type: 'REMOVE' })
store.dispatch({ type: 'REMOVE' })
```

在`index.js`中引入以上文件以执行, 查看控制台,可以看到如下`log`信息

```js
开始数值:10       index.redux.js:27
现在数值:11       index.redux.js:31 
现在数值:12       index.redux.js:31 
现在数值:11       index.redux.js:31 
现在数值:10       index.redux.js:31 
```

至此,我们已经实现了`redux`的功能, 但是离我们的预期还差的很远, 因为我们需要结合`react`来使用

#### 2.结合React使用

下面将`mini-react`和`react`组件结合使用, 修改`index.redux.js`如下

```js
const ADD = 'ADD'
const REMOVE = 'REMOVE'

// reducer
export function counter(state=0, action) {
  switch (action.type) {
    case ADD:
        return state + 1
    case REMOVE:
        return state - 1
    default:
        return 10
  }
}

export function add() {
  return {type: 'ADD'}
}
export function remove() {
  return {type: 'REMOVE'}
}
```

`index.js`文件初始化`redux`

```jsx
import { createStore } from './mini-redux/mini-redux'
import { counter } from './index.redux'

// 初始化redux
const store = createStore(counter)

function render() {
  ReactDOM.render(<App store={store} />, document.getElementById('root'));
}
render()
// 每次修改状态,从新渲染页面
store.subscribe(render)
```

`App.js`文件中我们就可以调用`redux`啦

```jsx
import {add, remove} from './index.redux'

class App extends Component {
    render() {
        const store = this.props.store
        // 获取当前值
        const num = store.getState()
        return (
            <div className="App">
                <p>初始值为{num}</p>
                <button onClick={() => store.dispatch(add())}>Add</button>
                <button onClick={() => store.dispatch(remove())}>Remove</button>
            </div>
        );
    }
}

export default App;
```

![](http://ovs5x36k4.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-11-28%20%E4%B8%8B%E5%8D%883.53.19.png)

如上图, 我们就可以在`React`组件中修改`mini-redux`的状态了

## 实现React-Redux

上面我们已经,实现了`Redux`的功能,并且且可以和`React`结合使用了, 但是这种与`React`的链接的方式非常繁琐,高度耦合, 在日常开发中不会这样用, 我们会使用 `react-redux`库来连接`React`(如果不了解`react-redux`可以看看这篇[博客](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)), 下面我们就来实现一个简易的`react-redux`

#### 1.context

实现`react-redux`前, 我们要了解一下`react`的 `context`(不了解可以查看[文档](http://www.css88.com/react/docs/context.html)), `react-redux`的实现就利用了`context`机制. 下面通过一个例子,了解`context`的用法.

新建`~/src/mini-redux/context.test.js`

```jsx
import React from 'react'
import PropTypes from 'prop-types'
// context是全局的, 组件里声明, 所有子元素可以直接获取

class Sidebar extends React.Component {
  render(){
    return (
      <div>
        <p>Sidebar</p>
        <Navbar></Navbar>
      </div>
    )
  }
}

class Navbar extends React.Component {
  // 限制类型, 必须
  static contextTypes = {
    user: PropTypes.string
  }
  render() {
    console.log(this.context)
    return (
      <div>{this.context.user} Navbar</div>
    )
  }
}


class Page extends React.Component {
  // 限制类型, 必须
  static childContextTypes = {
    user: PropTypes.string
  }
  constructor(props){
    super(props)
    this.state = {user: 'Jack'}
  }
  getChildContext() {
    return this.state
  }
  render() {
    return (
      <div>
        <p>我是{this.state.user}</p>
        <Sidebar/>
      </div>
    )
  }
}

export default Page
```


#### 2.react-readux

`react-redux`中有两个是我们常用的组件, 分别是`connect`和`Provider`, `connect`用于组件获取`redux`里面的数据(`state`和`action`), `Provider`用于把`store`置于`context`, 让所有的子元素可以获取到`store`, 下面分别实现`connect`和`provider`

##### 实现Provider

新建`~/src/mini-redux/mini-react-redux`, 代码如下

```jsx
import React from 'react'
import PropTypes from 'prop-types'


// 把store放到context里, 所有的子元素可以直接取到store
export class Provider extends React.Component{
  // 限制数据类型
    static childContextTypes = {
    store: PropTypes.object
  }
  getChildContext(){
    return { store:this.store }
  }
  constructor(props, context){
    super(props, context)
    this.store = props.store
  }
  render(){
    // 返回所有子元素
    return this.props.children
  }
}
```

下面验证`Provider`是否能实现预期功能, 修改`~/src/index.js`文件如下

```jsx
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
```

最后我们还要修改`~/src/App.js`文件中获取`store`数据的方式, 改成使用`connect`获取, 但是因为还没有实现`connect`, 所有我们暂使用原`react-redux`的`connect`组件验证上面实现的`Provider`

```jsx
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {add, remove} from './index.redux'

class App extends Component {
    render() {
        return (
            <div className="App">
                <p>初始值为{this.props.num}</p>
                <button onClick={this.props.add}>Add</button>
                <button onClick={this.props.remove}>Remove</button>
            </div>
        );
    }
}

App = connect(state => ({num: state}), {add, remove})(App)

export default App;
```

 验证结果, 上面实现的`Provider`成功对接`connect`

##### 实现connect

上面我们实现了`Provider`, 但是`connect`仍然用的是原版`react-redux`的`connect`, 下面就来在`~/src/mini-redux/mini-react-redux.js`文件中添加一个`connect`方法

```jsx
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from './mini-redux'

// connect 负责链接组件，给到redux里的数据放到组件的属性里
// 1. 负责接受一个组件，把state里的一些数据放进去，返回一个组件
// 2. 数据变化的时候，能够通知组件

export const connect = (mapStateToProps = state=>state, mapDispatchToProps = {}) => (WrapComponent) => {
  return class ConnectComponent extends React.Component{
    static contextTypes = {
      store:PropTypes.object
    }
    constructor(props, context){
      super(props, context)
      this.state = {
        props:{}
      }
    }
    componentDidMount(){
      const {store} = this.context
      store.subscribe(()=>this.update())
      this.update()
    }
    update(){
      // 获取mapStateToProps和mapDispatchToProps 放入this.props里
      const {store} = this.context
      const stateProps = mapStateToProps(store.getState())
      // 方法不能直接给，因为需要dispatch
      const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
      this.setState({
        props:{
          ...this.state.props,
          ...stateProps,
          ...dispatchProps  
        }
      })
    }
    render(){
      return <WrapComponent {...this.state.props}></WrapComponent>
    }
  }
}
```

在上面代码中, 我们还需要在`mini-redux.js`中添加一个`bindActionCreators`方法, 用于使用`dispatch`包裹包裹`actionCreator`方法, 代码如下

```jsx
......
function bindActionCreator(creator, dispatch){
  return (...args) => dispatch(creator(...args))
}
export function bindActionCreators(creators,dispatch){
  let bound = {}
  Object.keys(creators).forEach(v=>{
    let creator = creators[v]
    bound[v] = bindActionCreator(creator, dispatch)
  })
  return bound
}
......
```

最后我们将`~/src/App.js`中的`connect`换成上面完成的`connect`, 完成测试

```js
import { connect } from './mini-redux/mini-react-redux'
```

## 实现redux中间件机制

#### 实现applyMiddleware

在平常使用`redux`时, 我们会利用各种中间件来扩展`redux`功能, 比如使用`redux-thunk`实现异步提交`action`, 现在来给我们的`mini-redux`添加中间件机制

修改`~/src/mini-redux/mini-redux.js`代码如下

```js
export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer)
  }
  
  let currentState = {}
  let currentListeners = []

  function getState() {
    return currentState
  }
  function subscribe(listener) {
    currentListeners.push(listener)
  }
  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(v => v())
    return action
  }
  //初始化state
  dispatch({type: '@REACT_FIRST_ACTION'})
  return { getState, subscribe, dispatch}
}

export function applyMiddleware(middleware) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    dispatch = middleware(midApi)(store.dispatch)

    return {
      ...store,
      dispatch
    }

  } 
}
......
```

以上我们就给`mini-redux`添加了中间件机制了, 下面我们就来使用中间件, 进行验证. 由于我们开没有自己的中间件, 现在使用`redux-thunk`来实现一个异步提交`action`

修改`~/src/index.js`

```jsx
......
import { createStore, applyMiddleware } from './mini-redux/mini-redux'
import thunk from 'redux-thunk'

const store = createStore(counter, applyMiddleware(thunk))
......
```

修改`~/src/index.redux.js`, 添加一个异步方法

```js
export function addAsync() {
    return dispatch => {
    setTimeout(() => {
        dispatch(add());
    }, 2000);
  };
}
```

最后我们要`~/src/App.js`中引入这个异步方法, 修改如下

```js
......
import React, { Component } from 'react';
import { connect } from './mini-redux/mini-react-redux'
import {add, remove, addAsync} from './index.redux'

class App extends Component {
    render() {
        return (
            <div className="App">
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
```

然后就可以验证啦

#### 实现redux中间件

上面我们使用了`redux-thunk`中间件, 为何不自己写一个呢

新建`~/src/mini-redux/mini-redux-thunk.js`

```js
const thunk = ({dispatch, getState}) => next => action => {
  // 如果是函数，执行一下，参数是dispatch和getState
  if (typeof action=='function') {
    return action(dispatch,getState)
  }
  // 默认，什么都没干，
  return next(action)
}
export default thunk
```

将`~/src/index.js`中的`thunk`换成上面实现的`thunk`, 看看程序是否还能正确运行

在上面的基础上, 我们再实现一个`arrThunk`中间件, 中间件提供提交一个`action`数组的功能

新建`~/src/mini-redux/mini-redux-arrayThunk.js`

```js
const arrayThunk = ({dispatch,getState})=>next=>action=>{
  if (Array.isArray(action)) {
    return action.forEach(v=>dispatch(v))
  }
  return next(action)
}
export default arrayThunk
```



#### 添加多个中间件处理

上面我们实现的中间件机制,只允许添加一个中间件, 这不能满足我们日常开发的需要

修改`~/src/mini-redux/mini-redux.js`文件

```js
......
// 接收中间件
export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const middlewareChain = middlewares.map(middleware=>middleware(midApi))
    dispatch = compose(...middlewareChain)(store.dispatch)

    return {
      ...store,
      dispatch
    }

  } 
}
// compose(fn1,fn2,fn3)  ==> fn1(fn2(fn3))
export function compose(...funcs){
  if (funcs.length==0) {
    return arg=>arg
  }
  if (funcs.length==1) {
    return funcs[0]
  }
  return funcs.reduce((ret,item)=> (...args)=>ret(item(...args)))
}
......
```

最后我们将之前实现的两个中间件`thunk`,`arrThunk`同时使用, 看看上面实现的多中间件合并是否完成

修改`~/src/index.js`

```js
...
import arrThunk from './mini-redux/mini-redux-arrThunk'
const store = createStore(counter, applyMiddleware(thunk, arrThunk))
...
```

在`~/src/index.redux.js`中添加一个`addTwice` action生成器

```js
...
export function addTwice() {
  return [{type: 'ADD'}, {type: 'ADD'}]
}
...
```

`~/src/App.js`中增加一个`addTwice`的按钮, 修改相应代码

```js
import {add, remove, addAsync, addTwice} from './index.redux'

class App extends Component {
    render() {
        return (
            <div className="App">
                <p>now num is {this.props.num}</p>
                <button onClick={this.props.add}>Add</button>
                <button onClick={this.props.remove}>Remove</button>
                <button onClick={this.props.addAsync}>AddAsync</button>
                <button onClick={this.props.addTwice}>addTwice</button>
            </div>
        );
    }
}

App = connect(state => ({num: state}), {add, remove, addAsync, addTwice})(App)
```

大功告成!

![](http://ovs5x36k4.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-11-29%20%E4%B8%8B%E5%8D%882.59.52.png)