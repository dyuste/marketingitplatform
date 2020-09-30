import React from 'react';
import ProductService from 'shared/services/common/ProductService';

export default function ProductMicrositeCard(props) {
	return <div className="offer-card card">
		<div className="card-header">
			<h4 className="card-title">Landing</h4>
			{ProductService.getProductTypePrice("landing").format()}
		</div>
		<div className="card-body">
			<p>Sitio orientado a la captación de nuevos usuarios.<br/>
			   Promociona un producto, servicio o evento y <strong>permite a los usuarios inscribirse</strong> o dejar su contacto.</p>
			<ul>
				<li className="base-product"><span className="label">Microsite</span><span className="oi oi-plus" aria-hidden="true"></span></li>
				<li><span className="oi oi-check" aria-hidden="true"></span>Registro de datos del usuario: contacto, inscripción a eventos, subscripciones, etc.</li>
				<li><span className="oi oi-check" aria-hidden="true"></span>Herramientas de gestión y descarga de datos especializadas</li>
				<li><span className="oi oi-check" aria-hidden="true"></span>Comunicación con los usuarios</li>
			</ul>
		</div>
		<div className="card-footer">
			<a href={props.ctaHref ? props.ctaHref : "#"}>
				<button className="btn btn-cta btn-lg"
					disabled={!!props.ctaDisabled}
					onClick={props.ctaOnClick} >
				{props.ctaLabel}
				</button>
			</a>
		</div>
	</div>;
}
