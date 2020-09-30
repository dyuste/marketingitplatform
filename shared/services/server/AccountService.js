import DataBaseAdapter from 'lib/database/';
import CryptographyService from 'shared/services/common/CryptographyService';
import MailService from 'shared/services/server/mail/MailService';
import PlatformMailBuilder from 'shared/services/server/mail/builder/PlatformMailBuilder';
import UrlService from 'shared/services/common/UrlService';
import User from 'shared/entities/common/User';
import moment from 'moment';
import CoreService from 'shared/services/server/CoreService';

export default class AccountService {
	static getAjaxServices() {
		return [
			{
				name: "updateUserInfo",
				handler: AccountService.srvUpdateUserInfo,
				permissions: "user"
			},
			{
				name: "resetPassword",
				handler: AccountService.srvResetPassword,
				permissions: "user"
			},
			{
				name: "closeSession",
				handler: AccountService.srvCloseSession,
				permissions: "user"
			}
		];
	}

	static async boot() {
		let dataBaseAdapter = new DataBaseAdapter();

		dataBaseAdapter.query(
			`CREATE TABLE IF NOT EXISTS user (
				  id INT NOT NULL AUTO_INCREMENT,
				  creation_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
				  last_update_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				  name VARCHAR(127) NOT NULL,
				  surname VARCHAR(127) NOT NULL,
				  email VARCHAR(255) NOT NULL,
				  contact_email VARCHAR(255) NOT NULL,
				  password_md5 VARCHAR(127) NOT NULL,
				  reset_password_token VARCHAR(127) DEFAULT NULL,
				  reset_password_expires DATETIME DEFAULT NULL,
				  free_month_end_date DATETIME DEFAULT NULL,
				  PRIMARY KEY (id),
				  UNIQUE (email))
				DEFAULT CHARACTER SET = utf8
				COLLATE = utf8_general_ci;`, []
			);
	}

	static async upgrade(fromVersion, toVersion) {
		let dataBaseAdapter = new DataBaseAdapter();
		if (toVersion == "1.0.0.1") {
			CoreService.rptInfo("[AccountService] Upgrade to version 1.0.0.1");
			dataBaseAdapter.query(
				`ALTER TABLE user  ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user';`, []
				);	
		}
	}

	static async mayGetUser(req) {
		if (req.user) {
			return req.user;
		} else if (req.session && req.session.user) {
			try {
				let user = await AccountService.findUser(req.session.user);
				delete user.passwordMd5;
				req.user = user;
				return user;
			} catch(e) {
				return null;
			}
		}
	}
	
	static async requireLogin (req, res, next) {
		CoreService.dbg("[AccountService] Required html login at " + req.originalUrl, null, req);
		if (req.session && req.session.user) {
			try {
				let user = await AccountService.findUser(req.session.user);
				delete user.passwordMd5;
				req.user = user;
				next();
			} catch(e) {
				CoreService.dbg("[AccountService] User not found, login redirect from html " + req.originalUrl, null, req);
				delete req.user;
				req.session.reset();
				res.redirect('/account/login?redirect=' + encodeURIComponent(req.originalUrl));
			}
		} else {
			CoreService.dbg("[AccountService] Session not found, login redirect from html " + req.originalUrl, null, req);
			res.redirect('/account/login?redirect=' + encodeURIComponent(req.originalUrl));
		}
	};

	static async requireLoginAjax (req, res, next) {
		CoreService.dbg("[AccountService] Required json login at " + req.originalUrl, null, req);
		if (req.session && req.session.user) {
			try {
				let user = await AccountService.findUser(req.session.user);
				delete user.passwordMd5;
				req.user = user;
				next();
			} catch(e) {
				CoreService.dbg("[AccountService] User not found, send 401 from json " + req.originalUrl, null, req);
				delete req.user;
				req.session.reset();
				res.status(401).send('Unauthorized');
			}
		} else {
			CoreService.dbg("[AccountService] Session not found, send 401 from json " + req.originalUrl, null, req);
			res.status(401).send('Unauthorized');
		}
	};

	static async requireAdmin (req, res, next) {
		CoreService.dbg("[AccountService] Required admin at " + req.originalUrl, null, req);
		if (req.user && req.user.admin) 
			next();
		else
			res.status(401).send('Unauthorized');
	};

	static async login(req, email, password) {
		CoreService.dbg("[AccountService] Login: " + email + " (pwd: "+password+")", null, req);
		delete req.user;
		req.session.reset();
		let user = await AccountService.findUser(email);
		let passwordHash = CryptographyService.sha256(email + password);
		if (user.passwordMd5 != passwordHash) {
			throw new Error ("No hemos podido acceder a tu cuenta: contraseña o email incorrectos");
		}

		delete user.passwordMd5;
		req.session.user = user.email;
		req.user = user;
	}

	static async signUp(req, email, password, name, surname) {
		CoreService.rptInfo("[AccountService] SingUp: " + email + " (pwd: "+password+") " + ", " + name + " " + surname, null, req);
		await AccountService.createUser(email, password, name, surname, req);
		await AccountService.login(req, email, password);
	}

	static async findUser(email, silent) {
		let dataBaseAdapter = new DataBaseAdapter();
		let userEntries = await dataBaseAdapter.fetchColumns(
			`SELECT id, email, contact_email, name, surname, password_md5, free_month_end_date, role
				FROM user
				WHERE email=?`, [email]
			);

		if (!userEntries || userEntries.length < 1) {
			if (!silent)
				throw new Error("No hemos encontrado ningún usuario con los datos suministrados");
			return null;
		}

		return AccountService.buildUserFromDbRow(userEntries[0])
	}

	static async getUser(userId) {
		let dataBaseAdapter = new DataBaseAdapter();
		let userEntries = await dataBaseAdapter.fetchColumns(
			`SELECT id, email, contact_email, name, surname, password_md5, free_month_end_date, role
				FROM user
				WHERE id=?`, [userId]
			);
		if (!userEntries || userEntries.length < 1) {
			throw new Error("No hemos encontrado ningún usuario con los datos suministrados");
		}

		return AccountService.buildUserFromDbRow(userEntries[0])
	}

	static buildUserFromDbRow(userEntry) {
		return new User(
			userEntry[0],
			userEntry[1],
			userEntry[2],
			userEntry[3],
			userEntry[4],
			userEntry[5],
			userEntry[6] ? moment(userEntry[6]) : null,
			userEntry[7]);
	}

	static async createUser(email, password, name, surname, req) {
		let errorMessage = "Hemos tenido problemas para crear tu cuenta. Vuelve a intentarlo y si el problema continua contacta con nuestro servicio técnico por favor";
		let passwordHash = CryptographyService.sha256(email + password);

		let dataBaseAdapter = new DataBaseAdapter();
		if (await AccountService.findUser(email, true))
			throw new Error("No hemos podido crear la cuenta: ya existe una cuenta asociada a este email");

		try {
			await dataBaseAdapter.query(
				`INSERT INTO user (email, contact_email, name, surname, password_md5)
				 VALUES (?, ?, ?, ?, ?)`,
				 [email, email, name, surname, passwordHash],
				 req
				);
		} catch(e) {
			throw new Error(errorMessage)
		}
	
		try {
			let user = await AccountService.findUser(email);
			if (user.email != email || user.contactEmail != email || user.name != name || user.surname != surname)
				throw new Error(errorMessage)
			
			MailService.sendPlatformMail(
				[user],
				PlatformMailBuilder.getCreateAccountMail()
			);
		} catch(e) {
			throw new Error(errorMessage)
		}

	}

	static async updateUserPassword(email, password, req) {
		let passwordHash = CryptographyService.sha256(email + password);
		let dataBaseAdapter = new DataBaseAdapter();
		await dataBaseAdapter.query(
			`UPDATE user set password_md5=?, reset_password_token=NULL, reset_password_expires=NULL WHERE email=?`,
			 [passwordHash, email],
			 req
			);
	}

	static async mayStartFreeMonthPeriod(userId, req) {
		let dataBaseAdapter = new DataBaseAdapter();
		await dataBaseAdapter.query(
			`UPDATE user SET free_month_end_date=?
			 WHERE id=? AND free_month_end_date IS NULL;`,
			 [moment().add(1, 'month').format("YYYY-MM-DD 00:00:00"), userId],
			 req
			);
		let user = await AccountService.getUser(userId);
		return user.freeMonthEndDate;
	}

	static async srvUpdateUserInfo(req) {
		let currentUser = req.user;
		let updatedInfo = req.body.userInfo;
		let args = [];
		var querySetElements = [];
		var updateMessage = null;
		if (updatedInfo.name && updatedInfo.name != currentUser.name) {
			querySetElements.push("name=?");
			args.push(updatedInfo.name);
		}
		if (updatedInfo.surname && updatedInfo.surname != currentUser.surname) {
			querySetElements.push("surname=?");
			args.push(updatedInfo.surname);
		}
		if (updatedInfo.contactEmail && updatedInfo.contactEmail != currentUser.contactEmail) {
			querySetElements.push("contact_email=?");
			args.push(updatedInfo.contactEmail);
			updateMessage="Hemos enviado un correo a tu nueva dirección de contacto " + updatedInfo.contactEmail;
		}
		if (querySetElements.length > 0) {
			args.push(currentUser.id);
			let dataBaseAdapter = new DataBaseAdapter();
			await dataBaseAdapter.query(
				`UPDATE user SET ` + querySetElements.join(",") +`
				 WHERE id=?;`,
				 args, req
				);	
		}
		return {message: updateMessage, loggedInUser: await AccountService.getUser(currentUser.id)};
	}

	static async srvResetPassword(req) {
		return AccountService.initResetPassword(req.body.email, req.user, req);
	}

	static async initResetPassword(email, user, req) {
		let hash = CryptographyService.sha256(email + Date.now());
		let dataBaseAdapter = new DataBaseAdapter();
		await dataBaseAdapter.query(
			`UPDATE user SET reset_password_token=?, reset_password_expires=?
			 WHERE id=?;`,
			 [hash, moment().add(1, 'day').format("YYYY-MM-DD 00:00:00"), user.id],
			 req
			);
		
		MailService.sendPlatformMail(
			[user],
			PlatformMailBuilder.getResetPasswordMail(
				UrlService.getAccountResetPasswordUrl(hash)
			)
		);
		
		return {message: "Hemos enviado un correo con las instrucciones para cambiar tu contraseña a tu dirección de contacto " + email};
	}

	static async getUserFromPasswordToken(hash) {
		let dataBaseAdapter = new DataBaseAdapter();
		let userEntries = await dataBaseAdapter.fetchColumns(
			`SELECT id FROM user WHERE reset_password_token=? AND reset_password_expires > NOW();`,
			 [hash]
			);
		return (userEntries && userEntries.length == 1 && userEntries[0][0]) 
			? await AccountService.getUser(userEntries[0][0]) : null;
	}

	static async resetPassword(req, email, password, token) {
		CoreService.rptInfo("[AccountService] resetPassword: " + email + " (pwd: "+password+") ", null, req);
		let user = await AccountService.getUserFromPasswordToken(token);
		if (!user || user.email != email) {
			throw new Error("No hemos podido reestablecer tu contraseña: el token no es válido o ha expirado");
		}
		await AccountService.updateUserPassword(email, password, req);
		await AccountService.login(req, email, password);
	}

	static async srvCloseSession(req) {
		delete req.user;
		req.session.reset();
		return {};
	}

};

module.exports = AccountService;