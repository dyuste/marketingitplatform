import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class BsPasswordField extends Component {
	constructor(props) {
		super(props);
	}
	 
	render() {
		let hintLabelId = this.props.name + "_hint";
		return (
			<div className="form-group">
				<label className="label-embedded" htmlFor={this.props.name}>{this.props.label}</label>
				<input type="password" className="form-control" aria-describedby={this.props.name + "_hint"} name={this.props.name} id={this.props.name} value={this.props.value} onChange={(e) => this.props.onChange(e.target.value)} disabled={!!this.props.disabled}/>
				{this.props.hintLabel && <small id={this.props.name + "_hint"} className="form-text text-muted">{this.props.hintLabel}</small>}
			</div>
		);
	}
}

BsPasswordField.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	hintLabel: PropTypes.string,
	name: PropTypes.string.isRequired,
	disabled: PropTypes.bool
};
