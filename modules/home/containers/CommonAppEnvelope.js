import 'shared/assets/scss/StyleSetup.scss';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import AccountHeader from 'shared/components/headers/accountHeader/AccountHeader';
import PlatformFooter from 'shared/components/footers/platformFooter/PlatformFooter';
import CookiesPrompt from 'shared/components/cookies/CookiesPrompt';
import './App.scss'

export class CommonAppEnvelope extends Component {
	constructor(props) {
		super(props);
		this.dismissUpdateMessage = this.dismissUpdateMessage.bind(this);
		this.state = {
			update: {
				previousMessage: null,
				message: null
			}
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (props.ajaxMessage != state.update.previousMessage) {
			let newState = Object.assign({}, state);
			newState.update.previousMessage = props.ajaxMessage;
			newState.update.message = props.ajaxMessage;
			return newState;
		}
		return null;
	}

	render() {
		return (
			<div className="inner-page-container">
				<AccountHeader />
				<div style={{width: "100%", height: "64px" }}></div>
				{this.state.update.message && <div className="modal fade show" role="dialog" style={{display: 'block'} } >
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" onClick={this.dismissUpdateMessage}>&times;</button>
							</div>
							<div className="modal-body">
								{this.state.update.message}
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.dismissUpdateMessage}>Entendido</button>
							</div>
						</div>
					</div>
				</div>}
				{this.props.renderContentSection()}
				<PlatformFooter />
				<CookiesPrompt />
			</div>
			);
	}

	dismissUpdateMessage() {
		this.setState({update:{message: null, previousMessage:this.state.update.previousMessage}});
	}
}

CommonAppEnvelope.propTypes = {
	ajaxMessage: PropTypes.string,
	renderContentSection: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
	ajaxMessage: state.ajax.message
});


const AppContainer = connect(	
	mapStateToProps
)(CommonAppEnvelope);

export default AppContainer; 
