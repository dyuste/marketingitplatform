import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let page = this.props.page;
		let headerInfo = this.props.headerInfo;
		return (
			<section className="header">
				{headerInfo.headerLogo_hasImage && headerInfo.headerLogo && <div className="header-logo" style={{backgroundImage: "url("+headerInfo.headerLogo.url+")"}}></div>}
				{headerInfo.hasTitle && <h1>{headerInfo.title}</h1>}
			</section>
		);
	}
}

Header.propTypes = {
    page: PropTypes.object.isRequired,
    headerInfo: PropTypes.object.isRequired
};

