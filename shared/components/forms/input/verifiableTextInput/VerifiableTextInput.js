import React, { Component } from 'react'
import PropTypes from 'prop-types'

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export class VerifiableTextInput extends Component {
	constructor(props) {
		super(props);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			value: props.initialValue,
			modified: false,
			verifying: false,
			valid: false
		};
	}
	
	triggerInvalidation() {
		this.rescheduleValidation(this.state.value);
	}

	componentWillMount() {
		this.timer = null;
		this.abortSignal = null;
	}

	handleChange(e) {
		this.setState({value: e.target.value});
	}

	onKeyUp(e) {
		if (e.keyCode != ENTER_KEY) {
			this.rescheduleValidation(e.target.value);
		}
	}

	onKeyDown(e) {
		if (e.keyCode === ENTER_KEY) {
			e.preventDefault();
			this.rescheduleValidation(e.target.value);
		}
	}

	rescheduleValidation(string) {
		clearTimeout(this.timer);
		if (this.abortSignal) this.abortSignal.abort();
		if (this.props.onWrongInput) {
			this.props.onWrongInput(this.state.value);
		}
		this.setState({modified: true, verifying: true});

		this.timer = setTimeout(
			function() {
				var validationPromise = null;
				({
					promise: validationPromise, 
					signal: this.abortSignal
				 } = this.props.validatorAbortable(this.state.value));
				validationPromise.then(result => {
					let valid = result.data && result.data.valid;
					this.setState({verifying: false, valid});
					if (valid) {
						this.props.onValidInput(this.state.value);
					} else if (this.props.onWrongInput) {
						this.props.onWrongInput(this.state.value);
					}
				});
			}.bind(this), 
			WAIT_INTERVAL
		);
	}
 
	render() {
		let validationClass = 
			this.state.verifying
				? "verifying-content"
				: (this.state.modified
					? (this.state.valid
						? "valid-content"
						: "is-invalid")
					: "no-content");
		let validationText =
			!this.state.verifying && this.state.modified && !this.state.valid
						? (
							this.props.notVerifiedMessage 
							? this.props.notVerifiedMessage
							: "Este contenido no es válido"
						  )
						: "";
		return (
			<div className="form-group">
				<label className="label-embedded" htmlFor={this.props.name}>{this.props.label}</label>
				<input type="text" 
					className="form-control {validationClass}"
					aria-describedby={this.props.name + "_hint"}
					name={this.props.name}
					id={this.props.name}
					value={this.state.value} 
					onKeyUp={this.onKeyUp} 
					onKeyDown={this.onKeyDown}
					onChange={this.handleChange} />
				{this.props.hintLabel && <small id={this.props.name + "_hint"} className="form-text text-muted">{this.props.hintLabel}</small>}
				{validationText && <small className="text-danger">{validationText}</small>}
			</div>
		);
	}
}

VerifiableTextInput.propTypes = {
	name: PropTypes.string.isRequired,
	initialValue: PropTypes.string,
	notVerifiedMessage: PropTypes.string,
	validatorAbortable: PropTypes.func.isRequired,
	onValidInput: PropTypes.func.isRequired,
	onWrongInput: PropTypes.func,
	label: PropTypes.string.isRequired,
	hintLabel: PropTypes.string
};

export default VerifiableTextInput; 
