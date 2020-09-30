import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import BasicForm from 'shared/components/forms/basicForm/BasicForm';
import { actionStartRequest } from '../../../shared/components/forms/basicForm/Actions';

export class CommonForm extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <BasicForm formData={this.props.formData} onSubmit={this.props.onFormSubmit} />;
	}
}

CommonForm.propTypes = {
	formData: PropTypes.object,
	onFormSubmit: PropTypes.func
}

const mapStateToProps = (state, ownProps) => ({
	formData: state.formData
});

const mapDispatchToProps = dispatch => ({ 
	onFormSubmit: formData => dispatch(actionStartRequest(formData))
});

export default connect(	
	mapStateToProps,
	mapDispatchToProps
)(CommonForm);
