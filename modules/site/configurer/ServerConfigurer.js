import CommonConfigurer from './CommonConfigurer'
import SitesService from 'shared/services/server/SitesService.js'
import CoreService from 'shared/services/server/CoreService.js'

class ServerConfigurer extends CommonConfigurer {
	constructor(environment, req) {
		super(environment)
		this.req = req;
	}

	getMetas() {
		let pageConfiguration = this.getPageConfiguration(this.req);
		if (!pageConfiguration) {
			throw new Error(505);
		}

		let metas = [];
		if (pageConfiguration.seo_title) 
			metas.push({name: "title", content: pageConfiguration.seo_title});
		if (pageConfiguration.seo_keywords) 
			metas.push({name: "keywords", content: pageConfiguration.seo_keywords});
		if (pageConfiguration.seo_description) 
			metas.push({name: "description", content: pageConfiguration.seo_description});
		if (pageConfiguration.og_title) 
			metas.push({name: "og:title", content: pageConfiguration.og_title});
		if (pageConfiguration.og_description) 
			metas.push({name: "og:description", content: pageConfiguration.og_description});
		return metas;
	}

	async getPreloadedState(req) {
		let configuration = req.site.configuration.releasedVersion;
		let pageConfiguration = this.getPageConfiguration(req);
		if (!pageConfiguration) {
			throw new Error(404);
		}
		return {
			page: pageConfiguration,
			themeInfo: configuration.modules.themeInfo, 
			generalInfo: configuration.modules.generalInfo,
			headerInfo: configuration.modules.headerInfo
		};
	}

	getPageConfiguration(req) {
		let configuration = req.site.configuration.releasedVersion;
		return SitesService.getPageConfigurationFromUrlPath(configuration, req.path);
	}
};

module.exports = ServerConfigurer;
