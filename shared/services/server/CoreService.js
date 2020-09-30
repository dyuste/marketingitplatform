import CryptographyService from 'shared/services/common/CryptographyService';
import util from 'util';
import fs from 'fs';
		
export default class CoreService {
	static warn(message, object, req) {
		console.error(CoreService.getPrefix(req) + " [WRN] " + message);
	}
	
	static dbgInspect(message, object, req) {
		console.log(CoreService.getPrefix(req) + " [DBG] " + message + ": " + util.inspect(object, false, null))
	}

	static dbg(message, object, req) {
		console.log(CoreService.getPrefix(req) + " [DBG] " + message)
	}

	static info(message, object, req) {
		console.log(CoreService.getPrefix(req) + " [INFO] " + message)
	}

	static rptIgnError(message, object, req) {
		let dt = CoreService.getPrefix(req);
		let msg = message + (object ? " with " + util.inspect(object, false, null) : "");
		console.error(dt + "[ERROR-IGN] " + msg); 
		fs.appendFile("/var/log/mip_server.log", dt + "[ERROR-IGN] " + msg + "\n", () => {});
		fs.appendFile("/var/log/mip_server.ign-err", dt + msg + "\n", () => {});
	}

	static rptInfo(message, object, req) {
		let dt = CoreService.getPrefix(req);
		let msg = message + (object ? " with " + util.inspect(object, false, null) : "");
		console.log(dt + "[INFO] " + msg);
		fs.appendFile("/var/log/mip_server.log", dt + "[INFO] " + msg + "\n", () => {});
		fs.appendFile("/var/log/mip_server.info", dt + msg + "\n", () => {});
	}

	static rptError(message, object, req) {
		let dt = CoreService.getPrefix(req);
		let msg = message + (object ? " with " + util.inspect(object, false, null) : "");
		console.error(dt + "[ERROR] " + msg);
		fs.appendFile("/var/log/mip_server.log", dt + "[ERROR] " + msg + "\n", () => {});
		fs.appendFile("/var/log/mip_server.error", dt + msg + "\n", () => {});
	}

	static getPrefix(req) {
		let dt = new Date().toISOString();
		let reqData = req
			? req.ip + "@" + req.method + ":"+req.subdomains.join(".")+"."+req.originalUrl
			: "noorigin";
		let userData = (req && req.user) ? "u"+req.user.id : "unknown";
		let sessionHash = (req && req.cookies && req.cookies.session)
			? CryptographyService.sha256(req.cookies.session)
			: "nosession";
		return dt + "; " + reqData + "; " + sessionHash + "; " + userData + "; ";
	}

	static getInfoLogContent() {
		return fs.readFileSync("/var/log/mip_server.info", 'utf8');
	}

	static getErrorLogContent() {
		return fs.readFileSync("/var/log/mip_server.error", 'utf8');
	}
};

module.exports = CoreService;
