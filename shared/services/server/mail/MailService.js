import nodemailer from 'nodemailer';
import h2p from 'html2plaintext';
import React from 'react';
import { renderToString } from 'react-dom/server';
import CoreService from 'shared/services/server/CoreService';

export default class MailService {
	static sendPlatformMail(recipientUsers, mailObject) {
		return MailService.sendMail(recipientUsers,
			'MarketingItPlatform <noreply@marketingitplatform.com>',
			'marketingitplatform.com',
			mailObject);
	}

	static sendMail(recipientUsers, from, host, mailObject) {
		var transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail',
			host: host,
			name: host
		});

		return new Promise((resolve, reject) => {
			let subject = mailObject.getSubject();
			let header = MailService.getHtmlHeader(subject);
			let footer = MailService.getHtmlFooter();
			let recipientUsersLen = recipientUsers.length;
			var waitingForMails = recipientUsersLen;
			for (var i = 0; i < recipientUsersLen; ++i) {
				let user = recipientUsers[i];
				if (user && user.contactEmail) {
					let mailComponent = mailObject.getBodyComponent(user);
					let html = header + renderToString(mailComponent) + footer;
					var mailOptions = {
						from: from,
						to: user.contactEmail,
						subject: subject,
						text: h2p(html),
						html
					};
					
					transporter.sendMail(mailOptions, function(error, info){
						--waitingForMails;
						if (error) {
							CoreService.rptError("MailService::sendMail - Error sending '"+subject+"' to "+ user.contactEmail);
						} else {
							// TODO: Record communication
							CoreService.rptInfo("MailService::sendMail - Send '"+mailObject.subject+"' to "+ user.contactEmail + " with status '" + info.response + "'");
						}
						if (waitingForMails == 0) {
							resolve();
						}
					});
				} else --recipientUsersLen;
			}
		});
	}

	static getHtmlHeader(subject) {
		return `
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
			<title>`+subject+`</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		</head>`;
	}

	static getHtmlFooter() {
		return `
		</html>`;
	}
}
