import BaseApp from './BaseApp'
import React, { Component } from 'react'
import Account from 'shared/components/dashboard/account/Account.js'

export default function AccountApp(props) {
	return <BaseApp navActiveItem="account">
				<Account />
		</BaseApp>;
}
