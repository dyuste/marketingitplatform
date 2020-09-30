import Express from 'express'
import Multer from 'multer'
import BodyParser from 'body-parser'
import Session from 'client-sessions'
import HtmlPageController from './HtmlPageController'
import JsonPageController from './JsonPageController'
import SitePageSettingsLoaderService from 'shared/services/server/SitePageSettingsLoaderService'
import SitesService from 'shared/services/server/SitesService'
import BaseApp from './BaseApp'

export default class SiteApp extends BaseApp  {
	constructor() {
		super();
	}
	
	async boot() {  
		const app = Express();

		app.use(BodyParser.urlencoded({ extended: true }));
		app.use(BodyParser.json());	
		app.use('/static', Express.static('static'))
		

		let ServerConfigurer = this.getServerConfigurerClass('./modules/site');

		app.use(async function (req, res, next) {
			let subDomain = req.vhost[0];
			let site = await SitesService.getSiteBySubDomain(subDomain);
			if (!site) {
				let environment = {service: null, binding: null};
				let configurer = new ServerConfigurer(environment, req);
				this.responseNotFound(req, res, configurer);
			} else {
				req.site = site
				next();	
			}
		});

		let service = {
			"service_name": "site",
			"module_path": "./modules/site"
		};
		let binding = {
			"type": "html",
			"method": "get",
			"http_all_route": "/*",
			"action": "landing",
			"access": {"allow" : "all"}
		};
		this.registerHandler(app, service, binding, ServerConfigurer);

		return app;
	}
}

module.exports = SiteApp