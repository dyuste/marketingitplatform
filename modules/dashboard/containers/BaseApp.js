import 'shared/assets/scss/StyleSetup.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UrlService from 'shared/services/common/UrlService';
import AccountHeader from 'shared/components/headers/accountHeader/AccountHeader';
import SideBar from 'shared/components/navbar/SideBar';
import moment from 'moment';
import NavigationItems from './Navigation.json';
import './App.scss'

class BaseApp extends Component {
	constructor(props) {
		super(props);
		if (typeof window != "undefined")
			moment.locale(window.navigator.userLanguage || window.navigator.language);
		this.state = { ui: { collapsed: false }};
		this.toggleSideBar = this.toggleSideBar.bind(this);
	}

	render() {
		return <div className="content-wrapper">
				<AccountHeader 
					compact={true}
					showMainActionButton={true}
					onMainAction={this.toggleSideBar}/>
				<section className={"app" + (this.state.ui.collapsed ? " collapsed" : "")}>
					<section className="sidebar">
						<SideBar items={this.getNavigationItems()} activeItem={this.props.navActiveItem} />
					</section>
					<section className="content">
						{this.props.children}
					</section>
				</section>
			</div>;
	}

	getNavigationItems() {
		let siteItems = [];
		let userSites = this.props.userSites;
		let userSitesLen = userSites.length;
		for (var i = 0; i < userSitesLen; ++i) {
			let id = userSites[i].id;
			siteItems.push({
				"name": "agency" + id,
				"title":userSites[i].name,
				"href": UrlService.getDashboardSiteEditorUrl(id),
				"icon": "dashboard",
				"indent": 1
			})
		}

		let items = NavigationItems.slice();
		if (userSitesLen)
			items.splice(1, 0, ...siteItems);
		
		return items;
	}

	toggleSideBar() {
		this.setState({ ui: { collapsed: !this.state.ui.collapsed }});
	}
}

BaseApp.propTypes = {
	userSites: PropTypes.array
}

const mapStateToProps = (state, ownProps) => ({
	userSites: state.userSites
});


const AppContainer = connect(  
	mapStateToProps
)(BaseApp);

export default AppContainer; 
