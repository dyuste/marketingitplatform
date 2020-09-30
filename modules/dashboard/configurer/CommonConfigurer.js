import SiteListReducer from 'shared/components/dashboard/siteList/Reducer'
import SiteEditorReducer from 'shared/components/dashboard/siteEditor/Reducer'
import SiteImageGalleryReducer from 'shared/components/images/siteImageGallery/Reducer'
import PaymentPlanReducer from 'shared/components/dashboard/paymentPlan/Reducer'
import PaymentReducer from 'shared/components/dashboard/payment/Reducer'
import AccountReducer from 'shared/components/dashboard/account/Reducer'
import AccountLoggedInUserReducer from 'shared/components/dashboard/account/LoggedInUserReducer'
import CommonUiReducer from 'shared/components/dashboard/common/UiReducer'
import combineReducers from 'shared/reducers/combineReducers'
import mixReducers from 'shared/reducers/mixReducers'
import DashboardApp from '../containers/DashboardApp'
import EditSiteApp from '../containers/EditSiteApp'
import PaymentPlanApp from '../containers/PaymentPlanApp'
import CreditApp from '../containers/CreditApp'
import AccountApp from '../containers/AccountApp'

class CommonConfigurer {
	constructor(environment) {
		this.environment = environment;
	}

	getServiceName() {
		return this.environment.service.service_name;
	}

	getTitle() {
		return "MarketingItPlatform";
	}

	getAppComponent() {
		switch (this.environment.binding.action) {
			case 'editSite':
				return EditSiteApp;
			case 'paymentPlan':
				return PaymentPlan;
			case 'credit':
				return CreditApp;
			case 'account':
				return AccountApp;
			case 'dashboard':
			default:
				return DashboardApp;
		}
	}

	getSpaAppComponentSet() {
		return {
			'dashboard': {
				'route': '/dashboard/',
				'app': DashboardApp
			},
			'editSite': {
				'route': '/dashboard/site/:siteId',
				'app': EditSiteApp
			},
			'paymentPlan': {
				'route': '/payment-plan/',
				'app': PaymentPlanApp	
			},
			'credit': {
				'route': '/credit/',
				'app': CreditApp	
			},
			'account': {
				'route': '/account/',
				'app': AccountApp	
			}
		};
	}

	getStateReducer() {
		const defaultReducer = (state = 0, action) => { return state; };
		switch (this.environment.binding.action) {
			case 'editSite':
				return combineReducers({
					ui: CommonUiReducer,
					loggedInUser: defaultReducer,
					siteData: combineReducers({
						currentSite: mixReducers([SiteImageGalleryReducer, SiteEditorReducer])
					})
				});
			case 'paymentPlan':
				return combineReducers({
					ui: CommonUiReducer,
					loggedInUser: defaultReducer,
					paymentPlan: PaymentPlanReducer,
					payment: PaymentReducer
				});
			case 'credit':
				return combineReducers({
					ui: CommonUiReducer,
					loggedInUser: defaultReducer,
					payment: PaymentReducer
				});
			case 'account': 
				return combineReducers({
					ui: CommonUiReducer,
					account: AccountReducer,
					loggedInUser: AccountLoggedInUserReducer,
				});
			case 'dashboard':
			default:
				return combineReducers({
					ui: CommonUiReducer,
					loggedInUser: defaultReducer,
					siteData: SiteListReducer 
				});
		}
	}
};

module.exports = CommonConfigurer;


		

