import BaseApp from './BaseApp'
import React, { Component } from 'react'
import SiteList from 'shared/components/dashboard/siteList/SiteList'

export default class DashoardApp extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <BaseApp navActiveItem="dashboard">
					<SiteList />
			</BaseApp>;
	}
}


