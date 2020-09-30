import Express from 'express';
import Multer from 'multer';
import HtmlPageController from './HtmlPageController';
import HtmlErrorPageController from './HtmlErrorPageController';
import JsonPageController from './JsonPageController';
import BaseServices from 'services.json';
import AccountService from 'shared/services/server/AccountService';
import SitesService from 'shared/services/server/SitesService';
import CoreService from 'shared/services/server/CoreService';
import util from 'util';

let upload = Multer();

export default class BaseApp {
	constructor() {
		this.serverConfigurerClasses = {};
	}

	registerHandler(app, service, binding, ServerConfigurer) {
		let permissions = binding['access'] ? binding['access'] : { "allow": "all" };
		let handler = async (req, res) => {
			CoreService.rptInfo("Start handler", null, req);
			let environment = {service: service, binding: binding};
			let configurer = new ServerConfigurer(environment, req);
			
			let handleError = e => {
				return e.message == 404
						? this.responseNotFound(req, res, configurer)
						: this.responseGeneral(req, res, e, configurer);
			};

			let render = () => {
				let controller = binding.type == "json"
								? new JsonPageController(configurer)
								: new HtmlPageController(configurer);
				controller.handleRender(req, res)
					.then()
					.catch(e => {handleError(e)});
			}

			try {
				if (configurer.preAction) await configurer.preAction(req, res, render);
				else render();
			} catch(e) {
				handleError(e);
			}
		};

		binding.method == "post"
			? this.addPostRoute(app, binding.http_all_route, handler, permissions)
			: this.addGetRoute(app, binding.http_all_route, handler, permissions);
	}

	addGetRoute(app, route, handler, permissions) {
		CoreService.dbg("[SERVER] Registered GET service at " + route);
		let args = [route, upload.array()];
		if (permissions.allow == "user" 
			|| permissions.allow == "siteOwner"
			|| permissions.allow == "admin") {
			args.push(AccountService.requireLogin); 
		}
		if (permissions.allow == "siteOwner") {
			args.push(SitesService.requireSiteOwner);
		}
		if (permissions.allow == "admin") {
			args.push(AccountService.requireAdmin);
		}
		args.push(handler);
		app.get(...args);
	}

	addPostRoute(app, route, handler, permissions) {
		CoreService.dbg("[SERVER] Registered POST service at " + route);
		let args = [route, upload.array()];
		if (permissions.allow == "user" || permissions.allow == "siteOwner") {
			args.push(AccountService.requireLoginAjax); 
		}
		if (permissions.allow == "siteOwner") {
			args.push(SitesService.requireSiteOwner);
		}
		args.push(handler);
		app.post(...args);
	}

	getServerConfigurerClass(modulePath) {
		let path = "../"+modulePath+"/configurer/ServerConfigurer";
		if (!this.serverConfigurerClasses[path]) {
			this.serverConfigurerClasses[path] = require(path);
			if (typeof this.serverConfigurerClasses[path].boot === 'function') {
				this.serverConfigurerClasses[path].boot();
			}
		}

		return this.serverConfigurerClasses[path];
	}

	responseNotFound(req, res, configurer) {
		this.responseErrorPage(req, res, configurer, 404);
	}

	responseInternal(req, res, configurer) {
		this.responseErrorPage(req, res, configurer, 500);
	}

	responseGeneral(req, res, e, configurer) {
		this.responseErrorPage(req, res, configurer, 500, e);
	}

	async responseErrorPage(req, res, configurer, errorCode, errorObject) {
		try {
			let errorInfo = this.getErrorInfo(errorObject, errorCode);
			CoreService.rptIgnError("[BaseApp::responseErrorPage] Unhandled exception while serving request: " + errorInfo, null, req);
			req.environment = { 
				service: {service_name: req.environment && req.environment.service.service_name},
				binding: {action: "error"},
				data: {errorCode, errorInfo}
			};
			let controller = configurer.hasErrorApp
				? new HtmlPageController(configurer)
				: new HtmlErrorPageController(configurer);
			
			await controller.handleRender(req, res);
			
		} catch(e) {
			let errorInfo = this.getErrorInfo(e, 500);
			CoreService.rptError("[BaseApp::responseErrorPage] Unhandled exception while composing error page: " + errorInfo, null, req);
			res.status(500).send("<h2>Disculpa, estamos teniendo problemas técnicos en estos momentos.</h2><script>console.log(`Error while composing error page: "+errorInfo+"`);</script>");	
		}
	}

	getErrorInfo(errorObject, errorCode) {
		var errorInfo = '{"code": '+errorCode+'}';
		if (errorObject) {
			try {
				let stack = errorObject.stack ? errorObject.stack.split("`").join("\\`") : "n/a";
				errorInfo = JSON.stringify({
					name: errorObject.name,
					code: errorCode,
					message: errorObject.message,
					description: errorObject.description,
					file: errorObject.fileName,
					lineNumber: errorObject.lineNumber,
					stack
				}).split("`").join("\\`");
			} catch (e) {}
		}
		return errorInfo;
	}
}

module.exports = BaseApp;

