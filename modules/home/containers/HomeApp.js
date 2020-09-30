import React, { Component } from 'react';
import ProductMicrositeCard from 'shared/components/products/ProductMicrositeCard';
import ProductLandingCard from 'shared/components/products/ProductLandingCard';
import CommonAppEnvelope from './CommonAppEnvelope';
import MailService from 'shared/services/common/MailService';
import SensibleData from 'SensibleData.json';
import './Home.scss';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <CommonAppEnvelope renderContentSection={this.renderContentSection} />
	}

	renderContentSection() {
		let tradeMark = <b>MarketingItPlatform</b>;
		return (
			<div className="home">
				<section className="content-section content-section-0"> 
					<div className="container">
						<div className="row">
							<div className="col-12 col-md-8 col-lg-6">
								<div className="row">
									<div className="col-12">
										<h1>Soluciones IT para profesionales del marketing</h1>
									</div>
									<div className="col-12 text-center text-md-left mt-4">
										<a href="/account/signup"><button className="btn btn-cta">Crea tu cuenta ahora</button></a>
									</div>
									<h4>Prueba gratis nuestros servicios</h4>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="content-section content-section-1 even-section"> 
					<div className="container">
						<div className="row">
							<div className="col-md-4 d-none d-md-block"></div>
							<div className="col-12 col-md-8">
								<h2>{tradeMark} se ocupa de la informática</h2>
								<p>¿Sabes cuáles son las necesidades de la agencia? No necesitas más. Crea y administra landings y microsites sin conocimientos de informática.</p>
								<p>Utiliza nuestro backend para gestionar inscripciones a eventos y comunicaciones.</p>
								<p>Paga solo mientras tus campañas están activas.</p>
							</div>
						</div>
					</div>
				</section>
				<section className="content-section content-section-2 odd-section"> 
					<div className="container">
						<div className="row">
							<div className="col-12">
								<h2>Planes a tu medida</h2>								
								<p>Intentamos ofrecer planes a la medida de las necesidades de cada agencia. Somos personas a tu disposición, nuestros planes se adaptan a tus necesidades. No dudes en contactarnos {MailService.hiddenMail(SensibleData.enterprise.clientAssistanceEmail, "aquí")}. Estos son nuestros servicios:</p>

								<div className="card-group">
									<ProductMicrositeCard
										ctaLabel="Pruébalo gratis"
										ctaHref="/account/signup"
									/>
									<ProductLandingCard
										ctaLabel="Próximamente"
										ctaDisabled={true}
									/>
								</div>
								<br />
								<p>Creemos en el valor de la fidelidad. Nuestros clientes consolidados son nuestro mayor valor.</p>
								<h4>¿Te apuntas a crecer con nosotros?</h4>
							</div>
						</div>
					</div>
				</section>
			</div>
			);
	}
}


