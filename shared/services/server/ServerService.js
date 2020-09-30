import DataBaseAdapter from 'lib/database/';
import CoreService from 'shared/services/server/CoreService';

const ReleaseVersion = "1.0.1";

export default class ServerService {

	static getServices() {
		return [
			{
				name: 'SitesService',
				path: 'shared/services/server/SitesService'
			},
			{
				name: 'SitesGalleryService',
				path: 'shared/services/server/SitesGalleryService'
			},
			{
				name: 'AccountService',
				path: 'shared/services/server/AccountService'
			},
			{
				name: 'PaymentService',
				path: 'shared/services/server/PaymentService'
			},
			{
				name: 'PaymentPlanService',
				path: 'shared/services/server/PaymentPlanService'
			},
			{
				name: 'AjaxServicesLoaderService',
				path: 'shared/services/server/AjaxServicesLoaderService'
			},
			{
				name: 'ServerService',
				path: 'shared/services/server/ServerService'
			}
		];
	}

	static async boot() {
		CoreService.dbg("[SERVER][ServerService] Boot");

		let dataBaseAdapter = new DataBaseAdapter();
		await dataBaseAdapter.query(
			`CREATE TABLE IF NOT EXISTS server_core (
				  version VARCHAR(64) NOT NULL)
				DEFAULT CHARACTER SET = utf8
				COLLATE = utf8_general_ci;`, []
			);

		let version = await ServerService.getVersion();
		let services = ServerService.getServices(),
			servicesLen = services.length;
		for (var s = 0; s < servicesLen; ++s) {
			let serviceInfo = services[s];
			let servicePath = serviceInfo.path;
			let service = require(servicePath);
			if (service) {
				CoreService.rptInfo("[ServerService] Register service " + serviceInfo.name);
				if (service.boot){
					CoreService.rptInfo("[ServerService] Boot service " + serviceInfo.name);
					await service.boot();
				}
				if (service.upgrade) {
					CoreService.rptInfo("[ServerService] Try to upgrade service " + serviceInfo.name);
					await service.upgrade(version || "1.0.0", ReleaseVersion);
				}
			} else
				CoreService.rptIgnError("[ServerService] Failed to load service", serviceInfo);
		}

		if (!version)
			await dataBaseAdapter.query("INSERT INTO server_core (version) VALUES ('"+ReleaseVersion+"');", []);
		else
			await dataBaseAdapter.query("UPDATE server_core SET version ='"+ReleaseVersion+"';", []);
	}

	static async getVersion() {
		let dataBaseAdapter = new DataBaseAdapter();
		let dbContent = await dataBaseAdapter.fetchColumns(`SELECT * FROM server_core`);
		if (dbContent && dbContent.length == 1) {
			return dbContent[0][0];
		} else
			CoreService.rptIgnError("Unable to determine server version");
		return null;
	}
};
