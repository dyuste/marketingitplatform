import CommonConfigurer from './CommonConfigurer'

class ClientConfigurer extends CommonConfigurer {
	constructor(environment) {
		super(environment)
	}
};

module.exports = ClientConfigurer;
