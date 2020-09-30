import XhrService from './XhrService'

export default class PaymentService {
	static async createTransferRequest(amount) {
		return PaymentService.performAction("createTransferRequest", {amount});
	}

	static async getTransactions() {
		return PaymentService.performAction("getTransactions");
	}

	static async getSummary() {
		return PaymentService.performAction("getSummary");
	}

	static async performAction(action, data = {}) {
	    return XhrService.fetch(
	        "/ajax-services/PaymentService/"+action,
	        'post',
	        data);
	}
};

module.exports = PaymentService;
