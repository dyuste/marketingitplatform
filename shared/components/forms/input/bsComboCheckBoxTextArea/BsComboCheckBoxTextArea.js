import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class BsComboCheckBoxTextArea extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.ReactQuill = typeof window !== "undefined" ? require('react-quill') : null;
	}
	 
	render() {
		let ReactQuill = this.ReactQuill;
		let hintLabelId = this.props.name + "_hint";

		return (
			<div className="form-group bs-comobo-check-box-text-field">
				<div className="form-control"> 
					<input type="checkbox" className="form-check-input" name={this.props.name} id={this.props.name} checked={this.props.checked} onChange={() => this.props.onCheckChange(!this.props.checked)} />
					<label className="form-check-label" htmlFor={this.props.name}>{this.props.label}</label>
					{!ReactQuill && <textarea 
						type="text" className="form-control" aria-describedby={this.props.name + "_hint"} name={this.props.name} id={this.props.name} value={this.props.text} onChange={(e) => this.props.onTextChange(e.target.value)} disabled={!this.props.checked}/>
					}
					
					{this.props.checked && ReactQuill && <ReactQuill value={this.props.text}
						onChange={this.props.onTextChange}
						readOnly={!this.props.checked} />}
				</div>
				{this.props.hintLabel && <small id={this.props.name + "_hint"} className="form-text text-muted">{this.props.hintLabel}</small>}
			</div>
		);
	}
}

BsComboCheckBoxTextArea.propTypes = {
	text: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
	onTextChange: PropTypes.func.isRequired,
	onCheckChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	hintLabel: PropTypes.string,
	name: PropTypes.string.isRequired
};

export default BsComboCheckBoxTextArea; 
