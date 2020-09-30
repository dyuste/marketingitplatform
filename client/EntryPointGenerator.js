
// Plugin for WebPack
module.exports = async function () {
	var entryPoints = {};

	var fs = require('fs');
	var entryPointsFolder = "./client/entry_points";
	if (!fs.existsSync(entryPointsFolder)) {
		fs.mkdirSync(entryPointsFolder);
	}

	let BaseServices = require('../services.json');
	let Services = [
		{module_path: './modules/home', service_name: 'home'},
		{module_path: './modules/dashboard', service_name: 'dashboard'},
		{module_path: './modules/site', service_name: 'site'},
		{module_path: './modules/backoffice', service_name: 'backoffice'}
	];
	Services.map(service => {
		var configurerPath = "../../"+service.module_path+"/configurer/ClientConfigurer";
		var fileContent = `
import Client from '../Client.js';

let ClientConfigurer = require("${configurerPath}");
let client = new Client(new ClientConfigurer(window.__ENVIRONMENT__));
client.boot();
		`;
		var fileName = entryPointsFolder + "/" + service.service_name + ".js";
		entryPoints[service.service_name] = __dirname + "/../" + fileName;

		fs.writeFile(fileName, fileContent, err => {
			if (err) {
				console.err("[!] EntryPointGenerator: Failed to inflate " + fileName);
			} else {
				console.log("EntryPointGenerator: Inflated " + fileName);
			}
		});
	});

	return entryPoints;
};

