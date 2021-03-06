import React, { Component } from 'react'
import CommonAppEnvelope from './CommonAppEnvelope';
import MailService from 'shared/services/common/MailService';
import SensibleData from 'SensibleData.json';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <CommonAppEnvelope renderContentSection={this.renderContentSection} />
	}

	renderContentSection() {
		return (
			<section className="content-section content-section-1 odd-section"> 
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Atención al cliente</h1>
							<p>Para cualquier consulta puedes ponerte en contacto con nosotros a través de la dirección de correo electrónico {MailService.hiddenMail(SensibleData.enterprise.clientAssistanceEmail)}</p>
						</div>
					</div>
				</div>
			</section>
			);
	}
}


