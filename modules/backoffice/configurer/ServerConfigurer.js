import CommonConfigurer from './CommonConfigurer';
import CoreService from 'shared/services/server/CoreService';

class ServerConfigurer extends CommonConfigurer {
	constructor(environment, req) {
		super(environment)
	}

	getMetas() {
		return [
			{name: "title", content: "MarketingItPlatform: backoffice"}
		];
	}

	getGtaId() {
		return 'UA-130248272-1';
	}
	
	async getPreloadedState(req) {
		let action = this.environment.binding.action;
		switch (action) {
			case 'info':
				return { action, logContent: { info: CoreService.getInfoLogContent() }};
			case 'errors':
				return { action, logContent: { error: CoreService.getErrorLogContent() }};
			default:
				return {};
		}
	}
};

module.exports = ServerConfigurer;
