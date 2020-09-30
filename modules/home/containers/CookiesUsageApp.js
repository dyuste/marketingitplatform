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
		let content = this.getCookiesUsage();
		return (
			<section className="content-section content-section-1 odd-section"> 
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Uso de cookies</h1>
							{content}
						</div>
					</div>
				</div>
			</section>
			);
	}

	getCookiesUsage() {
		return <section>
			<button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseS1" aria-expanded="false" aria-controls="collapseS1">¿Qué son las cookies y por qué las utilizamos?</button>
			<br/>
			<div className="collapse" id="collapseS1">
				<div className="card card-body">
					<p>En cumplimiento con lo establecido en el artículo 22.2 de la Ley de Servicios dela Sociedad de la Información y de Comercio Electrónico (LSSI) y en adecuación con la Directiva Europea 2009/136/CE, MarketingItPlatform te informa que este Sitio Web acepta el uso de cookies.  Las cookies son pequeños ficheros de información que las Web, como marketingitplatform.com, envían a tu navegador y nos permiten "recordar" información sobre tu visita anterior y sobre tus preferencias y hábitos. Esto nos ayuda a facilitarte la navegación y a mejorar la utilidad que nuestro sitio te reporta, es decir, nos ayudan a mejorar tu experiencia al "bucear" en marketingitplatform.com.</p>
					<p>Por ponerte un ejemplo, las cookies nos "recuerdan" cosas tan elementales y útiles cómo cuáles son tus datos para iniciar automáticamente tu sesión sin tener que volver a introducir el usuario y contraseña, qué idioma elegiste para navegar, o poder mostrarte la publicidad en función de tus hábitos de navegación e intentar que ésta te resulte lo más interesante posible.</p>
					<p>Las cookies utilizadas  por este sitio Web, se asocian únicamente con un usuario anónimo y su ordenador, y no proporcionan por si mismas los datos personales del usuario, ¡puedes estar tranquilo!</p>
					<p>Muchas de las cookies que usamos están exceptuadas de la obligación de informaros sobre ellas porque son "esenciales" a juicio de la AEPD (por ejemplo las cookies de sesión y de entrada de usuario que te ayudan a no tener que rellenar los formularios en línea en todas las webs donde actúas) pero para otras es importante que estés bien informado y por eso es necesario que leas esta información. No obstante, nuestro compromiso con nuestros clientes es total: si tienes cualquier duda al leer esta información, escríbenos y te contestaremos a la mayor brevedad posible: por correo a {SensibleData.enterprise.reclamationPostalAddress}, o por mail a la dirección {MailService.hiddenMail(SensibleData.enterprise.reclamationEmail)}</p>  
				</div>
			</div>
			<br/>
			<br/>

			<button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseS2" aria-expanded="false" aria-controls="collapseS2">¿Qué cookies puedes encontrar en marketingitplatform.com?</button>
			<br/>
			<div className="collapse" id="collapseS2">
				<div className="card card-body">
					<p>Primero tenemos que contarte qué tipos de cookies existen para que puedas estar informado. Tienes que tener en cuenta que en marketingitplatform.com puedes encontrar tanto cookies propias de MarketingItPlatform, establecidas por nosotros mismos, como cookies de terceros, establecidas por nuestros socios, proveedores y colaboradores y que te permiten, por ejemplo, interactuar con la publicidad que puedes encontrar en nuestra Web. También existen cookies de sesión y cookies persistentes. Las primeras recaban y almacenan datos mientras estás en la web (por ejemplo el carro de la compra), las segundas permiten que los datos sigan almacenados y sean accesibles durante un período de tiempo.</p>
					<p>Según la finalidad para la que se traten los datos obtenidos a través de las cookies, en marketingitplatform.com puedes encontrar los siguientes tipos:</p>
					<ol>
						<li><strong>Cookies esenciales o técnicas:</strong> Sin estas no podríamos trabajar juntos y no podrías acceder a todas las funcionalidades de nuestro sitio Web. Te permiten la navegación a través de la Web y la utilización de las diferentes opciones o servicios que en ella existen como, por ejemplo, controlar el tráfico y la comunicación de datos, identificar la sesión, acceder a partes de acceso restringido, recordar los elementos que integran un pedido, realizar el proceso de compra de un pedido, realizar la solicitud de inscripción o participación en un evento, utilizar elementos de seguridad durante la navegación o almacenar contenidos para la difusión de videos o sonido. .
						</li>
						<li><strong>Cookies de análisis o analíticas:</strong> Son aquéllas que bien  tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacéis del servicio ofertado: nos permiten entender cómo interactuáis con nuestra Web. o qué contenidos y campañas de publicidad os resultan más atractivas. En definitiva nos permiten saber cómo tenemos que avanzar en el contenido que realmente os interesa y cómo hacéroslo lo más accesible posible. Para ello, analizamos vuestra navegación en nuestra página Web con el fin de mejorar la oferta de productos o servicios que os ofrecemos.
						</li>
						<li><strong>Cookies publicitarias:</strong> Son aquéllas que, bien tratadas por nosotros o por terceros, nos permiten gestionar de la forma más eficaz  posible la oferta de los espacios publicitarios que hay en marketingitplatform.com, adecuando el contenido del anuncio al contenido del servicio solicitado o al uso que realizas de nuestra página Web. Para ello podemos analizar tus hábitos de navegación en Internet y podemos mostrarle publicidad relacionada con tu perfil de navegación.
						</li>
						<li><strong>Cookies de redes sociales:</strong> Son una clase de cookies técnicas que te permiten compartir nuestro contenido a través de las redes sociales de las que eres miembro. Son gestionadas directamente por la red social elegida y sin ellas sería imposible que compartieras con tus amigos y conocidos la información que te mostramos.
						</li>
						<li><strong>Cookies de publicidad comportamental:</strong> Estas cookies permiten almacenar información sobre la navegación de los usuarios a través de una misma sesión de navegación, presentando publicidades relacionadas directamente con sus intereses o sus búsquedas anteriores en otros sitios web. </li>
					</ol>
				</div>
			</div>
			<br/>
			<br/>

			<button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseS3" aria-expanded="false" aria-controls="collapseS3">¿Cuáles son nuestras cookies?</button>
			<br/>
			<div className="collapse" id="collapseS3">
				<div className="card card-body">
					<p>Estas son las cookies que utiliza marketingitplatform.com y que detallamos en el siguiente cuadro: </p>

					<table id="cookieslist" className="table table-responsive">
						<thead>
						<tr>
							<th>Nombre de la cookie</th>
							<th>¿Quién trata la cookie?</th>
							<th>Descripción de la cookie</th>
							<th>Expiración</th>
							<th>Tipo de cookie</th>
						</tr>
						</thead>
						<tbody>
						<tr>
							<td>session</td>
							<td>MarketingItPlatform</td>
							<td>Necesario para el correcto funcionamiento del sitio web y tu identificación como usuario</td>
							<td>45 días</td>
							<td>Cookie técnica</td>
						</tr>
						<tr>
							<td>cookies_accepted</td>
							<td>MarketingItPlatform</td>
							<td>Nos permite saber que has aceptado el uso de cookies</td>
							<td>Final de sesión</td>
							<td>Cookie técnica</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
			<br/>
			<br/>

			<button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseS4" aria-expanded="false" aria-controls="collapseS4">¿Cómo activar, desactivar o eliminar las cookies?</button>
			<br/>
			<div className="collapse" id="collapseS4">
				<div className="card card-body">
					<p>Tienes que tener en cuenta que si no se activan las cookies en tu dispositivo, la navegabilidad y, en definitiva, la experiencia en marketingitplatform.com puede no ser tan buena como teníamos pensado. De hecho, si decides bloquear todas las cookies (incluyendo las "esenciales/técnicas" que te hemos comentado más arriba) puede que no seas capaz de acceder a parte de nuestro contenido o utilizar aquellos servicios (como el area de usuario) que las necesitan.</p>
					<p>En todo caso, activar, desactivar o eliminar las cookies es muy sencillo en tu navegador. Veamos los más habituales:</p>
					<ul>
						<li>- Si utilizas <strong>Internet Explorer 8.0+</strong>:</li>
						<li>
							<ul>
								<li>En el menú de "Herramientas", selecciona 'Opciones de Internet'</li>
								<li>Haz clic en la pestaña de "Privacidad".</li>
								<li>Elige el nivel de privacidad que desees moviendo el cursor que tiene seis posiciones dependiendo de la cantidad de cookies que permitirás se instalen.</li>
								<li>O desde el enlace <a href="http://windows.microsoft.com/es-es/windows7/how-to-manage-cookies-in-internet-explorer-9" target="_blank">http://windows.microsoft.com/es-es/windows7/how-to-manage-cookies-in-internet-explorer-9</a>
								</li>
							</ul>
						</li>
						<li>- Si utilizas <strong>Firefox 4.0+</strong>:</li>
						<li>
							<ul>
								<li>En el menú de "Herramientas", selecciona "Opciones"</li>
								<li>Selecciona la etiqueta de "Privacidad" en la barra superior</li>
								<li>Elige la opción que desees.</li>
								<li>O desde el enlace <a href="http://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-que-los-sitios-we" target="_blank">http://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-que-los-sitios-we</a>
								</li>
							</ul>
						</li>
						<li>- Si utilizas <strong>Google Chrome</strong>:</li>
						<li>
							<ul>
								<li>En el menú, dentro de "Configuración", selecciona "Mostrar opciones avanzadas".</li>
								<li>Selecciona "Configuración de contenido" dentro de la opción "Privacidad".</li>
								<li>O desde el enlace <a href="http://support.google.com/chrome/bin/answer.py?hl=es&answer=95647"target="_blank">http://support.google.com/chrome/bin/answer.py?hl=es&answer=95647</a></li>
							</ul>
						</li>
						<li>- Si utilizas <strong>Safari</strong>:</li>
						<li>
							<ul>
								<li>Dentro de "Ajustes" y "Safari", selecciona la opción "Preferencias"</li>
								<li>Abre la pestaña de "Privacidad"</li>
								<li>Dentro de la opción "Bloquear cookies", selecciona la opción que mejor se ajuste a tus necesidades.</li>
								<li>O desde el enlace <a href="http://support.apple.com/kb/ph5042" target="_blank">http://support.apple.com/kb/ph5042</a></li>
							</ul>
						</li>
					</ul>
					<br />
					<p>La única manera de revocar el consentimiento una vez dado es vía eliminar las cookies ya descargadas. Para ello sigue las instrucciones de más arriba. También existen tras herramientas para que puedas detectar las cookies en cada sitio Web que visitas y gestionar su desactivación, puedes utilizar <a href="http://www.ghostery.com/privacy-statement" >"Ghostery"</a> o <a href= "http://www.networkadvertising.org"> "Network Advertising Initiative" </a></p>
				</div>
			</div>
			<br/>
			<br/>
		</section>;
	}
}


