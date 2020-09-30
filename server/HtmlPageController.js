import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import combineReducers from 'shared/reducers/combineReducers';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import AssetCollector from 'lib/assetcollector/AssetCollector';
import AccountService from 'shared/services/server/AccountService';
import RouterApp from 'shared/components/app/routerApp/RouterApp';
import SpaReducer from 'shared/components/app/routerApp/SpaReducer';
import CoreService from 'shared/services/server/CoreService';

class HtmlPageController {
	constructor(configurer) {
		this.configurer = configurer;
		this.serviceName = configurer.getServiceName();
	}

	async handleRender(req, res) {
		CoreService.dbg("[SERVER][HtmlPageController] Serve " + this.serviceName + " at " + req.originalUrl, null, req);
		var apps, index;
		if (this.configurer.getSpaAppComponentSet) {
			apps = this.configurer.getSpaAppComponentSet();
			index = this.configurer.environment.binding.action;
		} else {
			apps = {
				index: {
					app: this.configurer.getAppComponent(),
					route: req.originalUrl
				}
			};
			index = 'index';
		}

		let preloadedState = await this.configurer.getPreloadedState(req);
		let user = await AccountService.mayGetUser(req);
		if (user) {
			preloadedState.loggedInUser = user.export();
		}
		preloadedState.spaAppAction = index;

		let nestedReducer = this.configurer.getStateReducer();
		let reducer = combineReducers({
			spaAppAction: SpaReducer,
			'*': nestedReducer 
		});
		const store = createStore(
			reducer,
			preloadedState,
			applyMiddleware(thunk)
		);

		AssetCollector.beginStyleCollection();
		AssetCollector.beginScriptBodyCollection();
		const html = renderToString(
			<Provider store={store}>
				<RouterApp
					appsActionMap={apps}
					action={index}
				/>
			</Provider>
		);
		const finalState = store.getState();
		res.send(this.getPageLayout(html, finalState));
	}

	getGtaScript() {
		let gtaId = this.configurer.getGtaId ? this.configurer.getGtaId() : null;
		return gtaId
			? `		<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=${gtaId}"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());

			gtag('config', '${gtaId}');
		</script>`
			: "";
	}
	
	getPageLayout(html, preloadedState) {
		const styleAssets = AssetCollector.getStyleCollection();
		const scriptBodyAssets = AssetCollector.getScriptBodyCollection();
		const title = this.configurer.getTitle();
		const metas = this.configurer.getMetas();
		const gtaScript = this.getGtaScript();
		return `
<!doctype html>
<html>
	<head>
		${gtaScript}
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	    <meta name="description" content="">
	    <meta name="author" content="">
	    ${
	    	metas.reduce((reducedString, value, i, a) => {
	    		return reducedString + '<meta name="'+value.name+'" content="' + value.content + '">';
	    	}, "")
	    }
		<title>${title}</title>
		${
			styleAssets.reduce((reducedString, value, i, a) => {
					return reducedString + '<link rel="stylesheet" type="text/css" href="' + value + '"/>';
			}, "")
		}
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
		<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
  		<link rel="stylesheet" type="text/css" href="/static/bundle/${this.serviceName}.css">
  		<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
  		<link href="/static/assets/open-iconic/open-iconic-bootstrap.min.css" rel="stylesheet">
	</head>
	<body>
		<div id="root">${html}</div>
		<script>
		window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
		window.__ENVIRONMENT__ = ${JSON.stringify(this.configurer.environment).replace(/</g, '\\u003c')}
		</script>
		<script src="/static/bundle/${this.serviceName}.js"></script>
		${
			scriptBodyAssets.reduce((reducedString, value, i, a) => {
					return reducedString + '<script src="' + value + '"></script>';
			}, "")
		}
	</body>
</html>
		`;
	}
};

export default HtmlPageController;

