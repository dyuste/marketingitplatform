import BaseApp from './BaseApp';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SiteEditor from 'shared/components/dashboard/siteEditor/SiteEditor';

class EditSiteApp extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <BaseApp navActiveItem={"agency"+this.props.currentSite.id}>
					<SiteEditor />
			</BaseApp>;
	}
}

EditSiteApp.propTypes = {
	currentSite: PropTypes.object
}

const mapStateToProps = (state, ownProps) => ({
	currentSite: state.siteData.currentSite
});


export default connect(  
	mapStateToProps
)(EditSiteApp);


