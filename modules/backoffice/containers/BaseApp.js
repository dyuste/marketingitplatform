import 'shared/assets/scss/StyleSetup.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountHeader from 'shared/components/headers/accountHeader/AccountHeader';
import SideBar from 'shared/components/navbar/SideBar';
import moment from 'moment';
import NavigationItems from './Navigation.json';
import './App.scss'

export default class BaseApp extends Component {
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
		return NavigationItems;
	}

	toggleSideBar() {
		this.setState({ ui: { collapsed: !this.state.ui.collapsed }});
	}
};

