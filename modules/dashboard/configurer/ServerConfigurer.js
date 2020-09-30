import CommonConfigurer from './CommonConfigurer';
import SitesService from 'shared/services/server/SitesService';
import CoreService from 'shared/services/server/CoreService';

class ServerConfigurer extends CommonConfigurer {
	constructor(environment, req) {
		super(environment)
	}

	getMetas() {
		return [
			{name: "title", content: "MarketingItPlatform: panel de control"}
		];
	}

	async getPreloadedState(req) {
		switch (this.environment.binding.action) {
			case 'editSite':
				return await this.getCommonPreLoadedState(req, {
						siteData: {
							currentSite: req.site
						}
					}, true);

			case 'paymentPlan':
			case 'credit':
				return await this.getCommonPreLoadedState(req, {
						paymentPlan: {
							activeProducts: {
								loading: true,
								list: []
							},
							installments: {
								loading: true,
								list: []
							}
						},
						payment: {
							summary: {
								loading: true,
								list: []
							},
							transactions: {
								loading: true,
								list: []
							},
							createTransferRequest: {
								id: false,
								loading: false
							}
						}
					}, false);
			case 'account':
				return await this.getCommonPreLoadedState(req, {
						account: {
							update: {
								loading: false,
								message: null
							}
						}
					}, false);

			case 'dashboard':
			default:
				return await this.getCommonPreLoadedState(req, {
						siteData: {
							currentSite: null,
							loading: false,
							list: []
						}
					}, false);
		}
	}

	async getCommonPreLoadedState(req, appData, compactView) {
		var sites = [];
		var warning = null;
		try {
			sites = await SitesService.getSites(req);
		} catch (e) {
			CoreService.rptIgnError("[module:dashboard] Serverconfigurer::getCommonPreLoadedState - Failed to load sites service", null, req);
		}
		
		return Object.assign({
				ui: {
					warning: null,
					compactView: compactView
				},
				userSites: sites ? sites.list : []
			}, appData);
	}
};

module.exports = ServerConfigurer;
