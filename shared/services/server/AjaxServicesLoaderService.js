import AccountService from './AccountService';
import SitesService from './SitesService';
import Multer from 'multer';
import CoreService from 'shared/services/server/CoreService';
import ServerService from 'shared/services/server/ServerService';

let upload = Multer({dest: "/tmp"});

export default class AjaxServicesLoaderService {
	static async registerAjaxServices(app) {
		CoreService.dbg("[SERVER][AjaxServices] Registering ajax services");
			
		let ajaxServices = [];
		ServerService.getServices().map(serviceInfo => {
			let serviceName = serviceInfo.name;
			let servicePath = serviceInfo.path;
			let service = require(servicePath);

			if (service.getAjaxServices) {
				let ajaxServices = service.getAjaxServices();
				let nAS = ajaxServices.length;
				for (var i = 0; i < nAS; ++i) {
					let ajaxService = ajaxServices[i];
					AjaxServicesLoaderService.setHandler(app, serviceName, ajaxService);
				}
			}
		});
		
	}

	static setHandler (app, serviceName, serviceBinding) {
		let bindingName = serviceBinding.name;
		let route = "/ajax-services/"+serviceName+"/"+bindingName;
		let allow = serviceBinding.permissions 
			? serviceBinding.permissions
			: "all";

		let handler = async (req, res) => {
			CoreService.dbg("[SERVER][AjaxServices] Serve " + serviceName + ":" + bindingName + " at " + req.originalUrl);
			var response = {
				status: true,
				data: null
			};
			try {
				response.data = await serviceBinding.handler(req);
			} catch (e) {
				CoreService.rptError("[SERVER][AjaxServices] Unhandled Exception - " + e.message, e.stack);
				response.status = false;
			}

			res.header('Access-Control-Allow-Credentials', 'true');
			res.send(JSON.stringify(response));
		};

		if (allow == "user") {
			app.post(route, upload.any(), AccountService.requireLoginAjax, handler);
		} else if (allow == "siteOwner") {
			app.post(route, upload.any(), AccountService.requireLoginAjax, SitesService.requireSiteOwner, handler);
		} else {
			app.post(route, upload.array(), handler);
		}
		
	}
};

module.exports = AjaxServicesLoaderService;
