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