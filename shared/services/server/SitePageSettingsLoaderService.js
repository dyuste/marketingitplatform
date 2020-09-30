import DataBaseAdapter from '../../../lib/database/';

class SitePageSettingsLoaderService {
	
	static async getPageSettingsCollection(site_id, settings = []) {
		let dataBaseAdapter = new DataBaseAdapter();
		let sitePages = await dataBaseAdapter.fetchColumns(
			'SELECT configuration, preloaded_state, server_data, permissions FROM site_page WHERE site_id = ?',
			[site_id]);
		let siteSettings = {};

		// Register at local siteSettings already preset settings via 'settings' arguments
		settings.map(service => {
			if (!(service.service_name in siteSettings)) {
				siteSettings[service.service_name] = service;
			}
		});

		// Complete local siteSettings with database registered services
		let sitePagesLen = sitePages.length;
		for (var i = 0; i < sitePagesLen; ++i) {
			let pageData = sitePages[i];
			let service = JSON.parse(pageData[0]);
			let preloadedState = pageData[1] ? JSON.parse(pageData[1]) : {};
			let serverData = pageData[2] ? JSON.parse(pageData[2]) : {};
			let permissions = pageData[3] ? JSON.parse(pageData[3]) : {"allow": "all"};

			if (!(service.service_name in siteSettings)) {
				// New service
				service.preloadedState = preloadedState;
				service.serverData = serverData;
				service.siteId = site_id;
				siteSettings[service.service_name] = service;
			} else {
				// New binding for an already registered service
				service.bindings.map(binding => {
					if (!siteSettings[service.service_name].preloadedState) {
						siteSettings[service.service_name].preloadedState = preloadedState;	
					} else {
						for (var action in preloadedState) {
							siteSettings[service.service_name].preloadedState[action] = preloadedState[action];
						}
					}
					if (!siteSettings[service.service_name].serverData) {
						siteSettings[service.service_name].serverData = serverData;	
					} else {
						for (var action in serverData) {
							siteSettings[service.service_name].serverData[action] = serverData[action];
						}
					}
					binding.access = permissions;
					siteSettings[service.service_name].bindings.push(binding);
				});
			}
		};

		var result = [];
		for (var settingName in siteSettings) {
			result.push(siteSettings[settingName]);
		}
		return result;
	}
};

module.exports = SitePageSettingsLoaderService;
