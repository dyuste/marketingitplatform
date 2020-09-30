import XhrService from './XhrService'

export default class AccountService {
	static async updateUserInfo(userInfo) {
		return AccountService.performAction("updateUserInfo", {userInfo});
	}

	static async resetPassword(email) {
		return AccountService.performAction("resetPassword", {email});
	}

	static async closeSession() {
		return AccountService.performAction("closeSession", {});
	}

	static async performAction(action, data = {}) {
	    return XhrService.fetch(
	        "/ajax-services/AccountService/"+action,
	        'post',
	        data);
	}
};

module.exports = AccountService;
