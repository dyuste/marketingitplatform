import Express from 'express';
import AjaxServicesLoaderService from 'shared/services/server/AjaxServicesLoaderService';
import LandingManagerApp from './LandingManagerApp';
import SiteApp from './SiteApp';
import vhost from 'vhost';
import https from 'https';
import fs from 'fs';
import tls from 'tls';
import CoreService from 'shared/services/server/CoreService';
import ServerService from 'shared/services/server/ServerService';

const Domain = 'marketingitplatform.com';
const AllowedBrandDomains = ['marketingit.solutions'];
const UnsecurePort = 80;
const SecurePort = 443;

class Server {

	async boot() { 
		CoreService.rptInfo("[SERVER] Server boot...");
		await ServerService.boot();

		let virtualHosts = await this.getVirtualHostSettings();
		this.bootUnsecureHosts(virtualHosts);
		this.bootSecureHosts(virtualHosts);
	}

	bootUnsecureHosts(virtualHosts) {
		const unsecureApp = Express();

		Object.keys(virtualHosts).forEach(k => {
			let e = virtualHosts[k],
				domain = e.domain,
				app = e.app,
				secure = e.secure;
			if (secure) {
				CoreService.info("[SERVER] Append domain " + domain + ":" + UnsecurePort + " (redirect to https)");
				let app = Express();
				app.all('*', (req, res) => {
					CoreService.info("[SERVER] Redirect http -> https: " + req.headers.host + req.url, null, req);
					res.redirect('https://' + req.headers.host + req.url);
				});
				unsecureApp.use(vhost(domain, app));	
			} else {
				CoreService.info("[SERVER] Append domain " + domain + ":" + UnsecurePort);
				unsecureApp.use(vhost(domain, app));	
			}
		});
		unsecureApp.listen(UnsecurePort, () => {
			CoreService.info("[SERVER] Start listening at " + UnsecurePort);	
		});
	}

	bootSecureHosts(virtualHosts) {
		const secureApp = Express();
		Object.keys(virtualHosts).forEach(k => {
			let e = virtualHosts[k],
				domain = e.domain,
				app = e.app,
				secure = e.secure;
			if (secure) {
				CoreService.dbg("[SERVER] Append domain " + domain + ":" + SecurePort);
				secureApp.use(vhost(domain, app));
			} else {
				CoreService.dbg("[SERVER] Append domain " + domain + ":" + SecurePort + " (redirect to http)");
				let app = Express();
				app.all('*', (req, res) => {
					CoreService.dbg("[SERVER] Redirect https -> http: " + req.headers.host + req.url, null, req);
					res.redirect('http://' + req.headers.host + req.url);
				});
				secureApp.use(vhost(domain, app));	
			}
		});

		var secureOpts = {
			SNICallback: (domain, cb) => {
				let context = virtualHosts[domain].context;
				cb(null, context);
			},
			key: fs.readFileSync('/etc/letsencrypt/live/'+Domain+'/privkey.pem', 'utf8').toString(),
			cert: fs.readFileSync('/etc/letsencrypt/live/'+Domain+'/cert.pem', 'utf8').toString(),
			ca: fs.readFileSync('/etc/letsencrypt/live/'+Domain+'/chain.pem', 'utf8').toString()
		};
		let httpsServer = https.createServer(secureOpts, secureApp);
		httpsServer.listen(SecurePort, () => {
			CoreService.info("[SERVER] Start listening at " + SecurePort + " (https)");
		});
	}

	applyAppCommonSettings(app) {
		AjaxServicesLoaderService.registerAjaxServices(app);
	}

	async getVirtualHostSettings() {
		let virtualHosts = {};

		let landingManagerApp = new LandingManagerApp();
		let actualLandingManagerApp = await landingManagerApp.boot();
		this.applyAppCommonSettings(actualLandingManagerApp);
		
		virtualHosts[Domain] = {
			domain: Domain,
			app: actualLandingManagerApp,
			secure: true,
			context: tls.createSecureContext({
				key: fs.readFileSync('/etc/letsencrypt/live/'+Domain+'/privkey.pem', 'utf8').toString(),
				cert: fs.readFileSync('/etc/letsencrypt/live/'+Domain+'/cert.pem', 'utf8').toString(),
				ca: fs.readFileSync('/etc/letsencrypt/live/'+Domain+'/chain.pem', 'utf8').toString()
			})
		};

		let siteApp = new SiteApp();
		let actualSiteApp = await siteApp.boot();
		this.applyAppCommonSettings(actualSiteApp);

		let allowedBrandDomainsCount = AllowedBrandDomains.length;
		for (var i = 0; i < allowedBrandDomainsCount; ++i) {
			let domain = AllowedBrandDomains[i];
			virtualHosts[domain] = {
				domain: "*."+domain,
				app: actualSiteApp,
				secure: false
			};
		}
		
		return virtualHosts;
	}
}

let server = new Server();

server.boot();
