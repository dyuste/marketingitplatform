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
		let content = this.getTermsAndConditions();
		return (
			<section className="content-section content-section-1 odd-section"> 
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Términos y condiciones del servicio</h1>
							{content}
						</div>
					</div>
				</div>
			</section>
			);
	}

	getTermsAndConditions() {
		return <section>
		<button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseS2" aria-expanded="false" aria-controls="collapseS2">I. Condiciones Generales</button>
		<br/>
		<div className="collapse" id="collapseS2">
			<div className="card card-body">
				<h4>1. Objeto, modificaciones y prestaciones</h4>
				<h5>1.1.</h5>
				<p>Las presentes Condiciones Generales, junto con las Condiciones Particulares, las correspondientes descripciones de prestaciones y las listas de tarifas, que en cada caso se establezcan, regularán la prestación por parte de MarketingItPlatform de los servicios de alojamiento Web, registro de nombre de dominios, servidores, servicio de mensajería electrónica, aplicaciones y herramientas informáticas (en adelante, "los Servicios"), así como otros servicios que en un futuro se pudieren ofrecer al CLIENTE a cambio de la correspondiente remuneración a satisfacer por éste. Dichos Servicios conferirán al CLIENTE un derecho de uso de los productos ofertados, sometido a los plazos, condiciones y términos de las presentes condiciones generales y de las condiciones particulares que, en su caso, se establezcan.</p>
				<h5>1.2.</h5>
				<p>Las presentes Condiciones Generales prevalecerán sobre cualquier condición general que pudiera alegar el CLIENTE, salvo pacto expreso en contrario en el que se haga constar por escrito su aceptación por parte de MarketingItPlatform.</p>
				<h5>1.3.</h5>
				<p>Las presentes Condiciones Generales serán de aplicación siempre y cuando no entre en contradicción con las Condiciones Particulares o no se hayan dispuesto Condiciones Particulares.</p>
				<h4>2. Derechos y obligaciones de las partes</h4>
				<h5>a) CLIENTE</h5>
				<h6>2.1.</h6>
				<p>El CLIENTE tendrá derecho a utilizar el Servicio o Servicios contratados conforme a las Condiciones Generales y Particulares que en cada caso se acuerden.</p>
				<h6>2.2.</h6>
				<p>El CLIENTE deberá utilizar el Servicio o Servicios contratados conforme a las condiciones pactadas entre las partes, a la legislación vigente y a la buena fe.</p>
				<h6>2.3.</h6>
				<p>El CLIENTE deberá ser mayor de edad, es decir, mayor de 18 años cumplidos.</p>
				<h6>2.4.</h6>
				<p>El CLIENTE deberá satisfacer la remuneración pactada para cada Servicio o Servicios en los términos y formas contenidos en las Condiciones Particulares y listas de precios.</p>
				<h6>2.5.</h6>
				<p>El CLIENTE deberá facilitar a MarketingItPlatform sus datos correctos y completos. Se obliga, por tanto, a informar a MarketingItPlatform de forma inmediata sobre cualquier modificación de los datos facilitados y a confirmárselos nuevamente a MarketingItPlatform, a petición de ésta, en un plazo de 15 días desde la fecha de la modificación.</p>
				<p>Salvo que en las Condiciones Particulares se pacte otra cosa, deberán facilitarse los siguientes datos: Nombre completo, NIF/DNI/CIF, confirmación de que el cliente es mayor de edad, dirección, dirección e-mail, teléfono, el titular del servicio, los datos de pago (bien tarjeta de crédito o débito, bien cuenta bancaria o paypal) y el titular de los datos de pago. En el caso de que el CLIENTE sea una persona jurídica, se facilitará también su forma legal.</p>
				<h6>2.5. bis</h6>
				<p>El CLIENTE acepta que la dirección de correo electrónico facilitada por el CLIENTE a MarketingItPlatform, como dato de contacto, sea el medio de recepción de cualquier comunicación por parte de MarketingItPlatform en relación al presente contrato y a las obligaciones derivadas del mismo. De este modo, se considerará que MarketingItPlatform cumple con la obligación de informar al CLIENTE al enviar mediante correo electrónico cualquier comunicación relevante.</p>
				<h6>2.6.</h6>
				<p>EL CLIENTE es responsable del cumplimiento de las leyes y reglamentos que sean de aplicación y, de manera meramente enunciativa, de las reglas que tienen que ver con el funcionamiento del plan online, comercio electrónico, derechos de autor, mantenimiento del orden público, así como principios universales de uso de Internet. Por lo tanto, el CLIENTE acepta cumplir con todas las leyes y reglamentos aplicables en relación con este acuerdo.</p>
				<h6>2.7.</h6>
				<p>En relación a cualquier contenido que el CLIENTE pueda alojar en el espacio web y/o servidores proporcionados por MarketingItPlatform, durante la utilización de cualquier servicio prestado por MarketingItPlatform al CLIENTE y durante toda la duración del contrato, el CLIENTE asume que es el titular de todos los derechos necesarios (en particular derechos de propiedad intelectual, patentes y marcas) y que no infringe ningún derecho de terceros. Así el CLIENTE será el único responsable de dicho contenido. En caso de cualquier reclamación de terceros, como consecuencia de un incumplimiento o infracción por parte del CLIENTE, MarketingItPlatform podrá solicitar una indemnización al CLIENTE por los daños causados, incluyendo los costes de cualquier actuación legal necesaria para la defensa de los legítimos intereses de MarketingItPlatform.</p>
				<p>Por lo tanto el CLIENTE se compromete a NO usar los Servicios de forma contraria a la buena fe y, en particular, de forma meramente enunciativa, no realizará respecto de los mismos:</p>
				<ul>
				<li>Una utilización que resulte contraria a las leyes españolas o que infrinja los derechos de terceros.</li>
				<li>Cualquier publicación o transmisión de contenidos que, a juicio de MarketingItPlatform, resulte violento, obsceno, abusivo, ilegal, xenófobo o difamatorio.</li>
				<li>El uso de cracks, números de serie de programas o cualquier otro contenido que vulnere derechos de la propiedad intelectual de terceros.</li>
				<li>La recogida y/o utilización de datos personales de otros usuarios sin su consentimiento expreso o contraviniendo lo dispuesto en la Ley Orgánica 15/1999, de 13 de diciembre, de Protección de Datos de Carácter Personal.</li>
				<li>La utilización del servidor de correo y/o de sus direcciones de correo electrónico con fines de spam, mail bombing, phishing, escrow fraud, scam 419, pharming, difusión de virus (troyanos, gusanos, etc.), o cualquier otro tipo de actividad realizada con ánimo saboteador, fraudulento o delictivo. MarketingItPlatform advierte expresamente al CLIENTE de que sus correos electrónicos salientes serán filtrados automáticamente por MarketingItPlatform para detectar, en su caso, dichas actividades.</li>
				<li>La utilización del espacio web para subir archivos no adecuados para las finalidades de hosting o alojamiento telemático como por ejemplo, a título meramente enunciativo, la realización de backups de cualquier tipo, almacenamiento para subidas remotas, almacenamiento de datos para la compartición de archivos o comportamientos similares no relacionados directamente con los contenidos y aplicaciones de dicho espacio Web.</li>
				<li>La utilización del acceso a mensajes electrónicos almacenados en un servidor como un "disco duro virtual", es decir, su uso para el almacenamiento de ficheros como archivos o de cualquier otra manera. El uso de la cuenta de e-mail no se podrá utilizar para otras finalidades que aquellas relativas a un contexto de tráfico de e-mail normal.</li>
				</ul>
				<h6>2.8.</h6>
				<p>El espacio Web ofrecido para almacenamiento de fotografías, texto y contenido multimedia (esto es, todos los servicios de hosting) sólo podrá ser utilizado por el CLIENTE para contenidos y aplicaciones Web. En este sentido, no está permitido realizar copias de seguridad - comúnmente conocidas como data backups - ni almacenaje de datos si no están relacionados directamente con los contenidos y aplicaciones de dicho espacio Web.</p>
				<p>En todo caso, el CLIENTE no utilizará el espacio Web de manera que suponga una carga excesiva para los equipos de MarketingItPlatform o que de alguna manera perjudique el funcionamiento o las operaciones de los equipos o de la red de MarketingItPlatform.</p>
				<h6>2.9.</h6>
				<p>El CLIENTE se obliga a adoptar cuantas medidas de seguridad sean convenientes o necesarias para preservar la confidencialidad y el secreto de su Usuario (Login) y Contraseña (Password) de acceso al portal de MarketingItPlatform, que serán, en todo caso, personales e intransferibles.</p>
				<h6>2.10.</h6>
				<p>En caso de infracción de cualquiera de las obligaciones indicadas en los puntos 2.3, 2.5, 2.6, 2.7, 2.8 y 2.9, MarketingItPlatform tendrá derecho a resolver el contrato con el CLIENTE sin que éste tenga derecho a ninguna reclamación. Igualmente, MarketingItPlatform tendrá derecho a interrumpir el suministro del servicio previa notificación escrita con 48 horas de antelación, que también podrá realizarse a través del correo electrónico, y, en su caso, a la cancelación posterior del mismo.</p>
				<h5>b) MarketingItPlatform</h5>
				<h6>2.11.</h6>
				<p>MarketingItPlatform garantiza que los Servicios contratados serán prestados en la forma prevista en las presentes Condiciones Generales y, en su caso, en lo establecido en las Condiciones Particulares.</p>
				<h6>2.12.</h6>
				<p>El CLIENTE no tendrá derecho a exigir que se le asigne al servidor la misma dirección IP para toda la vigencia del contrato.</p>
				<h6>2.13.</h6>
				<p>Para cada dominio de Internet del CLIENTE únicamente podrá aplicarse una sola tarifa de MarketingItPlatform.</p>
				<h6>2.14.</h6>
				<p>Salvo pacto en contrario, se considera incluido en la tarifa el volumen de transmisión mensual indicado en el momento de la contratación a través de marketingitplatform.com. El volumen de transmisión de datos utilizado se deduce de la suma de todas las transmisiones de datos derivadas del uso del producto por el CLIENTE (como por ejemplo, correos electrónicos, descargas, cargas, páginas Web). Para la determinación del volumen de transmisión de datos, un Gigabyte equivale a mil Megabyte, un Megabyte equivale a mil Kilobytes y un Kilobyte equivale a mil Bytes.</p>
				<p>En caso de que el CLIENTE supere en un mes el volumen de transmisión incluido en la tarifa,  arketingItPlatform se reserva el derecho de facturar la diferencia entre el volumen incluido en la tarifa contratada y el volumen consumido realmente a los precios de MarketingItPlatform vigentes en dicho momento. Esta facultad no será de aplicación en el caso de que el volumen de transmisión previsto en la tarifa contratada sea ilimitado.</p>
				<h6>2.15.</h6>
				<p>Las tarifas con espacio web ilimitado estarán inicialmente configuradas con un espacio web de 50GB. La capacidad disponible de dicho espacio web se comprobará una vez al día, y en el caso de que el uso del cliente se aproxime a los límites del espacio web disponible, MarketingItPlatform incrementará el espacio web en ampliaciones de 20 GB sin coste adicional para el cliente, pero como máximo una vez al día. MarketingItPlatform se reserva el derecho a trasladar al cliente a servidores equipados al respecto y en dicho caso, el cliente acepta que durante el traslado pueda tener el servicio no disponible ocasionalmente por cuestiones técnicas.</p>
				<p>Los packs de correo con espacio ilimitado se configuran inicialmente con 50 GB de espacio disponible por buzón. En el caso de que el uso por parte del cliente se acerque al límite del espacio disponible, MarketingItPlatform incrementará el espacio disponible en tramos de 5 GB según sea necesario sin coste adicional para el cliente, pero no más de una vez al día.</p>
				<p>Para incrementar el espacio de tu correo por favor contacta con MarketingItPlatform Soporte Técnico.</p>
				<h6>2.16.</h6>
				<p>El CLIENTE elegirá una tarifa determinada al realizar el pedido. Salvo pacto en contrario, no es posible la combinación de ofertas distintas.</p>
				<h6>2.17.</h6>
				<p>MarketingItPlatform ofrece una garantía de funcionamiento de los Servicios que faculta al CLIENTE a recibir un abono total o parcial de las tarifas pagadas en el caso de que la disponibilidad total de las páginas web albergadas por MarketingItPlatform sea inferior a 99.99%.</p>
				<p>En el caso que el CLIENTE demuestre a satisfacción de MarketingItPlatform que la disponibilidad total de las páginas albergadas es inferior a la antedicha referencia, el CLIENTE podrá contactar MarketingItPlatform para solicitar un abono de tarifa para dicho mes proporcional al tiempo de falta de disponibilidad, abono que se asignará a la futura compra de Servicios de MarketingItPlatform. Los abonos no son canjeables por dinero y no afectan a los impuestos que sean de aplicación. Los abonos no se aplicarán a interrupciones causadas por (i) mantenimiento periódico previsto o reparaciones llevadas a cabo de cuando en cuando por MarketingItPlatform; (ii) falta de disponibilidad causada por el CLIENTE, (iii) incidencias de disponibilidad que no limitan el acceso del navegador a la página web del CLIENTE (por ejemplo, interrupciones al servicio de ftp o e-mail); (iv) suspensión de la cuenta del CLIENTE debido a acciones legales tomadas o anunciadas contra el CLIENTE o sus servicios; (v) suspensión de la cuenta del CLIENTE por violaciones de las Condiciones Generales de Contratación, tales como, a título meramente enunciativo, el uso excesivo de los recursos del sistema, impago o incidencias de pago o identificación de comportamientos fraudulentos o conculcadores de las Condiciones Generales de Contratación; o (vi) causas más allá del control de MarketingItPlatform o que no sean razonablemente previsibles por MarketingItPlatform. </p>
				<h6>2.18.</h6>
				<p>MarketingItPlatform podrá limitar o interrumpir provisionalmente el acceso del CLIENTE a sus prestaciones cuando lo hagan necesario la seguridad del servicio de la red, el mantenimiento de la integridad de la red y, especialmente, el evitar interrupciones graves de la red, del Software o datos guardados.</p>
				<p>Dichas interrupciones serán comunicadas, en la medida de lo posible, con la antelación suficiente al CLIENTE mediante marketingitplatform.com o vía correo electrónico. La anterior obligación no será exigible a MarketingItPlatform en caso de fuerza mayor o si se produce una caída de la red de datos que sirve de base para la prestación del mismo ajena a su voluntad y control.</p>
				<p>MarketingItPlatform se reserva el derecho de cancelar definitivamente el antedicho acceso en el supuesto que el CLIENTE infrinja gravemente sus obligaciones y/o en el supuesto que, por motivos ajenos a la voluntad de MarketingItPlatform, sea indispensable realizar cambios tecnológicos que impidan la continuación del servicio, previa notificación al CLIENTE con 15 días de antelación.</p>
				<p>A estos efectos, se consideran infracciones graves las referidas en la cláusula 2.10 de las presentes Condiciones Generales.</p>
				<h6>2.19.</h6>
				<p>MarketingItPlatform no se responsabiliza de:</p>
				<ul>
					<li>El contenido alojado en el espacio atribuido al usuario por el servicio;</li>
					<li>Los posibles daños en los equipos debidos al uso incorrecto de los mismos (que serán responsabilidad del CLIENTE);</li>
					<li>Los daños debidos a una infección por virus de sus equipos;</li>
					<li>Los errores producidos por los proveedores de acceso;</li>
					<li>Cualquier intromisión ilegítima por parte de un tercero;</li>
					<li>La configuración defectuosa por parte del CLIENTE.</li>
				</ul>
				<h6>2.20.</h6>
				<p>MarketingItPlatform podrá ceder los derechos y obligaciones contenidos en las presentes Condiciones Generales a uno o varios terceros. En este caso, el CLIENTE podrá resolver el contrato de manera inmediata.</p>
				<h6>2.21.</h6>
				<p>MarketingItPlatform elegirá libremente los medios técnicos, que pueden ser relativos a la tecnología y/o infraestructura, con el objeto de facilitar el suministro de los servicios prestados.</p>
				<h6>2.22.</h6>
				<p>MarketingItPlatform no será responsable de los daños y perjuicios de cualquier naturaleza que pudieran causarse a un tercero o al CLIENTE como consecuencia de la utilización indebida o ilegítima de los Servicios por parte del CLIENTE.</p>
				<h6>2.23.</h6>
				<p>Cualquier reclamación del CLIENTE a MarketingItPlatform deberá ser presentada de forma escrita, que podrá realizarse también mediante correo electrónico si el CLIENTE añade a la reclamación su nombre completo, NIF/DNI/CIF, dirección, dirección e-mail, teléfono así como el titular del servicio, y provee al documento electrónico de una firma electrónica, conforme a la normativa vigente. Queda excluida la reclamación de defectos e interrupciones no avisadas a tiempo.</p>
				<p>La reclamación debe dirigirse a la siguiente dirección postal: {SensibleData.enterprise.reclamationPostalAddress} o mediante correo electrónico a {MailService.hiddenMail(SensibleData.enterprise.reclamationEmail)}.</p>
				<p>Tras la notificación a MarketingItPlatform de los defectos e interrupciones, objetos de la reclamación, el CLIENTE concederá a MarketingItPlatform un plazo de 20 días para restablecer el correcto funcionamiento del servicio. Durante este plazo, el CLIENTE no podrá ejercer acción alguna contra MarketingItPlatform ni terminar el contrato por motivo de tales defectos e interrupciones.</p>
				<h6>2.24.</h6>
				<p>MarketingItPlatform responderá en todo caso de los daños producidos como consecuencia de un incumplimiento contractual que se deba a un comportamiento doloso o gravemente imprudente de MarketingItPlatform o de una de las personas de las que MarketingItPlatform se sirva para el cumplimiento de sus obligaciones. Si el incumplimiento contractual no se produce de forma gravemente imprudente ni dolosa, la responsabilidad de MarketingItPlatform quedará limitada a la cuantía de los daños previstos o que se hubieran podido prever a la celebración del contrato. En cualquier caso, y salvo disposición legal imperativa en contra, la cuantificación de la antedicha responsabilidad se limitará a la contraprestación efectivamente abonada por el CLIENTE a MarketingItPlatform por los Servicios contratados.</p>

				<h4>3. Licencias, Propiedad Intelectual</h4>
				<p>MarketingItPlatform es titular o, en su caso, está autorizado para su uso por el legítimo titular, de todos los derechos de autor, marcas, derechos de propiedad intelectual, know-how y cuantos otros derechos guarden relación con los servicios contratados por el CLIENTE, así como de los programas de ordenador necesarios para su implementación y la información que éste obtenga sobre el mismo.</p>
				<p>El CLIENTE debe respetar los programas de uso de terceros puestos a su disposición por MarketingItPlatform aunque fueran gratuitos, de los cuales MarketingItPlatform dispone de los derechos de explotación necesarios.</p>
				<p>El CLIENTE, en virtud de las presentes Condiciones Generales, no adquiere absolutamente ningún derecho o  licencia sobre los Servicios prestados, sobre los programas de ordenador necesarios para la prestación de los Servicios ni tampoco sobre la información técnica de seguimiento de los Servicios, excepción hecha de los derechos y licencias necesarios para el cumplimiento con las presentes Condiciones Generales y únicamente para la duración temporal de los Servicios contratados.</p>
				<p>Para algunas tarifas específicas MarketingItPlatform puede poner a disposición del CLIENTE una galería de imágenes con fotografías que el CLIENTE podrá mostrar en su página web alojada en MarketingItPlatform. En cualquier caso dichas imágenes/fotografías serán propiedad de MarketingItPlatform, o de un proveedor suyo. Así MarketingItPlatform permite el uso de las mencionadas imágenes/fotografías exclusivamente en páginas web diseñadas en virtud de las tarifas específicas correspondientes y cuyo proveedor de alojamiento sea el propio MarketingItPlatform, y únicamente para visualizaciones online. No está permitido ningún uso distinto del anterior, incluidos anuncios en cualquier medio audiovisual, publicidad impresa etc. Cualquier otro uso distinto del permitido, será considerado no legítimo por parte de MarketingItPlatform y toda la responsabilidad derivada del mismo será únicamente del CLIENTE. Debido a que MarketingItPlatform, o un proveedor suyo, mantendrá en todo caso la propiedad de las imágenes/fotografías, MarketingItPlatform podrá solicitar al CLIENTE la retirada de cualquier imagen/fotografía en el supuesto de que la propia licencia de uso de MarketingItPlatform haya expirado, o en función de cualquier otra circunstancia amparada bajo los legítimos intereses de MarketingItPlatform. Si el CLIENTE no eliminase la imagen/fotografía en cuestión, en caso de cualquier reclamación de terceros sobre licencias, marcas, patentes o propiedad intelectual, la responsabilidad ante dichos terceros recaerá sobre el CLIENTE exclusivamente.</p>


				<h4>4. Tarifas y forma de pago</h4>
				<h5>4.1.</h5>
				<p>Las tarifas incluidas en las listas de tarifas son fijas. Las tarifas dependen de la elección de la tarifa pactada, contenida en las correspondientes Condiciones Particulares. Si se hubiesen pactado tarifas independientes del uso, MarketingItPlatform podrá establecer un sistema de prepago. Las tarifas que estén relacionadas con el uso o consumo serán facturadas después de haberse realizado la prestación.</p>
				<h5>4.2.</h5>
				<p>MarketingItPlatform podrá aumentar el importe de las tarifas no más de una vez por trimestre natural con un preaviso de cuatro semanas antes del final del trimestre. Para la validez del aumento se requiere el consentimiento del CLIENTE, que se tendrá por otorgado si el CLIENTE no declara su disconformidad con dicho aumento, dentro de las cuatro semanas siguientes a su notificación por escrito, remitida por correo ordinario ({MailService.hiddenMail(SensibleData.enterprise.reclamationPostalAddress)}) o bien a través de {MailService.hiddenMail(SensibleData.enterprise.reclamationEmail)}. Si no declara su disconformidad, tendrá alternativamente el derecho de resolver el contrato durante el mismo plazo, transcurrido el cual, el contrato continuará su vigencia con las nuevas tarifas notificadas.</p>
				<h5>4.3.</h5>
				<p>Se informará al cliente del precio final, incluyendo los impuestos aplicables, al formalizar el proceso de compra y siempre previamente al envío por parte del cliente de su pedido a MarketingItPlatform.</p>
				<h5>4.4.</h5>
				<p>Si se produjese una variación en los impuestos aplicables a los servicios pactados, MarketingItPlatform podrá adaptar sus precios en consecuencia.</p>
				<h5>4.5.</h5>
				<p>Las facturas se emitirán y enviarán al CLIENTE por correo electrónico. El CLIENTE acepta el uso del correo electrónico como la única vía aplicable para la recepción de las facturas generadas por la prestación de los Servicios.</p>
				<h5>4.6.</h5>
				<p>La forma de pago para todos los servicios de MarketingItPlatform es crédito: MarketingItPlatform anunciará en su web (sección Plan de pagos) los próximos pagos, y el CLIENTE depositará el crédito que estime suficiente para el cumplimiento de los pagos.</p>
				<p>El pago de los servicios se efectuará en la fecha indicada en el plan de pagos, al inicio del período de disfrute del servicio, restando del crédito depositado disponible. El CLIENTE queda obligado a disponer de fondos suficientes que los importes adeudados se puedan retirar.</p>
				<p>El CLIENTE tiene el derecho de solicitar un reintegro de los fondos depositados como crédito, y no cobrados en concepto de ningún servicio, notificando su voluntad por escrito remitida por correo ordinario ({SensibleData.enterprise.reclamationPostalAddress}) o bien a través de {MailService.hiddenMail(SensibleData.enterprise.reclamationEmail)}</p>
				<h5>4.9.</h5>
				<p>MarketingItPlatform se reserva el derecho a suspender los Servicios prestados ante cualquier incidencia experimentada en el cobro de los mismos y/o por falta de pago. Si el CLIENTE no procediera a pagar los Servicios en el plazo de los 20 días naturales siguientes a la facturación del Servicio, MarketingItPlatform podrá suspender de forma inmediata el mismo y proceder simultáneamente a la reclamación de las cantidades debidas, pudiendo con posterioridad resolver el contrato con el CLIENTE por incumplimiento.</p>

				<h4>5. Oferta, formalización y prórroga del contrato</h4>
				<h5>5.1.</h5>
				<p>Después de la petición por el CLIENTE, MarketingItPlatform podrá aceptar la solicitud de contrato dentro de un plazo de 14 días. MarketingItPlatform pondrá a disposición del CLIENTE estas Condiciones Generales a las que se sujetará el contrato, de manera que las mismas puedan ser almacenadas y reproducidas por el mismo. Con posterioridad a la petición o solicitud antedicha por parte del CLIENTE, MarketingItPlatform confirmará la contratación mediante el envío de un e-mail de bienvenida al CLIENTE en que se le informará de la activación de los servicios contratados y los detalles de los mismos.</p>
				<h5>5.2.</h5>
				<p>Si el contrato se firmase para un periodo determinado o se hubiera acordado con el CLIENTE un periodo mínimo de validez, se prorrogará automáticamente en cada caso por el tiempo acordado o por el periodo mínimo, siempre y cuando no se renuncie con un plazo de cuatro semanas antes del tiempo acordado o de la finalización del periodo mínimo. Será de aplicación lo dispuesto en la presente cláusula salvo pacto en contrario contenido en las Condiciones Particulares.</p>
				<h4>6. Terminación del contrato</h4>
				<h5>6.1.</h5>
				<p>El contrato podrá finalizar por el mutuo acuerdo de las partes.</p>
				<h5>6.2.</h5>
				<p>Las relaciones contractuales entre MarketingItPlatform y el CLIENTE que no tuvieran una duración determinada podrán terminarse por cualquiera de las partes en todo momento sin necesidad de justificación alguna.</p>
				<h5>6.3.</h5>
				<p>El CLIENTE podrá terminar anticipadamente los contratos condicionados a un compromiso de permanencia mínima, siempre y cuando reintegre a MarketingItPlatform la diferencia de precio entre dichos contratos y los que, en el momento de la contratación, ofertase MarketingItPlatform de forma no condicionada a un compromiso de permanencia mínima por los mismos productos o servicios.</p>
				<h5>6.4.</h5>
				<p>El CLIENTE dispone de la herramienta online (https://marketingitplatform.com/dashboard/account) para gestionar su contrato, a través de la cual puede solicitar la baja del contrato al completo o de cualquiera de los servicios asociados al mismo. Dicha solicitud de baja generará el envío de un e-mail de confirmación por parte de MarketingItPlatform, que contendrá la información necesaria para completar el procedimiento de baja.</p>
				<h5>6.5.</h5>
				<p>Si el CLIENTE solicitase prestaciones adicionales al contrato, será válido para las mismas el periodo acordado inicialmente en el contrato. Las prestaciones adicionales pueden ser, según las regulaciones de renuncia indicadas, objeto de renuncia por separado, continuando por lo demás la vigencia del contrato.</p>
				<h4>7. Protección de Datos Personales</h4>
				<p>MarketingItPlatform manifiesta el máximo respeto a la protección de datos de nuestros clientes y el cumplimiento del Reglamento General de Protección de Datos “Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016”, y del resto de legislación vigente sobre la materia, y mantiene una Política de Privacidad sobre datos personales, en la que se establece, el uso que MarketingItPlatform hace de los datos de carácter personal y se informa a los clientes detalladamente.</p>
				<h4>8. Derecho de desistimiento</h4>
				<h5>8.1.</h5>
				<p>Cuando el CLIENTE sea un consumidor y el contrato se celebre sin la presencia física simultánea del CLIENTE y de MarketingItPlatform (venta a distancia), el CLIENTE gozará del derecho de desistimiento descrito en esta sección.</p>
				<h5>8.2.</h5>
				<p>El CLIENTE dispondrá de un plazo máximo de 14 días para desistir del contrato mediante declaración por escrito, remitida por correo ordinario a la dirección {SensibleData.enterprise.reclamationPostalAddress},
				correo electrónico a {MailService.hiddenMail(SensibleData.enterprise.reclamationEmail)}. El plazo para ejercer el derecho de desistimiento, que no implicará penalización alguna o necesidad de indicación de los motivos, empezará a correr desde el día de la celebración del contrato.</p>
				<h5>8.3.</h5>
				<p>El derecho de desistimiento del CLIENTE se extingue anticipadamente si MarketingItPlatform, contando con el consentimiento expreso del CLIENTE o a iniciativa de éste, ya ha comenzado con la prestación del servicio contratado antes de la expiración del plazo de desistimiento. El CLIENTE no tiene derecho de desistimiento si MarketingItPlatform le suministra mercancías elaboradas de acuerdo con las especificaciones del CLIENTE o que estén diseñadas claramente en función de sus necesidades o si el CLIENTE mismo ha ordenado la prestación de un servicio antes de la expiración del plazo de desistimiento (por ejemplo, registro inmediato de un dominio a petición del CLIENTE). Tampoco tiene el CLIENTE derecho de desistimiento si MarketingItPlatform le suministra un software en un soporte de datos y el CLIENTE lo desprecinta.</p>
				<h4>9. Garantía de Reembolso</h4>
				<p>Adicionalmente al derecho de desistimiento MarketingItPlatform concede al CLIENTE un periodo de prueba de 30 días, contados a partir de la primera activación de un servicio, en el que en caso de no estar satisfecho con el producto o el servicio de MarketingItPlatform el CLIENTE podrá terminar el contrato sin ningún coste. Este compromiso no se aplicará al registro de nombres de dominio.</p>

				<h4>10. Legislación aplicable y fuero, Resolución alternativa de conflictos</h4>
				<h5>10.1.</h5>
				<p>En lo previsto en las presentes Condiciones Generales, así como en la interpretación y resolución de conflictos que pudieran surgir entre las Partes, será de aplicación la legislación española.</p>
				<h5>10.2.</h5>
				<p>Las Partes se someten para la resolución definitiva de todas las controversias resultantes de la relación contractual a los juzgados o tribunales que resultaran competentes en cada caso.</p>
				<h5>10.3.</h5>
				<p>Asimismo, el CLIENTE conoce que MarketingItPlatform no está adherida al sistema arbitral de resolución de litigios online de la Unión Europea.</p>
				<h4>11. Varios</h4>
				<p>En caso de que una o varias de las estipulaciones de las presentes Condiciones Generales resultasen nulas, la validez del resto no quedará afectada.</p>
			</div>
		</div>
		<br/>
	</section>;
	}
}
