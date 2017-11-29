// 创建store
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

// 包装action creator
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
	// return Object.keys(creators).reduce((ret,item)=>{
	// 	ret[item] = bindActionCreator(creators[item],dispatch)
	// 	return ret
	// },{})
}