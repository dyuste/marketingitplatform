import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import combineReducers from 'shared/reducers/combineReducers';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import AssetCollector from 'lib/assetcollector/AssetCollector';
import AccountService from 'shared/services/server/AccountService';
import RouterApp from 'shared/components/app/routerApp/RouterApp';
import SpaReducer from 'shared/components/app/routerApp/SpaReducer';
import CoreService from 'shared/services/server/CoreService';

class HtmlErrorPageController {
	constructor(configurer) {
		this.configurer = configurer;
	}

	async handleRender(req, res) {
		CoreService.dbg("[SERVER][HtmlPageErrorController] Serve " + this.serviceName + " at " + req.originalUrl);
		let errorData = req.environment && req.environment.data;
		res.send(this.getPageLayout(
			errorData.errorCode,
			this.getErrorTitle(errorData.errorCode),
			this.getErrorDetail(errorData.errorCode),
			errorData.errorInfo
			)
		);
	}

	getErrorTitle(errorCode) {
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
	
	getErrorDetail(errorCode) {
		switch(errorCode) {
			// TODO
			case 404:
				return "La página a la que intentas acceder no existe.";
			case 403:
				return "No tienes permisos suficientes para acceder a este contenido.";
			default:
				return "Disculpa las molestias, vuelve a intentarlo pasados unos minutos.";
		}
	}

	getPageLayout(errorCode, errorTitle, errorDetail, errorInfo) {
		return `
<!doctype html>
<html>
	<head>
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	    <meta name="description" content="Página de error">
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
		<link rel="stylesheet" type="text/css" href="/static/bundle/home.css">
  		<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
  		<link href="/static/assets/open-iconic/open-iconic-bootstrap.min.css" rel="stylesheet">
  		<title>`+errorTitle+" ("+errorCode+`)</title>
	</head>
	<body>
		<div style="{display: flex; width: 100%; height: 100%; background-color: #EEE}">
			<div class="card">
				<div class="card-header">
					<h4 class="card-title">`+errorTitle+`</h4>
				</div>
				<div class="card-body">
					<p>`+errorDetail+`</p>
				</div>
			</div>
		</div>
		<script>
			console.log(\``+errorInfo+`\`);
		</script>
	</body>
</html>
		`;
	}
};

export default HtmlErrorPageController;

