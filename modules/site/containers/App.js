import 'shared/assets/scss/SiteStyleSetup.scss';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import Page from 'shared/components/sitePage/SitePage.js'
import AssetCollector from 'lib/assetcollector/AssetCollector'
import SiteThemeService from 'shared/services/common/SiteThemeService'

export class App extends Component {
  constructor(props) {
    super(props);
    let theme = SiteThemeService.getTheme(this.props.themeInfo.themeId);
    let cssFile = theme.getCssFile();
    if (cssFile) AssetCollector.addStyleAsset('/'+cssFile);
  }

  render() {
    return <Page />;
  }
}

App.propTypes = {
  themeInfo: PropTypes.object
}

const mapStateToProps = (state, ownProps) => ({
  themeInfo: state.themeInfo
});

const mapDispatchToProps = dispatch => { 
  return { 
  }
}; 

const AppContainer = connect(  
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer; 
