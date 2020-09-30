import React from 'react';

export default class Mail {
	constructor(subject, bodyComponent) {
		this.subject = subject;
		this.bodyComponent = bodyComponent;
	}

	getBodyComponent(user) {
		return this.bodyComponent(user);
	}

	getSubject() {
		return this.subject;
	}
}
