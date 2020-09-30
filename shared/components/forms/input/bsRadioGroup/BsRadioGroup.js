import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class BsRadioGroup extends Component {
	constructor(props) {
		super(props);
	}
	 
	render() {
		let hintLabelId = this.props.name + "_hint";
		return (
			<div className="form-group">
				<label className="label-embedded">{this.props.label}</label>
				<div className="form-control" >
					{this.props.options.map((option, index) => {
						return <div className="form-check form-check-inline" key={index}>
								<input className="form-check-input" type="radio" name={this.props.name+"_op"+index} id={this.props.name+"_op"+index} 
									checked={option.tester
										? option.tester(this.props.value)
										: this.props.value===option.value} 
									onChange={(e) => {this.props.onChange(option.value)}} />
								<label className="form-check-label" htmlFor={this.props.name+"_op"+index}>{option.label}</label>
							</div>;
					})}
					{this.props.children}
				</div>
				{this.props.hintLabel && <small id={this.props.name + "_hint"} className="form-text text-muted">{this.props.hintLabel}</small>}
			</div>
		);
	}
}

BsRadioGroup.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.bool,
		PropTypes.array
	]),
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	hintLabel: PropTypes.string,
	name: PropTypes.string.isRequired
};

export default BsRadioGroup; 
