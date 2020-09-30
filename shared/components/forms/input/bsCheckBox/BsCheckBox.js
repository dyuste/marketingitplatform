import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class BsCheckBox extends Component {
	constructor(props) {
		super(props);
	}
	 
	render() {
		return (
			<div className="form-check">
				<input type="checkbox" className="form-check-input" name={this.props.name} id={this.props.name} checked={this.props.checked} onChange={() => this.props.onChange(!this.props.checked)} />
				<label className="form-check-label" htmlFor={this.props.name}>{this.props.label}</label>
			</div>
		);
	}
}

BsCheckBox.propTypes = {
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
};

export default BsCheckBox; 
