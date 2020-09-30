import BackofficeApp from '../containers/BackofficeApp';

class CommonConfigurer {
	constructor(environment) {
		this.environment = environment;
	}

	getServiceName() {
		return this.environment.service.service_name;
	}

	getTitle() {
		return "MarketingItPlatform - BackOffice";
	}

	getAppComponent() {
		return BackofficeApp;
	}

	getSpaAppComponentSet() {
		return {
			'info': {
				'route': '/backoffice/info',
				'app': BackofficeApp
			},
			'errors': {
				'route': '/backoffice/errors',
				'app': BackofficeApp
			}
		};
	}

	getStateReducer() {
		return (state = 0, action) => { return state; };
	}
};

module.exports = CommonConfigurer;


		

