import React, { Component } from 'react';

class HiddenMail extends Component {
	constructor(props) {
		super(props);
		this.state = {active: false};
	}
	render() {
		let labelComponent = this.props.label
			? <span>{this.props.label}</span>
			: (
				this.state.active
				? <span>{this.props.user}<code>@</code>{this.props.domain}</span>
				: <span>...<code>@</code>...</span>
			);
		return this.state.active
			? <a href={"mailto:"+this.props.user + "@" + this.props.domain}>
				{labelComponent}
			  </a>
			: <span>{labelComponent}</span>;
	}
	componentDidMount() {
		setTimeout(() => { this.setState({active: true})}, 250);
	}
};

export default class MailService {
	static hiddenMail(emailData, label) {
		return <HiddenMail user={emailData.user} domain={emailData.domain} label={label}/>;
	}
};

