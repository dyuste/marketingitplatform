import CommonConfigurer from './CommonConfigurer';
import AccountService from 'shared/services/server/AccountService';
import CoreService from 'shared/services/server/CoreService';

class ServerConfigurer extends CommonConfigurer {
	constructor(environment) {
		super(environment)
		this.hasErrorApp = true;
	}

	getMetas() {
		return [
			{name: "title", content: "MarketingItPlatform: soluciones informáticas para marketing"},
			{name: "keywords", content: "marketing informática web landing microsite eventos"},
			{name: "description", content: "MarketingItPlatform se ocupa de tus necesidades informáticas: crea landings y microsites sin conocimientos técnicos. Gestiona inscripciones a eventos y todo tipo de campañas. Tarifas ajustadas y flexibles."},
			{name: "og:title", content: "MarketingItPlatform: soluciones informáticas para marketing"},
			{name: "og:description", content: "MarketingItPlatform se ocupa de tus necesidades informáticas: crea landings y microsites sin conocimientos técnicos. Gestiona inscripciones a eventos y todo tipo de campañas. Tarifas ajustadas y flexibles."}
		];
	}

	getGtaId() {
		return 'UA-130248272-1';
	}
	
	async preAction(req, res, next)
	{
		(this.environment.binding.action != 'reset-passwordAction' 
			&& this.environment.binding.action != 'reset-password' 
			&& this.environment.binding.action != 'terms-and-conditions'
			&& this.environment.binding.action != 'cookies-usage'
			&& this.environment.binding.action != 'privacy'
			&& this.environment.binding.action != 'clients'
			&& this.environment.binding.action != 'support'
			&& this.environment.binding.action != 'error'
			&& await AccountService.mayGetUser(req))
		?	res.redirect('/dashboard/')
		:	next();
	}

	async getPreloadedState(req) {
		let action = this.environment.binding.action;
		let redirectUrl = req.query.redirect;
		let resetPasswordToken = req.query.token;
		switch (action) {
			case 'login':
				return this.getCommonPreLoadedState(
					req,
					action,
					[
						{fieldType: "input", text: "", name:"email", label: "Correo electrónico"},
						{fieldType: "password", text: "", name:"password", label: "Contraseña"},
						{fieldType: "submit", text: "Entrar"}
					],
					redirectUrl
				);
			case 'signup':
				return this.getCommonPreLoadedState(
					req,
					action,
					[
						{fieldType: "input", text: "", name:"name", label: "Nombre"},
						{fieldType: "input", text: "", name:"surname", label: "Apellidos"},
						{fieldType: "input", text: "", name:"email", label: "Correo electrónico"},
						{fieldType: "password", text: "", name:"password", label: "Contraseña"},
						{fieldType: "password", text: "", name:"repeat-password", label: "Repite la contraseña"},
						{fieldType: "submit", text: "Crear cuenta"}
					],
					redirectUrl
				);
			case 'reset-password':
				if (resetPasswordToken) {
					let user = await AccountService.getUserFromPasswordToken(resetPasswordToken);
					if (user) {
						return this.getCommonPreLoadedState(
							req,
							action,
							[
								{fieldType: "input", text: user.email, name:"email", label: "Correo electrónico"},
								{fieldType: "password", text: "", name:"password", label: "Contraseña"},
								{fieldType: "password", text: "", name:"repeat-password", label: "Repite la contraseña"},
								{fieldType: "hidden", text: resetPasswordToken, name:"token"},
								{fieldType: "submit", text: "Reestablecer contraseña"}
							],
							redirectUrl
						);
					}
				}
				// Password token without valid token: prompt for email
				return this.getCommonPreLoadedState(
					req,
					action,
					[
						{fieldType: "input", text: "", name:"email", label: "Correo electrónico"},
						{fieldType: "submit", text: "Reestablecer contraseña"}
					],
					redirectUrl
				);

			// Home
			default:
				return this.getCommonPreLoadedState(req, action);
		}
	}

	getCommonPreLoadedState(req, action, formFields, redirectUrl) {
		return {
			formData: {
				state: {
					loading: false,
					loaded: false
				},
				action: {
					actionType: "ajax",
					endPoint: "/account/"+action+"/action",
					method: "POST"
				},
				fields: formFields
			},
			action: action,
			redirectUrl: redirectUrl,
			ajax: { message: null },
			cookiesAccepted: (req.cookies && req.cookies.cookies_accepted) ? 1 : 0,
			developmentMode: (req.cookies && req.cookies.development) ? 1 : 0,
			environmentData: this.environment.data
		};
	}

	
	static getAutomaticRequiredBindings(binding) {
		return [{
			"type": "json",
			"method": "post",
			"http_all_route": binding.http_all_route + (binding.http_all_route.endsWith("/") ? "action" :"/action"),
			"action": binding.action + "Action"
		}];
	}

	getAjaxHandler() {

		class Handler {
			constructor(environment) {
				this.environment = environment;
			}
			async handle(req) {
				let action = this.environment.binding.action;
				CoreService.info("[mod: home] AjaxHandler - for action " + action);
				if (action.endsWith("Action")) {
					try {
						let relativeAction = action.substring(0, action.indexOf("Action"));
						let requestBody = req.body;
						switch (relativeAction) {
							case "login":
								let loginData = this.getLoginData(requestBody);
								await AccountService.login(
									req, 
									loginData.email, 
									loginData.password
								);
								break;

							case "signup":
								let signUpData = this.getSignUpData(requestBody);
								await AccountService.signUp(
									req, 
									signUpData.email, 
									signUpData.password,
									signUpData.name,
									signUpData.surname
								);
								break;
							case "reset-password":
								let resetPasswordData = this.getResetPasswordData(requestBody);
								if (resetPasswordData.token) {
									await AccountService.resetPassword(
										req, 
										resetPasswordData.email, 
										resetPasswordData.password,
										resetPasswordData.token
									);
								} else {
									let user = await AccountService.findUser(resetPasswordData.email);
									if (!user) {
										return {message: "No hemos encontrado ninguna cuenta asociada a esta dirección de conrreo."}
									}
									return await AccountService.initResetPassword(
										resetPasswordData.email, user, req
									);
								}

						}	
					} catch(e) {
						return {message: e.message};
					}
					
				}
				return {};
			}

			getLoginData(requestBody) {
				let loginData = {
					email: null,
					password: null,
					redirect: null
				};

				var requestFieldsLen = requestBody.length;
				for (var i = 0; i < requestFieldsLen; ++i) {
					let requestField = requestBody[i];
					if (requestField['name'] && requestField['text']) {
						let value = requestField['text'];
						switch (requestField['name']) {
							case 'email':
								loginData['email'] = value;
								break;
							case 'password':
								loginData['password'] = value;
								break;
						}
					}
				}
				
				if (!loginData.email || !loginData.password) {
					throw Error("No hemos podido iniciar sesión: faltan campos requeridos");
				}

				return loginData;
			}

			getSignUpData(requestBody) {
				let loginData = {
					email: null,
					password: null,
					name: null,
					surname: null,
				};
				var repeatPassword = null;
				var requestFieldsLen = requestBody.length;
				for (var i = 0; i < requestFieldsLen; ++i) {
					let requestField = requestBody[i];
					if (requestField['name'] && requestField['text']) {
						let value = requestField['text'];
						switch (requestField['name']) {
							case 'email':
								loginData['email'] = value;
								break;
							case 'password':
								loginData['password'] = value;
								break;
							case 'name':
								loginData['name'] = value;
								break;
							case 'surname':
								loginData['surname'] = value;
								break;
							case 'repeat-password':
								repeatPassword = value;
						}
					}
				}
				
				if (!loginData.email
					|| !loginData.password
					|| !loginData.name
					|| !loginData.surname
					|| !repeatPassword
					|| repeatPassword != loginData.password) {
					throw Error("No hemos podido crear la cuenta: faltan datos requeridos");
				}

				return loginData;
			}

			getResetPasswordData(requestBody) {
				let data = {
					email: null,
					password: null,
					token: null
				};
				var repeatPassword = null;
				var requestFieldsLen = requestBody.length;
				for (var i = 0; i < requestFieldsLen; ++i) {
					let requestField = requestBody[i];
					if (requestField['name'] && requestField['text']) {
						let value = requestField['text'];
						switch (requestField['name']) {
							case 'email':
								data['email'] = value;
								break;
							case 'password':
								data['password'] = value;
								break;
							case 'token':
								data['token'] = value;
								break;
							case 'repeat-password':
								repeatPassword = value;
						}
					}
				}
				
				if (repeatPassword != data.password) {
					throw Error("No hemos podido actualizar tu contraseña: las nuevas contraseñas no coinciden");
				}

				return data;
			}
		};
		return new Handler(this.environment);
	}
};

module.exports = ServerConfigurer;
