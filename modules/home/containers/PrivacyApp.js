import React, { Component } from 'react'
import CommonAppEnvelope from './CommonAppEnvelope';
import MailService from 'shared/services/common/MailService';
import SensibleData from 'SensibleData.json';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.renderContentSection=this.renderContentSection.bind(this);
	}

	render() {
		return <CommonAppEnvelope renderContentSection={this.renderContentSection} />
	}

	renderContentSection() {
		let content = this.getPrivacyInfo();
		return (
			<div>
				<section className="content-section content-section-1 odd-section"> 
					<div className="container">
						<div className="row">
							<div className="col-12">
								<h1>Política de privacidad</h1>
								{content}
							</div>
						</div>
					</div>
				</section>
			</div>
			);
	}

	getPrivacyInfo() {
		return <section>
			<h3>Política de privacidad MarketingItPlatform</h3>
			<p>Para MarketingItPlatform,  la protección de su datos personales es una prioridad. MarketingItPlatform manifiesta su respeto y cumplimiento con la legislación vigente en materia de protección de datos, así la presente política de privacidad tiene como objetivo proporcionar la máxima transparencia sobre el tratamiento de sus datos personales por parte de MarketingItPlatform .</p>

			<button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseS2" aria-expanded="false" aria-controls="collapseS2">Datos personales y prestación de servicios</button>
			<br/>
			<div className="collapse" id="collapseS2">
				<div className="card card-body">
					<p>Cuando usted solicita uno de nuestros productos y/o servicios, MarketingItPlatform únicamente requiere la información esencial para poder proporcionar dichos productos y/o servicios y para poder emitir las facturas correspondientes. En la mayoría de los casos se solicita el nombre, el NIF, la dirección, los datos de contacto (email y teléfono) y los datos de pago.</p>
					<h4>1. Datos contractuales y de facturación </h4>
					<p><b>Antes de solicitar un producto y/o servicio</b><br /> En la página web de MarketingItPlatform ofrecemos servicios destinados a nuestros clientes actuales y a clientes potenciales. Para conseguir el mejor resultado y continuar mejorando nuestros servicios, sus datos de navegación son guardados anónimamente.</p>
					<p><b>Al solicitar un producto y/o servicio y formalizar un contrato </b><br /> Al realizar un pedido de nuestros productos y/o servicios, solicitamos los datos necesarios para la prestación de los productos y/o servicios requeridos.  Sus datos se almacenan de forma segura en nuestros sistemas y usted puede acceder a sus datos en nuestro panel de control, así como solicitar un cambio de los mismos. La información sobre cómo acceder al panel de control se envía por correo electrónico o, en casos excepcionales, puede enviarse por correo postal.</p>
					<p><b>Facturación</b><br /> Para poder facturar los productos y/o servicios correctamente, en algunos casos, es necesario guardar temporalmente ciertos datos de uso de nuestros recursos. Por ejemplo datos sobre la configuración del Servidor Cloud o datos sobre el rendimiento de nuestros servicios de hosting. En la presente política de privacidad, encontrará más información específica sobre los distintos productos y/o servicios y sobre el almacenamiento de algunos datos de uso para la emisión correcta de nuestras facturas.</p>
					<h4>2. Datos de uso y datos sobre el contenido</h4>
					<p><b>Datos de uso </b><br /> Nuestro objetivo es prestar nuestros productos y/o servicios con la máxima calidad y fiabilidad pero, en ocasiones puntuales, pueden surgir incidencias técnicas. Para poder solucionar dichas incidencias lo más rápidamente posible, en algunos supuestos, es necesario registrar temporalmente algunos datos de uso y tráfico para proporcionarlos a nuestros técnicos del departamento de atención al cliente. Esto nos permite cumplir con nuestras obligaciones hacia usted y diseñar productos y/o servicios en función de sus necesidades.</p>
					<p><b>Datos sobre el contenido </b><br /> En ciertos servicios, por ejemplo, cuentas de correo electrónico, es posible almacenar archivos personales. Estos archivos se encriptan automáticamente y sólo pueden ser vistos por personas con derechos de acceso. Con el fin de proteger sus datos y con fines de mantenimiento, creamos y archivamos copias de seguridad cifradas. El contenido del archivo de estas copias de seguridad no puede ser descifrado ni visualizado por MarketingItPlatform.</p>
					<h4>3. Utilización de sus datos </h4>
					<p><b>Utilización de sus datos personales</b><br /> Necesitamos algunos datos personales de nuestros clientes para tramitar sus pedidos y para proporcionar servicios orientados a nuestros clientes.</p>
					<p><b>Datos de uso al utilizar nuestros productos y/o servicios </b><br /> Algunos datos son registrados durante la utilización de nuestros productos y servicios para permitirnos identificar incidencias técnicas y mejorar continuamente sus prestaciones. Con el fin de garantizar la seguridad de sus datos personales, dichos datos son tratados anónimamente o pseudónimamente.</p>
					<p><b>Encuestas </b><br /> Su opinión es muy importante para nosotros, para poder ofrecerle los mejores productos y servicios. Por lo tanto, en ocasiones, enviamos encuestas a nuestros clientes a través de correo electrónico o a través de formularios de nuestra página web. La participación en estas encuestas es opcional y usted puede revocar su consentimiento para recibir encuestas mediante petición por correo electrónico a {MailService.hiddenMail(SensibleData.enterprise.reclamationEmail)}</p>
					<h4>4. Cesión de datos a terceros </h4>
					<p><b>Entidades subcontratadas (terceros) </b><br /> MarketingItPlatform trabaja con entidades subcontratadas (terceros que actúan como proveedores de MarketingItPlatform) para ofrecerle una amplia gama de productos. Incluso, en algunos  productos y/o servicios, MarketingItPlatform actúa como intermediario, para lo cual es necesario ceder ciertos datos personales a terceros, por ejemplo, el registro de nombres de dominio o la emisión de certificados SSL.</p>
					<p><b>Cumplimiento de la Ley </b><br /> Ocasionalmente, estamos obligados a revelar datos personales a las autoridades y/o a los tribunales de justicia en cumplimiento de un requerimiento formal según la legislación vigente. En todo caso, MarketingItPlatform siempre solicitará la documentación correcta a las autoridades pertinentes antes de revelar cualquier información.
					</p>
				</div>
			</div>
			<br/>
			<br/>

			<button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseS2" aria-expanded="false" aria-controls="collapseS2">Cookies</button>
			<br/>
			<div className="collapse" id="collapseS2">
				<div className="card card-body">
					<p>Toda la información relevante sobre el uso de cookies está recogida en nuestra <a href="https://marketingitplatform.com/cookies-usage" target="_blank">Política de Cookies</a></p>
				</div>
			</div>
			<br/>
			<br/>

			<h4>Autoridad de control </h4>
			<p>Si desea plantear una reclamación en relación al tratamiento de sus datos por parte de MarketingItPlatform, le informamos que puede ponerse en contacto con la Agencia Española de Protección de datos, C/ Jorge Juan, 6 28001-Madrid <a href="http://www.agpd.es" target="_blank">http://www.agpd.es</a></p>
		</section>;
	}
}


