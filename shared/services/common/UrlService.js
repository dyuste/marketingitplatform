export default class UrlService {
	static getAccountResetPasswordUrl(token) {
		return 'https://marketingitplatform.com/account/reset-password?token='+token;
	}

	static getCreditUrl() {
		return 'https://marketingitplatform.com/dashboard/credit';
	}

	static getPaymentPlanUrl() {
		return 'https://marketingitplatform.com/dashboard/payment-plan';	
	}

	static getDashboardSiteEditorUrl(siteId) {
		return 'https://marketingitplatform.com/dashboard/site/'+siteId;	
	}
}
