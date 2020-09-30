import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProductMicrositeCard from 'shared/components/products/ProductMicrositeCard';
import ProductLandingCard from 'shared/components/products/ProductLandingCard';
import CommonAppEnvelope from './CommonAppEnvelope';
import MailService from 'shared/services/common/MailService';
import SensibleData from 'SensibleData.json';
import './Home.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.renderContentSection = this.renderContentSection.bind(this);
	}

	render() {
		return <CommonAppEnvelope renderContentSection={this.renderContentSection} />
	}

	componentDidMount() {
		let errorInfo = this.props.environmentData.errorInfo || "No error info available";
		console.log(errorInfo);
	}

	renderContentSection() {
		let tradeMark = <b>MarketingItPlatform</b>;
		return (
			<div className="home">
				<section className="content-section content-section-0"> 
					<div className="container">
						<div className="row">
							<div className="col-12 col-md-8 col-lg-6">
								<h3>{this.getTitle()}</h3>
								<p>{this.getDescription()}</p>
							</div>
						</div>
					</div>
				</section>
			</div>
			);
	}

	getTitle() {
		let errorCode = this.props.environmentData.errorCode || 500;
		switch(errorCode) {
			// TODO
			case 404:
				return "Página no encontrada";
			case 401:
			case 403:
				return "Acceso no autorizado";
			default:
				return "Estamos teniendo problemas técnicos";
		}
	}

	getDescription() {
		let errorCode = this.props.environmentData.errorCode || 500;
		switch(errorCode) {
			// TODO
			case 404:
				return "La página a la que intentas acceder no existe.";
			case 403:
				return "No tienes permisos suficientes para acceder a este contenido.";
			default:
				return "Lo sentimos. Prueba a intentarlo pasados unos minutos o ponte en contacto con nosotros.";
		}
	}
}

App.propTypes = {
	environmentData: PropTypes.object
}

const mapStateToProps = (state, ownProps) => ({
	environmentData: state.environmentData
});

const AppContainer = connect(	
	mapStateToProps
)(App);

export default AppContainer; 

