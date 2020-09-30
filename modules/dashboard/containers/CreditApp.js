import BaseApp from './BaseApp'
import React, { Component } from 'react'
import Credit from 'shared/components/dashboard/payment/Credit.js'

export default function CreditApp(props) {
	return <BaseApp navActiveItem="credit">
				<Credit />
		</BaseApp>;
}
