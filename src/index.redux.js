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