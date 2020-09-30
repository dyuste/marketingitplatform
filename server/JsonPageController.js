import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import AssetCollector from 'lib/assetcollector/AssetCollector';
import CoreService from 'shared/services/server/CoreService';

class JsonPageController {
	constructor(configurer) {
		this.configurer = configurer;
		this.serviceName = configurer.getServiceName();
	}

	async handleRender(req, res) {
		CoreService.dbg("[SERVER][JsonPageController] Serve " + this.serviceName + " at " + req.originalUrl, null, req);
		let ajaxHandler = this.configurer.getAjaxHandler();
		var response = {
			status: true,
			data: null
		};
		
		try {
			response.data = await ajaxHandler.handle(req);	
		} catch (e) {
			CoreService.rptError("[SERVER][JsonPageController] Unhandled Exception - " + e.message, e.stack, req);
			response.status = false;
		}

		res.header('Access-Control-Allow-Credentials', 'true');
		res.send(JSON.stringify(response));
	}
};

export default JsonPageController;

