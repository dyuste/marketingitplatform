import React, { Component } from 'react'
import PropTypes from 'prop-types'
import "./BsCurrencyField.scss"

export class BsCurrencyField extends Component {
	constructor(props) {
		super(props);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleOnBlur = this.handleOnBlur.bind(this);
		this.handleOnFocus = this.handleOnFocus.bind(this);
		this.state = { value: String(props.amount), valid: true };
	}

	handleOnChange(value) {
		value.replace(",", ".");
		let amount = parseFloat(value);
		if (isNaN(amount)) {
			this.props.onChange(null);
		} else {
			this.props.onChange(amount);
		}
		this.setState({value});
	}

	handleOnFocus() {
		this.setState({valid: true});
	}

	handleOnBlur() {
		let amount = parseFloat(this.state.value);
		if (isNaN(amount)) {
			this.setState({valid: false});
		} else {
			this.setState({value: String(amount)});
		}
	}

	render() {
		let hintLabelId = this.props.name + "_hint";
		return (
			<div className="form-group">
				<label className="label-embedded" htmlFor={this.props.name}>{this.props.label}</label>
				<input type="text"
					className={"form-control input-currency-euro"+(!this.state.valid?" border border-warning" : "")}
					aria-describedby={this.props.name + "_hint"} name={this.props.name} id={this.props.name}
					value={this.state.value}
					onChange={e => this.handleOnChange(e.target.value)}
					onBlur={this.handleOnBlur}
					onFocus={this.handleOnFocus}/>
				<span className="currency-symbol">€</span>
				{(this.props.hintLabel && this.state.valid) && <small id={this.props.name + "_hint"} className="form-text text-muted">{this.props.hintLabel}</small>}
				{(!this.state.valid) && <small id={this.props.name + "_hint"} className="form-text text-warning">Se espera un número con decimales separados por un punto (ej: 50.00)</small>}

			</div>
		);
	}
}

BsCurrencyField.propTypes = {
	amount: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	hintLabel: PropTypes.string,
	name: PropTypes.string.isRequired
};

export default BsCurrencyField; 
