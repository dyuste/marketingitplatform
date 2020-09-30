import React, { Component } from 'react';
import PropTypes from 'prop-types'
import "./SideBar.scss"

export class SideBar extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <ul className="sidebar-nav">
			{
				this.props.items.map((item,i)=>{
						return <li key={i} 
							className={(item.name==this.props.activeItem ? "active " : "")+(item.indent ? ("indent_" + item.indent) : "")}>
							<a href={item.href} alt={item.title}>
								<span className={"oi " +(item.icon ? "oi-" + item.icon : "")} aria-hidden="true"></span>
								<span className="label">{item.title}</span>
							</a>
						</li>
					})
			}
		</ul>;
	}
}

SideBar.propTypes = {
	items: PropTypes.array.isRequired,
	activeItem: PropTypes.string
}

export default SideBar; 

