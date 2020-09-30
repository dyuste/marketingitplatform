import CoreService from 'shared/services/common/CoreService'

export default class Price {
	constructor(amount, frequency) {
		this.amount = amount;
		this.frequency = frequency || 'monthly';
	}

	getAmount() {
		return this.amount;
	}

	format(currency) {
		return this.frequency == 'monthly'
			? CoreService.formatPriceMonthly(this.amount, currency)
			: CoreService.formatPrice(this.amount, currency);
	}
}
