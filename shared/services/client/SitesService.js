import XhrService from './XhrService'

export default class SitesService {
	static async addSite(name, type) {
		return SitesService.performAction("addSite", {name: name, type: type});
	}

	static async getSites() {
		return SitesService.performAction("getSites");
	}

	static async saveEditConfiguration(siteId, editConfiguration) {
		return SitesService.performAction("saveEditConfiguration", {
				siteId: siteId,
				editConfiguration: editConfiguration
			});
	}

	static async publishEditConfiguration(siteId, editConfiguration) {
		return SitesService.performAction("publishEditConfiguration", {
				siteId: siteId,
				editConfiguration: editConfiguration
			});
	}

	static async deactivate(siteId) {
		return SitesService.performAction("deactivate", {
				siteId: siteId
			});
	}

	static validateSiteNameAbortable(siteName) {
		return SitesService.performActionAbortable("validateSiteName", {name: siteName});
	}

	static validateSubDomainNameAbortable(siteId, domain, subdomain) {
		return SitesService.performActionAbortable("validateSubDomainNameAbortable", {
			siteId, domain, subdomain
		});	
	}
	
	static setDomain(siteId, domain, subdomain) {
		return SitesService.performAction("setDomain", {
			siteId, domain, subdomain
		});	
	}

	static isEmptySiteConfiguration(configuration) {
		return Object.keys(configuration).length === 0
			&& configuration.constructor === Object;
	}

	static async performAction(action, data = {}) {
	    return XhrService.fetch(
	        "/ajax-services/SitesService/"+action,
	        'post',
	        data);
	}

	static performActionAbortable(action, data = {}) {
	    return XhrService.fetchAbortable(
	        "/ajax-services/SitesService/"+action,
	        'post',
	        data);
	}
};

module.exports = SitesService;
