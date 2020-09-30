import IdentityReducer from '../reducers/IdentityReducer'
import App from '../containers/App'

class CommonConfigurer {
	constructor(environment) {
		this.environment = environment;
	}

	getServiceName() {
		return this.environment.service.service_name;
	}

	getTitle() {
		return "Empty page";
	}

	getAppComponent() {
		return App;
	}

	getStateReducer() {
		return IdentityReducer;
	}
};

module.exports = CommonConfigurer;
