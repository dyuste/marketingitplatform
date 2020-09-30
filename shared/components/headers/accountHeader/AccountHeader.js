import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import './AccountHeader.scss'

class AccountHeader extends Component {
	constructor(props) {
		super(props);
		this.handleMainAction = this.handleMainAction.bind(this);
	}

  render() {
  	let showMainActionButton = this.props.showMainActionButton;
    return (
      <section className={"header" + (this.props.compact ? " compact" : "")  + (showMainActionButton ? " show-main-action" : "")}>
      	{showMainActionButton && <button className="btn-oi" onClick={this.handleMainAction}>
      			<span className="oi oi-menu" aria-hidden="true"></span>
      		</button>
      	}
        <a href="/"><div className="header-home-link">MarketingItPlatform</div></a>
        {this.props.loggedInUser && <div className="header-btn-area">
			<a href="/dashboard/account">
				<div className="header-btn header-btn-icon">
					<span className="oi oi-person mr-2" aria-hidden="true"></span>
				</div>
			</a>
        </div>}
        {!this.props.loggedInUser && <div className="header-btn-area">
          <div className="d-none d-md-block">
            <a href="/account/login"><div className="header-btn">Iniciar sesión</div></a>
            <a href="/account/signup"><div className="header-btn header-btn-cta">Crear una cuenta</div></a>
          </div>
          <div className="d-md-none">
            <a href="/account/login"><span className="oi oi-account-login" aria-hidden="true"></span></a>
          </div>
        </div>}
      </section>
    )
  }

  handleMainAction() {
  	if (this.props.onMainAction) this.props.onMainAction();
  }
}

AccountHeader.propTypes = {
    loggedInUser: PropTypes.object,
    compact: PropTypes.bool,
    showMainActionButton: PropTypes.bool,
    onMainAction: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
    loggedInUser: state.loggedInUser
});

export default connect(  
  mapStateToProps
)(AccountHeader);
