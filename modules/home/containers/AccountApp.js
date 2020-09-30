import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CommonAppEnvelope from './CommonAppEnvelope';
import CommonForm from './CommonForm';
import './Account.scss';

export class App extends Component {
	constructor(props) {
		super(props);
		this.renderContentSection = this.renderContentSection.bind(this);
	}

	render() {
		return <CommonAppEnvelope renderContentSection={this.renderContentSection} />
	}

	renderContentSection() {
		let action = this.props.action;
		let redirectUrl = this.props.redirectUrl;
		let queryString = redirectUrl ? ("?"+redirectUrl) : "";
		return (
			<div className="account">
				<section className="content-section content-section-0"> 
						<div className="container">
							<div className="row">
								<div className="col-12 col-md-8 col-lg-6">
									<div className="card">
										<div className="card-header">
											<ul className="nav nav-tabs card-header-tabs">
												<li className="nav-item">
													{(action != "login") && <a className="nav-link" href={"/account/login"+queryString}>Iniciar sesión</a>}
													{(action == "login") && <a className="nav-link active" href="#">Iniciar sesión</a>}
												</li>
												<li className="nav-item">
													{(action == "login") && <a className="nav-link" href={"/account/signup"+queryString}>Crear una cuenta</a>}
													{(action != "login") && <a className="nav-link active" href="#">Crear una cuenta</a>}
												</li>
											</ul>
										</div>
										<div className="card-body">
											{this.props.developmentMode && <CommonForm />}
											{!this.props.developmentMode && <div style={{color: "#555"}}>
												<p>Disponible próximamente</p>
												<span><i>Estamos ultimando detalles para nuestra apertura al público</i></span>
											</div>}
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
			</div>
			);
	}
}

App.propTypes = {
	action: PropTypes.string,
	redirectUrl: PropTypes.string,
	developmentMode: PropTypes.number
}

const mapStateToProps = (state, ownProps) => ({
	action: state.action,
	redirectUrl: state.redirectUrl,
	developmentMode: state.developmentMode
});


const AppContainer = connect(	
	mapStateToProps
)(App);

export default AppContainer; 
