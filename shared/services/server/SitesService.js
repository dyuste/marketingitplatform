import CoreService from 'shared/services/server/CoreService'
import DataBaseAdapter from 'lib/database/'
import CommonSitesService from 'shared/services/common/SitesService'
import SitesGalleryService from 'shared/services/common/SitesGalleryService'
import PaymentPlanService from 'shared/services/server/PaymentPlanService'

export default class SitesService {
	static getAjaxServices() {
		return [
			{
				name: "addSite",
				handler: SitesService.addSite,
				permissions: "user"
			},
			{
				name: "getSites",
				handler: SitesService.getSites,
				permissions: "user"
			},
			{
				name: "validateSiteName",
				handler: SitesService.validateSiteName,
				permissions: "user"
			},
			{
				name: "validateSubDomainNameAbortable",
				handler: SitesService.srvValidateSubDomainNameAbortable,
				permissions: "user"
			},
			{
				name: "setDomain",
				handler: SitesService.srvSetDomain,
				permissions: "siteOwner"
			},
			{
				name: "saveEditConfiguration",
				handler: SitesService.saveEditConfiguration,
				permissions: "siteOwner"
			},
			{
				name: "publishEditConfiguration",
				handler: SitesService.publishEditConfiguration,
				permissions: "siteOwner"
			},
			{
				name: "deactivate",
				handler: SitesService.deactivate,
				permissions: "siteOwner"
			}
		];
	}

	static async boot() {
		let dataBaseAdapter = new DataBaseAdapter();
		dataBaseAdapter.query(
			`CREATE TABLE IF NOT EXISTS user_sites (
				  id INT NOT NULL AUTO_INCREMENT,
				  creation_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
				  last_update_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				  user_id INT NOT NULL,
				  name VARCHAR(127),
				  subdomain VARCHAR(127),
				  domain VARCHAR(127) DEFAULT "marketingit.solutions",
  				  configuration TEXT NOT NULL,
				  PRIMARY KEY (id),
				  UNIQUE (subdomain),
				  INDEX (id, domain, subdomain))
				DEFAULT CHARACTER SET = utf8
				COLLATE = utf8_general_ci;`, []
			);
	}

	static async requireSiteOwner (req, res, next) {
		let user = req.user;
		let siteId = req.body.siteId ?  req.body.siteId : (req.params.siteId ? req.params.siteId : null);
		if (!user || !siteId) {
			// TODO: Report at least
			throw new Error(500);
		}

		let site = await SitesService.getSiteById(siteId);
		if (!site || site.userId != user.id) {
			throw new Error(401);
		}
		req.site = site;
		next();
	}
	
	static async addSite(req) {
		let user = req.user;
		let body = req.body;
		let dataBaseAdapter = new DataBaseAdapter();
		let siteName = body.name;
		let siteDomain = siteName.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\W/g, '');
		let result = await dataBaseAdapter.query(
			`INSERT INTO user_sites (user_id, name, subdomain, configuration)
			 VALUES (?, ?, ?, ?)`,
			 [user.id, siteName, siteDomain, '{"configuration":{"editVersion":{"plan":{"type":"'+body.type+'"}}}}'],
			 req
			);
		return {siteId: result.insertId};
		//return SitesService.getSites(req);
	}

	static async getSites(req) {
		let user = req.user;
		let result = [];
		let dataBaseAdapter = new DataBaseAdapter();
		let userSites = await dataBaseAdapter.fetchColumns(
			`SELECT id, name, domain, subdomain, user_id, configuration
				FROM user_sites
				WHERE user_id=?`, [user.id]
			);
		
		let userSitesLen = userSites.length;
		for (var i = 0; i <  userSitesLen; ++i) {
			try {
				result.push(await SitesService.buildSiteFromDbRow(userSites[i]));
			} catch (e) {
				CoreService.rptIgnError("SiteService::getSites - Failed to build site from row (at server SitesService::getSites)", null, req);
			}
		}

		return {list: result};
	}

	static async getSiteById(id) {
		let result = [];
		let dataBaseAdapter = new DataBaseAdapter();
		let userSites = await dataBaseAdapter.fetchColumns(
			`SELECT id, name, domain, subdomain, user_id, configuration
				FROM user_sites
				WHERE id=?`, [id]
			); 
		if (!userSites || userSites.length != 1) {
			return null;
		}
		
		let userSite = userSites[0];
		return await SitesService.buildSiteFromDbRow(userSite);
	}
	
	static async getSiteBySubDomain(subDomain) {
		let result = [];
		let dataBaseAdapter = new DataBaseAdapter();
		let userSites = await dataBaseAdapter.fetchColumns(
			`SELECT id, name, domain, subdomain, user_id, configuration
				FROM user_sites
				WHERE subDomain=?`, [subDomain]
			);
		if (!userSites || userSites.length != 1) {
			return null;
		}
		
		let userSite = userSites[0];
		return await SitesService.buildSiteFromDbRow(userSite);
	}
	
	static async validateSiteName(req) {
		let user = req.user;
		let body = req.body;
		let result = [];
		let dataBaseAdapter = new DataBaseAdapter();
		let userSites = await dataBaseAdapter.fetchColumns(
			`SELECT 1
				FROM user_sites
				WHERE name=?`, [body.name]
			);
		return {valid: userSites && userSites.length <= 0};
	}

	static async srvValidateSubDomainNameAbortable(req) {
		let body = req.body;
		let result = [];
		let subdomain = body.subdomain;
		let normalizedSubdomain = subdomain.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\W/g, '');
		if (normalizedSubdomain != subdomain) 
			return {valid: false, reason: "format"};
		let dataBaseAdapter = new DataBaseAdapter();
		let userSites = await dataBaseAdapter.fetchColumns(
			`SELECT 1
				FROM user_sites
				WHERE id <> ? AND domain=? AND subdomain=?`, [body.siteId, body.domain, subdomain]
			);
		let valid = userSites && userSites.length <= 0;
		return {valid, reason: valid ? null : "duplicated"};
	}

	static async srvSetDomain(req) {
		let validation = await SitesService.srvValidateSubDomainNameAbortable(req);
		if (!validation.valid) throw new Error("El subdominio no es válido o ya no está disponible");
		

		let body = req.body;
		let subdomain = req.subdomain;

		let dataBaseAdapter = new DataBaseAdapter();
		let result = await dataBaseAdapter.query(
			`UPDATE user_sites SET domain=?, subdomain=?
			 WHERE id=?`,
			 [body.domain, body.subdomain, body.siteId],
			 req
			);
		return {siteId: body.siteId, domain: body.domain, subdomain: body.subdomain, publicUrl:  'http://'+body.subdomain+"."+body.domain};
	}
	
	static async saveEditConfiguration(req) {
		let body = req.body;
		let siteId = body.siteId;
		let editConfiguration = body.editConfiguration;
		let siteData = req.site;
		let verifiedEditConfiguration = CommonSitesService.getNormalizedConfiguration(siteData, editConfiguration, true);
		if (!verifiedEditConfiguration) {
			throw new Error("Wrong site configuration");
		}
		let currentConfiguration = siteData.configuration;
		let finalConfiguration = SitesService.mergeEditConfiguration(currentConfiguration, verifiedEditConfiguration);
		let dataBaseAdapter = new DataBaseAdapter();
		
		CoreService.dbgInspect("SiteService::saveEditConfiguration - finalConfiguration", finalConfiguration);
		await dataBaseAdapter.query(
			`UPDATE user_sites 
			 SET configuration = ?
			 WHERE id = ?`,
			 [JSON.stringify(finalConfiguration), siteId],
			 req
			);

		return SitesService.getSiteById(siteId);
	}

	static async publishEditConfiguration(req) {
		let body = req.body;
		let siteId = body.siteId;
		let userId = req.user.id;

		let editConfiguration = body.editConfiguration;
		let siteData = req.site;
		let verifiedEditConfiguration = CommonSitesService.getNormalizedConfiguration(siteData, editConfiguration, true);
		if (!verifiedEditConfiguration) {
			throw new Error("Wrong site configuration");
		}
		CoreService.dbgInspect("SiteService::publishEditConfiguration - verifiedEditConfiguration", verifiedEditConfiguration);
		let currentConfiguration = siteData.configuration;
		let finalConfiguration = SitesService.mergeEditConfigurationAsReleased(currentConfiguration, verifiedEditConfiguration);
		let dataBaseAdapter = new DataBaseAdapter();
		
		CoreService.dbgInspect("SiteService::publishEditConfiguration - finalConfiguration", finalConfiguration);
		await dataBaseAdapter.query(
			`UPDATE user_sites 
			 SET configuration = ?
			 WHERE id = ?`,
			 [JSON.stringify(finalConfiguration), siteId],
			 req
			);

		await PaymentPlanService.activateProduct(
			userId,
			siteId,
			verifiedEditConfiguration.plan.type,
			req
		);

		return SitesService.getSiteById(siteId);
	}

	static async deactivate(req) {
		let body = req.body;
		let siteId = body.siteId;
		let userId = req.user.id;

		CoreService.dbg("SiteService::deactivate - user: " + userId + ", site: " + siteId);

		let configuration = req.site.configuration.releasedVersion;
		if (configuration)
			await PaymentPlanService.deactivateProduct(
				userId,
				siteId,
				configuration.plan.type,
				req
			);

		return SitesService.getSiteById(siteId);
	}

	static async saveConfiguration(siteId, wholeConfiguration, req) {
		// NOTA: No normalizamos releasedVersion ni editVersion version porque se usa internamente para guardar la galería
		// No obstante si se pretende extender su uso, sería preciso normalizar
		let dataBaseAdapter = new DataBaseAdapter();
		await dataBaseAdapter.query(
			`UPDATE user_sites 
			 SET configuration = ?
			 WHERE id = ?`,
			 [JSON.stringify(wholeConfiguration), siteId],
			 req
			);
	}
	
	static mergeEditConfiguration(configuration, editVersion) {
		configuration.editVersion = editVersion;
		configuration.editVersion.changes = true;
		return configuration;
	}

	static mergeEditConfigurationAsReleased(configuration, editVersion) {
		configuration.editVersion = editVersion;
		configuration.releasedVersion = editVersion;
		configuration.editVersion.changes = false;
		return configuration;
	}
	
	static async buildSiteFromDbRow(row) {
		let site = {
			id: row[0],
			name: row[1] ? row[1] : "Sin nombre",
			domain: row[2],
			subdomain: row[3],
			publicUrl: 'http://'+row[3]+"."+row[2],
			userId: row[4],
			configuration: JSON.parse(row[5]),
			activated: false 
		};

		if (Object.keys(site.configuration).length === 0) {
			site.configuration = {
				releasedVersion: {},
				editVersion: {
					changes: false
				}
			};
		}
		site.configuration.gallery = SitesGalleryService.getNormalizedGallery(
			site.configuration.gallery || {});
		site.configuration.releasedVersion = CommonSitesService.getNormalizedConfiguration(
			site, site.configuration.releasedVersion || {}, false);
		site.configuration.editVersion = CommonSitesService.getNormalizedConfiguration(
			site, site.configuration.editVersion || {}, false);
		
		site.paymentPlanStatus = await PaymentPlanService.getProductActiveStatus(
			site.id, site.configuration.releasedVersion.plan.type);
		site.activated = site.paymentPlanStatus ? !site.paymentPlanStatus.deactivated : false;
		
		//CoreService.dbgInspect("buildSiteFromDbRow", site)
		return site;
	}

	//
	// Site routing
	//

	static getPageConfigurationFromUrlPath(configuration, urlPath) {
		if (urlPath == "/") {
			let pages = CommonSitesService.getPagesFromConfiguration(configuration);
			if (pages.length > 0)
				return pages[0];
		} else {
			let routes = CommonSitesService.getPageRoutes(configuration);
			if (routes[urlPath])
				return routes[urlPath];
		}

		return null;
	}

};

module.exports = SitesService;
