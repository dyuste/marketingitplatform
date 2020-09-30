import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class BsDropDown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}
	 
	render() {
		return (
			<div className={"dropdown" + (this.state.visible? " show" : "")}>
				<button className="btn btn-secondary dropdown-toggle" type="button"
					id={this.props.name+"dropdownMenuButton"}
					aria-haspopup="true"
					aria-expanded={this.state.visible? "true" : "false"}
					onClick={() => {this.setState({visible: !this.state.visble})}}
					>
					{this.props.value ? this.props.value : "Dominio"}
				</button>
  				<div className={"dropdown-menu" + (this.state.visible? " show" : "")} aria-labelledby={this.props.name+"dropdownMenuButton"}>
					{this.props.options.map((option, index) => {
						return <button 
								className="dropdown-item" type="button"
								onClick={(e) => {
									if (option.value != this.props.value) this.props.onChange(option.value)
									this.setState({visible: false})
								}}  key={index}>
								{option.label}
							</button>;
					})}
  				</div>
			</div>
		);
	}
}

BsDropDown.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.bool,
		PropTypes.array
	]),
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
};

export default BsDropDown; 
