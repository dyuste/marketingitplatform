export default class CoreService {
	static setCookie(name, value, expireDays) {
		let expireDate = new Date();	
		expireDays = expireDays ||  365 * 30;
		expireDate.setDate(expireDate.getDate() + expireDays);
		let expires = "; expires=" + expireDate.toUTCString();
		let path = "; path=/";
		document.cookie = name + "=" + escape(value) + expires + path;
	}

	static getCookie(name, defaultValue) {
		var value = document.cookie;
		let cookieStart = value.indexOf(" " + name + "=");
		if (cookieStart == -1)
			cookieStart = value.indexOf(name + "=");

		if (cookieStart == -1)
			value = defaultValue;
		else {
			cookieStart = value.indexOf("=", cookieStart) + 1;
			let cookieEnd = value.indexOf(";", cookieStart);
			if (cookieEnd == -1)
				cookieEnd = value.length;
			value = unescape(value.substring(cookieStart,cookieEnd));
		}

		return value;
	}
}
