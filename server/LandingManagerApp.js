import Express from 'express';
import Session from 'client-sessions';
import BodyParser from 'body-parser';
import HtmlPageController from './HtmlPageController';
import JsonPageController from './JsonPageController';
import BaseApp from './BaseApp';
import BaseServices from 'services.json';
import CookieParser from 'cookie-parser';
import CoreService from 'shared/services/server/CoreService';

export default class LandingManagerApp extends BaseApp {
	constructor() {
		super();
	}
	
	async boot() {
		const app = Express();

		app.use(Session({
			cookieName: 'session',
			secret: '916719eb33cf5272df1ed2bdca117418a8be4557',
			duration: 45 * 24 * 60 * 60 * 1000,
			activeDuration: 45 * 24 * 60 * 60 * 1000,
		}));
		
		app.use(BodyParser.urlencoded({ extended: true }));
		app.use(BodyParser.json());	
		app.use('/static', Express.static('static'));
		app.use('/google133ff0209f042750.html', Express.static('static/www/google133ff0209f042750.html'));
		app.use(CookieParser());

		CoreService.dbg("[SERVER][LandingManagerApp] Registering services");
		BaseServices.map(service => {
			let ServerConfigurer = this.getServerConfigurerClass(service.module_path);
			let automaticRequiredBindings = [];

			service.bindings.map(binding => {
				this.registerHandler(app, service, binding, ServerConfigurer);

				if (ServerConfigurer.getAutomaticRequiredBindings) {
					let automaticRequiredBindingsForBinding = ServerConfigurer.getAutomaticRequiredBindings(binding);
					if (automaticRequiredBindingsForBinding) {
						let len = automaticRequiredBindingsForBinding.length;
						for (var i = 0; i < len; ++i) { 
							automaticRequiredBindings.push(automaticRequiredBindingsForBinding[i]);
						}
					}
				}
			});

			automaticRequiredBindings.map(binding => {
				this.registerHandler(app, service, binding, ServerConfigurer);
			});
		});

		return app;
	}
}

module.exports = LandingManagerApp;
