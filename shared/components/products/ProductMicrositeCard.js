import React from 'react';
import ProductService from 'shared/services/common/ProductService';
import './ProductCard.scss';

export default function ProductMicrositeCard(props) {
	return <div className="offer-card card">
		<div className="card-header">
			<h4 className="card-title">Microsite</h4>
			{ ProductService.getProductTypePrice("microsite").format()}
		</div>
		<div className="card-body">
			<p>Sitio orientado a la promoción de un nuevo producto o servicio.<br/>
			Da a conocer las novedades de tu cliente y facilita la información a los usuarios.</p>
			<ul>
				<li><span className="oi oi-check" aria-hidden="true"></span>Sitio web atractivo y personalizado</li>
				<li><span className="oi oi-check" aria-hidden="true"></span>Dirección web</li>
				<li><span className="oi oi-check" aria-hidden="true"></span>Hosting y almacenamiento</li>
				<li><span className="oi oi-check" aria-hidden="true"></span>Herramientas de gestión y personalización</li>
				<li><span className="oi oi-check" aria-hidden="true"></span>Optimización SEO para los motores de búsqueda</li>
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