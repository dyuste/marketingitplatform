import XhrService from './XhrService'

export default class PaymentPlanService {
	static async getCurrentUserActiveProducts() {
		return PaymentPlanService.performAction("getCurrentUserActiveProducts");
	}

	static async getInstallments() {
		return PaymentPlanService.performAction("getInstallments");
	}

	static async performAction(action, data = {}) {
	    return XhrService.fetch(
	        "/ajax-services/PaymentPlanService/"+action,
	        'post',
	        data);
	}
};

module.exports = PaymentPlanService;
