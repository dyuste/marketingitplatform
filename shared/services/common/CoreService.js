import React, { Component } from 'react'

export default class CoreService {
	static formatPrice(amount, currency) {
		return <span className="price">{amount}<span className="currency">€</span></span>;
	}
	static formatPriceMonthly(amount, currency) {
		return <span className="price">
			{amount}
			<span className="currency">€</span>
			<span className="frequency">/ mes</span>
		</span>;
	}
};

module.exports = CoreService;
