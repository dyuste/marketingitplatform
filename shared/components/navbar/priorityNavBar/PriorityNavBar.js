import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PriorityNavBar.scss';

export default class PriorityNavBar extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <nav className="priority-menu" id="menu">
				<ul id="menu-closed">
					{
						this.props.items.map((item, i) => {
							return <li key={i}>
								<a href="#"
									className={(item.disabled? "disabled " :"") + ((this.props.selectedItemName && this.props.selectedItemName == item.name) ? "selected" : "")}
									data-name={item.name}
									onClick={(e) => {if (this.props.onClickItem  && !item.disabled) this.props.onClickItem(e.target.getAttribute('data-name'));}} >										
										{item.label}
								</a>
							</li>;
						})
					}
					<li><a href="#menu-closed">&#215;</a></li>
					<li><a href="#menu">&#9776;</a></li>
				</ul>
			</nav>;
	}
}

PriorityNavBar.propTypes = {
	items: PropTypes.array.isRequired,
	selectedItemName: PropTypes.string,
	onClickItem: PropTypes.func
};
