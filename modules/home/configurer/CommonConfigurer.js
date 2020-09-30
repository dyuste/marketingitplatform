import IdentityReducer from '../reducers/IdentityReducer'
import RedirectionReducer from '../reducers/RedirectionReducer'
import FormSubmitReducer from 'shared/components/forms/basicForm/Reducer'
import CookiesAcceptedReducer from 'shared/components/cookies/Reducer'
import combineReducers from 'shared/reducers/combineReducers'
import HomeApp from '../containers/HomeApp'
import AccountApp from '../containers/AccountApp'
import ResetPasswordApp from '../containers/ResetPasswordApp'
import TermsAndConditionsApp from '../containers/TermsAndConditionsApp'
import CookiesUsageApp from '../containers/CookiesUsageApp'
import PrivacyApp from '../containers/PrivacyApp'
import ClientsApp from '../containers/ClientsApp'
import SupportApp from '../containers/SupportApp'
import ErrorPageApp from '../containers/ErrorPageApp'

class CommonConfigurer {
	constructor(environment) {
		this.environment = environment;
	}

	getServiceName() {
		return this.environment.service.service_name;
	}

	getTitle() {
		switch (this.environment.binding.action) {
			case "login":
				return "MarketingItPlatform -Iniciar sesión";
			case "signup":
				return "MarketingItPlatform - Crear una cuenta";
			case "reset-password":
				return "MarketingItPlatform - Reestablecer contraseña";
			case "terms-and-conditions":
				return "MarketingItPlatform - Términos y condiciones";
			case "cookies-usage":
				return "MarketingItPlatform - Uso de cookies";
			case "privacy":
				return "MarketingItPlatform - Política de privacidad";
			case "clients":
				return "MarketingItPlatform - Atención al cliente";
			case "support":
				return "MarketingItPlatform - Asistencia técnica";
			case "error":
				return "MarketingItPlatform - No hemos podido mostrar la página";
			default:
				return "MarketingItPlatform";
		}
	}

	getAppComponent() {
		switch (this.environment.binding.action) {
			case "login":
			case "signup":
				return AccountApp;
			case "reset-password":
				return ResetPasswordApp;
			case "terms-and-conditions":
				return TermsAndConditionsApp;
			case "cookies-usage":
				return CookiesUsageApp;
			case "privacy":
				return PrivacyApp;
			case "clients":
				return ClientsApp;
			case "support":
				return SupportApp;
			case "error":
				return ErrorPageApp;
			default:
				return HomeApp;
		}
	}

	getStateReducer() {
		return combineReducers({
			formData: FormSubmitReducer,
			ajax: RedirectionReducer,
			cookiesAccepted: CookiesAcceptedReducer,
			'*': IdentityReducer
		});
	}
};

module.exports = CommonConfigurer;
