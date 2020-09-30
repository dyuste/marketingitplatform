import BaseApp from './BaseApp';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

class BackofficeApp extends Component {
	constructor(props) {
		super(props);
		this.buildLogLine = this.buildLogLine.bind(this);
	}

	render() {
		return <BaseApp navActiveItem="backoffice">
				<div className="log-view">
					<h3>{this.getLogTitle()}</h3>
					<div className="code-area">
						{this.getLogContent()}
					</div>
				</div>
			</BaseApp>;
	}

	getLogContent() {
		return this.getLogFields()
			.map(this.buildLogLine);
	}

	getLogFields() {
		let fields = [];
		let fieldArray = this.getLogContentRaw()
			.split(/(\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z); ([^;]+); ([^;]+); ([^;]+); (.+)/);
		let fieldArrayLen = fieldArray.length;
		var i = 0;
		while (i <= fieldArrayLen - 5) {
			let ts = this.parseTimeStamp(fieldArray[i]);
			if (!ts) { ++i; continue; }
			let req = this.parseRequest(fieldArray[i+1]);
			if (!req) { ++i; continue; }
			let sess = this.parseSession(fieldArray[i+2]);
			if (!sess) { ++i; continue; }
			let usr = this.parseUser(fieldArray[i+3]);
			if (!usr) { ++i; continue; }
			let msg = this.parseMessage(fieldArray[i+4]);
			if (!msg) { ++i; continue; }
			fields.push({ts, req, sess, usr, msg});
			i += 5;
		}
		return fields;
	}

	parseTimeStamp(tsStr) {
		try {
			let ts = moment(tsStr);
			return ts.isValid() ? ts : null;
		} catch (e) {
			return null;
		}
	}

	parseRequest(reqStr) {
		if (reqStr != "noorigin") {
			let req = reqStr.match(/([^@]+)@([^:]+):(.*)/);
			return (req && req.length == 4)
				? {ip: req[1], method: req[2], url: req[3]}
				: null;
		} else
			return {none: true};
	}

	parseSession(sessStr) {
		return sessStr != "nosession" ? sessStr : {none: true};
	}

	parseUser(userStr) {
		if (userStr != "unknown") {
			return userStr[0] == "u"
				? userStr.substring(1)
				: null; 
		} else
			return {none: true};
	}

	parseMessage(msgStr) {
		return msgStr ? msgStr : null;
	}

	buildLogLine(field, i) {
		let tsElem = <span className="date">
				<span className="date">{field.ts.format("YYYY-MM-DD")}</span>
				<span className="time">{field.ts.format("hh:mm:ss.SS")}</span>
			</span>;
		let reqElem = field.req.none 
			? <span className="req none">none</span>
			: <span className="req">
				<span className="ip">{field.req.ip}</span>
				<span className={"method " + field.req.method}>{field.req.method}</span>
				<span className="url">{field.req.url}</span>
			</span>;
		let sessElem = field.sess.none
			? <span className="sess none">none</span>
			: <span className="sess">{field.sess}</span>;
		let userElem = field.usr.none
			? <span className="usr none">none</span>
			: <span className="usr">User {field.usr}</span>;
		let msgElem = <div className="msg">{field.msg.split("\\n").map((e, i) => <pre key={i}>{e}<br/></pre>)}</div>;
		return <div className="field" key={i}>
				{tsElem}
				{reqElem}
				{sessElem}
				{userElem}
				{msgElem}
			</div>;
	}

	getLogTitle() {
		return this.props.action == "info"
			? "/var/log/mip_server.info"
			: "/var/log/mip_server.error";
	}

	getLogContentRaw() {
		return this.props.action == "info"
			? this.props.logContent.info || null
			: this.props.logContent.error || null;
	}
}

BackofficeApp.propTypes = {
	logContent: PropTypes.object,
	action: PropTypes.string
}

const mapStateToProps = (state, ownProps) => ({
	logContent: state.logContent,
	action: state.action
});


export default connect(  
	mapStateToProps
)(BackofficeApp);

