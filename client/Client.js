require("babel-polyfill")

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import RouterApp from 'shared/components/app/routerApp/RouterApp'
import SpaReducer from 'shared/components/app/routerApp/SpaReducer'
import combineReducers from 'shared/reducers/combineReducers'
import Aviator from 'aviator'
import User from 'shared/entities/common/User'

class Client {
	constructor(configurer) {
		this.configurer = configurer;
	}

	boot() {
		const preloadedState = window.__PRELOADED_STATE__;	
		if (preloadedState.user) {
			preloadedState.user = User.import(preloadedState.user);
		}
		let defaultReducer = this.configurer.getStateReducer();
		let reducer = combineReducers({
			spaAppAction: SpaReducer,
			'*': defaultReducer 
		});
		const store = createStore(
			reducer,
			preloadedState,
			applyMiddleware(thunk)
		);
		
		delete window.__PRELOADED_STATE__;

		var apps, index;
		if (this.configurer.getSpaAppComponentSet) {
			apps = this.configurer.getSpaAppComponentSet();
			index = this.configurer.environment.binding.action;
		} else {
			apps = {
				index: {
					app: this.configurer.getAppComponent(),
					route: this.configurer.environment.binding.http_all_route
				}
			};
			index = 'index';
		}

		const render = () => ReactDOM.hydrate(
			<Provider store={store}>
				<RouterApp
					appsActionMap={apps}
					action={index}
				/>
			</Provider>,
			document.getElementById('root')
		);
		
		render();
		store.subscribe(render);

		let routes = {};
		let handlers = {};
		Object.keys(apps).map(action => {
			let app = apps[action];
			routes[app.route] = action;
			handlers[action] = () => { store.dispatch({type: 'SPA_ROUTE_CHANGE', action})};
		});
		Aviator.setRoutes ({

		});
	}
}

module.exports = Client;
