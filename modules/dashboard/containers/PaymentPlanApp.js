import BaseApp from './BaseApp'
import React, { Component } from 'react'
import PaymentPlan from 'shared/components/dashboard/paymentPlan/PaymentPlan'

export default function EditSiteApp(props) {
	return <BaseApp navActiveItem="paymentPlan">
				<PaymentPlan />
		</BaseApp>;
}

